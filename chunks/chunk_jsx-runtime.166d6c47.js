import{r as ae}from"./chunk_index.b0b8f4df.js";var c=[],ve=function(){return c.some(function(e){return e.activeTargets.length>0})},ce=function(){return c.some(function(e){return e.skippedTargets.length>0})},F="ResizeObserver loop completed with undelivered notifications.",ue=function(){var e;typeof ErrorEvent=="function"?e=new ErrorEvent("error",{message:F}):(e=document.createEvent("Event"),e.initEvent("error",!1,!1),e.message=F),window.dispatchEvent(e)},b;(function(e){e.BORDER_BOX="border-box",e.CONTENT_BOX="content-box",e.DEVICE_PIXEL_CONTENT_BOX="device-pixel-content-box"})(b||(b={}));var u=function(e){return Object.freeze(e)},fe=function(){function e(t,r){this.inlineSize=t,this.blockSize=r,u(this)}return e}(),G=function(){function e(t,r,n,i){return this.x=t,this.y=r,this.width=n,this.height=i,this.top=this.y,this.left=this.x,this.bottom=this.top+this.height,this.right=this.left+this.width,u(this)}return e.prototype.toJSON=function(){var t=this,r=t.x,n=t.y,i=t.top,o=t.right,s=t.bottom,f=t.left,h=t.width,v=t.height;return{x:r,y:n,top:i,right:o,bottom:s,left:f,width:h,height:v}},e.fromRect=function(t){return new e(t.x,t.y,t.width,t.height)},e}(),k=function(e){return e instanceof SVGElement&&"getBBox"in e},U=function(e){if(k(e)){var t=e.getBBox(),r=t.width,n=t.height;return!r&&!n}var i=e,o=i.offsetWidth,s=i.offsetHeight;return!(o||s||e.getClientRects().length)},L=function(e){var t,r;if(e instanceof Element)return!0;var n=(r=(t=e)===null||t===void 0?void 0:t.ownerDocument)===null||r===void 0?void 0:r.defaultView;return!!(n&&e instanceof n.Element)},he=function(e){switch(e.tagName){case"INPUT":if(e.type!=="image")break;case"VIDEO":case"AUDIO":case"EMBED":case"OBJECT":case"CANVAS":case"IFRAME":case"IMG":return!0}return!1},p=typeof window<"u"?window:{},O=new WeakMap,M=/auto|scroll/,de=/^tb|vertical/,le=/msie|trident/i.test(p.navigator&&p.navigator.userAgent),a=function(e){return parseFloat(e||"0")},d=function(e,t,r){return e===void 0&&(e=0),t===void 0&&(t=0),r===void 0&&(r=!1),new fe((r?t:e)||0,(r?e:t)||0)},W=u({devicePixelContentBoxSize:d(),borderBoxSize:d(),contentBoxSize:d(),contentRect:new G(0,0,0,0)}),J=function(e,t){if(t===void 0&&(t=!1),O.has(e)&&!t)return O.get(e);if(U(e))return O.set(e,W),W;var r=getComputedStyle(e),n=k(e)&&e.ownerSVGElement&&e.getBBox(),i=!le&&r.boxSizing==="border-box",o=de.test(r.writingMode||""),s=!n&&M.test(r.overflowY||""),f=!n&&M.test(r.overflowX||""),h=n?0:a(r.paddingTop),v=n?0:a(r.paddingRight),w=n?0:a(r.paddingBottom),l=n?0:a(r.paddingLeft),Z=n?0:a(r.borderTopWidth),ee=n?0:a(r.borderRightWidth),te=n?0:a(r.borderBottomWidth),re=n?0:a(r.borderLeftWidth),D=l+v,N=h+w,T=re+ee,B=Z+te,P=f?e.offsetHeight-B-e.clientHeight:0,I=s?e.offsetWidth-T-e.clientWidth:0,ne=i?D+T:0,ie=i?N+B:0,g=n?n.width:a(r.width)-ne-I,x=n?n.height:a(r.height)-ie-P,oe=g+D+I+T,se=x+N+P+B,A=u({devicePixelContentBoxSize:d(Math.round(g*devicePixelRatio),Math.round(x*devicePixelRatio),o),borderBoxSize:d(oe,se,o),contentBoxSize:d(g,x,o),contentRect:new G(l,h,g,x)});return O.set(e,A),A},Y=function(e,t,r){var n=J(e,r),i=n.borderBoxSize,o=n.contentBoxSize,s=n.devicePixelContentBoxSize;switch(t){case b.DEVICE_PIXEL_CONTENT_BOX:return s;case b.BORDER_BOX:return i;default:return o}},pe=function(){function e(t){var r=J(t);this.target=t,this.contentRect=r.contentRect,this.borderBoxSize=u([r.borderBoxSize]),this.contentBoxSize=u([r.contentBoxSize]),this.devicePixelContentBoxSize=u([r.devicePixelContentBoxSize])}return e}(),$=function(e){if(U(e))return 1/0;for(var t=0,r=e.parentNode;r;)t+=1,r=r.parentNode;return t},be=function(){var e=1/0,t=[];c.forEach(function(s){if(s.activeTargets.length!==0){var f=[];s.activeTargets.forEach(function(v){var w=new pe(v.target),l=$(v.target);f.push(w),v.lastReportedSize=Y(v.target,v.observedBox),l<e&&(e=l)}),t.push(function(){s.callback.call(s.observer,f,s.observer)}),s.activeTargets.splice(0,s.activeTargets.length)}});for(var r=0,n=t;r<n.length;r++){var i=n[r];i()}return e},H=function(e){c.forEach(function(r){r.activeTargets.splice(0,r.activeTargets.length),r.skippedTargets.splice(0,r.skippedTargets.length),r.observationTargets.forEach(function(i){i.isActive()&&($(i.target)>e?r.activeTargets.push(i):r.skippedTargets.push(i))})})},ge=function(){var e=0;for(H(e);ve();)e=be(),H(e);return ce()&&ue(),e>0},S,K=[],xe=function(){return K.splice(0).forEach(function(e){return e()})},Oe=function(e){if(!S){var t=0,r=document.createTextNode(""),n={characterData:!0};new MutationObserver(function(){return xe()}).observe(r,n),S=function(){r.textContent=""+(t?t--:t++)}}K.push(e),S()},me=function(e){Oe(function(){requestAnimationFrame(e)})},E=0,ye=function(){return!!E},Ee=250,ze={attributes:!0,characterData:!0,childList:!0,subtree:!0},V=["resize","load","transitionend","animationend","animationstart","animationiteration","keyup","keydown","mouseup","mousedown","mouseover","mouseout","blur","focus"],X=function(e){return e===void 0&&(e=0),Date.now()+e},_=!1,Re=function(){function e(){var t=this;this.stopped=!0,this.listener=function(){return t.schedule()}}return e.prototype.run=function(t){var r=this;if(t===void 0&&(t=Ee),!_){_=!0;var n=X(t);me(function(){var i=!1;try{i=ge()}finally{if(_=!1,t=n-X(),!ye())return;i?r.run(1e3):t>0?r.run(t):r.start()}})}},e.prototype.schedule=function(){this.stop(),this.run()},e.prototype.observe=function(){var t=this,r=function(){return t.observer&&t.observer.observe(document.body,ze)};document.body?r():p.addEventListener("DOMContentLoaded",r)},e.prototype.start=function(){var t=this;this.stopped&&(this.stopped=!1,this.observer=new MutationObserver(this.listener),this.observe(),V.forEach(function(r){return p.addEventListener(r,t.listener,!0)}))},e.prototype.stop=function(){var t=this;this.stopped||(this.observer&&this.observer.disconnect(),V.forEach(function(r){return p.removeEventListener(r,t.listener,!0)}),this.stopped=!0)},e}(),C=new Re,j=function(e){!E&&e>0&&C.start(),E+=e,!E&&C.stop()},we=function(e){return!k(e)&&!he(e)&&getComputedStyle(e).display==="inline"},Te=function(){function e(t,r){this.target=t,this.observedBox=r||b.CONTENT_BOX,this.lastReportedSize={inlineSize:0,blockSize:0}}return e.prototype.isActive=function(){var t=Y(this.target,this.observedBox,!0);return we(this.target)&&(this.lastReportedSize=t),this.lastReportedSize.inlineSize!==t.inlineSize||this.lastReportedSize.blockSize!==t.blockSize},e}(),Be=function(){function e(t,r){this.activeTargets=[],this.skippedTargets=[],this.observationTargets=[],this.observer=t,this.callback=r}return e}(),m=new WeakMap,q=function(e,t){for(var r=0;r<e.length;r+=1)if(e[r].target===t)return r;return-1},y=function(){function e(){}return e.connect=function(t,r){var n=new Be(t,r);m.set(t,n)},e.observe=function(t,r,n){var i=m.get(t),o=i.observationTargets.length===0;q(i.observationTargets,r)<0&&(o&&c.push(i),i.observationTargets.push(new Te(r,n&&n.box)),j(1),C.schedule())},e.unobserve=function(t,r){var n=m.get(t),i=q(n.observationTargets,r),o=n.observationTargets.length===1;i>=0&&(o&&c.splice(c.indexOf(n),1),n.observationTargets.splice(i,1),j(-1))},e.disconnect=function(t){var r=this,n=m.get(t);n.observationTargets.slice().forEach(function(i){return r.unobserve(t,i.target)}),n.activeTargets.splice(0,n.activeTargets.length)},e}(),Ie=function(){function e(t){if(arguments.length===0)throw new TypeError("Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.");if(typeof t!="function")throw new TypeError("Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.");y.connect(this,t)}return e.prototype.observe=function(t,r){if(arguments.length===0)throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present.");if(!L(t))throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element");y.observe(this,t,r)},e.prototype.unobserve=function(t){if(arguments.length===0)throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.");if(!L(t))throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element");y.unobserve(this,t)},e.prototype.disconnect=function(){y.disconnect(this)},e.toString=function(){return"function ResizeObserver () { [polyfill code] }"},e}(),z={exports:{}},R={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Se=ae.exports,_e=Symbol.for("react.element"),Ce=Symbol.for("react.fragment"),ke=Object.prototype.hasOwnProperty,De=Se.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Ne={key:!0,ref:!0,__self:!0,__source:!0};function Q(e,t,r){var n,i={},o=null,s=null;r!==void 0&&(o=""+r),t.key!==void 0&&(o=""+t.key),t.ref!==void 0&&(s=t.ref);for(n in t)ke.call(t,n)&&!Ne.hasOwnProperty(n)&&(i[n]=t[n]);if(e&&e.defaultProps)for(n in t=e.defaultProps,t)i[n]===void 0&&(i[n]=t[n]);return{$$typeof:_e,type:e,key:o,ref:s,props:i,_owner:De.current}}R.Fragment=Ce;R.jsx=Q;R.jsxs=Q;(function(e){e.exports=R})(z);const Ae=z.exports.Fragment,Fe=z.exports.jsx,Le=z.exports.jsxs;export{Ae as F,Ie as R,Fe as a,Le as j};
