!function(){function t(t,e,i,n){Object.defineProperty(t,e,{get:i,set:n,enumerable:!0,configurable:!0})}function e(t){return t&&t.__esModule?t.default:t}var i="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n={},r={},a=i.parcelRequire0561;null==a&&((a=function(t){if(t in n)return n[t].exports;if(t in r){var e=r[t];delete r[t];var i={id:t,exports:{}};return n[t]=i,e.call(i.exports,i,i.exports),i.exports}var a=new Error("Cannot find module '"+t+"'");throw a.code="MODULE_NOT_FOUND",a}).register=function(t,e){r[t]=e},i.parcelRequire0561=a),a.register("1js6q",(function(e,i){t(e.exports,"PalControlData",(function(){return l})),t(e.exports,"PalTargetController",(function(){return u})),t(e.exports,"PalAbsoluteController",(function(){return c}));var n=a("8TSCy"),r=a("3Nswo"),s=a("8qLe2"),o=a("39Hjj"),l=function(t){"use strict";function e(t,i){var r;return n.classCallCheck(this,e),(r=n.possibleConstructorReturn(this,n.getPrototypeOf(e).call(this,t))).speed=0,r.heading=0,r.headingVelocity=0,r.position=i,r}return n.inherits(e,t),n.createClass(e,[{key:"getVelocity",value:function(){return this.getHeadingVec().scale(this.speed)}},{key:"getHeadingVec",value:function(){return o.default.fromPolar(this.heading,1)}}]),e}(r.default),u=function(t){"use strict";function e(t,i){var r;return n.classCallCheck(this,e),(r=n.possibleConstructorReturn(this,n.getPrototypeOf(e).call(this,t))).target=i,r.data=t.addComponent(l,i),r}return n.inherits(e,t),n.createClass(e,[{key:"setTarget",value:function(t){this.target=t}},{key:"update",value:function(t){var e=t/1e3,i=this.data.position.angleTo(this.target),n=this.target.distanceTo(this.data.position);if(n>15?this.accelerate(200,e):this.accelerate(-200,e),n>10){var r=s.normalizeAngle(i-this.data.heading),a=this.data.heading;this.data.heading+=r/10,this.data.headingVelocity=s.normalizeAngle(this.data.heading-a)/e}else this.data.headingVelocity=0}},{key:"accelerate",value:function(t,e){var i=this.data.speed;this.data.speed=s.constrain(0,80,this.data.speed+t*e);var n=(i+this.data.speed)/2;this.data.position=this.data.position.add(o.default.fromPolar(this.data.heading,n*e))}}]),e}(r.default),c=function(t){"use strict";function e(t,i){var r;return n.classCallCheck(this,e),(r=n.possibleConstructorReturn(this,n.getPrototypeOf(e).call(this,t))).data=t.addComponent(l,i),r}return n.inherits(e,t),n.createClass(e,[{key:"setPosition",value:function(t,e,i){var n=this.data.position,r=this.data.heading;this.data.heading=e,this.data.headingVelocity=s.normalizeAngle(this.data.heading-r)/i,this.data.speed=n.distanceTo(t)/i,this.data.position=t}}]),e}(r.default)})),a.register("7oj37",(function(e,i){t(e.exports,"default",(function(){return g}));var n=a("8TSCy"),r=a("3Nswo"),s=a("eJCSX"),o=a("1js6q"),l=a("8qLe2"),u=a("i3155"),c=a("8OvEy"),h=Math.PI/2,g=function(t){"use strict";function e(t,i){var r;return n.classCallCheck(this,e),(r=n.possibleConstructorReturn(this,n.getPrototypeOf(e).call(this,t))).config=i,r.animationController=null,r.bobAmount=0,r.controlData=t.getComponent(o.PalControlData),r.legs=l.shuffle(l.flatten(l.times(i.legPairs,(function(t){var e=(t+1)/(i.legPairs+1);return[new u.default(r.controlData,n.assertThisInitialized(r),i,l.lerp(h-1,h+1,e)),new u.default(r.controlData,n.assertThisInitialized(r),i,l.lerp(1-h,-h-1,e))]})))),r}return n.inherits(e,t),n.createClass(e,[{key:"setAnimationController",value:function(t){this.animationController=t}},{key:"update",value:function(t){if(this.animationController){var e=this.animationController.update(t,this.controlData,this.legs);this.bobAmount=e.bobAmount,c.assert(e.legs.length===this.legs.length),this.legs.forEach((function(t,i){return t.update(e.legs[i])}))}}},{key:"getBod",value:function(){var t=this.config.bodBob*this.bobAmount;return new s.default(this.controlData.position.x,this.controlData.position.y-this.config.bodHeight-t,this.config.radius)}}]),e}(r.default)})),a.register("eJCSX",(function(e,i){t(e.exports,"default",(function(){return o}));var n=a("8TSCy"),r=a("39Hjj"),s=a("71uov"),o=function(){"use strict";function t(e,i,a){n.classCallCheck(this,t),this.center=new r.default(e,i),this.radius=a,Object.freeze(this)}return n.createClass(t,[{key:"circumference",get:function(){return 2*Math.PI*this.radius}},{key:"getBoundingBox",value:function(){return new s.default(new r.default(this.center.x,this.center.y),new r.default(2*this.radius,2*this.radius))}},{key:"pointOnCircumference",value:function(t){return new r.default(this.center.x+Math.cos(t)*this.radius,this.center.y+Math.sin(t)*this.radius)}},{key:"containsPoint",value:function(t){return t.distanceTo(this.center)<this.radius}},{key:"intersectsCircle",value:function(t){return this.center.distanceTo(t.center)<this.radius+t.radius}},{key:"withRadius",value:function(e){return new t(this.center.x,this.center.y,e)}}]),t}()})),a.register("i3155",(function(e,i){t(e.exports,"default",(function(){return l}));var n=a("8TSCy"),r=a("39Hjj"),s=a("8qLe2"),o=function(t){var e=t.radius,i=t.hipHeight,n=t.legWidth;return Math.sqrt(e*e-(e-i)*(e-i))-n},l=function(){"use strict";function t(e,i,r,a){n.classCallCheck(this,t),this.palData=e,this.palGeom=i,this.config=r,this.angleOffset=a,this.liftAmount=0,this.hipRadius=o(r),this.kneeRadius=o(r)*r.kneeScale,this.floorRadius=o(r),this.footXY=this.getIdealFootRestingXY(),this.footOrigin=this.getIdealFootRestingXY()}return n.createClass(t,[{key:"update",value:function(t){this.footXY=t.footXY,this.footOrigin=t.footProjectionOrigin,this.liftAmount=t.liftAmount}},{key:"getIdealFootRestingXY",value:function(){return r.default.fromPolar(this.palData.heading+this.angleOffset,this.floorRadius).add(this.palData.position)}},{key:"getFootXY",value:function(){return this.footXY}},{key:"getFootZ",value:function(){return s.lerp(0,this.getHipZ()*this.config.legMaxLift,this.liftAmount)}},{key:"getFootOrigin",value:function(){return this.footOrigin}},{key:"getKneeXY",value:function(){return this.palData.position.add(r.default.fromPolar(this.palData.heading+this.angleOffset,this.kneeRadius)).add(r.default.fromPolar(this.palData.heading,this.liftAmount*this.config.kneeMaxOut))}},{key:"getKneeZ",value:function(){return(this.getFootZ()+this.getHipZ())/2}},{key:"getKneeOrigin",value:function(){return this.getHipOrigin().lerp(this.getFootOrigin(),.5)}},{key:"getHipXY",value:function(){return this.palData.position.add(r.default.fromPolar(this.palData.heading+this.angleOffset,this.hipRadius))}},{key:"getHipZ",value:function(){var t=this.palGeom.getBod();return this.palData.position.y-t.center.y-(t.radius-this.config.hipHeight)}},{key:"getHipOrigin",value:function(){return this.palData.position}}]),t}()})),a.register("hdQD0",(function(e,i){t(e.exports,"default",(function(){return g}));var n=a("8TSCy"),r=a("3Nswo"),s=a("1js6q"),o=a("7oj37"),l=a("6IKqx"),u=a("8qLe2"),c=a("39Hjj"),h=Math.PI/2,g=function(t){"use strict";function e(t,i){var r;return n.classCallCheck(this,e),(r=n.possibleConstructorReturn(this,n.getPrototypeOf(e).call(this,t))).config=i,r.data=t.getComponent(s.PalControlData),r.geom=t.getComponent(o.default),r}return n.inherits(e,t),n.createClass(e,[{key:"draw",value:function(t){var e=this,i=this,n=u.normalizeAngle(this.data.heading);t.setLineDash([]),t.beginPath();var r=this.geom.getBod();t.ellipse(this.data.position.x,this.data.position.y,.8*r.radius,.24*r.radius,0,0,2*Math.PI),t.fillStyle="rgba(0, 0, 0, 0.2)",t.fill(),this.geom.legs.filter((function(t){return u.normalizeAngle(t.angleOffset+n)<0})).forEach((function(i){return e.drawLeg(t,i)})),this.geom.legs.filter((function(t){return u.normalizeAngle(t.angleOffset+n)>=0})).forEach((function(e){return i.drawLeg(t,e)})),this.drawBod(t,r)}},{key:"drawLeg",value:function(t,e){t.beginPath();var i=this.data.heading+e.angleOffset,n=u.constrain(0,1,Math.abs(u.normalizeAngle(-h-i)/h)),r=this.config.color.darken(.2*(1-n*n)),a=this.projectZ(e.getHipXY(),e.getHipZ(),e.getHipOrigin()),s=this.projectZ(e.getKneeXY(),e.getKneeZ(),e.getKneeOrigin()),o=this.projectZ(e.getFootXY(),e.getFootZ(),e.getFootOrigin());t.moveTo(a.x,a.y),t.quadraticCurveTo(s.x,s.y,o.x,o.y),t.lineCap="round",t.strokeStyle=r.toString(),t.lineWidth=this.config.legWidth,t.stroke()}},{key:"drawBod",value:function(t,e){t.save(),t.beginPath(),l.circle(t,e.center.x,e.center.y,this.config.radius),t.fillStyle=this.config.color.toString(),t.fill(),t.clip();var i=u.normalizeAngle(h-this.data.heading)/h*this.config.radius;t.beginPath(),l.circle(t,i+e.center.x+this.config.eyeX,e.center.y-this.config.eyeY,this.config.eyeRadius),l.circle(t,i+e.center.x-this.config.eyeX,e.center.y-this.config.eyeY,this.config.eyeRadius),t.fillStyle=this.config.color.darken(.5).toString(),t.fill(),t.beginPath(),t.moveTo(i+e.center.x-this.config.mouthWidth,e.center.y-this.config.mouthY),t.quadraticCurveTo(i+e.center.x,e.center.y-this.config.mouthY+this.config.mouthSmile,i+e.center.x+this.config.mouthWidth,e.center.y-this.config.mouthY),t.lineWidth=this.config.mouthThickness,t.strokeStyle=this.config.color.darken(.5).toString(),t.stroke(),t.beginPath(),this.makeButtLine(t,e,i+2*this.config.radius),this.makeButtLine(t,e,i-2*this.config.radius),t.lineWidth=this.config.buttThickness,t.strokeStyle=this.config.color.darken(.3).toString(),t.stroke(),t.restore()}},{key:"makeButtLine",value:function(t,e,i){t.moveTo(1.6*i+e.center.x,e.center.y+this.config.buttTop),t.quadraticCurveTo(1.7*i+e.center.x,e.center.y+.65*(this.config.buttTop+this.config.buttBottom),i+e.center.x,e.center.y+this.config.buttBottom)}},{key:"projectZ",value:function(t,e,i){return new c.default(t.x,i.y-e+.3*(t.y-i.y))}}]),e}(r.default)})),a.register("6IKqx",(function(e,i){t(e.exports,"circle",(function(){return s})),t(e.exports,"path",(function(){return o}));var n=a("6SQqk"),r=a("7Tktm");function s(t,e,i,n){t.arc(e,i,n,0,2*Math.PI,!1)}function o(t,e){e.segments.length&&t.moveTo(e.segments[0].getStart().x,e.segments[0].getStart().y);var i=!0,a=!1,s=void 0;try{for(var o,l=e.segments[Symbol.iterator]();!(i=(o=l.next()).done);i=!0){var u=o.value;if(u instanceof n.default)t.lineTo(u.getEnd().x,u.getEnd().y);else{if(!(u instanceof r.default))throw new Error("Unknown path segment type: ".concat(u.toString()));t.arc(u.circle.center.x,u.circle.center.y,u.circle.radius,u.startAngle,u.endAngle,u.isAnticlockwise)}}}catch(t){a=!0,s=t}finally{try{i||null==l.return||l.return()}finally{if(a)throw s}}}})),a.register("6SQqk",(function(e,i){t(e.exports,"default",(function(){return o}));var n=a("8TSCy"),r=a("8qLe2"),s=a("eYUEV"),o=function(){"use strict";function t(e,i){n.classCallCheck(this,t),this.line=new s.default(e,i),this.delta=this.line.getDelta(),Object.freeze(this)}return n.createClass(t,[{key:"getStart",value:function(){return this.line.start}},{key:"getEnd",value:function(){return this.line.end}},{key:"getDelta",value:function(){return this.delta}},{key:"getLength",value:function(){return this.delta.magnitude}},{key:"angle",get:function(){return this.delta.angle}},{key:"getPointAtPosition",value:function(t){var e=r.constrain(0,this.getLength(),t);return this.delta.withMagnitude(e).add(this.line.start)}},{key:"getAngleAtPosition",value:function(){return this.delta.angle}}]),t}()})),a.register("eYUEV",(function(e,i){t(e.exports,"default",(function(){return l}));var n=a("8TSCy"),r=a("8OvEy"),s=a("39Hjj"),o=function(t){return t===1/0||t===-1/0},l=function(){"use strict";function t(e,i){n.classCallCheck(this,t),this.start=e,this.end=i}return n.createClass(t,[{key:"getDelta",value:function(){return this.end.sub(this.start)}},{key:"slope",get:function(){return(this.end.y-this.start.y)/(this.end.x-this.start.x)}},{key:"displacement",get:function(){return this.start.y-this.start.x*this.slope}},{key:"isVertical",get:function(){return o(this.slope)}},{key:"verticalX",get:function(){return r.assert(this.isVertical,"verticalX is not defined on non vertical lines"),this.start.x}},{key:"perpendicularSlope",get:function(){return this.isVertical?0:-1/this.slope}},{key:"isParallelTo",value:function(t){return this.isVertical&&t.isVertical||this.slope===t.slope}},{key:"perpendicularLineThroughPoint",value:function(e){return t.fromSlopeAndPoint(this.perpendicularSlope,e)}},{key:"pointAtIntersectionWith",value:function(t){var e;r.assert(!this.isParallelTo(t),"parallel lines do not intersect"),e=this.isVertical?this.verticalX:t.isVertical?t.verticalX:(this.displacement-t.displacement)/(t.slope-this.slope);var i=this.isVertical?t.slope*e+t.displacement:this.slope*e+this.displacement;return new s.default(e,i)}}],[{key:"fromSlopeAndDisplacement",value:function(e,i){return r.assert(!o(e),"cannot create vertical line from displacement"),new t(new s.default(0,i),new s.default(1,e+i))}},{key:"fromSlopeAndPoint",value:function(e,i){if(o(e))return new t(i,new s.default(i.x,i.y+1));var n=i.y-i.x*e;return t.fromSlopeAndDisplacement(e,n)}}]),t}()})),a.register("7Tktm",(function(e,i){t(e.exports,"default",(function(){return o}));var n=a("8TSCy"),r=a("8qLe2"),s=a("eJCSX"),o=function(){"use strict";function t(e,i,r,a){n.classCallCheck(this,t),this.circle=new s.default(e.x,e.y,i),this.startAngle=r,this.endAngle=a,Object.freeze(this)}return n.createClass(t,[{key:"getStart",value:function(){return this.circle.pointOnCircumference(this.startAngle)}},{key:"getEnd",value:function(){return this.circle.pointOnCircumference(this.endAngle)}},{key:"angleDifference",get:function(){return Math.atan2(Math.sin(this.endAngle-this.startAngle),Math.cos(this.endAngle-this.startAngle))}},{key:"getLength",value:function(){var t=Math.abs(this.angleDifference)/(2*Math.PI);return this.circle.circumference*t}},{key:"isAnticlockwise",get:function(){return this.angleDifference<0}},{key:"getPointAtPosition",value:function(t){var e=r.mapRange(0,this.getLength(),this.startAngle,this.startAngle+this.angleDifference,r.constrain(0,this.getLength(),t));return this.circle.pointOnCircumference(e)}},{key:"getAngleAtPosition",value:function(t){return this.isAnticlockwise?r.mapRange(0,this.getLength(),this.startAngle,this.startAngle+this.angleDifference,r.constrain(0,this.getLength(),t))-Math.PI/2:r.mapRange(0,this.getLength(),this.startAngle,this.startAngle+this.angleDifference,r.constrain(0,this.getLength(),t))+Math.PI/2}}]),t}()})),a.register("leuCG",(function(e,i){t(e.exports,"default",(function(){return u}));var n=a("8TSCy"),r=a("39Hjj"),s=a("8qLe2"),o=a("8OvEy");function l(t){return t.stepProgress>0}var u=function(){"use strict";function t(e){n.classCallCheck(this,t),this.config=e,this.legStates=new Map}return n.createClass(t,[{key:"update",value:function(t,e,i){var n=this,r=t/1e3,a=!0,s=!1,o=void 0;try{for(var l,u=i[Symbol.iterator]();!(a=(l=u.next()).done);a=!0){var c=l.value;this.updateLegState(r,e,i,c)}}catch(t){s=!0,o=t}finally{try{a||null==u.return||u.return()}finally{if(s)throw o}}var h=i.map((function(t){return n.getLegUpdate(e,t)}));return{bobAmount:h.reduce((function(t,e){return t+e.liftAmount}),0)/i.length,legs:h}}},{key:"canLiftLeg",value:function(t,e,i){var n=this,r=this;o.assert(e.includes(i),"whos leg even is this");var a=e.filter((function(e){return e!==i&&!l(n.getLegState(t,i))})).length>Math.floor(Math.log(e.length)),s=e.some((function(i){var n=r.getLegState(t,i);return n.stepProgress>0&&n.stepProgress<1/(e.length/2)}));return a&&!s}},{key:"updateLegState",value:function(t,e,i,n){var r=this.getLegState(e,n);if(r.restTimer=s.constrain(0,this.config.stepRestDuration,r.restTimer-t),!(r.restTimer>0))if(l(r))r.stepProgress=s.constrain(0,1,r.stepProgress+t/this.config.stepDuration),1===r.stepProgress&&(r.lastFootOnFloorXY=this.getFootXY(e,n,r),r.lastFootOnFloorPalPosition=e.position,r.stepProgress=0,r.restTimer=this.config.stepDuration);else{var a=n.getFootXY().distanceTo(n.getIdealFootRestingXY());a>this.config.stepThreshold&&this.canLiftLeg(e,i,n)&&(r.currentStepMaxLift=s.constrain(0,1,s.mapRange(this.config.stepThreshold,this.config.fullStepDistance,.1,1,a)),r.stepProgress=s.constrain(0,1,r.stepProgress+t/this.config.stepDuration))}}},{key:"getInitialLegState",value:function(t,e){return{lastFootOnFloorXY:e.getIdealFootRestingXY(),lastFootOnFloorPalPosition:t.position,stepProgress:0,restTimer:0,currentStepMaxLift:1}}},{key:"getLegState",value:function(t,e){var i=this.legStates.get(e);if(i)return i;var n=this.getInitialLegState(t,e);return this.legStates.set(e,n),n}},{key:"getLegUpdate",value:function(t,e){var i=this.getLegState(t,e);return{footXY:this.getFootXY(t,e,i),footProjectionOrigin:this.getFootOrigin(t,e,i),liftAmount:this.getLegLiftAmount(i)}}},{key:"getFootXY",value:function(t,e,i){if(l(i)){var n=i.lastFootOnFloorXY,r=this.getPredictedIdealFootXYAtEndOfOfStep(t,e,i);return n.lerp(r,i.stepProgress)}return i.lastFootOnFloorXY}},{key:"getFootOrigin",value:function(t,e,i){return l(i)?i.lastFootOnFloorPalPosition.lerp(t.position,i.stepProgress):i.lastFootOnFloorPalPosition}},{key:"getPredictedIdealFootXYAtEndOfOfStep",value:function(t,e,i){var n=(1.4-i.stepProgress)*this.config.stepDuration,a=t.getVelocity().scale(n).add(t.position),s=t.heading+t.headingVelocity*n;return r.default.fromPolar(s+e.angleOffset,e.floorRadius).add(a)}},{key:"getLegLiftAmount",value:function(t){var e=t.stepProgress,i=t.currentStepMaxLift;return Math.sin(e*Math.PI)*i}}]),t}()})),a.register("cvm1i",(function(e,i){t(e.exports,"generateRandomPalConfig",(function(){return s}));var n=a("8qLe2"),r=a("5MVTg"),s=(r.BLUE.lighten(.2),function(){var t=n.varyRelative(14,.2),e=n.varyRelative(.7*t,.3),i=n.varyRelative(2*t,.3),a=i-(t-e);return{radius:t,bodHeight:i,bodBob:n.varyRelative(t,.2),eyeY:n.varyRelative(.5*t,.2),eyeX:n.varyRelative(.4*t,.3),eyeRadius:n.varyRelative(.15*t,.4),mouthThickness:n.varyRelative(.15*t,.4),mouthY:n.varyAbsolute(0,.2*t),mouthWidth:n.varyRelative(.5*t,.3),mouthSmile:n.varyRelative(.3*t,.3),buttTop:n.varyRelative(.4*t,.2),buttBottom:n.varyRelative(.85*t,.15),buttThickness:n.varyRelative(.1*t,.5),color:r.BLUE.lighten(n.random(-.2,.2)).saturate(n.random(-.2,.2)).rotate(n.random(-10,10)),hipHeight:e,kneeScale:n.varyAbsolute(1.3,.3),legMaxLift:n.random(.2,.5),kneeMaxOut:n.varyRelative(.6*a,.4),stepDuration:n.varyRelative(.01*a,.4),stepRestDuration:n.varyRelative(.0083*a,.4),stepThreshold:n.varyRelative(.01*a,.4),fullStepDistance:n.varyRelative(.7*a,.4),legWidth:n.varyRelative(.3*t,.4),legPairs:n.randomInt(1,4)}})})),a.register("5MVTg",(function(i,n){t(i.exports,"BLUE",(function(){return s}));var r=a("9AT65"),s=(new(e(r))("#F8FFE5"),new(e(r))("#06D6A0"),new(e(r))("#1B9AAA"));new(e(r))("#EF476F"),new(e(r))("#FFC43D")}))}();
//# sourceMappingURL=index.aadda269.js.map
