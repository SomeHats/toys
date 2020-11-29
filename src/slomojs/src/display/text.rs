use super::cursor::CursorPosition;
use super::word::{clone_word_id, Word, WordId, WordIdGenerator};
use crate::animation::Animation;
use crate::display_list::{Highlight, Spacing, TextConfig};
use crate::dom;
use std::collections::HashMap;
use std::convert::identity;

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
        self.items
            .push(Word::new(&self.document, config, clone_word_id(&id)));
        id
    }
}

pub struct Text {
    words: Vec<Word>,
    positions_by_id: HashMap<WordId, CursorPosition>,
    document: dom::Document,
    id_gen: WordIdGenerator,
    container_el: dom::HtmlElement,
    pending_ops: Vec<TextOp>,
    hidden_region_divider: WordId,
    words_pending_insert: Vec<WordId>,
}

impl From<TextBuilder> for Text {
    fn from(mut text_builder: TextBuilder) -> Self {
        let hidden_region_divider = text_builder.add(TextConfig::new(
            "// HIDDEN REGION:",
            Spacing::BreakAfter,
            Highlight::Punctuation,
        ));
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
            words_pending_insert: vec![],
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

    fn word_id_to_idx(&self, word_id: &WordId) -> usize {
        self.words
            .iter()
            .enumerate()
            .find(|(idx, word)| word.id == clone_word_id(word_id))
            .unwrap_or_else(|| panic!("Cannot find word with id {:?}", word_id))
            .0
    }

    fn word_by_id_mut(&mut self, word_id: &WordId) -> &mut Word {
        let idx = self.word_id_to_idx(word_id);
        self.words.get_mut(idx).unwrap()
    }
    fn word_by_id(&self, word_id: &WordId) -> &Word {
        let idx = self.word_id_to_idx(word_id);
        self.words.get(idx).unwrap()
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
                let old_position = positions_by_id.get(&word.id).map(|p| p.clone());
                let should_update = old_position.as_ref().map_or(true, |p| *p != new_position);
                if should_update {
                    positions_by_id.insert(clone_word_id(&word.id), new_position.clone());
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
        // let new_pending_ops = Vec::with_capacity(self.pending_ops.capacity() + 1);
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

    pub fn replace_word_config(&mut self, target_id: &WordId, new_config: TextConfig) {
        self.add_pending_op(TextOp::ReplaceWord(clone_word_id(target_id), new_config))
    }
    pub fn remove_word(&mut self, target_id: WordId) {
        self.add_pending_op(TextOp::RemoveWord(target_id))
    }
    pub fn remove_word_instant_at_end(&mut self, target_id: WordId) {
        self.add_pending_op(TextOp::InstantAtEnd(InstantTextOp::RemoveWord(target_id)))
    }
    fn insert_word(
        &mut self,
        is_before: bool,
        instant_at_end: bool,
        target_id: &WordId,
        config: TextConfig,
    ) -> WordId {
        let new_word_id = self.id_gen.next();
        let insert = InsertWord {
            target_id: clone_word_id(target_id),
            new_word_id: clone_word_id(&new_word_id),
            config,
            is_before,
        };
        self.add_pending_op(if instant_at_end {
            TextOp::InstantAtEnd(InstantTextOp::InsertWord(insert))
        } else {
            TextOp::InsertWord(insert)
        });
        new_word_id
    }
    pub fn insert_word_before(&mut self, target_id: &WordId, config: TextConfig) -> WordId {
        self.insert_word(true, false, target_id, config)
    }
    pub fn insert_word_after(&mut self, target_id: &WordId, config: TextConfig) -> WordId {
        self.insert_word(false, false, target_id, config)
    }
    pub fn insert_word_before_instant_at_end(
        &mut self,
        target_id: &WordId,
        config: TextConfig,
    ) -> WordId {
        self.insert_word(true, true, target_id, config)
    }
    pub fn insert_word_after_instant_at_end(
        &mut self,
        target_id: &WordId,
        config: TextConfig,
    ) -> WordId {
        self.insert_word(false, true, target_id, config)
    }
    pub fn add_hidden(&mut self, config: TextConfig) -> WordId {
        let new_id = self.id_gen.next();
        self.apply_insert_word(InsertWord {
            target_id: clone_word_id(&self.hidden_region_divider),
            new_word_id: clone_word_id(&new_id),
            config,
            is_before: false,
        });
        new_id
    }

    pub async fn apply_pending_ops(&mut self) {
        crate::log!("=== apply_pending_ops");
        let pending_ops = std::mem::take(&mut self.pending_ops);
        // if pending_ops.is_empty() {
        //     return;
        // }

        let (animations, finalization_ops): (Vec<_>, Vec<_>) =
            pending_ops.into_iter().map(|op| self.apply_op(op)).unzip();

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

    fn apply_op(&mut self, op: TextOp) -> (Option<Animation>, Option<InstantTextOp>) {
        match op {
            TextOp::ReplaceWord(target_id, new_config) => {
                let target = self.word_by_id_mut(&target_id);
                let (animation, old_content_el) = target.animate_replace_config(new_config);
                (
                    Some(animation),
                    Some(InstantTextOp::FinalizeReplaceWord(old_content_el)),
                )
            }
            TextOp::RemoveWord(target_id) => {
                let target = self.word_by_id_mut(&target_id);
                (
                    Some(target.animate_remove()),
                    Some(InstantTextOp::RemoveWord(target_id)),
                )
            }
            TextOp::InsertWord(insert) => {
                self.words_pending_insert
                    .push(clone_word_id(&insert.new_word_id));
                let inserted_word = self.apply_insert_word(insert);
                (
                    Some(inserted_word.animate_insert()),
                    Some(InstantTextOp::FinalizeInsertWord(clone_word_id(
                        &inserted_word.id,
                    ))),
                )
            }
            TextOp::InstantAtEnd(instant_op) => (None, Some(instant_op)),
        }
    }

    fn apply_instant_op(&mut self, op: InstantTextOp) {
        match op {
            InstantTextOp::FinalizeReplaceWord(old_content_el) => {
                old_content_el.remove();
            }
            InstantTextOp::FinalizeInsertWord(inserted_id) => {
                let index = self
                    .words_pending_insert
                    .iter()
                    .position(|word_id| *word_id == inserted_id)
                    .unwrap();
                self.words_pending_insert.swap_remove(index);
            }
            InstantTextOp::RemoveWord(target_id) => {
                let target_idx = self.word_id_to_idx(&target_id);
                let target = self.words.remove(target_idx);
                self.positions_by_id.remove(&target_id);
                target.get_container_element().remove();
            }
            InstantTextOp::InsertWord(insert) => {
                self.apply_insert_word(insert);
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
    ) -> &Word {
        let target_idx = self.word_id_to_idx(&target_id);
        let target_position = self.positions_by_id.get(&target_id);

        let new_word = Word::new(&self.document, config, clone_word_id(&new_word_id));
        if let Some(mut new_word_position) = target_position.cloned() {
            if !is_before && !self.words_pending_insert.contains(&target_id) {
                let (target_char_len, target_spacing) =
                    self.words.get(target_idx).unwrap().characteristics();
                new_word_position.inc_columns(target_char_len);
                new_word_position.inc_spacing_after(target_spacing);
            }
            new_word.update_dom_position_sync(&new_word_position);
            self.positions_by_id
                .insert(clone_word_id(&new_word_id), new_word_position);
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
    target_id: WordId,
    is_before: bool,
    new_word_id: WordId,
    config: TextConfig,
}

enum TextOp {
    ReplaceWord(WordId, TextConfig),
    RemoveWord(WordId),
    InsertWord(InsertWord),
    InstantAtEnd(InstantTextOp),
}

enum InstantTextOp {
    RemoveWord(WordId),
    InsertWord(InsertWord),
    FinalizeReplaceWord(dom::HtmlElement),
    FinalizeInsertWord(WordId),
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
                target_id: clone_word_id(&insert.target_id),
                is_before: insert.is_before,
                new_word_id: clone_word_id(&insert.new_word_id),
                config: new_config.clone(),
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
