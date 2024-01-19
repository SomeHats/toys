import{h as _t,b as bt}from"./chunk_utils.FedKR4y8.js";/* empty css                       */var gt={exports:{}};(function(e){var t=function(n){var a=Object.prototype,c=a.hasOwnProperty,g=Object.defineProperty||function(o,r,i){o[r]=i.value},l,h=typeof Symbol=="function"?Symbol:{},v=h.iterator||"@@iterator",ct=h.asyncIterator||"@@asyncIterator",B=h.toStringTag||"@@toStringTag";function O(o,r,i){return Object.defineProperty(o,r,{value:i,enumerable:!0,configurable:!0,writable:!0}),o[r]}try{O({},"")}catch{O=function(r,i,s){return r[i]=s}}function tt(o,r,i,s){var u=r&&r.prototype instanceof D?r:D,b=Object.create(u.prototype),p=new z(s||[]);return g(b,"_invoke",{value:st(o,i,p)}),b}n.wrap=tt;function q(o,r,i){try{return{type:"normal",arg:o.call(r,i)}}catch(s){return{type:"throw",arg:s}}}var et="suspendedStart",ut="suspendedYield",nt="executing",P="completed",S={};function D(){}function M(){}function j(){}var H={};O(H,v,function(){return this});var V=Object.getPrototypeOf,R=V&&V(V(K([])));R&&R!==a&&c.call(R,v)&&(H=R);var I=j.prototype=D.prototype=Object.create(H);M.prototype=j,g(I,"constructor",{value:j,configurable:!0}),g(j,"constructor",{value:M,configurable:!0}),M.displayName=O(j,B,"GeneratorFunction");function rt(o){["next","throw","return"].forEach(function(r){O(o,r,function(i){return this._invoke(r,i)})})}n.isGeneratorFunction=function(o){var r=typeof o=="function"&&o.constructor;return r?r===M||(r.displayName||r.name)==="GeneratorFunction":!1},n.mark=function(o){return Object.setPrototypeOf?Object.setPrototypeOf(o,j):(o.__proto__=j,O(o,B,"GeneratorFunction")),o.prototype=Object.create(I),o},n.awrap=function(o){return{__await:o}};function W(o,r){function i(b,p,m,E){var y=q(o[b],o,p);if(y.type==="throw")E(y.arg);else{var Q=y.arg,T=Q.value;return T&&typeof T=="object"&&c.call(T,"__await")?r.resolve(T.__await).then(function(k){i("next",k,m,E)},function(k){i("throw",k,m,E)}):r.resolve(T).then(function(k){Q.value=k,m(Q)},function(k){return i("throw",k,m,E)})}}var s;function u(b,p){function m(){return new r(function(E,y){i(b,p,E,y)})}return s=s?s.then(m,m):m()}g(this,"_invoke",{value:u})}rt(W.prototype),O(W.prototype,ct,function(){return this}),n.AsyncIterator=W,n.async=function(o,r,i,s,u){u===void 0&&(u=Promise);var b=new W(tt(o,r,i,s),u);return n.isGeneratorFunction(r)?b:b.next().then(function(p){return p.done?p.value:b.next()})};function st(o,r,i){var s=et;return function(b,p){if(s===nt)throw new Error("Generator is already running");if(s===P){if(b==="throw")throw p;return lt()}for(i.method=b,i.arg=p;;){var m=i.delegate;if(m){var E=ot(m,i);if(E){if(E===S)continue;return E}}if(i.method==="next")i.sent=i._sent=i.arg;else if(i.method==="throw"){if(s===et)throw s=P,i.arg;i.dispatchException(i.arg)}else i.method==="return"&&i.abrupt("return",i.arg);s=nt;var y=q(o,r,i);if(y.type==="normal"){if(s=i.done?P:ut,y.arg===S)continue;return{value:y.arg,done:i.done}}else y.type==="throw"&&(s=P,i.method="throw",i.arg=y.arg)}}}function ot(o,r){var i=r.method,s=o.iterator[i];if(s===l)return r.delegate=null,i==="throw"&&o.iterator.return&&(r.method="return",r.arg=l,ot(o,r),r.method==="throw")||i!=="return"&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+i+"' method")),S;var u=q(s,o.iterator,r.arg);if(u.type==="throw")return r.method="throw",r.arg=u.arg,r.delegate=null,S;var b=u.arg;if(!b)return r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,S;if(b.done)r[o.resultName]=b.value,r.next=o.nextLoc,r.method!=="return"&&(r.method="next",r.arg=l);else return b;return r.delegate=null,S}rt(I),O(I,B,"Generator"),O(I,v,function(){return this}),O(I,"toString",function(){return"[object Generator]"});function ft(o){var r={tryLoc:o[0]};1 in o&&(r.catchLoc=o[1]),2 in o&&(r.finallyLoc=o[2],r.afterLoc=o[3]),this.tryEntries.push(r)}function J(o){var r=o.completion||{};r.type="normal",delete r.arg,o.completion=r}function z(o){this.tryEntries=[{tryLoc:"root"}],o.forEach(ft,this),this.reset(!0)}n.keys=function(o){var r=Object(o),i=[];for(var s in r)i.push(s);return i.reverse(),function u(){for(;i.length;){var b=i.pop();if(b in r)return u.value=b,u.done=!1,u}return u.done=!0,u}};function K(o){if(o||o===""){var r=o[v];if(r)return r.call(o);if(typeof o.next=="function")return o;if(!isNaN(o.length)){var i=-1,s=function u(){for(;++i<o.length;)if(c.call(o,i))return u.value=o[i],u.done=!1,u;return u.value=l,u.done=!0,u};return s.next=s}}throw new TypeError(typeof o+" is not iterable")}n.values=K;function lt(){return{value:l,done:!0}}return z.prototype={constructor:z,reset:function(o){if(this.prev=0,this.next=0,this.sent=this._sent=l,this.done=!1,this.delegate=null,this.method="next",this.arg=l,this.tryEntries.forEach(J),!o)for(var r in this)r.charAt(0)==="t"&&c.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=l)},stop:function(){this.done=!0;var o=this.tryEntries[0],r=o.completion;if(r.type==="throw")throw r.arg;return this.rval},dispatchException:function(o){if(this.done)throw o;var r=this;function i(E,y){return b.type="throw",b.arg=o,r.next=E,y&&(r.method="next",r.arg=l),!!y}for(var s=this.tryEntries.length-1;s>=0;--s){var u=this.tryEntries[s],b=u.completion;if(u.tryLoc==="root")return i("end");if(u.tryLoc<=this.prev){var p=c.call(u,"catchLoc"),m=c.call(u,"finallyLoc");if(p&&m){if(this.prev<u.catchLoc)return i(u.catchLoc,!0);if(this.prev<u.finallyLoc)return i(u.finallyLoc)}else if(p){if(this.prev<u.catchLoc)return i(u.catchLoc,!0)}else if(m){if(this.prev<u.finallyLoc)return i(u.finallyLoc)}else throw new Error("try statement without catch or finally")}}},abrupt:function(o,r){for(var i=this.tryEntries.length-1;i>=0;--i){var s=this.tryEntries[i];if(s.tryLoc<=this.prev&&c.call(s,"finallyLoc")&&this.prev<s.finallyLoc){var u=s;break}}u&&(o==="break"||o==="continue")&&u.tryLoc<=r&&r<=u.finallyLoc&&(u=null);var b=u?u.completion:{};return b.type=o,b.arg=r,u?(this.method="next",this.next=u.finallyLoc,S):this.complete(b)},complete:function(o,r){if(o.type==="throw")throw o.arg;return o.type==="break"||o.type==="continue"?this.next=o.arg:o.type==="return"?(this.rval=this.arg=o.arg,this.method="return",this.next="end"):o.type==="normal"&&r&&(this.next=r),S},finish:function(o){for(var r=this.tryEntries.length-1;r>=0;--r){var i=this.tryEntries[r];if(i.finallyLoc===o)return this.complete(i.completion,i.afterLoc),J(i),S}},catch:function(o){for(var r=this.tryEntries.length-1;r>=0;--r){var i=this.tryEntries[r];if(i.tryLoc===o){var s=i.completion;if(s.type==="throw"){var u=s.arg;J(i)}return u}}throw new Error("illegal catch attempt")},delegateYield:function(o,r,i){return this.delegate={iterator:K(o),resultName:r,nextLoc:i},this.method==="next"&&(this.arg=l),S}},n}(e.exports);try{regeneratorRuntime=t}catch{typeof globalThis=="object"?globalThis.regeneratorRuntime=t:Function("r","regeneratorRuntime = r")(t)}})(gt);let w;const A=new Array(32).fill(void 0);A.push(void 0,null,!0,!1);function f(e){return A[e]}let N=A.length;function ht(e){e<36||(A[e]=N,N=e)}function X(e){const t=f(e);return ht(e),t}function _(e){N===A.length&&A.push(A.length+1);const t=N;return N=A[t],A[t]=e,t}const it=new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0});it.decode();let U=new Uint8Array;function $(){return U.byteLength===0&&(U=new Uint8Array(w.memory.buffer)),U}function L(e,t){return it.decode($().subarray(e,e+t))}function Z(e){const t=typeof e;if(t=="number"||t=="boolean"||e==null)return`${e}`;if(t=="string")return`"${e}"`;if(t=="symbol"){const c=e.description;return c==null?"Symbol":`Symbol(${c})`}if(t=="function"){const c=e.name;return typeof c=="string"&&c.length>0?`Function(${c})`:"Function"}if(Array.isArray(e)){const c=e.length;let g="[";c>0&&(g+=Z(e[0]));for(let l=1;l<c;l++)g+=", "+Z(e[l]);return g+="]",g}const n=/\[object ([^\]]+)\]/.exec(toString.call(e));let a;if(n.length>1)a=n[1];else return toString.call(e);if(a=="Object")try{return"Object("+JSON.stringify(e)+")"}catch{return"Object"}return e instanceof Error?`${e.name}: ${e.message}
${e.stack}`:a}let G=0;const F=new TextEncoder("utf-8"),wt=typeof F.encodeInto=="function"?function(e,t){return F.encodeInto(e,t)}:function(e,t){const n=F.encode(e);return t.set(n),{read:e.length,written:n.length}};function x(e,t,n){if(n===void 0){const h=F.encode(e),v=t(h.length);return $().subarray(v,v+h.length).set(h),G=h.length,v}let a=e.length,c=t(a);const g=$();let l=0;for(;l<a;l++){const h=e.charCodeAt(l);if(h>127)break;g[c+l]=h}if(l!==a){l!==0&&(e=e.slice(l)),c=n(c,a,a=l+e.length*3);const h=$().subarray(c+l,c+a),v=wt(e,h);l+=v.written}return G=l,c}let Y=new Int32Array;function C(){return Y.byteLength===0&&(Y=new Int32Array(w.memory.buffer)),Y}function dt(e,t,n,a){const c={a:e,b:t,cnt:1,dtor:n},g=(...l)=>{c.cnt++;const h=c.a;c.a=0;try{return a(h,c.b,...l)}finally{--c.cnt===0?w.__wbindgen_export_2.get(c.dtor)(h,c.b):c.a=h}};return g.original=c,g}function pt(e,t,n){w.wasm_bindgen__convert__closures__invoke1_mut__h9e6eb11990a7d1fd(e,t,_(n))}function mt(e,t){const n=x(e,w.__wbindgen_malloc,w.__wbindgen_realloc),a=G,c=w.start(n,a,_(t));return X(c)}function yt(e){return e==null}function d(e,t){try{return e.apply(this,t)}catch(n){w.__wbindgen_exn_store(_(n))}}function vt(e,t,n,a){w.wasm_bindgen__convert__closures__invoke2_mut__h99db2a04cd91e9c1(e,t,_(n),_(a))}async function Et(e,t){if(typeof Response=="function"&&e instanceof Response){if(typeof WebAssembly.instantiateStreaming=="function")try{return await WebAssembly.instantiateStreaming(e,t)}catch(a){if(e.headers.get("Content-Type")!="application/wasm")console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",a);else throw a}const n=await e.arrayBuffer();return await WebAssembly.instantiate(n,t)}else{const n=await WebAssembly.instantiate(e,t);return n instanceof WebAssembly.Instance?{instance:n,module:e}:n}}function Lt(){const e={};return e.wbg={},e.wbg.__wbindgen_object_drop_ref=function(t){X(t)},e.wbg.__wbindgen_number_new=function(t){return _(t)},e.wbg.__wbindgen_object_clone_ref=function(t){const n=f(t);return _(n)},e.wbg.__wbindgen_string_new=function(t,n){const a=L(t,n);return _(a)},e.wbg.__wbindgen_json_parse=function(t,n){const a=JSON.parse(L(t,n));return _(a)},e.wbg.__wbg_new_693216e109162396=function(){const t=new Error;return _(t)},e.wbg.__wbg_stack_0ddaca5d1abfb52f=function(t,n){const a=f(n).stack,c=x(a,w.__wbindgen_malloc,w.__wbindgen_realloc),g=G;C()[t/4+1]=g,C()[t/4+0]=c},e.wbg.__wbg_error_09919627ac0992f5=function(t,n){try{console.error(L(t,n))}finally{w.__wbindgen_free(t,n)}},e.wbg.__wbindgen_cb_drop=function(t){const n=X(t).original;return n.cnt--==1?(n.a=0,!0):!1},e.wbg.__wbg_instanceof_Window_42f092928baaee84=function(t){return f(t)instanceof Window},e.wbg.__wbg_document_15b2e504fb1556d6=function(t){const n=f(t).document;return yt(n)?0:_(n)},e.wbg.__wbg_createElement_28fc3740fb11defb=function(){return d(function(t,n,a){const c=f(t).createElement(L(n,a));return _(c)},arguments)},e.wbg.__wbg_setclassName_18f97d7a3caee0c3=function(t,n,a){f(t).className=L(n,a)},e.wbg.__wbg_setAttribute_8cfc462c0dedd03b=function(){return d(function(t,n,a,c,g){f(t).setAttribute(L(n,a),L(c,g))},arguments)},e.wbg.__wbg_remove_1776bb0393035a24=function(t){f(t).remove()},e.wbg.__wbg_setProperty_e0774a610618c48e=function(){return d(function(t,n,a,c,g){f(t).setProperty(L(n,a),L(c,g))},arguments)},e.wbg.__wbg_settextContent_8db6b500abb6e3ae=function(t,n,a){f(t).textContent=n===0?void 0:L(n,a)},e.wbg.__wbg_appendChild_d21bac021b5bbfde=function(){return d(function(t,n){const a=f(t).appendChild(f(n));return _(a)},arguments)},e.wbg.__wbg_log_17733ab6fa45831d=function(t){console.log(f(t))},e.wbg.__wbg_instanceof_HtmlElement_057bfd3477e9b9b6=function(t){return f(t)instanceof HTMLElement},e.wbg.__wbg_style_365767989176e8d2=function(t){const n=f(t).style;return _(n)},e.wbg.__wbg_finished_fb8e2d051afd267f=function(){return d(function(t){const n=f(t).finished;return _(n)},arguments)},e.wbg.__wbg_newwitheffect_59b817dfee01f6cd=function(){return d(function(t){const n=new Animation(f(t));return _(n)},arguments)},e.wbg.__wbg_play_ed8e013500cba514=function(){return d(function(t){f(t).play()},arguments)},e.wbg.__wbg_newwithoptelementandkeyframesandkeyframeeffectoptions_3a7ece4d7863ea0a=function(){return d(function(t,n,a){const c=new KeyframeEffect(f(t),f(n),f(a));return _(c)},arguments)},e.wbg.__wbg_newnoargs_971e9a5abe185139=function(t,n){const a=new Function(L(t,n));return _(a)},e.wbg.__wbg_call_33d7bcddbbfa394a=function(){return d(function(t,n){const a=f(t).call(f(n));return _(a)},arguments)},e.wbg.__wbg_new_e6a9fecc2bf26696=function(){const t=new Object;return _(t)},e.wbg.__wbg_self_fd00a1ef86d1b2ed=function(){return d(function(){const t=self.self;return _(t)},arguments)},e.wbg.__wbg_window_6f6e346d8bbd61d7=function(){return d(function(){const t=window.window;return _(t)},arguments)},e.wbg.__wbg_globalThis_3348936ac49df00a=function(){return d(function(){const t=globalThis.globalThis;return _(t)},arguments)},e.wbg.__wbg_global_67175caf56f55ca9=function(){return d(function(){const t=global.global;return _(t)},arguments)},e.wbg.__wbindgen_is_undefined=function(t){return f(t)===void 0},e.wbg.__wbg_call_65af9f665ab6ade5=function(){return d(function(t,n,a){const c=f(t).call(f(n),f(a));return _(c)},arguments)},e.wbg.__wbg_instanceof_Object_9657a9e91b05959b=function(t){return f(t)instanceof Object},e.wbg.__wbg_new_52205195aa880fc2=function(t,n){try{var a={a:t,b:n},c=(l,h)=>{const v=a.a;a.a=0;try{return vt(v,a.b,l,h)}finally{a.a=v}};const g=new Promise(c);return _(g)}finally{a.a=a.b=0}},e.wbg.__wbg_resolve_0107b3a501450ba0=function(t){const n=Promise.resolve(f(t));return _(n)},e.wbg.__wbg_then_18da6e5453572fc8=function(t,n){const a=f(t).then(f(n));return _(a)},e.wbg.__wbg_then_e5489f796341454b=function(t,n,a){const c=f(t).then(f(n),f(a));return _(c)},e.wbg.__wbg_set_2762e698c2f5b7e0=function(){return d(function(t,n,a){return Reflect.set(f(t),f(n),f(a))},arguments)},e.wbg.__wbindgen_debug_string=function(t,n){const a=Z(f(n)),c=x(a,w.__wbindgen_malloc,w.__wbindgen_realloc),g=G;C()[t/4+1]=g,C()[t/4+0]=c},e.wbg.__wbindgen_throw=function(t,n){throw new Error(L(t,n))},e.wbg.__wbindgen_closure_wrapper1635=function(t,n,a){const c=dt(t,n,613,pt);return _(c)},e}function St(e,t){return w=e.exports,at.__wbindgen_wasm_module=t,Y=new Int32Array,U=new Uint8Array,w}async function at(e){typeof e>"u"&&(e=new URL("/toys/static/asset_slomojs_bg.1xLItNYV.wasm",import.meta.url));const t=Lt();(typeof e=="string"||typeof Request=="function"&&e instanceof Request||typeof URL=="function"&&e instanceof URL)&&(e=fetch(e));const{instance:n,module:a}=await Et(await e,t);return St(n,a)}typeof Animation>"u"&&(window.Animation=document.body.animate({}).constructor);_t(Animation.prototype,"finished")||(console.log("add finished polyfill"),Object.defineProperty(Animation.prototype,"finished",{get(){return this._finished||(this._finished=this.playState==="finished"?Promise.resolve():new Promise((e,t)=>{this.addEventListener("finish",e,{once:!0}),this.addEventListener("cancel",t,{once:!0})})),this._finished}}));const Ot=`
let a = 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10;
let b = "hello" + " " + "world";
let x = 1 + 2000 + 3 + "hiii", a = 1, b = 2, c;
let y = "hello" + x;
log(y, x, a, b + b + a, log);
let str = "hello, world";
log(str);
__debugScope();
log(__debugScope);
`.trim();at(new URL("/toys/static/asset_slomojs_bg.1xLItNYV.wasm",import.meta.url)).then(()=>mt(Ot,bt(document.getElementById("root"),'Assertion Error: document.getElementById("root")'))).then(e=>console.log("success",e)).catch(e=>console.log("error",e));
