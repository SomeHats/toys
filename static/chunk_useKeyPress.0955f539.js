import{a as l,R as u}from"./chunk_utils.6b6c081d.js";import{u as d}from"./chunk_useResizeObserver.a6b609a9.js";import{r}from"./chunk_index.0b9c6f54.js";const a=Symbol();function h(n){return u?n.metaKey:n.ctrlKey}function o(n,t){const e=typeof t=="string"?{key:t}:t;return n.key.toLowerCase()===e.key.toLowerCase()&&(e.command===a||(e.command??!1)===h(n))&&(e.shift===a||(e.shift??!1)===n.shiftKey)&&(e.alt===a||(e.alt??!1)===n.altKey)}function w(n,t){return o(n,t)&&n.repeat===!1}function i(n){const t=r.useContext(c),e=d(n);r.useEffect(()=>t.onKeyDown(e),[e,t])}function y(n){const t=r.useContext(c),e=d(n);r.useEffect(()=>t.onKeyUp(e),[e,t])}function k(n){const[t,e]=r.useState(!1);return i(s=>(console.log(s.key),o(s,n)?(e(!0),!0):!1)),y(s=>o(s,n)?(e(!1),!0):!1),t}class f{constructor(){this.handlers=new Set,this.handleKeyDown=t=>{for(const{type:e,callback:s}of this.handlers)if(e==="down"&&s(t))return},this.handleKeyUp=t=>{for(const{type:e,callback:s}of this.handlers)if(e==="up"&&s(t))return},document.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keyup",this.handleKeyUp)}destroy(){document.removeEventListener("keydown",this.handleKeyDown),document.removeEventListener("keyup",this.handleKeyUp)}onKeyDown(t){const e={type:"down",callback:t};return this.handlers.add(e),()=>{l(this.handlers.delete(e),"handler has already been deleted")}}onKeyUp(t){const e={type:"up",callback:t};return this.handlers.add(e),()=>{l(this.handlers.delete(e),"handler has already been deleted")}}}const c=r.createContext(new f);export{a as A,w as a,o as m,k as u};
