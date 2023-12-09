import{j as d}from"./chunk_client.5RwYu7VI.js";import{r,a as B}from"./chunk_index.Tw3qZeYI.js";import{a as N}from"./chunk_theme.6peXtGe0.js";import{u as R,a as S,b as $}from"./chunk_useResizeObserver.o4ZmQAol.js";import{a as h,b,d as T,u as L,P as M}from"./chunk_utils.H-tu124z.js";import{E as I}from"./chunk_EventEmitter.lFuS8-S7.js";import{R as k,V as U}from"./chunk_Vector2.KSidYDSo.js";import{c as A}from"./chunk_index.f10NbkGF.js";function x(i,e){i&&(typeof i=="function"?i(e):i.current=e)}function F(i,e){return r.useCallback(t=>{x(i,t),x(e,t)},[i,e])}let o=null,u=null;function j(){if(!u)return;const i=u;u=null,B.unstable_batchedUpdates(()=>{for(const e of i)e.emit()})}function O(){h(o===null,"Assertion Error: pendingSyncInvalidations === null"),o=new Set}function C(){h(o,"Assertion Error: pendingSyncInvalidations");const i=o;o=null;for(const e of i)e.emit();o&&C()}function P(){return!!o}let q=0;function G(i){return`unknown ${i} ${q++}`}class w{constructor(e,t){this.eagerInvalidation=new I,this.batchedInvalidation=new I,this.debugName=e??G(t)}getDebugName(){return this.debugName}addEagerListener(e){return this.eagerInvalidation.listen(e)}addBatchListener(e){return this.batchedInvalidation.listen(e)}invalidate(){o?o.add(this.eagerInvalidation):this.eagerInvalidation.emit(),u||(u=new Set,queueMicrotask(j)),u.add(this.batchedInvalidation)}listenerCount(){return this.eagerInvalidation.listenerCount()+this.batchedInvalidation.listenerCount()}hasListeners(){return this.eagerInvalidation.hasListeners()||this.batchedInvalidation.hasListeners()}}let p=0;function Q(){p++}let a=null;function z(i,e,t){return a||O(),a={shouldTrack:!0,previousDependencies:i,nextDependencies:new Map,previous:a,invalidateListener:e,shouldListen:t},a}function W(i){if(h(a===i,"Assertion Error: computationContext === context"),a=a.previous,i.shouldTrack&&i.previousDependencies)for(const[e,{unsubscribe:t}]of i.previousDependencies)i.nextDependencies.has(e)||t==null||t();return i.nextDependencies}function y(){P()&&!a&&C()}function E(i){var e,t;if(h(a,"cannot call .live() outside of a live context"),a.shouldTrack&&!a.nextDependencies.has(i)){const n=a.shouldListen?((t=(e=a.previousDependencies)==null?void 0:e.get(i))==null?void 0:t.unsubscribe)??i.addEagerInvalidateListener(a.invalidateListener):null,s=i.getOnce();a.nextDependencies.set(i,{value:s,unsubscribe:n})}}function _(i,e){for(const[t,{value:n}]of i)if(!Object.is(t.getOnce(),n))return!0;return!1}function pe(i){const e={shouldTrack:!1,previous:a};a=e;const t=i();return h(a===e,"Assertion Error: computationContext === nonTracking"),a=e.previous,t}class V{constructor(e,t,n){this.compute=e,this._isValid=!1,this.validForGlobalVersion=-1,this.dependencies=null,this.isComputing=!1,this.completion=null,this.invalidate=()=>{h(!this.isComputing,"cannot write whilst computing dependant live computation"),this._isValid&&(this._isValid=!1,this.invalidation.invalidate())},this.invalidation=new w(t,n)}getDebugName(){return this.invalidation.getDebugName()}computeIfNeeded(){if(this.isValid())return b(this.completion,"Assertion Error: this.completion");if(this.dependencies&&!_(this.dependencies,this.getDebugName()))return this.makeValidAt(p),b(this.completion,"Assertion Error: this.completion");const e=p,t=z(this.dependencies,this.invalidate,this.invalidation.hasListeners());this.isComputing=!0;let n;try{this.completion=k.ok(this.compute()),n=!0}catch(s){this.completion=k.error(s),n=!1}return this.isComputing=!1,this.dependencies=W(t),n?(this.makeValidAt(e),y(),this.computeIfNeeded()):y(),this.completion}isValid(){return this.invalidation.hasListeners()?this._isValid:this.validForGlobalVersion===p}makeValidAt(e){this._isValid=p===e,this.validForGlobalVersion=e}addEagerInvalidateListener(e){const t=this.invalidation.hasListeners(),n=this.invalidation.addEagerListener(e);return t||this.subscribeToDependencies(),()=>{n(),this.invalidation.hasListeners()||this.unsubscribeFromDependencies()}}addBatchInvalidateListener(e){const t=this.invalidation.hasListeners(),n=this.invalidation.addBatchListener(e);return t||this.subscribeToDependencies(),()=>{n(),this.invalidation.hasListeners()||this.unsubscribeFromDependencies()}}subscribeToDependencies(){if(this.isValid()&&this.dependencies)for(const[e,t]of this.dependencies)t.unsubscribe=e.addEagerInvalidateListener(this.invalidate);else this.computeIfNeeded()}unsubscribeFromDependencies(){var e;if(this.dependencies)for(const t of this.dependencies.values())(e=t.unsubscribe)==null||e.call(t),t.unsubscribe=null}}const Z=globalThis.requestIdleCallback??globalThis.requestAnimationFrame,H=globalThis.cancelIdleCallback??globalThis.cancelAnimationFrame,m=class m{constructor(e,t,n){this.schedule=t,this.cancelScheduledCallback=null,this.unsubscribe=null,this.invalidate=()=>{this.cancelScheduledCallback=this.schedule(this.recompute)},this.recompute=()=>{this.cancelScheduledCallback=null,this.computation.computeIfNeeded()},this.computation=new V(e,n,"LiveEffect"),this.cancelScheduledCallback=t(()=>{this.cancelScheduledCallback=null,this.unsubscribe=this.computation.addEagerInvalidateListener(this.invalidate)})}cancel(){var e,t;(e=this.cancelScheduledCallback)==null||e.call(this),(t=this.unsubscribe)==null||t.call(this)}};m.eager=e=>(e(),T),m.frame=e=>{const t=requestAnimationFrame(e);return()=>cancelAnimationFrame(t)},m.idle=e=>{const t=Z(e);return()=>H(t)};let g=m;class D{constructor(e,t,n="LiveMemo"){this.completion=null,this.computation=new V(e,t,n)}getDebugName(){return this.computation.getDebugName()}getOnce(){return this.completion=this.computation.computeIfNeeded(),this.completion.unwrap()}live(){return this.completion=this.computation.computeIfNeeded(),E(this),this.completion.unwrap()}addEagerInvalidateListener(e){return this.computation.addEagerInvalidateListener(e)}addBatchInvalidateListener(e){return this.computation.addBatchInvalidateListener(e)}}class me extends D{constructor(e,t,n){super(e,n,"LiveMemoWritable"),this.write=t}update(e,...t){this.write(e,...t)}}class J{constructor(e,t){this.pendingUpdates=null,this.isUpdating=!1,this.wasRead=!0,this.value=e,this.invalidation=new w(t,"LiveValue")}getDebugName(){return this.invalidation.getDebugName()}markRead(){this.wasRead=!0}getOnce(){return this.markRead(),this.value}live(){return this.markRead(),E(this),this.value}update(e){if(this.isUpdating){this.pendingUpdates||(this.pendingUpdates=[]),this.pendingUpdates.push(e);return}this.isUpdating=!0;try{if(this.value=L(this.value,e),this.invalidate(),this.pendingUpdates)for(let t=0;t<this.pendingUpdates.length;t++)this.value=L(this.value,e),this.invalidate()}finally{this.pendingUpdates=null,this.isUpdating=!1}}invalidate(){this.wasRead&&(this.wasRead=!1,this.invalidation.invalidate(),Q())}addEagerInvalidateListener(e){return this.invalidation.addEagerListener(e)}addBatchInvalidateListener(e){return this.invalidation.addBatchListener(e)}getInvalidateListenerCount(){return this.invalidation.listenerCount()}}function K(i){const e=r.useRef(!0);e.current=!0;try{const t=r.useSyncExternalStore(r.useCallback(n=>i.addBatchInvalidateListener(n),[i]),()=>{if(e.current)return i.getOnce();try{return i.getOnce()}catch(n){return console.groupCollapsed("[useLiveValue caught error]"),console.log(n),console.groupEnd(),{}}});return r.useDebugValue(t),t}finally{e.current=!1}}function X(i,e){const n=r.useMemo(()=>new D(i,void 0),e),s=K(n);return r.useDebugValue(s),s}function fe(i,e){const t=new g(e,i);return()=>t.cancel()}let Y=1;class ve{constructor(){this.activeAnimations=new J({},"vfx.activeAnimations")}triggerAnimation(e){this.activeAnimations.update(t=>({...t,[e]:Y++}))}getActiveAnimationIdLive(e){return M(this.activeAnimations.live(),e)??null}acknowledgeAnimation(e,t){this.activeAnimations.update(n=>{const{[e]:s,...l}=n;return s!==t?n:l})}}function ee(i,e,t){const n=r.useRef(null),s=X(()=>i.getActiveAnimationIdLive(e),[e,i]),l=R(t);return r.useEffect(()=>{const c=n.current;if(!c||!s)return;const f=l(),v=c.animate(f.keyFrames,f);return v.addEventListener("finish",()=>{i.acknowledgeAnimation(e,s)}),v.play(),()=>{v.cancel()}},[s,l,e,i]),n}function te(i,e=1/0){const t=S(i,$)??U.ZERO;return r.useMemo(()=>{if(!t)return"none";const n=Math.min(t.x*.5,t.y*.5,e);return`path('${[`M 0,${n}`,`Q 0,0 ${n},0`,`T ${t.x-n},0`,`Q ${t.x},0 ${t.x},${n}`,`T ${t.x},${t.y-n}`,`Q ${t.x},${t.y} ${t.x-n},${t.y}`,`T ${n},${t.y}`,`Q 0,${t.y} 0,${t.y-n}`,"Z"].join(" ")}')`},[t,e])}const ie=r.forwardRef(function({children:e,className:t,iconLeft:n,iconRight:s,...l},c){return d.jsxs(se,{className:A(t,"justify-center gap-2 px-4 py-1"),ref:c,...l,children:[n,d.jsx(ne,{children:e}),s]})});function ne({children:i}){return d.jsx("span",{className:"inline-block transition-transform duration-200 ease-out-back-md group-hover:scale-110 group-active:scale-95",children:i})}const se=r.forwardRef(function({className:e,style:t,...n},s){const[l,c]=r.useState(null),f=te(l);return d.jsx("button",{ref:F(c,s),className:A("group inline-flex items-center rounded text-center font-bold tracking-wide text-stone-400 hover:bg-stone-300/25 hover:text-stone-500 focus:outline-none focus-visible:text-stone-600",e),style:{...t,clipPath:f},...n})});function ge({children:i,actionName:e,vfx:t,...n}){const s=ee(t,e,()=>({keyFrames:{transform:["scale(1)","scale(0.8)","scale(1)"]},duration:300,easing:N.outBackMd}));return d.jsx(ie,{...n,children:d.jsx("span",{className:"inline-block",ref:s,children:i})})}export{ge as A,ie as B,J as L,se as P,ve as V,g as a,te as b,X as c,pe as d,me as e,D as f,ee as g,fe as r,K as u};
