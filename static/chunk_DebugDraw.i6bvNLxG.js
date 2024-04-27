import{V as a}from"./chunk_Vector2.Rt8uspPZ.js";const s=class s{constructor(t){this.ctx=t}reset(t){t=a.from(t),this.ctx.resetTransform(),this.clear(),this.ctx.scale(this.ctx.canvas.width/t.x,this.ctx.canvas.height/t.y)}clear(t){if(!t){this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);return}this.applyFillOptions({fill:t}),this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height)}beginPath(){this.ctx.beginPath()}moveTo({x:t,y:i}){this.ctx.moveTo(t,i)}lineTo({x:t,y:i}){this.ctx.lineTo(t,i)}arc({x:t,y:i},e,h,l,o){this.ctx.arc(t,i,e,h,l,o)}arcTo(t,i,e){this.ctx.arcTo(t.x,t.y,i.x,i.y,e)}quadraticCurveTo(t,i){this.ctx.quadraticCurveTo(t.x,t.y,i.x,i.y)}bezierCurveTo(t,i,e){this.ctx.bezierCurveTo(t.x,t.y,i.x,i.y,e.x,e.y)}applyStrokeOptions({strokeWidth:t=1,stroke:i=void 0,strokeCap:e="butt",strokeDash:h=[],strokeDashOffset:l=0,strokeJoin:o="round"}){i&&(this.ctx.lineWidth=t,this.ctx.strokeStyle=i,this.ctx.lineCap=e,this.ctx.setLineDash(h),this.ctx.lineDashOffset=l,this.ctx.lineJoin=o)}stroke(t){t.stroke&&(this.applyStrokeOptions(t),this.ctx.stroke())}applyFillOptions({fill:t=void 0}){t&&(this.ctx.fillStyle=t)}fill(t){t.fill&&(this.applyFillOptions(t),this.ctx.fill())}applyStrokeAndFillOptions(t){this.applyFillOptions(t),this.applyStrokeOptions(t)}strokeAndFill(t){this.fill(t),this.stroke(t)}getDebugStrokeOptions(t=s.DEFAULT_DEBUG_COLOR){return{stroke:t,strokeWidth:s.HAIRLINE}}debugStroke(t=s.DEFAULT_DEBUG_COLOR){this.stroke(this.getDebugStrokeOptions(t))}fillText(t,i,e={}){this.applyFillOptions(e),this.ctx.fillText(t,i.x,i.y)}circle(t,i,e){this.beginPath(),this.arc(t,i,0,2*Math.PI),this.strokeAndFill(e)}ellipse(t,i,e,h){this.beginPath(),this.ctx.ellipse(t.x,t.y,i,e,0,0,Math.PI*2),this.strokeAndFill(h)}debugLabel(t,i,e){t&&(this.applyFillOptions({fill:e}),this.fillText(t,i.add(s.LABEL_OFFSET)))}debugPointX(t,{color:i=s.DEFAULT_DEBUG_COLOR,label:e=void 0}={}){this.debugLabel(e,t,i),this.beginPath(),this.ctx.moveTo(t.x-s.DEBUG_POINT_SIZE,t.y-s.DEBUG_POINT_SIZE),this.ctx.lineTo(t.x+s.DEBUG_POINT_SIZE,t.y+s.DEBUG_POINT_SIZE),this.ctx.moveTo(t.x+s.DEBUG_POINT_SIZE,t.y-s.DEBUG_POINT_SIZE),this.ctx.lineTo(t.x-s.DEBUG_POINT_SIZE,t.y+s.DEBUG_POINT_SIZE),this.stroke({strokeWidth:s.HAIRLINE,stroke:i})}debugPointO(t,{color:i=s.DEFAULT_DEBUG_COLOR,label:e=void 0}={}){this.debugLabel(e,t,i),this.circle(t,s.DEBUG_POINT_SIZE,{strokeWidth:s.HAIRLINE,stroke:i})}debugArrow(t,i,{color:e=s.DEFAULT_DEBUG_COLOR,label:h=void 0}={}){this.debugLabel(h,a.average([t,i]),e),this.ctx.beginPath(),this.moveTo(t),this.lineTo(i);const l=i.sub(t),o=l.rotate(-s.DEBUG_ARROW_ANGLE).withMagnitude(s.DEBUG_ARROW_SIZE).add(i),c=l.rotate(+s.DEBUG_ARROW_ANGLE).withMagnitude(s.DEBUG_ARROW_SIZE).add(i);this.moveTo(o),this.lineTo(i),this.lineTo(c),this.stroke({strokeWidth:s.HAIRLINE,stroke:e})}debugVectorAtPoint(t,i,e){this.debugArrow(i,i.add(t),e)}polygon(t,i={}){this.beginPath(),this.moveTo(t[t.length-1]);for(const e of t)this.lineTo(e);this.strokeAndFill(i)}polyLine(t,i={}){this.beginPath(),this.moveTo(t[0]);for(let e=1;e<t.length;e++)this.lineTo(t[e]);this.stroke(i)}debugPolygon(t,{color:i=s.DEFAULT_DEBUG_COLOR,label:e=void 0}={}){this.debugLabel(e,t[0],i),this.polygon(t,this.getDebugStrokeOptions(i))}debugPolyLine(t,{color:i=s.DEFAULT_DEBUG_COLOR,label:e=void 0}={}){this.debugLabel(e,t[0],i),this.polyLine(t,this.getDebugStrokeOptions(i))}debugQuadraticCurve(t,i,e,{color:h=s.DEFAULT_DEBUG_COLOR,label:l=void 0}={}){this.debugLabel(l,t,h),this.beginPath(),this.moveTo(t),this.quadraticCurveTo(i,e),this.stroke(this.getDebugStrokeOptions(h))}debugBezierCurve(t,i,e,h,{color:l=s.DEFAULT_DEBUG_COLOR,label:o=void 0}={}){this.debugLabel(o,t,l),this.beginPath(),this.moveTo(t),this.bezierCurveTo(i,e,h),this.stroke(this.getDebugStrokeOptions(l))}debugLine2(t,{color:i=s.DEFAULT_DEBUG_COLOR,label:e=void 0}={}){this.debugLabel(e,t.start,i),this.debugArrow(t.start,t.end,{color:i,label:e})}aabb(t,i){i.debug&&this.debugLabel(i.debug.label,t.origin,i.debug.color??s.DEFAULT_DEBUG_COLOR),this.ctx.beginPath(),this.ctx.rect(t.left,t.top,t.width,t.height),this.strokeAndFill(i)}};s.DEFAULT_DEBUG_COLOR="magenta",s.LABEL_OFFSET=new a(5,0),s.DEBUG_POINT_SIZE=3,s.HAIRLINE=.5,s.DEBUG_ARROW_ANGLE=Math.PI*.75,s.DEBUG_ARROW_SIZE=5;let r=s;export{r as D};