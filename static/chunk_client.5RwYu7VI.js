import{r as m,a as l}from"./chunk_index.Tw3qZeYI.js";var f={exports:{}},s={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var u=m,c=Symbol.for("react.element"),x=Symbol.for("react.fragment"),y=Object.prototype.hasOwnProperty,v=u.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,R={key:!0,ref:!0,__self:!0,__source:!0};function i(t,r,p){var e,o={},n=null,a=null;p!==void 0&&(n=""+p),r.key!==void 0&&(n=""+r.key),r.ref!==void 0&&(a=r.ref);for(e in r)y.call(r,e)&&!R.hasOwnProperty(e)&&(o[e]=r[e]);if(t&&t.defaultProps)for(e in r=t.defaultProps,r)o[e]===void 0&&(o[e]=r[e]);return{$$typeof:c,type:t,key:n,ref:a,props:o,_owner:v.current}}s.Fragment=x;s.jsx=i;s.jsxs=i;f.exports=s;var O=f.exports,d,_=l;d=_.createRoot,_.hydrateRoot;export{d as c,O as j};
