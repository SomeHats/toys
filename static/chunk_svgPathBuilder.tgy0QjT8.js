import{a5 as h,b as l}from"./chunk_utils.ferkvykK.js";import{V as n}from"./chunk_Vector2.Rt8uspPZ.js";class c{constructor(){this.parts=[],this.lastPoint=null}static straightThroughPoints(t){const o=new c;o.moveTo(t[0]);for(let r=1;r<t.length;r++)o.lineTo(t[r]);return o}static midpointQuadraticViaPoints(t){const o=new c;if(t.length>=2){o.moveTo(t[0]),o.lineTo(t[0].lerp(t[1],.5));let r=t[1];for(let s=2;s<t.length;s++){const i=t[s],e=r.lerp(i,.5);o.quadraticCurveTo(r,e),r=i}o.lineTo(r)}return o}toString(){return this.parts.join(" ")}add(t){return this.parts.push(t),this}moveTo(...t){const o=n.fromArgs(t);return this.lastPoint=o,this.add(`M${o.x} ${o.y}`)}moveToIfNeeded(...t){const o=n.fromArgs(t);return this.lastPoint&&this.lastPoint.equals(o)?this:this.moveTo(o)}lineTo(...t){const o=n.fromArgs(t);return this.lastPoint=o,this.add(`L${o.x} ${o.y}`)}closePath(){return this.add("Z")}arcTo(t,o,r,s,i,...e){const a=n.fromArgs(e);return this.lastPoint=a,this.add(`A${t} ${o} ${r} ${s?1:0} ${i?1:0} ${a.x} ${a.y}`)}cArcTo(t,o,r,...s){return this.arcTo(t,t,0,o,r,...s)}clockwiseArcTo(t,...o){const r=n.from(t),s=n.fromArgs(o),i=r.distanceTo(s),e=h(r.angleTo(l(this.lastPoint,"Assertion Error: this.lastPoint")),r.angleTo(s))>Math.PI;return this.cArcTo(i,e,!0,s)}counterClockwiseArcTo(t,...o){const r=n.from(t),s=n.fromArgs(o),i=r.distanceTo(s),e=h(r.angleTo(l(this.lastPoint,"Assertion Error: this.lastPoint")),r.angleTo(s))<Math.PI;return this.cArcTo(i,e,!1,s)}circle(t){const o=t.center.add(t.radius,0),r=t.center.add(-t.radius,0);return this.moveTo(o).clockwiseArcTo(t.center,r).clockwiseArcTo(t.center,o)}quadraticCurveTo(t,o){const r=n.from(t),s=n.from(o);return this.lastPoint=s,this.add(`Q${r.x} ${r.y} ${s.x} ${s.y}`)}smoothQuadraticCurveTo(t){const o=n.from(t);return this.lastPoint=o,this.add(`T${o.x} ${o.y}`)}bezierCurveTo(t,o,r){const s=n.from(t),i=n.from(o),e=n.from(r);return this.lastPoint=e,this.add(`C${s.x} ${s.y} ${i.x} ${i.y} ${e.x} ${e.y}`)}smoothBezierCurveTo(t,o){const r=n.from(t),s=n.from(o);return this.lastPoint=s,this.add(`S${r.x} ${r.y} ${s.x} ${s.y}`)}}export{c as S};