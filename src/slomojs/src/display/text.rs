use super::cursor::CursorPosition;
use super::word::{IntermediateWordOp, Word, WordId, WordIdGenerator, WordOp};
use crate::animation::Animation;
use crate::display_list::TextConfig;
use crate::dom;
use std::collections::HashMap;

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
}

impl From<TextBuilder> for Text {
    fn from(text_builder: TextBuilder) -> Self {
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

    fn word_id_to_idx(&self, word_id: WordId) -> usize {
        self.words
            .iter()
            .enumerate()
            .find(|(idx, word)| word.id == word_id)
            .unwrap_or_else(|| panic!("Cannot find word with id {:?}", word_id))
            .0
    }

    fn word_by_id_mut(&mut self, word_id: WordId) -> &mut Word {
        let idx = self.word_id_to_idx(word_id);
        self.words.get_mut(idx).unwrap()
    }

    fn layout<'a>(&'a mut self) -> impl Iterator<Item = LayoutChange<'a>> + 'a {
        let positions_by_id = &mut self.positions_by_id;
        self.words
            .iter_mut()
            .scan(CursorPosition::new(0, 0), |position, word| {
                let (char_len, spacing) = word.effective_characteristics();
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
                    positions_by_id.insert(word.id, new_position.clone());
                    Some((word, old_position, new_position))
                } else {
                    None
                }
            })
    }

    pub fn replace_word_config(&mut self, target: WordId, new_config: TextConfig) {
        self.pending_ops
            .push(TextOp::WordOp(target, WordOp::ReplaceConfig(new_config)))
    }

    pub async fn apply_pending_ops(&mut self) {
        let pending_ops = std::mem::take(&mut self.pending_ops);
        if pending_ops.is_empty() {
            return;
        }

        let (mut animations, intermediate_ops): (Vec<_>, Vec<_>) =
            pending_ops.into_iter().map(|op| self.begin_op(op)).unzip();

        animations.extend(
            self.layout()
                .filter_map(|(word, old_position, new_position)| {
                    let change_animation = old_position.map(|old_position| {
                        word.update_dom_position_animated(&old_position, &new_position)
                    });

                    if change_animation.is_none() {
                        word.update_dom_position_sync(&new_position);
                    }

                    change_animation
                }),
        );

        Animation::concurrent(animations).play().await;

        intermediate_ops
            .into_iter()
            .for_each(|op| self.finalize_op(op));
    }

    fn begin_op(&mut self, op: TextOp) -> (Animation, IntermediateTextOp) {
        match op {
            TextOp::WordOp(target_id, op) => {
                let (animation, intermediate_op) = self.word_by_id_mut(target_id).begin_op(op);
                (
                    animation,
                    IntermediateTextOp::WordOp(target_id, intermediate_op),
                )
            }
        }
    }

    fn finalize_op(&mut self, op: IntermediateTextOp) {
        match op {
            IntermediateTextOp::WordOp(target_id, op) => {
                self.word_by_id_mut(target_id).finalize_op(op)
            }
        }
    }
}

enum TextOp {
    WordOp(WordId, WordOp),
}
enum IntermediateTextOp {
    WordOp(WordId, IntermediateWordOp),
}

type LayoutChange<'a> = (&'a mut Word, Option<CursorPosition>, CursorPosition);
