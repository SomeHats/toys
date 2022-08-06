import{h as _e,b as le}from"../chunks/chunk_assert.b3c9f562.js";/* empty css                               */var be={exports:{}};(function(i){var r=function(l){var h=Object.prototype,e=h.hasOwnProperty,n,c=typeof Symbol=="function"?Symbol:{},s=c.iterator||"@@iterator",w=c.asyncIterator||"@@asyncIterator",G=c.toStringTag||"@@toStringTag";function y(o,t,a){return Object.defineProperty(o,t,{value:a,enumerable:!0,configurable:!0,writable:!0}),o[t]}try{y({},"")}catch{y=function(t,a,f){return t[a]=f}}function I(o,t,a,f){var u=t&&t.prototype instanceof Y?t:Y,d=Object.create(u.prototype),m=new z(f||[]);return d._invoke=fe(o,a,m),d}l.wrap=I;function H(o,t,a){try{return{type:"normal",arg:o.call(t,a)}}catch(f){return{type:"throw",arg:f}}}var te="suspendedStart",ue="suspendedYield",ne="executing",R="completed",O={};function Y(){}function W(){}function j(){}var J={};y(J,s,function(){return this});var K=Object.getPrototypeOf,C=K&&K(K(Q([])));C&&C!==h&&e.call(C,s)&&(J=C);var T=j.prototype=Y.prototype=Object.create(J);W.prototype=j,y(T,"constructor",j),y(j,"constructor",W),W.displayName=y(j,G,"GeneratorFunction");function re(o){["next","throw","return"].forEach(function(t){y(o,t,function(a){return this._invoke(t,a)})})}l.isGeneratorFunction=function(o){var t=typeof o=="function"&&o.constructor;return t?t===W||(t.displayName||t.name)==="GeneratorFunction":!1},l.mark=function(o){return Object.setPrototypeOf?Object.setPrototypeOf(o,j):(o.__proto__=j,y(o,G,"GeneratorFunction")),o.prototype=Object.create(T),o},l.awrap=function(o){return{__await:o}};function $(o,t){function a(d,m,v,S){var E=H(o[d],o,m);if(E.type==="throw")S(E.arg);else{var X=E.arg,N=X.value;return N&&typeof N=="object"&&e.call(N,"__await")?t.resolve(N.__await).then(function(k){a("next",k,v,S)},function(k){a("throw",k,v,S)}):t.resolve(N).then(function(k){X.value=k,v(X)},function(k){return a("throw",k,v,S)})}}var f;function u(d,m){function v(){return new t(function(S,E){a(d,m,S,E)})}return f=f?f.then(v,v):v()}this._invoke=u}re($.prototype),y($.prototype,w,function(){return this}),l.AsyncIterator=$,l.async=function(o,t,a,f,u){u===void 0&&(u=Promise);var d=new $(I(o,t,a,f),u);return l.isGeneratorFunction(t)?d:d.next().then(function(m){return m.done?m.value:d.next()})};function fe(o,t,a){var f=te;return function(d,m){if(f===ne)throw new Error("Generator is already running");if(f===R){if(d==="throw")throw m;return ie()}for(a.method=d,a.arg=m;;){var v=a.delegate;if(v){var S=oe(v,a);if(S){if(S===O)continue;return S}}if(a.method==="next")a.sent=a._sent=a.arg;else if(a.method==="throw"){if(f===te)throw f=R,a.arg;a.dispatchException(a.arg)}else a.method==="return"&&a.abrupt("return",a.arg);f=ne;var E=H(o,t,a);if(E.type==="normal"){if(f=a.done?R:ue,E.arg===O)continue;return{value:E.arg,done:a.done}}else E.type==="throw"&&(f=R,a.method="throw",a.arg=E.arg)}}}function oe(o,t){var a=o.iterator[t.method];if(a===n){if(t.delegate=null,t.method==="throw"){if(o.iterator.return&&(t.method="return",t.arg=n,oe(o,t),t.method==="throw"))return O;t.method="throw",t.arg=new TypeError("The iterator does not provide a 'throw' method")}return O}var f=H(a,o.iterator,t.arg);if(f.type==="throw")return t.method="throw",t.arg=f.arg,t.delegate=null,O;var u=f.arg;if(!u)return t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,O;if(u.done)t[o.resultName]=u.value,t.next=o.nextLoc,t.method!=="return"&&(t.method="next",t.arg=n);else return u;return t.delegate=null,O}re(T),y(T,G,"Generator"),y(T,s,function(){return this}),y(T,"toString",function(){return"[object Generator]"});function se(o){var t={tryLoc:o[0]};1 in o&&(t.catchLoc=o[1]),2 in o&&(t.finallyLoc=o[2],t.afterLoc=o[3]),this.tryEntries.push(t)}function V(o){var t=o.completion||{};t.type="normal",delete t.arg,o.completion=t}function z(o){this.tryEntries=[{tryLoc:"root"}],o.forEach(se,this),this.reset(!0)}l.keys=function(o){var t=[];for(var a in o)t.push(a);return t.reverse(),function f(){for(;t.length;){var u=t.pop();if(u in o)return f.value=u,f.done=!1,f}return f.done=!0,f}};function Q(o){if(o){var t=o[s];if(t)return t.call(o);if(typeof o.next=="function")return o;if(!isNaN(o.length)){var a=-1,f=function u(){for(;++a<o.length;)if(e.call(o,a))return u.value=o[a],u.done=!1,u;return u.value=n,u.done=!0,u};return f.next=f}}return{next:ie}}l.values=Q;function ie(){return{value:n,done:!0}}return z.prototype={constructor:z,reset:function(o){if(this.prev=0,this.next=0,this.sent=this._sent=n,this.done=!1,this.delegate=null,this.method="next",this.arg=n,this.tryEntries.forEach(V),!o)for(var t in this)t.charAt(0)==="t"&&e.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=n)},stop:function(){this.done=!0;var o=this.tryEntries[0],t=o.completion;if(t.type==="throw")throw t.arg;return this.rval},dispatchException:function(o){if(this.done)throw o;var t=this;function a(S,E){return d.type="throw",d.arg=o,t.next=S,E&&(t.method="next",t.arg=n),!!E}for(var f=this.tryEntries.length-1;f>=0;--f){var u=this.tryEntries[f],d=u.completion;if(u.tryLoc==="root")return a("end");if(u.tryLoc<=this.prev){var m=e.call(u,"catchLoc"),v=e.call(u,"finallyLoc");if(m&&v){if(this.prev<u.catchLoc)return a(u.catchLoc,!0);if(this.prev<u.finallyLoc)return a(u.finallyLoc)}else if(m){if(this.prev<u.catchLoc)return a(u.catchLoc,!0)}else if(v){if(this.prev<u.finallyLoc)return a(u.finallyLoc)}else throw new Error("try statement without catch or finally")}}},abrupt:function(o,t){for(var a=this.tryEntries.length-1;a>=0;--a){var f=this.tryEntries[a];if(f.tryLoc<=this.prev&&e.call(f,"finallyLoc")&&this.prev<f.finallyLoc){var u=f;break}}u&&(o==="break"||o==="continue")&&u.tryLoc<=t&&t<=u.finallyLoc&&(u=null);var d=u?u.completion:{};return d.type=o,d.arg=t,u?(this.method="next",this.next=u.finallyLoc,O):this.complete(d)},complete:function(o,t){if(o.type==="throw")throw o.arg;return o.type==="break"||o.type==="continue"?this.next=o.arg:o.type==="return"?(this.rval=this.arg=o.arg,this.method="return",this.next="end"):o.type==="normal"&&t&&(this.next=t),O},finish:function(o){for(var t=this.tryEntries.length-1;t>=0;--t){var a=this.tryEntries[t];if(a.finallyLoc===o)return this.complete(a.completion,a.afterLoc),V(a),O}},catch:function(o){for(var t=this.tryEntries.length-1;t>=0;--t){var a=this.tryEntries[t];if(a.tryLoc===o){var f=a.completion;if(f.type==="throw"){var u=f.arg;V(a)}return u}}throw new Error("illegal catch attempt")},delegateYield:function(o,t,a){return this.delegate={iterator:Q(o),resultName:t,nextLoc:a},this.method==="next"&&(this.arg=n),O}},l}(i.exports);try{regeneratorRuntime=r}catch{typeof globalThis=="object"?globalThis.regeneratorRuntime=r:Function("r","regeneratorRuntime = r")(r)}})(be);let g,ae=new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0});ae.decode();let U=null;function B(){return(U===null||U.buffer!==g.memory.buffer)&&(U=new Uint8Array(g.memory.buffer)),U}function L(i,r){return ae.decode(B().subarray(i,i+r))}const A=new Array(32).fill(void 0);A.push(void 0,null,!0,!1);let M=A.length;function b(i){M===A.length&&A.push(A.length+1);const r=M;return M=A[r],A[r]=i,r}function _(i){return A[i]}function he(i){i<36||(A[i]=M,M=i)}function Z(i){const r=_(i);return he(i),r}function x(i){const r=typeof i;if(r=="number"||r=="boolean"||i==null)return`${i}`;if(r=="string")return`"${i}"`;if(r=="symbol"){const e=i.description;return e==null?"Symbol":`Symbol(${e})`}if(r=="function"){const e=i.name;return typeof e=="string"&&e.length>0?`Function(${e})`:"Function"}if(Array.isArray(i)){const e=i.length;let n="[";e>0&&(n+=x(i[0]));for(let c=1;c<e;c++)n+=", "+x(i[c]);return n+="]",n}const l=/\[object ([^\]]+)\]/.exec(toString.call(i));let h;if(l.length>1)h=l[1];else return toString.call(i);if(h=="Object")try{return"Object("+JSON.stringify(i)+")"}catch{return"Object"}return i instanceof Error?`${i.name}: ${i.message}
${i.stack}`:h}let P=0,D=new TextEncoder("utf-8");const de=typeof D.encodeInto=="function"?function(i,r){return D.encodeInto(i,r)}:function(i,r){const l=D.encode(i);return r.set(l),{read:i.length,written:l.length}};function ee(i,r,l){if(l===void 0){const s=D.encode(i),w=r(s.length);return B().subarray(w,w+s.length).set(s),P=s.length,w}let h=i.length,e=r(h);const n=B();let c=0;for(;c<h;c++){const s=i.charCodeAt(c);if(s>127)break;n[e+c]=s}if(c!==h){c!==0&&(i=i.slice(c)),e=l(e,h,h=c+i.length*3);const s=B().subarray(e+c,e+h);c+=de(i,s).written}return P=c,e}let F=null;function q(){return(F===null||F.buffer!==g.memory.buffer)&&(F=new Int32Array(g.memory.buffer)),F}function ge(i,r,l,h){const e={a:i,b:r,cnt:1,dtor:l},n=(...c)=>{e.cnt++;const s=e.a;e.a=0;try{return h(s,e.b,...c)}finally{--e.cnt===0?g.__wbindgen_export_2.get(e.dtor)(s,e.b):e.a=s}};return n.original=e,n}function we(i,r,l){g._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h16ec54ef69ab41ed(i,r,b(l))}function pe(i,r){var l=ee(i,g.__wbindgen_malloc,g.__wbindgen_realloc),h=P,e=g.start(l,h,b(r));return Z(e)}function ye(i){return i==null}function p(i){return function(){try{return i.apply(this,arguments)}catch(r){g.__wbindgen_exn_store(b(r))}}}function me(i,r,l,h){g.wasm_bindgen__convert__closures__invoke2_mut__hcaa06f65f959120b(i,r,b(l),b(h))}async function ve(i,r){if(typeof Response=="function"&&i instanceof Response){if(typeof WebAssembly.instantiateStreaming=="function")try{return await WebAssembly.instantiateStreaming(i,r)}catch(h){if(i.headers.get("Content-Type")!="application/wasm")console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",h);else throw h}const l=await i.arrayBuffer();return await WebAssembly.instantiate(l,r)}else{const l=await WebAssembly.instantiate(i,r);return l instanceof WebAssembly.Instance?{instance:l,module:i}:l}}async function ce(i){typeof i>"u"&&(i=import.meta.url.replace(/\.js$/,"_bg.wasm"));const r={};r.wbg={},r.wbg.__wbindgen_string_new=function(e,n){var c=L(e,n);return b(c)},r.wbg.__wbindgen_object_drop_ref=function(e){Z(e)},r.wbg.__wbindgen_object_clone_ref=function(e){var n=_(e);return b(n)},r.wbg.__wbindgen_json_parse=function(e,n){var c=JSON.parse(L(e,n));return b(c)},r.wbg.__wbindgen_number_new=function(e){var n=e;return b(n)},r.wbg.__wbg_new_59cb74e423758ede=function(){var e=new Error;return b(e)},r.wbg.__wbg_stack_558ba5917b466edd=function(e,n){var c=_(n).stack,s=ee(c,g.__wbindgen_malloc,g.__wbindgen_realloc),w=P;q()[e/4+1]=w,q()[e/4+0]=s},r.wbg.__wbg_error_4bb6c2a97407129a=function(e,n){try{console.error(L(e,n))}finally{g.__wbindgen_free(e,n)}},r.wbg.__wbindgen_cb_drop=function(e){const n=Z(e).original;if(n.cnt--==1)return n.a=0,!0;var c=!1;return c},r.wbg.__wbg_instanceof_Window_adf3196bdc02b386=function(e){var n=_(e)instanceof Window;return n},r.wbg.__wbg_document_6cc8d0b87c0a99b9=function(e){var n=_(e).document;return ye(n)?0:b(n)},r.wbg.__wbg_createElement_5bdf88a5af9f17c5=p(function(e,n,c){var s=_(e).createElement(L(n,c));return b(s)}),r.wbg.__wbg_newwithoptelementandkeyframesandkeyframeeffectoptions_bb82a4c127a4b090=p(function(e,n,c){var s=new KeyframeEffect(_(e),_(n),_(c));return b(s)}),r.wbg.__wbg_setclassName_dfd1832d72e3b25a=function(e,n,c){_(e).className=L(n,c)},r.wbg.__wbg_setAttribute_727bdb9763037624=p(function(e,n,c,s,w){_(e).setAttribute(L(n,c),L(s,w))}),r.wbg.__wbg_remove_cc7ef8dcae8cd130=function(e){_(e).remove()},r.wbg.__wbg_log_3bafd82835c6de6d=function(e){console.log(_(e))},r.wbg.__wbg_instanceof_HtmlElement_9cd64b297a10eb1e=function(e){var n=_(e)instanceof HTMLElement;return n},r.wbg.__wbg_style_9a41d46c005f7596=function(e){var n=_(e).style;return b(n)},r.wbg.__wbg_settextContent_9ac5ef9163ad40d0=function(e,n,c){_(e).textContent=n===0?void 0:L(n,c)},r.wbg.__wbg_appendChild_77215fd672b162c5=p(function(e,n){var c=_(e).appendChild(_(n));return b(c)}),r.wbg.__wbg_finished_9c241e23f61ce9a6=p(function(e){var n=_(e).finished;return b(n)}),r.wbg.__wbg_newwitheffect_2e306c496d8d4324=p(function(e){var n=new Animation(_(e));return b(n)}),r.wbg.__wbg_play_0eebd05539be9380=p(function(e){_(e).play()}),r.wbg.__wbg_setProperty_42eabadfcd7d6199=p(function(e,n,c,s,w){_(e).setProperty(L(n,c),L(s,w))}),r.wbg.__wbg_call_8e95613cc6524977=p(function(e,n){var c=_(e).call(_(n));return b(c)}),r.wbg.__wbg_self_07b2f89e82ceb76d=p(function(){var e=self.self;return b(e)}),r.wbg.__wbg_window_ba85d88572adc0dc=p(function(){var e=window.window;return b(e)}),r.wbg.__wbg_globalThis_b9277fc37e201fe5=p(function(){var e=globalThis.globalThis;return b(e)}),r.wbg.__wbg_global_e16303fe83e1d57f=p(function(){var e=global.global;return b(e)}),r.wbg.__wbindgen_is_undefined=function(e){var n=_(e)===void 0;return n},r.wbg.__wbg_newnoargs_f3b8a801d5d4b079=function(e,n){var c=new Function(L(e,n));return b(c)},r.wbg.__wbg_call_d713ea0274dfc6d2=p(function(e,n,c){var s=_(e).call(_(n),_(c));return b(s)}),r.wbg.__wbg_instanceof_Object_75681edeb8be7268=function(e){var n=_(e)instanceof Object;return n},r.wbg.__wbg_new_3e06d4f36713e4cb=function(){var e=new Object;return b(e)},r.wbg.__wbg_new_d0c63652ab4d825c=function(e,n){try{var c={a:e,b:n},s=(G,y)=>{const I=c.a;c.a=0;try{return me(I,c.b,G,y)}finally{c.a=I}},w=new Promise(s);return b(w)}finally{c.a=c.b=0}},r.wbg.__wbg_resolve_2529512c3bb73938=function(e){var n=Promise.resolve(_(e));return b(n)},r.wbg.__wbg_then_4a7a614abbbe6d81=function(e,n){var c=_(e).then(_(n));return b(c)},r.wbg.__wbg_then_3b7ac098cfda2fa5=function(e,n,c){var s=_(e).then(_(n),_(c));return b(s)},r.wbg.__wbg_set_304f2ec1a3ab3b79=p(function(e,n,c){var s=Reflect.set(_(e),_(n),_(c));return s}),r.wbg.__wbindgen_debug_string=function(e,n){var c=x(_(n)),s=ee(c,g.__wbindgen_malloc,g.__wbindgen_realloc),w=P;q()[e/4+1]=w,q()[e/4+0]=s},r.wbg.__wbindgen_throw=function(e,n){throw new Error(L(e,n))},r.wbg.__wbindgen_closure_wrapper1342=function(e,n,c){var s=ge(e,n,248,we);return b(s)},(typeof i=="string"||typeof Request=="function"&&i instanceof Request||typeof URL=="function"&&i instanceof URL)&&(i=fetch(i));const{instance:l,module:h}=await ve(await i,r);return g=l.exports,ce.__wbindgen_wasm_module=h,g}typeof Animation>"u"&&(window.Animation=document.body.animate({}).constructor);_e(Animation.prototype,"finished")||(console.log("add finished polyfill"),Object.defineProperty(Animation.prototype,"finished",{get(){return this._finished||(this._finished=this.playState==="finished"?Promise.resolve():new Promise((i,r)=>{this.addEventListener("finish",i,{once:!0}),this.addEventListener("cancel",r,{once:!0})})),this._finished}}));const Ee=`
let a = 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10;
let b = "hello" + " " + "world";
let x = 1 + 2000 + 3 + "hiii", a = 1, b = 2, c;
let y = "hello" + x;
log(y, x, a, b + b + a, log);
let str = "hello, world";
log(str);
__debugScope();
log(__debugScope);
`.trim();ce(new URL(""+new URL("../assets/asset_slomojs_bg.1d202e65.wasm",import.meta.url).href,self.location)).then(()=>pe(Ee,le(document.getElementById("root")))).then(i=>console.log("success",i)).catch(i=>console.log("error",i));
