import{n as l,l as x}from"./assert.99a33aa8.js";const r=class{constructor(t,e){this.x=t,this.y=e}static fromPolar(t,e){return new r(e*Math.cos(t),e*Math.sin(t))}static average(t){return t.reduce((n,s)=>n.add(s),r.ZERO).div(t.length)}static fromVectorLike({x:t,y:e}){return new r(t,e)}static fromEvent({clientX:t,clientY:e}){return new r(t,e)}toString(){return`Vector2(${this.x}, ${this.y})`}get magnitudeSquared(){return this.x*this.x+this.y*this.y}get magnitude(){return Math.sqrt(this.magnitudeSquared)}get angle(){return Math.atan2(this.y,this.x)}isInPolygon(t){const{x:e,y:n}=this;let s=!1;for(let i=0,h=t.length-1;i<t.length;h=i++){const{x:u,y:a}=t[i],{x:d,y:c}=t[h];a>n!=c>n&&e<(d-u)*(n-a)/(c-a)+u&&(s=!s)}return s}equals(t){return this===t||this.x===t.x&&this.y===t.y}distanceTo({x:t,y:e}){return Math.hypot(this.x-t,this.y-e)}distanceToSq({x:t,y:e}){const n=this.x-t,s=this.y-e;return n*n+s*s}angleTo(t){return t.sub(this).angle}angleBetween(t){return l(Math.atan2(t.y,t.x)-Math.atan2(this.y,this.x))}dot(t){return this.x*t.x+this.y*t.y}div(t){return new r(this.x/t,this.y/t)}scale(t){return new r(this.x*t,this.y*t)}negate(){return this.scale(-1)}add({x:t,y:e}){return new r(this.x+t,this.y+e)}sub({x:t,y:e}){return new r(this.x-t,this.y-e)}floor(){return new r(Math.floor(this.x),Math.floor(this.y))}ceil(){return new r(Math.ceil(this.x),Math.ceil(this.y))}round(){return new r(Math.round(this.x),Math.round(this.y))}withMagnitude(t){return r.fromPolar(this.angle,t)}normalize(){return this.withMagnitude(1)}withAngle(t){return r.fromPolar(t,this.magnitude)}rotate(t){return this.withAngle(this.angle+t)}rotateAround(t,e){const n=Math.sin(e),s=Math.cos(e),i=this.x-t.x,h=this.y-t.y,u=i*s-h*n,a=i*n+h*s;return new r(u+t.x,a+t.y)}lerp(t,e){return new r(x(this.x,t.x,e),x(this.y,t.y,e))}perpendicular(){return new r(this.y,-this.x)}project(t,e){return t.scale(e).add(this)}};let o=r;o.ZERO=new r(0,0);o.UNIT=new r(1,1);o.X=new r(1,0);o.Y=new r(0,1);export{o as V};
