use futures::future;
use serde::Serialize;
use std::convert::identity;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

const CHAR_HEIGHT: usize = 28;
const CHAR_WIDTH: usize = 11;
const ANIMATION_DURATION_MS: f64 = 500.;

#[derive(Clone, Copy)]
pub enum Transition {
  Animated,
  Instant,
  InstantAtEnd,
}

pub enum InsertPosition {
  AtIndex(usize),
  Before(DisplayTextId),
  After(DisplayTextId),
}

#[derive(Debug, PartialEq, Clone, Copy)]
pub enum Highlight {
  Literal,
  String,
  Keyword,
  Operator,
  Punctuation,
  Identifier,
}

impl Highlight {
  pub fn get_class_names(&self) -> &str {
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

#[derive(Debug, PartialEq, Clone, Copy)]
pub enum Spacing {
  None,
  BreakAfter,
  SpaceAfter,
  SpaceAround,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub struct DisplayTextId(usize);

#[derive(Debug)]
struct DisplayTextIdGen(usize);
impl DisplayTextIdGen {
  fn new() -> DisplayTextIdGen {
    DisplayTextIdGen(1)
  }
  fn next(&mut self) -> DisplayTextId {
    self.0 += 1;
    DisplayTextId(self.0)
  }
}

#[derive(Debug, Clone)]
pub struct TextConfig {
  pub spacing: Spacing,
  pub highlight: Highlight,
  pub contents: String,
}
impl TextConfig {
  pub fn new(contents: &str, spacing: Spacing, highlight: Highlight) -> Self {
    Self {
      spacing,
      highlight,
      contents: contents.to_string(),
    }
  }

  pub fn str_quote() -> Self {
    Self::new("\"", Spacing::None, Highlight::String)
  }
  pub fn str_body(contents: &str) -> Self {
    Self::new(contents, Spacing::None, Highlight::String)
  }
  pub fn literal(contents: &str) -> Self {
    Self::new(contents, Spacing::None, Highlight::Literal)
  }
  pub fn spaced_operator(contents: &str) -> Self {
    Self::new(contents, Spacing::SpaceAround, Highlight::Operator)
  }
  pub fn undefined() -> Self {
    Self::literal("undefined")
  }
  pub fn builtin(contents: &str) -> Self {
    Self::new(contents, Spacing::None, Highlight::Identifier)
  }

  /// returns (char_len, spacing)
  fn characteristics(&self) -> (usize, Spacing) {
    (self.contents.len(), self.spacing)
  }
}

#[derive(Debug)]
pub struct DisplayText {
  id: DisplayTextId,
  config: TextConfig,
  position: Position,
  element: web_sys::HtmlElement,
  is_visible: bool,
  next_visibility: bool,
}

impl DisplayText {
  fn new(
    id: DisplayTextId,
    config: TextConfig,
    position: Position,
    document: &web_sys::Document,
    is_visible: bool,
  ) -> Self {
    let element: web_sys::HtmlElement = document.create_element("div").unwrap().dyn_into().unwrap();
    element.set_inner_text(&config.contents);
    element.set_class_name(&format!(
      "font-mono text-lg absolute top-0 left-0 {}",
      config.highlight.get_class_names()
    ));
    element.set_title(&format!("{:?}", id));
    element
      .style()
      .set_property("display", if is_visible { "block" } else { "none" })
      .unwrap();

    let dt = DisplayText {
      id,
      config,
      position,
      element,
      is_visible: is_visible,
      next_visibility: is_visible,
    };

    dt.update_dom_display();
    dt.update_dom_transform();

    dt
  }

  fn update_dom_transform(&self) {
    self
      .element
      .style()
      .set_property("transform", &self.position.to_translate_str())
      .unwrap();
  }

  fn update_dom_display(&self) {
    self
      .element
      .style()
      .set_property("display", if self.is_visible { "block" } else { "none" })
      .unwrap();
  }

  /// returns (char_len, spacing)
  fn effective_characteristics(&self) -> (usize, Spacing) {
    if !self.is_visible || !self.next_visibility {
      return (0, Spacing::None);
    }
    self.config.characteristics()
  }

  fn fade_out(&mut self, transition: Transition) -> web_sys::Animation {
    self.update_visibility(transition, false);
    crate::log!("FADE OUT {:?}", self.id);

    animate(
      &self.element,
      transition,
      Keyframes {
        opacity: Some([1., 0.]),
        transform: None,
      },
    )
  }

  fn fade_in(&mut self, transition: Transition) -> web_sys::Animation {
    self.update_visibility(transition, true);

    crate::log!("FADE IN {:?}", self.id);

    animate(
      &self.element,
      transition,
      Keyframes {
        opacity: Some([0., 1.]),
        transform: None,
      },
    )
  }

  fn commit_visibility(&mut self) {
    if self.is_visible != self.next_visibility {
      crate::log!(
        "Commit visibility {:?}: {} -> {}",
        self.id,
        self.is_visible,
        self.next_visibility
      );
      self.update_visibility(Transition::Instant, self.next_visibility)
    }
  }

  fn update_visibility(&mut self, transition: Transition, next_visiblity: bool) {
    match transition {
      Transition::Animated | Transition::InstantAtEnd => {
        self.next_visibility = next_visiblity;
      }
      Transition::Instant => {
        self.is_visible = next_visiblity;
        self.next_visibility = next_visiblity;
        self.update_dom_display();
      }
    }
  }

  fn set_postition_animated(&mut self, position: Position) -> Option<web_sys::Animation> {
    let old_position = self.position.clone();
    if self.position == position {
      return None;
    }

    self.position = position;
    if !self.is_visible && !self.next_visibility {
      self.update_dom_transform();
      return None;
    }

    crate::log!(
      "UPDATE_POSITION {:?} -> {:?} {:?}",
      old_position,
      self.position,
      self
    );
    Some(animate(
      &self.element,
      Transition::Animated,
      Keyframes {
        opacity: None,
        transform: Some(&self.position.to_translate_str()),
      },
    ))
  }
}

/// (line, column)
#[derive(Debug, Clone, PartialEq)]
struct Position(usize, usize);
impl Position {
  fn inc_spacing_before(&mut self, spacing: Spacing) {
    if spacing == Spacing::SpaceAround {
      self.1 += 1
    }
  }

  fn inc_columns(&mut self, columns: usize) {
    self.1 += columns
  }

  fn inc_spacing_after(&mut self, spacing: Spacing) {
    match spacing {
      Spacing::BreakAfter => {
        self.0 += 1;
        self.1 = 0;
      }
      Spacing::SpaceAfter => self.1 += 1,
      Spacing::SpaceAround => self.1 += 1,
      Spacing::None => (),
    }
  }

  fn to_translate_str(&self) -> String {
    format!(
      "translate({}px, {}px",
      self.1 * CHAR_WIDTH,
      self.0 * CHAR_HEIGHT
    )
  }
}

pub trait DisplayNode<'a, T>
where
  Self: std::marker::Sized,
{
  fn from_node(node: &'a T, builder: &mut DisplayListBuilder) -> Self;
}

#[derive(Debug)]
pub struct DisplayListBuilder {
  id_gen: DisplayTextIdGen,
  items: Vec<DisplayText>,
  position: Position,
  document: web_sys::Document,
  container: web_sys::HtmlElement,
}

impl DisplayListBuilder {
  pub fn new(document: web_sys::Document) -> Self {
    let slomo = Self {
      id_gen: DisplayTextIdGen::new(),
      items: vec![],
      position: Position(0, 0),
      document: document.clone(),
      container: document.create_element("div").unwrap().dyn_into().unwrap(),
    };

    slomo
  }

  fn _add_text(&mut self, config: TextConfig, is_visible: bool) -> DisplayTextId {
    let id = self.id_gen.next();

    let (char_len, spacing) = config.characteristics();
    self.position.inc_spacing_before(spacing);
    let display_text = DisplayText::new(
      id,
      config,
      self.position.clone(),
      &self.document,
      is_visible,
    );

    self.container.append_child(&display_text.element).unwrap();
    self.items.push(display_text);

    self.position.inc_columns(char_len);
    self.position.inc_spacing_after(spacing);

    id
  }

  pub fn add_text(&mut self, config: TextConfig) -> DisplayTextId {
    self._add_text(config, true)
  }

  pub fn add_text_hidden(&mut self, config: TextConfig) -> DisplayTextId {
    self._add_text(config, false)
  }

  pub fn add_node<'a, T: DisplayNode<'a, I>, I>(&mut self, node: &'a I) -> T {
    T::from_node(node, self)
  }

  pub fn build(self) -> DisplayList {
    DisplayList {
      id_gen: self.id_gen,
      items: self.items,
      document: self.document,
      container: self.container,
      is_transaction_in_progress: false,
    }
  }
}

#[derive(Debug)]
pub struct DisplayList {
  id_gen: DisplayTextIdGen,
  items: Vec<DisplayText>,
  document: web_sys::Document,
  container: web_sys::HtmlElement,
  is_transaction_in_progress: bool,
}

impl DisplayList {
  pub fn get_container(&self) -> &web_sys::Element {
    &self.container
  }

  fn to_index(&self, id: DisplayTextId) -> usize {
    self
      .items
      .iter()
      .enumerate()
      .find_map(|(index, item)| if item.id == id { Some(index) } else { None })
      .unwrap_or_else(|| panic!("Cannot find id {:?}", id))
  }

  fn at_index(&self, index: usize) -> &DisplayText {
    &self.items[index]
  }

  fn at_index_mut(&mut self, index: usize) -> &mut DisplayText {
    &mut self.items[index]
  }

  fn iter_indexes_from(&self, start: usize) -> std::ops::Range<usize> {
    start..self.items.len()
  }

  pub async fn animate<F, R>(&mut self, builder: F) -> R
  where
    F: Fn(DisplayListTransaction) -> R,
  {
    assert!(!self.is_transaction_in_progress, "op already in progress");
    self.is_transaction_in_progress = true;
    crate::log!("======= ANIMATE CALL ======");

    let mut items = vec![];
    let result = builder(DisplayListTransaction(self, &mut items));

    items
      .into_iter()
      .map(|anim| Some(anim))
      .chain(self.update_positions_animated())
      .play_all()
      .await;

    crate::log!("======= ANIMATIONS COMPLETE ======");

    self
      .items
      .iter_mut()
      .for_each(|item| item.commit_visibility());

    self.is_transaction_in_progress = false;

    result
  }

  fn update_positions_animated<'a>(
    &'a mut self,
  ) -> impl Iterator<Item = Option<web_sys::Animation>> + 'a {
    self.items.iter_mut().scan(
      Position(0, 0),
      DisplayList::update_char_positions_animated_scanner,
    )
  }

  fn update_char_positions_animated_scanner(
    position: &mut Position,
    item: &mut DisplayText,
  ) -> Option<Option<web_sys::Animation>> {
    let (char_len, spacing) = item.effective_characteristics();

    position.inc_spacing_before(spacing);
    let animation = item.set_postition_animated(position.clone());

    position.inc_columns(char_len);
    position.inc_spacing_after(spacing);

    Some(animation)
  }

  pub fn add_text_hidden(&mut self, config: TextConfig) -> DisplayTextId {
    let id = self.id_gen.next();

    let display_text = DisplayText::new(id, config, Position(0, 0), &self.document, false);

    self.container.append_child(&display_text.element).unwrap();
    self.items.push(display_text);

    id
  }
}

pub struct DisplayListTransaction<'a>(&'a mut DisplayList, &'a mut Vec<web_sys::Animation>);

impl DisplayListTransaction<'_> {
  fn add_animation(&mut self, animation: web_sys::Animation) {
    self.1.push(animation);
  }
  fn display_list(&mut self) -> &mut DisplayList {
    &mut self.0
  }

  pub fn get_config(&self, id: DisplayTextId) -> TextConfig {
    self.0.at_index(self.0.to_index(id)).config.clone()
  }

  pub fn remove_item(&mut self, transition: Transition, id: DisplayTextId) {
    let index = self.0.to_index(id);
    let animation = self.0.at_index_mut(index).fade_out(transition);
    self.add_animation(animation);
  }

  pub fn insert_item(
    &mut self,
    transition: Transition,
    insert_position: InsertPosition,
    text: TextConfig,
  ) -> DisplayTextId {
    let display_list = self.display_list();
    let new_id = display_list.id_gen.next();

    let char_position = match insert_position {
      InsertPosition::After(id) | InsertPosition::Before(id) => display_list
        .at_index(display_list.to_index(id))
        .position
        .clone(),
      InsertPosition::AtIndex(index) => display_list.at_index(index).position.clone(),
    };

    let mut new_item = DisplayText::new(new_id, text, char_position, &display_list.document, true);
    let animation = new_item.fade_in(transition);

    display_list
      .container
      .append_child(&new_item.element)
      .expect("appendChild");

    display_list.items.insert(
      match insert_position {
        InsertPosition::Before(id) => display_list.to_index(id),
        InsertPosition::After(id) => display_list.to_index(id) + 1,
        InsertPosition::AtIndex(index) => index,
      },
      new_item,
    );

    self.add_animation(animation);

    new_id
  }

  pub fn clone_item(
    &mut self,
    transition: Transition,
    position: InsertPosition,
    item_to_clone: DisplayTextId,
  ) -> DisplayTextId {
    let config = self
      .0
      .at_index(self.0.to_index(item_to_clone))
      .config
      .clone();
    self.insert_item(transition, position, config)
  }
}

#[derive(Serialize)]
struct Keyframes<'a> {
  opacity: Option<[f64; 2]>,
  transform: Option<&'a str>,
}

fn animate(
  element: &web_sys::Element,
  transition: Transition,
  keyframes: Keyframes<'_>,
) -> web_sys::Animation {
  let mut options = web_sys::KeyframeEffectOptions::new();
  options.easing("ease-in-out");
  options.fill(web_sys::FillMode::Both);
  let (duration, delay) = match transition {
    Transition::Animated => (ANIMATION_DURATION_MS, 0.),
    Transition::InstantAtEnd => (0., ANIMATION_DURATION_MS),
    Transition::Instant => (0., 0.),
  };
  options.duration(&JsValue::from_f64(duration));
  options.delay(delay);
  let animation = web_sys::Animation::new_with_effect(Some(
    &web_sys::KeyframeEffect::new_with_opt_element_and_keyframes_and_keyframe_effect_options(
      Some(element),
      Some(&JsValue::from_serde(&keyframes).unwrap().dyn_into().unwrap()),
      &options,
    )
    .unwrap(),
  ))
  .unwrap();

  animation
}

trait AnimationsExt: Iterator<Item = Option<web_sys::Animation>> {
  fn play_all(self) -> future::JoinAll<wasm_bindgen_futures::JsFuture>
  where
    Self: Sized,
  {
    crate::utils::log_str("ANIMATION BATCH PLAY");
    future::join_all(self.filter_map(identity).map(|animation| {
      let finish_promise = animation.finished().unwrap();
      animation.play().unwrap();
      wasm_bindgen_futures::JsFuture::from(finish_promise)
    }))
  }
}

impl<I: Iterator<Item = Option<web_sys::Animation>>> AnimationsExt for I {}
