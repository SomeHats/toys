use crate::display::{TextBuilder, WordId};
use crate::display_list::{Highlight, Spacing, TextConfig};
use swc_ecma_ast as ast;

/// Each display node is a wrapper of an swc ast node, with data props replaced with UI props
pub trait DisplayNode<'a, T>
where
    Self: std::marker::Sized,
{
    fn from_node(node: &'a T, builder: &mut TextBuilder) -> Self;
}

/// Just like how `From` in rust std implies `Into`, `DisplayNode`'s `from_node` has an equivalent
/// `into_display_node`. This is automatically implemented for all `DisplayNode`s.
trait IntoDisplayNode<'a, T>
where
    Self: std::marker::Sized,
{
    fn into_display_node(&'a self, builder: &mut TextBuilder) -> T;
}
impl<'a, T, U> IntoDisplayNode<'a, U> for T
where
    U: DisplayNode<'a, T>,
{
    fn into_display_node(&'a self, builder: &mut TextBuilder) -> U {
        U::from_node(self, builder)
    }
}

#[derive(Debug)]
pub struct SeparatedList<T> {
    pub items: Vec<(T, Option<WordId>)>,
}

impl<'a, T> SeparatedList<T> {
    pub fn iter(&self) -> std::slice::Iter<'_, (T, Option<WordId>)> {
        self.items.iter()
    }
}

trait SeparatedListIter<T, Item> {
    fn separated_list<FSep>(self, builder: &mut TextBuilder, make_sep: FSep) -> SeparatedList<T>
    where
        FSep: Fn(&mut TextBuilder) -> WordId;
}

impl<'a, Item: 'a, Iter, T> SeparatedListIter<T, Item> for Iter
where
    Iter: Iterator<Item = &'a Item>,
    T: DisplayNode<'a, Item>,
{
    fn separated_list<FSep>(
        self: Iter,
        builder: &mut TextBuilder,
        make_sep: FSep,
    ) -> SeparatedList<T>
    where
        FSep: Fn(&mut TextBuilder) -> WordId,
    {
        let mut items = vec![];
        let mut iter = self.peekable();
        loop {
            match iter.next() {
                Some(item) => {
                    let display_item = T::from_node(item, builder);
                    let display_sep = iter.peek().map(|_| make_sep(builder));
                    items.push((display_item, display_sep));
                }
                None => {
                    return SeparatedList { items: items };
                }
            }
        }
    }
}

impl<T> IntoIterator for SeparatedList<T> {
    type Item = (T, Option<WordId>);
    type IntoIter = std::vec::IntoIter<Self::Item>;

    fn into_iter(self) -> Self::IntoIter {
        self.items.into_iter()
    }
}

#[derive(Debug)]
pub struct BinExpr<'a> {
    pub node: &'a ast::BinExpr,
    pub left: Box<Expr<'a>>,
    pub op: WordId,
    pub right: Box<Expr<'a>>,
}
impl<'a> DisplayNode<'a, ast::BinExpr> for BinExpr<'a> {
    fn from_node(node: &'a ast::BinExpr, builder: &mut TextBuilder) -> BinExpr<'a> {
        BinExpr {
            node,
            left: node.left.into_display_node(builder),
            op: builder.add(TextConfig::spaced_operator(node.op.as_str())),
            right: node.right.into_display_node(builder),
        }
    }
}

#[derive(Debug)]
pub struct CallExpr<'a> {
    pub node: &'a ast::CallExpr,
    pub callee: ExprOrSuper<'a>,
    pub open_paren: WordId,
    pub args: SeparatedList<ExprOrSpread<'a>>,
    pub close_paren: WordId,
}
impl<'a> DisplayNode<'a, ast::CallExpr> for CallExpr<'a> {
    fn from_node(node: &'a ast::CallExpr, builder: &mut TextBuilder) -> CallExpr<'a> {
        CallExpr {
            node,
            callee: node.callee.into_display_node(builder),
            open_paren: builder.add(TextConfig::punctuation("(", Spacing::None)),
            args: node.args.iter().separated_list(builder, |b| {
                b.add(TextConfig::new(
                    ",",
                    Spacing::SpaceAfter,
                    Highlight::Punctuation,
                ))
            }),
            close_paren: builder.add(TextConfig::punctuation(")", Spacing::None)),
        }
    }
}

#[derive(Debug)]
pub struct ExprOrSpread<'a> {
    pub node: &'a ast::ExprOrSpread,
    pub spread: Option<WordId>,
    pub expr: Box<Expr<'a>>,
}
impl<'a> DisplayNode<'a, ast::ExprOrSpread> for ExprOrSpread<'a> {
    fn from_node(node: &'a ast::ExprOrSpread, builder: &mut TextBuilder) -> ExprOrSpread<'a> {
        ExprOrSpread {
            node,
            spread: node
                .spread
                .map(|_| builder.add(TextConfig::punctuation("...", Spacing::None))),
            expr: node.expr.into_display_node(builder),
        }
    }
}

#[derive(Debug)]
pub struct ExprStmt<'a> {
    pub node: &'a ast::ExprStmt,
    pub expr: Expr<'a>,
}
impl<'a> DisplayNode<'a, ast::ExprStmt> for ExprStmt<'a> {
    fn from_node(node: &'a ast::ExprStmt, builder: &mut TextBuilder) -> ExprStmt<'a> {
        ExprStmt {
            node,
            expr: node.expr.as_ref().into_display_node(builder),
        }
    }
}

#[derive(Debug)]
pub struct Ident<'a> {
    pub node: &'a ast::Ident,
    pub name: WordId,
}
impl<'a> DisplayNode<'a, ast::Ident> for Ident<'a> {
    fn from_node(node: &'a ast::Ident, builder: &mut TextBuilder) -> Ident<'a> {
        Ident {
            node,
            name: builder.add(TextConfig::identifier(&*node.sym)),
        }
    }
}

#[derive(Debug)]
pub struct Script<'a> {
    pub node: &'a ast::Script,
    pub body: SeparatedList<Stmt<'a>>,
}
impl<'a> DisplayNode<'a, ast::Script> for Script<'a> {
    fn from_node(node: &'a ast::Script, builder: &mut TextBuilder) -> Script<'a> {
        Script {
            node,
            body: node.body.iter().separated_list(builder, |b| {
                b.add(TextConfig::punctuation(";", Spacing::BreakAfter))
            }),
        }
    }
}

#[derive(Debug)]
pub struct StaticMemberExpr<'a> {
    pub node: &'a ast::MemberExpr,
    pub obj: ExprOrSuper<'a>,
    pub dot: WordId,
    pub prop: Ident<'a>,
}
impl<'a> DisplayNode<'a, ast::MemberExpr> for StaticMemberExpr<'a> {
    fn from_node(node: &'a ast::MemberExpr, builder: &mut TextBuilder) -> StaticMemberExpr<'a> {
        StaticMemberExpr {
            node,
            obj: node.obj.into_display_node(builder),
            dot: builder.add(TextConfig::punctuation(".", Spacing::None)),
            prop: match &*node.prop {
                ast::Expr::Ident(ident) => ident.into_display_node(builder),
                other => panic!("Can only use ident in static member, got {:?}", other),
            },
        }
    }
}

#[derive(Debug)]
pub struct Number<'a> {
    pub node: &'a ast::Number,
    pub value: WordId,
}
impl<'a> DisplayNode<'a, ast::Number> for Number<'a> {
    fn from_node(node: &'a ast::Number, builder: &mut TextBuilder) -> Number<'a> {
        Number {
            node,
            value: builder.add(TextConfig::literal(&node.value.to_string())),
        }
    }
}

#[derive(Debug)]
pub struct DisplayString {
    pub open: WordId,
    pub contents: WordId,
    pub close: WordId,
}

#[derive(Debug)]
pub struct Str<'a> {
    pub node: &'a ast::Str,
    pub display: DisplayString,
}
impl<'a> DisplayNode<'a, ast::Str> for Str<'a> {
    fn from_node(node: &'a ast::Str, builder: &mut TextBuilder) -> Str<'a> {
        Str {
            node,
            display: DisplayString {
                open: builder.add(TextConfig::str_quote()),
                contents: builder.add(TextConfig::str_body(&*node.value)),
                close: builder.add(TextConfig::str_quote()),
            },
        }
    }
}

#[derive(Debug)]
pub struct Super<'a> {
    pub node: &'a ast::Super,
    pub name: WordId,
}
impl<'a> DisplayNode<'a, ast::Super> for Super<'a> {
    fn from_node(node: &'a ast::Super, builder: &mut TextBuilder) -> Super<'a> {
        Super {
            node,
            name: builder.add(TextConfig::keyword("super", Spacing::None)),
        }
    }
}

#[derive(Debug)]
pub struct VarDecl<'a> {
    pub node: &'a ast::VarDecl,
    pub kind: WordId,
    pub decls: SeparatedList<VarDeclarator<'a>>,
}
impl<'a> DisplayNode<'a, ast::VarDecl> for VarDecl<'a> {
    fn from_node(node: &'a ast::VarDecl, builder: &mut TextBuilder) -> VarDecl<'a> {
        VarDecl {
            node,
            kind: builder.add(TextConfig::keyword(node.kind.as_str(), Spacing::SpaceAfter)),
            decls: node.decls.iter().separated_list(builder, |b| {
                b.add(TextConfig::punctuation(",", Spacing::SpaceAfter))
            }),
        }
    }
}

#[derive(Debug)]
pub struct VarDeclarator<'a> {
    pub node: &'a ast::VarDeclarator,
    pub name: Pat<'a>,
    pub init: Option<(WordId, Box<Expr<'a>>)>,
}
impl<'a> DisplayNode<'a, ast::VarDeclarator> for VarDeclarator<'a> {
    fn from_node(node: &'a ast::VarDeclarator, builder: &mut TextBuilder) -> VarDeclarator<'a> {
        VarDeclarator {
            node,
            name: node.name.into_display_node(builder),
            init: node
                .init
                .as_deref()
                .map::<(WordId, Box<Expr<'a>>), _>(|init| {
                    (
                        builder.add(TextConfig::new(
                            "=",
                            Spacing::SpaceAround,
                            Highlight::Operator,
                        )),
                        Box::new(init.into_display_node(builder)),
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
    fn from_node(node: &'a ast::Decl, builder: &mut TextBuilder) -> Decl<'a> {
        match node {
            ast::Decl::Var(val) => Decl::Var(val.into_display_node(builder)),
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
    fn from_node(node: &'a ast::Expr, builder: &mut TextBuilder) -> Expr<'a> {
        match node {
            ast::Expr::Bin(val) => Expr::Bin(val.into_display_node(builder)),
            ast::Expr::Call(val) => Expr::Call(val.into_display_node(builder)),
            ast::Expr::Ident(val) => Expr::Ident(val.into_display_node(builder)),
            ast::Expr::Lit(val) => Expr::Lit(val.into_display_node(builder)),
            ast::Expr::Member(val) => {
                if val.computed {
                    panic!("only static member access supported")
                } else {
                    Expr::StaticMember(val.into_display_node(builder))
                }
            }
            other => panic!("Unknown node type for Expr: {:?}", other),
        }
    }
}
impl<'a> DisplayNode<'a, Box<ast::Expr>> for Box<Expr<'a>> {
    fn from_node(node: &'a Box<ast::Expr>, builder: &mut TextBuilder) -> Self {
        Box::new(Expr::from_node(node.as_ref(), builder))
    }
}

#[derive(Debug)]
pub enum ExprOrSuper<'a> {
    Super(Super<'a>),
    Expr(Box<Expr<'a>>),
}
impl<'a> DisplayNode<'a, ast::ExprOrSuper> for ExprOrSuper<'a> {
    fn from_node(node: &'a ast::ExprOrSuper, builder: &mut TextBuilder) -> ExprOrSuper<'a> {
        match node {
            ast::ExprOrSuper::Super(val) => ExprOrSuper::Super(val.into_display_node(builder)),
            ast::ExprOrSuper::Expr(val) => ExprOrSuper::Expr(val.into_display_node(builder)),
        }
    }
}

#[derive(Debug)]
pub enum Lit<'a> {
    Str(Str<'a>),
    Num(Number<'a>),
}
impl<'a> DisplayNode<'a, ast::Lit> for Lit<'a> {
    fn from_node(node: &'a ast::Lit, builder: &mut TextBuilder) -> Lit<'a> {
        match node {
            ast::Lit::Str(val) => Lit::Str(val.into_display_node(builder)),
            ast::Lit::Num(val) => Lit::Num(val.into_display_node(builder)),
            other => panic!("Unknown node type for Lit: {:?}", other),
        }
    }
}

#[derive(Debug)]
pub enum Pat<'a> {
    Ident(Ident<'a>),
}
impl<'a> DisplayNode<'a, ast::Pat> for Pat<'a> {
    fn from_node(node: &'a ast::Pat, builder: &mut TextBuilder) -> Pat<'a> {
        match node {
            ast::Pat::Ident(val) => Pat::Ident(val.into_display_node(builder)),
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
    fn from_node(node: &'a ast::Stmt, builder: &mut TextBuilder) -> Stmt<'a> {
        match node {
            ast::Stmt::Expr(val) => Stmt::Expr(val.into_display_node(builder)),
            ast::Stmt::Decl(val) => Stmt::Decl(val.into_display_node(builder)),
            other => panic!("Unknown node type for Stmt: {:?}", other),
        }
    }
}
