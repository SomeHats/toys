use crate::display_list::{
    DisplayList, DisplayListTransaction, DisplayTextId, InsertPosition, TextConfig, Transition,
};
use crate::t;
use crate::t::DisplayString;
use futures::future::{FutureExt, LocalBoxFuture};
use std::collections::HashMap;
use std::rc::Rc;
use swc_ecma_ast as ast;

#[derive(Clone, Debug)]
pub enum BindingKind {
    Let,
}

#[derive(Debug)]
pub struct Binding {
    kind: BindingKind,
    value: Value,
}

impl Binding {
    fn new(kind: BindingKind, value: Value) -> Self {
        Self { kind, value }
    }
}

#[derive(Debug)]
pub struct Scope {
    bindings: HashMap<String, Binding>,
}

impl Scope {
    pub fn new() -> Scope {
        Scope {
            bindings: HashMap::new(),
        }
    }

    pub fn add_binding(&mut self, name: &str, binding: Binding) {
        self.bindings.insert(name.to_string(), binding);
    }

    pub fn lookup_ident(&self, ident: &t::Ident) -> Completion<&Binding> {
        match self.bindings.get(&ident.node.sym.to_string()) {
            Some(binding) => Ok(&binding),
            None => panic!("TODO: reference error? {}", ident.node.sym),
        }
    }
}

pub struct ExecutionContext {
    display_list: DisplayList,
    scope: Scope,
}

impl ExecutionContext {
    pub fn new_with_defaults(display_list: DisplayList) -> Self {
        let mut ctx = Self {
            display_list,
            scope: Scope::new(),
        };

        for (name, value) in vec![
            ("log", BuiltinFunction::Log),
            ("__debugScope", BuiltinFunction::DebugScope),
        ] {
            ctx.scope.add_binding(
                name,
                Binding::new(
                    BindingKind::Let,
                    Value::Function(FunctionValue::new(
                        Rc::new(value),
                        ctx.display_list.add_text_hidden(TextConfig::builtin(name)),
                    )),
                ),
            )
        }

        ctx
    }
}

type Completion<T> = Result<T, String>;

#[derive(Clone, Debug)]
struct DisplayValue<Value, Display> {
    value: Value,
    display: Display,
}

impl<Value, Display> DisplayValue<Value, Display> {
    fn new(value: Value, display: Display) -> Self {
        Self { value, display }
    }
}

type SimpleDisplayValue<Value> = DisplayValue<Value, DisplayTextId>;
type UndefinedValue = SimpleDisplayValue<()>;
type StringValue = DisplayValue<String, DisplayString>;
type NumberValue = SimpleDisplayValue<f64>;
type FunctionValue = SimpleDisplayValue<Rc<dyn Function>>;

#[derive(Clone, Debug)]
enum Value {
    Undefined(UndefinedValue),
    String(StringValue),
    Number(NumberValue),
    Function(FunctionValue),
}

impl Value {
    fn duplicate_animated(
        &self,
        animate: &mut DisplayListTransaction,
        transition: Transition,
        insert_position: InsertPosition,
    ) -> Self {
        match self {
            Self::Undefined(val) => Self::Undefined(UndefinedValue::new(
                (),
                animate.clone_item(transition, insert_position, val.display),
            )),
            Self::String(val) => {
                let open = animate.clone_item(transition, insert_position, val.display.open);
                let contents = animate.clone_item(
                    transition,
                    InsertPosition::After(open),
                    val.display.contents,
                );
                let close = animate.clone_item(
                    transition,
                    InsertPosition::After(contents),
                    val.display.close,
                );
                Self::String(StringValue::new(
                    val.value.clone(),
                    DisplayString {
                        open,
                        close,
                        contents,
                    },
                ))
            }
            Self::Number(val) => Self::Number(NumberValue::new(
                val.value,
                animate.clone_item(transition, insert_position, val.display),
            )),
            Self::Function(val) => Self::Function(FunctionValue::new(
                val.value.clone(),
                animate.clone_item(transition, insert_position, val.display),
            )),
        }
    }
}

trait Function: std::fmt::Debug {
    fn call<'a>(
        &'a self,
        this: Value,
        args: Vec<Value>,
        ctx: &'a mut ExecutionContext,
    ) -> LocalBoxFuture<'a, Completion<Value>>;
}

// 6.1 https://www.ecma-international.org/ecma-262/#sec-ecmascript-language-types
#[derive(Debug, PartialEq)]
enum Type {
    Undefined,
    String,
    Number,
    Function,
}

fn get_type(value: &Value) -> Type {
    match value {
        Value::Undefined(_) => Type::Undefined,
        Value::String(_) => Type::String,
        Value::Number(_) => Type::Number,
        Value::Function(_) => Type::Function,
    }
}

// 7.1.1 https://www.ecma-international.org/ecma-262/#sec-toprimitive
enum ToPrimitivePreferredType {
    Default,
    String,
    Number,
}
async fn to_primitive(input: Value, preferred_type: ToPrimitivePreferredType) -> Completion<Value> {
    // TODO: handle objects
    Ok(input.clone())
}

// 7.1.17 https://www.ecma-international.org/ecma-262/#sec-tostring
async fn to_string(input: Value, ctx: &mut ExecutionContext) -> Completion<StringValue> {
    match input {
        Value::Number(num) => {
            let num_str = format!("{}", num.value);
            let str_display = ctx
                .display_list
                .animate(|mut animate| {
                    animate.remove_item(Transition::Animated, num.display);
                    let open = animate.insert_item(
                        Transition::Animated,
                        InsertPosition::Before(num.display),
                        TextConfig::str_quote(),
                    );
                    let contents = animate.insert_item(
                        Transition::Animated,
                        InsertPosition::After(num.display),
                        TextConfig::str_body(&num_str),
                    );
                    let close = animate.insert_item(
                        Transition::Animated,
                        InsertPosition::After(contents),
                        TextConfig::str_quote(),
                    );
                    DisplayString {
                        open,
                        contents,
                        close,
                    }
                })
                .await;
            Ok(StringValue::new(num_str, str_display))
        }
        Value::String(str) => Ok(str.clone()),
        other => panic!("unimplemented to_string {:?}", other),
    }
}

// 7.1.3 https://www.ecma-international.org/ecma-262/#sec-tonumeric
async fn to_numeric(value: Value, ctx: &mut ExecutionContext) -> Completion<NumberValue> {
    let prim_value = to_primitive(value, ToPrimitivePreferredType::Number).await?;
    Ok(to_number(prim_value, ctx).await?)
}

// 7.1.4 https://www.ecma-international.org/ecma-262/#sec-tonumber
async fn to_number(value: Value, _ctx: &mut ExecutionContext) -> Completion<NumberValue> {
    match value {
        Value::Number(val) => Ok(val.clone()),
        other => panic!("unimplemented to_number {:?}", other),
    }
}

async fn eval_bin_expr(expr: t::BinExpr<'_>, ctx: &mut ExecutionContext) -> Completion<Value> {
    let node = expr.node;
    let left = expr.left;
    let right = expr.right;
    let op = expr.op;
    match node.op {
        // 12.8.3.1 https://www.ecma-international.org/ecma-262/#sec-addition-operator-plus-runtime-semantics-evaluation
        ast::BinaryOp::Add => {
            let lval = eval_expr(*left, ctx).await?;
            let rval = eval_expr(*right, ctx).await?;
            let lprim = to_primitive(lval, ToPrimitivePreferredType::Default).await?;
            let rprim = to_primitive(rval, ToPrimitivePreferredType::Default).await?;

            match (&lprim, &rprim) {
                (Value::String(_), _) | (_, Value::String(_)) => {
                    let lstr = to_string(lprim, ctx).await?;
                    let rstr = to_string(rprim, ctx).await?;
                    let joined_str = format!("{}{}", lstr.value, rstr.value);

                    ctx.display_list
                        .animate(|mut animate| {
                            animate.remove_item(Transition::Animated, lstr.display.close);
                            animate.remove_item(Transition::Animated, op);
                            animate.remove_item(Transition::Animated, rstr.display.open);
                        })
                        .await;
                    let display_str = ctx
                        .display_list
                        .animate(|mut animate| {
                            animate.remove_item(Transition::Instant, lstr.display.contents);
                            animate.remove_item(Transition::Instant, rstr.display.contents);
                            let new_contents = animate.insert_item(
                                Transition::Instant,
                                InsertPosition::Before(lstr.display.contents),
                                TextConfig::str_body(&joined_str),
                            );
                            DisplayString {
                                open: lstr.display.open,
                                contents: new_contents,
                                close: rstr.display.close,
                            }
                        })
                        .await;
                    Ok(Value::String(StringValue::new(joined_str, display_str)))
                }
                _ => {
                    let lnum = to_numeric(lprim, ctx).await?;
                    let rnum = to_numeric(rprim, ctx).await?;
                    let value = lnum.value + rnum.value;

                    let display = ctx
                        .display_list
                        .animate(|mut animate| {
                            animate.remove_item(Transition::Animated, lnum.display);
                            animate.remove_item(Transition::Animated, op);
                            animate.remove_item(Transition::Animated, rnum.display);
                            animate.insert_item(
                                Transition::Animated,
                                InsertPosition::After(rnum.display),
                                TextConfig::literal(&value.to_string()),
                            )
                        })
                        .await;

                    Ok(Value::Number(NumberValue::new(value, display)))
                }
            }
        }
        other => panic!("unknown binary op {}", other),
    }
}

async fn eval_call_expr(
    call_expr: t::CallExpr<'_>,
    ctx: &mut ExecutionContext,
) -> Completion<Value> {
    let callee = match call_expr.callee {
        t::ExprOrSuper::Expr(expr) => eval_expr(*expr, ctx).await?,
        t::ExprOrSuper::Super(_) => panic!("unsupported super"),
    };

    let mut args = Vec::with_capacity(call_expr.args.items.len());
    for (expr_or_spread, _) in call_expr.args.into_iter() {
        let value = match expr_or_spread.spread {
            Some(_) => panic!("Unsupported spread"),
            None => eval_expr(*expr_or_spread.expr, ctx).await?,
        };

        args.push(value);
    }

    let result = match callee {
        Value::Function(func) => {
            func.value
                .call(
                    Value::Undefined(UndefinedValue::new(
                        (),
                        ctx.display_list.add_text_hidden(TextConfig::undefined()),
                    )),
                    args,
                    ctx,
                )
                .await?
        }
        other => panic!("Unknown call type: {:?}", other),
    };

    Ok(result)
}

async fn eval_decl(stmt: t::Decl<'_>, ctx: &mut ExecutionContext) -> Completion<()> {
    match stmt {
        t::Decl::Var(var) => Ok(eval_var_decl(var, ctx).await?),
    }
}

fn eval_expr<'a>(
    expr: t::Expr<'a>,
    ctx: &'a mut ExecutionContext,
) -> LocalBoxFuture<'a, Completion<Value>> {
    async move {
        match expr {
            t::Expr::Bin(bin_expr) => Ok(eval_bin_expr(bin_expr, ctx).await?),
            t::Expr::Call(call_expr) => Ok(eval_call_expr(call_expr, ctx).await?),
            t::Expr::Ident(ident) => {
                let binding = ctx.scope.lookup_ident(&ident)?;
                let local = ctx
                    .display_list
                    .animate(|mut animate| {
                        animate.remove_item(Transition::Animated, ident.name);
                        binding.value.duplicate_animated(
                            &mut animate,
                            Transition::Animated,
                            InsertPosition::After(ident.name),
                        )
                    })
                    .await;
                Ok(local)
            }
            t::Expr::Lit(lit) => Ok(eval_lit(lit, ctx).await?),
            other => panic!("unknown expr {:?}", other),
        }
    }
    .boxed_local()
}

async fn eval_expr_stmt(stmt: t::ExprStmt<'_>, ctx: &mut ExecutionContext) -> Completion<()> {
    eval_expr(stmt.expr, ctx).await?;
    Ok(())
}

async fn eval_lit(lit: t::Lit<'_>, ctx: &mut ExecutionContext) -> Completion<Value> {
    match lit {
        t::Lit::Num(val) => Ok(eval_number(val, ctx).await),
        t::Lit::Str(val) => Ok(eval_str(val)),
    }
}

async fn eval_number(num: t::Number<'_>, _ctx: &mut ExecutionContext) -> Value {
    Value::Number(NumberValue::new(num.node.value, num.value))
}

pub async fn eval_script(script: t::Script<'_>, ctx: &mut ExecutionContext) -> Completion<()> {
    for (stmt, _) in script.body.into_iter() {
        eval_stmt(stmt, ctx).await?;
    }
    Ok(())
}

async fn eval_stmt(stmt: t::Stmt<'_>, ctx: &mut ExecutionContext) -> Completion<()> {
    match stmt {
        t::Stmt::Decl(decl) => Ok(eval_decl(decl, ctx).await?),
        t::Stmt::Expr(expr) => Ok(eval_expr_stmt(expr, ctx).await?),
    }
}

fn eval_str(val: t::Str<'_>) -> Value {
    Value::String(StringValue::new(val.node.value.to_string(), val.display))
}

async fn eval_var_decl(decl: t::VarDecl<'_>, ctx: &mut ExecutionContext) -> Completion<()> {
    let kind = match decl.node.kind {
        ast::VarDeclKind::Let => BindingKind::Let,
        other => panic!("Unknown var decl kind: {:?}", other),
    };

    for (var, _) in decl.decls.into_iter() {
        let init = match var.init {
            Some((_, expr)) => eval_expr(*expr, ctx).await?,
            None => Value::Undefined(UndefinedValue::new(
                (),
                ctx.display_list
                    .animate(|mut animate| {
                        let eq = animate.insert_item(
                            Transition::Animated,
                            match &var.name {
                                t::Pat::Ident(ident) => InsertPosition::After(ident.name),
                                // other => panic!("unknown pat type {:?}", other),
                            },
                            TextConfig::spaced_operator("="),
                        );
                        animate.insert_item(
                            Transition::Animated,
                            InsertPosition::After(eq),
                            TextConfig::undefined(),
                        )
                    })
                    .await,
            )),
        };

        let name = match &var.node.name {
            ast::Pat::Ident(ident) => ident.sym.to_string(),
            other => panic!("unknown name type {:?}", other),
        };
        crate::log!("Add binding {:?} with value {:?}", name, init);

        ctx.scope
            .add_binding(&name, Binding::new(kind.clone(), init));
    }
    Ok(())
}

#[derive(Debug)]
enum BuiltinFunction {
    Log,
    DebugScope,
}

impl Function for BuiltinFunction {
    fn call<'a>(
        &'a self,
        _this: Value,
        args: Vec<Value>,
        ctx: &'a mut ExecutionContext,
    ) -> LocalBoxFuture<'a, Completion<Value>> {
        async move {
            match self {
                BuiltinFunction::Log => {
                    crate::log!("{:?}", args);
                    Ok(Value::Undefined(UndefinedValue::new(
                        (),
                        ctx.display_list.add_text_hidden(TextConfig::undefined()),
                    )))
                }
                BuiltinFunction::DebugScope => {
                    crate::log!("{:#?}", ctx.scope);
                    Ok(Value::Undefined(UndefinedValue::new(
                        (),
                        ctx.display_list.add_text_hidden(TextConfig::undefined()),
                    )))
                }
            }
        }
        .boxed_local()
    }
}