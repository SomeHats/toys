pub const CHAR_WIDTH_PX: usize = 11;
pub const CHAR_HEIGHT_PX: usize = 28;
pub const ANIMATION_DURATION_MS: f64 = 10000.;

lazy_static! {
    pub static ref CHAR_WIDTH_CSS: String = format!("{}px", CHAR_WIDTH_PX);
    pub static ref CHAR_HEIGHT_CSS: String = format!("{}px", CHAR_HEIGHT_PX);
}
