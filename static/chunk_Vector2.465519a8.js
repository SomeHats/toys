import{f as w,e as b,g,k as M,v as P,c as S,n as A,l as x}from"./chunk_assert.658f1ac3.js";const o={ok(r){return new T(r)},error(r){return new k(r)},collect(r){const t=[];for(const e of r)if(e.isOk())t.push(e.value);else return e;return o.ok(t)}};class E{constructor(){}}class T extends E{constructor(t){super(),this.value=t}isOk(){return!0}isError(){return!1}unwrap(){return this.value}unwrapError(t){w(`${t!=null?t:"expected error"}: ${String(this.value)}`)}map(t){return o.ok(t(this.value))}mapErr(t){return this}andThen(t){return t(this.value)}}class k extends E{constructor(t){super(),this.error=t}isOk(){return!1}isError(){return!0}unwrap(t){if(this.error instanceof Error)throw this.error;w(`${t!=null?t:"expected value"}: ${String(this.error)}`)}unwrapError(t){return this.error}map(t){return this}mapErr(t){return o.error(t(this.error))}andThen(t){return this}}class u{constructor(t,e=[]){this.message=t,this.path=e}formatPath(){let t="ROOT";for(const e of this.path)typeof e=="number"?t+=`[${e}]`:t+=`.${e}`;return t}toString(){return`At ${this.formatPath()}: ${this.message}`}}function d(r){return t=>typeof t===r?o.ok(t):o.error(new u(`Expected ${r}, got ${typeof t}`,[]))}function y(r,t){return new u(r.message,[t,...r.path])}function f(r){if(r===null)return"null";if(Array.isArray(r))return"an array";const t=typeof r;switch(t){case"bigint":case"boolean":case"function":case"number":case"string":case"symbol":return`a ${t}`;case"object":return`an ${t}`;case"undefined":return"undefined";default:S(t)}}const z=d("string"),m=d("number"),q=d("boolean");function I(r){return t=>Array.isArray(t)?o.collect(t.map((e,s)=>r(e).mapErr(a=>y(a,s)))):o.error(new u(`Expected Array, got ${f(t)}`,[]))}function O(r){return t=>typeof t!="object"||t===null?o.error(new u(`Expected object, got ${f(t)}`,[])):o.collect(b(r).map(([e,s])=>s(g(t,e)).map(a=>[e,a]).mapErr(a=>y(a,e)))).map(e=>Object.fromEntries(e))}function X(r,t){return e=>typeof e!="object"||e===null?o.error(new u(`Expected object, got ${f(e)}`,[])):o.collect(M(e).map(s=>r(s).andThen(a=>t(g(e,a)).map(i=>[a,i])).mapErr(a=>y(a,s)))).map(s=>Object.fromEntries(s))}function Y(r){const t=new Set(Array.isArray(r)?r:P(r));return e=>{if(t.has(e))return o.ok(e);{const s=typeof e=="string"?`"${e}"`:typeof e=="boolean"||typeof e=="number"?String(e):f(e),a=Array.from(t,i=>typeof i=="string"?`"${i}"`:`${i}`).join(" or ");return o.error(new u(`Expected ${a}, got ${s}`))}}}function j(r,t){return e=>r(e).andThen(t)}const R=O({x:m,y:m}),n=class{constructor(r,t){this.x=r,this.y=t}static fromPolar(r,t){return new n(t*Math.cos(r),t*Math.sin(r))}static average(r){return r.reduce((e,s)=>e.add(s),n.ZERO).div(r.length)}static fromVectorLike({x:r,y:t}){return new n(r,t)}static fromEvent({clientX:r,clientY:t}){return new n(r,t)}toString(r){return`Vector2(${r==null?this.x:this.x.toFixed(r)}, ${r==null?this.y:this.y.toFixed(r)})`}serialize(){return{x:this.x,y:this.y}}get magnitudeSquared(){return this.x*this.x+this.y*this.y}get magnitude(){return Math.sqrt(this.magnitudeSquared)}get angle(){return Math.atan2(this.y,this.x)}isInPolygon(r){const{x:t,y:e}=this;let s=!1;for(let a=0,i=r.length-1;a<r.length;i=a++){const{x:l,y:h}=r[a],{x:$,y:p}=r[i];h>e!=p>e&&t<($-l)*(e-h)/(p-h)+l&&(s=!s)}return s}equals(r){return this===r||this.x===r.x&&this.y===r.y}distanceTo({x:r,y:t}){return Math.hypot(this.x-r,this.y-t)}distanceToSq({x:r,y:t}){const e=this.x-r,s=this.y-t;return e*e+s*s}angleTo(r){return r.sub(this).angle}angleBetween(r){return A(Math.atan2(r.y,r.x)-Math.atan2(this.y,this.x))}dot(r){return this.x*r.x+this.y*r.y}div(r){return new n(this.x/r,this.y/r)}scale(r){return new n(this.x*r,this.y*r)}negate(){return this.scale(-1)}add({x:r,y:t}){return new n(this.x+r,this.y+t)}sub({x:r,y:t}){return new n(this.x-r,this.y-t)}floor(){return new n(Math.floor(this.x),Math.floor(this.y))}ceil(){return new n(Math.ceil(this.x),Math.ceil(this.y))}round(){return new n(Math.round(this.x),Math.round(this.y))}withMagnitude(r){return n.fromPolar(this.angle,r)}normalize(){return this.withMagnitude(1)}withAngle(r){return n.fromPolar(r,this.magnitude)}rotate(r){return this.withAngle(this.angle+r)}rotateAround(r,t){const e=Math.sin(t),s=Math.cos(t),a=this.x-r.x,i=this.y-r.y,l=a*s-i*e,h=a*e+i*s;return new n(l+r.x,h+r.y)}lerp(r,t){return new n(x(this.x,r.x,t),x(this.y,r.y,t))}perpendicular(){return new n(this.y,-this.x)}project(r,t){return r.scale(t).add(this)}};let c=n;c.ZERO=new n(0,0);c.UNIT=new n(1,1);c.X=new n(1,0);c.Y=new n(0,1);c.deserialize=n.fromVectorLike;c.parse=j(R,r=>o.ok(n.deserialize(r)));export{u as P,o as R,c as V,I as a,j as b,O as c,z as d,X as e,Y as f,R as g,q as h,m as p};
