use super::super::constants::{CHAR_HEIGHT_PX, CHAR_WIDTH_PX};
use super::char::Char;
use crate::display_list::TextConfig;
use crate::dom;

pub struct Word {
  id: WordId,
  chars: Vec<Char>,
  config: TextConfig,
  container_el: dom::HtmlElement,
  content_el: dom::HtmlElement,
}

impl Word {
  fn new(document: &dom::Document, config: TextConfig, id: WordId) -> Self {
    let chars: Vec<Char> = config
      .contents
      .chars()
      .map(|ch| Char::new(document, ch))
      .collect();
    let content_el = dom::div(document)
      .styles(&[
        ("display", "block"),
        ("position", "absolute"),
        ("top", "0px"),
        ("left", "0px"),
      ])
      .class_name(config.highlight.get_class_names())
      .children(chars.iter().map(|ch| ch.get_element()))
      .build();
    let container_el = dom::div(document)
      .styles(&[
        ("display", "block"),
        ("position", "absolute"),
        ("top", "0px"),
        ("left", "0px"),
      ])
      .class_name("font-mono text-lg")
      .child(&content_el)
      .build();

    Self {
      id,
      chars,
      config,
      container_el,
      content_el,
    }
  }

  pub fn set_char_position(&self, line: usize, column: usize) {
    dom::set_styles(
      &self.container_el,
      &[(
        "transform",
        &format!(
          "translate({}px, {}px)",
          column * CHAR_WIDTH_PX,
          line * CHAR_HEIGHT_PX
        ),
      )],
    )
  }
}

#[derive(Copy, Clone)]
pub struct WordId(usize);
