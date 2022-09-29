var D=(o,e)=>()=>(e||o((e={exports:{}}).exports,e),e.exports);import{o as s,c as l,b as H,a as V,i as O}from"./chunk_assert.7b44d50d.js";/* empty css                       */import{V as h}from"./chunk_Vector2.d99b02af.js";import{D as X}from"./chunk_DebugDraw.44461eca.js";import{C as $}from"./chunk_Circle.564a5fb4.js";import"./chunk_AABB.eaf75ebd.js";var Z=D((oe,b)=>{const W={assert:s,clear:s,count:s,countReset:s,debug:s,dir:s,dirxml:s,error:s,group:s,groupCollapsed:s,groupEnd:s,info:s,log:s,table:s,time:s,timeEnd:s,timeLog:s,timeStamp:s,trace:s,warn:s,profile:s,profileEnd:s,Console:console.Console},x=.2;function M(o,e,t=W){for(const i of o.iterateRootNodes())Y(o,i,e,t)}function Y(o,e,t,i=W){const n=e,d=Array.from(o.iterateChildNodes(e))[0],v=d?Array.from(o.iterateChildNodes(d))[0]:void 0;if(!n||!d||!v)return;const A=n.toCircle(),u=d.toCircle(),S=v.toCircle(),w=A.outerTangentsWith(u),B=u.outerTangentsWith(S);if(!w||!B)return;const r=w[0],g=B[0];t.debugLine2(r,{color:"lime"}),t.debugLine2(g,{color:"lime"});const f=r.pointAtIntersectionWith(g),T=u.center.angleTo(f),C=r.isPointWithinBounds(f)&&g.isPointWithinBounds(f)?f:u.pointOnCircumference(T);t.debugPointX(C);const m=r.start,N=C,E=r.start.lerp(r.end,x).sub(m),P=h.fromPolar(T+Math.PI/2,r.length*x);t.debugVectorAtPoint(E,m),t.debugVectorAtPoint(P,N),t.debugBezierCurve(m,m.add(E),N.sub(P),N)}const k=6;class _{constructor(e,t){this.canvas=e,this.blobTree=t,this.mousePosition=h.ZERO,this.state={type:"idle"}}getSelectedNode(){switch(this.state.type){case"idle":return null;case"createNode":case"selectedIdle":case"moveNode":case"resizeNode":return this.state.node;default:l(this.state)}}getHover(){let e=null,t=1/0;for(const n of this.blobTree.iterateNodes()){const d=n.position.distanceTo(this.mousePosition);d>n.radius+k||d<t&&(t=d,e=n)}if(!e)return null;const i=Math.min(e.radius*.1,k);return{node:e,mode:t<e.radius-i?"center":"edge"}}onMouseMove(e){this.mousePosition=e}onMouseDown(e){switch(this.state.type){case"idle":case"selectedIdle":{const t=this.getHover();if(t)switch(t.mode){case"center":this.state={type:"moveNode",node:t.node,offset:t.node.position.sub(this.mousePosition)};return;case"edge":this.state={type:"resizeNode",node:t.node,offset:t.node.radius-t.node.position.distanceTo(this.mousePosition)};return;default:l(t.mode)}this.state={type:"createNode",node:this.state.type==="idle"?this.blobTree.createNewRoot(e,1):this.blobTree.createNewChild(this.state.node,e,1)};return}case"createNode":case"moveNode":case"resizeNode":return;default:l(this.state)}}onMouseUp(e){switch(this.state.type){case"idle":case"selectedIdle":return;case"createNode":case"moveNode":case"resizeNode":this.state={type:"selectedIdle",node:this.state.node};return;default:l(this.state)}}onKeyDown(e){console.log(e),e===" "&&M(this.blobTree,this.canvas,console)}tick(){switch(this.state.type){case"idle":return;case"createNode":this.state.node.radius=this.state.node.position.distanceTo(this.mousePosition);return;case"moveNode":this.state.node.position=this.mousePosition.add(this.state.offset);return;case"resizeNode":this.state.node.radius=this.mousePosition.distanceTo(this.state.node.position)+this.state.offset;return;case"selectedIdle":return;default:l(this.state)}}draw(){this.canvas.clear();const e=this.getHover();this.canvas.beginPath(),M(this.blobTree,this.canvas);for(const t of this.blobTree.iterateNodes()){const i=t===this.getSelectedNode()?{stroke:"lime",strokeWidth:2}:t===(e==null?void 0:e.node)?{stroke:"lime",strokeWidth:1}:{stroke:"magenta",strokeWidth:1};this.canvas.circle(t.position,t.radius,i);for(const n of this.blobTree.iterateChildNodes(t))this.canvas.polyLine([t.position,n.position],{stroke:"cyan",strokeWidth:1})}}}const a=document.createElement("canvas"),L=H(a.getContext("2d")),R=document.body.clientWidth,z=document.body.clientHeight,p=window.devicePixelRatio;a.width=R*p;a.height=z*p;a.style.width=`${R}px`;a.style.height=`${z}px`;L.scale(p,p);const G=new X(L);document.body.appendChild(a);class K{constructor(e){this.prefix=e,this.number=0}next(){return`${this.prefix}${this.number++}`}}const y=class{constructor(o,e,t){this.id=o,this.position=e,this.radius=t}static create(o,e){return new y(y.ids.next(),o,e)}toCircle(){return new $(this.position,this.radius)}};let I=y;I.ids=new K("BlobTreeNode");class U{constructor(){this.nodesById=new Map,this.childrenById=new Map,this.parentById=new Map}getNodeByIdIfExists(e){return this.nodesById.get(e)}getNodeById(e){const t=this.getNodeByIdIfExists(e);return V(t),t}getNodeParentIfExists(e){const t=this.parentById.get(e.id);if(!!t)return this.getNodeById(t)}getMutableChildIds(e){let t=this.childrenById.get(e.id);return t||(t=[],this.childrenById.set(e.id,t)),t}createNewRoot(e,t){const i=I.create(e,t);return this.nodesById.set(i.id,i),i}createNewChild(e,t,i){const n=I.create(t,i);return this.nodesById.set(n.id,n),this.parentById.set(n.id,e.id),this.getMutableChildIds(e).push(n.id),n}*iterateNodes(){for(const e of this.nodesById.values())yield e}*iterateChildNodes(e){var t;for(const i of(t=this.childrenById.get(e.id))!=null?t:[])yield this.getNodeById(i)}*iterateRootNodes(){for(const e of this.nodesById.values())this.getNodeParentIfExists(e)||(yield e)}}const c=new _(G,new U);document.addEventListener("mousemove",o=>{c.onMouseMove(new h(o.clientX,o.clientY))});document.addEventListener("mousedown",o=>{c.onMouseDown(new h(o.clientX,o.clientY))});document.addEventListener("mouseup",o=>{c.onMouseUp(new h(o.clientX,o.clientY))});document.addEventListener("keydown",o=>{c.onKeyDown(o.key)});O(()=>{c.tick(),c.draw()});b.hot&&b.hot.dispose(()=>window.location.reload())});export default Z();
