import{b as v,a as w,s as u}from"./chunk_assert.17fe3ff6.js";import{D as x}from"./chunk_DebugDraw.b4e864cf.js";import{c as E}from"./chunk_createTriangleGrid.8879663b.js";import"./chunk_Vector2.d8fb1f00.js";const o=document.createElement("canvas"),f=v(o.getContext("2d"),'Assertion Error: canvasEl.getContext("2d")'),l=document.body.clientWidth,d=document.body.clientHeight,c=window.devicePixelRatio;o.width=l*c;o.height=d*c;o.style.width=`${l}px`;o.style.height=`${d}px`;f.scale(c,c);const n=new x(f);document.body.appendChild(o);const i=5,p=E(i,l,d),g=new Set,y=()=>{const e=[];let t=u([...p.values()].filter(s=>!g.has(s)));const a=40;let r=[...p.values()];for(let s=0;s<a;s++){e.push(t),g.add(t),r=t.neighbours.map(h=>h.triangle);const m=r.filter(h=>!g.has(h));if(!m.length)break;t=u(m)}return{triangles:e}},b=[],k=l/i*(d/i)*.01;console.log({snakeCount:k});for(let e=0;e<k;e++)b.push(y());n.clear("black");for(const{triangles:e}of b){n.beginPath();for(let t=0;t<e.length;t++){const a=e[t],r=e[t-1],s=e[t+1];r?s?n.arcTo(a.center,s.center,i/2-.5):(w(r,"Assertion Error: last"),n.lineTo(a.center)):n.moveTo(a.center)}n.stroke({strokeWidth:i/3-.5,stroke:"white",strokeCap:"round"})}