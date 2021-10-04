function t(t,e,i){return(e-t)*i+t}function e(e,i){return"number"==typeof i?t(e,i,Math.random()):t(0,e,Math.random())}function i(t){return t[Math.floor(e(t.length))]}function n(t,e){const i=new Set(t),n=new Set;for(const t of e)i.has(t)&&n.add(t);return Array.from(n)}function o(t=""){return`${t}${Math.random().toString(36).slice(1)}`}class s{static fromPolar(t,e){return new s(e*Math.cos(t),e*Math.sin(t))}static average(t){return t.reduce(((t,e)=>t.add(e)),s.ZERO).div(t.length)}static fromVectorLike({x:t,y:e}){return new s(t,e)}toString(){return`Vector2(${this.x}, ${this.y})`}get magnitudeSquared(){return this.x*this.x+this.y*this.y}get magnitude(){return Math.sqrt(this.magnitudeSquared)}get angle(){return Math.atan2(this.y,this.x)}isInPolygon(t){const{x:e,y:i}=this;let n=!1;for(let o=0,s=t.length-1;o<t.length;s=o++){const{x:r,y:l}=t[o],{x:h,y:a}=t[s];l>i!=a>i&&e<(h-r)*(i-l)/(a-l)+r&&(n=!n)}return n}equals(t){return this===t||this.x===t.x&&this.y===t.y}distanceTo({x:t,y:e}){const i=t-this.x,n=e-this.y;return Math.sqrt(i*i+n*n)}angleTo(t){return t.sub(this).angle}angleBetween(t){return e=Math.atan2(t.y,t.x)-Math.atan2(this.y,this.x),function(t,e,i){const n=e-t;for(i-=t;i<0;)i+=n;return t+i%n}(-Math.PI,Math.PI,e);var e}dot(t){return this.x*t.x+this.y*t.y}div(t){return new s(this.x/t,this.y/t)}scale(t){return new s(this.x*t,this.y*t)}negate(){return this.scale(-1)}add({x:t,y:e}){return new s(this.x+t,this.y+e)}sub({x:t,y:e}){return new s(this.x-t,this.y-e)}floor(){return new s(Math.floor(this.x),Math.floor(this.y))}ceil(){return new s(Math.ceil(this.x),Math.ceil(this.y))}round(){return new s(Math.round(this.x),Math.round(this.y))}withMagnitude(t){return s.fromPolar(this.angle,t)}normalize(){return this.withMagnitude(1)}withAngle(t){return s.fromPolar(t,this.magnitude)}rotate(t){return this.withAngle(this.angle+t)}lerp(e,i){return new s(t(this.x,e.x,i),t(this.y,e.y,i))}constructor(t,e){this.x=t,this.y=e}}s.ZERO=new s(0,0);const r=new s(5,0),l=.75*Math.PI;const h=document.createElement("canvas"),a=h.getContext("2d"),c=document.body.clientWidth,u=document.body.clientHeight,d=window.devicePixelRatio;h.width=c*d,h.height=u*d,h.style.width=`${c}px`,h.style.height=`${u}px`,a.scale(d,d);const g=new class{clear(t){t?(this.applyFillOptions({fill:t}),this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height)):this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height)}beginPath(){this.ctx.beginPath()}moveTo({x:t,y:e}){this.ctx.moveTo(t,e)}lineTo({x:t,y:e}){this.ctx.lineTo(t,e)}arc({x:t,y:e},i,n,o,s){this.ctx.arc(t,e,i,n,o,s)}arcTo(t,e,i){this.ctx.arcTo(t.x,t.y,e.x,e.y,i)}applyStrokeOptions({strokeWidth:t=1,stroke:e,strokeCap:i="butt",strokeDash:n=[],strokeDashOffset:o=0,strokeJoin:s="round"}){e&&(this.ctx.lineWidth=t,this.ctx.strokeStyle=e,this.ctx.lineCap=i,this.ctx.setLineDash(n),this.ctx.lineDashOffset=o,this.ctx.lineJoin=s)}stroke(t){t.stroke&&(this.applyStrokeOptions(t),this.ctx.stroke())}applyFillOptions({fill:t}){t&&(this.ctx.fillStyle=t)}fill(t){t.fill&&(this.applyFillOptions(t),this.ctx.fill())}applyStrokeAndFillOptions(t){this.applyFillOptions(t),this.applyStrokeOptions(t)}strokeAndFill(t){this.fill(t),this.stroke(t)}getDebugStrokeOptions(t="magenta"){return{stroke:t,strokeWidth:.5}}debugStroke(t="magenta"){this.stroke(this.getDebugStrokeOptions(t))}fillText(t,e,i={}){this.applyFillOptions(i),this.ctx.fillText(t,e.x,e.y)}circle(t,e,i){this.beginPath(),this.arc(t,e,0,2*Math.PI),this.strokeAndFill(i)}ellipse(t,e,i,n){this.beginPath(),this.ctx.ellipse(t.x,t.y,e,i,0,0,2*Math.PI),this.strokeAndFill(n)}debugLabel(t,e,i){t&&(this.applyFillOptions({fill:i}),this.fillText(t,e.add(r)))}debugPointX(t,{color:e="magenta",label:i}={}){this.debugLabel(i,t,e),this.beginPath(),this.ctx.moveTo(t.x-3,t.y-3),this.ctx.lineTo(t.x+3,t.y+3),this.ctx.moveTo(t.x+3,t.y-3),this.ctx.lineTo(t.x-3,t.y+3),this.stroke({strokeWidth:.5,stroke:e})}debugPointO(t,{color:e="magenta",label:i}={}){this.debugLabel(i,t,e),this.circle(t,3,{strokeWidth:.5,stroke:e})}debugArrow(t,e,{color:i="magenta",label:n}={}){this.debugLabel(n,s.average([t,e]),i),this.ctx.beginPath(),this.moveTo(t),this.lineTo(e);const o=e.sub(t),r=o.rotate(-l).withMagnitude(5).add(e),h=o.rotate(+l).withMagnitude(5).add(e);this.moveTo(r),this.lineTo(e),this.lineTo(h),this.stroke({strokeWidth:.5,stroke:i})}debugVectorAtPoint(t,e,i){this.debugArrow(e,e.add(t),i)}polygon(t,e={}){this.beginPath(),this.moveTo(t[t.length-1]);for(const e of t)this.lineTo(e);this.strokeAndFill(e)}polyLine(t,e={}){this.beginPath(),this.moveTo(t[0]);for(let e=1;e<t.length;e++)this.lineTo(t[e]);this.stroke(e)}debugPolygon(t,{color:e="magenta",label:i}={}){this.debugLabel(i,t[0],e),this.polygon(t,this.getDebugStrokeOptions(e))}debugPolyLine(t,{color:e="magenta",label:i}={}){this.debugLabel(i,t[0],e),this.polyLine(t,this.getDebugStrokeOptions(e))}aabb(t,e){e.debug&&this.debugLabel(e.debug.label,t.origin,e.debug.color||"magenta"),this.ctx.beginPath(),this.ctx.rect(t.left,t.top,t.width,t.height),this.strokeAndFill(e)}constructor(t){this.ctx=t}}(a);function x(t,e){t||function(t){throw new Error(t)}(e||"Assertion Error")}document.body.appendChild(h);Math.PI;const p=function(t,e,i){const r=t*Math.sqrt(3)/2,l=[],h=[];for(let n=0;n*r<i+r;n++){const i=[];l.push(i);const a=[];h.push(a);for(let h=0;h*t<e+t;h++){const e=new s(h*t+(n%2==0?-t/2:0),n*r);if(i.push(e),0!==n&&0!==h)if(n%2==0){const t={id:o("triangle"),points:[e,l[n][h-1],l[n-1][h-1]]},i={id:o("triangle"),points:[e,l[n-1][h-1],l[n-1][h]]};a.push(t,i)}else if(l[n-1][h+1]){const t={id:o("triangle"),points:[e,l[n][h-1],l[n-1][h]]},i={id:o("triangle"),points:[e,l[n-1][h+1],l[n-1][h]]};a.push(t,i)}}}const a=new Map;for(let t=0;t<h.length;t++)for(let e=0;e<h[t].length;e++){var c,u,d,g,x,p,y,b,f,v,k,m;const i=h[t][e],o=s.average(i.points),r=(e%2==0?t%2==0?[null===(c=h[t])||void 0===c?void 0:c[e-1],null===(u=h[t])||void 0===u?void 0:u[e+1],null===(d=h[t+1])||void 0===d?void 0:d[e-1]]:[null===(g=h[t])||void 0===g?void 0:g[e-1],null===(x=h[t])||void 0===x?void 0:x[e+1],null===(p=h[t+1])||void 0===p?void 0:p[e+1]]:t%2==0?[null===(y=h[t])||void 0===y?void 0:y[e-1],null===(b=h[t])||void 0===b?void 0:b[e+1],null===(f=h[t-1])||void 0===f?void 0:f[e-1]]:[null===(v=h[t])||void 0===v?void 0:v[e-1],null===(k=h[t])||void 0===k?void 0:k[e+1],null===(m=h[t-1])||void 0===m?void 0:m[e+1]]).filter((t=>null!=t)),l=i;l.center=o,l.neighbours=r.map((t=>({triangle:t,sharedPoints:n(i.points,t.points)}))),l.ix=e,l.iy=t,a.set(l.id,l)}return a}(15,c,u),y=new Set,b=()=>{const t=[];let e=i([...p.values()].filter((t=>!y.has(t))));let n=[...p.values()];for(let o=0;o<40;o++){t.push(e),y.add(e),n=e.neighbours.map((t=>t.triangle));const o=n.filter((t=>!y.has(t)));if(!o.length)break;e=i(o)}return{triangles:t}},f=[],v=c/15*(u/15)*.01;console.log({snakeCount:v});for(let t=0;t<v;t++)f.push(b());g.clear("black");for(const{triangles:t}of f){g.beginPath();for(let e=0;e<t.length;e++){const i=t[e],n=t[e-1],o=t[e+1];n?o?g.arcTo(i.center,o.center,7):(x(n),g.lineTo(i.center)):g.moveTo(i.center)}g.stroke({strokeWidth:4.5,stroke:"white",strokeCap:"round"})}
//# sourceMappingURL=index.cd0a7b16.js.map
