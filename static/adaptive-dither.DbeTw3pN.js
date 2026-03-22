import"./chunk_modulepreload-polyfill.B5Qt9EMX.js";/* empty css                       */import{j as f,c as X}from"./chunk_client.CotzxIPX.js";import{a as F}from"./chunk_assert.fSVeYhky.js";import{g as P,G as H,a as V,b as W}from"./chunk_Gl.xfPx1g0u.js";import{f as L}from"./chunk_utils.CbQKgZbE.js";import{r as T}from"./chunk_index.C5eOxiyT.js";import"./chunk__commonjsHelpers.Cpj98o6Y.js";const S=P`#version 300 es
    layout(location = 0) in vec2 a_position;
    out vec2 v_uv;
    void main() {
        v_uv = a_position;
        gl_Position = vec4(a_position * 2.0 - 1.0, 0.0, 1.0);
    }
`,z=P`#version 300 es
    precision highp float;
    in vec2 v_uv;
    out vec4 fragColor;
    uniform sampler2D u_source;
    uniform float u_brightness;
    uniform float u_contrast;

    void main() {
        vec4 c = texture(u_source, v_uv);
        float gray = dot(c.rgb, vec3(0.299, 0.587, 0.114));
        float factor = u_contrast >= 0.0 ? 1.0 + u_contrast * 3.0 : 1.0 + u_contrast;
        gray += u_brightness;
        gray = (gray - 0.5) * factor + 0.5;
        gray = clamp(gray, 0.0, 1.0);
        fragColor = vec4(gray, gray, gray, 1.0);
    }
`,$=P`#version 300 es
    precision highp float;
    in vec2 v_uv;
    out vec4 fragColor;
    uniform sampler2D u_source;
    uniform vec2 u_texelSize;
    uniform float u_strength;

    void main() {
        float tl = texture(u_source, v_uv + vec2(-1, -1) * u_texelSize).r;
        float tc = texture(u_source, v_uv + vec2( 0, -1) * u_texelSize).r;
        float tr = texture(u_source, v_uv + vec2( 1, -1) * u_texelSize).r;
        float ml = texture(u_source, v_uv + vec2(-1,  0) * u_texelSize).r;
        float mr = texture(u_source, v_uv + vec2( 1,  0) * u_texelSize).r;
        float bl = texture(u_source, v_uv + vec2(-1,  1) * u_texelSize).r;
        float bc = texture(u_source, v_uv + vec2( 0,  1) * u_texelSize).r;
        float br = texture(u_source, v_uv + vec2( 1,  1) * u_texelSize).r;

        float gx = -tl - 2.0*ml - bl + tr + 2.0*mr + br;
        float gy = -tl - 2.0*tc - tr + bl + 2.0*bc + br;
        float mag = length(vec2(gx, gy)) * u_strength;
        fragColor = vec4(mag, mag, mag, 1.0);
    }
`,M=P`
    float applyDropOff(float t, int fn) {
        if (fn == 0) { // linear
            return max(0.0, 1.0 - t);
        } else if (fn == 1) { // exponential
            return exp(-3.0 * t);
        } else if (fn == 2) { // quadratic
            return max(0.0, 1.0 - t * t);
        } else { // sine
            return t >= 1.0 ? 0.0 : cos(t * 1.5707963);
        }
    }
`,q=P`#version 300 es
    precision highp float;
    in vec2 v_uv;
    out vec4 fragColor;
    uniform sampler2D u_edges;
    uniform float u_threshold;

    void main() {
        float edge = texture(u_edges, v_uv).r;
        if (edge > u_threshold) {
            fragColor = vec4(v_uv, edge, 1.0);
        } else {
            fragColor = vec4(-1.0, -1.0, 0.0, 0.0);
        }
    }
`,Y=P`#version 300 es
    precision highp float;
    in vec2 v_uv;
    out vec4 fragColor;
    uniform sampler2D u_jfa;
    uniform vec2 u_texelSize;
    uniform float u_stepSize;
    uniform vec2 u_resolution;
    uniform float u_radius;
    uniform int u_dropOffFunction;

    ${M}

    float weightedValue(vec4 src) {
        if (src.w < 0.5) return -1.0;
        float pixelDist = distance(v_uv * u_resolution, src.xy * u_resolution);
        float t = pixelDist / u_radius;
        return src.z * applyDropOff(t, u_dropOffFunction);
    }

    void main() {
        vec4 best = texture(u_jfa, v_uv);
        float bestVal = weightedValue(best);

        for (int dy = -1; dy <= 1; dy++) {
            for (int dx = -1; dx <= 1; dx++) {
                if (dx == 0 && dy == 0) continue;
                vec2 sampleUV = v_uv + vec2(float(dx), float(dy)) * u_stepSize * u_texelSize;
                vec4 s = texture(u_jfa, sampleUV);
                float val = weightedValue(s);
                if (val > bestVal) {
                    bestVal = val;
                    best = s;
                }
            }
        }
        fragColor = best;
    }
`,Q=P`#version 300 es
    precision highp float;
    in vec2 v_uv;
    out vec4 fragColor;
    uniform sampler2D u_jfa;
    uniform vec2 u_resolution;
    uniform float u_radius;
    uniform int u_dropOffFunction;

    ${M}

    void main() {
        vec4 jfa = texture(u_jfa, v_uv);
        if (jfa.w < 0.5) {
            fragColor = vec4(0.0, 0.0, 0.0, 1.0);
            return;
        }
        float pixelDist = distance(v_uv * u_resolution, jfa.xy * u_resolution);
        float t = pixelDist / u_radius;
        float val = jfa.z * applyDropOff(t, u_dropOffFunction);
        fragColor = vec4(val, val, val, 1.0);
    }
`,J={linear:0,exponential:1,quadratic:2,sine:3},E=class E{constructor(o){this.canvas=o,this.fbos=[],this.fboTextures=[],this.jfaFbos=[null,null],this.jfaTextures=[null,null],this.currentWidth=0,this.currentHeight=0,this.glCtx=new H(o),this.rawGl=this.glCtx.gl;const e=this.rawGl;e.getExtension("EXT_color_buffer_float"),this.brightnessContrastProg=this.glCtx.createProgram({vertex:S,fragment:z}),this.edgeDetectProg=this.glCtx.createProgram({vertex:S,fragment:$}),this.jfaSeedProg=this.glCtx.createProgram({vertex:S,fragment:q}),this.jfaStepProg=this.glCtx.createProgram({vertex:S,fragment:Y}),this.jfaResolveProg=this.glCtx.createProgram({vertex:S,fragment:Q}),this.displayProg=this.glCtx.createProgram({vertex:S,fragment:P`#version 300 es
                precision highp float;
                in vec2 v_uv;
                out vec4 fragColor;
                uniform sampler2D u_source;
                void main() {
                    fragColor = texture(u_source, v_uv);
                }
            `}),this.quadVao=this.brightnessContrastProg.createAndBindVertexArrayObject({name:"a_position",size:2,type:V.Float}),this.quadVao.bufferData(new Float32Array([0,0,1,0,0,1,1,0,1,1,0,1]),W.StaticDraw),this.sourceTexture=F(e.createTexture(),"Assertion Error: gl.createTexture()");for(let t=0;t<4;t++){const r=F(e.createFramebuffer(),"Assertion Error: gl.createFramebuffer()"),i=F(e.createTexture(),"Assertion Error: gl.createTexture()");this.fbos.push(r),this.fboTextures.push(i)}for(let t=0;t<2;t++)this.jfaFbos[t]=F(e.createFramebuffer(),"Assertion Error: gl.createFramebuffer()"),this.jfaTextures[t]=F(e.createTexture(),"Assertion Error: gl.createTexture()")}setupTexture(o,e,t,r,i,d){const s=this.rawGl;s.bindTexture(s.TEXTURE_2D,o),s.texImage2D(s.TEXTURE_2D,0,r,e,t,0,i,d,null),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MAG_FILTER,s.NEAREST),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}resizeBuffers(o,e){if(o===this.currentWidth&&e===this.currentHeight)return;this.currentWidth=o,this.currentHeight=e;const t=this.rawGl;for(let r=0;r<4;r++)this.setupTexture(this.fboTextures[r],o,e,t.RGBA16F,t.RGBA,t.HALF_FLOAT),t.bindFramebuffer(t.FRAMEBUFFER,this.fbos[r]),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,this.fboTextures[r],0);for(let r=0;r<2;r++)this.setupTexture(this.jfaTextures[r],o,e,t.RGBA32F,t.RGBA,t.FLOAT),t.bindFramebuffer(t.FRAMEBUFFER,this.jfaFbos[r]),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,this.jfaTextures[r],0);t.bindFramebuffer(t.FRAMEBUFFER,null)}drawQuad(o,e){const t=this.rawGl;t.bindFramebuffer(t.FRAMEBUFFER,e),t.viewport(0,0,this.currentWidth,this.currentHeight),o.use(),this.quadVao.bindVao(),t.drawArrays(t.TRIANGLES,0,6)}bindTextureToUnit(o,e){const t=this.rawGl;t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_2D,o)}uploadImage(o,e,t){const r=this.rawGl;this.resizeBuffers(e,t);const i=document.createElement("canvas");i.width=e,i.height=t,i.getContext("2d").drawImage(o,0,0,e,t),r.bindTexture(r.TEXTURE_2D,this.sourceTexture),r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!0),r.texImage2D(r.TEXTURE_2D,0,r.RGBA8,r.RGBA,r.UNSIGNED_BYTE,i),r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!1),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.NEAREST),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE)}runGpuPasses(o){const e=this.rawGl,t=this.currentWidth,r=this.currentHeight;this.bindTextureToUnit(this.sourceTexture,0);const i=this.brightnessContrastProg;e.useProgram(i.program),e.uniform1i(e.getUniformLocation(i.program,"u_source"),0),e.uniform1f(e.getUniformLocation(i.program,"u_brightness"),o.brightness),e.uniform1f(e.getUniformLocation(i.program,"u_contrast"),o.contrast),this.drawQuad(i,this.fbos[E.PASS_PREPROCESSED]),this.bindTextureToUnit(this.fboTextures[E.PASS_PREPROCESSED],0);const d=this.edgeDetectProg;e.useProgram(d.program),e.uniform1i(e.getUniformLocation(d.program,"u_source"),0),e.uniform2f(e.getUniformLocation(d.program,"u_texelSize"),1/t,1/r),e.uniform1f(e.getUniformLocation(d.program,"u_strength"),o.edgeStrength),this.drawQuad(d,this.fbos[E.PASS_EDGES]),this.bindTextureToUnit(this.fboTextures[E.PASS_EDGES],0);const s=this.jfaSeedProg;e.useProgram(s.program),e.uniform1i(e.getUniformLocation(s.program,"u_edges"),0),e.uniform1f(e.getUniformLocation(s.program,"u_threshold"),.05),this.drawQuad(s,this.jfaFbos[0]);const x=Math.max(t,r);let p=Math.pow(2,Math.ceil(Math.log2(x))-1),l=0;const n=J[o.dropOffFunction];for(;p>=1;){const b=1-l;this.bindTextureToUnit(this.jfaTextures[l],0);const g=this.jfaStepProg;e.useProgram(g.program),e.uniform1i(e.getUniformLocation(g.program,"u_jfa"),0),e.uniform2f(e.getUniformLocation(g.program,"u_texelSize"),1/t,1/r),e.uniform1f(e.getUniformLocation(g.program,"u_stepSize"),p),e.uniform2f(e.getUniformLocation(g.program,"u_resolution"),t,r),e.uniform1f(e.getUniformLocation(g.program,"u_radius"),o.radius),e.uniform1i(e.getUniformLocation(g.program,"u_dropOffFunction"),n),this.drawQuad(g,this.jfaFbos[b]),l=b,p=Math.floor(p/2)}this.bindTextureToUnit(this.jfaTextures[l],0);const u=this.jfaResolveProg;e.useProgram(u.program),e.uniform1i(e.getUniformLocation(u.program,"u_jfa"),0),e.uniform2f(e.getUniformLocation(u.program,"u_resolution"),t,r),e.uniform1f(e.getUniformLocation(u.program,"u_radius"),o.radius),e.uniform1i(e.getUniformLocation(u.program,"u_dropOffFunction"),n),this.drawQuad(u,this.fbos[E.PASS_CONTRAST_MAP])}readPassPixels(o){const e=this.rawGl,t=this.currentWidth,r=this.currentHeight;e.bindFramebuffer(e.FRAMEBUFFER,this.fbos[o]);const i=new Float32Array(t*r*4);e.readPixels(0,0,t,r,e.RGBA,e.FLOAT,i);const d=new Float32Array(t*r);for(let s=0;s<t*r;s++)d[s]=i[s*4];return d}uploadBinaryToPass(o,e){const t=this.rawGl,r=this.currentWidth,i=this.currentHeight,d=new Float32Array(r*i*4);for(let s=0;s<r*i;s++){const x=e[s]/255;d[s*4]=x,d[s*4+1]=x,d[s*4+2]=x,d[s*4+3]=1}t.bindTexture(t.TEXTURE_2D,this.fboTextures[o]),t.texSubImage2D(t.TEXTURE_2D,0,0,0,r,i,t.RGBA,t.FLOAT,d)}get width(){return this.currentWidth}get height(){return this.currentHeight}displayPass(o){const e=this.rawGl;(this.canvas.width!==this.currentWidth||this.canvas.height!==this.currentHeight)&&(this.canvas.width=this.currentWidth,this.canvas.height=this.currentHeight);let t;switch(o){case"original":t=this.sourceTexture;break;case"preprocessed":t=this.fboTextures[E.PASS_PREPROCESSED];break;case"edges":t=this.fboTextures[E.PASS_EDGES];break;case"contrastMap":t=this.fboTextures[E.PASS_CONTRAST_MAP];break;case"dithered":t=this.fboTextures[E.PASS_DITHERED];break}this.bindTextureToUnit(t,0);const r=this.displayProg;e.useProgram(r.program),e.uniform1i(e.getUniformLocation(r.program,"u_source"),0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,this.currentWidth,this.currentHeight),r.use(),this.quadVao.bindVao(),e.drawArrays(e.TRIANGLES,0,6)}destroy(){const o=this.rawGl;for(const e of this.fbos)o.deleteFramebuffer(e);for(const e of this.fboTextures)o.deleteTexture(e);for(const e of this.jfaFbos)o.deleteFramebuffer(e);for(const e of this.jfaTextures)o.deleteTexture(e);o.deleteTexture(this.sourceTexture),this.glCtx.destroy()}};E.PASS_PREPROCESSED=0,E.PASS_EDGES=1,E.PASS_CONTRAST_MAP=2,E.PASS_DITHERED=3;let y=E;const K={scale:1,brightness:0,contrast:0,edgeStrength:1,radius:50,dropOffFunction:"exponential",ditherPattern:"floyd-steinberg",maxDitherLevels:5,contrastRangeLow:.1,contrastRangeHigh:.8,preserveBlocks:!1},Z=[0,48,12,60,3,51,15,63,32,16,44,28,35,19,47,31,8,56,4,52,11,59,7,55,40,24,36,20,43,27,39,23,2,50,14,62,1,49,13,61,34,18,46,30,33,17,45,29,10,58,6,54,9,57,5,53,42,26,38,22,41,25,37,21],ee=Z.map(h=>(h+.5)/64);function te(h,o,e){let t=e*374761393+h*668265263+o*2147483647|0;return t=Math.imul(t^t>>>13,1274126177),t=t^t>>>16,(t&2147483647)/2147483647}function re(h,o,e,t,r){const i=Math.ceil(o/t),d=Math.ceil(e/t),s=new Float32Array(i*d);for(let l=0;l<d;l++)for(let n=0;n<i;n++){let u=0,b=0;for(let g=0;g<t;g++)for(let c=0;c<t;c++){const _=n*t+c,a=l*t+g;_<o&&a<e&&(u+=h[a*o+_],b++)}s[l*i+n]=u/b}const x=new Float32Array(s);if(r==="floyd-steinberg")for(let l=0;l<d;l++)for(let n=0;n<i;n++){const u=l*i+n,b=x[u],g=b>=.5?1:0;x[u]=g;const c=b-g;n+1<i&&(x[u+1]+=c*7/16),l+1<d&&(n-1>=0&&(x[(l+1)*i+(n-1)]+=c*3/16),x[(l+1)*i+n]+=c*5/16,n+1<i&&(x[(l+1)*i+(n+1)]+=c*1/16))}else if(r==="atkinson")for(let l=0;l<d;l++)for(let n=0;n<i;n++){const u=l*i+n,b=x[u],g=b>=.5?1:0;x[u]=g;const c=(b-g)/8;n+1<i&&(x[u+1]+=c),n+2<i&&(x[u+2]+=c),l+1<d&&(n-1>=0&&(x[(l+1)*i+(n-1)]+=c),x[(l+1)*i+n]+=c,n+1<i&&(x[(l+1)*i+(n+1)]+=c)),l+2<d&&(x[(l+2)*i+n]+=c)}else if(r==="ordered")for(let l=0;l<d;l++)for(let n=0;n<i;n++){const u=ee[(l&7)*8+(n&7)];x[l*i+n]=s[l*i+n]>u?1:0}else{const l=t*31337;for(let n=0;n<d;n++)for(let u=0;u<i;u++){const b=te(u,n,l);x[n*i+u]=s[n*i+u]>b?1:0}}const p=new Uint8Array(o*e);for(let l=0;l<e;l++)for(let n=0;n<o;n++){const u=Math.floor(n/t),b=Math.floor(l/t);p[l*o+n]=x[b*i+u]>=.5?255:0}return p}function C(h,o,e,t){let r;return h>=e?r=0:h<=o?r=1:r=1-(h-o)/(e-o),Math.min(Math.round(r*(t-1)),t-1)}function oe(h,o,e,t,r){const i=new Uint8Array(h[r-1]);for(let d=r-2;d>=0;d--){const s=1<<d,x=Math.ceil(e/s),p=Math.ceil(t/s);for(let l=0;l<p;l++)for(let n=0;n<x;n++){const u=n*s,b=l*s,g=Math.min(u+s,e),c=Math.min(b+s,t);let _=!1;for(let a=b;a<c&&!_;a++)for(let m=u;m<g&&!_;m++)o[a*e+m]<=d&&(_=!0);if(_){const a=h[d];for(let m=b;m<c;m++)for(let v=u;v<g;v++){const R=m*e+v;i[R]=a[R]}}}}return i}async function D(h){return performance.now()-h>10?(await L(),performance.now()):h}async function se(h,o,e,t,r,i,d,s,x,{signal:p,onProgress:l}){const n=[];for(let c=0;c<r;c++){if(p.aborted)throw new DOMException("Aborted","AbortError");const _=1<<c;n.push(re(h,e,t,_,s)),l((c+1)/r*.5),await L()}const u=e*t;if(x){const c=new Uint8Array(u);let _=performance.now();for(let m=0;m<u;m++)if(c[m]=C(o[m],i,d,r),m%5e4===0){if(p.aborted)throw new DOMException("Aborted","AbortError");l(.5+m/u*.25),_=await D(_)}const a=oe(n,c,e,t,r);return l(1),a}const b=new Uint8Array(u);let g=performance.now();for(let c=0;c<u;c++){const _=C(o[c],i,d,r);if(b[c]=n[_][c],c%5e4===0){if(p.aborted)throw new DOMException("Aborted","AbortError");l(.5+c/u*.5),g=await D(g)}}return l(1),b}const N={original:"Original",preprocessed:"1. Preprocessed",edges:"2. Edge Detection",contrastMap:"3. Contrast Map",dithered:"4. Adaptive Dither"},ne=new Set(["original","preprocessed","edges","contrastMap"]),ae=["linear","exponential","quadratic","sine"],ie=["floyd-steinberg","atkinson","ordered","noise"];function le(){const[h,o]=T.useState(null),[e,t]=T.useState(K),[r,i]=T.useState("dithered"),[d,s]=T.useState(null),x=T.useRef(null),p=T.useRef(null),l=T.useRef(null),n=T.useRef(null),u=T.useRef(null),b=h?Math.round(h.naturalWidth*e.scale):0,g=h?Math.round(h.naturalHeight*e.scale):0,c=T.useCallback((a,m)=>{t(v=>({...v,[a]:m}))},[]),_=T.useCallback(a=>{var R;const m=(R=a.target.files)==null?void 0:R[0];if(!m)return;const v=new Image;v.onload=()=>{const U=Math.max(v.naturalWidth,v.naturalHeight);U>1e3&&c("scale",1e3/U),o(v),URL.revokeObjectURL(v.src)},v.src=URL.createObjectURL(m)},[c]);return T.useEffect(()=>{var v;const a=x.current;if(!a||!h||b===0||g===0)return;l.current??(l.current=new y(a));const m=l.current;return m.uploadImage(h,b,g),m.runGpuPasses(e),ne.has(r)&&m.displayPass(r),(v=n.current)==null||v.abort(),n.current=null,s(null),u.current!==null&&clearTimeout(u.current),u.current=setTimeout(()=>{u.current=null;const R=new AbortController;n.current=R,(async()=>{const O=m.width,G=m.height;try{s(0);const j=m.readPassPixels(y.PASS_PREPROCESSED),B=m.readPassPixels(y.PASS_CONTRAST_MAP),I=await se(j,B,O,G,e.maxDitherLevels,e.contrastRangeLow,e.contrastRangeHigh,e.ditherPattern,e.preserveBlocks,{signal:R.signal,onProgress:k=>s(k)});m.uploadBinaryToPass(y.PASS_DITHERED,I),r==="dithered"&&m.displayPass("dithered"),s(null)}catch(j){if(j instanceof DOMException&&j.name==="AbortError")s(null);else throw j}})()},150),()=>{var R;(R=n.current)==null||R.abort(),n.current=null,u.current!==null&&(clearTimeout(u.current),u.current=null)}},[h,b,g,e,r]),T.useEffect(()=>()=>{var a;(a=l.current)==null||a.destroy(),l.current=null},[]),f.jsxs("div",{className:"flex h-full",children:[f.jsxs("div",{className:"flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden bg-stone-200 p-4",children:[!h&&f.jsxs("div",{className:"flex flex-col items-center gap-4",children:[f.jsx("p",{className:"text-lg text-stone-500",children:"Upload an image to get started"}),f.jsx("button",{className:"rounded bg-stone-700 px-5 py-3 font-bold tracking-wide text-stone-100 transition-transform ease-out-back hover:scale-110 active:scale-95",onClick:()=>{var a;return(a=p.current)==null?void 0:a.click()},children:"Choose Image"})]}),f.jsxs("div",{className:h?"relative flex min-h-0 flex-1 flex-col items-center justify-center gap-2":"hidden",children:[f.jsx("canvas",{ref:x,className:"max-h-full max-w-full border border-stone-300",style:{imageRendering:"pixelated"}}),d!==null&&f.jsx("div",{className:"absolute bottom-8 left-0 right-0 mx-auto h-1 w-3/4 overflow-hidden rounded-full bg-stone-300",children:f.jsx("div",{className:"h-full bg-stone-600 transition-[width] duration-100",style:{width:`${Math.round(d*100)}%`}})}),f.jsxs("p",{className:"shrink-0 text-xs text-stone-400",children:[b," x ",g,"px",d!==null?" — Processing...":" — GPU + CPU hybrid"]})]}),f.jsx("input",{ref:p,type:"file",accept:"image/*",className:"hidden",onChange:_})]}),f.jsxs("div",{className:"flex w-80 shrink-0 flex-col overflow-y-auto border-l border-stone-300 bg-stone-50 p-4",children:[f.jsx("h1",{className:"mb-4 text-lg font-bold tracking-wide",children:"Adaptive Dither"}),h&&f.jsx("button",{className:"mb-4 rounded bg-stone-200 px-3 py-1.5 text-sm font-bold tracking-wide text-stone-600 transition-transform ease-out-back hover:scale-105 active:scale-95",onClick:()=>{var a;return(a=p.current)==null?void 0:a.click()},children:"Change Image"}),f.jsx(w,{title:"View Pass",children:f.jsx("div",{className:"flex flex-wrap gap-1",children:Object.keys(N).map(a=>f.jsx("button",{className:`rounded px-2 py-1 text-xs font-bold tracking-wide transition-colors ${r===a?"bg-stone-700 text-stone-100":"bg-stone-200 text-stone-500 hover:bg-stone-300"}`,onClick:()=>i(a),children:N[a]},a))})}),f.jsxs(w,{title:"1. Preprocessing",children:[f.jsx(A,{label:"Scale",value:e.scale,min:.05,max:2,step:.05,onChange:a=>c("scale",a),suffix:h?` (${b}x${g})`:void 0}),f.jsx(A,{label:"Brightness",value:e.brightness,min:-1,max:1,step:.01,onChange:a=>c("brightness",a)}),f.jsx(A,{label:"Contrast",value:e.contrast,min:-1,max:1,step:.01,onChange:a=>c("contrast",a)})]}),f.jsx(w,{title:"2. Edge Detection",children:f.jsx(A,{label:"Edge Strength",value:e.edgeStrength,min:.1,max:5,step:.1,onChange:a=>c("edgeStrength",a)})}),f.jsxs(w,{title:"3. Contrast Map",children:[f.jsx(A,{label:"Radius",value:e.radius,min:1,max:200,step:1,onChange:a=>c("radius",a)}),f.jsxs("div",{className:"mb-2",children:[f.jsx("label",{className:"mb-1 block text-xs font-bold text-stone-500",children:"Drop-off Function"}),f.jsx("div",{className:"flex gap-1",children:ae.map(a=>f.jsx("button",{className:`rounded px-2 py-1 text-xs font-bold tracking-wide transition-colors ${e.dropOffFunction===a?"bg-stone-700 text-stone-100":"bg-stone-200 text-stone-500 hover:bg-stone-300"}`,onClick:()=>c("dropOffFunction",a),children:a},a))})]})]}),f.jsxs(w,{title:"4. Adaptive Dithering",children:[f.jsxs("div",{className:"mb-2",children:[f.jsx("label",{className:"mb-1 block text-xs font-bold text-stone-500",children:"Pattern"}),f.jsx("div",{className:"flex flex-wrap gap-1",children:ie.map(a=>f.jsx("button",{className:`rounded px-2 py-1 text-xs font-bold tracking-wide transition-colors ${e.ditherPattern===a?"bg-stone-700 text-stone-100":"bg-stone-200 text-stone-500 hover:bg-stone-300"}`,onClick:()=>c("ditherPattern",a),children:a},a))})]}),f.jsx(A,{label:"Resolution Levels",value:e.maxDitherLevels,min:1,max:7,step:1,onChange:a=>c("maxDitherLevels",a)}),f.jsx(A,{label:"Contrast Range Low",value:e.contrastRangeLow,min:0,max:1,step:.01,onChange:a=>c("contrastRangeLow",a)}),f.jsx(A,{label:"Contrast Range High",value:e.contrastRangeHigh,min:0,max:1,step:.01,onChange:a=>c("contrastRangeHigh",a)}),f.jsxs("label",{className:"flex cursor-pointer items-center gap-2 text-xs font-bold text-stone-500",children:[f.jsx("input",{type:"checkbox",checked:e.preserveBlocks,onChange:a=>c("preserveBlocks",a.target.checked),className:"accent-stone-600"}),"Preserve Blocks"]})]})]})]})}function w({title:h,children:o}){return f.jsxs("div",{className:"mb-4 border-b border-stone-200 pb-4",children:[f.jsx("h2",{className:"mb-2 text-sm font-bold tracking-wide text-stone-600",children:h}),o]})}function A({label:h,value:o,min:e,max:t,step:r,onChange:i,suffix:d}){return f.jsxs("div",{className:"mb-2",children:[f.jsxs("div",{className:"mb-0.5 flex items-baseline justify-between",children:[f.jsx("label",{className:"text-xs font-bold text-stone-500",children:h}),f.jsxs("span",{className:"text-xs text-stone-400",children:[Number.isInteger(r)?o:o.toFixed(r<.01?3:2),d]})]}),f.jsx("input",{type:"range",min:e,max:t,step:r,value:o,onChange:s=>i(parseFloat(s.target.value)),className:"w-full accent-stone-600"})]})}X(F(document.getElementById("root"),'Assertion Error: document.getElementById("root")')).render(f.jsx(le,{}));
