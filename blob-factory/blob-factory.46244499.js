import{b as g,f as O,a as w,g as j,e as K,t as N,r as _,d as J,c as y}from"../chunks/chunk_assert.3aaefc51.js";/* empty css                               */import{m as Z,c as q,u as Q,s as ee}from"../chunks/chunk_useKeyPress.5258faba.js";import{r as h}from"../chunks/chunk_index.b0b8f4df.js";import{V as S}from"../chunks/chunk_Vector2.241c9c85.js";import{D as te}from"../chunks/chunk_DebugDraw.ca96fe24.js";import{j as T,F as re,a as u}from"../chunks/chunk_jsx-runtime.166d6c47.js";class F{constructor(t,n,r){this.gl=t,this.name=n,this.location=r}}class ne extends F{set(t){this.gl.gl.uniform2f(this.location,t.x,t.y)}}class se extends F{set(t){this.gl.gl.uniform1f(this.location,t)}}class oe extends F{set(t){this.gl.gl.uniform1ui(this.location,t?1:0)}}class ie{constructor(t,n,r){this.gl=t,this.vertexArray=n,this.buffer=r}bufferData(t,n){const{gl:r}=this.gl;r.bindBuffer(r.ARRAY_BUFFER,this.buffer),r.bufferData(r.ARRAY_BUFFER,t,n)}bindVao(){const{gl:t}=this.gl;t.bindVertexArray(this.vertexArray)}}class ae{constructor(t,n,r){this.vertexShader=n,this.fragmentShader=r,this.gl=t;const{gl:i}=t,s=g(i.createProgram());if(i.attachShader(s,n.shader),i.attachShader(s,r.shader),i.linkProgram(s),!i.getProgramParameter(s,i.LINK_STATUS)){const c=`Failed to link shaders: ${i.getProgramInfoLog(s)}`;i.deleteProgram(s),O(c)}this.program=s}createAndBindVertexArray({name:t,size:n,type:r,normalize:i=!1,stride:s=0,offset:d=0}){const{gl:c}=this.gl,l=this.gl.createBuffer();c.bindBuffer(c.ARRAY_BUFFER,l);const A=this.gl.createVertexArray();c.bindVertexArray(A);const v=c.getAttribLocation(this.program,t);return c.enableVertexAttribArray(v),c.vertexAttribPointer(v,n,r,i,s,d),new ie(this.gl,A,l)}getUniformLocation(t){return g(this.gl.gl.getUniformLocation(this.program,t))}uniformVector2(t){return new ne(this.gl,t,this.getUniformLocation(t))}uniformFloat(t){return new se(this.gl,t,this.getUniformLocation(t))}uniformBool(t){return new oe(this.gl,t,this.getUniformLocation(t))}use(){this.gl.gl.useProgram(this.program)}}class ce{constructor(t,n,r){this.type=n,this.gl=t;const{gl:i}=t,s=g(i.createShader(n));if(i.shaderSource(s,r),i.compileShader(s),!i.getShaderParameter(s,i.COMPILE_STATUS)){const c=`Failed to compile shader: ${i.getShaderInfoLog(s)}`;i.deleteShader(s),O(c)}this.shader=s}}class le{constructor(t){this.canvas=t,this.shaders=new E((r,i)=>new ce(this,r,i),r=>this.gl.deleteShader(r.shader)),this.programs=new E((r,i)=>new ae(this,r,i),r=>this.gl.deleteProgram(r.program)),this.buffers=new E(()=>g(this.gl.createBuffer()),r=>this.gl.deleteBuffer(r)),this.vertexArrays=new E(()=>g(this.gl.createVertexArray()),r=>this.gl.deleteVertexArray(r));const n=t.getContext("webgl2");w(n,"browser does not support webgl2"),this.gl=n}destory(){this.shaders.destroyAll(),this.programs.destroyAll(),this.buffers.destroyAll(),this.vertexArrays.destroyAll()}createShader(t,n){return this.shaders.create(t,n)}createProgram(t,n){return this.programs.create(t,n)}createBuffer(){return this.buffers.create()}createVertexArray(){return this.vertexArrays.create()}setDefaultViewport(){this.gl.viewport(0,0,this.canvas.width,this.canvas.height)}clear(){const{gl:t}=this;t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT)}enumToString(t){const n=[];for(const r in this.gl)j(this.gl,r)===t&&n.push(r);return n.length?n.join(" | "):`0x${t.toString(16)}`}}class E{constructor(t,n){this.initializeResource=t,this.deleteResource=n,this.resources=[]}create(...t){const n=this.initializeResource(...t);return this.resources.push(n),n}destroyAll(){for(const t of this.resources)this.deleteResource(t);this.resources=[]}}var de=`#version 300 es

precision highp float;

uniform sampler2D u_blobs;
uniform float u_smoothness;

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

void main() {
    int blobCount = textureSize(u_blobs, 0).x;

    float dist = 99999.0;
    for (int i = 0; i < blobCount; i++) {
        vec4 data = texelFetch(u_blobs, ivec2(i, 0), 0);
        vec2 center = data.xy;
        float radius = data.z;

        float sd = sdfCircle(center, radius);
        dist = opSmoothUnion(sd, dist, u_smoothness);
    }

    float result = smoothstep(0.0, 1.0, -dist);
    outColor = vec4(result, 0, 0, 1);
}`,ue=`#version 300 es

in vec2 a_position;

uniform vec2 u_resolution;

out vec2 screenPosition;

void main() {
    screenPosition = a_position;

    
    vec2 zeroToOne = a_position / u_resolution;

    
    vec2 zeroToTwo = zeroToOne * 2.0;

    
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}`,D=(e=>(e[e.Fragment=WebGL2RenderingContext.FRAGMENT_SHADER]="Fragment",e[e.Vertex=WebGL2RenderingContext.VERTEX_SHADER]="Vertex",e))(D||{}),M=(e=>(e[e.StaticDraw=WebGL2RenderingContext.STATIC_DRAW]="StaticDraw",e[e.DynamicDraw=WebGL2RenderingContext.DYNAMIC_DRAW]="DynamicDraw",e[e.StreamDraw=WebGL2RenderingContext.STREAM_DRAW]="StreamDraw",e[e.StaticRead=WebGL2RenderingContext.STATIC_READ]="StaticRead",e[e.DynamicRead=WebGL2RenderingContext.DYNAMIC_READ]="DynamicRead",e[e.StreamRead=WebGL2RenderingContext.STREAM_READ]="StreamRead",e[e.StaticCopy=WebGL2RenderingContext.STATIC_COPY]="StaticCopy",e[e.DynamicCopy=WebGL2RenderingContext.DYNAMIC_COPY]="DynamicCopy",e[e.StreamCopy=WebGL2RenderingContext.STREAM_COPY]="StreamCopy",e))(M||{}),B=(e=>(e[e.Byte=WebGL2RenderingContext.BYTE]="Byte",e[e.Short=WebGL2RenderingContext.SHORT]="Short",e[e.UnsignedByte=WebGL2RenderingContext.UNSIGNED_BYTE]="UnsignedByte",e[e.UnsignedShort=WebGL2RenderingContext.UNSIGNED_SHORT]="UnsignedShort",e[e.Float=WebGL2RenderingContext.FLOAT]="Float",e[e.HalfFloat=WebGL2RenderingContext.HALF_FLOAT]="HalfFloat",e))(B||{});function he(e){return K(e).map(([t,n])=>t.startsWith("_")?n:`${t} = ${n}`).join(", ")}function C(e,t={}){return`${e}(${he(t)})`}const I=7;function ge({size:e}){const t=h.exports.useRef(null),n=h.exports.useRef(null),r=h.exports.useRef(),[i,s]=h.exports.useState(0);return h.exports.useEffect(()=>(w(t.current&&n.current),r.current=me(t.current,n.current),()=>{w(r.current),r.current.destroy(),r.current=void 0}),[]),h.exports.useEffect(()=>{w(r.current),r.current.setSize(e)},[e]),h.exports.useEffect(()=>{w(r.current),r.current.onUpdateParams({smoothness:i})}),T(re,{children:[T("div",{className:"absolute inset-0",onPointerMove:d=>{r.current&&r.current.onPointerMove(S.fromEvent(d))},onPointerDown:d=>{r.current&&r.current.onPointerDown()},onPointerUp:d=>{r.current&&r.current.onPointerUp()},children:[u("canvas",{ref:t,width:e.x*window.devicePixelRatio,height:e.y*window.devicePixelRatio,className:"absolute inset-0 h-full w-full"}),u("canvas",{ref:n,width:e.x*window.devicePixelRatio,height:e.y*window.devicePixelRatio,className:"absolute inset-0 h-full w-full"})]}),u("div",{className:"absolute right-0 top-0 h-full w-72 bg-gray-900",children:u(fe,{label:"smoothness",value:i,onChange:s,min:0,max:100,step:.1})})]})}function me(e,t){let n=new S(100,100),r=S.ZERO,i={smoothness:0},s={type:"idle"};const d=g(t.getContext("2d")),c=new te(d),l=new le(e),A=l.createShader(D.Fragment,de),v=l.createShader(D.Vertex,ue),R=l.createProgram(v,A),m={current:new Float32Array(b.size*I)},x=N(I,o=>{const a=new b(m,o);return a.x=_(100,600),a.y=_(100,600),a.radius=_(20,60),a}),V=R.uniformVector2("u_resolution"),X=R.uniformFloat("u_smoothness"),L=R.createAndBindVertexArray({name:"a_position",size:2,type:B.Float}),Y=g(l.gl.getUniformLocation(R.program,"u_blobs")),G=g(l.gl.createTexture());{const{gl:o}=l;o.bindTexture(o.TEXTURE_2D,G),o.texImage2D(o.TEXTURE_2D,0,o.RGBA32F,x.length,1,0,o.RGBA,o.FLOAT,m.current),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.NEAREST),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE)}const H=o=>{n=o,l.setDefaultViewport();const a=[0,0,n.x,n.y,0,n.y,0,0,n.x,0,n.x,n.y];L.bufferData(new Float32Array(a),M.StaticDraw),k()},W=()=>{switch(s.type){case"idle":case"unconfirmedCreate":case"selected":{let o=1/0,a=null;for(const p of x){const f=p.center.distanceTo(r);f<p.radius&&f<o&&(o=f,a=p)}return a}case"moving":case"resizing":return s.blob;default:y(s)}},$=()=>{switch(s.type){case"idle":case"unconfirmedCreate":return null;case"moving":case"selected":case"resizing":return s.blob;default:y(s)}},k=()=>{l.clear(),R.use(),V.set(n),X.set(i.smoothness),l.gl.texImage2D(l.gl.TEXTURE_2D,0,l.gl.RGBA32F,x.length,1,0,l.gl.RGBA,l.gl.FLOAT,m.current),L.bindVao(),l.gl.uniform1i(Y,0),l.gl.drawArrays(WebGL2RenderingContext.TRIANGLES,0,6),c.clear(),c.ctx.resetTransform(),c.ctx.scale(window.devicePixelRatio,window.devicePixelRatio);const o=W(),a=$();o&&o!==a&&c.circle(o.center,o.radius,{stroke:"cyan",strokeWidth:1}),a&&c.circle(a.center,a.radius,{stroke:"cyan",strokeWidth:2}),c.fillText(be(s),new S(30,40),{fill:"white"})};let z=!1;J((o,a)=>{if(z){a();return}k()});const U=o=>{if(s.type==="selected"&&Z(o,"backspace")){const a=[...m.current];a.splice(s.blob.index*b.size,b.size),m.current=new Float32Array(a),x.pop(),s={type:"idle"}}};return window.addEventListener("keydown",U),{setSize:H,destroy:()=>{l.destory(),window.removeEventListener("keydown",U),z=!0},onPointerMove:o=>{switch(r=o,s.type){case"idle":case"selected":break;case"moving":s.blob.center=r.add(s.offset);break;case"resizing":s.blob.radius=r.distanceTo(s.blob.center);break;case"unconfirmedCreate":{const a=s.center.distanceTo(r);if(a>5){const p=[...m.current,...N(b.size,()=>0)];m.current=new Float32Array(p);const f=new b(m,x.length);f.center=s.center,f.radius=a,x.push(f),s={type:"resizing",blob:f}}break}default:y(s)}},onPointerDown:()=>{const o=W();switch(s.type){case"idle":case"selected":{o?Math.abs(o.center.distanceTo(r)-o.radius)<5?s={type:"resizing",blob:o}:s={type:"moving",offset:o.center.sub(r),blob:o}:s={type:"unconfirmedCreate",center:r};break}case"moving":case"unconfirmedCreate":case"resizing":break;default:y(s)}},onPointerUp:()=>{switch(s.type){case"idle":case"selected":break;case"moving":case"resizing":s={type:"selected",blob:s.blob};break;case"unconfirmedCreate":s={type:"idle"};break;default:y(s)}},onUpdateParams:o=>{i=o}}}const P=class{constructor(e,t){this.backingStore=e,this.index=t}getAt(e){return this.backingStore.current[this.index*P.size+e]}setAt(e,t){this.backingStore.current[this.index*P.size+e]=t}get x(){return this.getAt(0)}set x(e){this.setAt(0,e)}get y(){return this.getAt(1)}set y(e){this.setAt(1,e)}get radius(){return this.getAt(2)}set radius(e){this.setAt(2,e)}get center(){return new S(this.x,this.y)}set center(e){this.x=e.x,this.y=e.y}toJSON(){return{center:this.center,radius:this.radius}}};let b=P;b.size=4;function fe({label:e,value:t,onChange:n,min:r,max:i,step:s}){const d=h.exports.useId();return T("div",{className:"flex flex-col gap-2 p-3",children:[u("label",{htmlFor:d,children:e}),T("div",{className:"flex items-center justify-between gap-3",children:[u("input",{id:d,className:"w-2/3 flex-auto",type:"range",value:t,min:r,max:i,step:s,onChange:c=>n(c.currentTarget.valueAsNumber)}),u("span",{className:"w-1/3 flex-none text-right",children:t.toPrecision(3)})]})]})}function be(e){switch(e.type){case"idle":return C(e.type);case"resizing":case"selected":return C(e.type,{blob:e.blob.index});case"moving":return C(e.type,{offset:e.offset.toString(2),blob:e.blob.index});case"unconfirmedCreate":return C(e.type,{center:e.center.toString(2)})}}q(g(document.getElementById("root"))).render(u(xe,{}));function xe(){const[e,t]=h.exports.useState(null),n=Q(e,ee);return u("div",{ref:t,className:"absolute inset-0 touch-none",children:n&&u(ge,{size:n})})}
