import{R as p}from"./chunk_jsx-runtime.3f231529.js";import{r as f,a as m}from"./chunk_index.0b2a17fa.js";import{a as u,b as w,I as x,e as S}from"./chunk_assert.38dcf398.js";import{V as d}from"./chunk_Vector2.bd43e687.js";var F=function r(e,t){if(e===t)return!0;if(e&&t&&typeof e=="object"&&typeof t=="object"){if(e.constructor!==t.constructor)return!1;var s,n,o;if(Array.isArray(e)){if(s=e.length,s!=t.length)return!1;for(n=s;n--!==0;)if(!r(e[n],t[n]))return!1;return!0}if(e instanceof Map&&t instanceof Map){if(e.size!==t.size)return!1;for(n of e.entries())if(!t.has(n[0]))return!1;for(n of e.entries())if(!r(n[1],t.get(n[0])))return!1;return!0}if(e instanceof Set&&t instanceof Set){if(e.size!==t.size)return!1;for(n of e.entries())if(!t.has(n[0]))return!1;return!0}if(ArrayBuffer.isView(e)&&ArrayBuffer.isView(t)){if(s=e.length,s!=t.length)return!1;for(n=s;n--!==0;)if(e[n]!==t[n])return!1;return!0}if(e.constructor===RegExp)return e.source===t.source&&e.flags===t.flags;if(e.valueOf!==Object.prototype.valueOf)return e.valueOf()===t.valueOf();if(e.toString!==Object.prototype.toString)return e.toString()===t.toString();if(o=Object.keys(e),s=o.length,s!==Object.keys(t).length)return!1;for(n=s;n--!==0;)if(!Object.prototype.hasOwnProperty.call(t,o[n]))return!1;for(n=s;n--!==0;){var i=o[n];if(!r(e[i],t[i]))return!1}return!0}return e!==e&&t!==t};let c;const a=new Map,y=new WeakMap;function g(r){for(const e of r){y.set(e.target,e);for(const t of w(a.get(e.target),"callback does not exist for tracked entry"))t(e)}}function h(){return c||(c=new p(g)),c}function v(r,e){let t=a.get(r);t||(t=new Set,a.set(r,t),h().observe(r));const s=y.get(r);s&&e(s),t.add(e)}function E(r,e){const t=a.get(r);u(t,"element is not tracked");const s=t.delete(e);u(s,"callback did not exist for element"),t.size===0&&(a.delete(r),h().unobserve(r))}function L(r,e){const[t,s]=f.exports.useState(null);return f.exports.useLayoutEffect(()=>{if(!r)return;const n=o=>{s(e(o))};return v(r,n),()=>{E(r,n)}},[r,e]),t}function b(r){return new d(r.contentRect.width,r.contentRect.height)}function A(r){return new d(r.borderBoxSize[0].inlineSize,r.borderBoxSize[0].blockSize)}var z,l=m.exports;z=l.createRoot,l.hydrateRoot;function M(r){const e=f.exports.useRef();return f.exports.useLayoutEffect(()=>{e.current=r}),f.exports.useCallback((...t)=>{const s=e.current;return u(s,"fn does not exist"),s(...t)},[])}function O(r){return x?r.metaKey:r.ctrlKey}function R(r,e){var s,n,o;const t=typeof e=="string"?{key:e}:e;return r.key.toLowerCase()===t.key.toLowerCase()&&((s=t.command)!=null?s:!1)===O(r)&&((n=t.shift)!=null?n:!1)===r.shiftKey&&((o=t.alt)!=null?o:!1)===r.altKey}function V(r,e){return R(r,e)&&r.repeat===!1}class K{constructor(){this.handlers=new Set,this.handleKeyDown=e=>{for(const{callback:t}of this.handlers)if(t(e))return},document.addEventListener("keydown",this.handleKeyDown)}destroy(){document.removeEventListener("keydown",this.handleKeyDown)}onKeyDown(e){const t={callback:e};return this.handlers.add(t),()=>{u(this.handlers.delete(t),"handler has already been deleted")}}}f.exports.createContext(new K);function k(r){return S(r).map(([e,t])=>e.startsWith("_")?t:`${e} = ${t}`).join(", ")}function $(r,e={}){return`${r}(${k(e)})`}export{L as a,V as b,z as c,$ as d,F as e,A as f,R as m,b as s,M as u};
