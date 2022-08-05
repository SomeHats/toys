#[macro_use]
extern crate lazy_static;
extern crate unzip_n;

mod animation;
mod display;
mod display_list;
mod dom;
mod eval;
mod t;
mod utils;

// use itertools::Itertools;
// use serde::{Deserialize, Serialize};
// use std::iter;
use display::{Text, TextBuilder};
use display_list::{Spacing, TextConfig};
use swc_common::{errors, sync::Lrc, FileName, SourceMap};
use swc_ecma_ast as ast;
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax};
use t::DisplayNode;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub async fn tester(element: dom::HtmlElement) -> Result<(), JsValue> {
    utils::set_panic_hook();

    let window = web_sys::window().expect("no global `window` exists");
    let document = window.document().expect("should have a document on window");

    let mut builder = display::TextBuilder::new(&document);
    let l = builder.add(TextConfig::keyword("let", Spacing::SpaceAfter));
    let _thing = builder.add(TextConfig::identifier("thing"));
    let _eq = builder.add(TextConfig::spaced_operator("="));
    let str_open = builder.add(TextConfig::str_quote());
    let str_contents = builder.add(TextConfig::str_body("Hello"));
    let str_close = builder.add(TextConfig::str_quote());
    let add = builder.add(TextConfig::spaced_operator("+"));
    let num = builder.add(TextConfig::literal("1234"));
    let _semi = builder.add(TextConfig::punctuation(";", Spacing::BreakAfter));
    let _extra = builder.add(TextConfig::identifier("hiiiiii"));
    let mut text: display::Text = builder.into();

    element.append_child(text.get_container_element())?;

    text.replace_word_config(&l, TextConfig::keyword("LET", Spacing::SpaceAfter));
    text.apply_pending_ops().await;

    // to string:
    text.replace_word_config(&num, TextConfig::str_body("1234"));
    let quo = text.insert_word_before(&num, TextConfig::str_quote());
    text.insert_word_after(&num, TextConfig::str_quote());
    // text.apply_pending_ops().await;

    // concat:
    text.remove_word(add);
    text.remove_word(str_close);
    text.remove_word(quo);
    text.insert_word_after_instant_at_end(&str_open, TextConfig::str_body("Hello1234"));
    text.remove_word_instant_at_end(str_contents);
    text.remove_word_instant_at_end(num);
    text.apply_pending_ops().await;

    Ok(())
}

#[wasm_bindgen]
pub async fn start(source: String, element: web_sys::HtmlElement) -> Result<(), JsValue> {
    utils::set_panic_hook();

    let window = web_sys::window().expect("no global `window` exists");
    let document = window.document().expect("should have a document on window");

    let script = parse(source);
    // utils::log_value(&script);
    // log!("{}", script_to_range(&script));
    // log!("bees {:#?}", script)

    let mut display_list = TextBuilder::new(&document);
    let script = t::Script::from_node(&script, &mut display_list);

    let display_list: Text = display_list.into();
    dom::append_child(&element, display_list.get_container_element());

    eval::eval_script(
        script,
        &mut eval::ExecutionContext::new_with_defaults(display_list),
    )
    .await?;

    Ok(())
}

fn parse(source: String) -> ast::Script {
    let cm: Lrc<SourceMap> = Default::default();
    let handler = errors::Handler::with_emitter_and_flags(
        Box::new(errors::EmitterWriter::new(
            Box::new(utils::ConsoleWriter::new()),
            None,
            false,
            true,
        )),
        Default::default(),
    );

    let fm = cm.new_source_file(FileName::Custom("test.js".into()), source);

    let lexer = Lexer::new(
        // We want to parse ecmascript
        Syntax::Es(Default::default()),
        // JscTarget defaults to es5
        Default::default(),
        StringInput::from(&*fm),
        None,
    );

    let mut parser = Parser::new_from(lexer);

    for e in parser.take_errors() {
        e.into_diagnostic(&handler).emit();
    }

    parser
        .parse_script()
        .map_err(|e| {
            // Unrecoverable fatal error occurred
            e.into_diagnostic(&handler).emit()
        })
        .expect("failed to parse module")
}
