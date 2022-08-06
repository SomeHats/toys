import{b as y,i as P,s as b,r as S,a as C,t as I,y as N,u as G}from"./assert.99a33aa8.js";import{D as L}from"./DebugDraw.2d458dd9.js";import{V as k}from"./Vector2.550325b5.js";import{c as W}from"./createTriangleGrid.f2a07993.js";import{C as c}from"./index.509b8e21.js";const g=document.createElement("canvas"),D=y(g.getContext("2d")),m=document.body.clientWidth,p=document.body.clientHeight,d=window.devicePixelRatio;g.width=m*d;g.height=p*d;g.style.width=`${m}px`;g.style.height=`${p}px`;D.scale(d,d);const i=new L(D);document.body.appendChild(g);const A=new c("#E2ECC9"),B=[new c("#C33C54"),new c("#bfb915"),new c("#96ba3b"),new c("#39847f"),new c("#12416b")],h=50,l=Math.PI*h/6,H=W(h,m,p),v=()=>{const e=I(N(2,6),()=>b(B).string());if(G(e).length===1)return v();let s=0;return{palette:e,current:()=>e[s%e.length],next:()=>(s++,e[s%e.length]),reset:(n=0)=>{s=n}}};function w(e,s){const n=e.neighbours.find(t=>t.triangle===s);return C(n,"must be a neighbour"),n.sharedPoints}const f=new Set,x=()=>{const e=[],s=v();let n=[...H.values()];for(let t=0;t<2;t++){const r=n.filter(a=>!f.has(a));if(!r.length)break;const o=b(r);e.push(o),f.add(o),n=o.neighbours.map(a=>a.triangle)}return{triangles:e,palette:s,speed:S(.06,.12),offset:0,base:0,length:e.length,isDead:!1}},u=[];for(let e=0;e<10;e++)u.push(x());P(()=>{i.clear(A.string());for(const e of u){if(e.offset+=e.speed,e.offset>1){if(e.offset--,e.base++,!e.isDead){const o=e.triangles[0].neighbours.filter(a=>!f.has(a.triangle));if(o.length){const a=b(o).triangle;f.add(a),e.triangles.unshift(a),e.base--,e.length++}else e.isDead=!0,u.push(x())}const t=e.triangles[e.triangles.length-e.base];t&&(f.delete(t),e.length--)}const{triangles:s,palette:n}=e;n.reset(e.base);for(let t=0;t<e.length;t++){const r=s[t],o=s[t-1],a=s[t+1],T=n.current(),E=n.next();if(i.beginPath(),o)a?(i.moveTo(k.average(w(r,o))),i.arcTo(r.center,a.center,h/2-.5)):(C(o),i.moveTo(k.average(w(r,o))),i.lineTo(r.center));else continue;t===1&&!e.isDead||i.stroke({strokeWidth:h/2,stroke:T,strokeCap:"round",strokeDash:[l,l],strokeDashOffset:e.offset*l}),t===e.length-1&&e.isDead||i.stroke({strokeWidth:h/2,stroke:E,strokeCap:"round",strokeDash:[l,l],strokeDashOffset:e.offset*l-l})}}});
