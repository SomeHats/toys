var it=Object.getPrototypeOf;var at=Reflect.get;var F=(i,t,e)=>at(it(i),e,t);import{o as ct,k as $,b as X,Z as q,Y as H}from"./chunk_utils.H-tu124z.js";/* empty css                       */import{j as g,c as lt}from"./chunk_client.5RwYu7VI.js";import{S as O,V as b,R as _}from"./chunk_Vector2.KSidYDSo.js";import{u as Y}from"./chunk_useGestureDetector.yKk2dzEl.js";import{g as ut,s as ht}from"./chunk_storage.jZ4mp_DT.js";import{S as J}from"./chunk_svgPathBuilder.fvxo4HjO.js";import{B as dt}from"./chunk_Button.3zUKvJkI.js";import{L as W}from"./chunk_Line2.VgGGsI--.js";import{I as ft}from"./chunk_Ids.UJ8Xuu1j.js";import{a as Z,c as pt,r as mt,t as tt}from"./chunk_track.c7N0SHA_.js";import{r as gt,R as vt}from"./chunk_index.Tw3qZeYI.js";import"./chunk_useResizeObserver.o4ZmQAol.js";import"./chunk_ResizeObserver.-NVrOerG.js";import"./chunk_theme.6peXtGe0.js";import"./chunk_EventEmitter.lFuS8-S7.js";import"./chunk_index.f10NbkGF.js";import"./chunk__commonjsHelpers.5-cIlDoe.js";function wt(){function i(a,s){return function(h){(function(f,n){if(f.v)throw new Error("attempted to call "+n+" after decoration was finished")})(s,"addInitializer"),d(h,"An initializer"),a.push(h)}}function t(a,s){if(!a(s))throw new TypeError("Attempted to access private element on non-instance")}function e(a,s,h,f,n,k,p,j,I){var c;switch(n){case 1:c="accessor";break;case 2:c="method";break;case 3:c="getter";break;case 4:c="setter";break;default:c="field"}var o,r,P={kind:c,name:p?"#"+s:s,static:k,private:p},l={v:!1};if(n!==0&&(P.addInitializer=i(f,l)),p||n!==0&&n!==2)if(n===2)o=function(u){return t(I,u),h.value};else{var E=n===0||n===1;(E||n===3)&&(o=p?function(u){return t(I,u),h.get.call(u)}:function(u){return h.get.call(u)}),(E||n===4)&&(r=p?function(u,x){t(I,u),h.set.call(u,x)}:function(u,x){h.set.call(u,x)})}else o=function(u){return u[s]},n===0&&(r=function(u,x){u[s]=x});var A=p?I.bind():function(u){return s in u};P.access=o&&r?{get:o,set:r,has:A}:o?{get:o,has:A}:{set:r,has:A};try{return a(j,P)}finally{l.v=!0}}function d(a,s){if(typeof a!="function")throw new TypeError(s+" must be a function")}function v(a,s){var h=typeof s;if(a===1){if(h!=="object"||s===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");s.get!==void 0&&d(s.get,"accessor.get"),s.set!==void 0&&d(s.set,"accessor.set"),s.init!==void 0&&d(s.init,"accessor.init")}else if(h!=="function"){var f;throw f=a===0?"field":a===10?"class":"method",new TypeError(f+" decorators must return a function or void 0")}}function w(a){return function(s){a(this,s)}}function y(a,s,h,f,n,k,p,j,I){var c,o,r,P,l,E,A,u=h[0];if(p?c=n===0||n===1?{get:(P=h[3],function(){return P(this)}),set:w(h[4])}:n===3?{get:h[3]}:n===4?{set:h[3]}:{value:h[3]}:n!==0&&(c=Object.getOwnPropertyDescriptor(s,f)),n===1?r={get:c.get,set:c.set}:n===2?r=c.value:n===3?r=c.get:n===4&&(r=c.set),typeof u=="function")(l=e(u,f,c,j,n,k,p,r,I))!==void 0&&(v(n,l),n===0?o=l:n===1?(o=l.init,E=l.get||r.get,A=l.set||r.set,r={get:E,set:A}):r=l);else for(var x=u.length-1;x>=0;x--){var T;(l=e(u[x],f,c,j,n,k,p,r,I))!==void 0&&(v(n,l),n===0?T=l:n===1?(T=l.init,E=l.get||r.get,A=l.set||r.set,r={get:E,set:A}):r=l,T!==void 0&&(o===void 0?o=T:typeof o=="function"?o=[o,T]:o.push(T)))}if(n===0||n===1){if(o===void 0)o=function(D,S){return S};else if(typeof o!="function"){var M=o;o=function(D,S){for(var G=S,V=0;V<M.length;V++)G=M[V].call(D,G);return G}}else{var U=o;o=function(D,S){return U.call(D,S)}}a.push(o)}n!==0&&(n===1?(c.get=r.get,c.set=r.set):n===2?c.value=r:n===3?c.get=r:n===4&&(c.set=r),p?n===1?(a.push(function(D,S){return r.get.call(D,S)}),a.push(function(D,S){return r.set.call(D,S)})):n===2?a.push(r):a.push(function(D,S){return r.call(D,S)}):Object.defineProperty(s,f,c))}function m(a,s,h){for(var f,n,k,p=[],j=new Map,I=new Map,c=0;c<s.length;c++){var o=s[c];if(Array.isArray(o)){var r,P,l=o[1],E=o[2],A=o.length>3,u=l>=5,x=h;if(u?(r=a,(l-=5)!==0&&(P=n=n||[]),A&&!k&&(k=function(U){return yt(U)===a}),x=k):(r=a.prototype,l!==0&&(P=f=f||[])),l!==0&&!A){var T=u?I:j,M=T.get(E)||0;if(M===!0||M===3&&l!==4||M===4&&l!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+E);!M&&l>2?T.set(E,l):T.set(E,!0)}y(p,r,o,E,l,u,A,P,x)}}return C(p,f),C(p,n),p}function C(a,s){s&&a.push(function(h){for(var f=0;f<s.length;f++)s[f].call(h);return h})}return function(a,s,h,f){return{e:m(a,s,f),get c(){return function(n,k){if(k.length>0){for(var p=[],j=n,I=n.name,c=k.length-1;c>=0;c--){var o={v:!1};try{var r=k[c](j,{kind:"class",name:I,addInitializer:i(p,o)})}finally{o.v=!0}r!==void 0&&(v(10,r),j=r)}return[j,function(){for(var P=0;P<p.length;P++)p[P].call(j)}]}}(a,h)}}}}function et(i,t,e,d){return(et=wt())(i,t,e,d)}function yt(i){if(Object(i)!==i)throw TypeError("right-hand side of 'in' should be an object, got "+(i!==null?typeof i:"null"));return i}function Pt(i,t){const e=new WeakMap;return t.addInitializer(function(){console.log("createComputed",{this:this,compute:i,context:t}),e.set(this,pt(String(t.name),()=>i.call(this)))}),function(){return X(e.get(this),"Assertion Error: computeds.get(this)").value}}function nt(i){var t;const d=class d{constructor(w){t(this);const y={};for(const[m,C]of ct(w))y[m]=Z(m,C);this.atoms=y}get serialized(){const w={};for(const y of $(i)){const m=this.atoms[y].value;if(m.serialized){w[y]=m.serialized();continue}w[y]=m}return w}};[t]=et(d,[[Pt,3,"serialized"]],[]).e;let e=d;for(const v of $(i))Object.defineProperty(e.prototype,v,{get(){return this.atoms[v].value},set(w){this.atoms[v].set(w)}});return e.modelSchema=O.object(i),e}class bt{constructor(){this.pointer=Z("Inputs.pointer",b.ZERO),this.events={onPointerMove:t=>{t.isPrimary&&this.pointer.set(b.fromEvent(t))},onPointerDown:t=>{t.isPrimary&&this.pointer.set(b.fromEvent(t))},onPointerUp:t=>{t.isPrimary&&this.pointer.set(b.fromEvent(t))}}}}class rt{constructor(t,e){this.parent=t,this.app=e,this._child=Z("State.child",null)}clear(){this._child.set(null)}enter(t,...e){const d=new t(this,...e);return this._child.set(d),d}get state(){return this._child.value}get path(){return this.state?`${this.name}.${this.state.path}`:this.name}onPointerDown(t){var e;(e=this.state)==null||e.onPointerDown(t)}onPointerMove(t){var e;(e=this.state)==null||e.onPointerMove(t)}onPointerUp(t){var e;(e=this.state)==null||e.onPointerUp(t)}onPointerCancel(t){var e;(e=this.state)==null||e.onPointerCancel(t)}}class st extends rt{constructor(t){super(t,t.app)}transitionTo(t,...e){return this.parent.enter(t,...e)}exit(){this.parent.clear()}}class Et extends rt{constructor(t){super(null,t),this.name="root",this.enter(K)}clear(){this.enter(K)}}class K extends st{constructor(){super(...arguments),this.name="idle"}onPointerDown(t){const e=this.app.createWire(b.fromEvent(t));this.transitionTo(kt,"end",e)}}class kt extends st{constructor(t,e,d){super(t),this.handle=e,this.wire=d,this.name="DraggingHandle"}onPointerMove(t){this.wire.end=b.fromEvent(t)}onPointerUp(t){this.exit()}}const Q=H(60),ot=new ft("wire"),z=class z extends nt({id:ot.schema,start:b.schema,end:b.schema}){get startAngle(){const t=this.start.angleTo(this.end);return Math.round(t/Q)*Q}get segments(){const t=this.start.lerp(this.end,.5),e=this.start.angleTo(t)-this.startAngle;console.log({angle:q(this.start.angleTo(this.end)),angleToCenter:q(e),startAngle:q(this.startAngle)});const d=W.fromAngleAndPoint(this.startAngle,this.start),v=W.fromAngleAndPoint(this.startAngle+H(60),t),w=W.fromAngleAndPoint(this.startAngle-H(60),t),y=v.pointAtIntersectionWith(d),m=w.pointAtIntersectionWith(d),C=this.start.distanceTo(y)<this.start.distanceTo(m)?v:w,a=W.fromAngleAndPoint(this.startAngle,this.end);return[this.start,d.pointAtIntersectionWith(C),C.pointAtIntersectionWith(a),this.end]}};z.schema=F(z,z,"modelSchema").transform(t=>_.ok(new z(t)),O.cannotValidate("Wire"),t=>t.serialized);let B=z;const L=class L extends nt({wires:O.arrayOf(B.schema)}){constructor(){super(...arguments),this.inputs=new bt,this.state=new Et(this),this.events={onPointerDown:t=>{this.inputs.events.onPointerDown(t),this.state.onPointerDown(t)},onPointerMove:t=>{this.inputs.events.onPointerMove(t),this.state.onPointerMove(t)},onPointerUp:t=>{this.inputs.events.onPointerUp(t),this.state.onPointerUp(t)},onPointerCancel:t=>{this.state.onPointerCancel(t)}}}static createEmpty(){return new L({wires:[]})}reset(){this.wires=[]}createWire(t){const e=new B({id:ot.generate(),start:t,end:t});return this.wires=[...this.wires,e],e}removeWire(t){this.wires=this.wires.filter(e=>e!==t)}};L.schema=F(L,L,"modelSchema").transform(t=>_.ok(new L(t)),O.cannotValidate("WiresApp"),t=>t.serialized);let N=L;const At="action-gradient",R=ut("wiresApp",N.schema,N.createEmpty);mt("save",()=>{ht("wiresApp",N.schema,R)},{scheduleEffect(i){window.requestIdleCallback?window.requestIdleCallback(()=>{console.log("idle"),i()}):window.requestAnimationFrame(i)}});const xt=tt(function(){return gt.useEffect(()=>{window.app=R,window.reset=()=>{R.wires=[]}}),g.jsxs(g.Fragment,{children:[g.jsxs("svg",{className:"absolute inset-0 isolate h-full w-full bg-white",...R.events,children:[g.jsx("radialGradient",{id:At}),R.wires.map(t=>g.jsx(jt,{wire:t},t.id))]}),g.jsx("div",{className:"pointer-events-none absolute inset-0 bg-stone-50 mix-blend-darken"}),g.jsxs("div",{className:"pointer-events-none absolute inset-0 p-3",children:[g.jsx(dt,{onClick:()=>R.reset(),className:"pointer-events-auto",children:"reset"}),g.jsx("div",{children:R.state.path})]})]})}),jt=tt(function({wire:t}){const e=Y({onDragStart:v=>{v.stopPropagation();const w=t.start,y=b.fromEvent(v).sub(t.start);return{couldBeTap:!1,pointerCapture:!0,onMove:m=>{t.start=b.fromEvent(m).sub(y)},onEnd:m=>{t.start=b.fromEvent(m).sub(y)},onCancel:()=>{t.start=w}}}}),d=Y({onDragStart:v=>{v.stopPropagation();const w=t.end,y=b.fromEvent(v).sub(t.end);return{couldBeTap:!1,pointerCapture:!0,onMove:m=>{t.end=b.fromEvent(m).sub(y)},onEnd:m=>{t.end=b.fromEvent(m).sub(y)},onCancel:()=>{t.end=w}}}});return g.jsxs(g.Fragment,{children:[g.jsx("path",{d:J.straightThroughPoints(t.segments).toString(),className:"fill-none stroke-slate-800 opacity-30 mix-blend-color-burn",strokeWidth:20,strokeLinecap:"round",strokeLinejoin:"round"}),g.jsx("path",{d:J.straightThroughPoints(t.segments).toString(),className:"fill-none stroke-fuchsia-400",strokeWidth:8,strokeLinecap:"round",strokeLinejoin:"round"}),g.jsx("circle",{...e.events,cx:t.start.x,cy:t.start.y,r:8,className:"fill-transparent stroke-transparent stroke-1 hover:stroke-blue-500"}),g.jsx("circle",{...d.events,cx:t.end.x,cy:t.end.y,r:8,className:"fill-transparent stroke-transparent stroke-1 hover:stroke-blue-500"})]})}),It=X(document.getElementById("root"),'Assertion Error: document.getElementById("root")');lt(It).render(g.jsx(vt.StrictMode,{children:g.jsx(xt,{})}));
