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

    pub fn empty() -> Self {
        Self::new("", Spacing::None, Highlight::Punctuation)
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
        Self::identifier(contents)
    }
    pub fn identifier(contents: &str) -> Self {
        Self::new(contents, Spacing::None, Highlight::Identifier)
    }
    pub fn keyword(contents: &str, spacing: Spacing) -> Self {
        Self::new(contents, spacing, Highlight::Keyword)
    }
    pub fn punctuation(contents: &str, spacing: Spacing) -> Self {
        Self::new(contents, spacing, Highlight::Punctuation)
    }

    /// returns (char_len, spacing)
    pub fn characteristics(&self) -> (usize, Spacing) {
        (self.contents.len(), self.spacing)
    }
}
