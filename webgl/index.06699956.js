!function(){function e(e){return e&&e.__esModule?e.default:e}var o="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},t={},r={},n=o.parcelRequire0561;function i(e,o){e||function(e){throw new Error(e)}(o||"Assertion Error")}null==n&&((n=function(e){if(e in t)return t[e].exports;if(e in r){var o=r[e];delete r[e];var n={id:e,exports:{}};return t[e]=n,o.call(n.exports,n,n.exports),n.exports}var i=new Error("Cannot find module '"+e+"'");throw i.code="MODULE_NOT_FOUND",i}).register=function(e,o){r[e]=o},o.parcelRequire0561=n);var a=n("7B1qO"),c=n("8pNpe"),l=n("54lVR"),d=document.createElement("canvas");d.width=document.body.clientWidth*window.devicePixelRatio,d.height=document.body.clientHeight*window.devicePixelRatio,d.style.width="".concat(document.body.clientWidth,"px"),d.style.height="".concat(document.body.clientHeight,"px"),document.body.appendChild(d);var f,u,g=d.getContext("webgl");function s(e,o,t){var r=e.createShader(o);if(i(r),e.shaderSource(r,t),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS))throw console.log(e.getShaderInfoLog(r)),e.deleteShader(r),new Error("compile error");return r}i(g),(u=f||(f={}))[u.Fragment=WebGLRenderingContext.FRAGMENT_SHADER]="Fragment",u[u.Vertex=WebGLRenderingContext.VERTEX_SHADER]="Vertex";var m=s(g,f.Vertex,e("#define GLSLIFY 1\n// an attribute will receive data from a buffer\nattribute vec2 a_position;\nattribute vec4 a_color;\n\nvarying vec4 v_color;\n\nuniform vec2 u_resolution;\n\n// all shaders have a main function\nvoid main() {\n  // convert the position from pixels to 0.0 to 1.0\n  vec2 zeroToOne = a_position / u_resolution;\n \n  // convert from 0->1 to 0->2\n  vec2 zeroToTwo = zeroToOne * 2.0;\n \n  // convert from 0->2 to -1->+1 (clip space)\n  vec2 clipSpace = zeroToTwo - 1.0;\n \n  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);\n\n  // Convert from clip space to color space.\n  // Clip space goes -1.0 to +1.0\n  // Color space goes from 0.0 to 1.0\n  v_color = a_color;\n}")),v=s(g,f.Fragment,e("precision mediump float;\n#define GLSLIFY 1\n \nuniform vec4 u_color;\nvarying vec4 v_color;\n\nvoid main() {\n  gl_FragColor = v_color;\n}")),h=function(e,o,t){var r=e.createProgram();if(i(r),e.attachShader(r,o),e.attachShader(r,t),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS))throw console.log(e.getProgramInfoLog(r)),e.deleteProgram(r),"link error";return r}(g,m,v),p=g.getAttribLocation(h,"a_position"),_=(g.getAttribLocation(h,"a_color"),g.getUniformLocation(h,"u_resolution")),w=g.createBuffer();i(w);g.bindBuffer(g.ARRAY_BUFFER,w),g.bufferData(g.ARRAY_BUFFER,new Float32Array([10,20,80,20,10,30,10,30,80,20,80,30]),g.STATIC_DRAW),g.viewport(0,0,d.width,d.height),g.clearColor(0,0,0,0),g.clear(g.COLOR_BUFFER_BIT),g.useProgram(h),g.uniform2f(_,g.canvas.width,g.canvas.height),g.enableVertexAttribArray(p),g.bindBuffer(g.ARRAY_BUFFER,w),g.vertexAttribPointer(p,2,g.FLOAT,!1,0,0);var b=new Float32Array(1200);c.times(100,(function(e){!function(e,o,t){b.set([t.left,t.top,t.right,t.top,t.left,t.bottom,t.left,t.bottom,t.right,t.top,t.right,t.bottom],12*o)}(0,e,new a.default(new l.default(c.random(g.canvas.width),c.random(g.canvas.height)),new l.default(c.random(200),c.random(200))))})),g.bufferData(g.ARRAY_BUFFER,b,g.STATIC_DRAW),g.drawArrays(g.TRIANGLES,0,600)}();
//# sourceMappingURL=index.06699956.js.map
