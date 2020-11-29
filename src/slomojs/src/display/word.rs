use super::constants::{ANIMATION_DURATION_MS, CHAR_HEIGHT_CSS, CHAR_WIDTH_CSS, CHAR_WIDTH_PX};
use super::cursor::CursorPosition;
use crate::animation::Animation;
use crate::display_list::{Spacing, TextConfig};
use crate::dom;

const SHOW_DEBUG: bool = false;

pub struct Word {
    pub id: WordId,
    config: TextConfig,
    container_el: dom::HtmlElement,
    content_el: dom::HtmlElement,
    document: dom::Document,
}

impl Word {
    pub fn new(document: &dom::Document, config: TextConfig, id: WordId) -> Self {
        let content_el = create_content_el(document, &config);
        let container_el = dom::div(document)
            .data_attr("id", &id.0.to_string())
            .styles(&[
                ("display", "block"),
                ("position", "absolute"),
                ("top", "0px"),
                ("left", "0px"),
                ("width", &format!("{}px", text_width_px(&config))),
                ("height", &CHAR_HEIGHT_CSS),
            ])
            .class_name("font-mono text-lg")
            .child(&content_el)
            .into();

        if SHOW_DEBUG {
            dom::append_child(
                &container_el,
                &dom::div(document)
                    .class_name("absolute bg-gray-100 bg-opacity-75 z-10")
                    .styles(&[("font-size", "8px")])
                    .text_content(&format!("{}", id.0))
                    .into(),
            );
        }

        Self {
            id,
            config,
            container_el,
            content_el,
            document: document.clone(),
        }
    }

    pub fn get_container_element(&self) -> &dom::HtmlElement {
        &self.container_el
    }

    pub fn characteristics(&self) -> (usize, Spacing) {
        self.config.characteristics()
    }

    pub fn update_dom_position_sync(&self, position: &CursorPosition) {
        let (x_px, y_px) = position.pixel_coords();
        dom::set_styles(
            &self.container_el,
            &[("transform", &format!("translate({}px, {}px)", x_px, y_px))],
        )
    }

    pub fn animate_update_dom_position(
        &self,
        old_position: &CursorPosition,
        new_position: &CursorPosition,
    ) -> Animation {
        let (old_x, old_y) = old_position.pixel_coords();
        let (new_x, new_y) = new_position.pixel_coords();
        self.update_dom_position_sync(new_position);
        Animation::animate(&self.container_el, ANIMATION_DURATION_MS, |keys| {
            keys.transform_translate_x(old_x, new_x)
                .transform_translate_y(old_y, new_y)
        })
    }

    /// replace config. returns the animation, and the previous content element. it's up to the
    /// caller to remove the element when the animation is done.
    pub fn animate_replace_config(
        &mut self,
        new_config: TextConfig,
    ) -> (Animation, dom::HtmlElement) {
        let old_config = &self.config;
        let new_width = text_width_px(&new_config);
        let old_width = text_width_px(old_config);
        let old_content_el = std::mem::replace(
            &mut self.content_el,
            create_content_el(&self.document, &new_config),
        );
        let new_content_el = &self.content_el;

        dom::append_child(&self.container_el, &new_content_el);
        dom::set_styles(
            &self.container_el,
            &[("width", &format!("{}px", text_width_px(&self.config)))],
        );
        self.config = new_config;

        let animation = Animation::animate(&old_content_el, ANIMATION_DURATION_MS, |keys| {
            keys.transform_scale_x(1., new_width / old_width)
        })
        .and(&new_content_el, ANIMATION_DURATION_MS, |keys| {
            keys.opacity(0., 1.)
                .transform_scale_x(old_width / new_width, 1.)
        });

        (animation, old_content_el)
    }

    pub fn animate_remove(&mut self) -> Animation {
        self.config = TextConfig::empty();
        Animation::animate(&self.content_el, ANIMATION_DURATION_MS, |keys| {
            keys.transform_scale_x(1., 0.).opacity(1., 0.)
        })
    }

    pub fn animate_insert(&self) -> Animation {
        Animation::animate(&self.content_el, ANIMATION_DURATION_MS, |keys| {
            keys.opacity(0., 1.).transform_scale_x(0., 1.)
        })
    }
}

#[derive(PartialEq, Eq, Hash, Debug)]
pub struct WordId(usize);

pub fn clone_word_id(id: &WordId) -> WordId {
    WordId(id.0)
}

pub struct WordIdGenerator {
    next: usize,
}

impl WordIdGenerator {
    pub fn new() -> Self {
        WordIdGenerator { next: 0 }
    }

    pub fn next(&mut self) -> WordId {
        let id = WordId(self.next);
        self.next += 1;
        id
    }
}

fn text_width_px(config: &TextConfig) -> f64 {
    (config.contents.len() * CHAR_WIDTH_PX) as f64
}

fn create_content_el(document: &dom::Document, config: &TextConfig) -> dom::HtmlElement {
    let chars = config
        .contents
        .chars()
        .map(|ch| create_char_el(document, ch));
    let content_el = dom::div(document)
        .styles(&[
            ("display", "block"),
            ("position", "absolute"),
            ("top", "0px"),
            ("left", "0px"),
            ("width", &format!("{}px", text_width_px(config))),
            ("height", &CHAR_HEIGHT_CSS),
            ("transform-origin", "0 0"),
        ])
        .class_name(&format!(
            "bg-gray-100 {}",
            config.highlight.get_class_names()
        ))
        .children_into(chars)
        .into();

    content_el
}

fn create_char_el(document: &dom::Document, ch: char) -> dom::HtmlElement {
    dom::div(document)
        .styles(&[
            ("display", "inline-block"),
            ("width", &CHAR_WIDTH_CSS),
            ("height", &CHAR_HEIGHT_CSS),
            ("vertical-align", "top"),
        ])
        .text_content(&ch.to_string())
        .into()
}
