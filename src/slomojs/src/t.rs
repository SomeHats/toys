use paste::paste;
use swc_ecma_ast as ast;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

const CHAR_HEIGHT: usize = 28;
const CHAR_WIDTH: usize = 11;

#[derive(Debug, PartialEq, Clone)]
enum Spacing {
  None,
  BreakAfter,
  SpaceAfter,
  SpaceAround,
}

// impl std::ops::Add for Position {
//   type Output = Self;
//   fn add(self, other: Self) -> Self {
//     if other.line == 0 {
//       Self {
//         line: self.line,
//         column: self.column + other.column,
//       }
//     } else {
//       Self {
//         line: self.line + other.line,
//         column: other.column,
//       }
//     }
//   }
// }

#[derive(Debug)]
pub struct DisplayTextId(usize);

#[derive(Debug)]
pub struct DisplayText {
  id: usize,
  spacing: Spacing,
  contents: String,
  line: usize,
  column: usize,
  element: web_sys::HtmlElement,
}

impl DisplayText {
  fn new(
    id: usize,
    spacing: Spacing,
    contents: &str,
    line: usize,
    column: usize,
    document: &web_sys::Document,
  ) -> Result<Self, JsValue> {
    let text = DisplayText {
      id: id,
      spacing: spacing,
      contents: contents.to_string(),
      line: line,
      column: column,
      element: document.create_element("div")?.dyn_into()?,
    };

    text.element.set_inner_text(contents);
    text
      .element
      .set_class_name("font-mono text-lg text-gray-800 absolute top-0 left-0 transition-transform");
    text.element.style().set_property(
      "transform",
      &format!(
        "translate({}px, {}px",
        text.column * CHAR_WIDTH,
        text.line * CHAR_HEIGHT
      ),
    )?;

    Ok(text)
  }
}

pub trait DisplayNode<'a, T>
where
  Self: std::marker::Sized,
{
  fn from_node(node: &'a T, builder: &mut SloMoJs) -> Result<Self, JsValue>;
}

#[derive(Debug)]
pub struct SloMoJs {
  items: Vec<DisplayText>,
  line: usize,
  column: usize,
  document: web_sys::Document,
  container: web_sys::HtmlElement,
}

impl SloMoJs {
  pub fn new(document: web_sys::Document) -> Result<Self, JsValue> {
    let slomo = Self {
      items: vec![],
      line: 0,
      column: 0,
      document: document.clone(),
      container: document.create_element("div")?.dyn_into()?,
    };

    Ok(slomo)
  }

  pub fn get_container(&self) -> &web_sys::Element {
    &self.container
  }

  // pub fn try_get_item(&self, id: DisplayTextId) -> Option<&DisplayText> {
  //   self.items.get(id.0)
  // }

  // pub fn get_item(&self, id: DisplayTextId) -> &DisplayText {
  //   self.try_get_item(id).unwrap()
  // }

  // pub fn try_get_item_mut(&mut self, id: DisplayTextId) -> Option<&mut DisplayText> {
  //   self.items.get_mut(id.0)
  // }

  // pub fn get_item_mut(&mut self, id: DisplayTextId) -> &mut DisplayText {
  //   self.try_get_item_mut(id).unwrap()
  // }

  fn add_text(&mut self, contents: &str, spacing: Spacing) -> Result<DisplayTextId, JsValue> {
    let id = self.items.len();

    if spacing == Spacing::SpaceAround {
      self.column += 1
    }

    let display_text = DisplayText::new(
      id,
      spacing.clone(),
      contents,
      self.line,
      self.column,
      &self.document,
    )?;

    self.container.append_child(&display_text.element)?;
    self.items.push(display_text);
    self.column += contents.len();

    match spacing {
      Spacing::BreakAfter => {
        self.line += 1;
        self.column = 0;
      }
      Spacing::SpaceAfter => self.column += 1,
      Spacing::SpaceAround => self.column += 1,
      Spacing::None => (),
    }

    Ok(DisplayTextId(id))
  }

  pub fn add_node<'a, T: DisplayNode<'a, I>, I>(&mut self, node: &'a I) -> Result<T, JsValue> {
    T::from_node(node, self)
  }
}

impl std::fmt::Display for SloMoJs {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    for item in &self.items {
      match &item.spacing {
        Spacing::None => write!(f, "{}", item.contents)?,
        Spacing::SpaceAfter => write!(f, "{} ", item.contents)?,
        Spacing::SpaceAround => write!(f, " {} ", item.contents)?,
        Spacing::BreakAfter => write!(f, "{}\n", item.contents)?,
      }
    }
    Ok(())
  }
}

#[derive(Debug)]
struct SeparatedList<T> {
  items: Vec<(T, Option<DisplayTextId>)>,
}

impl<T> SeparatedList<T> {
  fn from_iter<Item, Iter, FItem, FSep>(
    iter: Iter,
    builder: &mut SloMoJs,
    make_item: FItem,
    make_sep: FSep,
  ) -> Result<SeparatedList<T>, JsValue>
  where
    Iter: Iterator<Item = Item>,
    FItem: Fn(Item, &mut SloMoJs) -> Result<T, JsValue>,
    FSep: Fn(&mut SloMoJs) -> Result<DisplayTextId, JsValue>,
  {
    let mut items = vec![];
    let mut iter = iter.peekable();
    loop {
      match iter.next() {
        Some(item) => {
          let display_item = make_item(item, builder)?;
          let display_sep = iter.peek().map(|_| make_sep(builder)).transpose()?;
          items.push((display_item, display_sep));
        }
        None => {
          return Ok(SeparatedList { items: items });
        }
      }
    }
  }
}

trait SeparatedListIter<T, Item> {
  fn separated_list<FItem, FSep>(
    self,
    builder: &mut SloMoJs,
    make_item: FItem,
    make_sep: FSep,
  ) -> Result<SeparatedList<T>, JsValue>
  where
    FItem: Fn(Item, &mut SloMoJs) -> Result<T, JsValue>,
    FSep: Fn(&mut SloMoJs) -> Result<DisplayTextId, JsValue>;
}

impl<Item, Iter, T> SeparatedListIter<T, Item> for Iter
where
  Iter: Iterator<Item = Item>,
{
  fn separated_list<FItem, FSep>(
    self: Iter,
    builder: &mut SloMoJs,
    make_item: FItem,
    make_sep: FSep,
  ) -> Result<SeparatedList<T>, JsValue>
  where
    FItem: Fn(Item, &mut SloMoJs) -> Result<T, JsValue>,
    FSep: Fn(&mut SloMoJs) -> Result<DisplayTextId, JsValue>,
  {
    Ok(SeparatedList::from_iter(
      self, builder, make_item, make_sep,
    )?)
  }
}

macro_rules! define_ast_node {
  ($AstName:path, $Name:ident<$lt:lifetime> { $($element:ident: $ty:ty,)* }) => {
    paste! {
      #[allow(dead_code)]
      #[derive(Debug)]
      pub struct $Name<$lt> {
        node: &$lt $AstName,
        ui: [<$Name Ui>]<$lt>,
      }

      #[allow(dead_code)]
      #[derive(Debug)]
      pub struct [<$Name Ui>]<$lt> {
        $($element: $ty),*
      }
    }
  };
  ($AstName:path, $Name:ident { $($element:ident: $ty:ty,)* }) => {
    paste! {
      #[allow(dead_code)]
      #[derive(Debug)]
      pub struct $Name<'a> {
        node: &'a $AstName,
        ui: [<$Name Ui>],
      }

      #[allow(dead_code)]
      #[derive(Debug)]
      pub struct [<$Name Ui>] {
        $($element: $ty),*
      }
    }
  };
  ($Name:ident<$lt:lifetime> { $($element:ident: $ty:ty,)* }) => {
    define_ast_node!(ast::$Name, $Name<$lt> { $($element: $ty,)* });
  };
  ($Name:ident { $($element:ident: $ty:ty,)* }) => {
    define_ast_node!(ast::$Name, $Name { $($element: $ty,)* });
  };
  ($Name:ident<$lt:lifetime> { $($element:ident: $ty:ty),* }) => {
    define_ast_node!($Name<$lt> { $($element: $ty,)* });
  };
  ($Name:ident { $($element:ident: $ty:ty),* }) => {
    define_ast_node!($Name { $($element: $ty,)* });
  };
}

macro_rules! from_node {
  ($AstName:path, $Name:ident, |$node:ident, $builder:ident| $from_node:expr) => {
    #[allow(dead_code)]
    impl<'a> DisplayNode<'a, $AstName> for $Name<'a> {
      fn from_node($node: &'a $AstName, $builder: &mut SloMoJs) -> Result<$Name<'a>, JsValue> {
        Ok($Name {
          node: $node,
          ui: $from_node,
        })
      }
    }
  };
  ($Name:ident, |$node:ident, $builder:ident| $from_node:expr) => {
    from_node!(ast::$Name, $Name, |$node, $builder| $from_node);
  };
}

define_ast_node!(BinExpr<'a> {
  left: Box<Expr<'a>>,
  op: DisplayTextId,
  right: Box<Expr<'a>>,
});
from_node!(BinExpr, |node, builder| BinExprUi {
  left: Box::new(builder.add_node(&*node.left)?),
  op: builder.add_text(node.op.as_str(), Spacing::SpaceAround)?,
  right: Box::new(builder.add_node(&*node.right)?),
});

define_ast_node!(CallExpr<'a> {
  callee: Box<ExprOrSuper<'a>>,
  open_paren: DisplayTextId,
  args: SeparatedList<ExprOrSpread<'a>>,
  close_paren: DisplayTextId,
});
from_node!(CallExpr, |node, builder| CallExprUi {
  callee: Box::new(builder.add_node(&node.callee)?),
  open_paren: builder.add_text("(", Spacing::None)?,
  args: node.args.iter().separated_list(
    builder,
    |node, b| Ok(b.add_node(node)?),
    |b| Ok(b.add_text(",", Spacing::SpaceAfter)?)
  )?,
  close_paren: builder.add_text(")", Spacing::None)?,
});

define_ast_node!(ExprOrSpread<'a> {
  spread: Option<DisplayTextId>,
  expr: Box<Expr<'a>>,
});
from_node!(ExprOrSpread, |node, builder| ExprOrSpreadUi {
  spread: node
    .spread
    .map(|_| builder.add_text("...", Spacing::None))
    .transpose()?,
  expr: Box::new(builder.add_node(&*node.expr)?),
});

define_ast_node!(ExprStmt<'a> { expr: Expr<'a> });
from_node!(ExprStmt, |node, builder| ExprStmtUi {
  expr: builder.add_node(&*node.expr)?, // Expr::from_node(&node.expr, builder)
});

define_ast_node!(Ident {
  name: DisplayTextId
});
from_node!(Ident, |node, builder| IdentUi {
  name: builder.add_text(&*node.sym, Spacing::None)?,
});

define_ast_node!(Script<'a> {
  body: SeparatedList<Stmt<'a>>,
});
from_node!(Script, |node, builder| ScriptUi {
  body: node.body.iter().separated_list(
    builder,
    |item, b| Ok(b.add_node(item)?),
    |b| Ok(b.add_text(";", Spacing::BreakAfter)?)
  )?
});

define_ast_node!(ast::MemberExpr, StaticMemberExpr<'a> {
  obj: ExprOrSuper<'a>,
  dot: DisplayTextId,
  prop: Ident<'a>,
});
from_node!(ast::MemberExpr, StaticMemberExpr, |node, builder| {
  StaticMemberExprUi {
    obj: builder.add_node(&node.obj)?,
    dot: builder.add_text(".", Spacing::None)?,
    prop: match &*node.prop {
      ast::Expr::Ident(ident) => builder.add_node(ident)?,
      other => panic!("Can only use ident in static member, got {:?}", other),
    },
  }
});

define_ast_node!(Number {
  value: DisplayTextId,
});
from_node!(Number, |node, builder| NumberUi {
  value: builder.add_text(&node.value.to_string(), Spacing::None)?,
});

define_ast_node!(Str {
  open: DisplayTextId,
  contents: DisplayTextId,
  close: DisplayTextId,
});
from_node!(Str, |node, builder| StrUi {
  open: builder.add_text("\"", Spacing::None)?,
  contents: builder.add_text(&*node.value, Spacing::None)?,
  close: builder.add_text("\"", Spacing::None)?,
});

define_ast_node!(Super {
  name: DisplayTextId
});
from_node!(Super, |node, builder| SuperUi {
  name: builder.add_text("super".into(), Spacing::None)?
});

define_ast_node!(VarDecl<'a> {
  kind: DisplayTextId,
  decls: SeparatedList<VarDeclarator<'a>>,
});
from_node!(VarDecl, |node, builder| VarDeclUi {
  kind: builder.add_text(node.kind.as_str(), Spacing::SpaceAfter)?,
  decls: node.decls.iter().separated_list(
    builder,
    |item, b| Ok(b.add_node(item)?),
    |b| Ok(b.add_text(",", Spacing::SpaceAfter)?)
  )?
});

define_ast_node!(VarDeclarator<'a> {
  name: Pat<'a>,
  init: Option<(DisplayTextId, Box<Expr<'a>>)>,
});
from_node!(VarDeclarator, |node, builder| VarDeclaratorUi {
  name: builder.add_node(&node.name)?,
  init: node
    .init
    .as_deref()
    .map::<Result<(DisplayTextId, Box<Expr<'a>>), JsValue>, _>(|init| Ok((
      builder.add_text("=", Spacing::SpaceAround)?,
      Box::new(builder.add_node(&*init)?)
    )))
    .transpose()?
});

#[derive(Debug)]
enum Decl<'a> {
  Var(VarDecl<'a>),
}
impl<'a> DisplayNode<'a, ast::Decl> for Decl<'a> {
  fn from_node(node: &'a ast::Decl, builder: &mut SloMoJs) -> Result<Decl<'a>, JsValue> {
    match node {
      ast::Decl::Var(val) => Ok(Decl::Var(builder.add_node(val)?)),
      other => panic!("Unknown node type for Decl: {:?}", other),
    }
  }
}

#[derive(Debug)]
enum Expr<'a> {
  Bin(BinExpr<'a>),
  Call(CallExpr<'a>),
  Ident(Ident<'a>),
  Lit(Lit<'a>),
  StaticMember(StaticMemberExpr<'a>),
}
impl<'a> DisplayNode<'a, ast::Expr> for Expr<'a> {
  fn from_node(node: &'a ast::Expr, builder: &mut SloMoJs) -> Result<Expr<'a>, JsValue> {
    match node {
      ast::Expr::Bin(val) => Ok(Expr::Bin(builder.add_node(val)?)),
      ast::Expr::Call(val) => Ok(Expr::Call(builder.add_node(val)?)),
      ast::Expr::Ident(val) => Ok(Expr::Ident(builder.add_node(val)?)),
      ast::Expr::Lit(val) => Ok(Expr::Lit(builder.add_node(val)?)),
      ast::Expr::Member(val) => {
        if val.computed {
          panic!("only static member access supported")
        } else {
          Ok(Expr::StaticMember(builder.add_node(val)?))
        }
      }
      other => panic!("Unknown node type for Expr: {:?}", other),
    }
  }
}

#[derive(Debug)]
enum ExprOrSuper<'a> {
  Super(Super<'a>),
  Expr(Box<Expr<'a>>),
}
impl<'a> DisplayNode<'a, ast::ExprOrSuper> for ExprOrSuper<'a> {
  fn from_node(
    node: &'a ast::ExprOrSuper,
    builder: &mut SloMoJs,
  ) -> Result<ExprOrSuper<'a>, JsValue> {
    match node {
      ast::ExprOrSuper::Super(val) => Ok(ExprOrSuper::Super(builder.add_node(val)?)),
      ast::ExprOrSuper::Expr(val) => Ok(ExprOrSuper::Expr(Box::new(builder.add_node(&**val)?))),
    }
  }
}

#[derive(Debug)]
enum Lit<'a> {
  Str(Str<'a>),
  Num(Number<'a>),
}
impl<'a> DisplayNode<'a, ast::Lit> for Lit<'a> {
  fn from_node(node: &'a ast::Lit, builder: &mut SloMoJs) -> Result<Lit<'a>, JsValue> {
    match node {
      ast::Lit::Str(val) => Ok(Lit::Str(builder.add_node(val)?)),
      ast::Lit::Num(val) => Ok(Lit::Num(builder.add_node(val)?)),
      other => panic!("Unknown node type for Lit: {:?}", other),
    }
  }
}

#[derive(Debug)]
enum Pat<'a> {
  Ident(Ident<'a>),
}
impl<'a> DisplayNode<'a, ast::Pat> for Pat<'a> {
  fn from_node(node: &'a ast::Pat, builder: &mut SloMoJs) -> Result<Pat<'a>, JsValue> {
    match node {
      ast::Pat::Ident(val) => Ok(Pat::Ident(builder.add_node(val)?)),
      other => panic!("Unknown node type for Pat: {:?}", other),
    }
  }
}

#[derive(Debug)]
enum Stmt<'a> {
  Expr(ExprStmt<'a>),
  Decl(Decl<'a>),
}
impl<'a> DisplayNode<'a, ast::Stmt> for Stmt<'a> {
  fn from_node(node: &'a ast::Stmt, builder: &mut SloMoJs) -> Result<Stmt<'a>, JsValue> {
    match node {
      ast::Stmt::Expr(val) => Ok(Stmt::Expr(builder.add_node(val)?)),
      ast::Stmt::Decl(val) => Ok(Stmt::Decl(builder.add_node(val)?)),
      other => panic!("Unknown node type for Stmt: {:?}", other),
    }
  }
}
