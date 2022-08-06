import{a as n}from"./chunk_assert.b3c9f562.js";const l=1,m=1,u=1;class v{constructor(t,e,s=1){this._children=[],this._isPlaying=!1,this.frameHandle=null,this.lastElapsedTime=null,this.systemsByClass=new Map,this._tick=o=>{o=o*l;const c=this.lastElapsedTime;if(c!==null){const d=o-c;this.isPlaying&&(this.update(d),this.draw(o))}this.lastElapsedTime=o,this.frameHandle=window.requestAnimationFrame(this._tick)},this.canvas=document.createElement("canvas"),this.canvas.width=t*s,this.canvas.height=e*s,this.canvas.style.width=`${t}px`,this.canvas.style.height=`${e}px`;const a=this.canvas.getContext("2d");n(a,"ctx"),this.ctx=a,this._scaleFactor=s*m,this._setupVisiblityChange()}get width(){return this.canvas.width/this._scaleFactor}get height(){return this.canvas.height/this._scaleFactor}get scaleFactor(){return this._scaleFactor}get isPlaying(){return this.frameHandle!==null&&this._isPlaying}set isPlaying(t){n(this.frameHandle!==null,"cannot set isPlaying without calling start"),this._isPlaying=t}get children(){return this._children}appendTo(t){t.appendChild(this.canvas)}hasSystem(t){return this.systemsByClass.has(t)}getSystem(t){const e=this.systemsByClass.get(t);return n(e,`system, ${t.systemName} not found`),n(e instanceof t,"system is wrong instance type"),e}addSystem(t){n(!this.hasSystem(t.constructor),"only one system of each type allowed"),this.systemsByClass.set(t.constructor,t),t.afterAddToScene(this)}removeSystem(t){this.getSystem(t).beforeRemoveFromScene(this),this.systemsByClass.delete(t)}addChild(t){this._children.push(t),t.onAddedToScene(this)}addChildBefore(t,e){const s=this._children.indexOf(t);n(s!==-1,"target child must be present"),this.addChildAtIndex(s,e)}addChildAfter(t,e){const s=this._children.indexOf(t);n(s!==-1,"target child must be present"),this.addChildAtIndex(s+1,e)}addChildAtIndex(t,e){this._children.splice(t,0,e),e.onAddedToScene(this)}removeChild(t){const e=this._children.indexOf(t);return e===-1?!1:(this.removeChildAtIndex(e),!0)}removeChildAtIndex(t){const e=this._children[t];return this._children.splice(t,1),e.onRemovedFromScene(),e}update(t){for(let e=0;e<u;e++){for(const s of this.systemsByClass.values())s.beforeUpdate(t);this._children.forEach(s=>s.update(t));for(const s of this.systemsByClass.values())s.afterUpdate(t)}}draw(t){this.ctx.save(),this.ctx.scale(this._scaleFactor,this._scaleFactor),this.ctx.clearRect(0,0,this.width,this.height);for(const e of this.systemsByClass.values())e.beforeDraw(this.ctx,t);this._children.sort((e,s)=>e.getSortOrder()-s.getSortOrder()).forEach(e=>e.draw(this.ctx,t));for(const e of this.systemsByClass.values())e.afterDraw(this.ctx,t);this.ctx.restore()}start(){this._isPlaying=!0,this.frameHandle=window.requestAnimationFrame(this._tick)}stop(){this.frameHandle!==null&&(window.cancelAnimationFrame(this.frameHandle),this.frameHandle=null),this._isPlaying=!1,this.lastElapsedTime=null}_setupVisiblityChange(){let t=!1;document.addEventListener("visibilitychange",()=>{document.hidden&&this.isPlaying&&(t=!0,this.stop()),t&&!document.hidden&&(t=!1,this.start())})}}const r={},f=i=>(r[i]||(r[i]=0),`${i}@${r[i]++}`);class p{constructor(){this.id=f(this.constructor.name),this.scene=null}hasScene(){return this.scene!==null}getScene(){return n(this.scene,"scene must be present"),this.scene}draw(t,e){}update(t){}addTo(t){return t.addChild(this),this}onAddedToScene(t){this.scene=t}onRemovedFromScene(){this.scene=null}getSortOrder(){return 0}}class y{constructor(t){this.entity=t}onRemove(){}onAddedToScene(t){}onRemovedFromScene(t){}beforeUpdate(t){}update(t){}afterUpdate(t){}beforeDraw(t,e){}draw(t,e){}afterDraw(t,e){}getScene(){return this.entity.getScene()}}class h extends y{constructor(t,e){super(t),this.getSortOrderFn=e}getSortOrder(){return this.getSortOrderFn(this.entity)}}class S extends p{constructor(){super(...arguments),this.componentInstances=new Map}addComponent(t,...e){n(!this.componentInstances.has(t),`component instance ${t.name} already exists`);const s=new t(this,...e);return this.componentInstances.set(t,s),s}hasComponent(t){return this.componentInstances.has(t)}getComponent(t){const e=this.componentInstances.get(t);return n(e,`no instance for ${t.name} exists`),n(e instanceof t,"wrong instance type"),e}removeComponent(t){const e=this.getComponent(t);return this.componentInstances.delete(t),e.onRemove(),e}draw(t,e){for(const s of this.componentInstances.values())s.beforeDraw(t,e);for(const s of this.componentInstances.values())s.draw(t,e);for(const s of this.componentInstances.values())s.afterDraw(t,e)}update(t){for(const e of this.componentInstances.values())e.beforeUpdate(t);for(const e of this.componentInstances.values())e.update(t);for(const e of this.componentInstances.values())e.afterUpdate(t)}onAddedToScene(t){super.onAddedToScene(t);for(const e of this.componentInstances.values())e.onAddedToScene(t)}onRemovedFromScene(){const t=this.getScene();super.onRemovedFromScene();for(const e of this.componentInstances.values())e.onRemovedFromScene(t)}getSortOrder(){return this.hasComponent(h)?this.getComponent(h).getSortOrder():super.getSortOrder()}}export{y as C,S as E,p as S,v as a};
