import{a as d}from"./chunk_assert.658f1ac3.js";import{a as c,E as l}from"./chunk_Entity.dfc47c80.js";import{V as s}from"./chunk_Vector2.465519a8.js";import{e as r,g as p,a as f,b as g,d as C}from"./chunk_PalRenderer.7c37b2e2.js";import"./chunk_index.dc2a5aeb.js";import"./chunk_Circle.189cfc48.js";import"./chunk_AABB.3e2df8a2.js";const t=document.getElementById("root");d(t);const o=new c(800,600,window.devicePixelRatio);o.appendTo(t);const e=new l;e.addComponent(r,new s(100,50));const n=p(),w=e.addComponent(f,n);w.setAnimationController(new g(n));e.addComponent(C,n);o.addChild(e);t.addEventListener("mousemove",a=>{const m=a.clientX-o.canvas.offsetLeft,i=a.clientY-o.canvas.offsetTop;e.getComponent(r).setTarget(new s(m-50,i))});o.start();
