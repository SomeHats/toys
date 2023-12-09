import{d as $,b,f as J,i as N,m as C,l as A,g as K,j as I,o as Q}from"./chunk_utils.H-tu124z.js";/* empty css                       */import{j as e,c as V}from"./chunk_client.5RwYu7VI.js";import{R as X,r as p}from"./chunk_index.Tw3qZeYI.js";import{a as B,b as L,u as D,s as ee}from"./chunk_useResizeObserver.o4ZmQAol.js";import{i as F}from"./chunk_easings.oeMDsrpW.js";import{u as Y}from"./chunk_useGestureDetector.yKk2dzEl.js";import{S as M}from"./chunk_svgPathBuilder.fvxo4HjO.js";import{B as te}from"./chunk_Button.3zUKvJkI.js";import{c as se}from"./chunk_index.f10NbkGF.js";import"./chunk__commonjsHelpers.5-cIlDoe.js";import"./chunk_Vector2.KSidYDSo.js";import"./chunk_ResizeObserver.-NVrOerG.js";import"./chunk_theme.6peXtGe0.js";import"./chunk_EventEmitter.lFuS8-S7.js";const T=375,w=667,oe=786,ne="/toys/static/asset_fox.izZuuMii.jpg",re="/toys/static/asset_frog.rvUpoPIh.jpg",O=X.memo(function(){return e.jsxs(e.Fragment,{children:[e.jsx(j,{children:"A spectre is haunting Europe — the spectre of communism. All the powers of old Europe have entered into a holy alliance to exorcise this spectre: Pope and Tsar, Metternich and Guizot, French Radicals and German police-spies."}),e.jsx(j,{children:"Where is the party in opposition that has not been decried as communistic by its opponents in power? Where is the opposition that has not hurled back the branding reproach of communism, against the more advanced opposition parties, as well as against its reactionary adversaries?"}),e.jsx(j,{children:"Unrelated to communism, here is a picture of a fox who lives near me:"}),e.jsx(W,{src:ne,caption:"Doesn't he look great?"}),e.jsx(j,{children:"Two things result from this fact:"}),e.jsxs(le,{children:[e.jsx(z,{children:"Communism is already acknowledged by all European powers to be itself a power."}),e.jsx(z,{children:"It is high time that Communists should openly, in the face of the whole world, publish their views, their aims, their tendencies, and meet this nursery tale of the Spectre of Communism with a manifesto of the party itself."})]}),e.jsx(j,{children:"To this end, Communists of various nationalities have assembled in London and sketched the following manifesto, to be published in the English, French, German, Italian, Flemish and Danish languages."}),e.jsx(ie,{children:"Bourgeois and Proletarians"}),e.jsx(j,{children:"The history of all hitherto existing society is the history of class struggles."}),e.jsx(j,{children:"Freeman and slave, patrician and plebeian, lord and serf, guild-master and journeyman, in a word, oppressor and oppressed, stood in constant opposition to one another, carried on an uninterrupted, now hidden, now open fight, a fight that each time ended, either in a revolutionary reconstitution of society at large, or in the common ruin of the contending classes."}),e.jsx(j,{children:"A while ago I went to Costa Rica and saw this frog it was awesome:"}),e.jsx(W,{src:re,caption:"Isn't he cute?"}),e.jsx(j,{children:"In the earlier epochs of history, we find almost everywhere a complicated arrangement of society into various orders, a manifold gradation of social rank. In ancient Rome we have patricians, knights, plebeians, slaves; in the Middle Ages, feudal lords, vassals, guild-masters, journeymen, apprentices, serfs; in almost all of these classes, again, subordinate gradations."})]})});function G({children:t}){return e.jsx("h1",{className:"pr-12 pt-6 text-5xl font-black tracking-wide",children:t})}function ie({children:t}){return e.jsx("h2",{className:"pr-12 pt-6 text-3xl font-black tracking-wide",children:t})}function U({children:t}){return e.jsx("p",{className:"my-3 text-justify text-lg leading-6",children:t})}function j({children:t}){return e.jsx("p",{className:"my-3 text-justify leading-6",children:t})}function le({children:t}){return e.jsx("ol",{className:"list-outside list-decimal",children:t})}function z({children:t}){return e.jsx("li",{className:"mb-3 ml-6 mr-4 text-justify",children:t})}function W({src:t,caption:i}){return e.jsxs("figure",{className:"my-6",children:[e.jsx("img",{src:t,className:"w-full rounded shadow-md"}),e.jsx("figcaption",{className:"pt-3 text-center font-serif text-sm text-stone-600",children:i})]})}function E({scale:t,children:i,className:h,onSizeChange:l=$}){const[a,r]=p.useState(null),o=B(a,L),m=D(l);return p.useLayoutEffect(()=>{o&&m(o.scale(t))},[o,m,t]),e.jsx("div",{ref:r,className:h,style:{transform:`scale(${t})`,width:T,transformOrigin:"top left",position:"absolute"},children:i})}function q({children:t}){const[i,h]=p.useState(null),l=B(i,ee);let a=1;return l&&(a=Math.min(l.x/T,l.y/w)),e.jsx("div",{className:"relative flex min-h-0 min-w-0 flex-auto items-center justify-center",ref:h,children:e.jsx("div",{className:"relative overflow-hidden rounded-md border border-stone-200 shadow-lg",style:{width:T*a,height:w*a},children:e.jsx("div",{className:"absolute inset-0 h-full w-full",children:t(a)})})})}function ae(){const t=p.useRef(null),[i,h]=p.useState(1),[l,a]=p.useState(0);return p.useEffect(()=>{const r=b(t.current,"Assertion Error: scrollContainerRef.current");let o=r.scrollTop;return J(()=>{r.scrollTop-o!==0&&(a(r.scrollTop),o=r.scrollTop)})},[]),e.jsx(q,{children:r=>{const o=200*r,m=T*r,d=w*r,g=Math.ceil((i-d)/o)*o+d;let n=[];const s=Math.floor(l/o)*o,c=l-s,u=Math.max(12,d/i*d);let S,y;if(c<o/2){const f=A(0,o,F(N(0,o/2,c))),x=d/(d-f);S=u/x,y=C(0,g,0,d,s+f),n=[`translate(${m/2}px, ${d}px)`,`scale(${1/C(1,2,1,1.5,x)}, ${x})`,`translate(${-m/2}px, ${-d-s}px)`]}else{const f=A(o,0,F(N(o/2,o,c))),x=d/(d-f);S=u/x,y=C(0,g,0,d,s+o),n=[`translate(${m/2}px, ${-o*x}px)`,`scale(${1/C(1,2,1,1.5,x)}, ${x})`,`translate(${-m/2}px, ${-s}px)`]}return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"absolute top-0",style:{transform:n.join(" ")},children:e.jsxs(E,{scale:r,className:"p-6",onSizeChange:f=>h(f.y),children:[e.jsx(G,{children:"Wormy Scroll"}),e.jsx(U,{children:"Hey babe would you still scroll me if I were a worm?"}),e.jsx(O,{})]})}),e.jsx("div",{ref:t,className:"hide-scrollbar absolute inset-0 top-0 overflow-y-auto overflow-x-hidden",children:e.jsx("div",{style:{height:g}})}),e.jsx(ce,{scrollBarActualHeightPx:S,scrollBarBaseHeightPx:u,scrollBarTopPx:y,scale:r,contentHeightPx:i,containerHeightPx:d,onScroll:f=>{b(t.current,"Assertion Error: scrollContainerRef.current").scrollTop=f}})]})}})}const P=.2,H=60;function ce({scrollBarActualHeightPx:t,scrollBarBaseHeightPx:i,scale:h,scrollBarTopPx:l,contentHeightPx:a,containerHeightPx:r,onScroll:o=$}){const m=p.useRef(null),d=D(f=>{const k=b(m.current,"Assertion Error: containerRef.current").getBoundingClientRect(),Z=N(k.top,k.bottom,f-i/2);o(Z*a)}),g=Y({onDragStart:f=>(f.preventDefault(),d(f.clientY),{couldBeTap:!1,pointerCapture:!0,onMove(x){d(x.clientY)},onEnd(){},onCancel(){}})}),n=(H+10)*h,s=n-6,c=l+6,u=t-24,S=t/i,y=H*h*(1-S);return e.jsx("div",{className:"absolute top-0 right-0 h-full w-5 touch-none",ref:m,...g.events,children:e.jsxs("svg",{className:"absolute right-0 top-0",viewBox:`0 0 ${n} ${r}`,width:n,height:r,children:[e.jsx("path",{d:new M().moveTo(s,c).bezierCurveTo([s,c+u*P],[s-y,c+u*(.5-P)],[s-y,c+u*.5]).smoothBezierCurveTo([s,c+u*(1-P)],[s,c+u]).toString(),fill:"none",strokeWidth:8,className:"stroke-stone-400",strokeLinecap:"round"}),e.jsx("circle",{r:6,cx:s-2,cy:c+u,className:"fill-stone-400"}),e.jsx("circle",{r:1.5,cx:s-5,cy:c+u-1.5,className:"fill-stone-700"}),e.jsx("circle",{r:1.5,cx:s+1,cy:c+u-1.5,className:"fill-stone-700"}),e.jsx("path",{strokeWidth:2,className:"stroke-stone-700",fill:"none",strokeLinecap:"round",d:new M().moveTo(s-5,c+u+2).arcTo(3.5,2,0,0,0,s+1,c+u+2).toString()})]})})}const _=1e5,v=_/2;function de(){const t=p.useRef(null),[i,h]=p.useState(0),[l,a]=p.useState(0);p.useEffect(()=>{const n=b(t.current,"Assertion Error: scrollContainerRef.current");n.scrollTop=v;const s=K(300,()=>{const u=v+I(0,l,n.scrollTop-v);Math.abs(u-n.scrollTop)>1&&(n.scrollTop=u)}),c=u=>{u.target===n&&(h(n.scrollTop),s())};return n.addEventListener("scroll",c,{capture:!0,passive:!1}),()=>{n.removeEventListener("scroll",c,{capture:!0}),s.cancel()}},[l]);const r=e.jsxs(e.Fragment,{children:[e.jsx(G,{children:"Infinite Scroll"}),e.jsx(U,{children:"Scroll up, or scroll down. It doesn't really matter. Follow your heart!"}),e.jsx(O,{})]}),m=(i-v+w/2)/l-.5,d=Math.floor(m),g=Math.ceil(m);return e.jsx(q,{children:n=>e.jsxs(e.Fragment,{children:[e.jsxs("div",{ref:t,className:"hide-scrollbar absolute inset-0 overflow-y-auto overflow-x-hidden",children:[e.jsx("div",{style:{height:_}}),e.jsx("div",{className:"absolute top-0",style:{transform:`translateY(${v+d*l}px)`},children:e.jsx(E,{scale:n,className:"p-6",onSizeChange:s=>a(s.y),children:r})}),e.jsx("div",{className:"absolute top-0",style:{transform:`translateY(${v+g*l}px)`},children:e.jsx(E,{scale:n,className:"p-6",children:r})})]}),l&&e.jsx(ue,{scale:n,contentHeightPx:l,scrollAmount:I(0,l,i-v),onScroll:s=>{const c=b(t.current,"Assertion Error: scrollContainerRef.current");c.scrollTop=v+s}})]})})}function ue({scale:t,contentHeightPx:i,scrollAmount:h,onScroll:l=$}){const a=w*t,r=p.useRef(null),o=Math.max(12,a/i*a),m=C(0,i,0,a,h),d=D(n=>{const c=b(r.current,"Assertion Error: containerRef.current").getBoundingClientRect(),u=N(c.top,c.bottom,n-o/2);l(u*i)}),g=Y({onDragStart:n=>(n.preventDefault(),d(n.clientY),{couldBeTap:!1,pointerCapture:!0,onMove(s){d(s.clientY)},onEnd(){},onCancel(){}})});return e.jsxs("div",{ref:r,className:"absolute right-0 top-0 h-full w-5 touch-none overflow-visible",...g.events,children:[e.jsx("div",{className:"absolute right-0.5 top-0 w-2 rounded-full bg-stone-400",style:{height:`${o}px`,transform:`translateY(${m}px)`}}),e.jsx("div",{className:"absolute right-0.5 top-0 w-2 rounded-full bg-stone-400",style:{height:`${o}px`,transform:`translateY(${m-w*t}px)`}})]})}function he(){const[t,i]=p.useState(null),h=B(t,L);return e.jsxs("div",{ref:i,className:"absolute inset-0 h-full w-full",children:[e.jsx("style",{children:`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}),h&&e.jsx(me,{size:h})]})}const R={Infinite:e.jsx(de,{}),Worm:e.jsx(ae,{})};function me({size:t}){const i=t.x<oe,[h,l]=p.useState("Infinite");return i?e.jsxs("div",{className:"absolute inset-0 flex h-full w-full flex-col items-stretch",children:[e.jsx("div",{className:"flex flex-none items-center justify-center gap-4 p-4",children:Q(R).map(([a,r])=>e.jsx(te,{onClick:()=>l(a),className:se(a===h&&"pointer-events-none bg-gradient-to-br from-fuchsia-500 to-violet-500 !text-white"),children:a},a))}),e.jsx("div",{className:"flex flex-auto items-stretch justify-center overflow-hidden px-4 pb-4",children:R[h]})]}):e.jsx("div",{className:"absolute inset-0 flex items-stretch justify-evenly gap-12 overflow-hidden p-4 md:p-12",children:Object.values(R).map((a,r)=>e.jsx(p.Fragment,{children:a},r))})}V(b(document.getElementById("root"),'Assertion Error: document.getElementById("root")')).render(e.jsx(p.StrictMode,{children:e.jsx(he,{})}));
