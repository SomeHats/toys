import{h as bt,b as gt}from"./chunk_assert.30730bef.js";/* empty css                       */var at={},ht={get exports(){return at},set exports(e){at=e}};(function(e){var t=function(n){var a=Object.prototype,c=a.hasOwnProperty,g=Object.defineProperty||function(o,r,i){o[r]=i.value},_,h=typeof Symbol=="function"?Symbol:{},v=h.iterator||"@@iterator",st=h.asyncIterator||"@@asyncIterator",q=h.toStringTag||"@@toStringTag";function O(o,r,i){return Object.defineProperty(o,r,{value:i,enumerable:!0,configurable:!0,writable:!0}),o[r]}try{O({},"")}catch{O=function(r,i,s){return r[i]=s}}function tt(o,r,i,s){var u=r&&r.prototype instanceof H?r:H,b=Object.create(u.prototype),p=new K(s||[]);return g(b,"_invoke",{value:_t(o,i,p)}),b}n.wrap=tt;function D(o,r,i){try{return{type:"normal",arg:o.call(r,i)}}catch(s){return{type:"throw",arg:s}}}var et="suspendedStart",ft="suspendedYield",nt="executing",P="completed",S={};function H(){}function M(){}function j(){}var Y={};O(Y,v,function(){return this});var J=Object.getPrototypeOf,R=J&&J(J(V([])));R&&R!==a&&c.call(R,v)&&(Y=R);var I=j.prototype=H.prototype=Object.create(Y);M.prototype=j,g(I,"constructor",{value:j,configurable:!0}),g(j,"constructor",{value:M,configurable:!0}),M.displayName=O(j,q,"GeneratorFunction");function rt(o){["next","throw","return"].forEach(function(r){O(o,r,function(i){return this._invoke(r,i)})})}n.isGeneratorFunction=function(o){var r=typeof o=="function"&&o.constructor;return r?r===M||(r.displayName||r.name)==="GeneratorFunction":!1},n.mark=function(o){return Object.setPrototypeOf?Object.setPrototypeOf(o,j):(o.__proto__=j,O(o,q,"GeneratorFunction")),o.prototype=Object.create(I),o},n.awrap=function(o){return{__await:o}};function W(o,r){function i(b,p,m,E){var y=D(o[b],o,p);if(y.type==="throw")E(y.arg);else{var Q=y.arg,T=Q.value;return T&&typeof T=="object"&&c.call(T,"__await")?r.resolve(T.__await).then(function(k){i("next",k,m,E)},function(k){i("throw",k,m,E)}):r.resolve(T).then(function(k){Q.value=k,m(Q)},function(k){return i("throw",k,m,E)})}}var s;function u(b,p){function m(){return new r(function(E,y){i(b,p,E,y)})}return s=s?s.then(m,m):m()}g(this,"_invoke",{value:u})}rt(W.prototype),O(W.prototype,st,function(){return this}),n.AsyncIterator=W,n.async=function(o,r,i,s,u){u===void 0&&(u=Promise);var b=new W(tt(o,r,i,s),u);return n.isGeneratorFunction(r)?b:b.next().then(function(p){return p.done?p.value:b.next()})};function _t(o,r,i){var s=et;return function(b,p){if(s===nt)throw new Error("Generator is already running");if(s===P){if(b==="throw")throw p;return it()}for(i.method=b,i.arg=p;;){var m=i.delegate;if(m){var E=ot(m,i);if(E){if(E===S)continue;return E}}if(i.method==="next")i.sent=i._sent=i.arg;else if(i.method==="throw"){if(s===et)throw s=P,i.arg;i.dispatchException(i.arg)}else i.method==="return"&&i.abrupt("return",i.arg);s=nt;var y=D(o,r,i);if(y.type==="normal"){if(s=i.done?P:ft,y.arg===S)continue;return{value:y.arg,done:i.done}}else y.type==="throw"&&(s=P,i.method="throw",i.arg=y.arg)}}}function ot(o,r){var i=r.method,s=o.iterator[i];if(s===_)return r.delegate=null,i==="throw"&&o.iterator.return&&(r.method="return",r.arg=_,ot(o,r),r.method==="throw")||i!=="return"&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+i+"' method")),S;var u=D(s,o.iterator,r.arg);if(u.type==="throw")return r.method="throw",r.arg=u.arg,r.delegate=null,S;var b=u.arg;if(!b)return r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,S;if(b.done)r[o.resultName]=b.value,r.next=o.nextLoc,r.method!=="return"&&(r.method="next",r.arg=_);else return b;return r.delegate=null,S}rt(I),O(I,q,"Generator"),O(I,v,function(){return this}),O(I,"toString",function(){return"[object Generator]"});function lt(o){var r={tryLoc:o[0]};1 in o&&(r.catchLoc=o[1]),2 in o&&(r.finallyLoc=o[2],r.afterLoc=o[3]),this.tryEntries.push(r)}function z(o){var r=o.completion||{};r.type="normal",delete r.arg,o.completion=r}function K(o){this.tryEntries=[{tryLoc:"root"}],o.forEach(lt,this),this.reset(!0)}n.keys=function(o){var r=Object(o),i=[];for(var s in r)i.push(s);return i.reverse(),function u(){for(;i.length;){var b=i.pop();if(b in r)return u.value=b,u.done=!1,u}return u.done=!0,u}};function V(o){if(o){var r=o[v];if(r)return r.call(o);if(typeof o.next=="function")return o;if(!isNaN(o.length)){var i=-1,s=function u(){for(;++i<o.length;)if(c.call(o,i))return u.value=o[i],u.done=!1,u;return u.value=_,u.done=!0,u};return s.next=s}}return{next:it}}n.values=V;function it(){return{value:_,done:!0}}return K.prototype={constructor:K,reset:function(o){if(this.prev=0,this.next=0,this.sent=this._sent=_,this.done=!1,this.delegate=null,this.method="next",this.arg=_,this.tryEntries.forEach(z),!o)for(var r in this)r.charAt(0)==="t"&&c.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=_)},stop:function(){this.done=!0;var o=this.tryEntries[0],r=o.completion;if(r.type==="throw")throw r.arg;return this.rval},dispatchException:function(o){if(this.done)throw o;var r=this;function i(E,y){return b.type="throw",b.arg=o,r.next=E,y&&(r.method="next",r.arg=_),!!y}for(var s=this.tryEntries.length-1;s>=0;--s){var u=this.tryEntries[s],b=u.completion;if(u.tryLoc==="root")return i("end");if(u.tryLoc<=this.prev){var p=c.call(u,"catchLoc"),m=c.call(u,"finallyLoc");if(p&&m){if(this.prev<u.catchLoc)return i(u.catchLoc,!0);if(this.prev<u.finallyLoc)return i(u.finallyLoc)}else if(p){if(this.prev<u.catchLoc)return i(u.catchLoc,!0)}else if(m){if(this.prev<u.finallyLoc)return i(u.finallyLoc)}else throw new Error("try statement without catch or finally")}}},abrupt:function(o,r){for(var i=this.tryEntries.length-1;i>=0;--i){var s=this.tryEntries[i];if(s.tryLoc<=this.prev&&c.call(s,"finallyLoc")&&this.prev<s.finallyLoc){var u=s;break}}u&&(o==="break"||o==="continue")&&u.tryLoc<=r&&r<=u.finallyLoc&&(u=null);var b=u?u.completion:{};return b.type=o,b.arg=r,u?(this.method="next",this.next=u.finallyLoc,S):this.complete(b)},complete:function(o,r){if(o.type==="throw")throw o.arg;return o.type==="break"||o.type==="continue"?this.next=o.arg:o.type==="return"?(this.rval=this.arg=o.arg,this.method="return",this.next="end"):o.type==="normal"&&r&&(this.next=r),S},finish:function(o){for(var r=this.tryEntries.length-1;r>=0;--r){var i=this.tryEntries[r];if(i.finallyLoc===o)return this.complete(i.completion,i.afterLoc),z(i),S}},catch:function(o){for(var r=this.tryEntries.length-1;r>=0;--r){var i=this.tryEntries[r];if(i.tryLoc===o){var s=i.completion;if(s.type==="throw"){var u=s.arg;z(i)}return u}}throw new Error("illegal catch attempt")},delegateYield:function(o,r,i){return this.delegate={iterator:V(o),resultName:r,nextLoc:i},this.method==="next"&&(this.arg=_),S}},n}(e.exports);try{regeneratorRuntime=t}catch{typeof globalThis=="object"?globalThis.regeneratorRuntime=t:Function("r","regeneratorRuntime = r")(t)}})(ht);let d;const A=new Array(32).fill(void 0);A.push(void 0,null,!0,!1);function f(e){return A[e]}let G=A.length;function dt(e){e<36||(A[e]=G,G=e)}function X(e){const t=f(e);return dt(e),t}const ct=new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0});ct.decode();let U=new Uint8Array;function $(){return U.byteLength===0&&(U=new Uint8Array(d.memory.buffer)),U}function L(e,t){return ct.decode($().subarray(e,e+t))}function l(e){G===A.length&&A.push(A.length+1);const t=G;return G=A[t],A[t]=e,t}function Z(e){const t=typeof e;if(t=="number"||t=="boolean"||e==null)return`${e}`;if(t=="string")return`"${e}"`;if(t=="symbol"){const c=e.description;return c==null?"Symbol":`Symbol(${c})`}if(t=="function"){const c=e.name;return typeof c=="string"&&c.length>0?`Function(${c})`:"Function"}if(Array.isArray(e)){const c=e.length;let g="[";c>0&&(g+=Z(e[0]));for(let _=1;_<c;_++)g+=", "+Z(e[_]);return g+="]",g}const n=/\[object ([^\]]+)\]/.exec(toString.call(e));let a;if(n.length>1)a=n[1];else return toString.call(e);if(a=="Object")try{return"Object("+JSON.stringify(e)+")"}catch{return"Object"}return e instanceof Error?`${e.name}: ${e.message}
${e.stack}`:a}let N=0;const F=new TextEncoder("utf-8"),wt=typeof F.encodeInto=="function"?function(e,t){return F.encodeInto(e,t)}:function(e,t){const n=F.encode(e);return t.set(n),{read:e.length,written:n.length}};function x(e,t,n){if(n===void 0){const h=F.encode(e),v=t(h.length);return $().subarray(v,v+h.length).set(h),N=h.length,v}let a=e.length,c=t(a);const g=$();let _=0;for(;_<a;_++){const h=e.charCodeAt(_);if(h>127)break;g[c+_]=h}if(_!==a){_!==0&&(e=e.slice(_)),c=n(c,a,a=_+e.length*3);const h=$().subarray(c+_,c+a),v=wt(e,h);_+=v.written}return N=_,c}let B=new Int32Array;function C(){return B.byteLength===0&&(B=new Int32Array(d.memory.buffer)),B}function pt(e,t,n,a){const c={a:e,b:t,cnt:1,dtor:n},g=(..._)=>{c.cnt++;const h=c.a;c.a=0;try{return a(h,c.b,..._)}finally{--c.cnt===0?d.__wbindgen_export_2.get(c.dtor)(h,c.b):c.a=h}};return g.original=c,g}function mt(e,t,n){d._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h51f0e1e0388d53c7(e,t,l(n))}function yt(e,t){const n=x(e,d.__wbindgen_malloc,d.__wbindgen_realloc),a=N,c=d.start(n,a,l(t));return X(c)}function vt(e){return e==null}function w(e,t){try{return e.apply(this,t)}catch(n){d.__wbindgen_exn_store(l(n))}}function Et(e,t,n,a){d.wasm_bindgen__convert__closures__invoke2_mut__h3d45e8d24475e4eb(e,t,l(n),l(a))}async function Lt(e,t){if(typeof Response=="function"&&e instanceof Response){if(typeof WebAssembly.instantiateStreaming=="function")try{return await WebAssembly.instantiateStreaming(e,t)}catch(a){if(e.headers.get("Content-Type")!="application/wasm")console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",a);else throw a}const n=await e.arrayBuffer();return await WebAssembly.instantiate(n,t)}else{const n=await WebAssembly.instantiate(e,t);return n instanceof WebAssembly.Instance?{instance:n,module:e}:n}}function St(){const e={};return e.wbg={},e.wbg.__wbindgen_object_drop_ref=function(t){X(t)},e.wbg.__wbindgen_string_new=function(t,n){const a=L(t,n);return l(a)},e.wbg.__wbindgen_json_parse=function(t,n){const a=JSON.parse(L(t,n));return l(a)},e.wbg.__wbindgen_number_new=function(t){return l(t)},e.wbg.__wbindgen_object_clone_ref=function(t){const n=f(t);return l(n)},e.wbg.__wbg_new_693216e109162396=function(){const t=new Error;return l(t)},e.wbg.__wbg_stack_0ddaca5d1abfb52f=function(t,n){const a=f(n).stack,c=x(a,d.__wbindgen_malloc,d.__wbindgen_realloc),g=N;C()[t/4+1]=g,C()[t/4+0]=c},e.wbg.__wbg_error_09919627ac0992f5=function(t,n){try{console.error(L(t,n))}finally{d.__wbindgen_free(t,n)}},e.wbg.__wbindgen_cb_drop=function(t){const n=X(t).original;return n.cnt--==1?(n.a=0,!0):!1},e.wbg.__wbg_instanceof_Window_42f092928baaee84=function(t){return f(t)instanceof Window},e.wbg.__wbg_document_15b2e504fb1556d6=function(t){const n=f(t).document;return vt(n)?0:l(n)},e.wbg.__wbg_createElement_28fc3740fb11defb=function(){return w(function(t,n,a){const c=f(t).createElement(L(n,a));return l(c)},arguments)},e.wbg.__wbg_newwithoptelementandkeyframesandkeyframeeffectoptions_3a7ece4d7863ea0a=function(){return w(function(t,n,a){const c=new KeyframeEffect(f(t),f(n),f(a));return l(c)},arguments)},e.wbg.__wbg_setclassName_18f97d7a3caee0c3=function(t,n,a){f(t).className=L(n,a)},e.wbg.__wbg_setAttribute_8cfc462c0dedd03b=function(){return w(function(t,n,a,c,g){f(t).setAttribute(L(n,a),L(c,g))},arguments)},e.wbg.__wbg_remove_1776bb0393035a24=function(t){f(t).remove()},e.wbg.__wbg_instanceof_HtmlElement_057bfd3477e9b9b6=function(t){return f(t)instanceof HTMLElement},e.wbg.__wbg_style_365767989176e8d2=function(t){const n=f(t).style;return l(n)},e.wbg.__wbg_log_17733ab6fa45831d=function(t){console.log(f(t))},e.wbg.__wbg_settextContent_8db6b500abb6e3ae=function(t,n,a){f(t).textContent=n===0?void 0:L(n,a)},e.wbg.__wbg_appendChild_d21bac021b5bbfde=function(){return w(function(t,n){const a=f(t).appendChild(f(n));return l(a)},arguments)},e.wbg.__wbg_finished_fb8e2d051afd267f=function(){return w(function(t){const n=f(t).finished;return l(n)},arguments)},e.wbg.__wbg_newwitheffect_59b817dfee01f6cd=function(){return w(function(t){const n=new Animation(f(t));return l(n)},arguments)},e.wbg.__wbg_play_ed8e013500cba514=function(){return w(function(t){f(t).play()},arguments)},e.wbg.__wbg_setProperty_e0774a610618c48e=function(){return w(function(t,n,a,c,g){f(t).setProperty(L(n,a),L(c,g))},arguments)},e.wbg.__wbg_newnoargs_971e9a5abe185139=function(t,n){const a=new Function(L(t,n));return l(a)},e.wbg.__wbg_call_33d7bcddbbfa394a=function(){return w(function(t,n){const a=f(t).call(f(n));return l(a)},arguments)},e.wbg.__wbg_new_e6a9fecc2bf26696=function(){const t=new Object;return l(t)},e.wbg.__wbg_self_fd00a1ef86d1b2ed=function(){return w(function(){const t=self.self;return l(t)},arguments)},e.wbg.__wbg_window_6f6e346d8bbd61d7=function(){return w(function(){const t=window.window;return l(t)},arguments)},e.wbg.__wbg_globalThis_3348936ac49df00a=function(){return w(function(){const t=globalThis.globalThis;return l(t)},arguments)},e.wbg.__wbg_global_67175caf56f55ca9=function(){return w(function(){const t=global.global;return l(t)},arguments)},e.wbg.__wbindgen_is_undefined=function(t){return f(t)===void 0},e.wbg.__wbg_call_65af9f665ab6ade5=function(){return w(function(t,n,a){const c=f(t).call(f(n),f(a));return l(c)},arguments)},e.wbg.__wbg_instanceof_Object_9657a9e91b05959b=function(t){return f(t)instanceof Object},e.wbg.__wbg_new_52205195aa880fc2=function(t,n){try{var a={a:t,b:n},c=(_,h)=>{const v=a.a;a.a=0;try{return Et(v,a.b,_,h)}finally{a.a=v}};const g=new Promise(c);return l(g)}finally{a.a=a.b=0}},e.wbg.__wbg_resolve_0107b3a501450ba0=function(t){const n=Promise.resolve(f(t));return l(n)},e.wbg.__wbg_then_18da6e5453572fc8=function(t,n){const a=f(t).then(f(n));return l(a)},e.wbg.__wbg_then_e5489f796341454b=function(t,n,a){const c=f(t).then(f(n),f(a));return l(c)},e.wbg.__wbg_set_2762e698c2f5b7e0=function(){return w(function(t,n,a){return Reflect.set(f(t),f(n),f(a))},arguments)},e.wbg.__wbindgen_debug_string=function(t,n){const a=Z(f(n)),c=x(a,d.__wbindgen_malloc,d.__wbindgen_realloc),g=N;C()[t/4+1]=g,C()[t/4+0]=c},e.wbg.__wbindgen_throw=function(t,n){throw new Error(L(t,n))},e.wbg.__wbindgen_closure_wrapper1225=function(t,n,a){const c=pt(t,n,201,mt);return l(c)},e}function Ot(e,t){return d=e.exports,ut.__wbindgen_wasm_module=t,B=new Int32Array,U=new Uint8Array,d}async function ut(e){typeof e>"u"&&(e=new URL("/toys/static/asset_slomojs_bg.db180137.wasm",self.location));const t=St();(typeof e=="string"||typeof Request=="function"&&e instanceof Request||typeof URL=="function"&&e instanceof URL)&&(e=fetch(e));const{instance:n,module:a}=await Lt(await e,t);return Ot(n,a)}typeof Animation>"u"&&(window.Animation=document.body.animate({}).constructor);bt(Animation.prototype,"finished")||(console.log("add finished polyfill"),Object.defineProperty(Animation.prototype,"finished",{get(){return this._finished||(this._finished=this.playState==="finished"?Promise.resolve():new Promise((e,t)=>{this.addEventListener("finish",e,{once:!0}),this.addEventListener("cancel",t,{once:!0})})),this._finished}}));const At=`
let a = 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10;
let b = "hello" + " " + "world";
let x = 1 + 2000 + 3 + "hiii", a = 1, b = 2, c;
let y = "hello" + x;
log(y, x, a, b + b + a, log);
let str = "hello, world";
log(str);
__debugScope();
log(__debugScope);
`.trim();ut(new URL("/toys/static/asset_slomojs_bg.db180137.wasm",self.location)).then(()=>yt(At,gt(document.getElementById("root"),'Assertion Error: document.getElementById("root")'))).then(e=>console.log("success",e)).catch(e=>console.log("error",e));
