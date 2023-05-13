import{e as z,c as A,a as $,b as ee,t as ze,r as I,s as B,f as Ne,i as v}from"./chunk_assert.30730bef.js";/* empty css                       */import{j as i,F as be,a as _}from"./chunk_ResizeObserver.de1ce7b6.js";import{u as T,c as ke,a as Se,s as Pe}from"./chunk_client.3824c486.js";import{r as p}from"./chunk_index.0b9c6f54.js";import{V as R}from"./chunk_Vector2.5365c98f.js";import{G as Te,a as Me,b as Oe,c as Fe,d as Ae,e as Be}from"./chunk_Gl.470fa736.js";import{D as Le}from"./chunk_DebugDraw.a8032e81.js";import{m as De}from"./chunk_useKeyPress.13c220d3.js";import{e as M,d as L}from"./chunk_debugPropsToString.487f61e8.js";import{c as Ve}from"./chunk_index.2e4736b8.js";import{t as w}from"./chunk_theme.cdbd8d37.js";import{C as te}from"./chunk_index.38c2fd67.js";import{d as he,e as me,R as pe,C as ge,r as Ue,n as Y,h as Ge}from"./chunk_color.22c9a6e8.js";import"./chunk__commonjsHelpers.725317a4.js";var je=`#version 300 es
#define MAX_BLOBS 32
#define ENTRIES_PER_BLOB 2
#define MODE_BLUR 0
#define MODE_INSIDE 1
#define MODE_OUTSIDE 2
#define MODE_FILL 3
#define INTERPOLATE_NAIVE 0
#define INTERPOLATE_VECTOR 1
#define INTERPOLATE_MIN 2
#define PI 3.1415926538
precision highp float;uniform sampler2D u_blobs;uniform float u_smoothness;uniform float u_blurSize;uniform float u_blurSpread;uniform int u_mode;uniform bool u_darkMode;uniform int u_interpolateMode;uniform float u_hueBias;in vec2 screenPosition;out vec4 outColor;float map(float value,float min1,float max1,float min2,float max2){return min2+(value-min1)*(max2-min2)/(max1-min1);}float sdfCircle(vec2 center,float radius){return length(center-screenPosition)-radius;}float opSmoothUnion(float d1,float d2,float k){float h=clamp(0.5+0.5*(d2-d1)/k,0.0,1.0);return mix(d2,d1,h)-k*h*(1.0-h);}float xyzF(float t){return mix(pow(t,1./3.),7.787037*t+0.139731,step(t,0.00885645));}float xyzR(float t){return mix(t*t*t,0.1284185*(t-0.139731),step(t,0.20689655));}vec3 rgb2lch(in vec3 c){vec3 wref=vec3(1.0,1.0,1.0);c*=mat3(0.4124,0.3576,0.1805,0.2126,0.7152,0.0722,0.0193,0.1192,0.9505);c.x=xyzF(c.x/wref.x);c.y=xyzF(c.y/wref.y);c.z=xyzF(c.z/wref.z);vec3 lab=vec3(max(0.,116.0*c.y-16.0),500.0*(c.x-c.y),200.0*(c.y-c.z));return vec3(lab.x,length(vec2(lab.y,lab.z)),atan(lab.z,lab.y));}vec3 lch2rgb(in vec3 c){vec3 wref=vec3(1.0,1.0,1.0);c=vec3(c.x,cos(c.z)*c.y,sin(c.z)*c.y);float lg=1./116.*(c.x+16.);vec3 xyz=vec3(wref.x*xyzR(lg+0.002*c.y),wref.y*xyzR(lg),wref.z*xyzR(lg-0.005*c.z));vec3 rgb=xyz*mat3(3.2406,-1.5372,-0.4986,-0.9689,1.8758,0.0415,0.0557,-0.2040,1.0570);return rgb;}float easeInOutCubic(in float t){return t<0.5 ? 4.*t*t*t:(t-1.)*(2.*t-2.)*(2.*t-2.)+1.;}float expDropOff(in float t,in float k){return 1./((t/k)+1.);}float rotate(in float angle,in float rotation){float rotated=angle+rotation;return atan(sin(rotated),cos(rotated));}void main(){int blobCount=min(textureSize(u_blobs,0).x/ENTRIES_PER_BLOB,MAX_BLOBS);float totalStrength=0.;vec3 totalColor=vec3(0);float dist=99999.0;vec2 hueVec=vec2(0);float minHue=0.;for(int i=0;i<blobCount;i++){vec4 d1=texelFetch(u_blobs,ivec2(i*ENTRIES_PER_BLOB,0),0);vec2 center=d1.xy;float radius=d1.z;vec3 blobColor=rgb2lch(texelFetch(u_blobs,ivec2((i*ENTRIES_PER_BLOB)+1,0),0).rgb);blobColor.z=rotate(blobColor.z,radians(u_hueBias));float sd=sdfCircle(center,radius);float strength=mix(smoothstep(1.0,0.0,sd/(u_blurSize*2.)),expDropOff(sd,u_blurSize),smoothstep(0.,1.,sd/u_blurSize));strength=pow(strength,5.0);totalStrength+=strength;totalColor+=blobColor*strength;hueVec+=vec2(cos(blobColor.z),sin(blobColor.z))*strength;if(u_interpolateMode==INTERPOLATE_MIN){float a=minHue/totalStrength;float d=blobColor.z-a;d=d>radians(180.)||d<radians(-180.)? d-radians(360.)*round(d/radians(360.)): d;minHue+=(strength*d);}dist=opSmoothUnion(sd,dist,u_smoothness);}float cutoff=smoothstep(0.0,1.0,-dist);vec3 bgColor=u_darkMode ? vec3(0): vec3(1);vec3 resultColor=vec3(1,0,1);if(u_interpolateMode==INTERPOLATE_NAIVE){resultColor=totalColor/totalStrength;}else if(u_interpolateMode==INTERPOLATE_VECTOR){resultColor=vec3((totalColor/totalStrength).xy,atan(hueVec.y,hueVec.x));}else if(u_interpolateMode==INTERPOLATE_MIN){resultColor=vec3((totalColor/totalStrength).xy,minHue/totalStrength);}resultColor.z=rotate(resultColor.z,radians(-u_hueBias));resultColor=lch2rgb(resultColor);if(u_mode==MODE_BLUR){outColor=vec4(mix(bgColor,resultColor,clamp(pow(totalStrength,1.-u_blurSpread),0.,1.)),1);}else if(u_mode==MODE_INSIDE){outColor=vec4(mix(bgColor,resultColor,cutoff),1);}else if(u_mode==MODE_OUTSIDE){outColor=vec4(mix(resultColor,bgColor,cutoff),1);}else if(u_mode==MODE_FILL){outColor=vec4(resultColor,1);}}`,He=`#version 300 es
in vec2 a_position;uniform vec2 u_resolution;out vec2 screenPosition;void main(){screenPosition=a_position;vec2 zeroToOne=a_position/u_resolution;vec2 zeroToTwo=zeroToOne*2.0;vec2 clipSpace=zeroToTwo-1.0;gl_Position=vec4(clipSpace*vec2(1,-1),0,1);}`;function Ke(){const[e,r]=p.useState([]),t=p.useRef([]),n=T((u,s,b)=>{var h;return t.current.push({type:"range",label:u,value:s,oldValue:s,...b}),((h=e.find(m=>m.type==="range"&&m.label===u&&m.oldValue===s))==null?void 0:h.value)??s}),o=T(function(s,b,h){var m;return t.current.push({type:"colorPicker",label:s,value:b,options:h,oldValue:b}),((m=e.find(g=>g.type==="colorPicker"&&g.label===s&&M(g.oldValue,b)))==null?void 0:m.value)??b}),c=T(function(s,b,h){var m;return t.current.push({type:"segmentedControl",label:s,value:b,options:h,oldValue:b}),((m=e.find(g=>g.type==="segmentedControl"&&g.label===s&&M(g.oldValue,b)))==null?void 0:m.value)??b}),d=T((u,s)=>{var b;return t.current.push({type:"checkbox",label:u,value:s,oldValue:s}),((b=e.find(h=>h.type==="checkbox"&&h.label===u&&h.oldValue===s))==null?void 0:b.value)??s}),f=T(()=>{M(e,t.current)||r(t.current),t.current=[]});return{render:()=>i(We,{state:e,onChange:r}),ui:p.useMemo(()=>({checkbox:d,range:n,flush:f,colorPicker:o,segmentedControl:c}),[d,o,f,n,c])}}function We({state:e,onChange:r}){return i(be,{children:e.map((t,n)=>{switch(t.type){case"checkbox":return i($e,{label:t.label,value:t.value,onChange:o=>r(A(e,n,{...t,value:o}))},n);case"range":return i(Xe,{label:t.label,value:t.value,onChange:o=>r(A(e,n,{...t,value:o})),min:t.min,max:t.max,step:t.step},n);case"colorPicker":return i(Ye,{label:t.label,value:t.value,options:t.options,onChange:o=>r(A(e,n,{...t,value:o}))},n);case"segmentedControl":return i(Ze,{label:t.label,value:t.value,options:t.options,onChange:o=>r(A(e,n,{...t,value:o}))},n);default:z(t)}})})}function Xe({label:e,value:r,onChange:t,min:n,max:o,step:c}){const d=p.useId();return _("div",{className:"flex flex-col gap-2 p-3",children:[i("label",{htmlFor:d,children:e}),_("div",{className:"flex items-center justify-between gap-3",children:[i("input",{id:d,className:"w-2/3 flex-auto",type:"range",value:r,min:n,max:o,step:c,onChange:f=>t(f.currentTarget.valueAsNumber)}),i("span",{className:"w-1/3 flex-none text-right",children:r.toPrecision(3)})]})]})}function $e({label:e,value:r,onChange:t}){const n=p.useId();return _("div",{className:"flex gap-3 p-3",children:[i("input",{id:n,type:"checkbox",onChange:o=>t(o.currentTarget.checked),checked:r}),i("label",{htmlFor:n,children:e})]})}function Ye({label:e,value:r,onChange:t,options:n}){return _("div",{className:"flex-col gap-3 p-3",children:[e,i("div",{className:"flex gap-1",children:n.map((o,c)=>i("div",{style:{background:o.color},className:"flex h-6 flex-1 cursor-pointer items-center justify-center",onClick:()=>t(o.value),children:M(o.value,r)&&i("div",{className:"h-3 w-3 rounded-full border-2 border-black bg-white"})},c))})]})}function Ze({label:e,value:r,onChange:t,options:n}){return _("div",{className:"flex-col gap-3 p-3",children:[e,i("div",{className:"flex gap-2",children:n.map((o,c)=>i("button",{className:Ve("flex h-6 flex-auto items-center justify-center rounded text-sm",M(o.value,r)?"bg-gray-600":"hover:bg-gray-800"),onClick:()=>t(o.value),children:o.label},c))})]})}const qe=Math.PI/180,Je=180/Math.PI,D=18,ve=.96422,xe=1,ye=.82521,Ce=4/29,N=6/29,we=3*N*N,Qe=N*N*N;function _e(e){if(e instanceof y)return new y(e.l,e.a,e.b,e.opacity);if(e instanceof E)return Ee(e);e instanceof pe||(e=Ue(e));var r=Q(e.r),t=Q(e.g),n=Q(e.b),o=Z((.2225045*r+.7168786*t+.0606169*n)/xe),c,d;return r===t&&t===n?c=d=o:(c=Z((.4360747*r+.3850649*t+.1430804*n)/ve),d=Z((.0139322*r+.0971045*t+.7141733*n)/ye)),new y(116*o-16,500*(c-o),200*(o-d),e.opacity)}function et(e,r,t,n){return arguments.length===1?_e(e):new y(e,r,t,n??1)}function y(e,r,t,n){this.l=+e,this.a=+r,this.b=+t,this.opacity=+n}he(y,et,me(ge,{brighter(e){return new y(this.l+D*(e??1),this.a,this.b,this.opacity)},darker(e){return new y(this.l-D*(e??1),this.a,this.b,this.opacity)},rgb(){var e=(this.l+16)/116,r=isNaN(this.a)?e:e+this.a/500,t=isNaN(this.b)?e:e-this.b/200;return r=ve*q(r),e=xe*q(e),t=ye*q(t),new pe(J(3.1338561*r-1.6168667*e-.4906146*t),J(-.9787684*r+1.9161415*e+.033454*t),J(.0719453*r-.2289914*e+1.4052427*t),this.opacity)}}));function Z(e){return e>Qe?Math.pow(e,1/3):e/we+Ce}function q(e){return e>N?e*e*e:we*(e-Ce)}function J(e){return 255*(e<=.0031308?12.92*e:1.055*Math.pow(e,1/2.4)-.055)}function Q(e){return(e/=255)<=.04045?e/12.92:Math.pow((e+.055)/1.055,2.4)}function tt(e){if(e instanceof E)return new E(e.h,e.c,e.l,e.opacity);if(e instanceof y||(e=_e(e)),e.a===0&&e.b===0)return new E(NaN,0<e.l&&e.l<100?0:NaN,e.l,e.opacity);var r=Math.atan2(e.b,e.a)*Je;return new E(r<0?r+360:r,Math.sqrt(e.a*e.a+e.b*e.b),e.l,e.opacity)}function re(e,r,t,n){return arguments.length===1?tt(e):new E(e,r,t,n??1)}function E(e,r,t,n){this.h=+e,this.c=+r,this.l=+t,this.opacity=+n}function Ee(e){if(isNaN(e.h))return new y(e.l,0,0,e.opacity);var r=e.h*qe;return new y(e.l,Math.cos(r)*e.c,Math.sin(r)*e.c,e.opacity)}he(E,re,me(ge,{brighter(e){return new E(this.h,this.c,this.l+D*(e??1),this.opacity)},darker(e){return new E(this.h,this.c,this.l-D*(e??1),this.opacity)},rgb(){return Ee(this).rgb()}}));function rt(e){return function(r,t){var n=e((r=re(r)).h,(t=re(t)).h),o=Y(r.c,t.c),c=Y(r.l,t.l),d=Y(r.opacity,t.opacity);return function(f){return r.h=n(f),r.c=o(f),r.l=c(f),r.opacity=d(f),r+""}}}const ot=rt(Ge);function nt(e,r){return e<5?te(r(5)):e<10?x(r(5),r(10),v(5,10,e)):e<20?x(r(10),r(20),v(10,20,e)):e<30?x(r(20),r(30),v(20,30,e)):e<40?x(r(30),r(40),v(30,40,e)):e<50?x(r(40),r(50),v(40,50,e)):e<60?x(r(50),r(60),v(50,60,e)):e<70?x(r(60),r(70),v(60,70,e)):e<80?x(r(70),r(80),v(70,80,e)):e<90?x(r(80),r(90),v(80,90,e)):e<100?x(r(90),"#000000",v(90,100,e)):te("#000000")}function x(e,r,t){return te(ot(e,r)(t))}const at=Math.floor(I(5,10)),oe=[w.cyberRed,w.cyberOrange,w.cyberYellow,w.cyberGreen,w.cyberCyan,w.cyberBlue,w.cyberIndigo,w.cyberPurple,w.cyberPink],it=oe.map(e=>({value:e,color:e(50)}));function lt({size:e}){const r=p.useRef(null),t=p.useRef(null),n=p.useRef(),o=Ke();return p.useEffect(()=>($(r.current&&t.current,"Assertion Error: displayCanvasRef.current && uiCanvasRef.current"),n.current=st(r.current,t.current,o.ui),()=>{$(n.current,"Assertion Error: blobFactoryRef.current"),n.current.destroy(),n.current=void 0}),[o.ui]),p.useEffect(()=>{$(n.current,"Assertion Error: blobFactoryRef.current"),n.current.setSize(e)},[e]),_(be,{children:[_("div",{className:"absolute inset-0",onPointerMove:c=>{n.current&&n.current.onPointerMove(R.fromEvent(c))},onPointerDown:c=>{n.current&&n.current.onPointerDown(R.fromEvent(c))},onPointerUp:c=>{n.current&&n.current.onPointerUp(R.fromEvent(c))},children:[i("canvas",{ref:r,width:e.x*window.devicePixelRatio,height:e.y*window.devicePixelRatio,className:"absolute inset-0 h-full w-full"}),i("canvas",{ref:t,width:e.x*window.devicePixelRatio,height:e.y*window.devicePixelRatio,className:"absolute inset-0 h-full w-full"})]}),_("div",{className:"absolute right-0 top-0 h-full w-72 bg-gray-900",children:[_("ul",{className:"list-disc py-3 px-5 text-xs",children:[i("li",{children:"drag circles to move them"}),i("li",{children:"drag an edge to resize"}),i("li",{children:"drag in empty space for a new one"}),i("li",{children:"backspace to delete"}),i("li",{children:"refresh for something new"}),i("li",{children:"good color level for bgs in dark mode = ~80"}),i("li",{children:"good color level for bgs in light mode = ~20"})]}),o.render()]})]})}const de=[{label:"blur",value:0},{label:"fill",value:3},{label:"inside",value:1},{label:"outside",value:2}],fe=[{label:"naive",value:0},{label:"vector",value:1},{label:"min",value:2}];function st(e,r,t){let n=R.ZERO,o={type:"idle"};const c=ee(r.getContext("2d"),'Assertion Error: uiCanvas.getContext("2d")'),d=new Le(c),f=new Te(e),u=f.createProgram({fragment:je,vertex:He}),s=ze(at,l=>new ne(new R(I(200,600),I(200,600)),I(30,100),B(oe))),b=u.uniformVector2("u_resolution",new R(100,100)),h=u.uniformFloat("u_smoothness",I(50,100)),m=u.uniformFloat("u_blurSize",150),g=u.uniformFloat("u_blurSpread",.8),k=u.uniformEnum("u_mode",B(de).value),V=u.uniformBool("u_darkMode",Math.random()<.5),U=u.uniformEnum("u_interpolateMode",B(fe).value),ae=u.uniformFloat("u_hueBias",I(0,360));let G=V.value?I(50,95):I(5,50),O=!1,j=.5,F=!1,H=.5;const ie=u.createAndBindVertexArrayObject({name:"a_position",size:2,type:Me.Float}),K=f.createTexture(0,{internalFormat:Oe.Rgba32f,pixelType:Fe.Float,pixelFormat:Ae.Rgba});K.configureForData(),u.uniformTexture2d("u_blobs",K);const Ie=l=>{b.value=l,f.setDefaultViewport();const a=[0,0,l.x,l.y,0,l.y,0,0,l.x,0,l.x,l.y];ie.bufferData(new Float32Array(a),Be.StaticDraw),se()},S=l=>s[l]??null,le=()=>{switch(o.type){case"idle":case"unconfirmedCreate":case"selected":{let l=1/0,a=null,C=null;for(let P=0;P<s.length;P++){const W=s[P],X=W.center.distanceTo(n);X<W.radius+5&&X<l&&(l=X,a=W,C=P)}return[a,C]}case"moving":case"resizing":return[ee(S(o.blobIndex),"Assertion Error: blobAtIndex(state.blobIndex)"),o.blobIndex];default:z(o)}},Re=()=>{switch(o.type){case"idle":case"unconfirmedCreate":return null;case"moving":case"selected":case"resizing":return S(o.blobIndex);default:z(o)}},se=()=>{V.value=t.checkbox("dark mode",V.value),G=t.range("color level",G,{min:5,max:100,step:1}),U.value=t.segmentedControl("interpolation",U.value,fe),U.value!==1&&(ae.value=t.range("hue bias",ae.value,{min:0,max:360,step:1})),k.value=t.segmentedControl("mode",k.value,de),(k.value===1||k.value===2)&&(h.value=t.range("smoothness",h.value,{min:0,max:100,step:.1})),m.value=t.range("blur size",m.value,{min:0,max:200,step:.1}),k.value===0&&(g.value=t.range("blur spread",g.value,{min:.01,max:.99,step:.01})),O=t.checkbox("force chroma",O),O&&(j=t.range("chroma",j,{min:0,max:1,step:.01})),F=t.checkbox("force lightness",F),F&&(H=t.range("lightness",H,{min:0,max:1,step:.01})),f.clear(),K.update({width:s.length*2,height:1,data:new Float32Array(s.flatMap(C=>C.toArray(G,O?j:null,F?H:null)))}),u.use(),ie.bindVao(),f.gl.drawArrays(WebGL2RenderingContext.TRIANGLES,0,6),d.clear(),d.ctx.resetTransform(),d.ctx.scale(window.devicePixelRatio,window.devicePixelRatio);const[l]=le(),a=Re();l&&l!==a&&d.circle(l.center,l.radius,{stroke:"cyan",strokeWidth:1}),a&&(d.circle(a.center,a.radius,{stroke:"cyan",strokeWidth:2}),a.colorScale=t.colorPicker("color",a.colorScale,it)),d.fillText(ct(o),new R(30,40),{fill:"white"}),t.flush()};let ce=!1;Ne((l,a)=>{if(ce){a();return}se()});const ue=l=>{o.type==="selected"&&De(l,"backspace")&&S(o.blobIndex)&&(s.splice(o.blobIndex,1),o={type:"idle"})};return window.addEventListener("keydown",ue),{setSize:Ie,destroy:()=>{f.destroy(),window.removeEventListener("keydown",ue),ce=!0},onPointerMove:l=>{switch(n=l,o.type){case"idle":case"selected":break;case"moving":{const a=S(o.blobIndex);a&&(a.center=n.add(o.offset));break}case"resizing":{const a=S(o.blobIndex);a&&(a.radius=n.distanceTo(a.center));break}case"unconfirmedCreate":{const a=o.center.distanceTo(n);if(a>5){const C=s.length;s.push(new ne(o.center,a,B(oe))),o={type:"resizing",blobIndex:C}}break}default:z(o)}},onPointerDown:l=>{n=l;const[a,C]=le();switch(o.type){case"idle":case"selected":{a?Math.abs(a.center.distanceTo(n)-a.radius)<5?o={type:"resizing",blobIndex:C}:o={type:"moving",offset:a.center.sub(n),blobIndex:C}:o={type:"unconfirmedCreate",center:n};break}case"moving":case"unconfirmedCreate":case"resizing":break;default:z(o)}},onPointerUp:l=>{switch(n=l,o.type){case"idle":case"selected":break;case"moving":case"resizing":o={type:"selected",blobIndex:o.blobIndex};break;case"unconfirmedCreate":o={type:"idle"};break;default:z(o)}}}}class ne{constructor(r,t,n){this.center=r,this.radius=t,this.colorScale=n}toArray(r,t,n){let o=nt(r,this.colorScale).lch();return t!==null&&(o=o.chroma(t*100)),n!==null&&(o=o.lightness(n*100)),o=o.rgb(),[this.center.x,this.center.y,this.radius,0,o.red()/255,o.green()/255,o.blue()/255,0]}toJSON(){return{center:this.center,radius:this.radius}}}ne.size=8;function ct(e){switch(e.type){case"idle":return L(e.type);case"resizing":case"selected":return L(e.type,{blob:e.blobIndex});case"moving":return L(e.type,{offset:e.offset.toString(2),blob:e.blobIndex});case"unconfirmedCreate":return L(e.type,{center:e.center.toString(2)})}}ke(ee(document.getElementById("root"),'Assertion Error: document.getElementById("root")')).render(i(ut,{}));function ut(){const[e,r]=p.useState(null),t=Se(e,Pe);return i("div",{ref:r,className:"absolute inset-0 touch-none",children:t&&i(lt,{size:t})})}
