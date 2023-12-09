var Gr=Object.defineProperty;var qr=(u,e,r)=>e in u?Gr(u,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):u[e]=r;var p=(u,e,r)=>(qr(u,typeof e!="symbol"?e+"":e,r),r);import{b as $r,a as Wr}from"./chunk_utils.H-tu124z.js";import{c as z,a as re,b as Q,i as Ve,R as Re,w as ge,E as Fr,d as Qr}from"./chunk_track.c7N0SHA_.js";import"./chunk_index.Tw3qZeYI.js";import{c as me,g as Jr}from"./chunk__commonjsHelpers.5-cIlDoe.js";function ys(u,e){const r=new WeakMap;return e.addInitializer(function(){r.set(this,z(String(e.name),()=>u.call(this)))}),function(){return $r(r.get(this),"Assertion Error: computeds.get(this)").value}}function vs({get:u},e){return Wr(e.kind==="accessor",'Assertion Error: ctx.kind === "accessor"'),{get(){return u.call(this).value},set(r){u.call(this).set(r)},init(r){return re(String(e.name),r)}}}function _s(u,e){return function(...r){return Q(()=>u.apply(this,r))}}class Ie{constructor(e){p(this,"nextValue");p(this,"diff");this.previousValue=e}get(){var i,n,o,c;const e=((n=(i=this.diff)==null?void 0:i.removed)==null?void 0:n.size)??0,r=((c=(o=this.diff)==null?void 0:o.added)==null?void 0:c.size)??0;if(!(e===0&&r===0))return{value:this.nextValue,diff:this.diff}}_add(e,r){var i,n;this.nextValue??(this.nextValue=new Set(this.previousValue)),this.nextValue.add(e),this.diff??(this.diff={}),r?(i=this.diff.removed)==null||i.delete(e):((n=this.diff).added??(n.added=new Set),this.diff.added.add(e))}add(e){var n,o,c;const r=this.previousValue.has(e);if(r)return((o=(n=this.diff)==null?void 0:n.removed)==null?void 0:o.has(e))?this._add(e,r):void 0;(c=this.nextValue)!=null&&c.has(e)||this._add(e,r)}_remove(e,r){var i,n;this.nextValue??(this.nextValue=new Set(this.previousValue)),this.nextValue.delete(e),this.diff??(this.diff={}),r?((i=this.diff).removed??(i.removed=new Set),this.diff.removed.add(e)):(n=this.diff.added)==null||n.delete(e)}remove(e){var n,o,c,f;const r=this.previousValue.has(e);if(!r)return((o=(n=this.diff)==null?void 0:n.added)==null?void 0:o.has(e))?this._remove(e,r):void 0;(f=(c=this.diff)==null?void 0:c.removed)!=null&&f.has(e)||this._remove(e,r)}}function Yr(u,e){return Object.prototype.hasOwnProperty.call(u,e)}function ct(u,e){if(Yr(u,e))return u[e]}function ft(u){return Object.keys(u)}function x(u){return Object.values(u)}function X(u){return Object.entries(u)}function Xr(u){return Object.fromEntries(u)}function Me(u,e){const r={};let i=!1;for(const[n,o]of X(u))e(n,o)?r[n]=o:i=!0;return i?r:u}const Zr=()=>typeof process<"u"&&!1,ve=[],kr=()=>{const u=ve.splice(0,ve.length);for(const e of u)e()};let je;function es(){je||(je=requestAnimationFrame(()=>{je=void 0,kr()}))}function ts(u){if(Zr())return u();ve.includes(u)||(ve.push(u),es())}const rs=typeof window<"u"&&window.structuredClone?window.structuredClone:u=>u&&JSON.parse(JSON.stringify(u));let pt=(u=21)=>crypto.getRandomValues(new Uint8Array(u)).reduce((e,r)=>(r&=63,r<36?e+=r.toString(36):r<62?e+=(r-26).toString(36).toUpperCase():r>62?e+="-":e+="_",e),"");class Pe{constructor(e,r){p(this,"createDefaultProperties");p(this,"migrations");p(this,"validator");p(this,"scope");p(this,"isInstance",e=>(e==null?void 0:e.typeName)===this.typeName);this.typeName=e,this.createDefaultProperties=r.createDefaultProperties,this.migrations=r.migrations,this.validator=r.validator??{validate:i=>i},this.scope=r.scope??"document"}create(e){const r={...this.createDefaultProperties(),id:this.createId()};for(const[i,n]of Object.entries(e))n!==void 0&&(r[i]=n);return r.typeName=this.typeName,r}clone(e){return{...rs(e),id:this.createId()}}createId(e){return this.typeName+":"+(e??pt())}createCustomId(e){return this.typeName+":"+e}parseId(e){if(!this.isId(e))throw new Error(`ID "${e}" is not a valid ID for type "${this.typeName}"`);return e.slice(this.typeName.length+1)}isId(e){if(!e)return!1;for(let r=0;r<this.typeName.length;r++)if(e[r]!==this.typeName[r])return!1;return e[this.typeName.length]===":"}withDefaultProperties(e){return new Pe(this.typeName,{createDefaultProperties:e,migrations:this.migrations,validator:this.validator,scope:this.scope})}validate(e){return this.validator.validate(e)}}function bs(u,e){return new Pe(u,{createDefaultProperties:()=>({}),migrations:e.migrations??{currentVersion:0,firstVersion:0,migrators:{}},validator:e.validator,scope:e.scope})}class dt{constructor(){p(this,"items",new WeakMap)}get(e,r){return this.items.has(e)||this.items.set(e,r(e)),this.items.get(e)}}var _e={exports:{}};_e.exports;(function(u,e){var r=200,i="__lodash_hash_undefined__",n=1,o=2,c=9007199254740991,f="[object Arguments]",l="[object Array]",v="[object AsyncFunction]",_="[object Boolean]",h="[object Date]",y="[object Error]",b="[object Function]",w="[object GeneratorFunction]",m="[object Map]",P="[object Number]",ne="[object Null]",J="[object Object]",De="[object Promise]",yt="[object Proxy]",ze="[object RegExp]",ie="[object Set]",Ne="[object String]",vt="[object Symbol]",_t="[object Undefined]",be="[object WeakMap]",He="[object ArrayBuffer]",oe="[object DataView]",bt="[object Float32Array]",wt="[object Float64Array]",St="[object Int8Array]",Tt="[object Int16Array]",Ct="[object Int32Array]",At="[object Uint8Array]",xt="[object Uint8ClampedArray]",Ot="[object Uint16Array]",Et="[object Uint32Array]",Vt=/[\\^$.*+?()[\]{}|]/g,Rt=/^\[object .+?Constructor\]$/,It=/^(?:0|[1-9]\d*)$/,S={};S[bt]=S[wt]=S[St]=S[Tt]=S[Ct]=S[At]=S[xt]=S[Ot]=S[Et]=!0,S[f]=S[l]=S[He]=S[_]=S[oe]=S[h]=S[y]=S[b]=S[m]=S[P]=S[J]=S[ze]=S[ie]=S[Ne]=S[be]=!1;var Le=typeof me=="object"&&me&&me.Object===Object&&me,Mt=typeof self=="object"&&self&&self.Object===Object&&self,N=Le||Mt||Function("return this")(),Ue=e&&!e.nodeType&&e,Be=Ue&&!0&&u&&!u.nodeType&&u,Ke=Be&&Be.exports===Ue,we=Ke&&Le.process,Ge=function(){try{return we&&we.binding&&we.binding("util")}catch{}}(),qe=Ge&&Ge.isTypedArray;function jt(t,s){for(var a=-1,d=t==null?0:t.length,T=0,g=[];++a<d;){var A=t[a];s(A,a,t)&&(g[T++]=A)}return g}function Pt(t,s){for(var a=-1,d=s.length,T=t.length;++a<d;)t[T+a]=s[a];return t}function Dt(t,s){for(var a=-1,d=t==null?0:t.length;++a<d;)if(s(t[a],a,t))return!0;return!1}function zt(t,s){for(var a=-1,d=Array(t);++a<t;)d[a]=s(a);return d}function Nt(t){return function(s){return t(s)}}function Ht(t,s){return t.has(s)}function Lt(t,s){return t==null?void 0:t[s]}function Ut(t){var s=-1,a=Array(t.size);return t.forEach(function(d,T){a[++s]=[T,d]}),a}function Bt(t,s){return function(a){return t(s(a))}}function Kt(t){var s=-1,a=Array(t.size);return t.forEach(function(d){a[++s]=d}),a}var Gt=Array.prototype,qt=Function.prototype,ae=Object.prototype,Se=N["__core-js_shared__"],$e=qt.toString,D=ae.hasOwnProperty,We=function(){var t=/[^.]+$/.exec(Se&&Se.keys&&Se.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}(),Fe=ae.toString,$t=RegExp("^"+$e.call(D).replace(Vt,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),Qe=Ke?N.Buffer:void 0,ue=N.Symbol,Je=N.Uint8Array,Ye=ae.propertyIsEnumerable,Wt=Gt.splice,G=ue?ue.toStringTag:void 0,Xe=Object.getOwnPropertySymbols,Ft=Qe?Qe.isBuffer:void 0,Qt=Bt(Object.keys,Object),Te=Y(N,"DataView"),Z=Y(N,"Map"),Ce=Y(N,"Promise"),Ae=Y(N,"Set"),xe=Y(N,"WeakMap"),k=Y(Object,"create"),Jt=W(Te),Yt=W(Z),Xt=W(Ce),Zt=W(Ae),kt=W(xe),Ze=ue?ue.prototype:void 0,Oe=Ze?Ze.valueOf:void 0;function q(t){var s=-1,a=t==null?0:t.length;for(this.clear();++s<a;){var d=t[s];this.set(d[0],d[1])}}function er(){this.__data__=k?k(null):{},this.size=0}function tr(t){var s=this.has(t)&&delete this.__data__[t];return this.size-=s?1:0,s}function rr(t){var s=this.__data__;if(k){var a=s[t];return a===i?void 0:a}return D.call(s,t)?s[t]:void 0}function sr(t){var s=this.__data__;return k?s[t]!==void 0:D.call(s,t)}function nr(t,s){var a=this.__data__;return this.size+=this.has(t)?0:1,a[t]=k&&s===void 0?i:s,this}q.prototype.clear=er,q.prototype.delete=tr,q.prototype.get=rr,q.prototype.has=sr,q.prototype.set=nr;function H(t){var s=-1,a=t==null?0:t.length;for(this.clear();++s<a;){var d=t[s];this.set(d[0],d[1])}}function ir(){this.__data__=[],this.size=0}function or(t){var s=this.__data__,a=fe(s,t);if(a<0)return!1;var d=s.length-1;return a==d?s.pop():Wt.call(s,a,1),--this.size,!0}function ar(t){var s=this.__data__,a=fe(s,t);return a<0?void 0:s[a][1]}function ur(t){return fe(this.__data__,t)>-1}function cr(t,s){var a=this.__data__,d=fe(a,t);return d<0?(++this.size,a.push([t,s])):a[d][1]=s,this}H.prototype.clear=ir,H.prototype.delete=or,H.prototype.get=ar,H.prototype.has=ur,H.prototype.set=cr;function $(t){var s=-1,a=t==null?0:t.length;for(this.clear();++s<a;){var d=t[s];this.set(d[0],d[1])}}function fr(){this.size=0,this.__data__={hash:new q,map:new(Z||H),string:new q}}function dr(t){var s=de(this,t).delete(t);return this.size-=s?1:0,s}function lr(t){return de(this,t).get(t)}function hr(t){return de(this,t).has(t)}function pr(t,s){var a=de(this,t),d=a.size;return a.set(t,s),this.size+=a.size==d?0:1,this}$.prototype.clear=fr,$.prototype.delete=dr,$.prototype.get=lr,$.prototype.has=hr,$.prototype.set=pr;function ce(t){var s=-1,a=t==null?0:t.length;for(this.__data__=new $;++s<a;)this.add(t[s])}function gr(t){return this.__data__.set(t,i),this}function mr(t){return this.__data__.has(t)}ce.prototype.add=ce.prototype.push=gr,ce.prototype.has=mr;function U(t){var s=this.__data__=new H(t);this.size=s.size}function yr(){this.__data__=new H,this.size=0}function vr(t){var s=this.__data__,a=s.delete(t);return this.size=s.size,a}function _r(t){return this.__data__.get(t)}function br(t){return this.__data__.has(t)}function wr(t,s){var a=this.__data__;if(a instanceof H){var d=a.__data__;if(!Z||d.length<r-1)return d.push([t,s]),this.size=++a.size,this;a=this.__data__=new $(d)}return a.set(t,s),this.size=a.size,this}U.prototype.clear=yr,U.prototype.delete=vr,U.prototype.get=_r,U.prototype.has=br,U.prototype.set=wr;function Sr(t,s){var a=le(t),d=!a&&Nr(t),T=!a&&!d&&Ee(t),g=!a&&!d&&!T&&at(t),A=a||d||T||g,O=A?zt(t.length,String):[],E=O.length;for(var C in t)(s||D.call(t,C))&&!(A&&(C=="length"||T&&(C=="offset"||C=="parent")||g&&(C=="buffer"||C=="byteLength"||C=="byteOffset")||Mr(C,E)))&&O.push(C);return O}function fe(t,s){for(var a=t.length;a--;)if(st(t[a][0],s))return a;return-1}function Tr(t,s,a){var d=s(t);return le(t)?d:Pt(d,a(t))}function ee(t){return t==null?t===void 0?_t:ne:G&&G in Object(t)?Rr(t):zr(t)}function ke(t){return te(t)&&ee(t)==f}function et(t,s,a,d,T){return t===s?!0:t==null||s==null||!te(t)&&!te(s)?t!==t&&s!==s:Cr(t,s,a,d,et,T)}function Cr(t,s,a,d,T,g){var A=le(t),O=le(s),E=A?l:B(t),C=O?l:B(s);E=E==f?J:E,C=C==f?J:C;var R=E==J,j=C==J,V=E==C;if(V&&Ee(t)){if(!Ee(s))return!1;A=!0,R=!1}if(V&&!R)return g||(g=new U),A||at(t)?tt(t,s,a,d,T,g):Er(t,s,E,a,d,T,g);if(!(a&n)){var I=R&&D.call(t,"__wrapped__"),M=j&&D.call(s,"__wrapped__");if(I||M){var K=I?t.value():t,L=M?s.value():s;return g||(g=new U),T(K,L,a,d,g)}}return V?(g||(g=new U),Vr(t,s,a,d,T,g)):!1}function Ar(t){if(!ot(t)||Pr(t))return!1;var s=nt(t)?$t:Rt;return s.test(W(t))}function xr(t){return te(t)&&it(t.length)&&!!S[ee(t)]}function Or(t){if(!Dr(t))return Qt(t);var s=[];for(var a in Object(t))D.call(t,a)&&a!="constructor"&&s.push(a);return s}function tt(t,s,a,d,T,g){var A=a&n,O=t.length,E=s.length;if(O!=E&&!(A&&E>O))return!1;var C=g.get(t);if(C&&g.get(s))return C==s;var R=-1,j=!0,V=a&o?new ce:void 0;for(g.set(t,s),g.set(s,t);++R<O;){var I=t[R],M=s[R];if(d)var K=A?d(M,I,R,s,t,g):d(I,M,R,t,s,g);if(K!==void 0){if(K)continue;j=!1;break}if(V){if(!Dt(s,function(L,F){if(!Ht(V,F)&&(I===L||T(I,L,a,d,g)))return V.push(F)})){j=!1;break}}else if(!(I===M||T(I,M,a,d,g))){j=!1;break}}return g.delete(t),g.delete(s),j}function Er(t,s,a,d,T,g,A){switch(a){case oe:if(t.byteLength!=s.byteLength||t.byteOffset!=s.byteOffset)return!1;t=t.buffer,s=s.buffer;case He:return!(t.byteLength!=s.byteLength||!g(new Je(t),new Je(s)));case _:case h:case P:return st(+t,+s);case y:return t.name==s.name&&t.message==s.message;case ze:case Ne:return t==s+"";case m:var O=Ut;case ie:var E=d&n;if(O||(O=Kt),t.size!=s.size&&!E)return!1;var C=A.get(t);if(C)return C==s;d|=o,A.set(t,s);var R=tt(O(t),O(s),d,T,g,A);return A.delete(t),R;case vt:if(Oe)return Oe.call(t)==Oe.call(s)}return!1}function Vr(t,s,a,d,T,g){var A=a&n,O=rt(t),E=O.length,C=rt(s),R=C.length;if(E!=R&&!A)return!1;for(var j=E;j--;){var V=O[j];if(!(A?V in s:D.call(s,V)))return!1}var I=g.get(t);if(I&&g.get(s))return I==s;var M=!0;g.set(t,s),g.set(s,t);for(var K=A;++j<E;){V=O[j];var L=t[V],F=s[V];if(d)var ut=A?d(F,L,V,s,t,g):d(L,F,V,t,s,g);if(!(ut===void 0?L===F||T(L,F,a,d,g):ut)){M=!1;break}K||(K=V=="constructor")}if(M&&!K){var he=t.constructor,pe=s.constructor;he!=pe&&"constructor"in t&&"constructor"in s&&!(typeof he=="function"&&he instanceof he&&typeof pe=="function"&&pe instanceof pe)&&(M=!1)}return g.delete(t),g.delete(s),M}function rt(t){return Tr(t,Ur,Ir)}function de(t,s){var a=t.__data__;return jr(s)?a[typeof s=="string"?"string":"hash"]:a.map}function Y(t,s){var a=Lt(t,s);return Ar(a)?a:void 0}function Rr(t){var s=D.call(t,G),a=t[G];try{t[G]=void 0;var d=!0}catch{}var T=Fe.call(t);return d&&(s?t[G]=a:delete t[G]),T}var Ir=Xe?function(t){return t==null?[]:(t=Object(t),jt(Xe(t),function(s){return Ye.call(t,s)}))}:Br,B=ee;(Te&&B(new Te(new ArrayBuffer(1)))!=oe||Z&&B(new Z)!=m||Ce&&B(Ce.resolve())!=De||Ae&&B(new Ae)!=ie||xe&&B(new xe)!=be)&&(B=function(t){var s=ee(t),a=s==J?t.constructor:void 0,d=a?W(a):"";if(d)switch(d){case Jt:return oe;case Yt:return m;case Xt:return De;case Zt:return ie;case kt:return be}return s});function Mr(t,s){return s=s??c,!!s&&(typeof t=="number"||It.test(t))&&t>-1&&t%1==0&&t<s}function jr(t){var s=typeof t;return s=="string"||s=="number"||s=="symbol"||s=="boolean"?t!=="__proto__":t===null}function Pr(t){return!!We&&We in t}function Dr(t){var s=t&&t.constructor,a=typeof s=="function"&&s.prototype||ae;return t===a}function zr(t){return Fe.call(t)}function W(t){if(t!=null){try{return $e.call(t)}catch{}try{return t+""}catch{}}return""}function st(t,s){return t===s||t!==t&&s!==s}var Nr=ke(function(){return arguments}())?ke:function(t){return te(t)&&D.call(t,"callee")&&!Ye.call(t,"callee")},le=Array.isArray;function Hr(t){return t!=null&&it(t.length)&&!nt(t)}var Ee=Ft||Kr;function Lr(t,s){return et(t,s)}function nt(t){if(!ot(t))return!1;var s=ee(t);return s==b||s==w||s==v||s==yt}function it(t){return typeof t=="number"&&t>-1&&t%1==0&&t<=c}function ot(t){var s=typeof t;return t!=null&&(s=="object"||s=="function")}function te(t){return t!=null&&typeof t=="object"}var at=qe?Nt(qe):xr;function Ur(t){return Hr(t)?Sr(t):Or(t)}function Br(){return[]}function Kr(){return!1}u.exports=Lr})(_e,_e.exports);var ss=_e.exports;const ns=Jr(ss);function is(u){if(u.length===0)return new Set;const e=u[0],r=u.slice(1),i=new Set;for(const n of e)r.every(o=>o.has(n))&&i.add(n);return i}function os(u,e){const r={};for(const i of e)u.has(i)||(r.added??(r.added=new Set),r.added.add(i));for(const i of u)e.has(i)||(r.removed??(r.removed=new Set),r.removed.add(i));return r.added||r.removed?r:void 0}function lt(u,e){for(const[r,i]of Object.entries(u)){const n=i,o=e[r];if("eq"in n&&o!==n.eq||"neq"in n&&o===n.neq||"gt"in n&&(typeof o!="number"||o<=n.gt))return!1}return!0}function ht(u,e,r){const i=Object.fromEntries(Object.keys(r).map(n=>[n,new Set]));for(const[n,o]of Object.entries(r))if("eq"in o){const f=u.index(e,n).value.get(o.eq);if(f)for(const l of f)i[n].add(l)}else if("neq"in o){const c=u.index(e,n);for(const[f,l]of c.value)if(f!==o.neq)for(const v of l)i[n].add(v)}else if("gt"in o){const c=u.index(e,n);for(const[f,l]of c.value)if(f>o.gt)for(const v of l)i[n].add(v)}return is(Object.values(i))}class as{constructor(e,r){p(this,"indexCache",new Map);p(this,"historyCache",new Map);this.atoms=e,this.history=r}filterHistory(e){if(this.historyCache.has(e))return this.historyCache.get(e);const r=z("filterHistory:"+e,(i,n)=>{if(Ve(i))return this.history.value;const o=this.history.getDiffSince(n);if(o===Re)return this.history.value;const c={added:{},removed:{},updated:{}};let f=0,l=0,v=0;for(const _ of o){for(const h of x(_.added))if(h.typeName===e)if(c.removed[h.id]){const y=c.removed[h.id];delete c.removed[h.id],l--,y!==h&&(c.updated[h.id]=[y,h],v++)}else c.added[h.id]=h,f++;for(const[h,y]of x(_.updated))y.typeName===e&&(c.added[y.id]?c.added[y.id]=y:c.updated[y.id]?c.updated[y.id]=[c.updated[y.id][0],y]:(c.updated[y.id]=[h,y],v++));for(const h of x(_.removed))h.typeName===e&&(c.added[h.id]?(delete c.added[h.id],f--):c.updated[h.id]?(c.removed[h.id]=c.updated[h.id][0],delete c.updated[h.id],v--,l++):(c.removed[h.id]=h,l++))}return f||l||v?ge(this.history.value,c):i},{historyLength:100});return this.historyCache.set(e,r),r}index(e,r){const i=e+":"+r;if(this.indexCache.has(i))return this.indexCache.get(i);const n=this.__uncached_createIndex(e,r);return this.indexCache.set(i,n),n}__uncached_createIndex(e,r){const i=this.filterHistory(e),n=()=>{i.value;const o=new Map;for(const c of x(this.atoms.value)){const f=c.value;if(f.typeName===e){const l=f[r];o.has(l)||o.set(l,new Set),o.get(l).add(f.id)}}return o};return z("index:"+e+":"+r,(o,c)=>{if(Ve(o))return n();const f=i.getDiffSince(c);if(f===Re)return n();const l=new Map,v=(b,w)=>{let m=l.get(b);m||(m=new Ie(o.get(b)??new Set)),m.add(w),l.set(b,m)},_=(b,w)=>{let m=l.get(b);m||(m=new Ie(o.get(b)??new Set)),m.remove(w),l.set(b,m)};for(const b of f){for(const w of x(b.added))if(w.typeName===e){const m=w[r];v(m,w.id)}for(const[w,m]of x(b.updated))if(m.typeName===e){const P=w[r],ne=m[r];P!==ne&&(_(P,m.id),v(ne,m.id))}for(const w of x(b.removed))if(w.typeName===e){const m=w[r];_(m,w.id)}}let h,y;for(const[b,w]of l){const m=w.get();m&&(h||(h=new Map(o)),y||(y=new Map),m.value.size===0?h.delete(b):h.set(b,m.value),y.set(b,m.diff))}return h&&y?ge(h,y):o},{historyLength:100})}record(e,r=()=>({}),i="record:"+e+(r?":"+r.toString():"")){const n=this.ids(e,r,i);return z(i,()=>{var o;for(const c of n.value)return(o=this.atoms.value[c])==null?void 0:o.value})}records(e,r=()=>({}),i="records:"+e+(r?":"+r.toString():"")){const n=this.ids(e,r,"ids:"+i);return z(i,()=>[...n.value].map(o=>{const c=this.atoms.value[o];if(!c)throw new Error("no atom found for record id: "+o);return c.value}))}ids(e,r=()=>({}),i="ids:"+e+(r?":"+r.toString():"")){const n=this.filterHistory(e),o=()=>{n.value;const l=r();return Object.keys(l).length===0?new Set(x(this.atoms.value).flatMap(v=>{const _=v.value;return _.typeName===e?_.id:[]})):ht(this,e,l)},c=l=>{const v=o(),_=os(l,v);return _?ge(v,_):l},f=z("ids_query:"+i,r,{isEqual:ns});return z("query:"+i,(l,v)=>{const _=f.value;if(Ve(l))return o();if(v<f.lastChangedEpoch)return c(l);const h=n.getDiffSince(v);if(h===Re)return c(l);const y=new Ie(l);for(const w of h){for(const m of x(w.added))m.typeName===e&&lt(_,m)&&y.add(m.id);for(const[m,P]of x(w.updated))P.typeName===e&&(lt(_,P)?y.add(P.id):y.remove(P.id));for(const m of x(w.removed))m.typeName===e&&y.remove(m.id)}const b=y.get();return b?ge(b.value,b.diff):l},{historyLength:50})}exec(e,r){const i=ht(this,e,r);if(i.size===0)return Fr;const n=this.atoms.value;return[...i].map(o=>n[o].value)}}let ws=class{constructor(e){p(this,"id",pt());p(this,"atoms",re("store_atoms",{}));p(this,"history",re("history",0,{historyLength:1e3}));p(this,"query",new as(this.atoms,this.history));p(this,"listeners",new Set);p(this,"historyAccumulator",new cs);p(this,"historyReactor");p(this,"schema");p(this,"props");p(this,"scopedTypes");p(this,"onAfterCreate");p(this,"onAfterChange");p(this,"onBeforeDelete");p(this,"onAfterDelete");p(this,"_runCallbacks",!0);p(this,"put",(e,r)=>{Q(()=>{const i={},n={},o=this.atoms.__unsafe__getWithoutCapture();let c=null,f,l=!1;for(let h=0,y=e.length;h<y;h++){f=e[h];const b=(c??o)[f.id];if(b){const w=b.__unsafe__getWithoutCapture();f=this.schema.validateRecord(this,f,r??"updateRecord",w),b.set(f);const m=b.__unsafe__getWithoutCapture();w!==m&&(l=!0,i[f.id]=[w,m])}else l=!0,f=this.schema.validateRecord(this,f,r??"createRecord",null),n[f.id]=f,c||(c={...o}),c[f.id]=re("atom:"+f.id,f)}if(c&&this.atoms.set(c),!l)return;this.updateHistory({added:n,updated:i,removed:{}});const{onAfterCreate:v,onAfterChange:_}=this;v&&this._runCallbacks&&Object.values(n).forEach(h=>{v(h)}),_&&this._runCallbacks&&Object.values(i).forEach(([h,y])=>{_(h,y)})})});p(this,"remove",e=>{Q(()=>{if(this.onBeforeDelete&&this._runCallbacks)for(const i of e){const n=this.atoms.__unsafe__getWithoutCapture()[i];n&&this.onBeforeDelete(n.value)}let r;if(this.atoms.update(i=>{let n;for(const o of e)o in i&&(n||(n={...i}),r||(r={}),delete n[o],r[o]=i[o].value);return n??i}),!!r&&(this.updateHistory({added:{},updated:{},removed:r}),this.onAfterDelete&&this._runCallbacks))for(let i=0,n=e.length;i<n;i++)this.onAfterDelete(r[e[i]])})});p(this,"get",e=>{var r;return(r=this.atoms.value[e])==null?void 0:r.value});p(this,"unsafeGetWithoutCapture",e=>{var r;return(r=this.atoms.value[e])==null?void 0:r.__unsafe__getWithoutCapture()});p(this,"serialize",(e="document")=>{const r={};for(const[i,n]of X(this.atoms.value)){const o=n.value;(e==="all"||this.scopedTypes[e].has(o.typeName))&&(r[i]=o)}return r});p(this,"allRecords",()=>x(this.atoms.value).map(e=>e.value));p(this,"clear",()=>{this.remove(ft(this.atoms.value))});p(this,"update",(e,r)=>{const i=this.atoms.value[e];if(!i){console.error(`Record ${e} not found. This is probably an error`);return}this.put([r(i.__unsafe__getWithoutCapture())])});p(this,"has",e=>!!this.atoms.value[e]);p(this,"listen",(e,r)=>{this._flushHistory();const i={onHistory:e,filters:{source:(r==null?void 0:r.source)??"all",scope:(r==null?void 0:r.scope)??"all"}};return this.listeners.add(i),this.historyReactor.scheduler.isActivelyListening||this.historyReactor.start(),()=>{this.listeners.delete(i),this.listeners.size===0&&this.historyReactor.stop()}});p(this,"isMergingRemoteChanges",!1);p(this,"mergeRemoteChanges",e=>{if(this.isMergingRemoteChanges)return e();try{this.isMergingRemoteChanges=!0,Q(e)}finally{this.isMergingRemoteChanges=!1}});p(this,"createComputedCache",(e,r)=>{const i=new dt;return{get:n=>{const o=this.atoms.value[n];if(o)return i.get(o,()=>z(e+":"+n,()=>r(o.value))).value}}});p(this,"createSelectedComputedCache",(e,r,i)=>{const n=new dt;return{get:o=>{const c=this.atoms.value[o];if(!c)return;const f=z(e+":"+o+":selector",()=>r(c.value));return n.get(c,()=>z(e+":"+o,()=>i(f.value))).value}}});p(this,"_integrityChecker");p(this,"_isPossiblyCorrupted",!1);const{initialData:r,schema:i}=e;this.schema=i,this.props=e.props,r&&this.atoms.set(Xr(X(r).map(([n,o])=>[n,re("atom:"+n,this.schema.validateRecord(this,o,"initialize",null))]))),this.historyReactor=Qr("Store.historyReactor",()=>{this.history.value,this._flushHistory()},{scheduleEffect:n=>ts(n)}),this.scopedTypes={document:new Set(x(this.schema.types).filter(n=>n.scope==="document").map(n=>n.typeName)),session:new Set(x(this.schema.types).filter(n=>n.scope==="session").map(n=>n.typeName)),presence:new Set(x(this.schema.types).filter(n=>n.scope==="presence").map(n=>n.typeName))}}_flushHistory(){if(this.historyAccumulator.hasChanges()){const e=this.historyAccumulator.flush();for(const{changes:r,source:i}of e){let n=null,o=null,c=null;for(const{onHistory:f,filters:l}of this.listeners)if(!(l.source!=="all"&&l.source!==i))if(l.scope!=="all")if(l.scope==="document"){if(o??(o=this.filterChangesByScope(r,"document")),!o)continue;f({changes:o,source:i})}else if(l.scope==="session"){if(n??(n=this.filterChangesByScope(r,"session")),!n)continue;f({changes:n,source:i})}else{if(c??(c=this.filterChangesByScope(r,"presence")),!c)continue;f({changes:c,source:i})}else f({changes:r,source:i})}}}filterChangesByScope(e,r){const i={added:Me(e.added,(n,o)=>this.scopedTypes[r].has(o.typeName)),updated:Me(e.updated,(n,o)=>this.scopedTypes[r].has(o[1].typeName)),removed:Me(e.removed,(n,o)=>this.scopedTypes[r].has(o.typeName))};return Object.keys(i.added).length===0&&Object.keys(i.updated).length===0&&Object.keys(i.removed).length===0?null:i}updateHistory(e){this.historyAccumulator.add({changes:e,source:this.isMergingRemoteChanges?"remote":"user"}),this.listeners.size===0&&this.historyAccumulator.clear(),this.history.set(this.history.value+1,e)}validate(e){this.allRecords().forEach(r=>this.schema.validateRecord(this,r,e,null))}getSnapshot(e="document"){return{store:this.serialize(e),schema:this.schema.serialize()}}loadSnapshot(e){const r=this.schema.migrateStoreSnapshot(e);if(r.type==="error")throw new Error(`Failed to migrate snapshot: ${r.reason}`);Q(()=>{this.clear(),this.put(Object.values(r.value)),this.ensureStoreIsUsable()})}extractingChanges(e){const r=[],i=this.historyAccumulator.intercepting(n=>r.push(n.changes));try{return Q(e),gt(r)}finally{i()}}applyDiff(e,r=!0){const i=this._runCallbacks;try{this._runCallbacks=r,Q(()=>{const n=x(e.added).concat(x(e.updated).map(([c,f])=>f)),o=ft(e.removed);n.length&&this.put(n),o.length&&this.remove(o)})}finally{this._runCallbacks=i}}ensureStoreIsUsable(){var e;this._integrityChecker??(this._integrityChecker=this.schema.createIntegrityChecker(this)),(e=this._integrityChecker)==null||e.call(this)}markAsPossiblyCorrupted(){this._isPossiblyCorrupted=!0}isPossiblyCorrupted(){return this._isPossiblyCorrupted}};function gt(u){const e={added:{},removed:{},updated:{}};for(const r of u){for(const[i,n]of X(r.added))if(e.removed[i]){const o=e.removed[i];delete e.removed[i],o!==n&&(e.updated[i]=[o,n])}else e.added[i]=n;for(const[i,[n,o]]of X(r.updated)){if(e.added[i]){e.added[i]=o,delete e.updated[i],delete e.removed[i];continue}if(e.updated[i]){e.updated[i][1]=o,delete e.removed[i];continue}e.updated[i]=r.updated[i],delete e.removed[i]}for(const[i,n]of X(r.removed))e.added[i]?delete e.added[i]:e.updated[i]?(e.removed[i]=e.updated[i][0],delete e.updated[i]):e.removed[i]=n}return e}function us(u){const e=[];let r=u[0],i;for(let n=1,o=u.length;n<o;n++)i=u[n],r.source!==i.source?(e.push(r),r=i):r={source:r.source,changes:gt([r.changes,i.changes])};return e.push(r),e}class cs{constructor(){p(this,"_history",[]);p(this,"_interceptors",new Set)}intercepting(e){return this._interceptors.add(e),()=>{this._interceptors.delete(e)}}add(e){this._history.push(e);for(const r of this._interceptors)r(e)}flush(){const e=us(this._history);return this._history=[],e}clear(){this._history=[]}hasChanges(){return this._history.length>0}}function fs(u){return typeof u=="object"&&u!==null&&"id"in u&&"typeName"in u}var se=(u=>(u.IncompatibleSubtype="incompatible-subtype",u.UnknownType="unknown-type",u.TargetVersionTooNew="target-version-too-new",u.TargetVersionTooOld="target-version-too-old",u.MigrationError="migration-error",u.UnrecognizedSubtype="unrecognized-subtype",u))(se||{});function ye({record:u,migrations:e,fromVersion:r,toVersion:i}){let n=r;if(!fs(u))throw new Error("[migrateRecord] object is not a record");const{typeName:o,id:c,...f}=u;let l=f;for(;n<i;){const v=n+1,_=e.migrators[v];if(!_)return{type:"error",reason:"target-version-too-new"};l=_.up(l),n=v}for(;n>i;){const v=n-1,_=e.migrators[n];if(!_)return{type:"error",reason:"target-version-too-old"};l=_.down(l),n=v}return{type:"success",value:{...l,id:c,typeName:o}}}function ds({value:u,migrations:e,fromVersion:r,toVersion:i}){let n=r;for(;n<i;){const o=n+1,c=e.migrators[o];if(!c)return{type:"error",reason:"target-version-too-new"};u=c.up(u),n=o}for(;n>i;){const o=n-1,c=e.migrators[n];if(!c)return{type:"error",reason:"target-version-too-old"};u=c.down(u),n=o}return{type:"success",value:u}}class mt{constructor(e,r){this.types=e,this.options=r}static create(e,r){return new mt(e,r??{})}get currentStoreVersion(){var e;return((e=this.options.snapshotMigrations)==null?void 0:e.currentVersion)??0}validateRecord(e,r,i,n){try{const o=ct(this.types,r.typeName);if(!o)throw new Error(`Missing definition for record type ${r.typeName}`);return o.validate(r)}catch(o){if(this.options.onValidationFailure)return this.options.onValidationFailure({store:e,record:r,phase:i,recordBefore:n,error:o});throw o}}migratePersistedRecord(e,r,i="up"){var h;const n=ct(this.types,e.typeName),o=r.recordVersions[e.typeName];if(!o||!n)return{type:"error",reason:se.UnknownType};const c=n.migrations.currentVersion,f=o.version;if(c!==f){const y=ye(i==="up"?{record:e,migrations:n.migrations,fromVersion:f,toVersion:c}:{record:e,migrations:n.migrations,fromVersion:c,toVersion:f});if(y.type==="error")return y;e=y.value}if(!n.migrations.subTypeKey)return{type:"success",value:e};const l=(h=n.migrations.subTypeMigrations)==null?void 0:h[e[n.migrations.subTypeKey]],v="subTypeVersions"in o?o.subTypeVersions[e[n.migrations.subTypeKey]]:void 0;if(l===void 0)return{type:"error",reason:se.UnrecognizedSubtype};if(v===void 0)return{type:"error",reason:se.IncompatibleSubtype};const _=ye(i==="up"?{record:e,migrations:l,fromVersion:v,toVersion:l.currentVersion}:{record:e,migrations:l,fromVersion:l.currentVersion,toVersion:v});return _.type==="error"?_:{type:"success",value:_.value}}migrateStoreSnapshot(e){let{store:r}=e;const i=this.options.snapshotMigrations;if(!i)return{type:"success",value:r};const n=i.currentVersion,o=e.schema.storeVersion??0;if(n<o)return{type:"error",reason:se.TargetVersionTooOld};if(n>o){const f=ds({value:r,migrations:i,fromVersion:o,toVersion:n});if(f.type==="error")return f;r=f.value}const c=[];for(const f of x(r)){const l=this.migratePersistedRecord(f,e.schema);if(l.type==="error")return l;l.value&&l.value!==f&&c.push(l.value)}if(c.length){r={...r};for(const f of c)r[f.id]=f}return{type:"success",value:r}}createIntegrityChecker(e){var r,i;return((i=(r=this.options).createIntegrityChecker)==null?void 0:i.call(r,e))??void 0}serialize(){var e;return{schemaVersion:1,storeVersion:((e=this.options.snapshotMigrations)==null?void 0:e.currentVersion)??0,recordVersions:Object.fromEntries(x(this.types).map(r=>[r.typeName,r.migrations.subTypeKey&&r.migrations.subTypeMigrations?{version:r.migrations.currentVersion,subTypeKey:r.migrations.subTypeKey,subTypeVersions:r.migrations.subTypeMigrations?Object.fromEntries(Object.entries(r.migrations.subTypeMigrations).map(([i,n])=>[i,n.currentVersion])):void 0}:{version:r.migrations.currentVersion}]))}}serializeEarliestVersion(){var e;return{schemaVersion:1,storeVersion:((e=this.options.snapshotMigrations)==null?void 0:e.firstVersion)??0,recordVersions:Object.fromEntries(x(this.types).map(r=>[r.typeName,r.migrations.subTypeKey&&r.migrations.subTypeMigrations?{version:r.migrations.firstVersion,subTypeKey:r.migrations.subTypeKey,subTypeVersions:r.migrations.subTypeMigrations?Object.fromEntries(Object.entries(r.migrations.subTypeMigrations).map(([i,n])=>[i,n.firstVersion])):void 0}:{version:r.migrations.firstVersion}]))}}}export{ws as S,mt as a,_s as b,bs as c,ys as m,vs as r};
