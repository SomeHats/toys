var D=(o,e)=>()=>(e||o((e={exports:{}}).exports,e),e.exports);import{a as H,d as s,e as l,b as V,f as O}from"./chunk_utils.6b6c081d.js";/* empty css                       */import{C as X}from"./chunk_Circle.cbb167c4.js";import{V as h}from"./chunk_Vector2.355c88df.js";import{D as $}from"./chunk_DebugDraw.f44d647a.js";import"./chunk_AABB.8ddeea79.js";import"./chunk_Line2.d1eaec4c.js";var Z=D((se,v)=>{class Y{constructor(e){this.prefix=e,this.number=0}next(){return`${this.prefix}${this.number++}`}}const y=class{constructor(o,e,t){this.id=o,this.position=e,this.radius=t}static create(o,e){return new y(y.ids.next(),o,e)}toCircle(){return new X(this.position,this.radius)}};let I=y;I.ids=new Y("BlobTreeNode");class _{constructor(){this.nodesById=new Map,this.childrenById=new Map,this.parentById=new Map}getNodeByIdIfExists(e){return this.nodesById.get(e)}getNodeById(e){const t=this.getNodeByIdIfExists(e);return H(t,"Assertion Error: node"),t}getNodeParentIfExists(e){const t=this.parentById.get(e.id);if(t)return this.getNodeById(t)}getMutableChildIds(e){let t=this.childrenById.get(e.id);return t||(t=[],this.childrenById.set(e.id,t)),t}createNewRoot(e,t){const n=I.create(e,t);return this.nodesById.set(n.id,n),n}createNewChild(e,t,n){const i=I.create(t,n);return this.nodesById.set(i.id,i),this.parentById.set(i.id,e.id),this.getMutableChildIds(e).push(i.id),i}*iterateNodes(){for(const e of this.nodesById.values())yield e}*iterateChildNodes(e){for(const t of this.childrenById.get(e.id)??[])yield this.getNodeById(t)}*iterateRootNodes(){for(const e of this.nodesById.values())this.getNodeParentIfExists(e)||(yield e)}}const W={assert:s,clear:s,count:s,countReset:s,debug:s,dir:s,dirxml:s,error:s,group:s,groupCollapsed:s,groupEnd:s,info:s,log:s,table:s,time:s,timeEnd:s,timeLog:s,timeStamp:s,trace:s,warn:s,profile:s,profileEnd:s,Console:console.Console},x=.2;function M(o,e,t=W){for(const n of o.iterateRootNodes())G(o,n,e,t)}function G(o,e,t,n=W){const i=e,r=Array.from(o.iterateChildNodes(e))[0],b=r?Array.from(o.iterateChildNodes(r))[0]:void 0;if(!i||!r||!b)return;const z=i.toCircle(),u=r.toCircle(),S=b.toCircle(),w=z.outerTangentsWith(u),B=u.outerTangentsWith(S);if(!w||!B)return;const d=w[0],g=B[0];t.debugLine2(d,{color:"lime"}),t.debugLine2(g,{color:"lime"});const f=d.pointAtIntersectionWith(g),E=u.center.angleTo(f),T=d.isPointWithinBounds(f)&&g.isPointWithinBounds(f)?f:u.pointOnCircumference(E);t.debugPointX(T);const m=d.start,N=T,C=d.start.lerp(d.end,x).sub(m),P=h.fromPolar(E+Math.PI/2,d.length*x);t.debugVectorAtPoint(C,m),t.debugVectorAtPoint(P,N),t.debugBezierCurve(m,m.add(C),N.sub(P),N)}const k=6;class K{constructor(e,t){this.canvas=e,this.blobTree=t,this.mousePosition=h.ZERO,this.state={type:"idle"}}getSelectedNode(){switch(this.state.type){case"idle":return null;case"createNode":case"selectedIdle":case"moveNode":case"resizeNode":return this.state.node;default:l(this.state)}}getHover(){let e=null,t=1/0;for(const i of this.blobTree.iterateNodes()){const r=i.position.distanceTo(this.mousePosition);r>i.radius+k||r<t&&(t=r,e=i)}if(!e)return null;const n=Math.min(e.radius*.1,k);return{node:e,mode:t<e.radius-n?"center":"edge"}}onMouseMove(e){this.mousePosition=e}onMouseDown(e){switch(this.state.type){case"idle":case"selectedIdle":{const t=this.getHover();if(t)switch(t.mode){case"center":this.state={type:"moveNode",node:t.node,offset:t.node.position.sub(this.mousePosition)};return;case"edge":this.state={type:"resizeNode",node:t.node,offset:t.node.radius-t.node.position.distanceTo(this.mousePosition)};return;default:l(t.mode)}this.state={type:"createNode",node:this.state.type==="idle"?this.blobTree.createNewRoot(e,1):this.blobTree.createNewChild(this.state.node,e,1)};return}case"createNode":case"moveNode":case"resizeNode":return;default:l(this.state)}}onMouseUp(e){switch(this.state.type){case"idle":case"selectedIdle":return;case"createNode":case"moveNode":case"resizeNode":this.state={type:"selectedIdle",node:this.state.node};return;default:l(this.state)}}onKeyDown(e){console.log(e),e===" "&&M(this.blobTree,this.canvas,console)}tick(){switch(this.state.type){case"idle":return;case"createNode":this.state.node.radius=this.state.node.position.distanceTo(this.mousePosition);return;case"moveNode":this.state.node.position=this.mousePosition.add(this.state.offset);return;case"resizeNode":this.state.node.radius=this.mousePosition.distanceTo(this.state.node.position)+this.state.offset;return;case"selectedIdle":return;default:l(this.state)}}draw(){this.canvas.clear();const e=this.getHover();this.canvas.beginPath(),M(this.blobTree,this.canvas);for(const t of this.blobTree.iterateNodes()){const n=t===this.getSelectedNode()?{stroke:"lime",strokeWidth:2}:t===(e==null?void 0:e.node)?{stroke:"lime",strokeWidth:1}:{stroke:"magenta",strokeWidth:1};this.canvas.circle(t.position,t.radius,n);for(const i of this.blobTree.iterateChildNodes(t))this.canvas.polyLine([t.position,i.position],{stroke:"cyan",strokeWidth:1})}}}const a=document.createElement("canvas"),A=V(a.getContext("2d"),'Assertion Error: canvasEl.getContext("2d")'),L=document.body.clientWidth,R=document.body.clientHeight,p=window.devicePixelRatio;a.width=L*p;a.height=R*p;a.style.width=`${L}px`;a.style.height=`${R}px`;A.scale(p,p);const U=new $(A);document.body.appendChild(a);const c=new K(U,new _);document.addEventListener("mousemove",o=>{c.onMouseMove(new h(o.clientX,o.clientY))});document.addEventListener("mousedown",o=>{c.onMouseDown(new h(o.clientX,o.clientY))});document.addEventListener("mouseup",o=>{c.onMouseUp(new h(o.clientX,o.clientY))});document.addEventListener("keydown",o=>{c.onKeyDown(o.key)});O(()=>{c.tick(),c.draw()});v.hot&&v.hot.dispose(()=>window.location.reload())});export default Z();
