use super::super::constants::{CHAR_HEIGHT_CSS, CHAR_WIDTH_CSS};
use crate::dom;

pub struct Char {
  ch: char,
  el: dom::HtmlElement,
}

impl Char {
  pub fn new(document: &dom::Document, ch: char) -> Self {
    let el = dom::div(document)
      .styles(&[
        ("display", "inline-block"),
        ("width", &CHAR_WIDTH_CSS),
        ("height", &CHAR_HEIGHT_CSS),
      ])
      .build();

    Self { ch, el }
  }

  pub fn get_element(&self) -> &dom::HtmlElement {
    &self.el
  }
}
