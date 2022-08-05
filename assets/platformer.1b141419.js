import{e as O,a as L,b as m}from"./assert.3c3fa83e.js";/* empty css                 */import{E as P}from"./EventEmitter.1121f552.js";import{D as S}from"./DebugDraw.b13108a3.js";import{A as a}from"./AABB.f6d015c5.js";import{V as _}from"./Vector2.d2fd2a0e.js";import{a as U,E as M,C as T}from"./Entity.5092177d.js";import{S as N}from"./SceneSystem.bd94f12e.js";class f{constructor(n){const A=new Map,s=new Map;for(const[D,E]of O(n)){for(const c of E)A.set(c,D);s.set(D,{downEvent:new P,upEvent:new P,isDown:!1})}this.keyCodeToAction=A,this.actionInfo=s,document.addEventListener("keydown",D=>{const E=this.getActionInfoForKeyCodeIfExists(D.keyCode);!E||(E.isDown=!0,E.downEvent.emit())}),document.addEventListener("keyup",D=>{const E=this.getActionInfoForKeyCodeIfExists(D.keyCode);!E||(E.isDown=!1,E.upEvent.emit())})}isDown(n){return this.getActionInfo(n).isDown}onDown(n,A){return this.getActionInfo(n).downEvent.listen(A)}onUp(n,A){return this.getActionInfo(n).upEvent.listen(A)}getActionInfoForKeyCodeIfExists(n){const A=this.keyCodeToAction.get(n);return A?this.getActionInfo(A):null}getActionInfo(n){const A=this.actionInfo.get(n);return L(A),A}}var i=(t=>(t[t.THAT_KEY_HAS_NO_KEYCODE=0]="THAT_KEY_HAS_NO_KEYCODE",t[t.BREAK=3]="BREAK",t[t.BACKSPACE_DELETE=8]="BACKSPACE_DELETE",t[t.TAB=9]="TAB",t[t.CLEAR=12]="CLEAR",t[t.ENTER=13]="ENTER",t[t.SHIFT=16]="SHIFT",t[t.CTRL=17]="CTRL",t[t.ALT=18]="ALT",t[t.PAUSE_BREAK=19]="PAUSE_BREAK",t[t.CAPS_LOCK=20]="CAPS_LOCK",t[t.ESCAPE=27]="ESCAPE",t[t.SPACE=32]="SPACE",t[t.PAGE_UP=33]="PAGE_UP",t[t.PAGE_DOWN=34]="PAGE_DOWN",t[t.END=35]="END",t[t.HOME=36]="HOME",t[t.LEFT_ARROW=37]="LEFT_ARROW",t[t.UP_ARROW=38]="UP_ARROW",t[t.RIGHT_ARROW=39]="RIGHT_ARROW",t[t.DOWN_ARROW=40]="DOWN_ARROW",t[t.SELECT=41]="SELECT",t[t.PRINT=42]="PRINT",t[t.EXECUTE=43]="EXECUTE",t[t.PRINT_SCREEN=44]="PRINT_SCREEN",t[t.INSERT=45]="INSERT",t[t.DELETE=46]="DELETE",t[t.HELP=47]="HELP",t[t.DIGIT_0=48]="DIGIT_0",t[t.DIGIT_1=49]="DIGIT_1",t[t.DIGIT_2=50]="DIGIT_2",t[t.DIGIT_3=51]="DIGIT_3",t[t.DIGIT_4=52]="DIGIT_4",t[t.DIGIT_5=53]="DIGIT_5",t[t.DIGIT_6=54]="DIGIT_6",t[t.DIGIT_7=55]="DIGIT_7",t[t.DIGIT_8=56]="DIGIT_8",t[t.DIGIT_9=57]="DIGIT_9",t[t.COLON=58]="COLON",t[t.LESS_THAN=60]="LESS_THAN",t[t.A=65]="A",t[t.B=66]="B",t[t.C=67]="C",t[t.D=68]="D",t[t.E=69]="E",t[t.F=70]="F",t[t.G=71]="G",t[t.H=72]="H",t[t.I=73]="I",t[t.J=74]="J",t[t.K=75]="K",t[t.L=76]="L",t[t.M=77]="M",t[t.N=78]="N",t[t.O=79]="O",t[t.P=80]="P",t[t.Q=81]="Q",t[t.R=82]="R",t[t.S=83]="S",t[t.T=84]="T",t[t.U=85]="U",t[t.V=86]="V",t[t.W=87]="W",t[t.X=88]="X",t[t.Y=89]="Y",t[t.Z=90]="Z",t[t.NUMPAD_0=96]="NUMPAD_0",t[t.NUMPAD_1=97]="NUMPAD_1",t[t.NUMPAD_2=98]="NUMPAD_2",t[t.NUMPAD_3=99]="NUMPAD_3",t[t.NUMPAD_4=100]="NUMPAD_4",t[t.NUMPAD_5=101]="NUMPAD_5",t[t.NUMPAD_6=102]="NUMPAD_6",t[t.NUMPAD_7=103]="NUMPAD_7",t[t.NUMPAD_8=104]="NUMPAD_8",t[t.NUMPAD_9=105]="NUMPAD_9",t[t.NUMPAD_MULTIPLY=106]="NUMPAD_MULTIPLY",t[t.NUMPAD_ADD=107]="NUMPAD_ADD",t[t.NUMPAD_PERIOD=108]="NUMPAD_PERIOD",t[t.NUMPAD_SUBTRACT=109]="NUMPAD_SUBTRACT",t[t.F1=112]="F1",t[t.F2=113]="F2",t[t.F3=114]="F3",t[t.F4=115]="F4",t[t.F5=116]="F5",t[t.F6=117]="F6",t[t.F7=118]="F7",t[t.F8=119]="F8",t[t.F9=120]="F9",t[t.F10=121]="F10",t[t.F11=122]="F11",t[t.F12=123]="F12",t[t.F13=124]="F13",t[t.F14=125]="F14",t[t.F15=126]="F15",t[t.F16=127]="F16",t[t.F17=128]="F17",t[t.F18=129]="F18",t[t.F19=130]="F19",t[t.F20=131]="F20",t[t.F21=132]="F21",t[t.F22=133]="F22",t[t.F23=134]="F23",t[t.F24=135]="F24",t[t.F25=136]="F25",t[t.F26=137]="F26",t[t.F27=138]="F27",t[t.F28=139]="F28",t[t.F29=140]="F29",t[t.F30=141]="F30",t[t.F31=142]="F31",t[t.F32=143]="F32",t[t.NUM_LOCK=144]="NUM_LOCK",t[t.SCROLL_LOCK=145]="SCROLL_LOCK",t[t.AIRPLANE_MODE=151]="AIRPLANE_MODE",t[t.PAGE_BACKWARD=166]="PAGE_BACKWARD",t[t.PAGE_FORWARD=167]="PAGE_FORWARD",t[t.HOME_KEY=172]="HOME_KEY",t[t.SEMI_COLON=186]="SEMI_COLON",t[t.EQUAL_SIGN=187]="EQUAL_SIGN",t[t.COMMA=188]="COMMA",t[t.DASH=189]="DASH",t[t.PERIOD=190]="PERIOD",t[t.FORWARD_SLASH=191]="FORWARD_SLASH",t[t.GRAVE_ACCENT=192]="GRAVE_ACCENT",t[t.OPEN_BRACKET=219]="OPEN_BRACKET",t[t.BACK_SLASH=220]="BACK_SLASH",t[t.CLOSE_BRACKET=221]="CLOSE_BRACKET",t[t.SINGLE_QUOTE=222]="SINGLE_QUOTE",t))(i||{});class F extends N{afterAddToScene(n){super.afterAddToScene(n),this.debugDraw=new S(n.ctx)}}F.systemName="DebugDragSystem";class u extends N{afterAddToScene(n){super.afterAddToScene(n),this.debugDraw=new S(n.ctx)}afterDraw(){}}u.systemName="AABBDebugDrawSystem";class R extends T{constructor(n,A){super(n),this.value=A}setOrigin(n){this.value=new a(n,this.value.size)}beforeDraw(n,A){n.save(),n.translate(this.value.left,this.value.top)}afterDraw(n,A){n.restore()}}class w extends T{constructor(n,A){super(n),this.opts=A}getAABB(){return this.entity.getComponent(R).value}draw(n){this.getScene().getSystem(F).debugDraw.aabb(new a(_.ZERO,this.getAABB().size),this.opts)}}class p extends T{constructor(n,A,s){super(n),this.moveSpeed=A,this.controls=s}update(n){const A=this.entity.getComponent(R);let s=A.value.origin;this.controls.isDown("left")&&(s=s.sub(new _(this.moveSpeed*n,0))),this.controls.isDown("right")&&(s=s.add(new _(this.moveSpeed*n,0))),this.controls.isDown("jump")&&(s=s.sub(new _(0,this.moveSpeed*n))),this.controls.isDown("down")&&(s=s.add(new _(0,this.moveSpeed*n))),A.setOrigin(s)}}const r=new U(800,600,window.devicePixelRatio);r.addSystem(new F);const I=new M;I.addComponent(R,new a(new _(200,200),new _(20,30)));I.addComponent(w,{fill:"lime",stroke:"black",strokeWidth:1});I.addComponent(p,.4,new f({left:[i.A,i.LEFT_ARROW],right:[i.D,i.RIGHT_ARROW],jump:[i.W,i.UP_ARROW,i.SPACE],down:[i.S]}));r.addChild(I);r.appendTo(m(document.getElementById("root")));r.start();console.log(r);
