import{a as d}from"./assert.99a33aa8.js";import{a as c,E as l}from"./Entity.aa167d0f.js";import{V as s}from"./Vector2.550325b5.js";import{e as r,g as p,a as f,b as g,d as C}from"./PalRenderer.9583bf05.js";import"./index.509b8e21.js";import"./Circle.c1ae2d60.js";import"./AABB.a932f068.js";const t=document.getElementById("root");d(t);const o=new c(800,600,window.devicePixelRatio);o.appendTo(t);const e=new l;e.addComponent(r,new s(100,50));const n=p(),w=e.addComponent(f,n);w.setAnimationController(new g(n));e.addComponent(C,n);o.addChild(e);t.addEventListener("mousemove",a=>{const m=a.clientX-o.canvas.offsetLeft,i=a.clientY-o.canvas.offsetTop;e.getComponent(r).setTarget(new s(m-50,i))});o.start();
