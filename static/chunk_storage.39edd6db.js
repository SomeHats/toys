import{S as c}from"./chunk_Vector2.5365c98f.js";import{X as a}from"./chunk_assert.30730bef.js";function s(e,t,o,n){try{const r=e.getItem(t);return r?o.parse(JSON.parse(r)).unwrap():a(n)}catch(r){return console.log("Error reading from storage:",r),a(n)}}function i(e,t,o=null){return s(e,t,c.unknown,o)}function g(e,t,o,n){const r=JSON.stringify(o.serialize(n));try{e.setItem(t,r)}catch(S){console.log(S)}}function u(e,t,o){return g(e,t,c.unknown,o)}function d(e,t){return i(window.localStorage,e,t)}function f(e,t){return u(window.localStorage,e,t)}function w(e,t,o){return s(window.localStorage,e,t,o)}function I(e,t,o){return g(window.localStorage,e,t,o)}function h(e,t){return i(window.sessionStorage,e,t)}function k(e,t){return u(window.sessionStorage,e,t)}export{h as a,k as b,w as c,I as d,s as e,g as f,d as g,f as s};
