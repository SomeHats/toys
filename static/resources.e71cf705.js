import{b as m}from"./chunk_assert.17fe3ff6.js";import{D as w}from"./chunk_DebugDraw.b4e864cf.js";import{c as g}from"./chunk_createTriangleGrid.8879663b.js";import{Q as h}from"./chunk_QuadTree.221dc065.js";import{A as r}from"./chunk_AABB.8e870ce8.js";import{V as n}from"./chunk_Vector2.d8fb1f00.js";const t=document.createElement("canvas"),a=m(t.getContext("2d"),'Assertion Error: canvasEl.getContext("2d")'),c=document.body.clientWidth,i=document.body.clientHeight,s=window.devicePixelRatio;t.width=c*s;t.height=i*s;t.style.width=`${c}px`;t.style.height=`${i}px`;a.scale(s,s);const f=new w(a);document.body.appendChild(t);const o=30,p=g(o,c,i),d=new h(new r(new n(-o,-o),new n(c+o,i+o)),e=>e.center);for(const e of p.values())d.insert(e);const l=d.findItemsInRect(new r(new n(100,100),new n(200,200)));console.log(l);for(const e of l)f.debugPolygon(e.points);