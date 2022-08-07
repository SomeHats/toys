import{a as U,b as Z,l as G,i as ne,d as S,K as se,t as oe}from"../chunks/chunk_assert.b3c9f562.js";/* empty css                               */import{a as ce,r as v,R as ae}from"../chunks/chunk_index.0b2a17fa.js";import{V as w}from"../chunks/chunk_Vector2.6df6a1fc.js";import{R as ie,j as b,a as V,F as le,c as _}from"../chunks/chunk_ResizeObserver.f9437ff6.js";import{b as ue}from"../chunks/chunk_easings.faef6eea.js";import"../chunks/chunk__commonjsHelpers.fbcca4d8.js";var H,B=ce.exports;H=B.createRoot,B.hydrateRoot;let T;const k=new Map;function pe(e){for(const n of e)for(const t of Z(k.get(n.target),"callback does not exist for tracked entry"))t(n)}function K(){return T||(T=new ie(pe)),T}function de(e,n){let t=k.get(e);t||(t=new Set,k.set(e,t),K().observe(e)),t.add(n)}function fe(e,n){const t=k.get(e);U(t,"element is not tracked");const o=t.delete(n);U(o,"callback did not exist for element"),t.size===0&&(k.delete(e),K().unobserve(e))}function me(e,n){const[t,o]=v.exports.useState(null);return v.exports.useEffect(()=>{if(!e)return;const l=f=>{o(n(f))};return de(e,l),()=>{fe(e,l)}},[e,n]),t}function he(e){return new w(e.contentRect.width,e.contentRect.height)}const{min:M,PI:De}=Math,q=.275;function W(e,n={}){const{size:t=16,smoothing:o=.5,thinning:l=.5,simulatePressure:f=!0,easing:s=h=>h,start:i={},end:u={},last:g=!1}=n,{cap:c=!0,easing:r=h=>h*(2-h)}=i,{cap:p=!0,easing:d=h=>--h*h*h+1}=u;if(e.length===0||t<=0)return[];const a=e[e.length-1].runningLength,m=i.taper===!1?0:i.taper===!0?Math.max(t,a):i.taper,x=u.taper===!1?0:u.taper===!0?Math.max(t,a):u.taper,D=Math.pow(t*o,2),F=[];let I=e.slice(0,10).reduce((h,y)=>{let E=y.pressure;if(f){const R=M(1,y.distance/t),N=M(1,1-R);E=M(1,h+(N-h)*(R*q))}return(h+E)/2},e[0].pressure),P=Q(t,l,e[e.length-1].pressure,s);e[0].vector;let L=e[0].point,O=L;for(let h=0;h<e.length;h++){let{pressure:y}=e[h];const{point:E,vector:R,distance:N,runningLength:C}=e[h];if(h<e.length-1&&a-C<3)continue;if(l){if(f){const $=M(1,N/t),re=M(1,1-$);y=M(1,I+(re-I)*($*q))}P=Q(t,l,y,s)}else P=t/2;const Y=C<m?r(C/m):1,ee=a-C<x?d((a-C)/x):1;if(P=Math.max(.01,P*Math.min(Y,ee)),h===e.length-1){F.push({center:E,radius:P});continue}const j=e[h+1].vector,te=R.dot(j);j.lerp(R,te).perpendicular().scale(P),O=E,(h<=1||L.distanceToSq(O)>D)&&(F.push({center:E,radius:P}),L=O),I=y}return F}function J(e,n={}){var p,d;const{streamline:t=.5,size:o=16,last:l=!1}=n;if(e.length===0)return[];const f=.15+(1-t)*.85;let s=e.map(a=>({point:w.fromVectorLike(a),pressure:a.pressure}));if(s.length===2){const a=s[1];s=s.slice(0,-1);for(let m=1;m<5;m++)s.push({point:s[0].point.lerp(a.point,m/4),pressure:a.pressure})}s.length===1&&s.push({point:s[0].point.add(w.UNIT),pressure:s[0].pressure});const i=[{point:s[0].point,pressure:s[0].pressure!=null&&s[0].pressure>=0?s[0].pressure:.25,vector:w.UNIT,distance:0,runningLength:0}];let u=!1,g=0,c=i[0];const r=s.length-1;for(let a=1;a<s.length;a++){const m=s[a],x=l&&a===r?m.point:c.point.lerp(m.point,f);if(c.point.equals(x))continue;const D=x.distanceTo(c.point);if(g+=D,a<r&&!u){if(g<o)continue;u=!0}c={point:x,pressure:m.pressure!=null&&m.pressure>=0?m.pressure:.5,vector:c.point.sub(x).normalize(),distance:D,runningLength:g},i.push(c)}return i[0].vector=(d=(p=i[1])==null?void 0:p.vector)!=null?d:w.ZERO,i}function Q(e,n,t,o=l=>l){return e*o(.5-n*(.5-t))}function ge(e){if(!e.length)return"";const n=["M",e[0].x,e[0].y,"Q"];for(let t=0;t<e.length;t++){const o=e[t],l=e[(t+1)%e.length],f=o.add(l).scale(.5);n.push(o.x,o.y,f.x,f.y)}return n.push("Z"),n.join(" ")}function X(e,n){const t=[e[0]];if(e.length===0)return[];let o=n,l=e[0],f=e[0].center;for(let s=1;s<e.length;s++){const i=e[s],u=e[Math.min(s+1,e.length-1)],g=i.center.add(u.center).scale(.5),c=i.center.distanceTo(l.center),r=f,p=i.center,d=g;let a=0;for(;c-a>=o;){const m=(o+a)/c;t.push({center:r.lerp(p,m).lerp(p.lerp(d,m),m),radius:G(l.radius,i.radius,m)}),a+=o,o=n}o-=c-a,l=i,f=g}return t.push(e[e.length-1]),t}function xe(e){const n=[],t=[];if(e.length===0)return[];if(e.length===1){const r=[];for(let p=0;p<12;p++)r.push(e[0].center.add(w.fromPolar(p*Math.PI/6,e[0].radius)));return r}const o=e[0],f=e[1].center.sub(o.center).normalize(),s=f.perpendicular().scale(o.radius);n.push(o.center.sub(f.scale(o.radius))),n.push(o.center.sub(s)),t.push(o.center.add(s));for(let r=1;r<e.length-1;r++){const p=e[r-1],d=e[r],x=e[r+1].center.sub(p.center).normalize().perpendicular().scale(d.radius);n.push(d.center.sub(x)),t.push(d.center.add(x))}const i=e[e.length-2],u=e[e.length-1],g=u.center.sub(i.center).normalize(),c=g.perpendicular().scale(u.radius);return n.push(u.center.sub(c)),n.push(u.center.add(g.scale(u.radius))),t.push(u.center.add(c)),n.concat(t.reverse())}const z={size:16,streamline:.5,smoothing:.5,thinning:.5,simulatePressure:!0,easing:e=>e,start:{},end:{},last:!1};function ve(){const[e,n]=v.exports.useState(null),t=me(e,he);return b("div",{ref:n,className:"absolute inset-0",children:t&&b(we,{size:t})})}const be=1e3;function we({size:e}){const[n,t]=v.exports.useState({type:"idle"}),[{frames:o,frameIdx:l},f]=v.exports.useState(()=>({frames:A([[]]),frameIdx:0}));v.exports.useEffect(()=>{let c=!1;return ne((r,p)=>{if(c){p();return}t(d=>{switch(d.type){case"idle":case"drawing":return d;case"lerp":{const a=se(d.startedAtMs,d.startedAtMs+be,r);return a>1?{type:"idle"}:{...d,progress:a}}default:S(d)}})}),()=>{c=!0}});const s=v.exports.useCallback(c=>{c.preventDefault(),t(r=>{switch(r.type){case"lerp":return r;case"idle":return{type:"drawing",points:[w.fromEvent(c)]};case"drawing":return r;default:S(r)}})},[]),i=v.exports.useCallback(c=>{c.preventDefault(),t(r=>{switch(r.type){case"idle":case"lerp":return r;case"drawing":return{...r,points:[...r.points,w.fromEvent(c)]};default:S(r)}})},[]),u=v.exports.useCallback(c=>{c.preventDefault(),t(r=>{switch(r.type){case"idle":case"lerp":return r;case"drawing":return f(p=>{const d=p.frames.map(a=>a.rawPoints);return d[p.frameIdx]=r.points,{...p,frames:A(d)}}),{type:"idle"};default:S(r)}})},[]),g=v.exports.useMemo(()=>{switch(n.type){case"idle":return o[l].normalizedCenterPoints;case"drawing":return X(W(J(n.points,z),z),z.size);case"lerp":{const c=o[n.from].normalizedCenterPoints,r=o[n.to].normalizedCenterPoints,p=ue(n.progress);return oe(Math.max(c.length,r.length),d=>{const a=c[Math.min(d,c.length-1)],m=r[Math.min(d,r.length-1)];return console.log({idx:d,p1:a,p2:m}),{center:a.center.lerp(m.center,p),radius:G(a.radius,m.radius,p)}})}default:S(n)}},[n,l,o]);return V(le,{children:[b("div",{className:"pointer-events-none absolute top-0",children:Pe(n)}),b("svg",{viewBox:`0 0 ${e.x} ${e.y}`,onPointerDown:s,onPointerMove:i,onPointerUp:u,children:b("path",{d:ge(xe(g))})}),V("div",{className:"absolute bottom-0 left-0 flex w-full items-center justify-center gap-3 p-3",children:[o.map((c,r)=>b("button",{className:_("flex h-10 w-10 items-center justify-center rounded border border-stone-200 text-stone-400 shadow-md transition-transform hover:-translate-y-1",r===l?" text-stone-500 ring-2 ring-inset ring-purple-400":"text-stone-400"),onClick:()=>{f(p=>({...p,frameIdx:r})),t({type:"lerp",from:l,to:r,startedAtMs:performance.now(),progress:0})},children:r+1},r)),b("button",{className:_("flex h-10 w-10 items-center justify-center rounded border border-stone-200 text-stone-400 shadow-md transition-transform hover:-translate-y-1"),onClick:()=>{f(c=>{const r=c.frames.map(p=>p.rawPoints);return r.push([]),{...c,frames:A(r),frameIdx:c.frames.length}})},children:"+"})]})]})}function A(e){var l,f;if(e.length===0)return[];const n=[];let t=0;for(const s of e){const i=J(s),u=(f=(l=i[i.length-1])==null?void 0:l.runningLength)!=null?f:0;n.push({rawPoints:s,strokePoints:i,length:u}),u>t&&(t=u)}const o=Math.floor(t/z.size);return n.map(({rawPoints:s,strokePoints:i,length:u})=>({rawPoints:s,length:u,normalizedCenterPoints:X(W(i,z),u/o)}))}function Pe(e){switch(e.type){case"idle":return"idle";case"lerp":return`lerp(from = ${e.from}, to = ${e.to}, progress = ${e.progress})`;case"drawing":return`drawing(points = ${e.points.length})`;default:S(e)}}const ye=Z(document.getElementById("root"));H(ye).render(b(ae.StrictMode,{children:b(ve,{})}));
