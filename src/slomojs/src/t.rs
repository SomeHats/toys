use crate::display_list::{
  DisplayListBuilder, DisplayNode, DisplayTextId, Highlight, Spacing, TextConfig,
};
use swc_ecma_ast as ast;

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
  ) -> SeparatedList<T>
  where
    Iter: Iterator<Item = Item>,
    FItem: Fn(Item, &mut DisplayListBuilder) -> T,
    FSep: Fn(&mut DisplayListBuilder) -> DisplayTextId,
  {
    let mut items = vec![];
    let mut iter = iter.peekable();
    loop {
      match iter.next() {
        Some(item) => {
          let display_item = make_item(item, builder);
          let display_sep = iter.peek().map(|_| make_sep(builder));
          items.push((display_item, display_sep));
        }
        None => {
          return SeparatedList { items: items };
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
  ) -> SeparatedList<T>
  where
    FItem: Fn(Item, &mut DisplayListBuilder) -> T,
    FSep: Fn(&mut DisplayListBuilder) -> DisplayTextId;
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
  ) -> SeparatedList<T>
  where
    FItem: Fn(Item, &mut DisplayListBuilder) -> T,
    FSep: Fn(&mut DisplayListBuilder) -> DisplayTextId,
  {
    SeparatedList::from_iter(self, builder, make_item, make_sep)
  }
}

impl<T> IntoIterator for SeparatedList<T> {
  type Item = (T, Option<DisplayTextId>);
  type IntoIter = std::vec::IntoIter<Self::Item>;

  fn into_iter(self) -> Self::IntoIter {
    self.items.into_iter()
  }
}

#[derive(Debug)]
pub struct BinExpr<'a> {
  pub node: &'a ast::BinExpr,
  pub left: Box<Expr<'a>>,
  pub op: DisplayTextId,
  pub right: Box<Expr<'a>>,
}
impl<'a> DisplayNode<'a, ast::BinExpr> for BinExpr<'a> {
  fn from_node(node: &'a ast::BinExpr, builder: &mut DisplayListBuilder) -> BinExpr<'a> {
    BinExpr {
      node,
      left: Box::new(builder.add_node(&*node.left)),
      op: builder.add_text(TextConfig::new(
        node.op.as_str(),
        Spacing::SpaceAround,
        Highlight::Operator,
      )),
      right: Box::new(builder.add_node(&*node.right)),
    }
  }
}

#[derive(Debug)]
pub struct CallExpr<'a> {
  pub node: &'a ast::CallExpr,
  pub callee: ExprOrSuper<'a>,
  pub open_paren: DisplayTextId,
  pub args: SeparatedList<ExprOrSpread<'a>>,
  pub close_paren: DisplayTextId,
}
impl<'a> DisplayNode<'a, ast::CallExpr> for CallExpr<'a> {
  fn from_node(node: &'a ast::CallExpr, builder: &mut DisplayListBuilder) -> CallExpr<'a> {
    CallExpr {
      node,
      callee: builder.add_node(&node.callee),
      open_paren: builder.add_text(TextConfig::new("(", Spacing::None, Highlight::Punctuation)),
      args: node.args.iter().separated_list(
        builder,
        |node, b| b.add_node(node),
        |b| {
          b.add_text(TextConfig::new(
            ",",
            Spacing::SpaceAfter,
            Highlight::Punctuation,
          ))
        },
      ),
      close_paren: builder.add_text(TextConfig::new(")", Spacing::None, Highlight::Punctuation)),
    }
  }
}

#[derive(Debug)]
pub struct ExprOrSpread<'a> {
  pub node: &'a ast::ExprOrSpread,
  pub spread: Option<DisplayTextId>,
  pub expr: Box<Expr<'a>>,
}
impl<'a> DisplayNode<'a, ast::ExprOrSpread> for ExprOrSpread<'a> {
  fn from_node(node: &'a ast::ExprOrSpread, builder: &mut DisplayListBuilder) -> ExprOrSpread<'a> {
    ExprOrSpread {
      node,
      spread: node.spread.map(|_| {
        builder.add_text(TextConfig::new(
          "...",
          Spacing::None,
          Highlight::Punctuation,
        ))
      }),
      expr: Box::new(builder.add_node(&*node.expr)),
    }
  }
}

#[derive(Debug)]
pub struct ExprStmt<'a> {
  pub node: &'a ast::ExprStmt,
  pub expr: Expr<'a>,
}
impl<'a> DisplayNode<'a, ast::ExprStmt> for ExprStmt<'a> {
  fn from_node(node: &'a ast::ExprStmt, builder: &mut DisplayListBuilder) -> ExprStmt<'a> {
    ExprStmt {
      node,
      expr: builder.add_node(&*node.expr),
    }
  }
}

#[derive(Debug)]
pub struct Ident<'a> {
  pub node: &'a ast::Ident,
  pub name: DisplayTextId,
}
impl<'a> DisplayNode<'a, ast::Ident> for Ident<'a> {
  fn from_node(node: &'a ast::Ident, builder: &mut DisplayListBuilder) -> Ident<'a> {
    Ident {
      node,
      name: builder.add_text(TextConfig::new(
        &*node.sym,
        Spacing::None,
        Highlight::Identifier,
      )),
    }
  }
}

#[derive(Debug)]
pub struct Script<'a> {
  pub node: &'a ast::Script,
  pub body: SeparatedList<Stmt<'a>>,
}
impl<'a> DisplayNode<'a, ast::Script> for Script<'a> {
  fn from_node(node: &'a ast::Script, builder: &mut DisplayListBuilder) -> Script<'a> {
    Script {
      node,
      body: node.body.iter().separated_list(
        builder,
        |item, b| b.add_node(item),
        |b| {
          b.add_text(TextConfig::new(
            ";",
            Spacing::BreakAfter,
            Highlight::Punctuation,
          ))
        },
      ),
    }
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
  ) -> StaticMemberExpr<'a> {
    StaticMemberExpr {
      node,
      obj: builder.add_node(&node.obj),
      dot: builder.add_text(TextConfig::new(".", Spacing::None, Highlight::Punctuation)),
      prop: match &*node.prop {
        ast::Expr::Ident(ident) => builder.add_node(ident),
        other => panic!("Can only use ident in static member, got {:?}", other),
      },
    }
  }
}

#[derive(Debug)]
pub struct Number<'a> {
  pub node: &'a ast::Number,
  pub value: DisplayTextId,
}
impl<'a> DisplayNode<'a, ast::Number> for Number<'a> {
  fn from_node(node: &'a ast::Number, builder: &mut DisplayListBuilder) -> Number<'a> {
    Number {
      node,
      value: builder.add_text(TextConfig::new(
        &node.value.to_string(),
        Spacing::None,
        Highlight::Literal,
      )),
    }
  }
}

#[derive(Debug, Clone)]
pub struct DisplayString {
  pub open: DisplayTextId,
  pub contents: DisplayTextId,
  pub close: DisplayTextId,
}

#[derive(Debug)]
pub struct Str<'a> {
  pub node: &'a ast::Str,
  pub display: DisplayString,
}
impl<'a> DisplayNode<'a, ast::Str> for Str<'a> {
  fn from_node(node: &'a ast::Str, builder: &mut DisplayListBuilder) -> Str<'a> {
    Str {
      node,
      display: DisplayString {
        open: builder.add_text(TextConfig::new("\"", Spacing::None, Highlight::String)),
        contents: builder.add_text(TextConfig::new(
          &*node.value,
          Spacing::None,
          Highlight::String,
        )),
        close: builder.add_text(TextConfig::new("\"", Spacing::None, Highlight::String)),
      },
    }
  }
}

#[derive(Debug)]
pub struct Super<'a> {
  pub node: &'a ast::Super,
  pub name: DisplayTextId,
}
impl<'a> DisplayNode<'a, ast::Super> for Super<'a> {
  fn from_node(node: &'a ast::Super, builder: &mut DisplayListBuilder) -> Super<'a> {
    Super {
      node,
      name: builder.add_text(TextConfig::new(
        "super".into(),
        Spacing::None,
        Highlight::Keyword,
      )),
    }
  }
}

#[derive(Debug)]
pub struct VarDecl<'a> {
  pub node: &'a ast::VarDecl,
  pub kind: DisplayTextId,
  pub decls: SeparatedList<VarDeclarator<'a>>,
}
impl<'a> DisplayNode<'a, ast::VarDecl> for VarDecl<'a> {
  fn from_node(node: &'a ast::VarDecl, builder: &mut DisplayListBuilder) -> VarDecl<'a> {
    VarDecl {
      node,
      kind: builder.add_text(TextConfig::new(
        node.kind.as_str(),
        Spacing::SpaceAfter,
        Highlight::Keyword,
      )),
      decls: node.decls.iter().separated_list(
        builder,
        |item, b| b.add_node(item),
        |b| {
          b.add_text(TextConfig::new(
            ",",
            Spacing::SpaceAfter,
            Highlight::Punctuation,
          ))
        },
      ),
    }
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
  ) -> VarDeclarator<'a> {
    VarDeclarator {
      node,
      name: builder.add_node(&node.name),
      init: node
        .init
        .as_deref()
        .map::<(DisplayTextId, Box<Expr<'a>>), _>(|init| {
          (
            builder.add_text(TextConfig::new(
              "=",
              Spacing::SpaceAround,
              Highlight::Operator,
            )),
            Box::new(builder.add_node(&*init)),
          )
        }),
    }
  }
}

#[derive(Debug)]
pub enum Decl<'a> {
  Var(VarDecl<'a>),
}
impl<'a> DisplayNode<'a, ast::Decl> for Decl<'a> {
  fn from_node(node: &'a ast::Decl, builder: &mut DisplayListBuilder) -> Decl<'a> {
    match node {
      ast::Decl::Var(val) => Decl::Var(builder.add_node(val)),
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
  fn from_node(node: &'a ast::Expr, builder: &mut DisplayListBuilder) -> Expr<'a> {
    match node {
      ast::Expr::Bin(val) => Expr::Bin(builder.add_node(val)),
      ast::Expr::Call(val) => Expr::Call(builder.add_node(val)),
      ast::Expr::Ident(val) => Expr::Ident(builder.add_node(val)),
      ast::Expr::Lit(val) => Expr::Lit(builder.add_node(val)),
      ast::Expr::Member(val) => {
        if val.computed {
          panic!("only static member access supported")
        } else {
          Expr::StaticMember(builder.add_node(val))
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
  fn from_node(node: &'a ast::ExprOrSuper, builder: &mut DisplayListBuilder) -> ExprOrSuper<'a> {
    match node {
      ast::ExprOrSuper::Super(val) => ExprOrSuper::Super(builder.add_node(val)),
      ast::ExprOrSuper::Expr(val) => ExprOrSuper::Expr(Box::new(builder.add_node(&**val))),
    }
  }
}

#[derive(Debug)]
pub enum Lit<'a> {
  Str(Str<'a>),
  Num(Number<'a>),
}
impl<'a> DisplayNode<'a, ast::Lit> for Lit<'a> {
  fn from_node(node: &'a ast::Lit, builder: &mut DisplayListBuilder) -> Lit<'a> {
    match node {
      ast::Lit::Str(val) => Lit::Str(builder.add_node(val)),
      ast::Lit::Num(val) => Lit::Num(builder.add_node(val)),
      other => panic!("Unknown node type for Lit: {:?}", other),
    }
  }
}

#[derive(Debug)]
pub enum Pat<'a> {
  Ident(Ident<'a>),
}
impl<'a> DisplayNode<'a, ast::Pat> for Pat<'a> {
  fn from_node(node: &'a ast::Pat, builder: &mut DisplayListBuilder) -> Pat<'a> {
    match node {
      ast::Pat::Ident(val) => Pat::Ident(builder.add_node(val)),
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
  fn from_node(node: &'a ast::Stmt, builder: &mut DisplayListBuilder) -> Stmt<'a> {
    match node {
      ast::Stmt::Expr(val) => Stmt::Expr(builder.add_node(val)),
      ast::Stmt::Decl(val) => Stmt::Decl(builder.add_node(val)),
      other => panic!("Unknown node type for Stmt: {:?}", other),
    }
  }
}
