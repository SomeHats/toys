use crate::display_list::DisplayList;
use crate::t;
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
  pub fn new(kind: BindingKind, value: Value) -> Self {
    Self { kind, value }
  }
}

#[derive(Debug)]
pub struct Scope {
  bindings: HashMap<String, Binding>,
}

impl Scope {
  pub fn new_with_defaults() -> Scope {
    let mut scope = Scope {
      bindings: HashMap::new(),
    };

    for (name, value) in vec![
      ("log", BuiltinFunction::Log),
      ("__debugScope", BuiltinFunction::DebugScope),
    ] {
      scope.add_binding(
        name,
        Binding::new(BindingKind::Let, Value::Function(Rc::new(value))),
      )
    }

    scope
  }

  pub fn add_binding(&mut self, name: &str, binding: Binding) {
    self.bindings.insert(name.to_string(), binding);
  }

  pub fn lookup_ident(&self, ident: &t::Ident) -> Completion<Value> {
    match self.bindings.get(&ident.node.sym.to_string()) {
      Some(binding) => Ok(binding.value.clone()),
      None => panic!("TODO: reference error? {}", ident.node.sym),
    }
  }
}

pub struct ExecutionContext {
  display_list: DisplayList,
  scope: Scope,
}

impl ExecutionContext {
  pub fn new(display_list: DisplayList) -> Self {
    Self {
      display_list,
      scope: Scope::new_with_defaults(),
    }
  }
}

type Completion<T> = Result<T, String>;

#[derive(Clone, Debug)]
pub enum Value {
  Undefined,
  Null,
  Boolean(bool),
  String(String),
  Number(f64),
  Function(Rc<dyn Function>),
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
  Null,
  Boolean,
  String,
  Number,
  Function,
}

fn get_type(value: &Value) -> Type {
  match value {
    Value::Undefined => Type::Undefined,
    Value::Null => Type::Null,
    Value::Boolean(_) => Type::Boolean,
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
async fn to_primitive(
  input: &Value,
  preferred_type: ToPrimitivePreferredType,
) -> Completion<Value> {
  // TODO: handle objects
  Ok(input.clone())
}

// 7.1.17 https://www.ecma-international.org/ecma-262/#sec-tostring
async fn to_string(input: &Value, ctx: &mut ExecutionContext) -> Completion<String> {
  match input {
    Value::Undefined => Ok("undefined".to_string()),
    Value::Null => Ok("null".to_string()),
    Value::Boolean(val) => {
      if *val {
        Ok("true".to_string())
      } else {
        Ok("false".to_string())
      }
    }
    Value::Number(num) => {
      // TODO: Number.toString
      Ok(format!("{}", num).to_string())
    }
    Value::String(str) => Ok(str.clone()),
    other => panic!("unimplemented to_string {:?}", other),
  }
}

// 7.1.3 https://www.ecma-international.org/ecma-262/#sec-tonumeric
async fn to_numeric(value: &Value, ctx: &mut ExecutionContext) -> Completion<f64> {
  let prim_value = to_primitive(value, ToPrimitivePreferredType::Number).await?;
  Ok(to_number(&prim_value, ctx).await?)
}

// 7.1.4 https://www.ecma-international.org/ecma-262/#sec-tonumber
async fn to_number(value: &Value, ctx: &mut ExecutionContext) -> Completion<f64> {
  match value {
    Value::Undefined => Ok(f64::NAN),
    Value::Null => Ok(0.),
    Value::Boolean(val) => {
      if *val {
        Ok(1.)
      } else {
        Ok(0.)
      }
    }
    Value::Number(val) => Ok(*val),
    other => panic!("unimplemented to_number {:?}", other),
  }
}

async fn eval_bin_expr(expr: &t::BinExpr<'_>, ctx: &mut ExecutionContext) -> Completion<Value> {
  let node = expr.node;
  match node.op {
    // 12.8.3.1 https://www.ecma-international.org/ecma-262/#sec-addition-operator-plus-runtime-semantics-evaluation
    ast::BinaryOp::Add => {
      let lval = eval_expr(&expr.left, ctx).await?;
      let rval = eval_expr(&expr.right, ctx).await?;
      let lprim = to_primitive(&lval, ToPrimitivePreferredType::Default).await?;
      let rprim = to_primitive(&rval, ToPrimitivePreferredType::Default).await?;

      match (&lprim, &rprim) {
        (Value::String(_), _) | (_, Value::String(_)) => {
          let lstr = to_string(&lprim, ctx).await?;
          let rstr = to_string(&rprim, ctx).await?;
          Ok(Value::String(format!("{}{}", lstr, rstr)))
        }
        _ => {
          let lnum = to_numeric(&lprim, ctx).await?;
          let rnum = to_numeric(&rprim, ctx).await?;

          Ok(Value::Number(lnum + rnum))
        }
      }
    }
    other => panic!("unknown binary op {}", other),
  }
}

async fn eval_call_expr(
  call_expr: &t::CallExpr<'_>,
  ctx: &mut ExecutionContext,
) -> Completion<Value> {
  let callee = match &*call_expr.callee {
    t::ExprOrSuper::Expr(expr) => eval_expr(&expr, ctx).await?,
    t::ExprOrSuper::Super(_) => panic!("unsupported super"),
  };

  let mut args = Vec::with_capacity(call_expr.args.items.len());
  for (expr_or_spread, _) in call_expr.args.iter() {
    let value = match expr_or_spread.spread {
      Some(_) => panic!("Unsupported spread"),
      None => eval_expr(&expr_or_spread.expr, ctx).await?,
    };

    args.push(value);
  }

  let result = match callee {
    Value::Function(func) => func.call(Value::Undefined, args, ctx).await?,
    other => panic!("Unknown call type: {:?}", other),
  };

  Ok(result)
}

async fn eval_decl(stmt: &t::Decl<'_>, ctx: &mut ExecutionContext) -> Completion<()> {
  match stmt {
    t::Decl::Var(var) => Ok(eval_var_decl(var, ctx).await?),
  }
}

fn eval_expr<'a>(
  expr: &'a t::Expr<'a>,
  ctx: &'a mut ExecutionContext,
) -> LocalBoxFuture<'a, Completion<Value>> {
  async move {
    match expr {
      t::Expr::Bin(bin_expr) => Ok(eval_bin_expr(bin_expr, ctx).await?),
      t::Expr::Call(call_expr) => Ok(eval_call_expr(call_expr, ctx).await?),
      t::Expr::Ident(ident) => Ok(ctx.scope.lookup_ident(ident)?),
      t::Expr::Lit(lit) => Ok(eval_lit(lit, ctx).await?),
      other => panic!("unknown expr {:?}", other),
    }
  }
  .boxed_local()
}

async fn eval_expr_stmt(stmt: &t::ExprStmt<'_>, ctx: &mut ExecutionContext) -> Completion<()> {
  eval_expr(&stmt.expr, ctx).await?;
  Ok(())
}

async fn eval_lit(lit: &t::Lit<'_>, ctx: &mut ExecutionContext) -> Completion<Value> {
  match lit {
    t::Lit::Num(val) => Ok(eval_number(val)),
    t::Lit::Str(val) => Ok(eval_str(val)),
  }
}

fn eval_number(num: &t::Number<'_>) -> Value {
  Value::Number(num.node.value)
}

pub async fn eval_script(script: &t::Script<'_>, ctx: &mut ExecutionContext) -> Completion<()> {
  for (stmt, _) in script.body.iter() {
    eval_stmt(&stmt, ctx).await?;
  }
  Ok(())
}

async fn eval_stmt(stmt: &t::Stmt<'_>, ctx: &mut ExecutionContext) -> Completion<()> {
  match stmt {
    t::Stmt::Decl(decl) => Ok(eval_decl(decl, ctx).await?),
    t::Stmt::Expr(expr) => Ok(eval_expr_stmt(expr, ctx).await?),
  }
}

fn eval_str(val: &t::Str<'_>) -> Value {
  Value::String(val.node.value.to_string())
}

async fn eval_var_decl(decl: &t::VarDecl<'_>, ctx: &mut ExecutionContext) -> Completion<()> {
  let kind = match decl.node.kind {
    ast::VarDeclKind::Let => BindingKind::Let,
    other => panic!("Unknown var decl kind: {:?}", other),
  };

  for (var, _) in decl.decls.iter() {
    let init = match &var.init {
      Some((_, expr)) => eval_expr(&expr, ctx).await?,
      None => Value::Undefined,
    };

    let name = match &var.node.name {
      ast::Pat::Ident(ident) => ident.sym.to_string(),
      other => panic!("TODO: unknown name type {:?}", other),
    };
    crate::log!("Add binding {:?} with value {:?}", name, init);

    ctx
      .scope
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
          Ok(Value::Undefined)
        }
        BuiltinFunction::DebugScope => {
          crate::log!("{:#?}", ctx.scope);
          Ok(Value::Undefined)
        }
      }
    }
    .boxed_local()
  }
}
