import{a as d}from"./assert.8e182e5c.js";import{a as c,E as l}from"./Entity.047afe00.js";import{V as r}from"./Vector2.1dd7230e.js";import{e as s,g as p,a as f,b as g,d as C}from"./PalRenderer.f316a703.js";import"./utils.7cc05280.js";import"./index.509b8e21.js";import"./Circle.3a5b0fc4.js";import"./AABB.924e5825.js";const t=document.getElementById("root");d(t);const o=new c(800,600,window.devicePixelRatio);o.appendTo(t);const e=new l;e.addComponent(s,new r(100,50));const n=p(),w=e.addComponent(f,n);w.setAnimationController(new g(n));e.addComponent(C,n);o.addChild(e);t.addEventListener("mousemove",a=>{const m=a.clientX-o.canvas.offsetLeft,i=a.clientY-o.canvas.offsetTop;e.getComponent(s).setTarget(new r(m-50,i))});o.start();