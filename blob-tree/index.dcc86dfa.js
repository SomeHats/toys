!function(){function e(e){return e&&e.__esModule?e.default:e}var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},o={},n={},i=t.parcelRequire0561;null==i&&((i=function(e){if(e in o)return o[e].exports;if(e in n){var t=n[e];delete n[e];var i={id:e,exports:{}};return o[e]=i,t.call(i.exports,i,i.exports),i.exports}var r=new Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}).register=function(e,t){n[e]=t},t.parcelRequire0561=i);var r=i("8TSCy"),s=i("39Hjj"),a=i("8qLe2"),d={assert:(a=i("8qLe2")).noop,clear:a.noop,count:a.noop,countReset:a.noop,debug:a.noop,dir:a.noop,dirxml:a.noop,error:a.noop,group:a.noop,groupCollapsed:a.noop,groupEnd:a.noop,info:a.noop,log:a.noop,table:a.noop,time:a.noop,timeEnd:a.noop,timeLog:a.noop,timeStamp:a.noop,trace:a.noop,warn:a.noop,profile:a.noop,profileEnd:a.noop,Console:console.Console};s=i("39Hjj");function c(e,t,o){var n=void 0===o?d:o,i=!0,r=!1,s=void 0;try{for(var a,c=e.iterateRootNodes()[Symbol.iterator]();!(i=(a=c.next()).done);i=!0){u(e,a.value,t,n)}}catch(e){r=!0,s=e}finally{try{i||null==c.return||c.return()}finally{if(r)throw s}}}function u(e,t,o,n){var i=t,r=Array.from(e.iterateChildNodes(t))[0],a=r?Array.from(e.iterateChildNodes(r))[0]:void 0;if(i&&r&&a){var d=i.toCircle(),c=r.toCircle(),u=a.toCircle(),l=d.outerTangentsWith(c),h=c.outerTangentsWith(u);if(l&&h){var v=l[0],f=h[0];o.debugLine2(v,{color:"lime"}),o.debugLine2(f,{color:"lime"});var p=v.pointAtIntersectionWith(f),y=c.center.angleTo(p),b=v.isPointWithinBounds(p)&&f.isPointWithinBounds(p)?p:c.pointOnCircumference(y);o.debugPointX(b);var w=v.start,m=b,k=v.start.lerp(v.end,.2).sub(w),g=s.default.fromPolar(y+Math.PI/2,.2*v.length);o.debugVectorAtPoint(k,w),o.debugVectorAtPoint(g,m),o.debugBezierCurve(w,w.add(k),m.sub(g),m)}}}var l=function(){"use strict";function e(t,o){r.classCallCheck(this,e),this.canvas=t,this.blobTree=o,this.mousePosition=s.default.ZERO,this.state={type:"idle"}}return r.createClass(e,[{key:"getSelectedNode",value:function(){switch(this.state.type){case"idle":return null;case"createNode":case"selectedIdle":case"moveNode":case"resizeNode":return this.state.node;default:a.exhaustiveSwitchError(this.state)}}},{key:"getHover",value:function(){var e=null,t=1/0,o=!0,n=!1,i=void 0;try{for(var r,s=this.blobTree.iterateNodes()[Symbol.iterator]();!(o=(r=s.next()).done);o=!0){var a=r.value,d=a.position.distanceTo(this.mousePosition);d>a.radius+6||d<t&&(t=d,e=a)}}catch(e){n=!0,i=e}finally{try{o||null==s.return||s.return()}finally{if(n)throw i}}if(!e)return null;var c=Math.min(.1*e.radius,6);return{node:e,mode:t<e.radius-c?"center":"edge"}}},{key:"onMouseMove",value:function(e){this.mousePosition=e}},{key:"onMouseDown",value:function(e){switch(this.state.type){case"idle":case"selectedIdle":var t=this.getHover();if(t)switch(t.mode){case"center":return void(this.state={type:"moveNode",node:t.node,offset:t.node.position.sub(this.mousePosition)});case"edge":return void(this.state={type:"resizeNode",node:t.node,offset:t.node.radius-t.node.position.distanceTo(this.mousePosition)});default:a.exhaustiveSwitchError(t.mode)}return void(this.state={type:"createNode",node:"idle"===this.state.type?this.blobTree.createNewRoot(e,1):this.blobTree.createNewChild(this.state.node,e,1)});case"selectedIdle":return void(this.state={type:"createNode",node:this.blobTree.createNewChild(this.state.node,e,1)});case"createNode":case"moveNode":case"resizeNode":return;default:a.exhaustiveSwitchError(this.state)}}},{key:"onMouseUp",value:function(e){switch(this.state.type){case"idle":case"selectedIdle":return;case"createNode":case"moveNode":case"resizeNode":return void(this.state={type:"selectedIdle",node:this.state.node});default:a.exhaustiveSwitchError(this.state)}}},{key:"onKeyDown",value:function(e){console.log(e)," "===e&&c(this.blobTree,this.canvas,console)}},{key:"tick",value:function(){switch(this.state.type){case"idle":return;case"createNode":return void(this.state.node.radius=this.state.node.position.distanceTo(this.mousePosition));case"moveNode":return void(this.state.node.position=this.mousePosition.add(this.state.offset));case"resizeNode":this.state.node.radius=this.mousePosition.distanceTo(this.state.node.position)+this.state.offset;case"selectedIdle":return;default:a.exhaustiveSwitchError(this.state)}}},{key:"draw",value:function(){this.canvas.clear();this.getSelectedNode();var e=this.getHover();this.canvas.beginPath(),c(this.blobTree,this.canvas);var t=!0,o=!1,n=void 0;try{for(var i,r=this.blobTree.iterateNodes()[Symbol.iterator]();!(t=(i=r.next()).done);t=!0){var s=i.value,a=s===this.getSelectedNode()?{stroke:"lime",strokeWidth:2}:s===(null==e?void 0:e.node)?{stroke:"lime",strokeWidth:1}:{stroke:"magenta",strokeWidth:1};this.canvas.circle(s.position,s.radius,a);var d=!0,u=!1,l=void 0;try{for(var h,v=this.blobTree.iterateChildNodes(s)[Symbol.iterator]();!(d=(h=v.next()).done);d=!0){var f=h.value;this.canvas.polyLine([s.position,f.position],{stroke:"cyan",strokeWidth:1})}}catch(e){u=!0,l=e}finally{try{d||null==v.return||v.return()}finally{if(u)throw l}}}}catch(e){o=!0,n=e}finally{try{t||null==r.return||r.return()}finally{if(o)throw n}}}}]),e}(),h=(a=i("8qLe2"),i("aCcLp")),v=document.createElement("canvas"),f=v.getContext("2d"),p=document.body.clientWidth,y=document.body.clientHeight,b=window.devicePixelRatio;v.width=p*b,v.height=y*b,v.style.width="".concat(p,"px"),v.style.height="".concat(y,"px"),f.scale(b,b);var w=new h.DebugDraw(f);document.body.appendChild(v);r=i("8TSCy");var m=i("2TvXO"),k=i("8OvEy"),g=i("eJCSX"),x=(r=i("8TSCy"),function(){"use strict";function e(t){r.classCallCheck(this,e),this.prefix=t,this.number=0}return r.createClass(e,[{key:"next",value:function(){return"".concat(this.prefix).concat(this.number++)}}]),e}()),N=function(){"use strict";function e(t,o,n){r.classCallCheck(this,e),this.id=t,this.position=o,this.radius=n}return r.createClass(e,[{key:"toCircle",value:function(){return new g.default(this.position,this.radius)}}],[{key:"create",value:function(t,o){return new e(e.ids.next(),t,o)}}]),e}();N.ids=new x("BlobTreeNode");var C=function(){"use strict";function t(){r.classCallCheck(this,t),this.nodesById=new Map,this.childrenById=new Map,this.parentById=new Map}return r.createClass(t,[{key:"getNodeByIdIfExists",value:function(e){return this.nodesById.get(e)}},{key:"getNodeById",value:function(e){var t=this.getNodeByIdIfExists(e);return k.assert(t),t}},{key:"getNodeParentIfExists",value:function(e){var t=this.parentById.get(e.id);if(t)return this.getNodeById(t)}},{key:"getMutableChildIds",value:function(e){var t=this.childrenById.get(e.id);return t||(t=[],this.childrenById.set(e.id,t)),t}},{key:"createNewRoot",value:function(e,t){var o=N.create(e,t);return this.nodesById.set(o.id,o),o}},{key:"createNewChild",value:function(e,t,o){var n=N.create(t,o);return this.nodesById.set(n.id,n),this.parentById.set(n.id,e.id),this.getMutableChildIds(e).push(n.id),n}},{key:"iterateNodes",value:e(m).mark((function t(){var o,n,i,r,s,a;return e(m).wrap((function(e){for(;;)switch(e.prev=e.next){case 0:o=!0,n=!1,i=void 0,e.prev=1,r=this.nodesById.values()[Symbol.iterator]();case 3:if(o=(s=r.next()).done){e.next=10;break}return a=s.value,e.next=7,a;case 7:o=!0,e.next=3;break;case 10:e.next=16;break;case 12:e.prev=12,e.t0=e.catch(1),n=!0,i=e.t0;case 16:e.prev=16,e.prev=17,o||null==r.return||r.return();case 19:if(e.prev=19,!n){e.next=22;break}throw i;case 22:return e.finish(19);case 23:return e.finish(16);case 24:case"end":return e.stop()}}),t,this,[[1,12,16,24],[17,,19,23]])}))},{key:"iterateChildNodes",value:e(m).mark((function t(o){var n,i,r,s,a,d,c;return e(m).wrap((function(e){for(;;)switch(e.prev=e.next){case 0:i=!0,r=!1,s=void 0,e.prev=2,a=(null!==(n=this.childrenById.get(o.id))&&void 0!==n?n:[])[Symbol.iterator]();case 4:if(i=(d=a.next()).done){e.next=11;break}return c=d.value,e.next=8,this.getNodeById(c);case 8:i=!0,e.next=4;break;case 11:e.next=17;break;case 13:e.prev=13,e.t0=e.catch(2),r=!0,s=e.t0;case 17:e.prev=17,e.prev=18,i||null==a.return||a.return();case 20:if(e.prev=20,!r){e.next=23;break}throw s;case 23:return e.finish(20);case 24:return e.finish(17);case 25:case"end":return e.stop()}}),t,this,[[2,13,17,25],[18,,20,24]])}))},{key:"iterateRootNodes",value:e(m).mark((function t(){var o,n,i,r,s,a;return e(m).wrap((function(e){for(;;)switch(e.prev=e.next){case 0:o=!0,n=!1,i=void 0,e.prev=1,r=this.nodesById.values()[Symbol.iterator]();case 3:if(o=(s=r.next()).done){e.next=11;break}if(a=s.value,this.getNodeParentIfExists(a)){e.next=8;break}return e.next=8,a;case 8:o=!0,e.next=3;break;case 11:e.next=17;break;case 13:e.prev=13,e.t0=e.catch(1),n=!0,i=e.t0;case 17:e.prev=17,e.prev=18,o||null==r.return||r.return();case 20:if(e.prev=20,!n){e.next=23;break}throw i;case 23:return e.finish(20);case 24:return e.finish(17);case 25:case"end":return e.stop()}}),t,this,[[1,13,17,25],[18,,20,24]])}))}]),t}(),I=(s=i("39Hjj"),new l(w,new C));document.addEventListener("mousemove",(function(e){I.onMouseMove(new s.default(e.clientX,e.clientY))})),document.addEventListener("mousedown",(function(e){I.onMouseDown(new s.default(e.clientX,e.clientY))})),document.addEventListener("mouseup",(function(e){I.onMouseUp(new s.default(e.clientX,e.clientY))})),document.addEventListener("keydown",(function(e){I.onKeyDown(e.key)})),a.frameLoop((function(){I.tick(),I.draw()}))}();
//# sourceMappingURL=index.dcc86dfa.js.map
