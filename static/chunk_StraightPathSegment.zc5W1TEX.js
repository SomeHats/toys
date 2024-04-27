import{C as a}from"./chunk_Circle.l2ddYVT-.js";import{m as n,G as i}from"./chunk_utils.ferkvykK.js";import{L as g}from"./chunk_Line2.A9Q_MvOg.js";class d{constructor(t,e,r,h){this.circle=a.create(t.x,t.y,e),this.startAngle=r,this.endAngle=h,Object.freeze(this)}getStart(){return this.circle.pointOnCircumference(this.startAngle)}getEnd(){return this.circle.pointOnCircumference(this.endAngle)}get angleDifference(){return Math.atan2(Math.sin(this.endAngle-this.startAngle),Math.cos(this.endAngle-this.startAngle))}getLength(){const t=Math.abs(this.angleDifference)/(Math.PI*2);return this.circle.circumference*t}get isAnticlockwise(){return this.angleDifference<0}getPointAtPosition(t){const e=n(0,this.getLength(),this.startAngle,this.startAngle+this.angleDifference,i(0,this.getLength(),t));return this.circle.pointOnCircumference(e)}getAngleAtPosition(t){return this.isAnticlockwise?n(0,this.getLength(),this.startAngle,this.startAngle+this.angleDifference,i(0,this.getLength(),t))-Math.PI/2:n(0,this.getLength(),this.startAngle,this.startAngle+this.angleDifference,i(0,this.getLength(),t))+Math.PI/2}appendToSvgPathBuilder(t){t.moveToIfNeeded(this.getStart()),t.arcTo(this.circle.radius,this.circle.radius,0,!1,!this.isAnticlockwise,this.getEnd())}}class f{constructor(t,e){this.line=new g(t,e),this.delta=this.line.getDelta(),Object.freeze(this)}getStart(){return this.line.start}getEnd(){return this.line.end}getDelta(){return this.delta}getLength(){return this.delta.magnitude()}angle(){return this.delta.angle()}getPointAtPosition(t){const e=i(0,this.getLength(),t);return this.delta.withMagnitude(e).add(this.line.start)}getAngleAtPosition(){return this.delta.angle()}appendToSvgPathBuilder(t){t.moveToIfNeeded(this.line.start),t.lineTo(this.line.end)}}export{d as C,f as S};