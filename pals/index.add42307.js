!function(){var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n={},t={},o=e.parcelRequire0561;null==o&&((o=function(e){if(e in n)return n[e].exports;if(e in t){var o=t[e];delete t[e];var a={id:e,exports:{}};return n[e]=a,o.call(a.exports,a,a.exports),a.exports}var r=new Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}).register=function(e,n){t[e]=n},e.parcelRequire0561=o);var a=o("dLeLC"),r=o("8OvEy"),d=o("39Hjj"),l=o("bADSp"),i=o("1js6q"),f=o("7oj37"),u=o("hdQD0"),s=o("leuCG"),p=o("cvm1i"),v=document.getElementById("root");r.assert(v);var c=new a.default(800,600,window.devicePixelRatio);c.appendTo(v);var w=new l.default;w.addComponent(i.PalTargetController,new d.default(100,50));var g=p.generateRandomPalConfig();w.addComponent(f.default,g).setAnimationController(new s.default(g)),w.addComponent(u.default,g),c.addChild(w),v.addEventListener("mousemove",(function(e){var n=e.clientX-c.canvas.offsetLeft,t=e.clientY-c.canvas.offsetTop;w.getComponent(i.PalTargetController).setTarget(new d.default(n-50,t))})),c.start()}();
//# sourceMappingURL=index.add42307.js.map
