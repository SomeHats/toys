import{o as y,G as E,M as g,e as S,k as z,L as w,a as m,_ as M,h as b,n as O,l as j}from"./chunk_utils.6b6c081d.js";const a={ok(r){return new k(r)},error(r){return new T(r)},collect(r){const e=[];for(const t of r)if(t.isOk())e.push(t.value);else return t;return a.ok(e)},collectObject(r){const e={};for(const[t,n]of y(r))if(n.isOk())e[t]=n.value;else return n;return a.ok(e)},fromFn(r){try{return a.ok(r())}catch(e){return a.error(e)}},fromPromise(r){return r.then(a.ok).catch(a.error)},async fromAsyncFn(r){try{return a.ok(await r())}catch(e){return a.error(e)}}};class v{constructor(){}}class k extends v{constructor(e){super(),this.value=e}isOk(){return!0}isError(){return!1}unwrap(){return this.value}unwrapError(e){E(`${e??"expected error"}: ${String(this.value)}`)}map(e){return a.ok(e(this.value))}mapErr(e){return this}andThen(e){return e(this.value)}}class T extends v{constructor(e){super(),this.error=e}isOk(){return!1}isError(){return!0}unwrap(e){if(this.error instanceof Error)throw this.error;E(`${e??"expected value"}: ${String(this.error)}`)}unwrapError(e){return this.error}map(e){return this}mapErr(e){return a.error(e(this.error))}andThen(e){return this}}class u{constructor(e,t=[]){this.message=e,this.path=t}formatPath(){if(!this.path.length)return null;let e="";for(const t of this.path)typeof t=="number"?e+=`.${t}`:t.startsWith("(")?e.endsWith(")")?e=`${e.slice(0,-1)}, ${t.slice(1)}`:e+=t:e+=`.${t}`;return e}toString(){const e=this.formatPath(),t=this.message.split(`
`).map((n,s)=>s===0?n:`  ${n}`).join(`
`);return e?`At ${e}: ${t}`:t}}function x(r,...e){return new u(r.message,[...e,...r.path])}function l(r){if(r===null)return"null";if(Array.isArray(r))return"an array";const e=typeof r;switch(e){case"bigint":case"boolean":case"function":case"number":case"string":case"symbol":return`a ${e}`;case"object":return`an ${e}`;case"undefined":return"undefined";default:S(e)}}const h=class{constructor(r,e){this.parse=r,this.serialize=e}transform(r,e){return new h(t=>this.parse(t).andThen(r),t=>this.serialize(e(t)))}nullable(){return new h(r=>r==null?a.ok(null):this.parse(r),r=>r===null?null:this.serialize(r))}optional(){return new h(r=>r==null?a.ok(void 0):this.parse(r),r=>{if(r!=null)return this.serialize(r)})}parseUnwrap(r){return this.parse(r).unwrap()}static typeof(r){return new h(e=>typeof e===r?a.ok(e):a.error(new u(`Expected ${r}, got ${l(e)}`,[])),g)}static value(r){return new P(r)}static valueUnion(...r){return new h(e=>r.includes(e)?a.ok(e):a.error(new u(`Expected one of ${r.join(" or ")}, got ${l(e)}`)),g)}static arrayOf(r){return new h(e=>Array.isArray(e)?a.collect(e.map((t,n)=>r.parse(t).mapErr(s=>x(s,n)))):a.error(new u(`Expected an array, got ${l(e)}`,[])),e=>e.map(t=>r.serialize(t)))}static object(r){return new R(r)}static objectMap(r,e){return new h(t=>typeof t!="object"||t===null?a.error(new u(`Expected object, got ${l(t)}`,[])):a.collect(z(t).map(n=>r.parse(n).andThen(s=>e.parse(w(t,s)).map(o=>[s,o])).mapErr(s=>x(s,n)))).map(n=>Object.fromEntries(n)),t=>{const n={};for(const[s,o]of y(t)){if(o===void 0)continue;const c=r.serialize(s);m(typeof c=="string"||typeof c=="number",'Assertion Error: typeof serializedKey === "string" || typeof serializedKey === "number"'),n[c]=e.serialize(o)}return n})}static enum(r){const e=new Set(Array.isArray(r)?r:M(r));return new h(t=>{if(e.has(t))return a.ok(t);{const n=typeof t=="string"?`"${t}"`:typeof t=="boolean"||typeof t=="number"?String(t):l(t),s=Array.from(e,o=>typeof o=="string"?`"${o}"`:`${o}`).join(" or ");return a.error(new u(`Expected ${s}, got ${n}`))}},g)}static union(r,e){return new U(r,e)}static indexedUnion(r,e){return new q(r,e)}};let f=h;f.unknown=new h(r=>a.ok(r),g);f.never=new h(()=>a.error(new u("Cannot parse never schema")),()=>{E("Cannot serialize never schema")});f.string=h.typeof("string");f.number=h.typeof("number");f.bigint=h.typeof("bigint");f.boolean=h.typeof("boolean");f.null=new h(r=>r==null?a.ok(null):a.error(new u(`Expected null or undefined, got ${l(r)}`)),()=>null);class P extends f{constructor(e){super(t=>t===e?a.ok(e):a.error(new u(`Expected ${typeof e=="string"?`"${e}"`:e}, got ${l(t)}`)),g),this.value=e}}class R extends f{constructor(e){super(t=>typeof t!="object"||t===null?a.error(new u(`Expected object, got ${l(t)}`,[])):a.collect(y(this.config).map(([n,s])=>s.parse(w(t,n)).map(o=>[n,o]).mapErr(o=>x(o,n)))).map(n=>Object.fromEntries(n)),t=>{const n={};for(const[s,o]of y(this.config))n[s]=o.serialize(t[s]);return n}),this.config=e}indexed(e){return new V(this,e)}}class V extends f{constructor(e,t){const n=[];for(const[s,o]of y(t))m(n[o]===void 0,`Duplicate index ${o} for keys "${s}" & "${n[o]}"`),n[o]=s;for(let s=0;s<n.length;s++)n[s]===void 0&&(n[s]=void 0);super(s=>typeof s!="object"||s===null?a.error(new u(`Expected an object or an array, got ${l(s)}`)):Array.isArray(s)?a.collect(y(e.config).map(([o,c])=>{const d=t[o];return c.parse(s[d]).map(p=>[o,p]).mapErr(p=>x(p,o,`(${d})`))})).map(o=>Object.fromEntries(o)):this.objectSchema.parse(s),s=>{const o=e.serialize(s);return m(typeof o=="object"&&o!==null,'Assertion Error: typeof serialized === "object" && serialized !== null'),this.keyByIndex.map(c=>c===void 0?null:w(o,c))}),this.objectSchema=e,this.indexByKey=t,this.keyByIndex=n}}class U extends f{constructor(e,t){super(n=>{if(typeof n!="object"||n===null)return a.error(new u(`Expected an object, got ${l(n)}`,[]));const s=w(n,e);if(typeof s!="string")return a.error(new u(`Expected a string for key "${e}", got ${l(s)}`,[]));const o=b(t,s)?t[s]:void 0;return o===void 0?a.error(new u(`Expected one of ${Object.keys(this.config).map(c=>JSON.stringify(c)).join(" or ")}, got ${l(s)}`,[e])):o.parse(n).mapErr(c=>x(c,`(${e} = ${s})`))},n=>{const s=n[e],o=b(t,s)?this.config[s]:null;return m(o,"Assertion Error: schema"),o.serialize(n)}),this.key=e,this.config=t}}class q extends f{constructor(e,t){for(const[n,s]of y(t))m(s.keyByIndex[0]===e,`Variant ${n} must have ${e} at index 0`);super(n=>{if(typeof n!="object"||n===null)return a.error(new u(`Expected an object or an array, got ${l(n)}`,[]));const s=Array.isArray(n);let o=Array.isArray(n)?n[0]:w(n,e);if(typeof o=="number"&&(o=String(o)),typeof o!="string")return a.error(new u(`Expected a string, got ${l(o)}`,[s?0:e]));const c=b(t,o)?t[o]:void 0;return c===void 0?a.error(new u(`Expected one of ${Object.keys(this.config).map(d=>JSON.stringify(d)).join(" or ")}, got ${l(o)}`,[s?0:e])):c.parse(n).mapErr(d=>x(d,`(${e} = ${String(o)})`))},n=>{const s=n[e],o=b(t,s)?this.config[s]:null;return m(o,"Assertion Error: schema"),o.serialize(n)}),this.key=e,this.config=t}}const i=class{constructor(r,e){this.x=r,this.y=e}static fromArgs(r){if(r.length===1)return i.from(r[0]);{const[e,t]=r;return new i(e,t)}}static fromPolar(r,e){return new i(e*Math.cos(r),e*Math.sin(r))}static average(r){return r.reduce((t,n)=>t.add(n),i.ZERO).div(r.length)}static from(r){return r instanceof i?r:Array.isArray(r)?new i(r[0],r[1]):(m("x"in r&&"y"in r,'Assertion Error: "x" in vectorIsh && "y" in vectorIsh'),new i(r.x,r.y))}static fromEvent({clientX:r,clientY:e}){return new i(r,e)}toString(r){const e=r==null?this.x:this.x.toFixed(r),t=r==null?this.y:this.y.toFixed(r);return`Vector2(${e}, ${t})`}magnitudeSquared(){return this.x*this.x+this.y*this.y}magnitude(){return Math.sqrt(this.magnitudeSquared())}angle(){return Math.atan2(this.y,this.x)}isInPolygon(r){const{x:e,y:t}=this;let n=!1;for(let s=0,o=r.length-1;s<r.length;o=s++){const{x:c,y:d}=r[s],{x:p,y:A}=r[o];d>t!=A>t&&e<(p-c)*(t-d)/(A-d)+c&&(n=!n)}return n}equals(...r){const e=i.fromArgs(r);return this===e||this.x===e.x&&this.y===e.y}distanceTo(...r){const e=i.fromArgs(r);return Math.hypot(this.x-e.x,this.y-e.y)}distanceToSquared(...r){const e=i.fromArgs(r),t=this.x-e.x,n=this.y-e.y;return t*t+n*n}angleTo(...r){return i.fromArgs(r).sub(this).angle()}angleBetween(...r){const e=i.fromArgs(r);return O(Math.atan2(e.y,e.x)-Math.atan2(this.y,this.x))}dot(...r){const e=i.fromArgs(r);return this.x*e.x+this.y*e.y}div(r){return new i(this.x/r,this.y/r)}scale(r){return new i(this.x*r,this.y*r)}negate(){return this.scale(-1)}add(...r){const e=i.fromArgs(r);return new i(this.x+e.x,this.y+e.y)}sub(...r){const e=i.fromArgs(r);return new i(this.x-e.x,this.y-e.y)}floor(){return new i(Math.floor(this.x),Math.floor(this.y))}ceil(){return new i(Math.ceil(this.x),Math.ceil(this.y))}round(){return new i(Math.round(this.x),Math.round(this.y))}withMagnitude(r){return this.scale(r/this.magnitude())}normalize(){return this.withMagnitude(1)}withAngle(r){return i.fromPolar(r,this.magnitude())}rotate(r){return this.withAngle(this.angle()+r)}rotateAround(r,e){r=i.from(r);const t=Math.sin(e),n=Math.cos(e),s=this.x-r.x,o=this.y-r.y,c=s*n-o*t,d=s*t+o*n;return new i(c+r.x,d+r.y)}lerp(r,e){return r=i.from(r),new i(j(this.x,r.x,e),j(this.y,r.y,e))}perpendicular(){return new i(this.y,-this.x)}project(r,e){return i.from(r).scale(e).add(this)}};let $=i;$.schema=f.object({x:f.number,y:f.number}).indexed({x:0,y:1}).transform(({x:r,y:e})=>a.ok(new i(r,e)),({x:r,y:e})=>({x:r,y:e}));$.ZERO=new i(0,0);$.UNIT=new i(1,1);$.X=new i(1,0);$.Y=new i(0,1);export{a as R,f as S,$ as V,u as a};
