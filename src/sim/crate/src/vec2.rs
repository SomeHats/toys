use std::ops::{Add, Div, Mul, Sub};

#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Vec2<T: Copy> {
    pub x: T,
    pub y: T,
}
impl<T: Copy> Vec2<T> {
    pub fn length_sq(&self) -> T
    where
        T: Add<T, Output = T> + Mul<T, Output = T>,
    {
        self.x * self.x + self.y * self.y
    }
    pub fn length(&self) -> f32
    where
        T: Into<f32> + Add<T, Output = T> + Mul<T, Output = T>,
    {
        (self.length_sq().into()).sqrt()
    }
    pub fn normalize(&self) -> Vec2<f32>
    where
        T: Into<f32> + Add<T, Output = T> + Mul<T, Output = T>,
    {
        let len = self.length();
        vec2(self.x.into() / len, self.y.into() / len)
    }
}

impl<T: Copy> Vec2<T> {
    pub fn new(x: T, y: T) -> Self {
        Vec2 { x, y }
    }
    pub fn map<U: Copy, F: Fn(T) -> U>(self, f: F) -> Vec2<U> {
        Vec2::new(f(self.x), f(self.y))
    }
}
impl<T: Copy + Add<T, Output = T>> Add<T> for Vec2<T> {
    type Output = Vec2<T>;
    fn add(self, rhs: T) -> Vec2<T> {
        Vec2::new(self.x + rhs, self.y + rhs)
    }
}
impl<T: Copy + Add<T, Output = T>> Add<Vec2<T>> for Vec2<T> {
    type Output = Vec2<T>;
    fn add(self, rhs: Vec2<T>) -> Vec2<T> {
        Vec2::new(self.x + rhs.x, self.y + rhs.y)
    }
}
impl<T: Copy + Sub<T, Output = T>> Sub<T> for Vec2<T> {
    type Output = Vec2<T>;
    fn sub(self, rhs: T) -> Vec2<T> {
        Vec2::new(self.x - rhs, self.y - rhs)
    }
}
impl<T: Copy + Sub<T, Output = T>> Sub<Vec2<T>> for Vec2<T> {
    type Output = Vec2<T>;
    fn sub(self, rhs: Vec2<T>) -> Vec2<T> {
        Vec2::new(self.x - rhs.x, self.y - rhs.y)
    }
}
impl<T: Copy + Mul<T, Output = T>> Mul<T> for Vec2<T> {
    type Output = Vec2<T>;
    fn mul(self, rhs: T) -> Vec2<T> {
        Vec2::new(self.x * rhs, self.y * rhs)
    }
}
impl<T: Copy + Mul<T, Output = T>> Mul<Vec2<T>> for Vec2<T> {
    type Output = Vec2<T>;
    fn mul(self, rhs: Vec2<T>) -> Vec2<T> {
        Vec2::new(self.x * rhs.x, self.y * rhs.y)
    }
}
impl<T: Copy + Div<T, Output = T>> Div<T> for Vec2<T> {
    type Output = Vec2<T>;
    fn div(self, rhs: T) -> Vec2<T> {
        Vec2::new(self.x / rhs, self.y / rhs)
    }
}
impl<T: Copy + Div<T, Output = T>> Div<Vec2<T>> for Vec2<T> {
    type Output = Vec2<T>;
    fn div(self, rhs: Vec2<T>) -> Vec2<T> {
        Vec2::new(self.x / rhs.x, self.y / rhs.y)
    }
}

pub fn vec2<T: Copy>(x: T, y: T) -> Vec2<T> {
    Vec2::new(x, y)
}
