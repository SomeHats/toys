var ge=(p,r,c)=>{if(!r.has(p))throw TypeError("Cannot "+c)};var Z=(p,r,c)=>(ge(p,r,"read from private field"),c?c.call(p):r.get(p)),G=(p,r,c)=>{if(r.has(p))throw TypeError("Cannot add the same private member more than once");r instanceof WeakSet?r.add(p):r.set(p,c)},W=(p,r,c,d)=>(ge(p,r,"write to private field"),d?d.call(p,c):r.set(p,c),c);import{B as He,a as ze,b as V,C as Y,z as Ue,j as ve,D as me,i as ee,y as Xe}from"./chunk_utils.ferkvykK.js";/* empty css                       */import{j as z,c as Ze}from"./chunk_client.3vOul-ua.js";import{a as Ge,s as qe}from"./chunk_useResizeObserver.1WDF-mnU.js";import{g as Je,s as Ke}from"./chunk_storage.dLvRSUJZ.js";import{S as Qe}from"./chunk_Spring.C5vFcM81.js";import{T as Ye}from"./chunk_Ticker.W3AthjLp.js";import{a as et}from"./chunk_easings.6psAoSVH.js";import"./chunk_AABB.JpHgKg04.js";import{V as N,S as _,R as we,a as tt}from"./chunk_Vector2.Rt8uspPZ.js";import{r as ae,m as L,a as $}from"./chunk_signia._kyOjg0K.js";import{c as ce,S as nt,a as it}from"./chunk_StoreSchema.6oVjlI9P.js";import{g as ke,a as Me,b as Te}from"./chunk_perfectFreehand.TO0iypa7.js";import{c as rt,t as F}from"./chunk_track.lGoURb00.js";import{r as K,R as st}from"./chunk_index.V9mWGg2B.js";import{B as ye}from"./chunk_Button.hZ5HKUMr.js";import{c as ot}from"./chunk_index.f10NbkGF.js";import"./chunk_ResizeObserver.-NVrOerG.js";import"./chunk_EventEmitter.RDaT1QTq.js";import"./chunk_RingBuffer.a9K5McfO.js";import"./chunk__commonjsHelpers.5-cIlDoe.js";import"./chunk_useMergedRefs.DOPNtTgk.js";import"./chunk_theme.6peXtGe0.js";function at(p,r,c,d,b){const T=p.lerp(r,b),M=r.lerp(c,b),k=c.lerp(d,b),j=T.lerp(M,b),s=M.lerp(k,b);return j.lerp(s,b)}var Se,be;function ct(){function p(s,n){return function(l){(function(f,e){if(f.v)throw new Error("attempted to call "+e+" after decoration was finished")})(n,"addInitializer"),d(l,"An initializer"),s.push(l)}}function r(s,n){if(!s(n))throw new TypeError("Attempted to access private element on non-instance")}function c(s,n,l,f,e,w,h,P,y){var o;switch(e){case 1:o="accessor";break;case 2:o="method";break;case 3:o="getter";break;case 4:o="setter";break;default:o="field"}var i,t,v={kind:o,name:h?"#"+n:n,static:w,private:h},a={v:!1};if(e!==0&&(v.addInitializer=p(f,a)),h||e!==0&&e!==2)if(e===2)i=function(u){return r(y,u),l.value};else{var g=e===0||e===1;(g||e===3)&&(i=h?function(u){return r(y,u),l.get.call(u)}:function(u){return l.get.call(u)}),(g||e===4)&&(t=h?function(u,S){r(y,u),l.set.call(u,S)}:function(u,S){l.set.call(u,S)})}else i=function(u){return u[n]},e===0&&(t=function(u,S){u[n]=S});var m=h?y.bind():function(u){return n in u};v.access=i&&t?{get:i,set:t,has:m}:i?{get:i,has:m}:{set:t,has:m};try{return s(P,v)}finally{a.v=!0}}function d(s,n){if(typeof s!="function")throw new TypeError(n+" must be a function")}function b(s,n){var l=typeof n;if(s===1){if(l!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&d(n.get,"accessor.get"),n.set!==void 0&&d(n.set,"accessor.set"),n.init!==void 0&&d(n.init,"accessor.init")}else if(l!=="function"){var f;throw f=s===0?"field":s===10?"class":"method",new TypeError(f+" decorators must return a function or void 0")}}function T(s){return function(n){s(this,n)}}function M(s,n,l,f,e,w,h,P,y){var o,i,t,v,a,g,m,u=l[0];if(h?o=e===0||e===1?{get:(v=l[3],function(){return v(this)}),set:T(l[4])}:e===3?{get:l[3]}:e===4?{set:l[3]}:{value:l[3]}:e!==0&&(o=Object.getOwnPropertyDescriptor(n,f)),e===1?t={get:o.get,set:o.set}:e===2?t=o.value:e===3?t=o.get:e===4&&(t=o.set),typeof u=="function")(a=c(u,f,o,P,e,w,h,t,y))!==void 0&&(b(e,a),e===0?i=a:e===1?(i=a.init,g=a.get||t.get,m=a.set||t.set,t={get:g,set:m}):t=a);else for(var S=u.length-1;S>=0;S--){var x;(a=c(u[S],f,o,P,e,w,h,t,y))!==void 0&&(b(e,a),e===0?x=a:e===1?(x=a.init,g=a.get||t.get,m=a.set||t.set,t={get:g,set:m}):t=a,x!==void 0&&(i===void 0?i=x:typeof i=="function"?i=[i,x]:i.push(x)))}if(e===0||e===1){if(i===void 0)i=function(E,I){return I};else if(typeof i!="function"){var D=i;i=function(E,I){for(var A=I,O=0;O<D.length;O++)A=D[O].call(E,A);return A}}else{var C=i;i=function(E,I){return C.call(E,I)}}s.push(i)}e!==0&&(e===1?(o.get=t.get,o.set=t.set):e===2?o.value=t:e===3?o.get=t:e===4&&(o.set=t),h?e===1?(s.push(function(E,I){return t.get.call(E,I)}),s.push(function(E,I){return t.set.call(E,I)})):e===2?s.push(t):s.push(function(E,I){return t.call(E,I)}):Object.defineProperty(n,f,o))}function k(s,n,l){for(var f,e,w,h=[],P=new Map,y=new Map,o=0;o<n.length;o++){var i=n[o];if(Array.isArray(i)){var t,v,a=i[1],g=i[2],m=i.length>3,u=a>=5,S=l;if(u?(t=s,(a-=5)!==0&&(v=e=e||[]),m&&!w&&(w=function(C){return lt(C)===s}),S=w):(t=s.prototype,a!==0&&(v=f=f||[])),a!==0&&!m){var x=u?y:P,D=x.get(g)||0;if(D===!0||D===3&&a!==4||D===4&&a!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+g);!D&&a>2?x.set(g,a):x.set(g,!0)}M(h,t,i,g,a,u,m,v,S)}}return j(h,f),j(h,e),h}function j(s,n){n&&s.push(function(l){for(var f=0;f<n.length;f++)n[f].call(l);return l})}return function(s,n,l,f){return{e:k(s,n,f),get c(){return function(e,w){if(w.length>0){for(var h=[],P=e,y=e.name,o=w.length-1;o>=0;o--){var i={v:!1};try{var t=w[o](P,{kind:"class",name:y,addInitializer:p(h,i)})}finally{i.v=!0}t!==void 0&&(b(10,t),P=t)}return[P,function(){for(var v=0;v<h.length;v++)h[v].call(P)}]}}(s,l)}}}}function Ce(p,r,c,d){return(Ce=ct())(p,r,c,d)}function lt(p){if(Object(p)!==p)throw TypeError("right-hand side of 'in' should be an object, got "+(p!==null?typeof p:"null"));return p}var U;const de=class de{constructor(r){G(this,U,(be(this),Se(this,N.ZERO)));this.lime=r}get screenPointer(){return Z(this,U)}set screenPointer(r){W(this,U,r)}get scenePointer(){return this.lime.viewport.screenToSlide(this.screenPointer)}updateFromEvent(r){this.screenPointer=N.fromEvent(r)}};U=new WeakMap,[Se,be]=Ce(de,[[ae,1,"screenPointer"],[L,3,"scenePointer"]],[]).e;let ne=de;const Ae=1080,ut=Ae/(16/9),R=new N(Ae,ut),te=new N(32,32),dt=200,Q={size:16,thinning:.5,smoothing:.5,last:!0};var Pe,Ie;function ft(){function p(s,n){return function(l){(function(f,e){if(f.v)throw new Error("attempted to call "+e+" after decoration was finished")})(n,"addInitializer"),d(l,"An initializer"),s.push(l)}}function r(s,n){if(!s(n))throw new TypeError("Attempted to access private element on non-instance")}function c(s,n,l,f,e,w,h,P,y){var o;switch(e){case 1:o="accessor";break;case 2:o="method";break;case 3:o="getter";break;case 4:o="setter";break;default:o="field"}var i,t,v={kind:o,name:h?"#"+n:n,static:w,private:h},a={v:!1};if(e!==0&&(v.addInitializer=p(f,a)),h||e!==0&&e!==2)if(e===2)i=function(u){return r(y,u),l.value};else{var g=e===0||e===1;(g||e===3)&&(i=h?function(u){return r(y,u),l.get.call(u)}:function(u){return l.get.call(u)}),(g||e===4)&&(t=h?function(u,S){r(y,u),l.set.call(u,S)}:function(u,S){l.set.call(u,S)})}else i=function(u){return u[n]},e===0&&(t=function(u,S){u[n]=S});var m=h?y.bind():function(u){return n in u};v.access=i&&t?{get:i,set:t,has:m}:i?{get:i,has:m}:{set:t,has:m};try{return s(P,v)}finally{a.v=!0}}function d(s,n){if(typeof s!="function")throw new TypeError(n+" must be a function")}function b(s,n){var l=typeof n;if(s===1){if(l!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&d(n.get,"accessor.get"),n.set!==void 0&&d(n.set,"accessor.set"),n.init!==void 0&&d(n.init,"accessor.init")}else if(l!=="function"){var f;throw f=s===0?"field":s===10?"class":"method",new TypeError(f+" decorators must return a function or void 0")}}function T(s){return function(n){s(this,n)}}function M(s,n,l,f,e,w,h,P,y){var o,i,t,v,a,g,m,u=l[0];if(h?o=e===0||e===1?{get:(v=l[3],function(){return v(this)}),set:T(l[4])}:e===3?{get:l[3]}:e===4?{set:l[3]}:{value:l[3]}:e!==0&&(o=Object.getOwnPropertyDescriptor(n,f)),e===1?t={get:o.get,set:o.set}:e===2?t=o.value:e===3?t=o.get:e===4&&(t=o.set),typeof u=="function")(a=c(u,f,o,P,e,w,h,t,y))!==void 0&&(b(e,a),e===0?i=a:e===1?(i=a.init,g=a.get||t.get,m=a.set||t.set,t={get:g,set:m}):t=a);else for(var S=u.length-1;S>=0;S--){var x;(a=c(u[S],f,o,P,e,w,h,t,y))!==void 0&&(b(e,a),e===0?x=a:e===1?(x=a.init,g=a.get||t.get,m=a.set||t.set,t={get:g,set:m}):t=a,x!==void 0&&(i===void 0?i=x:typeof i=="function"?i=[i,x]:i.push(x)))}if(e===0||e===1){if(i===void 0)i=function(E,I){return I};else if(typeof i!="function"){var D=i;i=function(E,I){for(var A=I,O=0;O<D.length;O++)A=D[O].call(E,A);return A}}else{var C=i;i=function(E,I){return C.call(E,I)}}s.push(i)}e!==0&&(e===1?(o.get=t.get,o.set=t.set):e===2?o.value=t:e===3?o.get=t:e===4&&(o.set=t),h?e===1?(s.push(function(E,I){return t.get.call(E,I)}),s.push(function(E,I){return t.set.call(E,I)})):e===2?s.push(t):s.push(function(E,I){return t.call(E,I)}):Object.defineProperty(n,f,o))}function k(s,n,l){for(var f,e,w,h=[],P=new Map,y=new Map,o=0;o<n.length;o++){var i=n[o];if(Array.isArray(i)){var t,v,a=i[1],g=i[2],m=i.length>3,u=a>=5,S=l;if(u?(t=s,(a-=5)!==0&&(v=e=e||[]),m&&!w&&(w=function(C){return ht(C)===s}),S=w):(t=s.prototype,a!==0&&(v=f=f||[])),a!==0&&!m){var x=u?y:P,D=x.get(g)||0;if(D===!0||D===3&&a!==4||D===4&&a!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+g);!D&&a>2?x.set(g,a):x.set(g,!0)}M(h,t,i,g,a,u,m,v,S)}}return j(h,f),j(h,e),h}function j(s,n){n&&s.push(function(l){for(var f=0;f<n.length;f++)n[f].call(l);return l})}return function(s,n,l,f){return{e:k(s,n,f),get c(){return function(e,w){if(w.length>0){for(var h=[],P=e,y=e.name,o=w.length-1;o>=0;o--){var i={v:!1};try{var t=w[o](P,{kind:"class",name:y,addInitializer:p(h,i)})}finally{i.v=!0}t!==void 0&&(b(10,t),P=t)}return[P,function(){for(var v=0;v<h.length;v++)h[v].call(P)}]}}(s,l)}}}}function Oe(p,r,c,d){return(Oe=ft())(p,r,c,d)}function ht(p){if(Object(p)!==p)throw TypeError("right-hand side of 'in' should be an object, got "+(p!==null?typeof p:"null"));return p}class _e{constructor(r){this.parent=r,this.lime=r.lime}toDebugString(){return this.child?`${this.name}.${this.child.toDebugString()}`:this.name}}var B;const fe=class fe{constructor(r){G(this,B,void 0);this.lime=r,W(this,B,(Ie(this),Pe(this,new Re(this)))),this.onPointerDown=c=>{var d,b;(b=(d=this.child).onPointerDown)==null||b.call(d,c)},this.onPointerMove=c=>{var d,b;(b=(d=this.child).onPointerMove)==null||b.call(d,c)},this.onPointerUp=c=>{var d,b;(b=(d=this.child).onPointerUp)==null||b.call(d,c)}}get child(){return Z(this,B)}set child(r){W(this,B,r)}toDebugString(){return`lime.${this.child.toDebugString()}`}};B=new WeakMap,[Pe,Ie]=Oe(fe,[[ae,1,"child"]],[]).e;let ie=fe;class Re extends _e{constructor(){super(...arguments),this.name="idle"}onPointerDown(r){const c=this.lime.session.slideId;this.lime.updateSlide(c,d=>({...d,rawPoints:[this.lime.inputs.scenePointer]})),this.parent.child=new pt(this.parent,c)}}class pt extends _e{constructor(r,c){super(r),this.slideId=c,this.name="drawing"}onPointerMove(r){this.lime.updateSlide(this.slideId,c=>({...c,rawPoints:[...c.rawPoints,this.lime.inputs.scenePointer]}))}onPointerUp(r){this.parent.child=new Re(this.parent)}}function H(p){const r=new RegExp(`^${p}\\:([a-zA-Z0-9_-]+)$`),c=d=>r.test(d)?we.ok(d):we.error(new tt(`Expected ${p}:*, got ${d}`,[]));return _.string.transform(c,c,He)}const Le=_.object({typeName:_.value("doc"),id:H("doc"),slideIds:_.arrayOf(H("slide"))}),le=ce("doc",{scope:"document",validator:Le.asValidator()}),q=le.createId("doc"),Ne=_.object({typeName:_.value("slide"),id:H("slide"),rawPoints:_.arrayOf(N.schema)}),re=ce("slide",{scope:"document",validator:Ne.asValidator()}).withDefaultProperties(()=>({rawPoints:[]})),$e=_.object({typeName:_.value("session"),id:H("session"),slideId:H("slide"),tweenBezierControl:_.number,speed:_.number}),ue=ce("session",{scope:"session",validator:$e.asValidator()}).withDefaultProperties(()=>({tweenBezierControl:.4,speed:650})),J=ue.createId("session"),gt=_.union("typeName",{doc:Le,slide:Ne,session:$e}),xe=_.objectMap(_.string,gt),vt=it.create({doc:le,slide:re,session:ue});class mt extends nt{constructor(r){super({schema:vt,props:{},initialData:r})}insert(r){ze(!this.get(r.id),"Assertion Error: !this.get(record.id)"),this.put([r])}}var Ee,De;function wt(){function p(s,n){return function(l){(function(f,e){if(f.v)throw new Error("attempted to call "+e+" after decoration was finished")})(n,"addInitializer"),d(l,"An initializer"),s.push(l)}}function r(s,n){if(!s(n))throw new TypeError("Attempted to access private element on non-instance")}function c(s,n,l,f,e,w,h,P,y){var o;switch(e){case 1:o="accessor";break;case 2:o="method";break;case 3:o="getter";break;case 4:o="setter";break;default:o="field"}var i,t,v={kind:o,name:h?"#"+n:n,static:w,private:h},a={v:!1};if(e!==0&&(v.addInitializer=p(f,a)),h||e!==0&&e!==2)if(e===2)i=function(u){return r(y,u),l.value};else{var g=e===0||e===1;(g||e===3)&&(i=h?function(u){return r(y,u),l.get.call(u)}:function(u){return l.get.call(u)}),(g||e===4)&&(t=h?function(u,S){r(y,u),l.set.call(u,S)}:function(u,S){l.set.call(u,S)})}else i=function(u){return u[n]},e===0&&(t=function(u,S){u[n]=S});var m=h?y.bind():function(u){return n in u};v.access=i&&t?{get:i,set:t,has:m}:i?{get:i,has:m}:{set:t,has:m};try{return s(P,v)}finally{a.v=!0}}function d(s,n){if(typeof s!="function")throw new TypeError(n+" must be a function")}function b(s,n){var l=typeof n;if(s===1){if(l!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&d(n.get,"accessor.get"),n.set!==void 0&&d(n.set,"accessor.set"),n.init!==void 0&&d(n.init,"accessor.init")}else if(l!=="function"){var f;throw f=s===0?"field":s===10?"class":"method",new TypeError(f+" decorators must return a function or void 0")}}function T(s){return function(n){s(this,n)}}function M(s,n,l,f,e,w,h,P,y){var o,i,t,v,a,g,m,u=l[0];if(h?o=e===0||e===1?{get:(v=l[3],function(){return v(this)}),set:T(l[4])}:e===3?{get:l[3]}:e===4?{set:l[3]}:{value:l[3]}:e!==0&&(o=Object.getOwnPropertyDescriptor(n,f)),e===1?t={get:o.get,set:o.set}:e===2?t=o.value:e===3?t=o.get:e===4&&(t=o.set),typeof u=="function")(a=c(u,f,o,P,e,w,h,t,y))!==void 0&&(b(e,a),e===0?i=a:e===1?(i=a.init,g=a.get||t.get,m=a.set||t.set,t={get:g,set:m}):t=a);else for(var S=u.length-1;S>=0;S--){var x;(a=c(u[S],f,o,P,e,w,h,t,y))!==void 0&&(b(e,a),e===0?x=a:e===1?(x=a.init,g=a.get||t.get,m=a.set||t.set,t={get:g,set:m}):t=a,x!==void 0&&(i===void 0?i=x:typeof i=="function"?i=[i,x]:i.push(x)))}if(e===0||e===1){if(i===void 0)i=function(E,I){return I};else if(typeof i!="function"){var D=i;i=function(E,I){for(var A=I,O=0;O<D.length;O++)A=D[O].call(E,A);return A}}else{var C=i;i=function(E,I){return C.call(E,I)}}s.push(i)}e!==0&&(e===1?(o.get=t.get,o.set=t.set):e===2?o.value=t:e===3?o.get=t:e===4&&(o.set=t),h?e===1?(s.push(function(E,I){return t.get.call(E,I)}),s.push(function(E,I){return t.set.call(E,I)})):e===2?s.push(t):s.push(function(E,I){return t.call(E,I)}):Object.defineProperty(n,f,o))}function k(s,n,l){for(var f,e,w,h=[],P=new Map,y=new Map,o=0;o<n.length;o++){var i=n[o];if(Array.isArray(i)){var t,v,a=i[1],g=i[2],m=i.length>3,u=a>=5,S=l;if(u?(t=s,(a-=5)!==0&&(v=e=e||[]),m&&!w&&(w=function(C){return yt(C)===s}),S=w):(t=s.prototype,a!==0&&(v=f=f||[])),a!==0&&!m){var x=u?y:P,D=x.get(g)||0;if(D===!0||D===3&&a!==4||D===4&&a!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+g);!D&&a>2?x.set(g,a):x.set(g,!0)}M(h,t,i,g,a,u,m,v,S)}}return j(h,f),j(h,e),h}function j(s,n){n&&s.push(function(l){for(var f=0;f<n.length;f++)n[f].call(l);return l})}return function(s,n,l,f){return{e:k(s,n,f),get c(){return function(e,w){if(w.length>0){for(var h=[],P=e,y=e.name,o=w.length-1;o>=0;o--){var i={v:!1};try{var t=w[o](P,{kind:"class",name:y,addInitializer:p(h,i)})}finally{i.v=!0}t!==void 0&&(b(10,t),P=t)}return[P,function(){for(var v=0;v<h.length;v++)h[v].call(P)}]}}(s,l)}}}}function Be(p,r,c,d){return(Be=wt())(p,r,c,d)}function yt(p){if(Object(p)!==p)throw TypeError("right-hand side of 'in' should be an object, got "+(p!==null?typeof p:"null"));return p}var X;const he=class he{constructor(){G(this,X,(De(this),Ee(this,N.ZERO)))}get screenSize(){return Z(this,X)}set screenSize(r){W(this,X,r)}get canvasOffset(){return new N(dt,0)}get canvasSize(){return this.screenSize.sub(this.canvasOffset)}get availableCanvasSize(){return this.canvasSize.sub(te.scale(2))}get scaleFactor(){return Math.min(this.availableCanvasSize.x/R.x,this.availableCanvasSize.y/R.y)}get slideSize(){return R.scale(this.scaleFactor)}get slideOffset(){return new N(Math.max(te.x,(this.canvasSize.x-this.slideSize.x)/2),Math.max(te.y,(this.canvasSize.y-this.slideSize.y)/2))}screenToSlide(r){return r.sub(this.canvasOffset).sub(this.slideOffset).div(this.scaleFactor)}slideToScreen(r){return r.scale(this.scaleFactor).add(this.slideOffset).add(this.canvasOffset)}};X=new WeakMap,[Ee,De]=Be(he,[[ae,1,"screenSize"],[L,3,"canvasOffset"],[L,3,"canvasSize"],[L,3,"availableCanvasSize"],[L,3,"scaleFactor"],[L,3,"slideSize"],[L,3,"slideOffset"]],[]).e;let se=he;var je;function St(){function p(s,n){return function(l){(function(f,e){if(f.v)throw new Error("attempted to call "+e+" after decoration was finished")})(n,"addInitializer"),d(l,"An initializer"),s.push(l)}}function r(s,n){if(!s(n))throw new TypeError("Attempted to access private element on non-instance")}function c(s,n,l,f,e,w,h,P,y){var o;switch(e){case 1:o="accessor";break;case 2:o="method";break;case 3:o="getter";break;case 4:o="setter";break;default:o="field"}var i,t,v={kind:o,name:h?"#"+n:n,static:w,private:h},a={v:!1};if(e!==0&&(v.addInitializer=p(f,a)),h||e!==0&&e!==2)if(e===2)i=function(u){return r(y,u),l.value};else{var g=e===0||e===1;(g||e===3)&&(i=h?function(u){return r(y,u),l.get.call(u)}:function(u){return l.get.call(u)}),(g||e===4)&&(t=h?function(u,S){r(y,u),l.set.call(u,S)}:function(u,S){l.set.call(u,S)})}else i=function(u){return u[n]},e===0&&(t=function(u,S){u[n]=S});var m=h?y.bind():function(u){return n in u};v.access=i&&t?{get:i,set:t,has:m}:i?{get:i,has:m}:{set:t,has:m};try{return s(P,v)}finally{a.v=!0}}function d(s,n){if(typeof s!="function")throw new TypeError(n+" must be a function")}function b(s,n){var l=typeof n;if(s===1){if(l!=="object"||n===null)throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");n.get!==void 0&&d(n.get,"accessor.get"),n.set!==void 0&&d(n.set,"accessor.set"),n.init!==void 0&&d(n.init,"accessor.init")}else if(l!=="function"){var f;throw f=s===0?"field":s===10?"class":"method",new TypeError(f+" decorators must return a function or void 0")}}function T(s){return function(n){s(this,n)}}function M(s,n,l,f,e,w,h,P,y){var o,i,t,v,a,g,m,u=l[0];if(h?o=e===0||e===1?{get:(v=l[3],function(){return v(this)}),set:T(l[4])}:e===3?{get:l[3]}:e===4?{set:l[3]}:{value:l[3]}:e!==0&&(o=Object.getOwnPropertyDescriptor(n,f)),e===1?t={get:o.get,set:o.set}:e===2?t=o.value:e===3?t=o.get:e===4&&(t=o.set),typeof u=="function")(a=c(u,f,o,P,e,w,h,t,y))!==void 0&&(b(e,a),e===0?i=a:e===1?(i=a.init,g=a.get||t.get,m=a.set||t.set,t={get:g,set:m}):t=a);else for(var S=u.length-1;S>=0;S--){var x;(a=c(u[S],f,o,P,e,w,h,t,y))!==void 0&&(b(e,a),e===0?x=a:e===1?(x=a.init,g=a.get||t.get,m=a.set||t.set,t={get:g,set:m}):t=a,x!==void 0&&(i===void 0?i=x:typeof i=="function"?i=[i,x]:i.push(x)))}if(e===0||e===1){if(i===void 0)i=function(E,I){return I};else if(typeof i!="function"){var D=i;i=function(E,I){for(var A=I,O=0;O<D.length;O++)A=D[O].call(E,A);return A}}else{var C=i;i=function(E,I){return C.call(E,I)}}s.push(i)}e!==0&&(e===1?(o.get=t.get,o.set=t.set):e===2?o.value=t:e===3?o.get=t:e===4&&(o.set=t),h?e===1?(s.push(function(E,I){return t.get.call(E,I)}),s.push(function(E,I){return t.set.call(E,I)})):e===2?s.push(t):s.push(function(E,I){return t.call(E,I)}):Object.defineProperty(n,f,o))}function k(s,n,l){for(var f,e,w,h=[],P=new Map,y=new Map,o=0;o<n.length;o++){var i=n[o];if(Array.isArray(i)){var t,v,a=i[1],g=i[2],m=i.length>3,u=a>=5,S=l;if(u?(t=s,(a-=5)!==0&&(v=e=e||[]),m&&!w&&(w=function(C){return bt(C)===s}),S=w):(t=s.prototype,a!==0&&(v=f=f||[])),a!==0&&!m){var x=u?y:P,D=x.get(g)||0;if(D===!0||D===3&&a!==4||D===4&&a!==3)throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+g);!D&&a>2?x.set(g,a):x.set(g,!0)}M(h,t,i,g,a,u,m,v,S)}}return j(h,f),j(h,e),h}function j(s,n){n&&s.push(function(l){for(var f=0;f<n.length;f++)n[f].call(l);return l})}return function(s,n,l,f){return{e:k(s,n,f),get c(){return function(e,w){if(w.length>0){for(var h=[],P=e,y=e.name,o=w.length-1;o>=0;o--){var i={v:!1};try{var t=w[o](P,{kind:"class",name:y,addInitializer:p(h,i)})}finally{i.v=!0}t!==void 0&&(b(10,t),P=t)}return[P,function(){for(var v=0;v<h.length;v++)h[v].call(P)}]}}(s,l)}}}}function Fe(p,r,c,d){return(Fe=St())(p,r,c,d)}function bt(p){if(Object(p)!==p)throw TypeError("right-hand side of 'in' should be an object, got "+(p!==null?typeof p:"null"));return p}const pe=class pe{constructor(r){this.store=r,this.state=new ie(this),this.viewport=new se,this.inputs=new ne(this),this.ticker=new Ye,je(this),this.ensureStoreIsReady()}ensureStoreIsReady(){const r=this.store.query.records("slide").value;if(!r.length){const c=re.create({});this.store.put([c]),r.push(c)}this.store.get(q)||this.store.put([le.create({id:q,slideIds:r.map(c=>c.id)})]),this.store.get(J)||this.store.put([ue.create({id:J,slideId:r[0].id})])}get document(){return V(this.store.get(q),"Assertion Error: this.store.get(LIME_DOC_ID)")}updateDocument(r){this.store.update(q,c=>Y(c,r))}get session(){return V(this.store.get(J),"Assertion Error: this.store.get(SESSION_ID)")}updateSession(r){this.store.update(J,c=>Y(c,r))}getSlide(r){return V(this.store.get(r),"Assertion Error: this.store.get(slideId)")}getSlideIndex(r){const c=this.document.slideIds.indexOf(r);return ze(c!==-1,"Assertion Error: slideIndex !== -1"),c}getSlideByIndex(r){const{slideIds:c}=this.document;return this.getSlide(c[Ue(0,c.length,r)])}updateSlide(r,c){this.store.update(r,d=>Y(d,c))}get _slideStrokePointsCache(){return this.store.createComputedCache("slideStrokePoints",r=>ke(r.rawPoints,Q))}getSlideStrokePoints(r){return V(this._slideStrokePointsCache.get(r),"Assertion Error: this._slideStrokePointsCache.get(slideId)")}get playheadSpring(){return new Qe({target:rt("playheadTarget",()=>this.getSlideIndex(this.session.slideId)),ticker:this.ticker,tension:100,friction:25})}get playhead(){return this.playheadSpring.value}get animationStepCache(){return this.store.createComputedCache("animationSteps",r=>{const{tweenBezierControl:c,speed:d}=this.session,b=this.getSlideByIndex(this.getSlideIndex(r.id)+1),T=r.rawPoints,M=b.rawPoints,k=this.getSlideStrokePoints(r.id),j=this.getSlideStrokePoints(b.id);if(!T.length||!j.length)return null;const s=k[k.length-1],n=j[0],l=s.point.distanceTo(n.point),f=s.point,e=s.point.sub(s.vector.scale(l*c)),w=n.point.add(n.vector.scale(l*c)),h=n.point,P=[];for(let g=0;g<l;g+=d/60){const m=ee(0,l,g),u=at(f,e,w,h,m);P.push(u)}const y=[0],o=[];let i=0,t=null;for(const g of T){if(t){const m=g.distanceTo(t);i+=m,y.push(i)}t=g,o.push(g)}const v=i;for(const g of P){if(t){const m=g.distanceTo(t);i+=m,y.push(i)}t=g,o.push(g)}const a=i-v;for(const g of M){if(t){const m=g.distanceTo(t);i+=m,y.push(i)}t=g,o.push(g)}return{allPoints:o,runningLengths:y,initialWindowStart:0,initialWindowEnd:v,finalWindowStart:v+a,finalWindowEnd:i}})}getPlayheadPoints(){const{playhead:r}=this,c=this.getSlideByIndex(Math.floor(r)),d=this.animationStepCache.get(c.id);if(!d)return c.rawPoints;const b=et(r-Math.floor(r)),T=ve(d.initialWindowStart,d.finalWindowStart,b),M=ve(d.initialWindowEnd,d.finalWindowEnd,b),k=me(d.runningLengths,T),j=me(d.runningLengths,M,k),s=Math.min(k+1,d.allPoints.length),n=Math.min(j+1,d.allPoints.length),l=Math.max(j-1,0),f=d.allPoints[k].lerp(d.allPoints[s],ee(d.runningLengths[k],d.runningLengths[s],T)),e=d.allPoints[j].lerp(d.allPoints[n],ee(d.runningLengths[j],d.runningLengths[n],M));return[f,...d.allPoints.slice(s,l),e]}clearDocument(){this.store.clear(),this.ensureStoreIsReady()}newSlide(){const r=re.create({});this.store.insert(r),this.updateDocument(c=>({...c,slideIds:[...c.slideIds,r.id]})),this.updateSession(c=>({...c,slideId:r.id}))}changeSlide(r){const c=this.getSlide(r);this.updateSession(d=>({...d,slideId:c.id}))}onPointerDown(r){this.inputs.updateFromEvent(r),this.state.onPointerDown(r)}onPointerMove(r){this.inputs.updateFromEvent(r),this.state.onPointerMove(r)}onPointerUp(r){this.inputs.updateFromEvent(r),this.state.onPointerUp(r)}};[je]=Fe(pe,[[L,3,"document"],[L,3,"session"],[L,3,"_slideStrokePointsCache"],[L,3,"playheadSpring"],[L,3,"animationStepCache"],[$,2,"clearDocument"],[$,2,"newSlide"],[$,2,"changeSlide"],[$,2,"onPointerDown"],[$,2,"onPointerMove"],[$,2,"onPointerUp"]],[]).e;let oe=pe;function Pt(){const[p,r]=K.useState(null),c=Ge(p,qe),[d,b]=K.useState(null);return K.useEffect(()=>{const T=Je("lime.doc",xe,()=>({})),M=new mt(T),k=new oe(M);k.ticker.start(),b(k);const j=Xe(1e3,()=>{Ke("lime.doc",xe,M.serialize("all"))}),s=M.listen(()=>{j()});return()=>{s(),j.cancel(),k.ticker.stop()}},[]),z.jsx("div",{ref:r,className:"absolute inset-0 touch-none select-none overflow-hidden",children:c&&d&&z.jsx(It,{size:c,lime:d})})}const It=F(function({size:r,lime:c}){return K.useEffect(()=>{c.viewport.screenSize=r},[r,c]),z.jsxs(z.Fragment,{children:[z.jsxs("div",{className:"absolute top-0 left-0 h-full w-[200px] bg-stone-50 flex p-4 gap-4 flex-col overflow-auto shadow-lg",children:[c.state.toDebugString(),c.document.slideIds.map(d=>z.jsx(xt,{lime:c,slideId:d,isActive:c.session.slideId===d},d)),z.jsx(ye,{className:"flex-none",onClick:()=>c.newSlide(),children:"+"}),z.jsx(ye,{onClick:()=>c.clearDocument(),className:"mt-auto flex-none",children:"reset"})]}),z.jsx(Et,{lime:c}),z.jsxs("div",{className:"absolute top-0 left-[200px] flex gap-4",children:[z.jsxs("label",{className:"gap-2 flex",children:["slop",z.jsx("input",{type:"range",min:"0",max:"1",step:"0.01",value:c.session.tweenBezierControl,onChange:d=>c.updateSession(b=>({...b,tweenBezierControl:d.currentTarget.valueAsNumber}))}),c.session.tweenBezierControl]}),z.jsxs("label",{className:"gap-2 flex",children:["speed",z.jsx("input",{type:"range",min:"100",max:"2000",step:"1",value:c.session.speed,onChange:d=>c.updateSession(b=>({...b,speed:d.currentTarget.valueAsNumber}))}),c.session.speed]})]})]})}),xt=F(function({lime:r,slideId:c,isActive:d}){return z.jsx("div",{className:ot("w-full aspect-video ring-1 rounded relative ring-stone-200 flex-none ",d&&"ring-blue-500 ring-2"),onClick:()=>r.changeSlide(c),children:z.jsx("div",{className:"absolute inset-0 rounded overflow-hidden",children:z.jsx(We,{scale:168/R.x,children:z.jsx(Ve,{lime:r,slideId:c})})})})}),Et=F(function({lime:r}){const{canvasSize:c,canvasOffset:d,slideSize:b,slideOffset:T,scaleFactor:M}=r.viewport,{slideId:k}=r.session;return r.document.slideIds[(r.document.slideIds.indexOf(k)+1)%r.document.slideIds.length],z.jsx("div",{className:"absolute bg-stone-100",style:{width:c.x,height:c.y,left:d.x,top:d.y},onPointerDown:j=>r.onPointerDown(j.nativeEvent),onPointerMove:j=>r.onPointerMove(j.nativeEvent),onPointerUp:j=>r.onPointerUp(j.nativeEvent),children:z.jsx("div",{className:"absolute rounded-lg shadow-md overflow-hidden",style:{width:b.x,height:b.y,left:T.x,top:T.y},children:z.jsx(We,{scale:M,children:r.state.child.name==="drawing"?z.jsx(Ve,{lime:r,slideId:r.session.slideId}):z.jsx(Dt,{lime:r})})})})}),We=F(function({scale:r,children:c}){return z.jsx("div",{style:{width:R.x,height:R.y,transform:`scale(${r})`},className:"absolute origin-top-left bg-white overflow-hidden",children:c})}),Ve=F(function({lime:r,slideId:c}){const d=r.getSlideStrokePoints(c);if(!d.length)return null;const b=Me(d,Q);return z.jsx("svg",{className:"absolute inset-0",viewBox:`0 0 ${R.x} ${R.y}`,width:R.x,height:R.y,children:z.jsx("path",{d:Te(b),className:"fill-stone-600"})})}),Dt=F(function({lime:r}){const c=r.getPlayheadPoints(),d=ke(c,Q),b=Me(d,Q);return z.jsx("svg",{className:"absolute inset-0",viewBox:`0 0 ${R.x} ${R.y}`,width:R.x,height:R.y,children:z.jsx("path",{d:Te(b),className:"fill-stone-600"})})}),jt=V(document.getElementById("root"),'Assertion Error: document.getElementById("root")');Ze(jt).render(z.jsx(st.StrictMode,{children:z.jsx(Pt,{})}));