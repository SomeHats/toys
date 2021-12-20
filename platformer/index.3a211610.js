var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},e={},s={},n=t.parcelRequire0561;function i(t,e){t||function(t){throw new Error(t)}(e||"Assertion Error")}null==n&&((n=function(t){if(t in e)return e[t].exports;if(t in s){var n=s[t];delete s[t];var i={id:t,exports:{}};return e[t]=i,n.call(i.exports,i,i.exports),i.exports}var o=new Error("Cannot find module '"+t+"'");throw o.code="MODULE_NOT_FOUND",o}).register=function(t,e){s[t]=e},t.parcelRequire0561=n);var o=n("23QbL");function r(t,e,s){return(e-t)*s+t}function a(t){return Object.entries(t)}class h{static fromPolar(t,e){return new h(e*Math.cos(t),e*Math.sin(t))}static average(t){return t.reduce(((t,e)=>t.add(e)),h.ZERO).div(t.length)}static fromVectorLike({x:t,y:e}){return new h(t,e)}toString(){return`Vector2(${this.x}, ${this.y})`}get magnitudeSquared(){return this.x*this.x+this.y*this.y}get magnitude(){return Math.sqrt(this.magnitudeSquared)}get angle(){return Math.atan2(this.y,this.x)}isInPolygon(t){const{x:e,y:s}=this;let n=!1;for(let i=0,o=t.length-1;i<t.length;o=i++){const{x:r,y:a}=t[i],{x:h,y:c}=t[o];a>s!=c>s&&e<(h-r)*(s-a)/(c-a)+r&&(n=!n)}return n}equals(t){return this===t||this.x===t.x&&this.y===t.y}distanceTo({x:t,y:e}){const s=t-this.x,n=e-this.y;return Math.sqrt(s*s+n*n)}angleTo(t){return t.sub(this).angle}angleBetween(t){return e=Math.atan2(t.y,t.x)-Math.atan2(this.y,this.x),function(t,e,s){const n=e-t;for(s-=t;s<0;)s+=n;return t+s%n}(-Math.PI,Math.PI,e);var e}dot(t){return this.x*t.x+this.y*t.y}div(t){return new h(this.x/t,this.y/t)}scale(t){return new h(this.x*t,this.y*t)}negate(){return this.scale(-1)}add({x:t,y:e}){return new h(this.x+t,this.y+e)}sub({x:t,y:e}){return new h(this.x-t,this.y-e)}floor(){return new h(Math.floor(this.x),Math.floor(this.y))}ceil(){return new h(Math.ceil(this.x),Math.ceil(this.y))}round(){return new h(Math.round(this.x),Math.round(this.y))}withMagnitude(t){return h.fromPolar(this.angle,t)}normalize(){return this.withMagnitude(1)}withAngle(t){return h.fromPolar(t,this.magnitude)}rotate(t){return this.withAngle(this.angle+t)}lerp(t,e){return new h(r(this.x,t.x,e),r(this.y,t.y,e))}constructor(t,e){this.x=t,this.y=e}}h.ZERO=new h(0,0);const c=new h(5,0),l=.75*Math.PI;class d{clear(t){t?(this.applyFillOptions({fill:t}),this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height)):this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height)}beginPath(){this.ctx.beginPath()}moveTo({x:t,y:e}){this.ctx.moveTo(t,e)}lineTo({x:t,y:e}){this.ctx.lineTo(t,e)}arc({x:t,y:e},s,n,i,o){this.ctx.arc(t,e,s,n,i,o)}arcTo(t,e,s){this.ctx.arcTo(t.x,t.y,e.x,e.y,s)}quadraticCurveTo(t,e){this.ctx.quadraticCurveTo(t.x,t.y,e.x,e.y)}bezierCurveTo(t,e,s){this.ctx.bezierCurveTo(t.x,t.y,e.x,e.y,s.x,s.y)}applyStrokeOptions({strokeWidth:t=1,stroke:e,strokeCap:s="butt",strokeDash:n=[],strokeDashOffset:i=0,strokeJoin:o="round"}){e&&(this.ctx.lineWidth=t,this.ctx.strokeStyle=e,this.ctx.lineCap=s,this.ctx.setLineDash(n),this.ctx.lineDashOffset=i,this.ctx.lineJoin=o)}stroke(t){t.stroke&&(this.applyStrokeOptions(t),this.ctx.stroke())}applyFillOptions({fill:t}){t&&(this.ctx.fillStyle=t)}fill(t){t.fill&&(this.applyFillOptions(t),this.ctx.fill())}applyStrokeAndFillOptions(t){this.applyFillOptions(t),this.applyStrokeOptions(t)}strokeAndFill(t){this.fill(t),this.stroke(t)}getDebugStrokeOptions(t="magenta"){return{stroke:t,strokeWidth:.5}}debugStroke(t="magenta"){this.stroke(this.getDebugStrokeOptions(t))}fillText(t,e,s={}){this.applyFillOptions(s),this.ctx.fillText(t,e.x,e.y)}circle(t,e,s){this.beginPath(),this.arc(t,e,0,2*Math.PI),this.strokeAndFill(s)}ellipse(t,e,s,n){this.beginPath(),this.ctx.ellipse(t.x,t.y,e,s,0,0,2*Math.PI),this.strokeAndFill(n)}debugLabel(t,e,s){t&&(this.applyFillOptions({fill:s}),this.fillText(t,e.add(c)))}debugPointX(t,{color:e="magenta",label:s}={}){this.debugLabel(s,t,e),this.beginPath(),this.ctx.moveTo(t.x-3,t.y-3),this.ctx.lineTo(t.x+3,t.y+3),this.ctx.moveTo(t.x+3,t.y-3),this.ctx.lineTo(t.x-3,t.y+3),this.stroke({strokeWidth:.5,stroke:e})}debugPointO(t,{color:e="magenta",label:s}={}){this.debugLabel(s,t,e),this.circle(t,3,{strokeWidth:.5,stroke:e})}debugArrow(t,e,{color:s="magenta",label:n}={}){this.debugLabel(n,h.average([t,e]),s),this.ctx.beginPath(),this.moveTo(t),this.lineTo(e);const i=e.sub(t),o=i.rotate(-l).withMagnitude(5).add(e),r=i.rotate(+l).withMagnitude(5).add(e);this.moveTo(o),this.lineTo(e),this.lineTo(r),this.stroke({strokeWidth:.5,stroke:s})}debugVectorAtPoint(t,e,s){this.debugArrow(e,e.add(t),s)}polygon(t,e={}){this.beginPath(),this.moveTo(t[t.length-1]);for(const e of t)this.lineTo(e);this.strokeAndFill(e)}polyLine(t,e={}){this.beginPath(),this.moveTo(t[0]);for(let e=1;e<t.length;e++)this.lineTo(t[e]);this.stroke(e)}debugPolygon(t,{color:e="magenta",label:s}={}){this.debugLabel(s,t[0],e),this.polygon(t,this.getDebugStrokeOptions(e))}debugPolyLine(t,{color:e="magenta",label:s}={}){this.debugLabel(s,t[0],e),this.polyLine(t,this.getDebugStrokeOptions(e))}debugQuadraticCurve(t,e,s,{color:n="magenta",label:i}={}){this.debugLabel(i,t,n),this.beginPath(),this.moveTo(t),this.quadraticCurveTo(e,s),this.stroke(this.getDebugStrokeOptions(n))}debugBezierCurve(t,e,s,n,{color:i="magenta",label:o}={}){this.debugLabel(o,t,i),this.beginPath(),this.moveTo(t),this.bezierCurveTo(e,s,n),this.stroke(this.getDebugStrokeOptions(i))}debugLine2(t,{color:e="magenta",label:s}={}){this.debugLabel(s,t.start,e),this.debugArrow(t.start,t.end,{color:e,label:s})}aabb(t,e){e.debug&&this.debugLabel(e.debug.label,t.origin,e.debug.color||"magenta"),this.ctx.beginPath(),this.ctx.rect(t.left,t.top,t.width,t.height),this.strokeAndFill(e)}constructor(t){this.ctx=t}}class u{static fromLeftTopRightBottom(t,e,s,n){return new u(new h(t,e),new h(s-t,n-e))}contains({x:t,y:e}){return this.left<=t&&t<=this.right&&this.top<=e&&e<=this.bottom}intersects(t){return!(this.right<t.left||this.left>t.right||this.bottom<t.top||this.top>t.bottom)}getCenter(){return this.origin.add(this.size.scale(.5))}get left(){return this.origin.x}get right(){return this.origin.x+this.size.x}get top(){return this.origin.y}get bottom(){return this.origin.y+this.size.y}get width(){return this.size.x}get height(){return this.size.y}constructor(t,e){this.origin=t,this.size=e,Object.freeze(this)}}var g,m;(m=g||(g={}))[m.THAT_KEY_HAS_NO_KEYCODE=0]="THAT_KEY_HAS_NO_KEYCODE",m[m.BREAK=3]="BREAK",m[m.BACKSPACE_DELETE=8]="BACKSPACE_DELETE",m[m.TAB=9]="TAB",m[m.CLEAR=12]="CLEAR",m[m.ENTER=13]="ENTER",m[m.SHIFT=16]="SHIFT",m[m.CTRL=17]="CTRL",m[m.ALT=18]="ALT",m[m.PAUSE_BREAK=19]="PAUSE_BREAK",m[m.CAPS_LOCK=20]="CAPS_LOCK",m[m.ESCAPE=27]="ESCAPE",m[m.SPACE=32]="SPACE",m[m.PAGE_UP=33]="PAGE_UP",m[m.PAGE_DOWN=34]="PAGE_DOWN",m[m.END=35]="END",m[m.HOME=36]="HOME",m[m.LEFT_ARROW=37]="LEFT_ARROW",m[m.UP_ARROW=38]="UP_ARROW",m[m.RIGHT_ARROW=39]="RIGHT_ARROW",m[m.DOWN_ARROW=40]="DOWN_ARROW",m[m.SELECT=41]="SELECT",m[m.PRINT=42]="PRINT",m[m.EXECUTE=43]="EXECUTE",m[m.PRINT_SCREEN=44]="PRINT_SCREEN",m[m.INSERT=45]="INSERT",m[m.DELETE=46]="DELETE",m[m.HELP=47]="HELP",m[m.DIGIT_0=48]="DIGIT_0",m[m.DIGIT_1=49]="DIGIT_1",m[m.DIGIT_2=50]="DIGIT_2",m[m.DIGIT_3=51]="DIGIT_3",m[m.DIGIT_4=52]="DIGIT_4",m[m.DIGIT_5=53]="DIGIT_5",m[m.DIGIT_6=54]="DIGIT_6",m[m.DIGIT_7=55]="DIGIT_7",m[m.DIGIT_8=56]="DIGIT_8",m[m.DIGIT_9=57]="DIGIT_9",m[m.COLON=58]="COLON",m[m.LESS_THAN=60]="LESS_THAN",m[m.A=65]="A",m[m.B=66]="B",m[m.C=67]="C",m[m.D=68]="D",m[m.E=69]="E",m[m.F=70]="F",m[m.G=71]="G",m[m.H=72]="H",m[m.I=73]="I",m[m.J=74]="J",m[m.K=75]="K",m[m.L=76]="L",m[m.M=77]="M",m[m.N=78]="N",m[m.O=79]="O",m[m.P=80]="P",m[m.Q=81]="Q",m[m.R=82]="R",m[m.S=83]="S",m[m.T=84]="T",m[m.U=85]="U",m[m.V=86]="V",m[m.W=87]="W",m[m.X=88]="X",m[m.Y=89]="Y",m[m.Z=90]="Z",m[m.NUMPAD_0=96]="NUMPAD_0",m[m.NUMPAD_1=97]="NUMPAD_1",m[m.NUMPAD_2=98]="NUMPAD_2",m[m.NUMPAD_3=99]="NUMPAD_3",m[m.NUMPAD_4=100]="NUMPAD_4",m[m.NUMPAD_5=101]="NUMPAD_5",m[m.NUMPAD_6=102]="NUMPAD_6",m[m.NUMPAD_7=103]="NUMPAD_7",m[m.NUMPAD_8=104]="NUMPAD_8",m[m.NUMPAD_9=105]="NUMPAD_9",m[m.NUMPAD_MULTIPLY=106]="NUMPAD_MULTIPLY",m[m.NUMPAD_ADD=107]="NUMPAD_ADD",m[m.NUMPAD_PERIOD=108]="NUMPAD_PERIOD",m[m.NUMPAD_SUBTRACT=109]="NUMPAD_SUBTRACT",m[m.F1=112]="F1",m[m.F2=113]="F2",m[m.F3=114]="F3",m[m.F4=115]="F4",m[m.F5=116]="F5",m[m.F6=117]="F6",m[m.F7=118]="F7",m[m.F8=119]="F8",m[m.F9=120]="F9",m[m.F10=121]="F10",m[m.F11=122]="F11",m[m.F12=123]="F12",m[m.F13=124]="F13",m[m.F14=125]="F14",m[m.F15=126]="F15",m[m.F16=127]="F16",m[m.F17=128]="F17",m[m.F18=129]="F18",m[m.F19=130]="F19",m[m.F20=131]="F20",m[m.F21=132]="F21",m[m.F22=133]="F22",m[m.F23=134]="F23",m[m.F24=135]="F24",m[m.F25=136]="F25",m[m.F26=137]="F26",m[m.F27=138]="F27",m[m.F28=139]="F28",m[m.F29=140]="F29",m[m.F30=141]="F30",m[m.F31=142]="F31",m[m.F32=143]="F32",m[m.NUM_LOCK=144]="NUM_LOCK",m[m.SCROLL_LOCK=145]="SCROLL_LOCK",m[m.AIRPLANE_MODE=151]="AIRPLANE_MODE",m[m.PAGE_BACKWARD=166]="PAGE_BACKWARD",m[m.PAGE_FORWARD=167]="PAGE_FORWARD",m[m.HOME_KEY=172]="HOME_KEY",m[m.SEMI_COLON=186]="SEMI_COLON",m[m.EQUAL_SIGN=187]="EQUAL_SIGN",m[m.COMMA=188]="COMMA",m[m.DASH=189]="DASH",m[m.PERIOD=190]="PERIOD",m[m.FORWARD_SLASH=191]="FORWARD_SLASH",m[m.GRAVE_ACCENT=192]="GRAVE_ACCENT",m[m.OPEN_BRACKET=219]="OPEN_BRACKET",m[m.BACK_SLASH=220]="BACK_SLASH",m[m.CLOSE_BRACKET=221]="CLOSE_BRACKET",m[m.SINGLE_QUOTE=222]="SINGLE_QUOTE";class A{onRemove(){}onAddedToScene(t){}onRemovedFromScene(t){}beforeUpdate(t){}update(t){}afterUpdate(t){}beforeDraw(t,e){}draw(t,e){}afterDraw(t,e){}getScene(){return this.entity.getScene()}constructor(t){this.entity=t}}const p={};class f extends A{getSortOrder(){return this.getSortOrderFn(this.entity)}constructor(t,e){super(t),this.getSortOrderFn=e}}class y{getScene(){return i(this.scene,"scene is required"),this.scene}afterAddToScene(t){this.scene=t}beforeRemoveFromScene(t){this.scene=null}beforeUpdate(t){}afterUpdate(t){}beforeDraw(t,e){}afterDraw(t,e){}constructor(){this.scene=null,i(this.constructor!==y,"SceneSystem is an abstract class that must be extended"),i("$$AbstractSceneSystem$$"!==this.constructor.systemName,"classes extending SceneSystem must override SceneSystem.systemName")}}y.systemName="$$AbstractSceneSystem$$";class _ extends y{afterAddToScene(t){super.afterAddToScene(t),this.debugDraw=new d(t.ctx)}}_.systemName="DebugDragSystem";(class extends y{afterAddToScene(t){super.afterAddToScene(t),this.debugDraw=new d(t.ctx)}afterDraw(){}}).systemName="AABBDebugDrawSystem";class E extends A{setOrigin(t){this.value=new u(t,this.value.size)}beforeDraw(t,e){t.save(),t.translate(this.value.left,this.value.top)}afterDraw(t,e){t.restore()}constructor(t,e){super(t),this.value=e}}const T=new class{get width(){return this.canvas.width/this._scaleFactor}get height(){return this.canvas.height/this._scaleFactor}get scaleFactor(){return this._scaleFactor}get isPlaying(){return null!==this.frameHandle&&this._isPlaying}set isPlaying(t){i(null!==this.frameHandle,"cannot set isPlaying without calling start"),this._isPlaying=t}get children(){return this._children}appendTo(t){t.appendChild(this.canvas)}hasSystem(t){return this.systemsByClass.has(t)}getSystem(t){const e=this.systemsByClass.get(t);return i(e,`system, ${t.systemName} not found`),i(e instanceof t,"system is wrong instance type"),e}addSystem(t){i(!this.hasSystem(t.constructor),"only one system of each type allowed"),this.systemsByClass.set(t.constructor,t),t.afterAddToScene(this)}removeSystem(t){this.getSystem(t).beforeRemoveFromScene(this),this.systemsByClass.delete(t)}addChild(t){this._children.push(t),t.onAddedToScene(this)}addChildBefore(t,e){const s=this._children.indexOf(t);i(-1!==s,"target child must be present"),this.addChildAtIndex(s,e)}addChildAfter(t,e){const s=this._children.indexOf(t);i(-1!==s,"target child must be present"),this.addChildAtIndex(s+1,e)}addChildAtIndex(t,e){this._children.splice(t,0,e),e.onAddedToScene(this)}removeChild(t){const e=this._children.indexOf(t);return-1!==e&&(this.removeChildAtIndex(e),!0)}removeChildAtIndex(t){const e=this._children[t];return this._children.splice(t,1),e.onRemovedFromScene(),e}update(t){for(let e=0;e<1;e++){for(const e of this.systemsByClass.values())e.beforeUpdate(t);this._children.forEach((e=>e.update(t)));for(const e of this.systemsByClass.values())e.afterUpdate(t)}}draw(t){this.ctx.save(),this.ctx.scale(this._scaleFactor,this._scaleFactor),this.ctx.clearRect(0,0,this.width,this.height);for(const e of this.systemsByClass.values())e.beforeDraw(this.ctx,t);this._children.sort(((t,e)=>t.getSortOrder()-e.getSortOrder())).forEach((e=>e.draw(this.ctx,t)));for(const e of this.systemsByClass.values())e.afterDraw(this.ctx,t);this.ctx.restore()}start(){this._isPlaying=!0,this.frameHandle=window.requestAnimationFrame(this._tick)}stop(){null!==this.frameHandle&&(window.cancelAnimationFrame(this.frameHandle),this.frameHandle=null),this._isPlaying=!1,this.lastElapsedTime=null}_setupVisiblityChange(){let t=!1;document.addEventListener("visibilitychange",(()=>{document.hidden&&this.isPlaying&&(t=!0,this.stop()),t&&!document.hidden&&(t=!1,this.start())}))}constructor(t,e,s=1){this._children=[],this._isPlaying=!1,this.frameHandle=null,this.lastElapsedTime=null,this.systemsByClass=new Map,this._tick=t=>{t*=1;const e=this.lastElapsedTime;if(null!==e){const s=t-e;this.isPlaying&&(this.update(s),this.draw(t))}this.lastElapsedTime=t,this.frameHandle=window.requestAnimationFrame(this._tick)},this.canvas=document.createElement("canvas"),this.canvas.width=t*s,this.canvas.height=e*s,this.canvas.style.width=`${t}px`,this.canvas.style.height=`${e}px`;const n=this.canvas.getContext("2d");i(n,"ctx"),this.ctx=n,this._scaleFactor=1*s,this._setupVisiblityChange()}}(800,600,window.devicePixelRatio);T.addSystem(new _);const S=new class extends class{hasScene(){return null!==this.scene}getScene(){return i(this.scene,"scene must be present"),this.scene}draw(t,e){}update(t){}addTo(t){return t.addChild(this),this}onAddedToScene(t){this.scene=t}onRemovedFromScene(){this.scene=null}getSortOrder(){return 0}constructor(){var t;this.id=(t=this.constructor.name,p[t]||(p[t]=0),`${t}@${p[t]++}`),this.scene=null}}{addComponent(t,...e){i(!this.componentInstances.has(t),`component instance ${t.name} already exists`);const s=new t(this,...e);return this.componentInstances.set(t,s),s}hasComponent(t){return this.componentInstances.has(t)}getComponent(t){const e=this.componentInstances.get(t);return i(e,`no instance for ${t.name} exists`),i(e instanceof t,"wrong instance type"),e}removeComponent(t){const e=this.getComponent(t);return this.componentInstances.delete(t),e.onRemove(),e}draw(t,e){for(const s of this.componentInstances.values())s.beforeDraw(t,e);for(const s of this.componentInstances.values())s.draw(t,e);for(const s of this.componentInstances.values())s.afterDraw(t,e)}update(t){for(const e of this.componentInstances.values())e.beforeUpdate(t);for(const e of this.componentInstances.values())e.update(t);for(const e of this.componentInstances.values())e.afterUpdate(t)}onAddedToScene(t){super.onAddedToScene(t);for(const e of this.componentInstances.values())e.onAddedToScene(t)}onRemovedFromScene(){const t=this.getScene();super.onRemovedFromScene();for(const e of this.componentInstances.values())e.onRemovedFromScene(t)}getSortOrder(){return this.hasComponent(f)?this.getComponent(f).getSortOrder():super.getSortOrder()}constructor(...t){super(...t),this.componentInstances=new Map}};S.addComponent(E,new u(new h(200,200),new h(20,30))),S.addComponent(class extends A{getAABB(){return this.entity.getComponent(E).value}draw(t){this.getScene().getSystem(_).debugDraw.aabb(new u(h.ZERO,this.getAABB().size),this.opts)}constructor(t,e){super(t),this.opts=e}},{fill:"lime",stroke:"black",strokeWidth:1}),S.addComponent(class extends A{update(t){const e=this.entity.getComponent(E);let s=e.value.origin;this.controls.isDown("left")&&(s=s.sub(new h(this.moveSpeed*t,0))),this.controls.isDown("right")&&(s=s.add(new h(this.moveSpeed*t,0))),this.controls.isDown("jump")&&(s=s.sub(new h(0,this.moveSpeed*t))),this.controls.isDown("down")&&(s=s.add(new h(0,this.moveSpeed*t))),e.setOrigin(s)}constructor(t,e,s){super(t),this.moveSpeed=e,this.controls=s}},.4,new class{isDown(t){return this.getActionInfo(t).isDown}onDown(t,e){return this.getActionInfo(t).downEvent.listen(e)}onUp(t,e){return this.getActionInfo(t).upEvent.listen(e)}getActionInfoForKeyCodeIfExists(t){const e=this.keyCodeToAction.get(t);return e?this.getActionInfo(e):null}getActionInfo(t){const e=this.actionInfo.get(t);return i(e),e}constructor(t){const e=new Map,s=new Map;for(const[n,i]of a(t)){for(const t of i)e.set(t,n);s.set(n,{downEvent:new o.default,upEvent:new o.default,isDown:!1})}this.keyCodeToAction=e,this.actionInfo=s,document.addEventListener("keydown",(t=>{const e=this.getActionInfoForKeyCodeIfExists(t.keyCode);e&&(e.isDown=!0,e.downEvent.emit())})),document.addEventListener("keyup",(t=>{const e=this.getActionInfoForKeyCodeIfExists(t.keyCode);e&&(e.isDown=!1,e.upEvent.emit())}))}}({left:[g.A,g.LEFT_ARROW],right:[g.D,g.RIGHT_ARROW],jump:[g.W,g.UP_ARROW,g.SPACE],down:[g.S]})),T.addChild(S),T.appendTo(document.getElementById("root")),T.start(),console.log(T);
//# sourceMappingURL=index.3a211610.js.map
