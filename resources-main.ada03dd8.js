parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"N6d1":[function(require,module,exports) {
"use strict";var r=this&&this.__awaiter||function(r,t,e,n){return new(e||(e=Promise))(function(o,a){function i(r){try{s(n.next(r))}catch(t){a(t)}}function u(r){try{s(n.throw(r))}catch(t){a(t)}}function s(r){var t;r.done?o(r.value):(t=r.value,t instanceof e?t:new e(function(r){r(t)})).then(i,u)}s((n=n.apply(r,t||[])).next())})},t=this&&this.__generator||function(r,t){var e,n,o,a,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function u(a){return function(u){return function(a){if(e)throw new TypeError("Generator is already executing.");for(;i;)try{if(e=1,n&&(o=2&a[0]?n.return:a[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,a[1])).done)return o;switch(n=0,o&&(a=[2&a[0],o.value]),a[0]){case 0:case 1:o=a;break;case 4:return i.label++,{value:a[1],done:!1};case 5:i.label++,n=a[1],a=[0];continue;case 7:a=i.ops.pop(),i.trys.pop();continue;default:if(!(o=(o=i.trys).length>0&&o[o.length-1])&&(6===a[0]||2===a[0])){i=0;continue}if(3===a[0]&&(!o||a[1]>o[0]&&a[1]<o[3])){i.label=a[1];break}if(6===a[0]&&i.label<o[1]){i.label=o[1],o=a;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(a);break}o[2]&&i.ops.pop(),i.trys.pop();continue}a=t.call(r,i)}catch(u){a=[6,u],n=0}finally{e=o=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,u])}}},e=this&&this.__values||function(r){var t="function"==typeof Symbol&&Symbol.iterator,e=t&&r[t],n=0;if(e)return e.call(r);if(r&&"number"==typeof r.length)return{next:function(){return r&&n>=r.length&&(r=void 0),{value:r&&r[n++],done:!r}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},n=this&&this.__read||function(r,t){var e="function"==typeof Symbol&&r[Symbol.iterator];if(!e)return r;var n,o,a=e.call(r),i=[];try{for(;(void 0===t||t-- >0)&&!(n=a.next()).done;)i.push(n.value)}catch(u){o={error:u}}finally{try{n&&!n.done&&(e=a.return)&&e.call(a)}finally{if(o)throw o.error}}return i},o=this&&this.__spread||function(){for(var r=[],t=0;t<arguments.length;t++)r=r.concat(n(arguments[t]));return r};function a(r,t){for(var e=[],n=0;n<r;n++)e.push(t(n));return e}function i(r,t,e){return(t-r)*e+r}function u(r,t,e){return(e-r)/(t-r)}function s(r,t,e){return Math.min(t,Math.max(r,e))}function l(r,t,e){var n=t-r;for(e-=r;e<0;)e+=n;return r+(e%=n)}function c(r,t,e,n,o){return i(e,n,u(r,t,o))}function f(r,t){return"number"==typeof t?i(r,t,Math.random()):i(0,r,Math.random())}function p(r,t){return Math.floor(f(r,t))}function x(r,t){return f(r-t,r+t)}function h(r,t){return x(r,r*t)}function m(r){return r[Math.floor(f(r.length))]}function v(r){return r.reduce(function(r,t){return r.concat(t)},[])}function y(r){return Array.from(new Set(r))}function d(r,t){var n,o,a=new Set(r),i=new Set;try{for(var u=e(t),s=u.next();!s.done;s=u.next()){var l=s.value;a.has(l)&&i.add(l)}}catch(c){n={error:c}}finally{try{s&&!s.done&&(o=u.return)&&o.call(u)}finally{if(n)throw n.error}}return Array.from(i)}function w(r,t){var n,o,a=new Map;try{for(var i=e(r),u=i.next();!u.done;u=i.next()){var s=u.value,l=t(s),c=a.get(l);c?c.push(s):a.set(l,[s])}}catch(f){n={error:f}}finally{try{u&&!u.done&&(o=i.return)&&o.call(i)}finally{if(n)throw n.error}}return a}function g(r,t){return r.slice().sort(function(r,e){return t(r)<t(e)?-1:1})}function b(r,t){var n,o,a=[],i=[];try{for(var u=e(r),s=u.next();!s.done;s=u.next()){var l=s.value;t(l)?a.push(l):i.push(l)}}catch(c){n={error:c}}finally{try{s&&!s.done&&(o=u.return)&&o.call(u)}finally{if(n)throw n.error}}return[a,i]}function S(){return"rgb("+Math.floor(f(256))+","+Math.floor(f(256))+","+Math.floor(f(256))+")"}function M(r,t){var e=r.indexOf(t);-1!==e&&r.splice(e,1)}function I(){return new Promise(function(r){window.requestAnimationFrame(function(t){return r(t)})})}function _(r){return new Promise(function(t){return setTimeout(function(){return t()},r)})}function A(e){return r(this,void 0,void 0,function(){var r,n,o;return t(this,function(t){switch(t.label){case 0:r=!1,n=function(){r=!0},t.label=1;case 1:return o=e,[4,I()];case 2:return o.apply(void 0,[t.sent(),n]),r?[2]:[3,1];case 3:return[2]}})})}function L(r){var t,o,a={};try{for(var i=e(r),u=i.next();!u.done;u=i.next()){var s=n(u.value,2),l=s[0],c=s[1];a[l]=c}}catch(f){t={error:f}}finally{try{u&&!u.done&&(o=i.return)&&o.call(i)}finally{if(t)throw t.error}}return a}function P(r){return r.filter(function(r){return null!=r})}function O(r){return l(-Math.PI,Math.PI,r)}function T(r,t,e){return Math.max(r,Math.min(t,e))}function k(r){for(var t,e=r.slice(),o=e.length-1;o>0;o--){var a=Math.floor(Math.random()*(o+1));t=n([e[a],e[o]],2),e[o]=t[0],e[a]=t[1]}return e}function B(r){return void 0===r&&(r=""),""+r+Math.random().toString(36).slice(1)}function E(r,t){void 0===t&&(t=null);try{var e=window.localStorage.getItem(r);return e?JSON.parse(e):t}catch(n){return console.log(n),t}}function R(r,t){window.localStorage.setItem(r,JSON.stringify(t))}function q(r,t){var e;return function(){for(var n=[],a=0;a<arguments.length;a++)n[a]=arguments[a];clearTimeout(e),e=setTimeout(function(){return t.apply(void 0,o(n))},r)}}Object.defineProperty(exports,"__esModule",{value:!0}),exports.debounce=exports.setLocalStorageItem=exports.getLocalStorageItem=exports.getId=exports.shuffle=exports.clamp=exports.normalizeAngle=exports.compact=exports.fromEntries=exports.frameLoop=exports.wait=exports.frame=exports.removeFromArray=exports.randomColor=exports.partition=exports.sortBy=exports.groupBy=exports.intersection=exports.uniq=exports.flatten=exports.sample=exports.varyRelative=exports.varyAbsolute=exports.randomInt=exports.random=exports.mapRange=exports.constrainWrapped=exports.constrain=exports.invLerp=exports.lerp=exports.times=void 0,exports.times=a,exports.lerp=i,exports.invLerp=u,exports.constrain=s,exports.constrainWrapped=l,exports.mapRange=c,exports.random=f,exports.randomInt=p,exports.varyAbsolute=x,exports.varyRelative=h,exports.sample=m,exports.flatten=v,exports.uniq=y,exports.intersection=d,exports.groupBy=w,exports.sortBy=g,exports.partition=b,exports.randomColor=S,exports.removeFromArray=M,exports.frame=I,exports.wait=_,exports.frameLoop=A,exports.fromEntries=L,exports.compact=P,exports.normalizeAngle=O,exports.clamp=T,exports.shuffle=k,exports.getId=B,exports.getLocalStorageItem=E,exports.setLocalStorageItem=R,exports.debounce=q;
},{}],"qFdD":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var t=require("../utils"),e=function(){function e(t,e){this.x=t,this.y=e}return e.fromPolar=function(t,n){return new e(n*Math.cos(t),n*Math.sin(t))},e.average=function(t){return t.reduce(function(t,e){return t.add(e)},e.ZERO).div(t.length)},e.prototype.toString=function(){return"Vector2("+this.x+", "+this.y+")"},Object.defineProperty(e.prototype,"magnitudeSquared",{get:function(){return this.x*this.x+this.y*this.y},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"magnitude",{get:function(){return Math.sqrt(this.magnitudeSquared)},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"angle",{get:function(){return Math.atan2(this.y,this.x)},enumerable:!1,configurable:!0}),e.prototype.isInPolygon=function(t){for(var e=this.x,n=this.y,r=!1,o=0,i=t.length-1;o<t.length;i=o++){var u=t[o],h=u.x,s=u.y,a=t[i],y=a.x,p=a.y;s>n!=p>n&&e<(y-h)*(n-s)/(p-s)+h&&(r=!r)}return r},e.prototype.equals=function(t){return this===t||this.x===t.x&&this.y===t.y},e.prototype.distanceTo=function(t){var e=t.x,n=t.y,r=e-this.x,o=n-this.y;return Math.sqrt(r*r+o*o)},e.prototype.angleTo=function(t){return t.sub(this).angle},e.prototype.angleBetween=function(e){return t.normalizeAngle(Math.atan2(e.y,e.x)-Math.atan2(this.y,this.x))},e.prototype.dot=function(t){return this.x*t.x+this.y*t.y},e.prototype.div=function(t){return new e(this.x/t,this.y/t)},e.prototype.scale=function(t){return new e(this.x*t,this.y*t)},e.prototype.negate=function(){return this.scale(-1)},e.prototype.add=function(t){var n=t.x,r=t.y;return new e(this.x+n,this.y+r)},e.prototype.sub=function(t){var n=t.x,r=t.y;return new e(this.x-n,this.y-r)},e.prototype.floor=function(){return new e(Math.floor(this.x),Math.floor(this.y))},e.prototype.ceil=function(){return new e(Math.ceil(this.x),Math.ceil(this.y))},e.prototype.round=function(){return new e(Math.round(this.x),Math.round(this.y))},e.prototype.withMagnitude=function(t){return e.fromPolar(this.angle,t)},e.prototype.withAngle=function(t){return e.fromPolar(t,this.magnitude)},e.prototype.rotate=function(t){return this.withAngle(this.angle+t)},e.prototype.lerp=function(n,r){return new e(t.lerp(this.x,n.x,r),t.lerp(this.y,n.y,r))},e.ZERO=new e(0,0),e}();exports.default=e;
},{"../utils":"N6d1"}],"dFS9":[function(require,module,exports) {
"use strict";var t=this&&this.__values||function(t){var o="function"==typeof Symbol&&Symbol.iterator,i=o&&t[o],e=0;if(i)return i.call(t);if(t&&"number"==typeof t.length)return{next:function(){return t&&e>=t.length&&(t=void 0),{value:t&&t[e++],done:!t}}};throw new TypeError(o?"Object is not iterable.":"Symbol.iterator is not defined.")},o=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.DebugDraw=void 0;var i=o(require("./geom/Vector2")),e="magenta",r=new i.default(5,0),n=3,s=.5,l=.75*Math.PI,h=5,a=function(){function o(t){this.ctx=t}return o.prototype.clear=function(t){t||this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height),this.applyFillOptions({fill:t}),this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height)},o.prototype.beginPath=function(){this.ctx.beginPath()},o.prototype.moveTo=function(t){var o=t.x,i=t.y;this.ctx.moveTo(o,i)},o.prototype.lineTo=function(t){var o=t.x,i=t.y;this.ctx.lineTo(o,i)},o.prototype.arc=function(t,o,i,e,r){var n=t.x,s=t.y;this.ctx.arc(n,s,o,i,e,r)},o.prototype.arcTo=function(t,o,i){this.ctx.arcTo(t.x,t.y,o.x,o.y,i)},o.prototype.applyStrokeOptions=function(t){var o=t.strokeWidth,i=void 0===o?1:o,e=t.stroke,r=void 0===e?void 0:e,n=t.strokeCap,s=void 0===n?"butt":n,l=t.strokeDash,h=void 0===l?[]:l,a=t.strokeDashOffset,p=void 0===a?0:a,c=t.strokeJoin,d=void 0===c?"round":c;r&&(this.ctx.lineWidth=i,this.ctx.strokeStyle=r,this.ctx.lineCap=s,this.ctx.setLineDash(h),this.ctx.lineDashOffset=p,this.ctx.lineJoin=d)},o.prototype.stroke=function(t){t.stroke&&(this.applyStrokeOptions(t),this.ctx.stroke())},o.prototype.applyFillOptions=function(t){var o=t.fill,i=void 0===o?void 0:o;i&&(this.ctx.fillStyle=i)},o.prototype.fill=function(t){t.fill&&(this.applyFillOptions(t),this.ctx.fill())},o.prototype.applyStrokeAndFillOptions=function(t){this.applyFillOptions(t),this.applyStrokeOptions(t)},o.prototype.strokeAndFill=function(t){this.fill(t),this.stroke(t)},o.prototype.getDebugStrokeOptions=function(t){return void 0===t&&(t=e),{stroke:t,strokeWidth:s}},o.prototype.debugStroke=function(t){void 0===t&&(t=e),this.stroke(this.getDebugStrokeOptions(t))},o.prototype.fillText=function(t,o,i){void 0===i&&(i={}),this.applyFillOptions(i),this.ctx.fillText(t,o.x,o.y)},o.prototype.circle=function(t,o,i){this.beginPath(),this.arc(t,o,0,2*Math.PI),this.strokeAndFill(i)},o.prototype.debugLabel=function(t,o,i){t&&(this.applyFillOptions({fill:i}),this.fillText(t,o.add(r)))},o.prototype.debugPointX=function(t,o){var i=void 0===o?{}:o,r=i.color,l=void 0===r?e:r,h=i.label,a=void 0===h?void 0:h;this.debugLabel(a,t,l),this.beginPath(),this.ctx.moveTo(t.x-n,t.y-n),this.ctx.lineTo(t.x+n,t.y+n),this.ctx.moveTo(t.x+n,t.y-n),this.ctx.lineTo(t.x-n,t.y+n),this.stroke({strokeWidth:s,stroke:l})},o.prototype.debugPointO=function(t,o){var i=void 0===o?{}:o,r=i.color,l=void 0===r?e:r,h=i.label,a=void 0===h?void 0:h;this.debugLabel(a,t,l),this.circle(t,n,{strokeWidth:s,stroke:l})},o.prototype.debugArrow=function(t,o,r){var n=void 0===r?{}:r,a=n.color,p=void 0===a?e:a,c=n.label,d=void 0===c?void 0:c;this.debugLabel(d,i.default.average([t,o]),p),this.ctx.beginPath(),this.moveTo(t),this.lineTo(o);var u=o.sub(t),v=u.rotate(-l).withMagnitude(h).add(o),y=u.rotate(+l).withMagnitude(h).add(o);this.moveTo(v),this.lineTo(o),this.lineTo(y),this.stroke({strokeWidth:s,stroke:p})},o.prototype.debugVectorAtPoint=function(t,o,i){this.debugArrow(o,o.add(t),i)},o.prototype.polygon=function(o,i){var e,r;void 0===i&&(i={}),this.beginPath(),this.moveTo(o[o.length-1]);try{for(var n=t(o),s=n.next();!s.done;s=n.next()){var l=s.value;this.lineTo(l)}}catch(h){e={error:h}}finally{try{s&&!s.done&&(r=n.return)&&r.call(n)}finally{if(e)throw e.error}}this.strokeAndFill(i)},o.prototype.polyLine=function(t,o){void 0===o&&(o={}),this.beginPath(),this.moveTo(t[0]);for(var i=1;i<t.length;i++)this.lineTo(t[i]);this.stroke(o)},o.prototype.debugPolygon=function(t,o){var i=void 0===o?{}:o,r=i.color,n=void 0===r?e:r,s=i.label,l=void 0===s?void 0:s;this.debugLabel(l,t[0],n),this.polygon(t,this.getDebugStrokeOptions(n))},o.prototype.debugPolyLine=function(t,o){var i=void 0===o?{}:o,r=i.color,n=void 0===r?e:r,s=i.label,l=void 0===s?void 0:s;this.debugLabel(l,t[0],n),this.polyLine(t,this.getDebugStrokeOptions(n))},o}();exports.DebugDraw=a;
},{"./geom/Vector2":"qFdD"}],"zl74":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.canvas=exports.scale=exports.height=exports.width=exports.ctx=exports.canvasEl=void 0;var e=require("../lib/DebugCanvas");exports.canvasEl=document.createElement("canvas"),exports.ctx=exports.canvasEl.getContext("2d"),exports.width=document.body.clientWidth,exports.height=document.body.clientHeight,exports.scale=window.devicePixelRatio,exports.canvasEl.width=exports.width*exports.scale,exports.canvasEl.height=exports.height*exports.scale,exports.canvasEl.style.width=exports.width+"px",exports.canvasEl.style.height=exports.height+"px",exports.ctx.scale(exports.scale,exports.scale),exports.canvas=new e.DebugDraw(exports.ctx),document.body.appendChild(exports.canvasEl);
},{"../lib/DebugCanvas":"dFS9"}],"amab":[function(require,module,exports) {
"use strict";var i=this&&this.__importDefault||function(i){return i&&i.__esModule?i:{default:i}};Object.defineProperty(exports,"__esModule",{value:!0});var o=i(require("../lib/geom/Vector2")),e=require("../lib/utils");function t(i,t,n){for(var l,r,d,u,v,a,s,p,f,g,h,c,_=i*Math.sqrt(3)/2,b=[],m=[],I=0;I*_<n+_;I++){var M=[];b.push(M);var q=[];m.push(q);for(var x=0;x*i<t+i;x++){var w=I%2==0?-i/2:0,y=new o.default(x*i+w,I*_);if(M.push(y),0!==I&&0!==x)if(I%2==0){var P={id:e.getId("triangle"),points:[y,b[I][x-1],b[I-1][x-1]]},j={id:e.getId("triangle"),points:[y,b[I-1][x-1],b[I-1][x]]};q.push(P,j)}else if(b[I-1][x+1]){P={id:e.getId("triangle"),points:[y,b[I][x-1],b[I-1][x]]},j={id:e.getId("triangle"),points:[y,b[I-1][x+1],b[I-1][x]]};q.push(P,j)}}}var D=new Map;for(I=0;I<m.length;I++){var O=function(i){var t=m[I][i],n=o.default.average(t.points),_=e.compact(i%2==0?I%2==0?[null===(l=m[I])||void 0===l?void 0:l[i-1],null===(r=m[I])||void 0===r?void 0:r[i+1],null===(d=m[I+1])||void 0===d?void 0:d[i-1]]:[null===(u=m[I])||void 0===u?void 0:u[i-1],null===(v=m[I])||void 0===v?void 0:v[i+1],null===(a=m[I+1])||void 0===a?void 0:a[i+1]]:I%2==0?[null===(s=m[I])||void 0===s?void 0:s[i-1],null===(p=m[I])||void 0===p?void 0:p[i+1],null===(f=m[I-1])||void 0===f?void 0:f[i-1]]:[null===(g=m[I])||void 0===g?void 0:g[i-1],null===(h=m[I])||void 0===h?void 0:h[i+1],null===(c=m[I-1])||void 0===c?void 0:c[i+1]]),b=t;b.center=n,b.neighbours=_.map(function(i){return{triangle:i,sharedPoints:e.intersection(t.points,i.points)}}),b.ix=i,b.iy=I,D.set(b.id,b)};for(x=0;x<m[I].length;x++)O(x)}return D}exports.default=t;
},{"../lib/geom/Vector2":"qFdD","../lib/utils":"N6d1"}],"ngoU":[function(require,module,exports) {
"use strict";var t=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(exports,"__esModule",{value:!0});var e=t(require("./Vector2")),r=function(){function t(t,e){this.origin=t,this.size=e,Object.freeze(this)}return t.fromLeftTopRightBottom=function(r,i,o,n){return new t(new e.default(r,i),new e.default(o-r,n-i))},t.prototype.contains=function(t){var e=t.x,r=t.y;return this.left<=e&&e<=this.right&&this.top<=r&&r<=this.bottom},t.prototype.intersects=function(t){return!(this.right<t.left||this.left>t.right||this.bottom<t.top||this.top>t.bottom)},t.prototype.getCenter=function(){return this.origin.add(this.size.scale(.5))},Object.defineProperty(t.prototype,"left",{get:function(){return this.origin.x},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"right",{get:function(){return this.origin.x+this.size.x},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"top",{get:function(){return this.origin.y},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"bottom",{get:function(){return this.origin.y+this.size.y},enumerable:!1,configurable:!0}),t}();exports.default=r;
},{"./Vector2":"qFdD"}],"AQGy":[function(require,module,exports) {
"use strict";var t=this&&this.__read||function(t,i){var e="function"==typeof Symbol&&t[Symbol.iterator];if(!e)return t;var n,r,s=e.call(t),o=[];try{for(;(void 0===i||i-- >0)&&!(n=s.next()).done;)o.push(n.value)}catch(u){r={error:u}}finally{try{n&&!n.done&&(e=s.return)&&e.call(s)}finally{if(r)throw r.error}}return o},i=this&&this.__spread||function(){for(var i=[],e=0;e<arguments.length;e++)i=i.concat(t(arguments[e]));return i},e=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(exports,"__esModule",{value:!0});var n=e(require("./geom/AABB")),r=function(){function t(t,i){this._items=[],this._nextItemIndex=0,this._subdivisions=null,this.boundary=t,this._getPosition=i}return t.prototype.insert=function(i){var e=this._getPosition(i);if(!this.boundary.contains(e))return!1;if(this._nextItemIndex<t.NODE_CAPACITY)return this._items[this._nextItemIndex]=i,this._nextItemIndex++,!0;var n=this._getSubdivisions();if(n[0].insert(i))return!0;if(n[1].insert(i))return!0;if(n[2].insert(i))return!0;if(n[3].insert(i))return!0;throw new Error("Couldnt insert item")},t.prototype.remove=function(t){var i=this._getPosition(t);if(!this.boundary.contains(i))return!1;var e=this._items.indexOf(t);if(-1!==e)return this._items.splice(e,1),this._nextItemIndex--,!0;var n=this._subdivisions;if(n){if(n[0].remove(t))return!0;if(n[1].remove(t))return!0;if(n[2].remove(t))return!0;if(n[3].remove(t))return!0}return!1},t.prototype.clear=function(){for(var t=0;t<this._nextItemIndex;t++)this._items[t]=void 0,this._nextItemIndex=0;this._subdivisions&&this._subdivisions.forEach(function(t){return t.clear()})},t.prototype.findItemsInRect=function(t){var e=[];if(!this.boundary.intersects(t))return e;for(var n=0;n<this._nextItemIndex;n++){var r=this._items[n];if(null!=r){var s=this._getPosition(r);t.contains(s)&&e.push(r)}}var o=this._subdivisions;return o?(o[0].boundary.intersects(t)&&e.push.apply(e,i(o[0].findItemsInRect(t))),o[1].boundary.intersects(t)&&e.push.apply(e,i(o[1].findItemsInRect(t))),o[2].boundary.intersects(t)&&e.push.apply(e,i(o[2].findItemsInRect(t))),o[3].boundary.intersects(t)&&e.push.apply(e,i(o[3].findItemsInRect(t))),e):e},t.prototype.findItemsInCircle=function(t){var i=this;return this.findItemsInRect(t.getBoundingBox()).filter(function(e){return t.containsPoint(i._getPosition(e))})},t.prototype._getSubdivisions=function(){if(this._subdivisions)return this._subdivisions;var i=this.boundary.getCenter(),e=[new t(n.default.fromLeftTopRightBottom(this.boundary.left,this.boundary.top,i.x,i.y),this._getPosition),new t(n.default.fromLeftTopRightBottom(i.x,this.boundary.top,this.boundary.right,i.y),this._getPosition),new t(n.default.fromLeftTopRightBottom(this.boundary.left,i.y,i.x,this.boundary.bottom),this._getPosition),new t(n.default.fromLeftTopRightBottom(i.x,i.y,this.boundary.right,this.boundary.bottom),this._getPosition)];return this._subdivisions=e,e},t.NODE_CAPACITY=4,t}();exports.default=r;
},{"./geom/AABB":"ngoU"}],"apDX":[function(require,module,exports) {
"use strict";var e,r,t,n,l=this&&this.__values||function(e){var r="function"==typeof Symbol&&Symbol.iterator,t=r&&e[r],n=0;if(t)return t.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(r?"Object is not iterable.":"Symbol.iterator is not defined.")},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0});var o=require("./canvas"),a=i(require("../lib/createTriangleGrid")),u=i(require("../lib/QuadTree")),f=i(require("../lib/geom/AABB")),d=i(require("../lib/geom/Vector2")),c=30,s=a.default(c,o.width,o.height),h=new u.default(new f.default(new d.default(-c,-c),new d.default(o.width+c,o.height+c)),function(e){return e.center});try{for(var v=l(s.values()),y=v.next();!y.done;y=v.next()){var w=y.value;h.insert(w)}}catch(p){e={error:p}}finally{try{y&&!y.done&&(r=v.return)&&r.call(v)}finally{if(e)throw e.error}}var b=h.findItemsInRect(new f.default(new d.default(100,100),new d.default(200,200)));console.log(b);try{for(var g=l(b),m=g.next();!m.done;m=g.next()){var _=m.value;o.canvas.debugPolygon(_.points)}}catch(x){t={error:x}}finally{try{m&&!m.done&&(n=g.return)&&n.call(g)}finally{if(t)throw t.error}}
},{"./canvas":"zl74","../lib/createTriangleGrid":"amab","../lib/QuadTree":"AQGy","../lib/geom/AABB":"ngoU","../lib/geom/Vector2":"qFdD"}]},{},["apDX"], null)
//# sourceMappingURL=https://alex.dytry.ch/toys/resources-main.ada03dd8.js.map