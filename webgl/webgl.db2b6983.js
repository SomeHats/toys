import{a as c,t as A,r as i}from"../chunks/chunk_assert.5a48dca8.js";import{A as _}from"../chunks/chunk_AABB.d3b40072.js";import{V as l}from"../chunks/chunk_Vector2.a2532df9.js";var R=`attribute vec2 a_position;
attribute vec4 a_color;

varying vec4 v_color;

uniform vec2 u_resolution;

void main() {
  
  vec2 zeroToOne = a_position / u_resolution;
 
  
  vec2 zeroToTwo = zeroToOne * 2.0;
 
  
  vec2 clipSpace = zeroToTwo - 1.0;
 
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

  
  
  
  v_color = a_color;
}`,p=`precision mediump float;
 
uniform vec4 u_color;
varying vec4 v_color;

void main() {
  gl_FragColor = v_color;
}`;const r=document.createElement("canvas");r.width=document.body.clientWidth*window.devicePixelRatio;r.height=document.body.clientHeight*window.devicePixelRatio;r.style.width=`${document.body.clientWidth}px`;r.style.height=`${document.body.clientHeight}px`;document.body.appendChild(r);const e=r.getContext("webgl");c(e);var d=(o=>(o[o.Fragment=WebGLRenderingContext.FRAGMENT_SHADER]="Fragment",o[o.Vertex=WebGLRenderingContext.VERTEX_SHADER]="Vertex",o))(d||{});function f(o,a,t){const n=o.createShader(a);if(c(n),o.shaderSource(n,t),o.compileShader(n),!o.getShaderParameter(n,o.COMPILE_STATUS))throw console.log(o.getShaderInfoLog(n)),o.deleteShader(n),new Error("compile error");return n}function b(o,a,t){const n=o.createProgram();if(c(n),o.attachShader(n,a),o.attachShader(n,t),o.linkProgram(n),!o.getProgramParameter(n,o.LINK_STATUS))throw console.log(o.getProgramInfoLog(n)),o.deleteProgram(n),"link error";return n}const w=f(e,d.Vertex,R),S=f(e,d.Fragment,p),s=b(e,w,S),h=e.getAttribLocation(s,"a_position");e.getAttribLocation(s,"a_color");const F=e.getUniformLocation(s,"u_resolution"),m=e.createBuffer();c(m);const T=[10,20,80,20,10,30,10,30,80,20,80,30];e.bindBuffer(e.ARRAY_BUFFER,m);e.bufferData(e.ARRAY_BUFFER,new Float32Array(T),e.STATIC_DRAW);e.viewport(0,0,r.width,r.height);e.clearColor(0,0,0,0);e.clear(e.COLOR_BUFFER_BIT);e.useProgram(s);e.uniform2f(F,e.canvas.width,e.canvas.height);e.enableVertexAttribArray(h);e.bindBuffer(e.ARRAY_BUFFER,m);e.vertexAttribPointer(h,2,e.FLOAT,!1,0,0);const u=100,v=new Float32Array(u*12);function x(o,a,t){v.set([t.left,t.top,t.right,t.top,t.left,t.bottom,t.left,t.bottom,t.right,t.top,t.right,t.bottom],a*12)}A(u,o=>{const a=new _(new l(i(e.canvas.width),i(e.canvas.height)),new l(i(200),i(200)));x(e,o,a)});e.bufferData(e.ARRAY_BUFFER,v,e.STATIC_DRAW);e.drawArrays(e.TRIANGLES,0,u*6);
