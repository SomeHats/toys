!function(){var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},t={},n={},r=e.parcelRequire0561;null==r&&((r=function(e){if(e in t)return t[e].exports;if(e in n){var r=n[e];delete n[e];var l={id:e,exports:{}};return t[e]=l,r.call(l.exports,l,l.exports),l.exports}var o=new Error("Cannot find module '"+e+"'");throw o.code="MODULE_NOT_FOUND",o}).register=function(e,t){n[e]=t},e.parcelRequire0561=r);var l=r("bK7pi"),o=document.createElement("canvas"),a=o.getContext("2d"),i=document.body.clientWidth,d=document.body.clientHeight,u=window.devicePixelRatio;o.width=i*u,o.height=d*u,o.style.width="".concat(i,"px"),o.style.height="".concat(d,"px"),a.scale(u,u);var f=new l.DebugDraw(a);document.body.appendChild(o);var c=r("44e7r"),w=r("REUuP"),v=r("7B1qO"),y=r("54lVR"),s=c.default(30,i,d),p=new w.default(new v.default(new y.default(-30,-30),new y.default(i+30,d+30)),(function(e){return e.center})),h=!0,g=!1,b=void 0;try{for(var x,m=s.values()[Symbol.iterator]();!(h=(x=m.next()).done);h=!0){var R=x.value;p.insert(R)}}catch(e){g=!0,b=e}finally{try{h||null==m.return||m.return()}finally{if(g)throw b}}var D=p.findItemsInRect(new v.default(new y.default(100,100),new y.default(200,200)));console.log(D);var E=!0,O=!1,q=void 0;try{for(var C,P=D[Symbol.iterator]();!(E=(C=P.next()).done);E=!0){var T=C.value;f.debugPolygon(T.points)}}catch(e){O=!0,q=e}finally{try{E||null==P.return||P.return()}finally{if(O)throw q}}}();
//# sourceMappingURL=index.c8063ebc.js.map