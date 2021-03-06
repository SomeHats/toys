use super::cursor::CursorPosition;
use super::word::{InternalWordId, Word, WordId, WordIdGenerator};
use crate::animation::Animation;
use crate::display_list::{Highlight, Spacing, TextConfig};
use crate::dom;
use itertools::Itertools;
use std::collections::HashMap;
use std::convert::identity;
use unzip_n::unzip_n;

unzip_n!(3);

type TextCharacteristics = (usize, Spacing);

pub struct TextBuilder {
    items: Vec<Word>,
    document: dom::Document,
    id_gen: WordIdGenerator,
}

impl TextBuilder {
    pub fn new(document: &dom::Document) -> Self {
        TextBuilder {
            items: vec![],
            document: document.clone(),
            id_gen: WordIdGenerator::new(),
        }
    }

    pub fn add(&mut self, config: TextConfig) -> WordId {
        let id = self.id_gen.next();
        self.items.push(Word::new(&self.document, config, id));
        id.to_external()
    }
}

pub struct Text {
    words: Vec<Word>,
    positions_by_id: HashMap<InternalWordId, CursorPosition>,
    document: dom::Document,
    id_gen: WordIdGenerator,
    container_el: dom::HtmlElement,
    pending_ops: Vec<TextOp>,
    hidden_region_divider: InternalWordId,
}

impl From<TextBuilder> for Text {
    fn from(mut text_builder: TextBuilder) -> Self {
        let hidden_region_divider =
            InternalWordId::from_external(&text_builder.add(TextConfig::new(
                "// HIDDEN REGION:",
                Spacing::BreakAfter,
                Highlight::Punctuation,
            )));
        let document = text_builder.document;
        let words = text_builder.items;
        let container_el = dom::div(&document)
            .styles(&[("position", "relative")])
            .class_name("bg-gray-100 p-2 rounded")
            .children(words.iter().map(|item| item.get_container_element()))
            .into();

        let mut text = Text {
            container_el,
            positions_by_id: HashMap::new(),
            words,
            document,
            id_gen: text_builder.id_gen,
            pending_ops: Vec::new(),
            hidden_region_divider,
        };

        text.layout()
            .for_each(|(word, _, new_position)| word.update_dom_position_sync(&new_position));

        text
    }
}

impl Text {
    pub fn get_container_element(&self) -> &dom::HtmlElement {
        &self.container_el
    }

    fn word_id_to_idx(&self, word_id: InternalWordId) -> usize {
        self.words
            .iter()
            .enumerate()
            .find(|(_, word)| word.id == word_id)
            .unwrap_or_else(|| panic!("Cannot find word with id {:?}", word_id))
            .0
    }

    fn word_by_id_mut(&mut self, word_id: InternalWordId) -> &mut Word {
        let idx = self.word_id_to_idx(word_id);
        self.words.get_mut(idx).unwrap()
    }
    // fn word_by_id(&self, word_id: InternalWordId) -> &Word {
    //     let idx = self.word_id_to_idx(word_id);
    //     self.words.get(idx).unwrap()
    // }
    fn characteristics_by_idx(
        &self,
        idx: usize,
        temporary_layout_changes: Option<&[TemporaryLayoutChange]>,
    ) -> TextCharacteristics {
        let word = self.words.get(idx).unwrap();

        temporary_layout_changes
            .and_then(|changes| {
                changes.iter().find_map(|change| match change {
                    TemporaryLayoutChange::IgnoreWord(word_id) if *word_id == word.id => {
                        Some((0, Spacing::None))
                    }
                    TemporaryLayoutChange::ReplaceWord(word_id, characteristics)
                        if *word_id == word.id =>
                    {
                        Some(*characteristics)
                    }
                    _ => None,
                })
            })
            .unwrap_or_else(|| word.characteristics())
    }

    fn layout<'a>(&'a mut self) -> impl Iterator<Item = LayoutChange<'a>> + 'a {
        crate::log!("RUN LAYOUT");
        let positions_by_id = &mut self.positions_by_id;
        self.words
            .iter_mut()
            .scan(CursorPosition::new(0, 0), |position, word| {
                let (char_len, spacing) = word.characteristics();
                position.inc_spacing_before(spacing);
                let word_position = position.clone();

                position.inc_columns(char_len);
                position.inc_spacing_after(spacing);

                Some((word, word_position))
            })
            .filter_map(move |(word, new_position)| {
                let old_position = positions_by_id.get(&word.id).cloned();
                let should_update = old_position.as_ref().map_or(true, |p| *p != new_position);
                if should_update {
                    positions_by_id.insert(word.id, new_position.clone());
                    crate::log!(
                        "Updated position of {:?} from {:?} to {:?}",
                        word.id,
                        old_position,
                        new_position
                    );
                    Some((word, old_position, new_position))
                } else {
                    None
                }
            })
    }

    fn add_pending_op(&mut self, new_op: TextOp) {
        let mut idx_to_remove = None;
        let mut op_to_insert = Some(new_op);
        for (idx, old_op) in self.pending_ops.iter_mut().enumerate() {
            op_to_insert = match op_to_insert {
                Some(new_op) => match coalesce_text_ops(old_op, new_op) {
                    CoalesceResult::Keep(new_op) => Some(new_op),
                    CoalesceResult::Replace(new_op) => {
                        *old_op = new_op;
                        None
                    }
                    CoalesceResult::None => {
                        idx_to_remove = Some(idx);
                        None
                    }
                },
                None => {
                    break;
                }
            }
        }
        if let Some(idx_to_remove) = idx_to_remove {
            self.pending_ops.swap_remove(idx_to_remove);
        }
        if let Some(op_to_insert) = op_to_insert {
            self.pending_ops.push(op_to_insert);
        }
    }

    pub fn replace<T, F>(&mut self, words_to_remove: Vec<WordId>, new_words: F) -> T
    where
        F: Fn(&mut InnerTextBuilder) -> T,
    {
        let words_to_remove = words_to_remove
            .into_iter()
            .map(|word_id| InternalWordId::from_external(&word_id))
            .collect::<Vec<_>>();

        let are_all_words_adjacent = words_to_remove
            .iter()
            .map(|word_id| self.word_id_to_idx(*word_id))
            .sorted()
            .tuple_windows::<(_, _)>()
            .all(|(prev_idx, next_idx)| prev_idx + 1 == next_idx);

        assert!(are_all_words_adjacent, "All words must be adjacent");

        let mut builder = InnerTextBuilder {
            items: vec![],
            id_gen: &mut self.id_gen,
        };
        let result = new_words(&mut builder);

        let to_insert = builder
            .items
            .into_iter()
            .scan(
                (
                    true,
                    *words_to_remove
                        .get(0)
                        .expect("Must have at least one word to remove"),
                ),
                |(is_before, target_id), (new_word_id, config)| {
                    let insert = InsertWord {
                        target_id: *target_id,
                        is_before: *is_before,
                        new_word_id,
                        config,
                    };
                    *target_id = new_word_id;
                    *is_before = false;
                    Some(insert)
                },
            )
            .collect::<Vec<_>>();

        self.add_pending_op(TextOp::ReplaceRange(words_to_remove, to_insert));

        result
    }
    pub fn replace_word_config(&mut self, target_id: &WordId, new_config: TextConfig) {
        self.add_pending_op(TextOp::ReplaceWord(
            InternalWordId::from_external(target_id),
            new_config,
        ))
    }
    pub fn remove_word(&mut self, target_id: WordId) {
        self.add_pending_op(TextOp::RemoveWord(InternalWordId::from_external(
            &target_id,
        )))
    }
    pub fn remove_word_instant_at_end(&mut self, target_id: WordId) {
        self.add_pending_op(TextOp::InstantAtEnd(InstantTextOp::Remove(
            InternalWordId::from_external(&target_id),
        )))
    }
    pub fn insert_word_before(&mut self, target_id: &WordId, config: TextConfig) -> WordId {
        let new_word_id = self.id_gen.next();
        self.add_pending_op(TextOp::InsertWord(InsertWord {
            target_id: InternalWordId::from_external(target_id),
            new_word_id,
            config,
            is_before: true,
        }));
        new_word_id.to_external()
    }
    pub fn insert_word_after(&mut self, target_id: &WordId, config: TextConfig) -> WordId {
        let new_word_id = self.id_gen.next();
        self.add_pending_op(TextOp::InsertWord(InsertWord {
            target_id: InternalWordId::from_external(target_id),
            new_word_id,
            config,
            is_before: false,
        }));
        new_word_id.to_external()
    }
    pub fn insert_word_after_instant_at_end(
        &mut self,
        target_id: &WordId,
        config: TextConfig,
    ) -> WordId {
        let new_word_id = self.id_gen.next();
        self.add_pending_op(TextOp::InstantAtEnd(InstantTextOp::Insert(InsertWord {
            target_id: InternalWordId::from_external(target_id),
            new_word_id,
            config,
            is_before: false,
        })));
        new_word_id.to_external()
    }
    // pub fn replace(&mut self, words_to_replace: Vec<WordId>)
    pub fn add_hidden(&mut self, config: TextConfig) -> WordId {
        let new_id = self.id_gen.next();
        self.apply_insert_word(
            InsertWord {
                target_id: self.hidden_region_divider,
                new_word_id: new_id,
                config,
                is_before: false,
            },
            None,
        );
        new_id.to_external()
    }

    pub async fn apply_pending_ops(&mut self) {
        crate::log!("=== apply_pending_ops");
        let pending_ops = std::mem::take(&mut self.pending_ops);
        // if pending_ops.is_empty() {
        //     return;
        // }

        let (animations, finalization_ops): (Vec<_>, Vec<_>) = pending_ops
            .into_iter()
            .scan(
                Vec::<TemporaryLayoutChange>::new(),
                |temporary_layout_changes, op| {
                    let (animation, finalization_op, temporary_layout_change) =
                        self.apply_op(op, temporary_layout_changes);
                    if let Some(temporary_layout_change) = temporary_layout_change {
                        temporary_layout_changes.push(temporary_layout_change);
                    }
                    Some((animation, finalization_op))
                },
            )
            .unzip();

        Animation::concurrent(
            animations
                .into_iter()
                .chain(self.layout().map(|(word, old_position, new_position)| {
                    let change_animation = old_position.map(|old_position| {
                        word.animate_update_dom_position(&old_position, &new_position)
                    });

                    if change_animation.is_none() {
                        word.update_dom_position_sync(&new_position);
                    }

                    change_animation
                }))
                .filter_map(identity)
                .collect(),
        )
        .play()
        .await;

        finalization_ops
            .into_iter()
            .filter_map(identity)
            .for_each(|op| self.apply_instant_op(op));

        self.layout()
            .for_each(|(word, _, new_position)| word.update_dom_position_sync(&new_position))
    }

    fn apply_op(
        &mut self,
        op: TextOp,
        temporary_layout_changes: &[TemporaryLayoutChange],
    ) -> (
        Option<Animation>,
        Option<InstantTextOp>,
        Option<TemporaryLayoutChange>,
    ) {
        match op {
            TextOp::ReplaceRange(_to_remove, _to_insert) => {
                // let len_to_remove = calculate_column_len(
                //     to_remove
                //         .iter()
                //         .map(|id| self.word_by_id(*id).characteristics()),
                // );
                // let len_to_insert = calculate_column_len(
                //     to_insert
                //         .iter()
                //         .map(|insert| insert.config.characteristics()),
                // );

                // crate::dbg!(
                //     len_to_remove,
                //     len_to_insert,
                //     to_remove
                //         .iter()
                //         .map(|w| self.word_by_id(*w).characteristics())
                //         .collect_vec()
                // );

                // TODO:
                // - get total length of to_remove
                // - get total length of to_insert
                // - calculate relative scaling
                // - animate rescale of existing and inserts
                todo!();

                fn _calculate_column_len<T: Iterator<Item = TextCharacteristics>>(
                    mut iter: T,
                ) -> usize {
                    if let Some((first_len, first_spacing)) = iter.next() {
                        let accumulated_position = iter
                            .fold(
                                (CursorPosition::new(0, first_len), first_spacing),
                                |(mut position, last_spacing), (len, spacing)| {
                                    position.inc_spacing_after(last_spacing);
                                    position.inc_spacing_before(spacing);
                                    position.inc_columns(len);
                                    (position, spacing)
                                },
                            )
                            .0;

                        assert!(
                            accumulated_position.line() == 0,
                            "replace cannot involve words with line-break spacing"
                        );
                        accumulated_position.column()
                    } else {
                        0
                    }
                    // let accumulated_position =
                    //     iter.tuple_windows::<(_, _)>().enumerate().fold(
                    //         CursorPosition::new(0, 0),
                    //         |mut position,
                    //          (
                    //             idx,
                    //             ((prev_columns, prev_spacing), (next_columns, next_spacing)),
                    //         )| {
                    //             if idx == 0 {
                    //                 position.inc_columns(prev_columns);
                    //             }
                    //             position.inc_spacing_after(prev_spacing);
                    //             position.inc_spacing_before(next_spacing);
                    //             position.inc_columns(next_columns);
                    //             position
                    //         },
                    //     );

                    // assert!(
                    //     accumulated_position.line() == 0,
                    //     "replace cannot involve words with line-break spacing"
                    // );
                    // accumulated_position.column()
                }
            }
            TextOp::ReplaceWord(target_id, new_config) => {
                let target = self.word_by_id_mut(target_id);
                let (animation, old_content_el, old_config) =
                    target.animate_replace_config(new_config);
                let (char_len, spacing) = old_config.characteristics();
                (
                    Some(animation),
                    Some(InstantTextOp::FinalizeReplace(old_content_el)),
                    Some(TemporaryLayoutChange::ReplaceWord(
                        target_id,
                        (char_len, spacing),
                    )),
                )
            }
            TextOp::RemoveWord(target_id) => {
                let target = self.word_by_id_mut(target_id);
                (
                    Some(target.animate_remove()),
                    Some(InstantTextOp::Remove(target_id)),
                    None,
                )
            }
            TextOp::InsertWord(insert) => {
                let inserted_word = self.apply_insert_word(insert, Some(temporary_layout_changes));
                (
                    Some(inserted_word.animate_insert()),
                    None,
                    Some(TemporaryLayoutChange::IgnoreWord(inserted_word.id)),
                )
            }
            TextOp::InstantAtEnd(instant_op) => (None, Some(instant_op), None),
        }
    }

    fn apply_instant_op(&mut self, op: InstantTextOp) {
        match op {
            InstantTextOp::FinalizeReplace(old_content_el) => {
                old_content_el.remove();
            }
            InstantTextOp::Remove(target_id) => {
                let target_idx = self.word_id_to_idx(target_id);
                let target = self.words.remove(target_idx);
                self.positions_by_id.remove(&target_id);
                target.get_container_element().remove();
            }
            InstantTextOp::Insert(insert) => {
                self.apply_insert_word(insert, None);
            }
        }
    }

    fn apply_insert_word(
        &mut self,
        InsertWord {
            target_id,
            new_word_id,
            config,
            is_before,
        }: InsertWord,
        temporary_layout_changes: Option<&[TemporaryLayoutChange]>,
    ) -> &Word {
        let target_idx = self.word_id_to_idx(target_id);
        let target_position = self.positions_by_id.get(&target_id);

        let new_word = Word::new(&self.document, config, new_word_id);
        if let Some(mut new_word_position) = target_position.cloned() {
            if !is_before {
                let (target_char_len, target_spacing) =
                    self.characteristics_by_idx(target_idx, temporary_layout_changes);
                new_word_position.inc_columns(target_char_len);
                new_word_position.inc_spacing_after(target_spacing);
            }
            new_word.update_dom_position_sync(&new_word_position);
            self.positions_by_id.insert(new_word_id, new_word_position);
        }

        dom::append_child(&self.container_el, new_word.get_container_element());

        let new_word_idx = if is_before {
            target_idx
        } else {
            target_idx + 1
        };
        self.words.insert(new_word_idx, new_word);
        self.words.get(new_word_idx).unwrap()
    }
}

struct InsertWord {
    target_id: InternalWordId,
    is_before: bool,
    new_word_id: InternalWordId,
    config: TextConfig,
}

enum TemporaryLayoutChange {
    IgnoreWord(InternalWordId),
    ReplaceWord(InternalWordId, TextCharacteristics),
}

enum TextOp {
    ReplaceRange(Vec<InternalWordId>, Vec<InsertWord>),
    ReplaceWord(InternalWordId, TextConfig),
    RemoveWord(InternalWordId),
    InsertWord(InsertWord),
    InstantAtEnd(InstantTextOp),
}

enum InstantTextOp {
    Remove(InternalWordId),
    Insert(InsertWord),
    FinalizeReplace(dom::HtmlElement),
}

type LayoutChange<'a> = (&'a mut Word, Option<CursorPosition>, CursorPosition);

enum CoalesceResult {
    Keep(TextOp),
    Replace(TextOp),
    None,
}

fn coalesce_text_ops(old: &TextOp, new: TextOp) -> CoalesceResult {
    match (old, new) {
        (TextOp::ReplaceWord(old_id, _), TextOp::ReplaceWord(new_id, config))
            if *old_id == new_id =>
        {
            CoalesceResult::Replace(TextOp::ReplaceWord(new_id, config))
        }
        (TextOp::InsertWord(insert), TextOp::ReplaceWord(new_id, new_config))
            if insert.new_word_id == new_id =>
        {
            CoalesceResult::Replace(TextOp::InsertWord(InsertWord {
                target_id: insert.target_id,
                is_before: insert.is_before,
                new_word_id: insert.new_word_id,
                config: new_config,
            }))
        }
        (TextOp::ReplaceWord(old_id, _), TextOp::RemoveWord(new_id)) if *old_id == new_id => {
            CoalesceResult::Replace(TextOp::RemoveWord(new_id))
        }
        (TextOp::InsertWord(insert), TextOp::RemoveWord(new_id))
            if insert.new_word_id == new_id =>
        {
            CoalesceResult::None
        }
        (_, new) => CoalesceResult::Keep(new),
    }
}

pub struct InnerTextBuilder<'a> {
    items: Vec<(InternalWordId, TextConfig)>,
    id_gen: &'a mut WordIdGenerator,
}
impl<'a> InnerTextBuilder<'a> {
    pub fn add(&mut self, config: TextConfig) -> WordId {
        let new_word_id = self.id_gen.next();
        self.items.push((new_word_id, config));
        new_word_id.to_external()
    }
}
