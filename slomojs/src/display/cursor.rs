use super::constants::{CHAR_HEIGHT_PX, CHAR_WIDTH_PX};
use crate::display_list::Spacing;

/// (line, column)
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CursorPosition(usize, usize);
impl CursorPosition {
    pub fn new(line: usize, column: usize) -> Self {
        CursorPosition(line, column)
    }
    pub fn inc_spacing_before(&mut self, spacing: Spacing) {
        if spacing == Spacing::SpaceAround {
            self.1 += 1
        }
    }

    pub fn inc_columns(&mut self, columns: usize) {
        self.1 += columns
    }

    pub fn inc_spacing_after(&mut self, spacing: Spacing) {
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

    pub fn line(&self) -> usize {
        self.0
    }

    pub fn column(&self) -> usize {
        self.1
    }

    pub fn pixel_coords(&self) -> (f64, f64) {
        (
            (self.column() * CHAR_WIDTH_PX) as f64,
            (self.line() * CHAR_HEIGHT_PX) as f64,
        )
    }
}
