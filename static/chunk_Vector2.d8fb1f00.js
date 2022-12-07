import{e as y,f as j,i as $,c as v,k as O,g as w,a as m,v as M,h as b,n as z,l as A}from"./chunk_assert.17fe3ff6.js";const i={ok(e){return new k(e)},error(e){return new T(e)},collect(e){const r=[];for(const t of e)if(t.isOk())r.push(t.value);else return t;return i.ok(r)},collectObject(e){const r={};for(const[t,n]of y(e))if(n.isOk())r[t]=n.value;else return n;return i.ok(r)},fromFn(e){try{return i.ok(e())}catch(r){return i.error(r)}},fromPromise(e){return e.then(i.ok).catch(i.error)},async fromAsyncFn(e){try{return i.ok(await e())}catch(r){return i.error(r)}}};class S{constructor(){}}class k extends S{constructor(r){super(),this.value=r}isOk(){return!0}isError(){return!1}unwrap(){return this.value}unwrapError(r){j(`${r!=null?r:"expected error"}: ${String(this.value)}`)}map(r){return i.ok(r(this.value))}mapErr(r){return this}andThen(r){return r(this.value)}}class T extends S{constructor(r){super(),this.error=r}isOk(){return!1}isError(){return!0}unwrap(r){if(this.error instanceof Error)throw this.error;j(`${r!=null?r:"expected value"}: ${String(this.error)}`)}unwrapError(r){return this.error}map(r){return this}mapErr(r){return i.error(r(this.error))}andThen(r){return this}}class u{constructor(r,t=[]){this.message=r,this.path=t}formatPath(){if(!this.path.length)return null;let r="";for(const t of this.path)typeof t=="number"?r+=`.${t}`:t.startsWith("(")?r.endsWith(")")?r=`${r.slice(0,-1)}, ${t.slice(1)}`:r+=t:r+=`.${t}`;return r}toString(){const r=this.formatPath(),t=this.message.split(`
`).map((n,s)=>s===0?n:`  ${n}`).join(`
`);return r?`At ${r}: ${t}`:t}}function x(e,...r){return new u(e.message,[...r,...e.path])}function h(e){if(e===null)return"null";if(Array.isArray(e))return"an array";const r=typeof e;switch(r){case"bigint":case"boolean":case"function":case"number":case"string":case"symbol":return`a ${r}`;case"object":return`an ${r}`;case"undefined":return"undefined";default:v(r)}}const f=class{constructor(e,r){this.parse=e,this.serialize=r}transform(e,r){return new f(t=>this.parse(t).andThen(e),t=>this.serialize(r(t)))}nullable(){return new f(e=>e==null?i.ok(null):this.parse(e),e=>e===null?null:this.serialize(e))}parseUnwrap(e){return this.parse(e).unwrap()}static typeof(e){return new f(r=>typeof r===e?i.ok(r):i.error(new u(`Expected ${e}, got ${h(r)}`,[])),$)}static value(e){return new P(e)}static arrayOf(e){return new f(r=>Array.isArray(r)?i.collect(r.map((t,n)=>e.parse(t).mapErr(s=>x(s,n)))):i.error(new u(`Expected an array, got ${h(r)}`,[])),r=>r.map(t=>e.serialize(t)))}static object(e){return new R(e)}static objectMap(e,r){return new f(t=>typeof t!="object"||t===null?i.error(new u(`Expected object, got ${h(t)}`,[])):i.collect(O(t).map(n=>e.parse(n).andThen(s=>r.parse(w(t,s)).map(o=>[s,o])).mapErr(s=>x(s,n)))).map(n=>Object.fromEntries(n)),t=>{const n={};for(const[s,o]of y(t)){if(o===void 0)continue;const c=e.serialize(s);m(typeof c=="string"||typeof c=="number",'Assertion Error: typeof serializedKey === "string" || typeof serializedKey === "number"'),n[c]=r.serialize(o)}return n})}static enum(e){const r=new Set(Array.isArray(e)?e:M(e));return new f(t=>{if(r.has(t))return i.ok(t);{const n=typeof t=="string"?`"${t}"`:typeof t=="boolean"||typeof t=="number"?String(t):h(t),s=Array.from(r,o=>typeof o=="string"?`"${o}"`:`${o}`).join(" or ");return i.error(new u(`Expected ${s}, got ${n}`))}},$)}static union(e,r){return new q(e,r)}static indexedUnion(e,r){return new I(e,r)}};let l=f;l.unknown=new f(e=>i.ok(e),$);l.string=f.typeof("string");l.number=f.typeof("number");l.bigint=f.typeof("bigint");l.boolean=f.typeof("boolean");l.null=new f(e=>e==null?i.ok(null):i.error(new u(`Expected null or undefined, got ${h(e)}`)),()=>null);class P extends l{constructor(r){super(t=>t===r?i.ok(r):i.error(new u(`Expected ${typeof r=="string"?`"${r}"`:r}, got ${h(t)}`)),$),this.value=r}}class R extends l{constructor(r){super(t=>typeof t!="object"||t===null?i.error(new u(`Expected object, got ${h(t)}`,[])):i.collect(y(this.config).map(([n,s])=>s.parse(w(t,n)).map(o=>[n,o]).mapErr(o=>x(o,n)))).map(n=>Object.fromEntries(n)),t=>{const n={};for(const[s,o]of y(this.config))n[s]=o.serialize(t[s]);return n}),this.config=r}indexed(r){return new V(this,r)}}class V extends l{constructor(r,t){const n=[];for(const[s,o]of y(t))m(n[o]===void 0,`Duplicate index ${o} for keys "${s}" & "${n[o]}"`),n[o]=s;for(let s=0;s<n.length;s++)n[s]===void 0&&(n[s]=void 0);super(s=>typeof s!="object"||s===null?i.error(new u(`Expected an object or an array, got ${h(s)}`)):Array.isArray(s)?i.collect(y(r.config).map(([o,c])=>{const d=t[o];return c.parse(s[d]).map(p=>[o,p]).mapErr(p=>x(p,o,`(${d})`))})).map(o=>Object.fromEntries(o)):this.objectSchema.parse(s),s=>{const o=r.serialize(s);return m(typeof o=="object"&&o!==null,'Assertion Error: typeof serialized === "object" && serialized !== null'),this.keyByIndex.map(c=>c===void 0?null:w(o,c))}),this.objectSchema=r,this.indexByKey=t,this.keyByIndex=n}}class q extends l{constructor(r,t){super(n=>{if(typeof n!="object"||n===null)return i.error(new u(`Expected an object, got ${h(n)}`,[]));const s=w(n,r);if(typeof s!="string")return i.error(new u(`Expected a string for key "${r}", got ${h(s)}`,[]));const o=b(t,s)?t[s]:void 0;return o===void 0?i.error(new u(`Expected one of ${Object.keys(this.config).map(c=>JSON.stringify(c)).join(" or ")}, got ${h(s)}`,[r])):o.parse(n).mapErr(c=>x(c,`(${r} = ${s})`))},n=>{const s=n[r],o=b(t,r)?this.config[s]:null;return m(o,"Assertion Error: schema"),o.serialize(n)}),this.key=r,this.config=t}}class I extends l{constructor(r,t){for(const[n,s]of y(t))m(s.keyByIndex[0]===r,`Variant ${n} must have ${r} at index 0`);super(n=>{if(typeof n!="object"||n===null)return i.error(new u(`Expected an object or an array, got ${h(n)}`,[]));const s=Array.isArray(n),o=Array.isArray(n)?n[0]:w(n,r);if(typeof o!="string")return i.error(new u(`Expected a string, got ${h(o)}`,[s?0:r]));const c=b(t,o)?t[o]:void 0;return c===void 0?i.error(new u(`Expected one of ${Object.keys(this.config).map(d=>JSON.stringify(d)).join(" or ")}, got ${h(o)}`,[s?0:r])):c.parse(n).mapErr(d=>x(d,`(${r} = ${o})`))},n=>{const s=n[r],o=b(t,r)?this.config[s]:null;return m(o,"Assertion Error: schema"),o.serialize(n)}),this.key=r,this.config=t}}const a=class{constructor(e,r){this.x=e,this.y=r}static fromArgs(e){if(e.length===1)return a.from(e[0]);{const[r,t]=e;return new a(r,t)}}static fromPolar(e,r){return new a(r*Math.cos(e),r*Math.sin(e))}static average(e){return e.reduce((t,n)=>t.add(n),a.ZERO).div(e.length)}static from(e){return e instanceof a?e:Array.isArray(e)?new a(e[0],e[1]):(m("x"in e&&"y"in e,'Assertion Error: "x" in vectorIsh && "y" in vectorIsh'),new a(e.x,e.y))}static fromEvent({clientX:e,clientY:r}){return new a(e,r)}toString(e){const r=e==null?this.x:this.x.toFixed(e),t=e==null?this.y:this.y.toFixed(e);return`Vector2(${r}, ${t})`}magnitudeSquared(){return this.x*this.x+this.y*this.y}magnitude(){return Math.sqrt(this.magnitudeSquared())}angle(){return Math.atan2(this.y,this.x)}isInPolygon(e){const{x:r,y:t}=this;let n=!1;for(let s=0,o=e.length-1;s<e.length;o=s++){const{x:c,y:d}=e[s],{x:p,y:E}=e[o];d>t!=E>t&&r<(p-c)*(t-d)/(E-d)+c&&(n=!n)}return n}equals(...e){const r=a.fromArgs(e);return this===r||this.x===r.x&&this.y===r.y}distanceTo(...e){const r=a.fromArgs(e);return Math.hypot(this.x-r.x,this.y-r.y)}distanceToSquared(...e){const r=a.fromArgs(e),t=this.x-r.x,n=this.y-r.y;return t*t+n*n}angleTo(...e){return a.fromArgs(e).sub(this).angle()}angleBetween(...e){const r=a.fromArgs(e);return z(Math.atan2(r.y,r.x)-Math.atan2(this.y,this.x))}dot(...e){const r=a.fromArgs(e);return this.x*r.x+this.y*r.y}div(e){return new a(this.x/e,this.y/e)}scale(e){return new a(this.x*e,this.y*e)}negate(){return this.scale(-1)}add(...e){const r=a.fromArgs(e);return new a(this.x+r.x,this.y+r.y)}sub(...e){const r=a.fromArgs(e);return new a(this.x-r.x,this.y-r.y)}floor(){return new a(Math.floor(this.x),Math.floor(this.y))}ceil(){return new a(Math.ceil(this.x),Math.ceil(this.y))}round(){return new a(Math.round(this.x),Math.round(this.y))}withMagnitude(e){return this.scale(e/this.magnitude())}normalize(){return this.withMagnitude(1)}withAngle(e){return a.fromPolar(e,this.magnitude())}rotate(e){return this.withAngle(this.angle()+e)}rotateAround(e,r){e=a.from(e);const t=Math.sin(r),n=Math.cos(r),s=this.x-e.x,o=this.y-e.y,c=s*n-o*t,d=s*t+o*n;return new a(c+e.x,d+e.y)}lerp(e,r){return e=a.from(e),new a(A(this.x,e.x,r),A(this.y,e.y,r))}perpendicular(){return new a(this.y,-this.x)}project(e,r){return a.from(e).scale(r).add(this)}};let g=a;g.schema=l.object({x:l.number,y:l.number}).indexed({x:0,y:1}).transform(({x:e,y:r})=>i.ok(new a(e,r)),({x:e,y:r})=>({x:e,y:r}));g.ZERO=new a(0,0);g.UNIT=new a(1,1);g.X=new a(1,0);g.Y=new a(0,1);export{i as R,l as S,g as V,u as a};