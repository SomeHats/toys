import{q as j,b as w,w as K,x as M,o as R,m as N,j as X,l as F,e as ee}from"./chunk_assert.17fe3ff6.js";/* empty css                       */import{a as E,b as q,u as z,s as te,c as oe}from"./chunk_client.5da2eee4.js";import{R as re,r as f}from"./chunk_index.9ef61b8f.js";import{u as G,B as ne}from"./chunk_useGestureDetector.1e95543c.js";import{c as se}from"./chunk_index.9d627959.js";import{a as g,F as A,j as e}from"./chunk_jsx-runtime.faf32752.js";import{i as W}from"./chunk_easings.a2b8a447.js";import{V as v}from"./chunk_Vector2.d8fb1f00.js";import"./chunk__commonjsHelpers.e5e952e9.js";import"./chunk_theme.5443e31e.js";import"./chunk_EventEmitter.18fc68ab.js";const B=375,S=667,ie=786,ae="/toys/static/asset_fox.e01152ba.jpg",le="/toys/static/asset_frog.433f64b3.jpg",U=re.memo(function(){return g(A,{children:[e(b,{children:"A spectre is haunting Europe \u2014 the spectre of communism. All the powers of old Europe have entered into a holy alliance to exorcise this spectre: Pope and Tsar, Metternich and Guizot, French Radicals and German police-spies."}),e(b,{children:"Where is the party in opposition that has not been decried as communistic by its opponents in power? Where is the opposition that has not hurled back the branding reproach of communism, against the more advanced opposition parties, as well as against its reactionary adversaries?"}),e(b,{children:"Unrelated to communism, here is a picture of a fox who lives near me:"}),e(L,{src:ae,caption:"Doesn't he look great?"}),e(b,{children:"Two things result from this fact:"}),g(de,{children:[e(H,{children:"Communism is already acknowledged by all European powers to be itself a power."}),e(H,{children:"It is high time that Communists should openly, in the face of the whole world, publish their views, their aims, their tendencies, and meet this nursery tale of the Spectre of Communism with a manifesto of the party itself."})]}),e(b,{children:"To this end, Communists of various nationalities have assembled in London and sketched the following manifesto, to be published in the English, French, German, Italian, Flemish and Danish languages."}),e(ce,{children:"Bourgeois and Proletarians"}),e(b,{children:"The history of all hitherto existing society is the history of class struggles."}),e(b,{children:"Freeman and slave, patrician and plebeian, lord and serf, guild-master and journeyman, in a word, oppressor and oppressed, stood in constant opposition to one another, carried on an uninterrupted, now hidden, now open fight, a fight that each time ended, either in a revolutionary reconstitution of society at large, or in the common ruin of the contending classes."}),e(b,{children:"A while ago I went to Costa Rica and saw this frog it was awesome:"}),e(L,{src:le,caption:"Isn't he cute?"}),e(b,{children:"In the earlier epochs of history, we find almost everywhere a complicated arrangement of society into various orders, a manifold gradation of social rank. In ancient Rome we have patricians, knights, plebeians, slaves; in the Middle Ages, feudal lords, vassals, guild-masters, journeymen, apprentices, serfs; in almost all of these classes, again, subordinate gradations."})]})});function Q({children:t}){return e("h1",{className:"pr-12 pt-6 text-5xl font-black tracking-wide",children:t})}function ce({children:t}){return e("h2",{className:"pr-12 pt-6 text-3xl font-black tracking-wide",children:t})}function V({children:t}){return e("p",{className:"my-3 text-justify text-lg leading-6",children:t})}function b({children:t}){return e("p",{className:"my-3 text-justify leading-6",children:t})}function de({children:t}){return e("ol",{className:"list-outside list-decimal",children:t})}function H({children:t}){return e("li",{className:"mb-3 ml-6 mr-4 text-justify",children:t})}function L({src:t,caption:o}){return g("figure",{className:"my-6",children:[e("img",{src:t,className:"w-full rounded shadow-md"}),e("figcaption",{className:"pt-3 text-center font-serif text-sm text-stone-600",children:o})]})}function k({scale:t,children:o,className:s,onSizeChange:r=j}){const[n,a]=f.exports.useState(null),i=E(n,q),p=z(r);return f.exports.useLayoutEffect(()=>{i&&p(i.scale(t))},[i,p,t]),e("div",{ref:a,className:s,style:{transform:`scale(${t})`,width:B,transformOrigin:"top left",position:"absolute"},children:o})}function _({children:t}){const[o,s]=f.exports.useState(null),r=E(o,te);let n=1;return r&&(n=Math.min(r.x/B,r.y/S)),e("div",{className:"relative flex min-h-0 min-w-0 flex-auto items-center justify-center",ref:s,children:e("div",{className:"relative overflow-hidden rounded-md border border-stone-200 shadow-lg",style:{width:B*n,height:S*n},children:e("div",{className:"absolute inset-0 h-full w-full",children:t(n)})})})}const Z=1e5,$=Z/2;function ue(){const t=f.exports.useRef(null),[o,s]=f.exports.useState(0),[r,n]=f.exports.useState(0);f.exports.useEffect(()=>{const c=w(t.current,"Assertion Error: scrollContainerRef.current");c.scrollTop=$;const l=K(300,()=>{const h=$+M(0,r,c.scrollTop-$);Math.abs(h-c.scrollTop)>1&&(c.scrollTop=h)}),d=h=>{h.target===c&&(s(c.scrollTop),l())};return c.addEventListener("scroll",d,{capture:!0,passive:!1}),()=>{c.removeEventListener("scroll",d,{capture:!0}),l.cancel()}},[r]);const a=g(A,{children:[e(Q,{children:"Infinite Scroll"}),e(V,{children:"Scroll up, or scroll down. It doesn't really matter. Follow your heart!"}),e(U,{})]}),p=(o-$+S/2)/r-.5,u=Math.floor(p),y=Math.ceil(p);return e(_,{children:c=>g(A,{children:[g("div",{ref:t,className:"hide-scrollbar absolute inset-0 overflow-y-auto overflow-x-hidden",children:[e("div",{style:{height:Z}}),e("div",{className:"absolute top-0",style:{transform:`translateY(${$+u*r}px)`},children:e(k,{scale:c,className:"p-6",onSizeChange:l=>n(l.y),children:a})}),e("div",{className:"absolute top-0",style:{transform:`translateY(${$+y*r}px)`},children:e(k,{scale:c,className:"p-6",children:a})})]}),r&&e(he,{scale:c,contentHeightPx:r,scrollAmount:M(0,r,o-$),onScroll:l=>{const d=w(t.current,"Assertion Error: scrollContainerRef.current");d.scrollTop=$+l}})]})})}function he({scale:t,contentHeightPx:o,scrollAmount:s,onScroll:r=j}){const n=S*t,a=f.exports.useRef(null),i=Math.max(12,n/o*n),p=N(0,o,0,n,s),u=z(c=>{const d=w(a.current,"Assertion Error: containerRef.current").getBoundingClientRect(),h=R(d.top,d.bottom,c-i/2);r(h*o)}),y=G({onDragStart:c=>{c.preventDefault();const l=w(a.current,"Assertion Error: containerRef.current");return l.setPointerCapture(c.pointerId),u(c.clientY),{couldBeTap:!1,onMove(d){u(d.clientY)},onEnd(){l.releasePointerCapture(c.pointerId)},onCancel(){l.releasePointerCapture(c.pointerId)}}}});return g("div",{ref:a,className:"absolute right-0 top-0 h-full w-5 touch-none overflow-visible",...y.events,children:[e("div",{className:"absolute right-0.5 top-0 w-2 rounded-full bg-stone-400",style:{height:`${i}px`,transform:`translateY(${p}px)`}}),e("div",{className:"absolute right-0.5 top-0 w-2 rounded-full bg-stone-400",style:{height:`${i}px`,transform:`translateY(${p-S*t}px)`}})]})}class Y{constructor(){this.parts=[]}toString(){return this.parts.join(" ")}add(o){return this.parts.push(o),this}moveTo(...o){const{x:s,y:r}=v.fromArgs(o);return this.add(`M${s} ${r}`)}lineTo(...o){const{x:s,y:r}=v.fromArgs(o);return this.add(`L${s} ${r}`)}closePath(){return this.add("Z")}arcTo(o,s,r,n,a,...i){const{x:p,y:u}=v.fromArgs(i);return this.add(`A${o} ${s} ${r} ${n} ${a} ${p} ${u}`)}quadraticCurveTo(o,s){const r=v.from(o),n=v.from(s);return this.add(`Q${r.x} ${r.y} ${n.x} ${n.y}`)}smoothQuadraticCurveTo(o){const s=v.from(o);return this.add(`T${s.x} ${s.y}`)}bezierCurveTo(o,s,r){const n=v.from(o),a=v.from(s),i=v.from(r);return this.add(`C${n.x} ${n.y} ${a.x} ${a.y} ${i.x} ${i.y}`)}smoothBezierCurveTo(o,s){const r=v.from(o),n=v.from(s);return this.add(`S${r.x} ${r.y} ${n.x} ${n.y}`)}}function pe(){const t=f.exports.useRef(null),[o,s]=f.exports.useState(1),[r,n]=f.exports.useState(0);return f.exports.useEffect(()=>{const a=w(t.current,"Assertion Error: scrollContainerRef.current");let i=a.scrollTop;return X(()=>{a.scrollTop-i!==0&&(n(a.scrollTop),i=a.scrollTop)})},[]),e(_,{children:a=>{const i=200*a,p=B*a,u=S*a,y=Math.ceil((o-u)/i)*i+u;let c=[];const l=Math.floor(r/i)*i,d=r-l,h=Math.max(12,u/o*u);let T,C;if(d<i/2){const m=F(0,i,W(R(0,i/2,d))),x=u/(u-m);T=h/x,C=N(0,y,0,u,l+m),c=[`translate(${p/2}px, ${u}px)`,`scale(${1/N(1,2,1,1.5,x)}, ${x})`,`translate(${-p/2}px, ${-u-l}px)`]}else{const m=F(i,0,W(R(i/2,i,d))),x=u/(u-m);T=h/x,C=N(0,y,0,u,l+i),c=[`translate(${p/2}px, ${-i*x}px)`,`scale(${1/N(1,2,1,1.5,x)}, ${x})`,`translate(${-p/2}px, ${-l}px)`]}return g(A,{children:[e("div",{className:"absolute top-0",style:{transform:c.join(" ")},children:g(k,{scale:a,className:"p-6",onSizeChange:m=>s(m.y),children:[e(Q,{children:"Wormy Scroll"}),e(V,{children:"Hey babe would you still scroll me if I were a worm?"}),e(U,{})]})}),e("div",{ref:t,className:"hide-scrollbar absolute inset-0 top-0 overflow-y-auto overflow-x-hidden",children:e("div",{style:{height:y}})}),e(fe,{scrollBarActualHeightPx:T,scrollBarBaseHeightPx:h,scrollBarTopPx:C,scale:a,contentHeightPx:o,containerHeightPx:u,onScroll:m=>{w(t.current,"Assertion Error: scrollContainerRef.current").scrollTop=m}})]})}})}const I=.2,O=60;function fe({scrollBarActualHeightPx:t,scrollBarBaseHeightPx:o,scale:s,scrollBarTopPx:r,contentHeightPx:n,containerHeightPx:a,onScroll:i=j}){const p=f.exports.useRef(null),u=z(m=>{const P=w(p.current,"Assertion Error: containerRef.current").getBoundingClientRect(),J=R(P.top,P.bottom,m-o/2);i(J*n)}),y=G({onDragStart:m=>{m.preventDefault();const x=w(p.current,"Assertion Error: containerRef.current");return x.setPointerCapture(m.pointerId),u(m.clientY),{couldBeTap:!1,onMove(P){u(P.clientY)},onEnd(){x.releasePointerCapture(m.pointerId)},onCancel(){x.releasePointerCapture(m.pointerId)}}}}),c=(O+10)*s,l=c-6,d=r+6,h=t-24,T=t/o,C=O*s*(1-T);return e("div",{className:"absolute top-0 right-0 h-full w-5 touch-none",ref:p,...y.events,children:g("svg",{className:"absolute right-0 top-0",viewBox:`0 0 ${c} ${a}`,width:c,height:a,children:[e("path",{d:new Y().moveTo(l,d).bezierCurveTo([l,d+h*I],[l-C,d+h*(.5-I)],[l-C,d+h*.5]).smoothBezierCurveTo([l,d+h*(1-I)],[l,d+h]).toString(),fill:"none",strokeWidth:8,className:"stroke-stone-400",strokeLinecap:"round"}),e("circle",{r:6,cx:l-2,cy:d+h,className:"fill-stone-400"}),e("circle",{r:1.5,cx:l-5,cy:d+h-1.5,className:"fill-stone-700"}),e("circle",{r:1.5,cx:l+1,cy:d+h-1.5,className:"fill-stone-700"}),e("path",{strokeWidth:2,className:"stroke-stone-700",fill:"none",strokeLinecap:"round",d:new Y().moveTo(l-5,d+h+2).arcTo(3.5,2,0,0,0,l+1,d+h+2).toString()})]})})}function me(){const[t,o]=f.exports.useState(null),s=E(t,q);return g("div",{ref:o,className:"absolute inset-0 h-full w-full",children:[e("style",{children:`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}),s&&e(xe,{size:s})]})}const D={Infinite:e(ue,{}),Worm:e(pe,{})};function xe({size:t}){const o=t.x<ie,[s,r]=f.exports.useState("Infinite");return o?g("div",{className:"absolute inset-0 flex h-full w-full flex-col items-stretch",children:[e("div",{className:"flex flex-none items-center justify-center gap-4 p-4",children:ee(D).map(([n,a])=>e(ne,{onClick:()=>r(n),className:se(n===s&&"pointer-events-none bg-gradient-to-br from-fuchsia-500 to-violet-500 !text-white"),children:n},n))}),e("div",{className:"flex flex-auto items-stretch justify-center overflow-hidden px-4 pb-4",children:D[s]})]}):e("div",{className:"absolute inset-0 flex items-stretch justify-evenly gap-12 overflow-hidden p-4 md:p-12",children:Object.values(D).map((n,a)=>e(f.exports.Fragment,{children:n},a))})}oe(w(document.getElementById("root"),'Assertion Error: document.getElementById("root")')).render(e(f.exports.StrictMode,{children:e(me,{})}));
