mod char;
mod word;

use crate::display_list::TextConfig;
use crate::dom;
use word::{Word, WordId};

pub struct TextBuilder {
  items: Vec<Word>,
  document: dom::Document,
}

impl TextBuilder {
  pub fn new(document: &dom::Document) -> Self {
    TextBuilder {
      items: vec![],
      document: document.clone(),
    }
  }

  pub fn add(&mut self, config: TextConfig) -> WordId {}
}
