import{r as o,a as N}from"./chunk_index.9ef61b8f.js";import{a as R}from"./chunk_theme.5443e31e.js";import{u as C,a as G,b as H}from"./chunk_client.ed9e553f.js";import{a as g,b,q as k,y,g as F,c as p}from"./chunk_assert.10ad1a9b.js";import{E as L}from"./chunk_EventEmitter.18fc68ab.js";import{R as x,V as d}from"./chunk_Vector2.79af760a.js";import{c as A}from"./chunk_index.9d627959.js";import{a as _,j as v}from"./chunk_jsx-runtime.faf32752.js";function E(i,t){!i||(typeof i=="function"?i(t):i.current=t)}function O(i,t){return o.exports.useCallback(e=>{E(i,e),E(t,e)},[i,t])}let h=null,f=null;function q(){if(!f)return;const i=f;f=null,N.exports.unstable_batchedUpdates(()=>{for(const t of i)t.emit()})}function j(){g(h===null,"Assertion Error: pendingSyncInvalidations === null"),h=new Set}function D(){g(h,"Assertion Error: pendingSyncInvalidations");const i=h;h=null;for(const t of i)t.emit();h&&D()}function Q(){return!!h}let z=0;function W(i){return`unknown ${i} ${z++}`}class P{constructor(t,e){this.eagerInvalidation=new L,this.batchedInvalidation=new L,this.debugName=t!=null?t:W(e)}getDebugName(){return this.debugName}addEagerListener(t){return this.eagerInvalidation.listen(t)}addBatchListener(t){return this.batchedInvalidation.listen(t)}invalidate(){h?h.add(this.eagerInvalidation):this.eagerInvalidation.emit(),f||(f=new Set,queueMicrotask(q)),f.add(this.batchedInvalidation)}listenerCount(){return this.eagerInvalidation.listenerCount()+this.batchedInvalidation.listenerCount()}hasListeners(){return this.eagerInvalidation.hasListeners()||this.batchedInvalidation.hasListeners()}}let m=0;function Z(){m++}let r=null;function X(i,t,e){return r||j(),r={shouldTrack:!0,previousDependencies:i,nextDependencies:new Map,previous:r,invalidateListener:t,shouldListen:e},r}function J(i){if(g(r===i,"Assertion Error: computationContext === context"),r=r.previous,i.shouldTrack&&i.previousDependencies)for(const[t,{unsubscribe:e}]of i.previousDependencies)i.nextDependencies.has(t)||e==null||e();return i.nextDependencies}function $(){Q()&&!r&&D()}function S(i){var t,e,n;if(g(r,"cannot call .live() outside of a live context"),r.shouldTrack&&!r.nextDependencies.has(i)){const s=r.shouldListen?(n=(e=(t=r.previousDependencies)==null?void 0:t.get(i))==null?void 0:e.unsubscribe)!=null?n:i.addEagerInvalidateListener(r.invalidateListener):null,a=i.getOnce();r.nextDependencies.set(i,{value:a,unsubscribe:s})}}function K(i,t){for(const[e,{value:n}]of i)if(!Object.is(e.getOnce(),n))return!0;return!1}function Ct(i){const t={shouldTrack:!1,previous:r};r=t;const e=i();return g(r===t,"Assertion Error: computationContext === nonTracking"),r=t.previous,e}class V{constructor(t,e,n){this.compute=t,this._isValid=!1,this.validForGlobalVersion=-1,this.dependencies=null,this.isComputing=!1,this.completion=null,this.invalidate=()=>{g(!this.isComputing,"cannot write whilst computing dependant live computation"),this._isValid&&(this._isValid=!1,this.invalidation.invalidate())},this.invalidation=new P(e,n)}getDebugName(){return this.invalidation.getDebugName()}computeIfNeeded(){if(this.isValid())return b(this.completion,"Assertion Error: this.completion");if(this.dependencies&&!K(this.dependencies,this.getDebugName()))return this.makeValidAt(m),b(this.completion,"Assertion Error: this.completion");const t=m,e=X(this.dependencies,this.invalidate,this.invalidation.hasListeners());this.isComputing=!0;let n;try{this.completion=x.ok(this.compute()),n=!0}catch(s){this.completion=x.error(s),n=!1}return this.isComputing=!1,this.dependencies=J(e),n?(this.makeValidAt(t),$(),this.computeIfNeeded()):$(),this.completion}isValid(){return this.invalidation.hasListeners()?this._isValid:this.validForGlobalVersion===m}makeValidAt(t){this._isValid=m===t,this.validForGlobalVersion=t}addEagerInvalidateListener(t){const e=this.invalidation.hasListeners(),n=this.invalidation.addEagerListener(t);return e||this.subscribeToDependencies(),()=>{n(),this.invalidation.hasListeners()||this.unsubscribeFromDependencies()}}addBatchInvalidateListener(t){const e=this.invalidation.hasListeners(),n=this.invalidation.addBatchListener(t);return e||this.subscribeToDependencies(),()=>{n(),this.invalidation.hasListeners()||this.unsubscribeFromDependencies()}}subscribeToDependencies(){if(this.isValid()&&this.dependencies)for(const[t,e]of this.dependencies)e.unsubscribe=t.addEagerInvalidateListener(this.invalidate);else this.computeIfNeeded()}unsubscribeFromDependencies(){var t;if(this.dependencies)for(const e of this.dependencies.values())(t=e.unsubscribe)==null||t.call(e),e.unsubscribe=null}}var w;const Y=(w=globalThis.requestIdleCallback)!=null?w:globalThis.requestAnimationFrame;var T;const tt=(T=globalThis.cancelIdleCallback)!=null?T:globalThis.cancelAnimationFrame;class I{constructor(t,e,n){this.schedule=e,this.cancelScheduledCallback=null,this.unsubscribe=null,this.invalidate=()=>{this.cancelScheduledCallback=this.schedule(this.recompute)},this.recompute=()=>{this.cancelScheduledCallback=null,this.computation.computeIfNeeded()},this.computation=new V(t,n,"LiveEffect"),this.cancelScheduledCallback=e(()=>{this.cancelScheduledCallback=null,this.unsubscribe=this.computation.addEagerInvalidateListener(this.invalidate)})}cancel(){var t,e;(t=this.cancelScheduledCallback)==null||t.call(this),(e=this.unsubscribe)==null||e.call(this)}}I.eager=i=>(i(),k);I.frame=i=>{const t=requestAnimationFrame(i);return()=>cancelAnimationFrame(t)};I.idle=i=>{const t=Y(i);return()=>tt(t)};class B{constructor(t,e,n="LiveMemo"){this.completion=null,this.computation=new V(t,e,n)}getDebugName(){return this.computation.getDebugName()}getOnce(){return this.completion=this.computation.computeIfNeeded(),this.completion.unwrap()}live(){return this.completion=this.computation.computeIfNeeded(),S(this),this.completion.unwrap()}addEagerInvalidateListener(t){return this.computation.addEagerInvalidateListener(t)}addBatchInvalidateListener(t){return this.computation.addBatchInvalidateListener(t)}}class yt extends B{constructor(t,e,n){super(t,n,"LiveMemoWritable"),this.write=e}update(t,...e){this.write(t,...e)}}class et{constructor(t,e){this.pendingUpdates=null,this.isUpdating=!1,this.wasRead=!0,this.value=t,this.invalidation=new P(e,"LiveValue")}getDebugName(){return this.invalidation.getDebugName()}markRead(){this.wasRead=!0}getOnce(){return this.markRead(),this.value}live(){return this.markRead(),S(this),this.value}update(t){if(this.isUpdating){this.pendingUpdates||(this.pendingUpdates=[]),this.pendingUpdates.push(t);return}this.isUpdating=!0;try{if(this.value=y(this.value,t),this.invalidate(),this.pendingUpdates)for(let e=0;e<this.pendingUpdates.length;e++)this.value=y(this.value,t),this.invalidate()}finally{this.pendingUpdates=null,this.isUpdating=!1}}invalidate(){this.wasRead&&(this.wasRead=!1,this.invalidation.invalidate(),Z())}addEagerInvalidateListener(t){return this.invalidation.addEagerListener(t)}addBatchInvalidateListener(t){return this.invalidation.addBatchListener(t)}getInvalidateListenerCount(){return this.invalidation.listenerCount()}}function it(i){const t=o.exports.useRef(!0);t.current=!0;try{const e=o.exports.useSyncExternalStore(o.exports.useCallback(n=>i.addBatchInvalidateListener(n),[i]),()=>{if(t.current)return i.getOnce();try{return i.getOnce()}catch(n){return console.groupCollapsed("[useLiveValue caught error]"),console.log(n),console.groupEnd(),{}}});return o.exports.useDebugValue(e),e}finally{t.current=!1}}function nt(i,t){const n=o.exports.useMemo(()=>new B(i,void 0),t),s=it(n);return o.exports.useDebugValue(s),s}function Lt(i,t){const e=new I(t,i);return()=>e.cancel}let st=1;class xt{constructor(){this.activeAnimations=new et({},"vfx.activeAnimations")}triggerAnimation(t){this.activeAnimations.update(e=>({...e,[t]:st++}))}getActiveAnimationIdLive(t){var e;return(e=F(this.activeAnimations.live(),t))!=null?e:null}acknowledgeAnimation(t,e){this.activeAnimations.update(n=>{const{[t]:s,...a}=n;return s!==e?n:a})}}function at(i,t,e){const n=o.exports.useRef(null),s=nt(()=>i.getActiveAnimationIdLive(t),[t,i]),a=C(e);return o.exports.useEffect(()=>{const c=n.current;if(!c||!s)return;const u=a(),l=c.animate(u.keyFrames,u);return l.addEventListener("finish",()=>{i.acknowledgeAnimation(t,s)}),l.play(),()=>{l.cancel()}},[s,a,t,i]),n}function rt(i,t=1/0){var n;const e=(n=G(i,H))!=null?n:d.ZERO;return o.exports.useMemo(()=>{if(!e)return"none";const s=Math.min(e.x*.5,e.y*.5,t);return`path('${[`M 0,${s}`,`Q 0,0 ${s},0`,`T ${e.x-s},0`,`Q ${e.x},0 ${e.x},${s}`,`T ${e.x},${e.y-s}`,`Q ${e.x},${e.y} ${e.x-s},${e.y}`,`T ${s},${e.y}`,`Q 0,${e.y} 0,${e.y-s}`,"Z"].join(" ")}')`},[e,t])}const ot=o.exports.forwardRef(function({children:t,className:e,iconLeft:n,iconRight:s,...a},c){return _(dt,{className:A(e,"justify-center gap-2 px-4 py-1"),ref:c,...a,children:[n,v(ct,{children:t}),s]})});function ct({children:i}){return v("span",{className:"inline-block transition-transform duration-200 ease-out-back-md group-hover:scale-110 group-active:scale-95",children:i})}const dt=o.exports.forwardRef(function({className:t,style:e,...n},s){const[a,c]=o.exports.useState(null),u=rt(a);return v("button",{ref:O(c,s),className:A("group inline-flex items-center rounded text-center font-bold tracking-wide text-stone-400 hover:bg-stone-300/25 hover:text-stone-500 focus:outline-none focus-visible:text-stone-600",t),style:{...e,clipPath:u},...n})});function Et({children:i,actionName:t,vfx:e,...n}){const s=at(e,t,()=>({keyFrames:{transform:["scale(1)","scale(0.8)","scale(1)"]},duration:300,easing:R.outBackMd}));return v(ot,{...n,children:v("span",{className:"inline-block",ref:s,children:i})})}const lt=10,U=k,M=()=>null;class ut{constructor({onTap:t=U,onDragStart:e=M}){this.state={type:"idle"},this.lastEvent=null,this.onTap=t,this.onDragStart=e}isGestureInProgress(){return this.state.type!=="idle"}onPointerDown(t,...e){var n,s;switch(this.lastEvent=t,this.state.type){case"idle":{const a=this.onDragStart(t,...e);if(!a)return;a.pointerCapture&&t.currentTarget.setPointerCapture(t.pointerId),(n=a.couldBeTap)==null||n?this.state={type:"dragUnconfirmed",pointerId:t.pointerId,startPosition:d.fromEvent(t),dragHandler:a,args:e}:(this.state={type:"dragConfirmed",pointerId:t.pointerId,dragHandler:a},(s=a.onConfirm)==null||s.call(a,t));return}case"dragUnconfirmed":case"dragConfirmed":return;default:p(this.state)}}onPointerMove(t){var e,n;switch(this.lastEvent=t,this.state.type){case"idle":return;case"dragUnconfirmed":if(this.state.pointerId!==t.pointerId)return;this.state.dragHandler.onMove(t),this.state.startPosition.distanceTo(d.fromEvent(t))>=lt&&((n=(e=this.state.dragHandler).onConfirm)==null||n.call(e,t),this.state={type:"dragConfirmed",pointerId:this.state.pointerId,dragHandler:this.state.dragHandler});return;case"dragConfirmed":if(this.state.pointerId!==t.pointerId)return;this.state.dragHandler.onMove(t);return;default:p(this.state)}}onPointerUp(t){switch(this.lastEvent=t,this.state.type){case"idle":return;case"dragUnconfirmed":if(this.state.pointerId!==t.pointerId)return;this.state.dragHandler.pointerCapture&&t.currentTarget.releasePointerCapture(t.pointerId),this.state.dragHandler.onCancel(t),this.onTap(t,...this.state.args),this.state={type:"idle"};return;case"dragConfirmed":if(this.state.pointerId!==t.pointerId)return;this.state.dragHandler.pointerCapture&&t.currentTarget.releasePointerCapture(t.pointerId),this.state.dragHandler.onEnd(t),this.state={type:"idle"};return;default:p(this.state)}}onPointerCancel(t){switch(this.lastEvent=t,this.state.type){case"idle":return;case"dragUnconfirmed":case"dragConfirmed":if(this.state.pointerId!==t.pointerId)return;this.state.dragHandler.pointerCapture&&t.currentTarget.releasePointerCapture(t.pointerId),this.state.dragHandler.onCancel(t),this.state={type:"idle"};return;default:p(this.state)}}cancel(){switch(this.state.type){case"idle":return;case"dragUnconfirmed":case"dragConfirmed":this.state.dragHandler.onCancel(b(this.lastEvent,"Assertion Error: this.lastEvent")),this.state={type:"idle"};return;default:p(this.state)}}end(){const t=b(this.lastEvent,"Assertion Error: this.lastEvent");switch(this.state.type){case"idle":return;case"dragUnconfirmed":this.state.dragHandler.onCancel(t),this.onTap(t,...this.state.args),this.state={type:"idle"};return;case"dragConfirmed":this.state.dragHandler.onEnd(t),this.state={type:"idle"};return;default:p(this.state)}}}function $t(i){var c,u;const t=C((c=i.onTap)!=null?c:U),e=C((u=i.onDragStart)!=null?u:M),[n]=o.exports.useState(()=>new ut({onTap:t,onDragStart:e})),[s,a]=o.exports.useState(!1);return{isGestureInProgress:s,events:o.exports.useMemo(()=>({onPointerDown:l=>{n.onPointerDown(l),a(n.isGestureInProgress())},onPointerMove:l=>{n.onPointerMove(l),a(n.isGestureInProgress())},onPointerUp:l=>{n.onPointerUp(l),a(n.isGestureInProgress())},onPointerCancel:l=>{n.onPointerCancel(l),a(n.isGestureInProgress())}}),[n])}}class wt{constructor(){this.parts=[]}toString(){return this.parts.join(" ")}add(t){return this.parts.push(t),this}moveTo(...t){const{x:e,y:n}=d.fromArgs(t);return this.add(`M${e} ${n}`)}lineTo(...t){const{x:e,y:n}=d.fromArgs(t);return this.add(`L${e} ${n}`)}closePath(){return this.add("Z")}arcTo(t,e,n,s,a,...c){const{x:u,y:l}=d.fromArgs(c);return this.add(`A${t} ${e} ${n} ${s} ${a} ${u} ${l}`)}quadraticCurveTo(t,e){const n=d.from(t),s=d.from(e);return this.add(`Q${n.x} ${n.y} ${s.x} ${s.y}`)}smoothQuadraticCurveTo(t){const e=d.from(t);return this.add(`T${e.x} ${e.y}`)}bezierCurveTo(t,e,n){const s=d.from(t),a=d.from(e),c=d.from(n);return this.add(`C${s.x} ${s.y} ${a.x} ${a.y} ${c.x} ${c.y}`)}smoothBezierCurveTo(t,e){const n=d.from(t),s=d.from(e);return this.add(`S${n.x} ${n.y} ${s.x} ${s.y}`)}}export{Et as A,ot as B,ut as G,yt as L,dt as P,wt as S,xt as V,nt as a,et as b,Lt as c,I as d,it as e,rt as f,M as g,B as h,at as i,Ct as r,$t as u};
