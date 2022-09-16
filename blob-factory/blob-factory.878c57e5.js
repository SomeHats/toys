import{b as x,f as K,a as F,g as ie,c as E,d as L,t as H,s as G,r as _,i as ce}from"../chunks/chunk_assert.67ae27bf.js";/* empty css                               */import{u as P,e as N,m as ae,d as k,c as le,a as de,s as ue}from"../chunks/chunk_debugPropsToString.5173b2c2.js";import{r as m}from"../chunks/chunk_index.0b2a17fa.js";import{V as T}from"../chunks/chunk_Vector2.60c0b602.js";import{D as ge}from"../chunks/chunk_DebugDraw.e943e3cf.js";import{j as d,F as J,a as w}from"../chunks/chunk_jsx-runtime.1a94b7a7.js";import"../chunks/chunk__commonjsHelpers.fbcca4d8.js";class M{constructor(t,r,n){this.gl=t,this.name=r,this.location=n}}class he extends M{set(t){this.gl.gl.uniform2f(this.location,t.x,t.y)}}class fe extends M{set(t){this.gl.gl.uniform1f(this.location,t)}}class me extends M{set(t){this.gl.gl.uniform1ui(this.location,t?1:0)}}class pe{constructor(t,r,n){this.gl=t,this.vertexArray=r,this.buffer=n}bufferData(t,r){const{gl:n}=this.gl;n.bindBuffer(n.ARRAY_BUFFER,this.buffer),n.bufferData(n.ARRAY_BUFFER,t,r)}bindVao(){const{gl:t}=this.gl;t.bindVertexArray(this.vertexArray)}}class be{constructor(t,r,n){this.vertexShader=r,this.fragmentShader=n,this.gl=t;const{gl:o}=t,c=x(o.createProgram());if(o.attachShader(c,r.shader),o.attachShader(c,n.shader),o.linkProgram(c),!o.getProgramParameter(c,o.LINK_STATUS)){const s=`Failed to link shaders: ${o.getProgramInfoLog(c)}`;o.deleteProgram(c),K(s)}this.program=c}createAndBindVertexArray({name:t,size:r,type:n,normalize:o=!1,stride:c=0,offset:h=0}){const{gl:s}=this.gl,u=this.gl.createBuffer();s.bindBuffer(s.ARRAY_BUFFER,u);const g=this.gl.createVertexArray();s.bindVertexArray(g);const a=s.getAttribLocation(this.program,t);return s.enableVertexAttribArray(a),s.vertexAttribPointer(a,r,n,o,c,h),new pe(this.gl,g,u)}getUniformLocation(t){return x(this.gl.gl.getUniformLocation(this.program,t))}uniformVector2(t){return new he(this.gl,t,this.getUniformLocation(t))}uniformFloat(t){return new fe(this.gl,t,this.getUniformLocation(t))}uniformBool(t){return new me(this.gl,t,this.getUniformLocation(t))}use(){this.gl.gl.useProgram(this.program)}}class xe{constructor(t,r,n){this.type=r,this.gl=t;const{gl:o}=t,c=x(o.createShader(r));if(o.shaderSource(c,n),o.compileShader(c),!o.getShaderParameter(c,o.COMPILE_STATUS)){const s=`Failed to compile shader: ${o.getShaderInfoLog(c)}`;o.deleteShader(c),K(s)}this.shader=c}}class ye{constructor(t){this.canvas=t,this.shaders=new D((n,o)=>new xe(this,n,o),n=>this.gl.deleteShader(n.shader)),this.programs=new D((n,o)=>new be(this,n,o),n=>this.gl.deleteProgram(n.program)),this.buffers=new D(()=>x(this.gl.createBuffer()),n=>this.gl.deleteBuffer(n)),this.vertexArrays=new D(()=>x(this.gl.createVertexArray()),n=>this.gl.deleteVertexArray(n));const r=t.getContext("webgl2");F(r,"browser does not support webgl2"),this.gl=r}destory(){this.shaders.destroyAll(),this.programs.destroyAll(),this.buffers.destroyAll(),this.vertexArrays.destroyAll()}createShader(t,r){return this.shaders.create(t,r)}createProgram(t,r){return this.programs.create(t,r)}createBuffer(){return this.buffers.create()}createVertexArray(){return this.vertexArrays.create()}setDefaultViewport(){this.gl.viewport(0,0,this.canvas.width,this.canvas.height)}clear(){const{gl:t}=this;t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT)}enumToString(t){const r=[];for(const n in this.gl)ie(this.gl,n)===t&&r.push(n);return r.length?r.join(" | "):`0x${t.toString(16)}`}}class D{constructor(t,r){this.initializeResource=t,this.deleteResource=r,this.resources=[]}create(...t){const r=this.initializeResource(...t);return this.resources.push(r),r}destroyAll(){for(const t of this.resources)this.deleteResource(t);this.resources=[]}}var Re=`#version 300 es

#define MAX_BLOBS 32
#define ENTRIES_PER_BLOB 2

precision highp float;

uniform sampler2D u_blobs;
uniform float u_smoothness;
uniform bool u_outlineMode;

in vec2 screenPosition;

out vec4 outColor;

float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float sdfCircle(vec2 center, float radius) {
    return length(center - screenPosition) - radius;
}

float opSmoothUnion(float d1, float d2, float k) {
    float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
    return mix(d2, d1, h) - k * h * (1.0 - h);
}

float xyzF(float t) {
    return mix(pow(t, 1. / 3.), 7.787037 * t + 0.139731, step(t, 0.00885645));
}
float xyzR(float t) {
    return mix(t * t * t, 0.1284185 * (t - 0.139731), step(t, 0.20689655));
}
vec3 rgb2lch(in vec3 c) {
    
    vec3 wref = vec3(1.0, 1.0, 1.0);

    c *= mat3(0.4124, 0.3576, 0.1805, 0.2126, 0.7152, 0.0722, 0.0193, 0.1192,
              0.9505);
    c.x = xyzF(c.x / wref.x);
    c.y = xyzF(c.y / wref.y);
    c.z = xyzF(c.z / wref.z);
    vec3 lab = vec3(max(0., 116.0 * c.y - 16.0), 500.0 * (c.x - c.y),
                    200.0 * (c.y - c.z));
    return vec3(lab.x, length(vec2(lab.y, lab.z)), atan(lab.z, lab.y));
}

vec3 lch2rgb(in vec3 c) {
    
    vec3 wref = vec3(1.0, 1.0, 1.0);

    c = vec3(c.x, cos(c.z) * c.y, sin(c.z) * c.y);

    float lg = 1. / 116. * (c.x + 16.);
    vec3 xyz = vec3(wref.x * xyzR(lg + 0.002 * c.y), wref.y * xyzR(lg),
                    wref.z * xyzR(lg - 0.005 * c.z));

    vec3 rgb = xyz * mat3(3.2406, -1.5372, -0.4986, -0.9689, 1.8758, 0.0415,
                          0.0557, -0.2040, 1.0570);

    return rgb;
}

void main() {
    int blobCount =
        min(textureSize(u_blobs, 0).x / ENTRIES_PER_BLOB, MAX_BLOBS);

    float totalStrength = 0.;
    vec3 totalColor = vec3(0);

    float dist = 99999.0;

    for (int i = 0; i < blobCount; i++) {
        vec4 d1 = texelFetch(u_blobs, ivec2(i * ENTRIES_PER_BLOB, 0), 0);
        vec2 center = d1.xy;
        float radius = d1.z;
        vec3 color = rgb2lch(
            texelFetch(u_blobs, ivec2((i * ENTRIES_PER_BLOB) + 1, 0), 0).rgb);

        float sd = sdfCircle(center, radius);
        float strength = clamp(map(sd, 0., u_smoothness, 1., 0.), 0., 1.);
        totalStrength += strength;
        totalColor += color * strength;

        dist = opSmoothUnion(sd, dist, u_smoothness);
    }

    float result = smoothstep(0.0, 1.0, -dist);

    
    if (u_outlineMode) {
        outColor = vec4(
            mix(lch2rgb(totalColor / totalStrength), vec3(0, 0, 0), result), 1);
    } else {
        outColor = vec4(
            mix(vec3(0, 0, 0), lch2rgb(totalColor / totalStrength), result), 1);
    }
}`,we=`#version 300 es

in vec2 a_position;

uniform vec2 u_resolution;

out vec2 screenPosition;

void main() {
    screenPosition = a_position;

    
    vec2 zeroToOne = a_position / u_resolution;

    
    vec2 zeroToTwo = zeroToOne * 2.0;

    
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}`,I=(e=>(e[e.Fragment=WebGL2RenderingContext.FRAGMENT_SHADER]="Fragment",e[e.Vertex=WebGL2RenderingContext.VERTEX_SHADER]="Vertex",e))(I||{}),Z=(e=>(e[e.StaticDraw=WebGL2RenderingContext.STATIC_DRAW]="StaticDraw",e[e.DynamicDraw=WebGL2RenderingContext.DYNAMIC_DRAW]="DynamicDraw",e[e.StreamDraw=WebGL2RenderingContext.STREAM_DRAW]="StreamDraw",e[e.StaticRead=WebGL2RenderingContext.STATIC_READ]="StaticRead",e[e.DynamicRead=WebGL2RenderingContext.DYNAMIC_READ]="DynamicRead",e[e.StreamRead=WebGL2RenderingContext.STREAM_READ]="StreamRead",e[e.StaticCopy=WebGL2RenderingContext.STATIC_COPY]="StaticCopy",e[e.DynamicCopy=WebGL2RenderingContext.DYNAMIC_COPY]="DynamicCopy",e[e.StreamCopy=WebGL2RenderingContext.STREAM_COPY]="StreamCopy",e))(Z||{}),q=(e=>(e[e.Byte=WebGL2RenderingContext.BYTE]="Byte",e[e.Short=WebGL2RenderingContext.SHORT]="Short",e[e.UnsignedByte=WebGL2RenderingContext.UNSIGNED_BYTE]="UnsignedByte",e[e.UnsignedShort=WebGL2RenderingContext.UNSIGNED_SHORT]="UnsignedShort",e[e.Float=WebGL2RenderingContext.FLOAT]="Float",e[e.HalfFloat=WebGL2RenderingContext.HALF_FLOAT]="HalfFloat",e))(q||{});function ve(){const[e,t]=m.exports.useState([]),r=m.exports.useRef([]),n=P((s,u,g)=>{var a,f;return r.current.push({type:"range",label:s,value:u,oldValue:u,...g}),(f=(a=e.find(p=>p.type==="range"&&p.label===s&&p.oldValue===u))==null?void 0:a.value)!=null?f:u}),o=P((s,u,g)=>{var a,f;return r.current.push({type:"colorPicker",label:s,value:u,options:g,oldValue:u}),(f=(a=e.find(p=>p.type==="colorPicker"&&p.label===s&&N(p.oldValue,u)))==null?void 0:a.value)!=null?f:u}),c=P((s,u)=>{var g,a;return r.current.push({type:"checkbox",label:s,value:u,oldValue:u}),(a=(g=e.find(f=>f.type==="checkbox"&&f.label===s&&f.oldValue===u))==null?void 0:g.value)!=null?a:u}),h=P(()=>{N(e,r.current)||t(r.current),r.current=[]});return{render:()=>d(Ae,{state:e,onChange:t}),ui:m.exports.useMemo(()=>({checkbox:c,range:n,flush:h,colorPicker:o}),[c,o,h,n])}}function Ae({state:e,onChange:t}){return d(J,{children:e.map((r,n)=>{switch(r.type){case"checkbox":return d(Ee,{label:r.label,value:r.value,onChange:o=>t(L(e,n,{...r,value:o}))},n);case"range":return d(Se,{label:r.label,value:r.value,onChange:o=>t(L(e,n,{...r,value:o})),min:r.min,max:r.max,step:r.step},n);case"colorPicker":return d(Ce,{label:r.label,value:r.value,options:r.options,onChange:o=>t(L(e,n,{...r,value:o}))},n);default:E(r)}})})}function Se({label:e,value:t,onChange:r,min:n,max:o,step:c}){const h=m.exports.useId();return w("div",{className:"flex flex-col gap-2 p-3",children:[d("label",{htmlFor:h,children:e}),w("div",{className:"flex items-center justify-between gap-3",children:[d("input",{id:h,className:"w-2/3 flex-auto",type:"range",value:t,min:n,max:o,step:c,onChange:s=>r(s.currentTarget.valueAsNumber)}),d("span",{className:"w-1/3 flex-none text-right",children:t.toPrecision(3)})]})]})}function Ee({label:e,value:t,onChange:r}){const n=m.exports.useId();return w("div",{className:"flex gap-3 p-3",children:[d("input",{id:n,type:"checkbox",onChange:o=>r(o.currentTarget.checked),checked:t}),d("label",{htmlFor:n,children:e})]})}function Ce({label:e,value:t,onChange:r,options:n}){return w("div",{className:"flex-col gap-3 p-3",children:[e,d("div",{className:"flex gap-1",children:n.map((o,c)=>d("div",{style:{background:o.color},className:"flex h-6 flex-1 cursor-pointer items-center justify-center",onClick:()=>r(o.value),children:N(o.value,t)&&d("div",{className:"h-3 w-3 rounded-full border-2 border-black bg-white"})},c))})]})}const _e={"grey-0":[251,251,252],"grey-5":[237,238,242],"grey-10":[214,215,219],"grey-20":[191,192,196],"grey-30":[169,170,174],"grey-40":[146,147,151],"grey-50":[123,124,128],"grey-60":[102,103,106],"grey-70":[81,82,85],"grey-80":[60,60,63],"grey-90":[39,39,42],"grey-100":[18,18,20],"red-5":[250,241,233],"red-10":[248,213,197],"red-20":[238,178,163],"red-30":[229,144,129],"red-40":[222,110,96],"red-50":[214,78,65],"red-60":[172,61,57],"red-70":[128,44,50],"red-80":[85,27,42],"red-90":[42,10,36],"orange-5":[254,248,226],"orange-10":[252,238,205],"orange-20":[246,215,163],"orange-30":[240,191,122],"orange-40":[240,191,122],"orange-50":[229,146,57],"orange-60":[187,112,44],"orange-70":[145,78,31],"orange-80":[104,43,19],"orange-90":[63,11,8],"yellow-5":[250,252,236],"yellow-10":[247,245,209],"yellow-20":[243,234,171],"yellow-30":[239,224,135],"yellow-40":[236,214,102],"yellow-50":[232,203,77],"yellow-60":[194,159,60],"yellow-70":[155,115,43],"yellow-80":[118,72,26],"yellow-90":[80,30,8],"green-5":[249,252,234],"green-10":[238,246,203],"green-20":[204,233,168],"green-30":[170,220,133],"green-40":[139,208,101],"green-50":[111,195,73],"green-60":[87,156,64],"green-70":[63,117,58],"green-80":[38,78,52],"green-90":[13,38,50],"cyan-5":[242,252,248],"cyan-10":[224,249,238],"cyan-20":[190,231,230],"cyan-30":[157,214,223],"cyan-40":[126,197,215],"cyan-50":[98,180,208],"cyan-60":[76,143,173],"cyan-70":[54,106,138],"cyan-80":[32,70,102],"cyan-90":[32,70,102],"indigo-5":[227,249,254],"indigo-10":[204,239,253],"indigo-20":[165,209,245],"indigo-30":[125,178,237],"indigo-40":[87,149,229],"indigo-50":[54,120,222],"indigo-60":[42,95,181],"indigo-70":[30,69,137],"indigo-80":[18,44,95],"indigo-90":[6,20,54],"purple-5":[246,240,254],"purple-10":[236,223,253],"purple-20":[198,184,245],"purple-30":[162,146,238],"purple-40":[124,108,232],"purple-50":[87,71,226],"purple-60":[72,57,184],"purple-70":[56,43,141],"purple-80":[41,29,99],"purple-90":[26,15,57],"pink-5":[250,240,241],"pink-10":[251,231,236],"pink-20":[243,197,223],"pink-30":[236,163,211],"pink-40":[229,129,199],"pink-50":[224,98,188],"pink-60":[181,80,159],"pink-70":[140,61,129],"pink-80":[98,43,101],"pink-90":[55,25,71]};function R(e){const t=_e[e];return[z(t[0]/255),z(t[1]/255),z(t[2]/255)]}function Te(e){const t=e[0]*255,r=e[1]*255,n=e[2]*255;return"#"+((1<<24)+((t|0)<<16)+((r|0)<<8)+(n|0)).toString(16).slice(1)}const j=new Float32Array(1);function z(e){return j[0]=e,j[0]}const $=Math.floor(_(5,10)),U=[R("red-50"),R("orange-50"),R("yellow-50"),R("green-50"),R("cyan-50"),R("indigo-50"),R("purple-50"),R("pink-50")],Pe=U.map(e=>({value:e,color:Te(e)}));function ke({size:e}){const t=m.exports.useRef(null),r=m.exports.useRef(null),n=m.exports.useRef(),o=ve();return m.exports.useEffect(()=>(F(t.current&&r.current),n.current=De(t.current,r.current,o.ui),()=>{F(n.current),n.current.destroy(),n.current=void 0}),[o.ui]),m.exports.useEffect(()=>{F(n.current),n.current.setSize(e)},[e]),w(J,{children:[w("div",{className:"absolute inset-0",onPointerMove:c=>{n.current&&n.current.onPointerMove(T.fromEvent(c))},onPointerDown:c=>{n.current&&n.current.onPointerDown()},onPointerUp:c=>{n.current&&n.current.onPointerUp()},children:[d("canvas",{ref:t,width:e.x*window.devicePixelRatio,height:e.y*window.devicePixelRatio,className:"absolute inset-0 h-full w-full"}),d("canvas",{ref:r,width:e.x*window.devicePixelRatio,height:e.y*window.devicePixelRatio,className:"absolute inset-0 h-full w-full"})]}),w("div",{className:"absolute right-0 top-0 h-full w-72 bg-gray-900",children:[w("ul",{className:"list-disc py-3 px-5 text-xs",children:[d("li",{children:"drag circles to move them"}),d("li",{children:"drag an edge to resize"}),d("li",{children:"drag in empty space for a new one"}),d("li",{children:"backspace to delete"}),d("li",{children:"refresh for something new"})]}),o.render()]})]})}function De(e,t,r){let n=new T(100,100),o=T.ZERO,c=_(50,100),h=Math.random()<.5,s={type:"idle"};const u=x(t.getContext("2d")),g=new ge(u),a=new ye(e),f=a.createShader(I.Fragment,Re),p=a.createShader(I.Vertex,we),A=a.createProgram(p,f),y={current:new Float32Array(v.size*$)},S=H($,i=>{const l=new v(y,i);return l.color=G(U),l.x=_(200,600),l.y=_(200,600),l.radius=_(30,100),l}),Q=A.uniformVector2("u_resolution"),ee=A.uniformFloat("u_smoothness"),te=A.uniformBool("u_outlineMode"),O=A.createAndBindVertexArray({name:"a_position",size:2,type:q.Float}),re=x(a.gl.getUniformLocation(A.program,"u_blobs")),ne=x(a.gl.createTexture());{const{gl:i}=a;i.bindTexture(i.TEXTURE_2D,ne),i.texImage2D(i.TEXTURE_2D,0,i.RGBA32F,S.length,1,0,i.RGBA,i.FLOAT,y.current),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}const oe=i=>{n=i,a.setDefaultViewport();const l=[0,0,n.x,n.y,0,n.y,0,0,n.x,0,n.x,n.y];O.bufferData(new Float32Array(l),Z.StaticDraw),V()},W=()=>{switch(s.type){case"idle":case"unconfirmedCreate":case"selected":{let i=1/0,l=null;for(const C of S){const b=C.center.distanceTo(o);b<C.radius+5&&b<i&&(i=b,l=C)}return l}case"moving":case"resizing":return s.blob;default:E(s)}},se=()=>{switch(s.type){case"idle":case"unconfirmedCreate":return null;case"moving":case"selected":case"resizing":return s.blob;default:E(s)}},V=()=>{c=r.range("smoothness",c,{min:0,max:100,step:.1}),h=r.checkbox("outline",h),a.clear(),A.use(),Q.set(n),ee.set(c),te.set(h),a.gl.texImage2D(a.gl.TEXTURE_2D,0,a.gl.RGBA32F,S.length*2,1,0,a.gl.RGBA,a.gl.FLOAT,y.current),O.bindVao(),a.gl.uniform1i(re,0),a.gl.drawArrays(WebGL2RenderingContext.TRIANGLES,0,6),g.clear(),g.ctx.resetTransform(),g.ctx.scale(window.devicePixelRatio,window.devicePixelRatio);const i=W(),l=se();i&&i!==l&&g.circle(i.center,i.radius,{stroke:"cyan",strokeWidth:1}),l&&(g.circle(l.center,l.radius,{stroke:"cyan",strokeWidth:2}),l.color=r.colorPicker("color",l.color,Pe)),g.fillText(Fe(s),new T(30,40),{fill:"white"}),r.flush()};let X=!1;ce((i,l)=>{if(X){l();return}V()});const Y=i=>{if(s.type==="selected"&&ae(i,"backspace")){const l=[...y.current];l.splice(s.blob.index*v.size,v.size),y.current=new Float32Array(l),S.pop(),s={type:"idle"}}};return window.addEventListener("keydown",Y),{setSize:oe,destroy:()=>{a.destory(),window.removeEventListener("keydown",Y),X=!0},onPointerMove:i=>{switch(o=i,s.type){case"idle":case"selected":break;case"moving":s.blob.center=o.add(s.offset);break;case"resizing":s.blob.radius=o.distanceTo(s.blob.center);break;case"unconfirmedCreate":{const l=s.center.distanceTo(o);if(l>5){const C=[...y.current,...H(v.size,()=>0)];y.current=new Float32Array(C);const b=new v(y,S.length);b.color=G(U),b.center=s.center,b.radius=l,S.push(b),s={type:"resizing",blob:b}}break}default:E(s)}},onPointerDown:()=>{const i=W();switch(s.type){case"idle":case"selected":{i?Math.abs(i.center.distanceTo(o)-i.radius)<5?s={type:"resizing",blob:i}:s={type:"moving",offset:i.center.sub(o),blob:i}:s={type:"unconfirmedCreate",center:o};break}case"moving":case"unconfirmedCreate":case"resizing":break;default:E(s)}},onPointerUp:()=>{switch(s.type){case"idle":case"selected":break;case"moving":case"resizing":s={type:"selected",blob:s.blob};break;case"unconfirmedCreate":s={type:"idle"};break;default:E(s)}}}}const B=class{constructor(e,t){this.backingStore=e,this.index=t}getAt(e){return this.backingStore.current[this.index*B.size+e]}setAt(e,t){this.backingStore.current[this.index*B.size+e]=t}get x(){return this.getAt(0)}set x(e){this.setAt(0,e)}get y(){return this.getAt(1)}set y(e){this.setAt(1,e)}get radius(){return this.getAt(2)}set radius(e){this.setAt(2,e)}get center(){return new T(this.x,this.y)}set center(e){this.x=e.x,this.y=e.y}get red(){return this.getAt(4)}set red(e){this.setAt(4,e)}get green(){return this.getAt(5)}set green(e){this.setAt(5,e)}get blue(){return this.getAt(6)}set blue(e){this.setAt(6,e)}get color(){return[this.red,this.green,this.blue]}set color(e){this.red=e[0],this.green=e[1],this.blue=e[2]}toJSON(){return{center:this.center,radius:this.radius}}};let v=B;v.size=8;function Fe(e){switch(e.type){case"idle":return k(e.type);case"resizing":case"selected":return k(e.type,{blob:e.blob.index});case"moving":return k(e.type,{offset:e.offset.toString(2),blob:e.blob.index});case"unconfirmedCreate":return k(e.type,{center:e.center.toString(2)})}}le(x(document.getElementById("root"))).render(d(Le,{}));function Le(){const[e,t]=m.exports.useState(null),r=de(e,ue);return d("div",{ref:t,className:"absolute inset-0 touch-none",children:r&&d(ke,{size:r})})}
