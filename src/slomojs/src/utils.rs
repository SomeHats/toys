use serde::Serialize;
use wasm_bindgen::prelude::*;

pub fn set_panic_hook() {
  // When the `console_error_panic_hook` feature is enabled, we can call the
  // `set_panic_hook` function at least once during initialization, and then
  // we will get better error messages if our code ever panics.
  //
  // For more details see
  // https://github.com/rustwasm/console_error_panic_hook#readme
  #[cfg(feature = "console_error_panic_hook")]
  console_error_panic_hook::set_once();
}

#[macro_export]
macro_rules! await_option {
  ($exp:expr) => {
    match $exp {
      Some(val) => Some(val.await),
      None => None,
    }
  };
}

#[macro_export]
macro_rules! log {
  ( $( $t:tt )* ) => {
      {crate::utils::log_str(&format!( $( $t )* ));}
  }
}

pub fn log_str(string: &str) {
  web_sys::console::log_1(&JsValue::from_str(string));
}

pub fn log_value<T: Serialize>(value: &T) {
  web_sys::console::log_1(&JsValue::from_serde(&value).unwrap());
}

pub fn log_js_value(value: &JsValue) {
  web_sys::console::log_1(value);
}

pub struct ConsoleWriter {
  buffer: Vec<u8>,
}

impl ConsoleWriter {
  pub fn new() -> ConsoleWriter {
    ConsoleWriter { buffer: vec![] }
  }
}

impl std::io::Write for ConsoleWriter {
  fn write(&mut self, buf: &[u8]) -> std::io::Result<usize> {
    for ch in buf.iter() {
      if *ch == 10 {
        self.flush()?;
      } else {
        self.buffer.push(*ch);
      }
    }
    Ok(buf.len())
  }

  fn flush(&mut self) -> std::io::Result<()> {
    {
      let string = std::str::from_utf8(&self.buffer).unwrap();
      log!("{}", string);
    }
    self.buffer.clear();
    Ok(())
  }
}
