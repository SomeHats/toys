use wasm_bindgen::JsCast;
pub use web_sys::{Document, Element, HtmlElement};

fn create_el(document: &Document, name: &str) -> HtmlElement {
    document.create_element(name).unwrap().dyn_into().unwrap()
}

pub fn div(document: &Document) -> DomBuilder {
    DomBuilder {
        el: create_el(document, "div"),
    }
}

pub fn set_styles(element: &HtmlElement, styles: &[(&str, &str)]) {
    styles
        .iter()
        .for_each(|(name, value)| element.style().set_property(name, value).unwrap());
}

pub fn append_child(element: &HtmlElement, child_el: &HtmlElement) {
    element.append_child(child_el).unwrap();
}

pub struct DomBuilder {
    el: HtmlElement,
}
impl DomBuilder {
    pub fn styles(self, styles: &[(&str, &str)]) -> Self {
        set_styles(&self.el, styles);
        self
    }

    pub fn data_attr(self, name: &str, value: &str) -> Self {
        self.el
            .set_attribute(&format!("data-{}", name), value)
            .unwrap();
        self
    }

    pub fn class_name(self, name: &str) -> Self {
        self.el.set_class_name(name);
        self
    }

    pub fn child(self, child_el: &HtmlElement) -> Self {
        self.el.append_child(child_el).unwrap();
        self
    }

    pub fn children<'a, I: Iterator<Item = &'a HtmlElement>>(self, items: I) -> Self {
        items.for_each(|child_el| append_child(&self.el, child_el));
        self
    }

    pub fn children_into<I: Iterator<Item = HtmlElement>>(self, items: I) -> Self {
        items.for_each(|child_el| append_child(&self.el, &child_el));
        self
    }

    pub fn text_content(self, text: &str) -> Self {
        self.el.set_text_content(Some(text));
        self
    }
}
impl Into<HtmlElement> for DomBuilder {
    fn into(self) -> HtmlElement {
        self.el
    }
}
