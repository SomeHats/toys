import{a as D,b as pe,t as R,s as rt,L as ot,h as be,g as Y,M as A,N as it,f as ee,l as st,D as at,C as xe,F as ct,O as lt,c as k,P as Z,e as ut,r as Oe}from"../chunks/chunk_assert.66f3ec42.js";/* empty css                               */import{a as dt,r as z}from"../chunks/chunk_index.b0b8f4df.js";import{R as pt,j as P,c as $,F as $e,a as W}from"../chunks/chunk_ResizeObserver.38aa3088.js";import{V as w,b as ye,R as ne,P as ft,d as ht,c as Q,a as gt,e as Le,f as mt,p as vt}from"../chunks/chunk_Vector2.e9b23424.js";import{A as Fe}from"../chunks/chunk_AABB.36b4d245.js";var ge=function e(t,n){if(t===n)return!0;if(t&&n&&typeof t=="object"&&typeof n=="object"){if(t.constructor!==n.constructor)return!1;var r,o,i;if(Array.isArray(t)){if(r=t.length,r!=n.length)return!1;for(o=r;o--!==0;)if(!e(t[o],n[o]))return!1;return!0}if(t.constructor===RegExp)return t.source===n.source&&t.flags===n.flags;if(t.valueOf!==Object.prototype.valueOf)return t.valueOf()===n.valueOf();if(t.toString!==Object.prototype.toString)return t.toString()===n.toString();if(i=Object.keys(t),r=i.length,r!==Object.keys(n).length)return!1;for(o=r;o--!==0;)if(!Object.prototype.hasOwnProperty.call(n,i[o]))return!1;for(o=r;o--!==0;){var s=i[o];if(!e(t[s],n[s]))return!1}return!0}return t!==t&&n!==n},Ue,Ve=dt.exports;Ue=Ve.createRoot,Ve.hydrateRoot;let fe;const re=new Map,Be=new WeakMap;function yt(e){for(const t of e){Be.set(t.target,t);for(const n of pe(re.get(t.target),"callback does not exist for tracked entry"))n(t)}}function je(){return fe||(fe=new pt(yt)),fe}function wt(e,t){let n=re.get(e);n||(n=new Set,re.set(e,n),je().observe(e));const r=Be.get(e);r&&t(r),n.add(t)}function Pt(e,t){const n=re.get(e);D(n,"element is not tracked");const r=n.delete(t);D(r,"callback did not exist for element"),n.size===0&&(re.delete(e),je().unobserve(e))}function St(e,t){const[n,r]=z.exports.useState(null);return z.exports.useLayoutEffect(()=>{if(!e)return;const o=i=>{console.log({entry:i}),r(t(i))};return wt(e,o),()=>{Pt(e,o)}},[e,t]),n}function Et(e){return new w(e.contentRect.width,e.contentRect.height)}const Ct="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");class we{constructor(t,n=16){this.randomLength=n,this.debugIdCounter=0,this.prefix=t,this.Id=`${t}.SAMPLE`;const r=new RegExp(`^${this.prefix}\\.([a-zA-Z0-9_]+)$`);this.parse=ye(ht,o=>r.test(o)?ne.ok(o):ne.error(new ft(`Expected ${this.prefix}.*, got ${o}`,[])))}generate(){const t=R(this.randomLength,()=>rt(Ct)).join("");return`${this.prefix}.${t}`}}const G=new we("key"),It=Q({id:G.parse,position:w.parse}),Pe=new we("shv"),Dt=Q({id:Pe.parse,keyPointId:G.parse,rawPoints:gt(w.parse)}),We=new we("doc"),Tt=Q({id:We.parse,keyPoints:Le(G.parse,It),shapeVersions:Le(Pe.parse,Dt)});function zt(){return{id:We.generate(),keyPoints:{},shapeVersions:{}}}const kt=30,bt=500,xt=10,te={size:16,streamline:.5,smoothing:.5,thinning:.5,simulatePressure:!0,easing:e=>e,start:{},end:{},last:!1};class Se{constructor(t,n,r,o,i){this.id=t,this.keyPoints=n,this.shapeVersions=r,this.keyPointIdByShapeVersion=o,this.normalizedShapeVersions=i}with(t){var n,r,o,i,s;return new Se((n=t.id)!=null?n:this.id,(r=t.keyPoints)!=null?r:this.keyPoints,(o=t.shapeVersions)!=null?o:this.shapeVersions,(i=t.keyPointIdByShapeVersion)!=null?i:this.keyPointIdByShapeVersion,(s=t.normalizedCenterPointsByShapeVersion)!=null?s:this.normalizedShapeVersions)}}class V{static fromArray(t){return new V(ot(t.map(n=>[n.id,n])))}constructor(t){this.data=t}has(t){return be(this.data,t)}getIfExists(t){return Y(this.data,t)}get(t){const n=this.getIfExists(t);return D(n!=null,`Item with id ${t} not found`),n}insert(t){return new V({...this.data,[t.id]:t})}update(t,n){const r=this.get(t),o=A(r,n);return D(r.id===o.id),this.insert(o)}delete(t){const{[t]:n,...r}=this.data;return new V(r)}*[Symbol.iterator](){for(const t in this.data)be(this.data,t)&&(yield pe(this.data[t]))}}class q{constructor(t={}){this.inverse=t}static build(t,n){const r={};for(const o of n){const i=o.id,s=o[t],a=Y(r,s);a?a.push(i):r[s]=[i]}return new q(r)}lookupInverseIfExists(t){var n;return(n=Y(this.inverse,t))==null?void 0:n[0]}lookupInverse(t){const n=this.lookupInverseIfExists(t);return D(n!=null,`Item with id ${t} not found`),n}add(t,n){const r=Y(this.inverse,n);return r?(D(!r.includes(t),`relation ${n}<->${t} already exists in index`),new q({...this.inverse,[n]:[...r,t]})):new q({...this.inverse,[n]:[t]})}remove(t,n){const r=Y(this.inverse,n);if(r){const o=r.indexOf(t);if(o>=0)return r.length>1?new q({...this.inverse,[n]:it(r,o)}):new q({...this.inverse,[n]:void 0})}ee(`relation ${n}<->${t} not found in index`)}}const{min:j,PI:mn}=Math,Ne=.275;function Ze(e,t={}){const{size:n=16,smoothing:r=.5,thinning:o=.5,simulatePressure:i=!0,easing:s=y=>y,start:a={},end:c={}}=t,{easing:l=y=>y*(2-y)}=a,{easing:d=y=>--y*y*y+1}=c;if(e.length===0||n<=0)return[];const u=e[e.length-1].runningLength,p=a.taper===!1?0:a.taper===!0?Math.max(n,u):a.taper,m=c.taper===!1?0:c.taper===!0?Math.max(n,u):c.taper,g=Math.pow(n*r,2),f=[];let v=e.slice(0,10).reduce((y,O)=>{let B=O.pressure;if(i){const ce=j(1,O.distance/n),K=j(1,1-ce);B=j(1,y+(K-y)*(ce*Ne))}return(y+B)/2},e[0].pressure),h=Me(n,o,e[e.length-1].pressure,s),E=e[0].point,S=E;for(let y=0;y<e.length;y++){let{pressure:O}=e[y];const{point:B,distance:ce,runningLength:K}=e[y];if(y<e.length-1&&u-K<3)continue;if(o){if(i){const ke=j(1,ce/n),nt=j(1,1-ke);O=j(1,v+(nt-v)*(ke*Ne))}h=Me(n,o,O,s)}else h=n/2;const et=K<p?l(K/p):1,tt=u-K<m?d((u-K)/m):1;if(h=Math.max(.01,h*Math.min(et,tt)),y===e.length-1){f.push({center:B,radius:h});continue}S=B,(y<=1||E.distanceToSq(S)>g)&&(f.push({center:B,radius:h}),E=S),v=O}return f}function Qe(e,t={}){var p,m;const{streamline:n=.5,size:r=16,last:o=!1}=t;if(e.length===0)return[];const i=.15+(1-n)*.85;let s=e.map(g=>({point:w.fromVectorLike(g),pressure:g.pressure}));if(s.length===2){const g=s[1];s=s.slice(0,-1);for(let f=1;f<5;f++)s.push({point:s[0].point.lerp(g.point,f/4),pressure:g.pressure})}s.length===1&&s.push({point:s[0].point.add(w.UNIT),pressure:s[0].pressure});const a=[{point:s[0].point,pressure:s[0].pressure!=null&&s[0].pressure>=0?s[0].pressure:.25,vector:w.UNIT,distance:0,runningLength:0}];let c=!1,l=0,d=a[0];const u=s.length-1;for(let g=1;g<s.length;g++){const f=s[g],v=o&&g===u?f.point:d.point.lerp(f.point,i);if(d.point.equals(v))continue;const h=v.distanceTo(d.point);if(l+=h,g<u&&!c){if(l<r)continue;c=!0}d={point:v,pressure:f.pressure!=null&&f.pressure>=0?f.pressure:.5,vector:d.point.sub(v).normalize(),distance:h,runningLength:l},a.push(d)}return a[0].vector=(m=(p=a[1])==null?void 0:p.vector)!=null?m:w.ZERO,a}function Me(e,t,n,r=o=>o){return e*r(.5-t*(.5-n))}function Ot(e){if(!e.length)return"";const t=["M",e[0].x,e[0].y,"Q"];for(let n=0;n<e.length;n++){const r=e[n],o=e[(n+1)%e.length],i=r.add(o).scale(.5);t.push(r.x,r.y,i.x,i.y)}return t.push("Z"),t.join(" ")}function Ge(e,t){const n=[e[0]];if(e.length===0)return[];let r=t,o=e[0],i=e[0].center;for(let s=1;s<e.length;s++){const a=e[s],c=e[Math.min(s+1,e.length-1)],l=a.center.add(c.center).scale(.5),d=a.center.distanceTo(o.center),u=i,p=a.center,m=l;let g=0;for(;d-g>=r;){const f=(r+g)/d;n.push({center:u.lerp(p,f).lerp(p.lerp(m,f),f),radius:st(o.radius,a.radius,f)}),g+=r,r=t}r-=d-g,o=a,i=l}return n.push(e[e.length-1]),n}function he(e){var o,i;if(e.length===0)return{versions:new V({})};const t=[];let n=0;for(const s of e){const a=Qe(s.rawPoints),c=(i=(o=a[a.length-1])==null?void 0:o.runningLength)!=null?i:0;t.push({id:s.id,strokePoints:a,length:c}),c>n&&(n=c)}const r=Math.floor(n/te.size);return{versions:V.fromArray(t.map(({strokePoints:s,length:a,id:c})=>({id:c,length:a,normalizedCenterPoints:Ge(Ze(s,te),a/r)})))}}function M(){}M.prototype={diff:function(t,n){var r=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},o=r.callback;typeof r=="function"&&(o=r,r={}),this.options=r;var i=this;function s(f){return o?(setTimeout(function(){o(void 0,f)},0),!0):f}t=this.castInput(t),n=this.castInput(n),t=this.removeEmpty(this.tokenize(t)),n=this.removeEmpty(this.tokenize(n));var a=n.length,c=t.length,l=1,d=a+c;r.maxEditLength&&(d=Math.min(d,r.maxEditLength));var u=[{newPos:-1,components:[]}],p=this.extractCommon(u[0],n,t,0);if(u[0].newPos+1>=a&&p+1>=c)return s([{value:this.join(n),count:n.length}]);function m(){for(var f=-1*l;f<=l;f+=2){var v=void 0,h=u[f-1],E=u[f+1],S=(E?E.newPos:0)-f;h&&(u[f-1]=void 0);var y=h&&h.newPos+1<a,O=E&&0<=S&&S<c;if(!y&&!O){u[f]=void 0;continue}if(!y||O&&h.newPos<E.newPos?(v=Vt(E),i.pushComponent(v.components,void 0,!0)):(v=h,v.newPos++,i.pushComponent(v.components,!0,void 0)),S=i.extractCommon(v,n,t,f),v.newPos+1>=a&&S+1>=c)return s(Lt(i,v.components,n,t,i.useLongestToken));u[f]=v}l++}if(o)(function f(){setTimeout(function(){if(l>d)return o();m()||f()},0)})();else for(;l<=d;){var g=m();if(g)return g}},pushComponent:function(t,n,r){var o=t[t.length-1];o&&o.added===n&&o.removed===r?t[t.length-1]={count:o.count+1,added:n,removed:r}:t.push({count:1,added:n,removed:r})},extractCommon:function(t,n,r,o){for(var i=n.length,s=r.length,a=t.newPos,c=a-o,l=0;a+1<i&&c+1<s&&this.equals(n[a+1],r[c+1]);)a++,c++,l++;return l&&t.components.push({count:l}),t.newPos=a,c},equals:function(t,n){return this.options.comparator?this.options.comparator(t,n):t===n||this.options.ignoreCase&&t.toLowerCase()===n.toLowerCase()},removeEmpty:function(t){for(var n=[],r=0;r<t.length;r++)t[r]&&n.push(t[r]);return n},castInput:function(t){return t},tokenize:function(t){return t.split("")},join:function(t){return t.join("")}};function Lt(e,t,n,r,o){for(var i=0,s=t.length,a=0,c=0;i<s;i++){var l=t[i];if(l.removed){if(l.value=e.join(r.slice(c,c+l.count)),c+=l.count,i&&t[i-1].added){var u=t[i-1];t[i-1]=t[i],t[i]=u}}else{if(!l.added&&o){var d=n.slice(a,a+l.count);d=d.map(function(m,g){var f=r[c+g];return f.length>m.length?f:m}),l.value=e.join(d)}else l.value=e.join(n.slice(a,a+l.count));a+=l.count,l.added||(c+=l.count)}}var p=t[s-1];return s>1&&typeof p.value=="string"&&(p.added||p.removed)&&e.equals("",p.value)&&(t[s-2].value+=p.value,t.pop()),t}function Vt(e){return{newPos:e.newPos,components:e.components.slice(0)}}var Ke=/^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/,Re=/\S/,Je=new M;Je.equals=function(e,t){return this.options.ignoreCase&&(e=e.toLowerCase(),t=t.toLowerCase()),e===t||this.options.ignoreWhitespace&&!Re.test(e)&&!Re.test(t)};Je.tokenize=function(e){for(var t=e.split(/([^\S\r\n]+|[()[\]{}'"\r\n]|\b)/),n=0;n<t.length-1;n++)!t[n+1]&&t[n+2]&&Ke.test(t[n])&&Ke.test(t[n+2])&&(t[n]+=t[n+2],t.splice(n+1,2),n--);return t};var Ee=new M;Ee.tokenize=function(e){var t=[],n=e.split(/(\n|\r\n)/);n[n.length-1]||n.pop();for(var r=0;r<n.length;r++){var o=n[r];r%2&&!this.options.newlineIsToken?t[t.length-1]+=o:(this.options.ignoreWhitespace&&(o=o.trim()),t.push(o))}return t};function Nt(e,t,n){return Ee.diff(e,t,n)}var Mt=new M;Mt.tokenize=function(e){return e.split(/(\S.+?[.!?])(?=\s+|$)/)};var Kt=new M;Kt.tokenize=function(e){return e.split(/([{}:;,]|\s+)/)};function ue(e){return typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?ue=function(t){return typeof t}:ue=function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},ue(e)}var Rt=Object.prototype.toString,oe=new M;oe.useLongestToken=!0;oe.tokenize=Ee.tokenize;oe.castInput=function(e){var t=this.options,n=t.undefinedReplacement,r=t.stringifyReplacer,o=r===void 0?function(i,s){return typeof s>"u"?n:s}:r;return typeof e=="string"?e:JSON.stringify(me(e,null,null,o),o,"  ")};oe.equals=function(e,t){return M.prototype.equals.call(oe,e.replace(/,([\r\n])/g,"$1"),t.replace(/,([\r\n])/g,"$1"))};function me(e,t,n,r,o){t=t||[],n=n||[],r&&(e=r(o,e));var i;for(i=0;i<t.length;i+=1)if(t[i]===e)return n[i];var s;if(Rt.call(e)==="[object Array]"){for(t.push(e),s=new Array(e.length),n.push(s),i=0;i<e.length;i+=1)s[i]=me(e[i],t,n,r,o);return t.pop(),n.pop(),s}if(e&&e.toJSON&&(e=e.toJSON()),ue(e)==="object"&&e!==null){t.push(e),s={},n.push(s);var a=[],c;for(c in e)e.hasOwnProperty(c)&&a.push(c);for(a.sort(),i=0;i<a.length;i+=1)c=a[i],s[c]=me(e[c],t,n,r,c);t.pop(),n.pop()}else s=e;return s}var ve=new M;ve.tokenize=function(e){return e.slice()};ve.join=ve.removeEmpty=function(e){return e};class F{constructor(t,n=0,r=!0){if(this.data=t,this.version=n,!r)return;const o=this.serialize(),i=F.deserialize(o,this.version);if(!ge(this,i)){const s=JSON.stringify(this,null,2),a=JSON.stringify(i,null,2),c=Nt(s,a);console.log(c),ee(`Mismatch after update:
Actual:
${JSON.stringify(this,null,2)}

Expected:
${JSON.stringify(i,null,2)}`)}}static create(){return F.deserialize(zt())}static deserialize(t,n=0){const r=new V(t.shapeVersions);return new F(new Se(t.id,new V(t.keyPoints),r,q.build("keyPointId",r),he(Array.from(r)).versions),n,!1)}with(...t){return new F(this.data.with(...t),this.version+1)}serialize(){return{id:this.data.id,keyPoints:this.data.keyPoints.data,shapeVersions:this.data.shapeVersions.data}}get keyPoints(){return this.data.keyPoints}get shapeVersions(){return this.data.shapeVersions}getShapeVersionForKeyPoint(t){return this.shapeVersions.get(this.data.keyPointIdByShapeVersion.lookupInverse(t))}addKeyPoint(t,n){console.log("doc.addKeyPoint",t);const r=Pe.generate(),o=this.keyPoints.insert({id:t,position:n}),i=this.shapeVersions.insert({id:r,keyPointId:t,rawPoints:[]});return this.with({keyPoints:o,shapeVersions:i,keyPointIdByShapeVersion:this.data.keyPointIdByShapeVersion.add(r,t),normalizedCenterPointsByShapeVersion:he(Array.from(i)).versions})}updateKeypoint(t,n){return this.with({keyPoints:this.keyPoints.update(t,n)})}replaceShapeVersionPoints(t,n){console.log("doc.replaceShapeVersionPoints",t);const r=this.shapeVersions.insert({...this.shapeVersions.get(t),rawPoints:n});return this.with({shapeVersions:r,normalizedCenterPointsByShapeVersion:he(Array.from(r)).versions})}}var C=(e=>(e.Draw="draw",e.KeyPoint="keyPoint",e))(C||{});const qt=mt(C);var ie=(e=>(e.Pan="quickPan",e))(ie||{});const At=Q({pan:w.parse,zoom:vt});class $t{constructor({pan:t,zoom:n},r,o){this.screenSize=r,this.update=o,this.pan=t,this.zoom=n}handleWheelEvent(t){console.log("wheel",t),t.preventDefault(),t.stopImmediatePropagation();const{deltaX:n,deltaY:r}=t;if(t.ctrlKey){const o=w.fromEvent(t);this.update(({pan:i,zoom:s})=>{const a=Math.exp(-r/100)*s,c=o.add(i).scale(a/s).sub(o);return{zoom:a,pan:c}})}else this.update(({pan:o,zoom:i})=>({pan:o.add(new w(n,r)),zoom:i}))}origin(){return this.pan.sub(this.screenSize.scale(.5*this.zoom))}visibleSceneBounds(){return new Fe(this.origin(),this.screenSize)}screenToScene(t){return t.add(this.origin()).scale(1/this.zoom)}sceneToScreen(t){return t.scale(this.zoom).sub(this.origin())}eventSceneCoords(t){return this.screenToScene(w.fromEvent(t))}getSceneTransform(){const t=this.origin();return`translate(${-t.x}, ${-t.y}) scale(${this.zoom}) `}}const Ft=Q({keyPointId:G.parse,viewport:At,tool:qt}),Ce=class{constructor({keyPointId:e,viewport:t={pan:w.ZERO,zoom:1},tool:n=C.Draw}){this.keyPointId=e,this.viewportState=t,this.tool=n}serialize(){return{keyPointId:this.keyPointId,viewport:this.viewportState,tool:this.tool}}with(e){var t,n,r;return new Ce({keyPointId:(t=e.keyPointId)!=null?t:this.keyPointId,viewport:(n=e.viewport)!=null?n:this.viewportState,tool:(r=e.tool)!=null?r:this.tool})}};let Ie=Ce;Ie.parse=ye(Ft,e=>ne.ok(new Ce(e)));const Ut=Q({doc:ye(Tt,e=>ne.ok(F.deserialize(e))),location:Ie.parse});function Bt(e){return xe(`splatapus.${e}`)?Ut(xe(`splatapus.${e}`)).mapErr(n=>n.toString()):ne.error("No saved data found")}function jt(e,{doc:t,location:n}){ct(`splatapus.${e}`,{doc:t.serialize(),location:n.serialize()})}const Wt=at(bt,jt);function qe(){const e=G.generate();return{doc:F.create().addKeyPoint(e,w.ZERO),location:new Ie({keyPointId:e})}}function He(e){const t=z.exports.useRef();return z.exports.useLayoutEffect(()=>{t.current=e}),z.exports.useCallback((...n)=>{const r=t.current;return D(r,"fn does not exist"),r(...n)},[])}function Zt(e){return lt?e.metaKey:e.ctrlKey}function Xe(e,t){var r,o,i;const n=typeof t=="string"?{key:t}:t;return e.key.toLowerCase()===n.key.toLowerCase()&&((r=n.command)!=null?r:!1)===Zt(e)&&((o=n.shift)!=null?o:!1)===e.shiftKey&&((i=n.alt)!=null?i:!1)===e.altKey}function T(e,t){return Xe(e,t)&&e.repeat===!1}function Qt(e){return null}function De(){return function(t){return{getCanvasClassName:n=>"",getPreviewPosition:n=>null,Overlay:Qt,...t}}}function Te(e){const t={initialize:n=>({state:"idle",childState:n}),isIdle:n=>n.state==="idle",getState:n=>n.childState,onPointerEvent:(n,r,o)=>{switch(n.eventType){case"down":switch(r.state){case"idle":{const i=e.onDragStart(n,r.childState,o);return i?(n.event.preventDefault(),e.onTap?{state:"dragUnconfirmed",pointerId:n.event.pointerId,startPosition:w.fromEvent(n.event),childState:i,startArg:o}:{state:"dragConfirmed",pointerId:n.event.pointerId,childState:i,startArg:o}):r}case"dragUnconfirmed":case"dragConfirmed":return r;default:throw k(r)}case"move":switch(r.state){case"idle":return r;case"dragUnconfirmed":{if(r.pointerId!==n.event.pointerId)return r;const i=e.onDragMove(n,r.childState);return r.startPosition.distanceTo(w.fromEvent(n.event))>=xt?{state:"dragConfirmed",pointerId:r.pointerId,childState:i,startArg:r.startArg}:Object.is(r.childState,i)?r:{...r,childState:i}}case"dragConfirmed":{if(r.pointerId!==n.event.pointerId)return r;const i=e.onDragMove(n,r.childState);return Object.is(r.childState,i)?r:{...r,childState:i}}default:throw k(r)}case"up":switch(r.state){case"idle":return r;case"dragUnconfirmed":{if(r.pointerId!==n.event.pointerId)return r;let i=e.onDragCancel(n,r.childState);return i=e.onTap?e.onTap(n,i,r.startArg):i,{state:"idle",childState:i}}case"dragConfirmed":{if(r.pointerId!==n.event.pointerId)return r;const i=e.onDragEnd(n,r.childState);return{state:"idle",childState:i}}default:throw k(r)}case"cancel":switch(r.state){case"idle":return r;case"dragUnconfirmed":case"dragConfirmed":{if(r.pointerId!==n.event.pointerId)return r;const i=e.onDragCancel(n,r.childState);return{state:"idle",childState:i}}default:throw k(r)}default:k(n.eventType)}},createOnPointerEvent:n=>(r,o,i)=>Z(o,n,s=>t.onPointerEvent(r,s,i))};return t}const J=Te({onDragStart:({event:e,viewport:t})=>({state:"drawing",points:[t.eventSceneCoords(e)]}),onDragMove:({event:e,viewport:t},n)=>({state:"drawing",points:[...n.points,t.eventSceneCoords(e)]}),onDragEnd:({updateDocument:e,location:t},n)=>(e(r=>r.replaceShapeVersionPoints(r.getShapeVersionForKeyPoint(t.keyPointId).id,n.points)),{state:"idle"}),onDragCancel:(e,t)=>({state:"idle"})}),se=De()({initialize:()=>({type:C.Draw,gesture:J.initialize({state:"idle"})}),isIdle:e=>J.isIdle(e.gesture),getDebugProperties:e=>{const t=J.getState(e.gesture);switch(t.state){case"idle":return{_:"idle"};case"drawing":return{_:"drawing",points:String(t.points.length)};default:k(t)}},getState:e=>J.getState(e.gesture),onPointerEvent:J.createOnPointerEvent("gesture")}),ze={interpolated:e=>({type:"interpolated",scenePosition:e}),keyPointId:e=>({type:"keyPointId",keyPointId:e}),toDebugString:e=>{switch(e.type){case"interpolated":return`interpolated(${e.scenePosition.toString(2)})`;case"keyPointId":return`keyPointId(${e.keyPointId})`;default:k(e)}}};function Gt({position:e,children:t,className:n,style:r,...o}){return P("div",{className:$("absolute top-0 left-0",n),style:{transform:`translate(${e.x}px, ${e.y}px)`,...r},...o,children:t})}function Jt({position:e,viewport:t,screenOffset:n=w.ZERO,...r}){return P(Gt,{position:t.sceneToScreen(e).add(n),...r})}const H=Te({onTap:({updateLocation:e},t,n)=>(n&&e(r=>r.with({keyPointId:n})),t),onDragStart:({updateLocation:e,viewport:t,event:n},r,o)=>o?(e(i=>i.with({keyPointId:o})),{state:"moving",keyPointId:o,delta:w.ZERO,startingPosition:t.eventSceneCoords(n)}):null,onDragMove:({viewport:e,event:t},n)=>({...n,delta:e.eventSceneCoords(t).sub(n.startingPosition)}),onDragEnd:({event:e,viewport:t,updateDocument:n},r)=>{const o=t.eventSceneCoords(e).sub(r.startingPosition);return n(i=>i.updateKeypoint(r.keyPointId,s=>({...s,position:s.position.add(o)}))),{state:"idle"}},onDragCancel:()=>({state:"idle"})}),Ht=new w(-12,-12),ae=De()({initialize:()=>({type:C.KeyPoint,gesture:H.initialize({state:"idle"}),previewPosition:null}),isIdle:e=>!0,getDebugProperties:e=>{const t=H.getState(e.gesture);switch(t.state){case"idle":return{_:t.state};case"moving":return{_:t.state,keyPointId:t.keyPointId,delta:t.delta.toString(2)}}},getPreviewPosition:e=>H.isIdle(e.gesture)&&e.previewPosition?ze.interpolated(e.previewPosition):null,onPointerEvent:(e,t,n)=>({...t,previewPosition:e.viewport.eventSceneCoords(e.event),gesture:H.onPointerEvent(e,t.gesture,n)}),Overlay:({tool:e,document:t,viewport:n,location:r,onUpdateTool:o})=>{const i=H.getState(e.gesture);return P($e,{children:Array.from(t.data.keyPoints,(s,a)=>{const c=i.state==="moving"&&i.keyPointId===s.id?s.position.add(i.delta):s.position;return P(Jt,{position:c,screenOffset:Ht,viewport:n,className:$("flex h-6 w-6 cursor-move items-center justify-center rounded-full border border-stone-200 bg-white text-xs text-stone-400 shadow-md",s.id===r.keyPointId?"text-stone-500 ring-2 ring-inset ring-purple-400":"text-stone-400"),onPointerDown:l=>{o((d,u)=>ae.onPointerEvent({...d,event:l,eventType:"down"},u,s.id))},children:a+1},s.id)})})}}),le=Te({onDragStart:({event:e,location:t})=>({state:"active",initialPan:t.viewportState.pan,previousScreenPoint:w.fromEvent(e)}),onDragMove:({event:e,updateViewport:t},n)=>{const r=w.fromEvent(e);return t(({pan:o,zoom:i})=>({pan:o.add(n.previousScreenPoint.sub(r).scale(i)),zoom:i})),{...n,previousScreenPoint:r}},onDragEnd:()=>({state:"idle"}),onDragCancel:({updateViewport:e},t)=>(e(({zoom:n})=>({zoom:n,pan:t.initialPan})),{state:"idle"})}),de=De()({initialize:()=>({type:ie.Pan,gesture:le.initialize({state:"idle"})}),getDebugProperties:e=>{const t=le.getState(e.gesture);switch(t.state){case"idle":return{_:t.state};case"active":return{_:t.state,initialPan:t.initialPan.toString(2),previousScreenPoint:t.previousScreenPoint.toString(0)}}},isIdle:e=>le.isIdle(e.gesture),getCanvasClassName:e=>de.isIdle(e)?"cursor-grab":"cursor-grabbing",gesture:le}),Ye={[C.Draw]:se,[C.KeyPoint]:ae,[ie.Pan]:de};function _(e){return Ye[e]}function _e(e){const t=_(e.type).getDebugProperties(e),n=ut(t).map(([r,o])=>r.startsWith("_")?o:`${r} = ${o}`).join(", ");return`${e.type}(${n})`}const L={initialize:e=>_(e).initialize(),initializeForKeyDown:({event:e})=>T(e,"d")?se.initialize():T(e,"k")?ae.initialize():null,isIdle:e=>_(e.type).isIdle(e),getCanvasClassName:e=>_(e.type).getCanvasClassName(e),getPreviewPosition:e=>_(e.type).getPreviewPosition(e),toDebugString:_e,onPointerEvent:(e,t)=>{switch(t.type){case C.Draw:return se.onPointerEvent(e,t);case C.KeyPoint:return ae.onPointerEvent(e,t);default:k(t)}}},X={initializeForKeyDown:({event:e})=>T(e," ")?de.initialize():null,toDebugString:_e,getCanvasClassName:e=>Ye[e.type].getCanvasClassName(e),onPointerEvent:(e,t)=>{switch(t.type){case ie.Pan:return Z(t,"gesture",n=>de.gesture.onPointerEvent(e,n))}},onKeyUp:({event:e},t)=>{switch(t.type){case ie.Pan:return Xe(e," ")?null:t}}},N={initialize:e=>({undoStates:[],redoStates:[],pendingOp:null,current:{...e,options:{}}}),beginOperation:e=>{const t=Math.random();return D(e.pendingOp==null,"pending op already in progress"),{undoStack:{...e,pendingOp:{txId:t,initialDoc:e.current.doc,initialOptions:e.current.options},current:{...e.current,options:{}}},txId:t}},updateOperation:(e,t,n)=>{var r;return D(((r=e.pendingOp)==null?void 0:r.txId)===t,"pending op mismatch"),{...e,current:{...e.current,doc:A(e.current.doc,n)}}},revertOperation:(e,t)=>{var n;return D(((n=e.pendingOp)==null?void 0:n.txId)===t,"Pending op mismatch"),{...e,pendingOp:null,current:{doc:e.pendingOp.initialDoc,location:e.current.location,options:e.pendingOp.initialOptions}}},commitOperation:(e,t,n={})=>{var i;D(((i=e.pendingOp)==null?void 0:i.txId)===t,"Pending op mismatch");const r=[{doc:e.pendingOp.initialDoc,location:e.current.location,options:e.pendingOp.initialOptions},...e.undoStates];for(;r.length>kt;)r.pop();const o={...e.current,options:n};return n.lockstepLocation&&(o.location=A(o.location,n.lockstepLocation)),{...e,current:o,pendingOp:null,undoStates:r,redoStates:null}},updateDocument:(e,t,n)=>{let r;return{undoStack:e,txId:r}=N.beginOperation(e),e=N.updateOperation(e,r,t),N.commitOperation(e,r,n)},undo:e=>{var o;if(D(e.pendingOp==null,"Pending op in progress"),e.undoStates.length==0)return e;const[t,...n]=e.undoStates;if(!ge(t.location,e.current.location)&&!e.current.options.lockstepLocation)return{...e,current:{...e.current,location:t.location}};const r=[e.current,...(o=e.redoStates)!=null?o:[]];return{...e,current:t,undoStates:n,redoStates:r}},redo:e=>{if(D(e.pendingOp==null,"pending op in progress"),!e.redoStates||e.redoStates.length==0)return e;const[t,...n]=e.redoStates;if(!ge(t.location,e.current.location)&&!t.options.lockstepLocation)return{...e,current:{...e.current,location:t.location}};const r=[e.current,...e.undoStates];return{...e,current:t.options.lockstepLocation?{...t,location:A(e.current.location,t.options.lockstepLocation)}:t,undoStates:r,redoStates:n.length===0?null:n}},updateLocation:(e,t)=>({...e,current:{...e.current,location:A(e.current.location,t)}})},b={initialize:e=>({quickTool:null,selectedTool:L.initialize(e)}),toDebugString:e=>e.quickTool?X.toDebugString(e.quickTool):L.toDebugString(e.selectedTool),getCanvasClassName:e=>e.quickTool?X.getCanvasClassName(e.quickTool):L.getCanvasClassName(e.selectedTool),getPreviewPosition:e=>L.getPreviewPosition(e.selectedTool),updateSelectedTool:(e,t)=>Z(e,"selectedTool",t),updateQuickTool:(e,t)=>Z(e,"quickTool",t),requestSetSelectedTool:(e,t)=>e.quickTool||!L.isIdle(e.selectedTool)?e:{...e,selectedTool:L.initialize(t)},onKeyDown:(e,t)=>{if(L.isIdle(t.selectedTool)){if(!t.quickTool){const o=X.initializeForKeyDown(e);if(o)return{...t,quickTool:o}}const r=L.initializeForKeyDown(e);if(r&&!t.quickTool)return{...t,selectedTool:r};if(T(e.event,{key:"z",command:!0}))return e.updateUndoStack(o=>N.undo(o)),t;if(T(e.event,{key:"z",command:!0,shift:!0}))return e.updateUndoStack(o=>N.redo(o)),t}if(T(e.event,{key:"0",command:!0}))return e.updateViewport({pan:w.ZERO,zoom:1}),t;const n=r=>{var i;const o=(i=[...e.document.keyPoints][r])==null?void 0:i.id;o&&e.updateLocation(s=>s.with({keyPointId:o}))};return T(e.event,"1")&&n(0),T(e.event,"2")&&n(1),T(e.event,"3")&&n(2),T(e.event,"4")&&n(3),T(e.event,"5")&&n(4),T(e.event,"6")&&n(5),T(e.event,"7")&&n(6),T(e.event,"8")&&n(7),T(e.event,"9")&&n(8),t},onKeyUp:(e,t)=>{if(t.quickTool){const n=X.onKeyUp(e,t.quickTool);if(n!==t.quickTool)return{...t,quickTool:n}}return t},onPointerEvent:(e,t)=>t.quickTool?b.updateQuickTool(t,n=>X.onPointerEvent(e,pe(n))):b.updateSelectedTool(t,n=>L.onPointerEvent(e,n)),Overlay:({interaction:e,onUpdateInteraction:t,...n})=>{const r=o=>t((i,s)=>b.updateSelectedTool(s,a=>(D(a.type===s.selectedTool.type),o(i,a))));switch(e.selectedTool.type){case C.Draw:return P(se.Overlay,{tool:e.selectedTool,onUpdateTool:r,...n});case C.KeyPoint:return P(ae.Overlay,{tool:e.selectedTool,onUpdateTool:r,...n});default:k(e.selectedTool)}}};function Xt({selectedToolType:e,updateInteraction:t}){const n=r=>()=>t((o,i)=>b.requestSetSelectedTool(i,r));return W("div",{className:"pointer-events-none absolute top-0 bottom-0 flex cursor-wait flex-col items-center justify-center gap-3 p-3",children:[P(Ae,{letter:"d",isSelected:e===C.Draw,onClick:n(C.Draw)}),P(Ae,{letter:"k",isSelected:e===C.KeyPoint,onClick:n(C.KeyPoint)})]})}function Ae({letter:e,onClick:t,isSelected:n}){return P("button",{className:$("pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white shadow-md",n?"text-stone-500 ring-2 ring-inset ring-purple-400":"text-stone-400"),onClick:t,children:e})}class U{static distance(t,n){let r=0;for(let o=0;o<t.length;o++)r+=Math.pow(t[o]-n[o],2);return Math.sqrt(r)}static kernel(t,n){const r=U.distance(t,n);return r===0?0:Math.pow(r,2)*Math.log(r)}constructor(t,n){t.length===0&&ee("bad centers array :/"),t.every(l=>l.length===t[0].length)||ee("centers must have same dimensions :/"),this.centers=t;const r=n.slice(),o=[],i=[];for(let l=0;l<t.length;l++){const d=[],u=[1];for(let p=0;p<t[l].length;p++)u.push(t[l][p]);for(let p=0;p<t.length;p++)d.push(U.kernel(t[l],t[p]));i.push(u),o.push(d.concat(u))}const a=I.transpose(i).map(l=>{for(let d=l.length;d<o[0].length;d++)l.push(0);return l});for(let l=0;l<a.length;l++)o.push(a[l]),r.push(0);const c=this.solve(r,o);c||ee("rbf failed to compile with given centers./nCenters must be unique :/"),this.ws=c}solve(t,n){const r=I.inverse(n);return r?I.multiplyVector(r,t):null}getValue(t){D(this.ws);let n=0,r=0;for(r=0;r<this.centers.length;r++)n+=Number(this.ws[r])*U.kernel(t,this.centers[r]);for(n+=Number(this.ws[this.centers.length]),r=0;r<t.length;r++)n+=t[r]*Number(this.ws[this.centers.length+(r+1)]);return n}}const I={create(e){return e.map(t=>t.slice())},fromVector(e){return e.map(t=>[t])},identity(e){return R(e,t=>R(e,n=>t===n?1:0))},col(e,t){return e.map(n=>n[t-1])},clone(e){return e.slice()},canMultiplyFromLeft(e,t){return e[0].length===t.length},multiplyMatrix(e,t){if(!I.canMultiplyFromLeft(e,t))return null;const n=e[0].length;return R(e.length,r=>R(t[0].length,o=>{let i=0;for(let s=0;s<n;s++)i+=e[r][s]*t[s][o];return i}))},multiplyVector(e,t){return I.multiplyMatrix(e,I.fromVector(t))},transpose(e){return R(e[0].length,t=>R(e.length,n=>e[n][t]))},isSquare(e){return e.length===e[0].length},toRightTriangular(e){const t=I.clone(e),n=e.length,r=e[0].length;for(let o=0;o<n;o++){if(t[o][o]===0){for(let i=o+1;i<n;i++)if(t[i][o]!==0){const s=[];for(let a=0;a<r;a++)s.push(t[o][a]+t[i][a]);t[o]=s;break}}if(t[o][o]!==0)for(let i=o+1;i<n;i++){const s=t[i][o]/t[o][o],a=[];for(let c=0;c<r;c++)a.push(c<=o?0:t[i][c]-t[o][c]*s);t[i]=a}}return t},determinant(e){if(!I.isSquare(e))return null;const t=I.toRightTriangular(e);let n=t[0][0];for(let r=1;r<t.length;r++)n=n*t[r][r];return n},isSingular(e){return I.isSquare(e)&&I.determinant(e)===0},augment(e,t){const n=I.clone(e),r=n[0].length;D(n.length===t.length);for(let o=0;o<n.length;o++)for(let i=0;i<t[0].length;i++)n[o][r+i]=t[o][i];return n},inverse(e){if(!I.isSquare(e)||I.isSingular(e))return null;const t=e.length,n=[],r=I.toRightTriangular(I.augment(e,I.identity(t))),o=r[0].length;let i=e.length;for(;i--;){const s=[];n[i]=[];const a=r[i][i];for(let l=0;l<o;l++){const d=r[i][l]/a;s.push(d),l>=t&&n[i].push(d)}r[i]=s;let c=i;for(;c--;){const l=[];for(let d=0;d<o;d++)l.push(r[c][d]-r[i][d]*r[c][i]);r[c]=l}}return n}};class Yt{constructor(){this.cachedVersions=new Set,this.cachedKeyPoints=new Set,this.tpsForEachPoint=null}getCenterPointsAtPosition(t,n){switch(n.type){case"keyPointId":{const r=t.getShapeVersionForKeyPoint(n.keyPointId);return t.data.normalizedShapeVersions.get(r.id).normalizedCenterPoints}case"interpolated":return this.getCenterPointsAtInterpolatedPosition(t,n.scenePosition);default:k(n)}}getCenterPointsAtInterpolatedPosition(t,n){const r=new Set(t.shapeVersions),o=new Set(t.keyPoints);(!this.matchesCache(r,o)||!this.tpsForEachPoint)&&(this.tpsForEachPoint=this.calculateTpsForEachPoint(t,r),this.cachedVersions=r);const i=this.tpsForEachPoint,s=[n.x,n.y];return i.map(({x:a,y:c,r:l})=>({center:new w(a.getValue(s),c.getValue(s)),radius:l.getValue(s)}))}calculateTpsForEachPoint(t,n){console.time("calculateTpsForEachPoint");const r=Array.from(n,a=>({normalizedCenterPoints:t.data.normalizedShapeVersions.get(a.id).normalizedCenterPoints,version:a,keyPoint:t.keyPoints.get(a.keyPointId)})),o=r.map(({keyPoint:a})=>[a.position.x,a.position.y]),i=Math.min(...r.map(({normalizedCenterPoints:a})=>a.length)),s=[];for(let a=0;a<i;a++){const c=r.map(({normalizedCenterPoints:u})=>u[a].center.x),l=r.map(({normalizedCenterPoints:u})=>u[a].center.y),d=r.map(({normalizedCenterPoints:u})=>u[a].radius);s.push({x:new U(o,c),y:new U(o,l),r:new U(o,d)})}return console.timeEnd("calculateTpsForEachPoint"),s}matchesCache(t,n){if(t.size!==this.cachedVersions.size||n.size!==this.cachedKeyPoints.size)return!1;for(const r of t)if(!this.cachedVersions.has(r))return!1;for(const r of n)if(!this.cachedKeyPoints.has(r))return!1;return!0}}const _t=new Yt;function en(e){const t=[],n=[];if(e.length===0)return[];if(e.length===1){const u=[];for(let p=0;p<12;p++)u.push(e[0].center.add(w.fromPolar(p*Math.PI/6,e[0].radius)));return u}const r=e[0],i=e[1].center.sub(r.center).normalize(),s=i.perpendicular().scale(r.radius);t.push(r.center.sub(i.scale(r.radius))),t.push(r.center.sub(s)),n.push(r.center.add(s));for(let u=1;u<e.length-1;u++){const p=e[u-1],m=e[u],v=e[u+1].center.sub(p.center).normalize().perpendicular().scale(m.radius);t.push(m.center.sub(v)),n.push(m.center.add(v))}const a=e[e.length-2],c=e[e.length-1],l=c.center.sub(a.center).normalize(),d=l.perpendicular().scale(c.radius);return t.push(c.center.sub(d)),t.push(c.center.add(l.scale(c.radius))),n.push(c.center.add(d)),t.concat(n.reverse())}function tn({centerPoints:e}){return P("path",{d:Ot(en(e))})}function nn({document:e,previewPosition:t,interaction:n}){let r=null;switch(n.selectedTool.type){case C.Draw:{const o=se.getState(n.selectedTool);switch(o.state){case"drawing":r=Ge(Ze(Qe(o.points,te),te),te.size);break;case"idle":break;default:k(o)}break}case C.KeyPoint:break;default:k(n.selectedTool)}return r||(r=_t.getCenterPointsAtPosition(e,t)),P(tn,{centerPoints:r})}const x={initialize:e=>({undoStack:N.initialize(e),interaction:b.initialize(C.Draw)}),updateUndoStack:(e,t)=>Z(e,"undoStack",t),updateLocation:(e,t)=>x.updateUndoStack(e,n=>N.updateLocation(n,t)),updateDocument:(e,t,n)=>x.updateUndoStack(e,r=>N.updateDocument(r,t,n)),updateViewport:(e,t)=>x.updateLocation(e,n=>n.with({viewport:A(n.viewportState,t)})),updateInteraction:(e,t)=>Z(e,"interaction",t)};function rn(e){return(t,n)=>{const r=[];let o=!1;function i(a){D(!o),r.push(a)}const s=e();n({update:i,updateUndoStack:a=>i(c=>x.updateUndoStack(c,a)),updateLocation:a=>i(c=>x.updateLocation(c,a)),updateDocument:(a,c)=>i(l=>x.updateDocument(l,a,c)),updateViewport:a=>i(c=>x.updateViewport(c,a)),updateInteraction:a=>i(c=>x.updateInteraction(c,a)),document:t.undoStack.current.doc,location:t.undoStack.current.location,viewport:s.viewport});for(let a=0;a<r.length;a++)t=r[a](t);return o=!0,t}}function on(e,t){const n=He(t),r=z.exports.useMemo(()=>rn(n),[n]),[o,i]=z.exports.useReducer(r,null,e),s=z.exports.useMemo(()=>{const c=d=>i(u=>u.updateInteraction(p=>d(u,p))),l=d=>u=>c((p,m)=>b.onPointerEvent({...p,event:u,eventType:d},m));return{updateUndoStack:d=>i(u=>u.updateUndoStack(p=>d(u,p))),updateLocation:d=>i(u=>u.updateLocation(p=>d(u,p))),updateDocument:(d,u)=>i(p=>p.updateDocument(m=>d(p,m),u)),updateViewport:d=>i(u=>u.updateViewport(p=>d(u,p))),updateInteraction:c,onPointerDown:l("down"),onPointerMove:l("move"),onPointerUp:l("up"),onPointerCancel:l("cancel"),onKeyDown:d=>c((u,p)=>b.onKeyDown({...u,event:d},p)),onKeyUp:d=>c((u,p)=>b.onKeyUp({...u,event:d},p))}},[]),a=o.undoStack.current.location.keyPointId;return{...s,document:o.undoStack.current.doc,location:o.undoStack.current.location,interaction:o.interaction,previewPosition:z.exports.useMemo(()=>{var c;return(c=b.getPreviewPosition(o.interaction))!=null?c:ze.keyPointId(a)},[a,o.interaction])}}function sn(e,t){const n=t.visibleSceneBounds(),r=Fe.fromLeftTopRightBottom(n.left+n.width/10,n.top+n.height/10,n.right-n.width/10,n.bottom-n.height/10),o=Array.from(e.keyPoints,c=>c.position),s=(Math.min(n.width,n.height)/10)**2;let a=r.getCenter();for(let c=0;c<500;c++){if(o.every(l=>l.distanceToSq(a)>s))return a;a=new w(Oe(r.left,r.right),Oe(r.top,r.bottom))}return a}function an(){const[e,t]=z.exports.useState(null),n=St(e,Et);return console.log(n),P("div",{ref:t,className:"absolute inset-0 touch-none",children:n&&P(cn,{size:n})})}function cn({size:e}){const{document:t,location:n,interaction:r,previewPosition:o,updateDocument:i,updateLocation:s,updateInteraction:a,onPointerDown:c,onPointerMove:l,onPointerUp:d,onPointerCancel:u,onKeyDown:p,onKeyUp:m}=on(()=>{{const h=Bt("autosave");if(h.isOk())return x.initialize(h.value);console.error(`Error loading autosave: ${h.error}`)}return x.initialize(qe())},()=>({viewport:f}));z.exports.useEffect(()=>{Wt("autosave",{doc:t,location:n})},[t,n]);const g=z.exports.useCallback(h=>s((E,S)=>S.with({viewport:A(S.viewportState,h)})),[s]),f=z.exports.useMemo(()=>new $t(n.viewportState,e,g),[n.viewportState,e,g]);z.exports.useEffect(()=>{const h=r.selectedTool.type;s((E,S)=>S.tool!==h?S.with({tool:h}):S)},[r.selectedTool.type,s]);const v=He(h=>f.handleWheelEvent(h));return z.exports.useEffect(()=>(window.addEventListener("wheel",v,{passive:!1}),window.addEventListener("keydown",p),window.addEventListener("keyup",m),()=>{window.removeEventListener("wheel",v),window.removeEventListener("keydown",p),window.removeEventListener("keyup",m)}),[p,m,v]),W($e,{children:[W("div",{className:"pointer-events-none absolute top-0",children:[ze.toDebugString(o)," |"," ",b.toDebugString(r)]}),W("div",{className:"absolute inset-0",onPointerDown:c,onPointerMove:l,onPointerUp:d,onPointerCancel:u,children:[P("svg",{viewBox:`0 0 ${e.x} ${e.y}`,className:$("absolute top-0 left-0",b.getCanvasClassName(r)),children:P("g",{transform:f.getSceneTransform(),children:P(nn,{document:t,previewPosition:o,interaction:r})})}),P(b.Overlay,{interaction:r,viewport:f,document:t,location:n,onUpdateInteraction:a})]}),P(Xt,{selectedToolType:r.selectedTool.type,updateInteraction:a}),W("div",{className:"absolute bottom-0 left-0 flex w-full items-center justify-center gap-3 p-3",children:[W("div",{className:"flex min-w-0 flex-auto items-center justify-center gap-3",children:[Array.from(t.keyPoints,(h,E)=>P("button",{className:$("flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-400 shadow-md transition-transform hover:-translate-y-1",h.id===n.keyPointId?"text-stone-500 ring-2 ring-inset ring-purple-400":"text-stone-400"),onClick:()=>{s((S,y)=>y.with({keyPointId:h.id}))},children:E+1},h.id)),P("button",{className:$("flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-400 shadow-md transition-transform hover:-translate-y-1"),onClick:()=>{const h=G.generate();i((E,S)=>S.addKeyPoint(h,sn(S,f)),{lockstepLocation:E=>E.with({keyPointId:h})})},children:"+"})]}),P("button",{className:$("absolute right-3 flex h-10 flex-none items-center justify-center justify-self-end rounded-full border border-stone-200 px-3 text-stone-400 shadow-md transition-transform hover:-translate-y-1"),onClick:()=>{const{doc:h,location:E}=qe();i(()=>h,{lockstepLocation:E})},children:"reset"})]})]})}const ln=pe(document.getElementById("root"));Ue(ln).render(P(an,{}));
