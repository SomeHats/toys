import{b as l}from"../chunks/chunk_assert.df27ef91.js";import{D as w}from"../chunks/chunk_DebugDraw.d0a3165c.js";import{c as g}from"../chunks/chunk_createTriangleGrid.d214e775.js";import{Q as h}from"../chunks/chunk_QuadTree.222fe566.js";import{A as r}from"../chunks/chunk_AABB.d6b0d8c0.js";import{V as n}from"../chunks/chunk_Vector2.71f22924.js";const e=document.createElement("canvas"),a=l(e.getContext("2d")),c=document.body.clientWidth,i=document.body.clientHeight,s=window.devicePixelRatio;e.width=c*s;e.height=i*s;e.style.width=`${c}px`;e.style.height=`${i}px`;a.scale(s,s);const f=new w(a);document.body.appendChild(e);const o=30,p=g(o,c,i),d=new h(new r(new n(-o,-o),new n(c+o,i+o)),t=>t.center);for(const t of p.values())d.insert(t);const m=d.findItemsInRect(new r(new n(100,100),new n(200,200)));console.log(m);for(const t of m)f.debugPolygon(t.points);