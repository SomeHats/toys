parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"vkvk":[function(require,module,exports) {
"use strict";function r(r,e){if(!r)throw new Error(e||"Assertion Error")}Object.defineProperty(exports,"__esModule",{value:!0}),exports.assert=void 0,exports.assert=r;
},{}],"CAdB":[function(require,module,exports) {
module.exports="#define GLSLIFY 1\n// an attribute will receive data from a buffer\nattribute vec2 a_position;\nattribute vec4 a_color;\n\nvarying vec4 v_color;\n\nuniform vec2 u_resolution;\n\n// all shaders have a main function\nvoid main() {\n  // convert the position from pixels to 0.0 to 1.0\n  vec2 zeroToOne = a_position / u_resolution;\n \n  // convert from 0->1 to 0->2\n  vec2 zeroToTwo = zeroToOne * 2.0;\n \n  // convert from 0->2 to -1->+1 (clip space)\n  vec2 clipSpace = zeroToTwo - 1.0;\n \n  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);\n\n  // Convert from clip space to color space.\n  // Clip space goes -1.0 to +1.0\n  // Color space goes from 0.0 to 1.0\n  v_color = a_color;\n}";
},{}],"hWS3":[function(require,module,exports) {
module.exports="precision mediump float;\n#define GLSLIFY 1\n \nuniform vec4 u_color;\nvarying vec4 v_color;\n\nvoid main() {\n  gl_FragColor = v_color;\n}";
},{}],"N6d1":[function(require,module,exports) {
"use strict";var r=this&&this.__awaiter||function(r,t,e,n){return new(e||(e=Promise))(function(o,a){function i(r){try{s(n.next(r))}catch(t){a(t)}}function u(r){try{s(n.throw(r))}catch(t){a(t)}}function s(r){var t;r.done?o(r.value):(t=r.value,t instanceof e?t:new e(function(r){r(t)})).then(i,u)}s((n=n.apply(r,t||[])).next())})},t=this&&this.__generator||function(r,t){var e,n,o,a,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function u(a){return function(u){return function(a){if(e)throw new TypeError("Generator is already executing.");for(;i;)try{if(e=1,n&&(o=2&a[0]?n.return:a[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,a[1])).done)return o;switch(n=0,o&&(a=[2&a[0],o.value]),a[0]){case 0:case 1:o=a;break;case 4:return i.label++,{value:a[1],done:!1};case 5:i.label++,n=a[1],a=[0];continue;case 7:a=i.ops.pop(),i.trys.pop();continue;default:if(!(o=(o=i.trys).length>0&&o[o.length-1])&&(6===a[0]||2===a[0])){i=0;continue}if(3===a[0]&&(!o||a[1]>o[0]&&a[1]<o[3])){i.label=a[1];break}if(6===a[0]&&i.label<o[1]){i.label=o[1],o=a;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(a);break}o[2]&&i.ops.pop(),i.trys.pop();continue}a=t.call(r,i)}catch(u){a=[6,u],n=0}finally{e=o=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,u])}}},e=this&&this.__values||function(r){var t="function"==typeof Symbol&&Symbol.iterator,e=t&&r[t],n=0;if(e)return e.call(r);if(r&&"number"==typeof r.length)return{next:function(){return r&&n>=r.length&&(r=void 0),{value:r&&r[n++],done:!r}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},n=this&&this.__read||function(r,t){var e="function"==typeof Symbol&&r[Symbol.iterator];if(!e)return r;var n,o,a=e.call(r),i=[];try{for(;(void 0===t||t-- >0)&&!(n=a.next()).done;)i.push(n.value)}catch(u){o={error:u}}finally{try{n&&!n.done&&(e=a.return)&&e.call(a)}finally{if(o)throw o.error}}return i},o=this&&this.__spread||function(){for(var r=[],t=0;t<arguments.length;t++)r=r.concat(n(arguments[t]));return r};function a(r,t){for(var e=[],n=0;n<r;n++)e.push(t(n));return e}function i(r,t,e){return(t-r)*e+r}function u(r,t,e){return(e-r)/(t-r)}function s(r,t,e){return Math.min(t,Math.max(r,e))}function l(r,t,e){var n=t-r;for(e-=r;e<0;)e+=n;return r+(e%=n)}function c(r,t,e,n,o){return i(e,n,u(r,t,o))}function f(r,t){return"number"==typeof t?i(r,t,Math.random()):i(0,r,Math.random())}function p(r,t){return Math.floor(f(r,t))}function x(r,t){return f(r-t,r+t)}function h(r,t){return x(r,r*t)}function v(r){return r[Math.floor(f(r.length))]}function y(r){return r.reduce(function(r,t){return r.concat(t)},[])}function m(r){return Array.from(new Set(r))}function d(r,t){var n,o,a=new Set(r),i=new Set;try{for(var u=e(t),s=u.next();!s.done;s=u.next()){var l=s.value;a.has(l)&&i.add(l)}}catch(c){n={error:c}}finally{try{s&&!s.done&&(o=u.return)&&o.call(u)}finally{if(n)throw n.error}}return Array.from(i)}function g(r,t){var n,o,a=new Map;try{for(var i=e(r),u=i.next();!u.done;u=i.next()){var s=u.value,l=t(s),c=a.get(l);c?c.push(s):a.set(l,[s])}}catch(f){n={error:f}}finally{try{u&&!u.done&&(o=i.return)&&o.call(i)}finally{if(n)throw n.error}}return a}function w(r,t){return r.slice().sort(function(r,e){return t(r)<t(e)?-1:1})}function b(r,t){var n,o,a=[],i=[];try{for(var u=e(r),s=u.next();!s.done;s=u.next()){var l=s.value;t(l)?a.push(l):i.push(l)}}catch(c){n={error:c}}finally{try{s&&!s.done&&(o=u.return)&&o.call(u)}finally{if(n)throw n.error}}return[a,i]}function S(){return"rgb("+Math.floor(f(256))+","+Math.floor(f(256))+","+Math.floor(f(256))+")"}function M(r,t){var e=r.indexOf(t);-1!==e&&r.splice(e,1)}function I(){return new Promise(function(r){window.requestAnimationFrame(function(t){return r(t)})})}function _(r){return new Promise(function(t){return setTimeout(function(){return t()},r)})}function A(e){return r(this,void 0,void 0,function(){var r,n,o;return t(this,function(t){switch(t.label){case 0:r=!1,n=function(){r=!0},t.label=1;case 1:return o=e,[4,I()];case 2:return o.apply(void 0,[t.sent(),n]),r?[2]:[3,1];case 3:return[2]}})})}function L(r){var t,o,a={};try{for(var i=e(r),u=i.next();!u.done;u=i.next()){var s=n(u.value,2),l=s[0],c=s[1];a[l]=c}}catch(f){t={error:f}}finally{try{u&&!u.done&&(o=i.return)&&o.call(i)}finally{if(t)throw t.error}}return a}function P(r){return r.filter(function(r){return null!=r})}function O(r){return l(-Math.PI,Math.PI,r)}function T(r,t,e){return Math.max(r,Math.min(t,e))}function k(r){for(var t,e=r.slice(),o=e.length-1;o>0;o--){var a=Math.floor(Math.random()*(o+1));t=n([e[a],e[o]],2),e[o]=t[0],e[a]=t[1]}return e}function B(r){return void 0===r&&(r=""),""+r+Math.random().toString(36).slice(1)}function E(r,t){void 0===t&&(t=null);try{var e=window.localStorage.getItem(r);return e?JSON.parse(e):t}catch(n){return console.log(n),t}}function R(r,t){var e=JSON.stringify(t);try{window.localStorage.setItem(r,e)}catch(n){console.log(n)}}function q(r,t){var e;return function(){for(var n=[],a=0;a<arguments.length;a++)n[a]=arguments[a];void 0!==e&&clearTimeout(e),e=setTimeout(function(){return t.apply(void 0,o(n))},r)}}Object.defineProperty(exports,"__esModule",{value:!0}),exports.debounce=exports.setLocalStorageItem=exports.getLocalStorageItem=exports.getId=exports.shuffle=exports.clamp=exports.normalizeAngle=exports.compact=exports.fromEntries=exports.frameLoop=exports.wait=exports.frame=exports.removeFromArray=exports.randomColor=exports.partition=exports.sortBy=exports.groupBy=exports.intersection=exports.uniq=exports.flatten=exports.sample=exports.varyRelative=exports.varyAbsolute=exports.randomInt=exports.random=exports.mapRange=exports.constrainWrapped=exports.constrain=exports.invLerp=exports.lerp=exports.times=void 0,exports.times=a,exports.lerp=i,exports.invLerp=u,exports.constrain=s,exports.constrainWrapped=l,exports.mapRange=c,exports.random=f,exports.randomInt=p,exports.varyAbsolute=x,exports.varyRelative=h,exports.sample=v,exports.flatten=y,exports.uniq=m,exports.intersection=d,exports.groupBy=g,exports.sortBy=w,exports.partition=b,exports.randomColor=S,exports.removeFromArray=M,exports.frame=I,exports.wait=_,exports.frameLoop=A,exports.fromEntries=L,exports.compact=P,exports.normalizeAngle=O,exports.clamp=T,exports.shuffle=k,exports.getId=B,exports.getLocalStorageItem=E,exports.setLocalStorageItem=R,exports.debounce=q;
},{}],"qFdD":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var t=require("../utils"),e=function(){function e(t,e){this.x=t,this.y=e}return e.fromPolar=function(t,n){return new e(n*Math.cos(t),n*Math.sin(t))},e.average=function(t){return t.reduce(function(t,e){return t.add(e)},e.ZERO).div(t.length)},e.prototype.toString=function(){return"Vector2("+this.x+", "+this.y+")"},Object.defineProperty(e.prototype,"magnitudeSquared",{get:function(){return this.x*this.x+this.y*this.y},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"magnitude",{get:function(){return Math.sqrt(this.magnitudeSquared)},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"angle",{get:function(){return Math.atan2(this.y,this.x)},enumerable:!1,configurable:!0}),e.prototype.isInPolygon=function(t){for(var e=this.x,n=this.y,r=!1,o=0,i=t.length-1;o<t.length;i=o++){var u=t[o],h=u.x,s=u.y,a=t[i],y=a.x,p=a.y;s>n!=p>n&&e<(y-h)*(n-s)/(p-s)+h&&(r=!r)}return r},e.prototype.equals=function(t){return this===t||this.x===t.x&&this.y===t.y},e.prototype.distanceTo=function(t){var e=t.x,n=t.y,r=e-this.x,o=n-this.y;return Math.sqrt(r*r+o*o)},e.prototype.angleTo=function(t){return t.sub(this).angle},e.prototype.angleBetween=function(e){return t.normalizeAngle(Math.atan2(e.y,e.x)-Math.atan2(this.y,this.x))},e.prototype.dot=function(t){return this.x*t.x+this.y*t.y},e.prototype.div=function(t){return new e(this.x/t,this.y/t)},e.prototype.scale=function(t){return new e(this.x*t,this.y*t)},e.prototype.negate=function(){return this.scale(-1)},e.prototype.add=function(t){var n=t.x,r=t.y;return new e(this.x+n,this.y+r)},e.prototype.sub=function(t){var n=t.x,r=t.y;return new e(this.x-n,this.y-r)},e.prototype.floor=function(){return new e(Math.floor(this.x),Math.floor(this.y))},e.prototype.ceil=function(){return new e(Math.ceil(this.x),Math.ceil(this.y))},e.prototype.round=function(){return new e(Math.round(this.x),Math.round(this.y))},e.prototype.withMagnitude=function(t){return e.fromPolar(this.angle,t)},e.prototype.withAngle=function(t){return e.fromPolar(t,this.magnitude)},e.prototype.rotate=function(t){return this.withAngle(this.angle+t)},e.prototype.lerp=function(n,r){return new e(t.lerp(this.x,n.x,r),t.lerp(this.y,n.y,r))},e.ZERO=new e(0,0),e}();exports.default=e;
},{"../utils":"N6d1"}],"ngoU":[function(require,module,exports) {
"use strict";var t=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(exports,"__esModule",{value:!0});var e=t(require("./Vector2")),r=function(){function t(t,e){this.origin=t,this.size=e,Object.freeze(this)}return t.fromLeftTopRightBottom=function(r,i,o,n){return new t(new e.default(r,i),new e.default(o-r,n-i))},t.prototype.contains=function(t){var e=t.x,r=t.y;return this.left<=e&&e<=this.right&&this.top<=r&&r<=this.bottom},t.prototype.intersects=function(t){return!(this.right<t.left||this.left>t.right||this.bottom<t.top||this.top>t.bottom)},t.prototype.getCenter=function(){return this.origin.add(this.size.scale(.5))},Object.defineProperty(t.prototype,"left",{get:function(){return this.origin.x},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"right",{get:function(){return this.origin.x+this.size.x},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"top",{get:function(){return this.origin.y},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"bottom",{get:function(){return this.origin.y+this.size.y},enumerable:!1,configurable:!0}),t}();exports.default=r;
},{"./Vector2":"qFdD"}],"amXt":[function(require,module,exports) {
"use strict";var e=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0});var t=require("../lib/assert"),r=e(require("./test.vert")),o=e(require("./test.frag")),a=e(require("../lib/geom/AABB")),i=require("../lib/utils"),n=e(require("../lib/geom/Vector2")),d=document.createElement("canvas");d.width=document.body.clientWidth*window.devicePixelRatio,d.height=document.body.clientHeight*window.devicePixelRatio,d.style.width=document.body.clientWidth+"px",d.style.height=document.body.clientHeight+"px",document.body.appendChild(d);var l,c=d.getContext("webgl");function u(e,r,o){var a=e.createShader(r);if(t.assert(a),e.shaderSource(a,o),e.compileShader(a),!e.getShaderParameter(a,e.COMPILE_STATUS))throw console.log(e.getShaderInfoLog(a)),e.deleteShader(a),new Error("compile error");return a}function g(e,r,o){var a=e.createProgram();if(t.assert(a),e.attachShader(a,r),e.attachShader(a,o),e.linkProgram(a),!e.getProgramParameter(a,e.LINK_STATUS))throw console.log(e.getProgramInfoLog(a)),e.deleteProgram(a),"link error";return a}t.assert(c),function(e){e[e.Fragment=WebGLRenderingContext.FRAGMENT_SHADER]="Fragment",e[e.Vertex=WebGLRenderingContext.VERTEX_SHADER]="Vertex"}(l||(l={}));var h=u(c,l.Vertex,r.default),s=u(c,l.Fragment,o.default),f=g(c,h,s),m=c.getAttribLocation(f,"a_position"),A=c.getAttribLocation(f,"a_color"),b=c.getUniformLocation(f,"u_resolution"),R=c.createBuffer();t.assert(R);var _=[10,20,80,20,10,30,10,30,80,20,80,30];c.bindBuffer(c.ARRAY_BUFFER,R),c.bufferData(c.ARRAY_BUFFER,new Float32Array(_),c.STATIC_DRAW),c.viewport(0,0,d.width,d.height),c.clearColor(0,0,0,0),c.clear(c.COLOR_BUFFER_BIT),c.useProgram(f),c.uniform2f(b,c.canvas.width,c.canvas.height),c.enableVertexAttribArray(m),c.bindBuffer(c.ARRAY_BUFFER,R),c.vertexAttribPointer(m,2,c.FLOAT,!1,0,0);var v=100,w=new Float32Array(12*v);function F(e,t,r){w.set([r.left,r.top,r.right,r.top,r.left,r.bottom,r.left,r.bottom,r.right,r.top,r.right,r.bottom],12*t)}i.times(v,function(e){var t=new a.default(new n.default(i.random(c.canvas.width),i.random(c.canvas.height)),new n.default(i.random(200),i.random(200)));F(c,e,t)}),c.bufferData(c.ARRAY_BUFFER,w,c.STATIC_DRAW),c.drawArrays(c.TRIANGLES,0,6*v);
},{"../lib/assert":"vkvk","./test.vert":"CAdB","./test.frag":"hWS3","../lib/geom/AABB":"ngoU","../lib/utils":"N6d1","../lib/geom/Vector2":"qFdD"}]},{},["amXt"], null)
//# sourceMappingURL=https://alex.dytry.ch/toys/webgl-main.033115c6.js.map