!function(){var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},t={},n={},s=e.parcelRequire0561;null==s&&((s=function(e){if(e in t)return t[e].exports;if(e in n){var s=n[e];delete n[e];var o={id:e,exports:{}};return t[e]=o,s.call(o.exports,o,o.exports),o.exports}var i=new Error("Cannot find module '"+e+"'");throw i.code="MODULE_NOT_FOUND",i}).register=function(e,t){n[e]=t},e.parcelRequire0561=s);var o,i,r=s("eUMMJ"),a=(r=s("eUMMJ"),s("diH60")),u=s("6gLF9"),l=s("8pNpe"),A=function(){"use strict";function e(t){r.classCallCheck(this,e);var n=new Map,s=new Map,o=!0,i=!1,a=void 0;try{for(var A,c=l.entries(t)[Symbol.iterator]();!(o=(A=c.next()).done);o=!0){var E=r.slicedToArray(A.value,2),f=E[0],_=E[1],D=!0,d=!1,C=void 0;try{for(var T,h=_[Symbol.iterator]();!(D=(T=h.next()).done);D=!0){var R=T.value;n.set(R,f)}}catch(e){d=!0,C=e}finally{try{D||null==h.return||h.return()}finally{if(d)throw C}}s.set(f,{downEvent:new u.default,upEvent:new u.default,isDown:!1})}}catch(e){i=!0,a=e}finally{try{o||null==c.return||c.return()}finally{if(i)throw a}}this.keyCodeToAction=n,this.actionInfo=s,document.addEventListener("keydown",function(e){var t=this.getActionInfoForKeyCodeIfExists(e.keyCode);t&&(t.isDown=!0,t.downEvent.emit())}.bind(this)),document.addEventListener("keyup",function(e){var t=this.getActionInfoForKeyCodeIfExists(e.keyCode);t&&(t.isDown=!1,t.upEvent.emit())}.bind(this))}return r.createClass(e,[{key:"isDown",value:function(e){return this.getActionInfo(e).isDown}},{key:"onDown",value:function(e,t){return this.getActionInfo(e).downEvent.listen(t)}},{key:"onUp",value:function(e,t){return this.getActionInfo(e).upEvent.listen(t)}},{key:"getActionInfoForKeyCodeIfExists",value:function(e){var t=this.keyCodeToAction.get(e);return t?this.getActionInfo(t):null}},{key:"getActionInfo",value:function(e){var t=this.actionInfo.get(e);return a.assert(t),t}}]),e}(),c=s("bK7pi"),E=s("7B1qO"),f=s("54lVR");(i=o||(o={}))[i.THAT_KEY_HAS_NO_KEYCODE=0]="THAT_KEY_HAS_NO_KEYCODE",i[i.BREAK=3]="BREAK",i[i.BACKSPACE_DELETE=8]="BACKSPACE_DELETE",i[i.TAB=9]="TAB",i[i.CLEAR=12]="CLEAR",i[i.ENTER=13]="ENTER",i[i.SHIFT=16]="SHIFT",i[i.CTRL=17]="CTRL",i[i.ALT=18]="ALT",i[i.PAUSE_BREAK=19]="PAUSE_BREAK",i[i.CAPS_LOCK=20]="CAPS_LOCK",i[i.ESCAPE=27]="ESCAPE",i[i.SPACE=32]="SPACE",i[i.PAGE_UP=33]="PAGE_UP",i[i.PAGE_DOWN=34]="PAGE_DOWN",i[i.END=35]="END",i[i.HOME=36]="HOME",i[i.LEFT_ARROW=37]="LEFT_ARROW",i[i.UP_ARROW=38]="UP_ARROW",i[i.RIGHT_ARROW=39]="RIGHT_ARROW",i[i.DOWN_ARROW=40]="DOWN_ARROW",i[i.SELECT=41]="SELECT",i[i.PRINT=42]="PRINT",i[i.EXECUTE=43]="EXECUTE",i[i.PRINT_SCREEN=44]="PRINT_SCREEN",i[i.INSERT=45]="INSERT",i[i.DELETE=46]="DELETE",i[i.HELP=47]="HELP",i[i.DIGIT_0=48]="DIGIT_0",i[i.DIGIT_1=49]="DIGIT_1",i[i.DIGIT_2=50]="DIGIT_2",i[i.DIGIT_3=51]="DIGIT_3",i[i.DIGIT_4=52]="DIGIT_4",i[i.DIGIT_5=53]="DIGIT_5",i[i.DIGIT_6=54]="DIGIT_6",i[i.DIGIT_7=55]="DIGIT_7",i[i.DIGIT_8=56]="DIGIT_8",i[i.DIGIT_9=57]="DIGIT_9",i[i.COLON=58]="COLON",i[i.LESS_THAN=60]="LESS_THAN",i[i.A=65]="A",i[i.B=66]="B",i[i.C=67]="C",i[i.D=68]="D",i[i.E=69]="E",i[i.F=70]="F",i[i.G=71]="G",i[i.H=72]="H",i[i.I=73]="I",i[i.J=74]="J",i[i.K=75]="K",i[i.L=76]="L",i[i.M=77]="M",i[i.N=78]="N",i[i.O=79]="O",i[i.P=80]="P",i[i.Q=81]="Q",i[i.R=82]="R",i[i.S=83]="S",i[i.T=84]="T",i[i.U=85]="U",i[i.V=86]="V",i[i.W=87]="W",i[i.X=88]="X",i[i.Y=89]="Y",i[i.Z=90]="Z",i[i.NUMPAD_0=96]="NUMPAD_0",i[i.NUMPAD_1=97]="NUMPAD_1",i[i.NUMPAD_2=98]="NUMPAD_2",i[i.NUMPAD_3=99]="NUMPAD_3",i[i.NUMPAD_4=100]="NUMPAD_4",i[i.NUMPAD_5=101]="NUMPAD_5",i[i.NUMPAD_6=102]="NUMPAD_6",i[i.NUMPAD_7=103]="NUMPAD_7",i[i.NUMPAD_8=104]="NUMPAD_8",i[i.NUMPAD_9=105]="NUMPAD_9",i[i.NUMPAD_MULTIPLY=106]="NUMPAD_MULTIPLY",i[i.NUMPAD_ADD=107]="NUMPAD_ADD",i[i.NUMPAD_PERIOD=108]="NUMPAD_PERIOD",i[i.NUMPAD_SUBTRACT=109]="NUMPAD_SUBTRACT",i[i.F1=112]="F1",i[i.F2=113]="F2",i[i.F3=114]="F3",i[i.F4=115]="F4",i[i.F5=116]="F5",i[i.F6=117]="F6",i[i.F7=118]="F7",i[i.F8=119]="F8",i[i.F9=120]="F9",i[i.F10=121]="F10",i[i.F11=122]="F11",i[i.F12=123]="F12",i[i.F13=124]="F13",i[i.F14=125]="F14",i[i.F15=126]="F15",i[i.F16=127]="F16",i[i.F17=128]="F17",i[i.F18=129]="F18",i[i.F19=130]="F19",i[i.F20=131]="F20",i[i.F21=132]="F21",i[i.F22=133]="F22",i[i.F23=134]="F23",i[i.F24=135]="F24",i[i.F25=136]="F25",i[i.F26=137]="F26",i[i.F27=138]="F27",i[i.F28=139]="F28",i[i.F29=140]="F29",i[i.F30=141]="F30",i[i.F31=142]="F31",i[i.F32=143]="F32",i[i.NUM_LOCK=144]="NUM_LOCK",i[i.SCROLL_LOCK=145]="SCROLL_LOCK",i[i.AIRPLANE_MODE=151]="AIRPLANE_MODE",i[i.PAGE_BACKWARD=166]="PAGE_BACKWARD",i[i.PAGE_FORWARD=167]="PAGE_FORWARD",i[i.HOME_KEY=172]="HOME_KEY",i[i.SEMI_COLON=186]="SEMI_COLON",i[i.EQUAL_SIGN=187]="EQUAL_SIGN",i[i.COMMA=188]="COMMA",i[i.DASH=189]="DASH",i[i.PERIOD=190]="PERIOD",i[i.FORWARD_SLASH=191]="FORWARD_SLASH",i[i.GRAVE_ACCENT=192]="GRAVE_ACCENT",i[i.OPEN_BRACKET=219]="OPEN_BRACKET",i[i.BACK_SLASH=220]="BACK_SLASH",i[i.CLOSE_BRACKET=221]="CLOSE_BRACKET",i[i.SINGLE_QUOTE=222]="SINGLE_QUOTE";var _=s("eCbAo"),D=s("ej7qu"),d=s("i9QUB"),C=(r=s("eUMMJ"),a=s("diH60"),"$$AbstractSceneSystem$$"),T=function(){"use strict";function e(){r.classCallCheck(this,e),this.scene=null,a.assert(this.constructor!==e,"SceneSystem is an abstract class that must be extended"),a.assert(this.constructor.systemName!==C,"classes extending SceneSystem must override SceneSystem.systemName")}return r.createClass(e,[{key:"getScene",value:function(){return a.assert(this.scene,"scene is required"),this.scene}},{key:"afterAddToScene",value:function(e){this.scene=e}},{key:"beforeRemoveFromScene",value:function(e){this.scene=null}},{key:"beforeUpdate",value:function(e){}},{key:"afterUpdate",value:function(e){}},{key:"beforeDraw",value:function(e,t){}},{key:"afterDraw",value:function(e,t){}}]),e}();T.systemName=C;var h=function(e){"use strict";function t(){return r.classCallCheck(this,t),r.possibleConstructorReturn(this,r.getPrototypeOf(t).apply(this,arguments))}return r.inherits(t,e),r.createClass(t,[{key:"afterAddToScene",value:function(e){r.get(r.getPrototypeOf(t.prototype),"afterAddToScene",this).call(this,e),this.debugDraw=new c.DebugDraw(e.ctx)}}]),t}(T);h.systemName="DebugDragSystem";var R=function(e){"use strict";function t(){return r.classCallCheck(this,t),r.possibleConstructorReturn(this,r.getPrototypeOf(t).apply(this,arguments))}return r.inherits(t,e),r.createClass(t,[{key:"afterAddToScene",value:function(e){r.get(r.getPrototypeOf(t.prototype),"afterAddToScene",this).call(this,e),this.debugDraw=new c.DebugDraw(e.ctx)}},{key:"afterDraw",value:function(){}}]),t}(T);R.systemName="AABBDebugDrawSystem";var F=function(e){"use strict";function t(e,n){var s;return r.classCallCheck(this,t),(s=r.possibleConstructorReturn(this,r.getPrototypeOf(t).call(this,e))).value=n,s}return r.inherits(t,e),r.createClass(t,[{key:"setOrigin",value:function(e){this.value=new E.default(e,this.value.size)}},{key:"beforeDraw",value:function(e,t){e.save(),e.translate(this.value.left,this.value.top)}},{key:"afterDraw",value:function(e,t){e.restore()}}]),t}(_.default),I=function(e){"use strict";function t(e,n){var s;return r.classCallCheck(this,t),(s=r.possibleConstructorReturn(this,r.getPrototypeOf(t).call(this,e))).opts=n,s}return r.inherits(t,e),r.createClass(t,[{key:"getAABB",value:function(){return this.entity.getComponent(F).value}},{key:"draw",value:function(e){this.getScene().getSystem(h).debugDraw.aabb(new E.default(f.default.ZERO,this.getAABB().size),this.opts)}}]),t}(_.default),P=function(e){"use strict";function t(e,n,s){var o;return r.classCallCheck(this,t),(o=r.possibleConstructorReturn(this,r.getPrototypeOf(t).call(this,e))).moveSpeed=n,o.controls=s,o}return r.inherits(t,e),r.createClass(t,[{key:"update",value:function(e){var t=this.entity.getComponent(F),n=t.value.origin;this.controls.isDown("left")&&(n=n.sub(new f.default(this.moveSpeed*e,0))),this.controls.isDown("right")&&(n=n.add(new f.default(this.moveSpeed*e,0))),this.controls.isDown("jump")&&(n=n.sub(new f.default(0,this.moveSpeed*e))),this.controls.isDown("down")&&(n=n.add(new f.default(0,this.moveSpeed*e))),t.setOrigin(n)}}]),t}(_.default),S=new d.default(800,600,window.devicePixelRatio);S.addSystem(new h);var N=new D.default;N.addComponent(F,new E.default(new f.default(200,200),new f.default(20,30))),N.addComponent(I,{fill:"lime",stroke:"black",strokeWidth:1}),N.addComponent(P,.4,new A({left:[o.A,o.LEFT_ARROW],right:[o.D,o.RIGHT_ARROW],jump:[o.W,o.UP_ARROW,o.SPACE],down:[o.S]})),S.addChild(N),S.appendTo(document.getElementById("root")),S.start(),console.log(S)}();
//# sourceMappingURL=index.c4d75796.js.map