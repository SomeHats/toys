#[macro_use]
extern crate lazy_static;

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

#[wasm_bindgen]
pub async fn start(source: String, element: web_sys::HtmlElement) -> Result<(), JsValue> {
    utils::set_panic_hook();

    let window = web_sys::window().expect("no global `window` exists");
    let document = window.document().expect("should have a document on window");

    let script = parse(source);
    // utils::log_value(&script);
    // log!("{}", script_to_range(&script));
    // log!("bees {:#?}", script)

    let mut display_list = DisplayListBuilder::new(document.clone());
    let script: t::Script = display_list.add_node(&script);

    // let a = display_list.add_text("a", Spacing::SpaceAfter, Highlight::Keyword)?;
    // let b = display_list.add_text("b", Spacing::SpaceAfter, Highlight::Keyword)?;
    // let c = display_list.add_text("c", Spacing::SpaceAfter, Highlight::Keyword)?;
    // let d = display_list.add_text("d", Spacing::SpaceAfter, Highlight::Keyword)?;
    // let e = display_list.add_text("e", Spacing::SpaceAfter, Highlight::Keyword)?;
    let display_list = display_list.build();
    element.append_child(display_list.get_container())?;

    // display_list
    //    .animate(|mut animate| {
    //       let after_c = animate.insert_after(
    //          Transition::Animated,
    //          c,
    //          "after C",
    //          Spacing::SpaceAfter,
    //          Highlight::Literal,
    //       );
    //       animate.insert_before(
    //          Transition::Animated,
    //          c,
    //          "before C",
    //          Spacing::SpaceAfter,
    //          Highlight::Literal,
    //       );
    //       animate.insert_before(
    //          Transition::Animated,
    //          after_c,
    //          "before after C",
    //          Spacing::SpaceAfter,
    //          Highlight::String,
    //       );
    //       animate.insert_after(
    //          Transition::Animated,
    //          d,
    //          ";",
    //          Spacing::BreakAfter,
    //          Highlight::Punctuation,
    //       );
    //    })
    //    .await;

    eval::eval_script(
        script,
        &mut eval::ExecutionContext::new_with_defaults(display_list),
    )
    .await;

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

// fn script_to_range(module: &ast::Script) -> AstRange {
//    AstRange::Range(module.body.iter().map(|x| stmt_to_range(x)).collect())
// }

// fn stmt_to_range(stmt: &ast::Stmt) -> AstRange {
//    AstRange::Range(vec![
//       match stmt {
//          ast::Stmt::Decl(decl) => decl_to_range(decl),
//          ast::Stmt::Expr(expr) => expr_to_range(&expr.expr),
//          other => panic!("Unimplemented statement type: {:?}", other),
//       },
//       AstRange::Text(";".into()),
//       AstRange::Break,
//    ])
// }

// fn decl_to_range(decl: &ast::Decl) -> AstRange {
//    match decl {
//       ast::Decl::Var(var_decl) => AstRange::IndentRange(
//          iter::once(AstRange::Text(var_decl.kind.to_string()))
//             .chain(
//                var_decl
//                   .decls
//                   .iter()
//                   .map(|declarator| match &declarator.init {
//                      Some(init) => AstRange::Range(vec![
//                         AstRange::Space,
//                         pat_to_range(&declarator.name),
//                         AstRange::Space,
//                         AstRange::Text("=".to_string()),
//                         AstRange::Space,
//                         expr_to_range(&init),
//                      ]),
//                      None => AstRange::Range(vec![AstRange::Space, pat_to_range(&declarator.name)]),
//                   })
//                   .interleave(
//                      iter::repeat(AstRange::Range(vec![
//                         AstRange::Text(",".to_string()),
//                         AstRange::Break,
//                      ]))
//                      .take(var_decl.decls.len() - 1),
//                   ),
//             )
//             .collect(),
//       ),
//       other => panic!("Unimplemented declaration type: {:?}", other),
//    }
// }

// fn pat_to_range(pat: &ast::Pat) -> AstRange {
//    match pat {
//       ast::Pat::Ident(ident) => ident_to_range(ident),
//       other => panic!("Unimplemented pattern type: {:?}", other),
//    }
// }

// fn ident_to_range(ident: &ast::Ident) -> AstRange {
//    AstRange::Text(ident.sym.to_string())
// }

// fn expr_to_range(expr: &ast::Expr) -> AstRange {
//    match expr {
//       ast::Expr::Bin(bin) => AstRange::Range(vec![
//          expr_to_range(&bin.left),
//          AstRange::Space,
//          AstRange::Text(bin.op.to_string()),
//          AstRange::Space,
//          expr_to_range(&bin.right),
//       ]),
//       ast::Expr::Ident(ident) => ident_to_range(ident),
//       ast::Expr::Lit(lit) => lit_to_range(lit),
//       ast::Expr::Call(call) => AstRange::Range(vec![
//          expr_or_super_to_range(&call.callee),
//          AstRange::Text("(".into()),
//          AstRange::IndentRange(
//             call
//                .args
//                .iter()
//                .map(|arg| expr_or_spread_to_range(arg))
//                .interleave(
//                   iter::repeat(AstRange::Range(vec![
//                      AstRange::Text(",".to_string()),
//                      AstRange::Break,
//                   ]))
//                   .take(call.args.len() - 1),
//                )
//                .collect(),
//          ),
//          AstRange::Text(")".into()),
//       ]),
//       ast::Expr::Member(member) => {
//          if member.computed {
//             panic!("computed member not supported");
//          }

//          AstRange::Range(vec![
//             expr_or_super_to_range(&member.obj),
//             AstRange::Text(".".into()),
//             expr_to_range(&member.prop),
//          ])
//       }
//       other => panic!("Unimplemented expression type: {:?}", other),
//    }
// }

// fn expr_or_super_to_range(expr_or_super: &ast::ExprOrSuper) -> AstRange {
//    match expr_or_super {
//       ast::ExprOrSuper::Expr(expr) => expr_to_range(expr),
//       ast::ExprOrSuper::Super(_) => AstRange::Text("super".into()),
//    }
// }

// fn expr_or_spread_to_range(expr_or_spread: &ast::ExprOrSpread) -> AstRange {
//    match expr_or_spread.spread {
//       Some(_) => AstRange::Range(vec![
//          AstRange::Text("...".into()),
//          expr_to_range(&expr_or_spread.expr),
//       ]),
//       None => expr_to_range(&expr_or_spread.expr),
//    }
// }

// fn lit_to_range(lit: &ast::Lit) -> AstRange {
//    match lit {
//       ast::Lit::Bool(val) => AstRange::Text(if val.value {
//          "true".to_string()
//       } else {
//          "false".to_string()
//       }),
//       ast::Lit::Null(_) => AstRange::Text("null".to_string()),
//       ast::Lit::Num(val) => AstRange::Text(val.to_string()),
//       ast::Lit::Str(val) => AstRange::Range(vec![
//          AstRange::Text("\"".into()),
//          AstRange::Text(val.value.to_string()),
//          AstRange::Text("\"".into()),
//       ]),
//       other => panic!("Unimplemented lit type: {:?}", other),
//    }
// }

// #[derive(Debug, Clone, Serialize, Deserialize)]
// enum AstRange {
//    Space,
//    Break,
//    Text(String),
//    Range(Vec<AstRange>),
//    IndentRange(Vec<AstRange>),
// }

// impl std::fmt::Display for AstRange {
//    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
//       struct AstRangeFmtState {
//          indent: usize,
//          was_last_output_space: bool,
//       }

//       fn fmt_item(
//          item: &AstRange,
//          f: &mut std::fmt::Formatter<'_>,
//          state: &mut AstRangeFmtState,
//       ) -> std::fmt::Result {
//          match item {
//             AstRange::Space => {
//                if state.was_last_output_space {
//                   Ok(())
//                } else {
//                   state.was_last_output_space = true;
//                   write!(f, " ")
//                }
//             }
//             AstRange::Break => {
//                write!(f, "\n")?;
//                if state.indent > 0 {
//                   write!(f, "{}", iter::repeat("  ").take(state.indent).join(""))?;
//                }
//                state.was_last_output_space = true;
//                Ok(())
//             }
//             AstRange::Text(text) => {
//                state.was_last_output_space = false;
//                write!(f, "{}", text)
//             }
//             AstRange::Range(items) => fmt_items(items, f, state),
//             AstRange::IndentRange(items) => {
//                state.indent += 1;
//                fmt_items(items, f, state)?;
//                state.indent -= 1;
//                Ok(())
//             }
//          }
//       }

//       fn fmt_items(
//          items: &Vec<AstRange>,
//          f: &mut std::fmt::Formatter<'_>,
//          state: &mut AstRangeFmtState,
//       ) -> std::fmt::Result {
//          for item in items {
//             fmt_item(item, f, state)?;
//          }
//          Ok(())
//       }

//       fmt_item(
//          self,
//          f,
//          &mut AstRangeFmtState {
//             indent: 0,
//             was_last_output_space: false,
//          },
//       )
//    }
// }
