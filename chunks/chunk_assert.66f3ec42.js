const m=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function n(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerpolicy&&(i.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?i.credentials="include":o.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(o){if(o.ep)return;o.ep=!0;const i=n(o);fetch(o.href,i)}};m();function v(t,e){const n=[];for(let r=0;r<t;r++)n.push(e(r));return n}function u(t,e,n){return(e-t)*n+t}function d(t,e,n){return(n-t)/(e-t)}function O(t,e,n){return t>e?e<=n&&n<=t:t<=n&&n<=e}function S(t,e,n){return Math.min(e,Math.max(t,n))}function p(t,e,n){const r=e-t;for(n=n-t;n<0;)n+=r;return n=n%r,t+n}function A(t,e,n,r,o){return u(n,r,d(t,e,o))}function c(t,e){return typeof e=="number"?u(t,e,Math.random()):u(0,t,Math.random())}function I(t,e){return Math.floor(c(t,e))}function h(t,e){return c(t-e,t+e)}function b(t,e){return h(t,t*e)}function P(t){return t[Math.floor(c(t.length))]}function x(t){return t.reduce((e,n)=>e.concat(n),[])}function L(t){return Array.from(new Set(t))}function E(t,e){const n=new Set(t),r=new Set;for(const o of e)n.has(o)&&r.add(o);return Array.from(r)}function N(t,e){const n=new Map;for(const r of t){const o=e(r),i=n.get(o);i?i.push(r):n.set(o,[r])}return n}function j(t,e){return t.slice().sort((n,r)=>e(n)<e(r)?-1:1)}function F(t,e){const n=[],r=[];for(const o of t)e(o)?n.push(o):r.push(o);return[n,r]}function q(t,e){const n=t.indexOf(e);n!==-1&&t.splice(n,1)}function y(){return new Promise(t=>{window.requestAnimationFrame(e=>t(e))})}async function R(t){let e=!1;const n=()=>{e=!0};for(;;)if(t(await y(),n),e)return}function k(t){const e={};for(const[n,r]of t)e[n]=r;return e}function z(t){return Object.keys(t)}function B(t){return Object.values(t)}function C(t){return Object.entries(t)}function J(t){return t.filter(e=>e!=null)}function T(t){return p(-Math.PI,Math.PI,t)}function U(t,e,n){return Math.max(Math.min(t,e),Math.min(Math.max(t,e),n))}function W(t){const e=t.slice();for(let n=e.length-1;n>0;n--){const r=Math.floor(Math.random()*(n+1));[e[n],e[r]]=[e[r],e[n]]}return e}function $(t=""){return`${t}${Math.random().toString(36).slice(1)}`}function H(t,e=null){try{const n=window.localStorage.getItem(t);return n?JSON.parse(n):e}catch(n){return console.log(n),e}}function D(t,e){const n=JSON.stringify(e);try{window.localStorage.setItem(t,n)}catch(r){console.log(r)}}function G(t,e){let n;return(...r)=>{n!==void 0&&clearTimeout(n),n=setTimeout(()=>e(...r),t)}}function K(t){throw new Error(`Unknown switch case ${t}`)}function g(t,e){return Object.prototype.hasOwnProperty.call(t,e)}function Q(t,e){if(!!g(t,e))return t[e]}function _(t,e){return new Promise((n,r)=>{t(n),e(r)})}function V(t,e){const n=t.slice();return n.splice(e,1),n}function X(){}var a,f;const Y=/(Mac|iPhone|iPod|iPad)/i.test((f=(a=globalThis.navigator)==null?void 0:a.platform)!=null?f:"");function w(t,e){return typeof e=="function"?e(t):e}function Z(t,e,n){const r=t[e],o=w(r,n);return Object.is(r,o)?t:{...t,[e]:o}}function l(t){throw new Error(t)}function M(t,e){t||l(e||"Assertion Error")}function tt(t){return M(typeof t=="number","value must be number"),t}function et(t,e){return t||l(e!=null?e:"value must be defined"),t}export{W as A,tt as B,H as C,G as D,U as E,D as F,j as G,F as H,N as I,$ as J,E as K,k as L,w as M,V as N,Y as O,Z as P,d as Q,q as R,y as S,M as a,et as b,K as c,X as d,C as e,l as f,Q as g,g as h,R as i,O as j,z as k,u as l,A as m,T as n,S as o,_ as p,x as q,c as r,P as s,v as t,L as u,B as v,J as w,b as x,h as y,I as z};
