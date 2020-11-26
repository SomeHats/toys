use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

const CHAR_HEIGHT: usize = 28;
const CHAR_WIDTH: usize = 11;

#[derive(Debug, PartialEq, Clone)]
pub enum Highlight {
  Literal,
  String,
  Keyword,
  Operator,
  Punctuation,
  Identifier,
}

impl Highlight {
  fn get_class_names(&self) -> &str {
    match self {
      Highlight::Literal => "text-blue-600",
      Highlight::String => "text-purple-600",
      Highlight::Keyword => "text-teal-600",
      Highlight::Operator => "text-pink-600",
      Highlight::Punctuation => "text-gray-600",
      Highlight::Identifier => "text-gray-700",
    }
  }
}

#[derive(Debug, PartialEq, Clone)]
pub enum Spacing {
  None,
  BreakAfter,
  SpaceAfter,
  SpaceAround,
}

#[derive(Debug)]
pub struct DisplayTextId(usize);

#[derive(Debug)]
pub struct DisplayText {
  id: usize,
  spacing: Spacing,
  highlight: Highlight,
  contents: String,
  line: usize,
  column: usize,
  element: web_sys::HtmlElement,
}

impl DisplayText {
  fn new(
    id: usize,
    spacing: Spacing,
    highlight: Highlight,
    contents: &str,
    line: usize,
    column: usize,
    document: &web_sys::Document,
  ) -> Result<Self, JsValue> {
    let element: web_sys::HtmlElement = document.create_element("div")?.dyn_into()?;
    element.set_inner_text(contents);
    element.set_class_name(&format!(
      "font-mono text-lg absolute top-0 left-0 transition-transform {}",
      highlight.get_class_names()
    ));
    element.style().set_property(
      "transform",
      &format!(
        "translate({}px, {}px",
        column * CHAR_WIDTH,
        line * CHAR_HEIGHT
      ),
    )?;

    Ok(DisplayText {
      id: id,
      spacing: spacing,
      highlight: highlight,
      contents: contents.to_string(),
      line: line,
      column: column,
      element: element,
    })
  }
}

pub trait DisplayNode<'a, T>
where
  Self: std::marker::Sized,
{
  fn from_node(node: &'a T, builder: &mut DisplayListBuilder) -> Result<Self, JsValue>;
}

#[derive(Debug)]
pub struct DisplayListBuilder {
  items: Vec<DisplayText>,
  line: usize,
  column: usize,
  document: web_sys::Document,
  container: web_sys::HtmlElement,
}

impl DisplayListBuilder {
  pub fn new(document: web_sys::Document) -> Result<Self, JsValue> {
    let slomo = Self {
      items: vec![],
      line: 0,
      column: 0,
      document: document.clone(),
      container: document.create_element("div")?.dyn_into()?,
    };

    Ok(slomo)
  }

  pub fn add_text(
    &mut self,
    contents: &str,
    spacing: Spacing,
    highlight: Highlight,
  ) -> Result<DisplayTextId, JsValue> {
    let id = self.items.len();

    if spacing == Spacing::SpaceAround {
      self.column += 1
    }

    let display_text = DisplayText::new(
      id,
      spacing.clone(),
      highlight,
      contents,
      self.line,
      self.column,
      &self.document,
    )?;

    self.container.append_child(&display_text.element)?;
    self.items.push(display_text);
    self.column += contents.len();

    match spacing {
      Spacing::BreakAfter => {
        self.line += 1;
        self.column = 0;
      }
      Spacing::SpaceAfter => self.column += 1,
      Spacing::SpaceAround => self.column += 1,
      Spacing::None => (),
    }

    Ok(DisplayTextId(id))
  }

  pub fn add_node<'a, T: DisplayNode<'a, I>, I>(&mut self, node: &'a I) -> Result<T, JsValue> {
    T::from_node(node, self)
  }

  pub fn build(self) -> DisplayList {
    DisplayList {
      items: self.items,
      document: self.document,
      container: self.container,
    }
  }
}

impl std::fmt::Display for DisplayListBuilder {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    for item in &self.items {
      match &item.spacing {
        Spacing::None => write!(f, "{}", item.contents)?,
        Spacing::SpaceAfter => write!(f, "{} ", item.contents)?,
        Spacing::SpaceAround => write!(f, " {} ", item.contents)?,
        Spacing::BreakAfter => write!(f, "{}\n", item.contents)?,
      }
    }
    Ok(())
  }
}

#[derive(Debug)]
pub struct DisplayList {
  items: Vec<DisplayText>,
  document: web_sys::Document,
  container: web_sys::HtmlElement,
}

impl DisplayList {
  pub fn get_container(&self) -> &web_sys::Element {
    &self.container
  }
}
