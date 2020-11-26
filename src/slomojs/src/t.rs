use crate::display_list::{DisplayListBuilder, DisplayNode, DisplayTextId, Highlight, Spacing};
use swc_ecma_ast as ast;
use wasm_bindgen::prelude::*;

#[derive(Debug)]
pub struct SeparatedList<T> {
  pub items: Vec<(T, Option<DisplayTextId>)>,
}

impl<T> SeparatedList<T> {
  fn from_iter<Item, Iter, FItem, FSep>(
    iter: Iter,
    builder: &mut DisplayListBuilder,
    make_item: FItem,
    make_sep: FSep,
  ) -> Result<SeparatedList<T>, JsValue>
  where
    Iter: Iterator<Item = Item>,
    FItem: Fn(Item, &mut DisplayListBuilder) -> Result<T, JsValue>,
    FSep: Fn(&mut DisplayListBuilder) -> Result<DisplayTextId, JsValue>,
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

  pub fn iter(&self) -> std::slice::Iter<'_, (T, Option<DisplayTextId>)> {
    self.items.iter()
  }
}

trait SeparatedListIter<T, Item> {
  fn separated_list<FItem, FSep>(
    self,
    builder: &mut DisplayListBuilder,
    make_item: FItem,
    make_sep: FSep,
  ) -> Result<SeparatedList<T>, JsValue>
  where
    FItem: Fn(Item, &mut DisplayListBuilder) -> Result<T, JsValue>,
    FSep: Fn(&mut DisplayListBuilder) -> Result<DisplayTextId, JsValue>;
}

impl<Item, Iter, T> SeparatedListIter<T, Item> for Iter
where
  Iter: Iterator<Item = Item>,
{
  fn separated_list<FItem, FSep>(
    self: Iter,
    builder: &mut DisplayListBuilder,
    make_item: FItem,
    make_sep: FSep,
  ) -> Result<SeparatedList<T>, JsValue>
  where
    FItem: Fn(Item, &mut DisplayListBuilder) -> Result<T, JsValue>,
    FSep: Fn(&mut DisplayListBuilder) -> Result<DisplayTextId, JsValue>,
  {
    Ok(SeparatedList::from_iter(
      self, builder, make_item, make_sep,
    )?)
  }
}

impl<T> IntoIterator for SeparatedList<T> {
  type Item = (T, Option<DisplayTextId>);
  type IntoIter = std::vec::IntoIter<Self::Item>;

  fn into_iter(self) -> Self::IntoIter {
    self.items.into_iter()
  }
}

// macro_rules! define_ast_node {
//   ($AstName:path, $Name:ident<$lt:lifetime> { $($element:ident: $ty:ty,)* }) => {
//     paste! {
//       #[allow(dead_code)]
//       #[derive(Debug)]
//       pub struct $Name<$lt> {
//         pub node: &$lt $AstName,
//         pub ui: [<$Name Ui>]<$lt>,
//       }

//       #[allow(dead_code)]
//       #[derive(Debug)]
//       pub struct [<$Name Ui>]<$lt> {
//         pub $($element: $ty),*
//       }
//     }
//   };
//   ($AstName:path, $Name:ident { $($element:ident: $ty:ty,)* }) => {
//     paste! {
//       #[allow(dead_code)]
//       #[derive(Debug)]
//       pub struct $Name<'a> {
//         pub node: &'a $AstName,
//         pub ui: [<$Name Ui>],
//       }

//       #[allow(dead_code)]
//       #[derive(Debug)]
//       pub struct [<$Name Ui>] {
//         pub $($element: $ty),*
//       }
//     }
//   };
//   ($Name:ident<$lt:lifetime> { $($element:ident: $ty:ty,)* }) => {
//     pub struct ast::$Name, $Name<$lt> { $($element: $ty,)* }
//     node: &'a ast::,,
//   };
//   ($Name:ident { $($element:ident: $ty:ty,)* }) => {
//     pub struct ast::$Name, $Name { $($element: $ty,)* }
//     node: &'a ast::,,
//   };
//   ($Name:ident<$lt:lifetime> { $($element:ident: $ty:ty),* }) => {
//     pub struct $Name<$lt> { $($element: $ty,)* }
//     node: &'a ast::,,
//   };
//   ($Name:ident { $($element:ident: $ty:ty),* }) => {
//     pub struct $Name { $($element: $ty,)* }
//     node: &'a ast::,,
//   };
// }

// macro_rules! from_node {
//   ($AstName:path, $Name:ident, |$node:ident, $builder:ident| $from_node:expr) => {
//     #[allow(dead_code)]
//     impl<'a> DisplayNode<'a, $AstName> for $Name<'a> {
//       fn from_node(
//         $node: &'a $AstName,
//         $builder: &mut DisplayListBuilder,
//       ) -> Result<$Name<'a>, JsValue> {
//         Ok($Name {
//           node: $node,
//           ui: $from_node,
//         })
//       }
//     }
//   };
//   ($Name:ident, |$node:ident, $builder:ident| $from_node:expr) => {
//     from_node !(ast::$Name, $Name, |$node, $builder| $from_node);
//   };
// }

#[derive(Debug)]
pub struct BinExpr<'a> {
  pub node: &'a ast::BinExpr,
  pub left: Box<Expr<'a>>,
  pub op: DisplayTextId,
  pub right: Box<Expr<'a>>,
}
impl<'a> DisplayNode<'a, ast::BinExpr> for BinExpr<'a> {
  fn from_node(
    node: &'a ast::BinExpr,
    builder: &mut DisplayListBuilder,
  ) -> Result<BinExpr<'a>, JsValue> {
    Ok(BinExpr {
      node,
      left: Box::new(builder.add_node(&*node.left)?),
      op: builder.add_text(node.op.as_str(), Spacing::SpaceAround, Highlight::Operator)?,
      right: Box::new(builder.add_node(&*node.right)?),
    })
  }
}

#[derive(Debug)]
pub struct CallExpr<'a> {
  pub node: &'a ast::CallExpr,
  pub callee: Box<ExprOrSuper<'a>>,
  pub open_paren: DisplayTextId,
  pub args: SeparatedList<ExprOrSpread<'a>>,
  pub close_paren: DisplayTextId,
}
impl<'a> DisplayNode<'a, ast::CallExpr> for CallExpr<'a> {
  fn from_node(
    node: &'a ast::CallExpr,
    builder: &mut DisplayListBuilder,
  ) -> Result<CallExpr<'a>, JsValue> {
    Ok(CallExpr {
      node,
      callee: Box::new(builder.add_node(&node.callee)?),
      open_paren: builder.add_text("(", Spacing::None, Highlight::Punctuation)?,
      args: node.args.iter().separated_list(
        builder,
        |node, b| Ok(b.add_node(node)?),
        |b| Ok(b.add_text(",", Spacing::SpaceAfter, Highlight::Punctuation)?),
      )?,
      close_paren: builder.add_text(")", Spacing::None, Highlight::Punctuation)?,
    })
  }
}

#[derive(Debug)]
pub struct ExprOrSpread<'a> {
  pub node: &'a ast::ExprOrSpread,
  pub spread: Option<DisplayTextId>,
  pub expr: Box<Expr<'a>>,
}
impl<'a> DisplayNode<'a, ast::ExprOrSpread> for ExprOrSpread<'a> {
  fn from_node(
    node: &'a ast::ExprOrSpread,
    builder: &mut DisplayListBuilder,
  ) -> Result<ExprOrSpread<'a>, JsValue> {
    Ok(ExprOrSpread {
      node,
      spread: node
        .spread
        .map(|_| builder.add_text("...", Spacing::None, Highlight::Punctuation))
        .transpose()?,
      expr: Box::new(builder.add_node(&*node.expr)?),
    })
  }
}

#[derive(Debug)]
pub struct ExprStmt<'a> {
  pub node: &'a ast::ExprStmt,
  pub expr: Expr<'a>,
}
impl<'a> DisplayNode<'a, ast::ExprStmt> for ExprStmt<'a> {
  fn from_node(
    node: &'a ast::ExprStmt,
    builder: &mut DisplayListBuilder,
  ) -> Result<ExprStmt<'a>, JsValue> {
    Ok(ExprStmt {
      node,
      expr: builder.add_node(&*node.expr)?, // Expr::from_node(&node.expr, builder)
    })
  }
}

#[derive(Debug)]
pub struct Ident<'a> {
  pub node: &'a ast::Ident,
  pub name: DisplayTextId,
}
impl<'a> DisplayNode<'a, ast::Ident> for Ident<'a> {
  fn from_node(
    node: &'a ast::Ident,
    builder: &mut DisplayListBuilder,
  ) -> Result<Ident<'a>, JsValue> {
    Ok(Ident {
      node,
      name: builder.add_text(&*node.sym, Spacing::None, Highlight::Identifier)?,
    })
  }
}

#[derive(Debug)]
pub struct Script<'a> {
  pub node: &'a ast::Script,
  pub body: SeparatedList<Stmt<'a>>,
}
impl<'a> DisplayNode<'a, ast::Script> for Script<'a> {
  fn from_node(
    node: &'a ast::Script,
    builder: &mut DisplayListBuilder,
  ) -> Result<Script<'a>, JsValue> {
    Ok(Script {
      node,
      body: node.body.iter().separated_list(
        builder,
        |item, b| Ok(b.add_node(item)?),
        |b| Ok(b.add_text(";", Spacing::BreakAfter, Highlight::Punctuation)?),
      )?,
    })
  }
}

#[derive(Debug)]
pub struct StaticMemberExpr<'a> {
  pub node: &'a ast::MemberExpr,
  pub obj: ExprOrSuper<'a>,
  pub dot: DisplayTextId,
  pub prop: Ident<'a>,
}
impl<'a> DisplayNode<'a, ast::MemberExpr> for StaticMemberExpr<'a> {
  fn from_node(
    node: &'a ast::MemberExpr,
    builder: &mut DisplayListBuilder,
  ) -> Result<StaticMemberExpr<'a>, JsValue> {
    Ok(StaticMemberExpr {
      node,
      obj: builder.add_node(&node.obj)?,
      dot: builder.add_text(".", Spacing::None, Highlight::Punctuation)?,
      prop: match &*node.prop {
        ast::Expr::Ident(ident) => builder.add_node(ident)?,
        other => panic!("Can only use ident in static member, got {:?}", other),
      },
    })
  }
}

#[derive(Debug)]
pub struct Number<'a> {
  pub node: &'a ast::Number,
  pub value: DisplayTextId,
}
impl<'a> DisplayNode<'a, ast::Number> for Number<'a> {
  fn from_node(
    node: &'a ast::Number,
    builder: &mut DisplayListBuilder,
  ) -> Result<Number<'a>, JsValue> {
    Ok(Number {
      node,
      value: builder.add_text(&node.value.to_string(), Spacing::None, Highlight::Literal)?,
    })
  }
}

#[derive(Debug)]
pub struct Str<'a> {
  pub node: &'a ast::Str,
  pub open: DisplayTextId,
  pub contents: DisplayTextId,
  pub close: DisplayTextId,
}
impl<'a> DisplayNode<'a, ast::Str> for Str<'a> {
  fn from_node(node: &'a ast::Str, builder: &mut DisplayListBuilder) -> Result<Str<'a>, JsValue> {
    Ok(Str {
      node,
      open: builder.add_text("\"", Spacing::None, Highlight::String)?,
      contents: builder.add_text(&*node.value, Spacing::None, Highlight::String)?,
      close: builder.add_text("\"", Spacing::None, Highlight::String)?,
    })
  }
}

#[derive(Debug)]
pub struct Super<'a> {
  pub node: &'a ast::Super,
  pub name: DisplayTextId,
}
impl<'a> DisplayNode<'a, ast::Super> for Super<'a> {
  fn from_node(
    node: &'a ast::Super,
    builder: &mut DisplayListBuilder,
  ) -> Result<Super<'a>, JsValue> {
    Ok(Super {
      node,
      name: builder.add_text("super".into(), Spacing::None, Highlight::Keyword)?,
    })
  }
}

#[derive(Debug)]
pub struct VarDecl<'a> {
  pub node: &'a ast::VarDecl,
  pub kind: DisplayTextId,
  pub decls: SeparatedList<VarDeclarator<'a>>,
}
impl<'a> DisplayNode<'a, ast::VarDecl> for VarDecl<'a> {
  fn from_node(
    node: &'a ast::VarDecl,
    builder: &mut DisplayListBuilder,
  ) -> Result<VarDecl<'a>, JsValue> {
    Ok(VarDecl {
      node,
      kind: builder.add_text(node.kind.as_str(), Spacing::SpaceAfter, Highlight::Keyword)?,
      decls: node.decls.iter().separated_list(
        builder,
        |item, b| Ok(b.add_node(item)?),
        |b| Ok(b.add_text(",", Spacing::SpaceAfter, Highlight::Punctuation)?),
      )?,
    })
  }
}

#[derive(Debug)]
pub struct VarDeclarator<'a> {
  pub node: &'a ast::VarDeclarator,
  pub name: Pat<'a>,
  pub init: Option<(DisplayTextId, Box<Expr<'a>>)>,
}
impl<'a> DisplayNode<'a, ast::VarDeclarator> for VarDeclarator<'a> {
  fn from_node(
    node: &'a ast::VarDeclarator,
    builder: &mut DisplayListBuilder,
  ) -> Result<VarDeclarator<'a>, JsValue> {
    Ok(VarDeclarator {
      node,
      name: builder.add_node(&node.name)?,
      init: node
        .init
        .as_deref()
        .map::<Result<(DisplayTextId, Box<Expr<'a>>), JsValue>, _>(|init| {
          Ok((
            builder.add_text("=", Spacing::SpaceAround, Highlight::Operator)?,
            Box::new(builder.add_node(&*init)?),
          ))
        })
        .transpose()?,
    })
  }
}

#[derive(Debug)]
pub enum Decl<'a> {
  Var(VarDecl<'a>),
}
impl<'a> DisplayNode<'a, ast::Decl> for Decl<'a> {
  fn from_node(node: &'a ast::Decl, builder: &mut DisplayListBuilder) -> Result<Decl<'a>, JsValue> {
    match node {
      ast::Decl::Var(val) => Ok(Decl::Var(builder.add_node(val)?)),
      other => panic!("Unknown node type for Decl: {:?}", other),
    }
  }
}

#[derive(Debug)]
pub enum Expr<'a> {
  Bin(BinExpr<'a>),
  Call(CallExpr<'a>),
  Ident(Ident<'a>),
  Lit(Lit<'a>),
  StaticMember(StaticMemberExpr<'a>),
}
impl<'a> DisplayNode<'a, ast::Expr> for Expr<'a> {
  fn from_node(node: &'a ast::Expr, builder: &mut DisplayListBuilder) -> Result<Expr<'a>, JsValue> {
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
pub enum ExprOrSuper<'a> {
  Super(Super<'a>),
  Expr(Box<Expr<'a>>),
}
impl<'a> DisplayNode<'a, ast::ExprOrSuper> for ExprOrSuper<'a> {
  fn from_node(
    node: &'a ast::ExprOrSuper,
    builder: &mut DisplayListBuilder,
  ) -> Result<ExprOrSuper<'a>, JsValue> {
    match node {
      ast::ExprOrSuper::Super(val) => Ok(ExprOrSuper::Super(builder.add_node(val)?)),
      ast::ExprOrSuper::Expr(val) => Ok(ExprOrSuper::Expr(Box::new(builder.add_node(&**val)?))),
    }
  }
}

#[derive(Debug)]
pub enum Lit<'a> {
  Str(Str<'a>),
  Num(Number<'a>),
}
impl<'a> DisplayNode<'a, ast::Lit> for Lit<'a> {
  fn from_node(node: &'a ast::Lit, builder: &mut DisplayListBuilder) -> Result<Lit<'a>, JsValue> {
    match node {
      ast::Lit::Str(val) => Ok(Lit::Str(builder.add_node(val)?)),
      ast::Lit::Num(val) => Ok(Lit::Num(builder.add_node(val)?)),
      other => panic!("Unknown node type for Lit: {:?}", other),
    }
  }
}

#[derive(Debug)]
pub enum Pat<'a> {
  Ident(Ident<'a>),
}
impl<'a> DisplayNode<'a, ast::Pat> for Pat<'a> {
  fn from_node(node: &'a ast::Pat, builder: &mut DisplayListBuilder) -> Result<Pat<'a>, JsValue> {
    match node {
      ast::Pat::Ident(val) => Ok(Pat::Ident(builder.add_node(val)?)),
      other => panic!("Unknown node type for Pat: {:?}", other),
    }
  }
}

#[derive(Debug)]
pub enum Stmt<'a> {
  Expr(ExprStmt<'a>),
  Decl(Decl<'a>),
}
impl<'a> DisplayNode<'a, ast::Stmt> for Stmt<'a> {
  fn from_node(node: &'a ast::Stmt, builder: &mut DisplayListBuilder) -> Result<Stmt<'a>, JsValue> {
    match node {
      ast::Stmt::Expr(val) => Ok(Stmt::Expr(builder.add_node(val)?)),
      ast::Stmt::Decl(val) => Ok(Stmt::Decl(builder.add_node(val)?)),
      other => panic!("Unknown node type for Stmt: {:?}", other),
    }
  }
}
