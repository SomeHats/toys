#[macro_use]
extern crate lazy_static;

mod animation;
mod display;
mod display_list;
mod dom;
// mod eval;
mod t;
mod utils;

// use itertools::Itertools;
// use serde::{Deserialize, Serialize};
// use std::iter;
use display_list::{DisplayListBuilder, Highlight, Spacing, TextConfig, Transition};
use swc_common::{errors, sync::Lrc, FileName, SourceMap};
use swc_ecma_ast as ast;
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax};
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
    let thing = builder.add(TextConfig::identifier("thing"));
    let eq = builder.add(TextConfig::spaced_operator("="));
    let str_open = builder.add(TextConfig::str_quote());
    let str_contents = builder.add(TextConfig::str_body("Hello"));
    let str_close = builder.add(TextConfig::str_quote());
    let add = builder.add(TextConfig::spaced_operator("+"));
    let num = builder.add(TextConfig::literal("1234"));
    let semi = builder.add(TextConfig::punctuation(";", Spacing::BreakAfter));
    let extra = builder.add(TextConfig::identifier("hiiiiii"));
    let mut text: display::Text = builder.into();

    element.append_child(text.get_container_element());

    text.replace_word_config(thing, TextConfig::str_body("NEW DIFFERENT"));
    text.replace_word_config(add, TextConfig::empty());
    text.apply_pending_ops().await;

    let mut count = 0;
    loop {
        count += 1;
        text.replace_word_config(num, TextConfig::literal(&count.to_string()));
        text.apply_pending_ops().await;
    }

    Ok(())
}

// #[wasm_bindgen]
// pub async fn start(source: String, element: web_sys::HtmlElement) -> Result<(), JsValue> {
//     utils::set_panic_hook();

//     let window = web_sys::window().expect("no global `window` exists");
//     let document = window.document().expect("should have a document on window");

//     let script = parse(source);
//     // utils::log_value(&script);
//     // log!("{}", script_to_range(&script));
//     // log!("bees {:#?}", script)

//     let mut display_list = DisplayListBuilder::new(document.clone());
//     let script: t::Script = display_list.add_node(&script);

//     // let a = display_list.add_text("a", Spacing::SpaceAfter, Highlight::Keyword)?;
//     // let b = display_list.add_text("b", Spacing::SpaceAfter, Highlight::Keyword)?;
//     // let c = display_list.add_text("c", Spacing::SpaceAfter, Highlight::Keyword)?;
//     // let d = display_list.add_text("d", Spacing::SpaceAfter, Highlight::Keyword)?;
//     // let e = display_list.add_text("e", Spacing::SpaceAfter, Highlight::Keyword)?;
//     let display_list = display_list.build();
//     element.append_child(display_list.get_container())?;

//     // display_list
//     //    .animate(|mut animate| {
//     //       let after_c = animate.insert_after(
//     //          Transition::Animated,
//     //          c,
//     //          "after C",
//     //          Spacing::SpaceAfter,
//     //          Highlight::Literal,
//     //       );
//     //       animate.insert_before(
//     //          Transition::Animated,
//     //          c,
//     //          "before C",
//     //          Spacing::SpaceAfter,
//     //          Highlight::Literal,
//     //       );
//     //       animate.insert_before(
//     //          Transition::Animated,
//     //          after_c,
//     //          "before after C",
//     //          Spacing::SpaceAfter,
//     //          Highlight::String,
//     //       );
//     //       animate.insert_after(
//     //          Transition::Animated,
//     //          d,
//     //          ";",
//     //          Spacing::BreakAfter,
//     //          Highlight::Punctuation,
//     //       );
//     //    })
//     //    .await;

//     eval::eval_script(
//         script,
//         &mut eval::ExecutionContext::new_with_defaults(display_list),
//     )
//     .await;

//     Ok(())
// }

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

    let fm = cm.new_source_file(FileName::Custom("test.js".into()), source.clone());

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
