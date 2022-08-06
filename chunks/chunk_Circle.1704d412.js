import{V as s}from"./chunk_Vector2.6df6a1fc.js";import{A as u}from"./chunk_AABB.2e264160.js";import{a,j as h}from"./chunk_assert.b3c9f562.js";const c=l=>l===1/0||l===-1/0;class n{static fromSlopeAndDisplacement(t,e){a(!c(t),"cannot create vertical line from displacement");const i=new s(0,e),r=new s(1,t+e);return new n(i,r)}static fromSlopeAndPoint(t,e){if(c(t))return new n(e,new s(e.x,e.y+1));const i=e.y-e.x*t;return n.fromSlopeAndDisplacement(t,i)}constructor(t,e){this.start=t,this.end=e}getDelta(){return this.end.sub(this.start)}get slope(){return(this.end.y-this.start.y)/(this.end.x-this.start.x)}get angle(){return this.start.angleTo(this.end)}get length(){return this.start.distanceTo(this.end)}get displacement(){return this.start.y-this.start.x*this.slope}get isVertical(){return c(this.slope)}get verticalX(){return a(this.isVertical,"verticalX is not defined on non vertical lines"),this.start.x}get perpendicularSlope(){return this.isVertical?0:-1/this.slope}isParallelTo(t){return this.isVertical&&t.isVertical||this.slope===t.slope}perpendicularLineThroughPoint(t){return n.fromSlopeAndPoint(this.perpendicularSlope,t)}pointAtIntersectionWith(t){a(!this.isParallelTo(t),"parallel lines do not intersect");let e;this.isVertical?e=this.verticalX:t.isVertical?e=t.verticalX:e=(this.displacement-t.displacement)/(t.slope-this.slope);const i=this.isVertical?t.slope*e+t.displacement:this.slope*e+this.displacement;return new s(e,i)}pointAtIntersectionConstrained(t){if(this.isParallelTo(t))return;const e=this.pointAtIntersectionWith(t);if(this.isPointWithinBounds(e)&&t.isPointWithinBounds(e))return e}midpoint(){return new s((this.start.x+this.end.x)/2,(this.start.y+this.end.y)/2)}isPointWithinBounds({x:t,y:e}){return h(this.start.x,this.end.x,t)&&h(this.start.y,this.end.y,e)}}class o{constructor(t,e){this.center=t,this.radius=e}static create(t,e,i){return new o(new s(t,e),i)}get circumference(){return 2*Math.PI*this.radius}getBoundingBox(){return new u(new s(this.center.x,this.center.y),new s(this.radius*2,this.radius*2))}pointOnCircumference(t){return new s(this.center.x+Math.cos(t)*this.radius,this.center.y+Math.sin(t)*this.radius)}containsPoint(t){return t.distanceTo(this.center)<this.radius}intersectsCircle(t){return this.center.distanceTo(t.center)<this.radius+t.radius}withRadius(t){return o.create(this.center.x,this.center.y,t)}outerTangentsWith(t){const e=this.center.distanceTo(t.center);if(e<=Math.abs(this.radius-t.radius))return;const i=this.center.angleTo(t.center),r=Math.acos((this.radius-t.radius)/e);return[new n(this.pointOnCircumference(i-r),t.pointOnCircumference(i-r)),new n(this.pointOnCircumference(i+r),t.pointOnCircumference(i+r))]}}export{o as C,n as L};
