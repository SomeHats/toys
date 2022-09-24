import{l as ht,s as U,a as l,q as _,m as w,u as z,w as Z,r as W,x as tt}from"../chunks/chunk_assert.38dcf398.js";import{S as f,E as lt,a as dt}from"../chunks/chunk_Entity.28369434.js";import{C as A,L as H}from"../chunks/chunk_Circle.eda33ed8.js";import{c as R,P as et,g as ut,a as _t,b as gt,d as pt,S as m,C as mt,p as At}from"../chunks/chunk_PalRenderer.b8691aa1.js";import{C}from"../chunks/chunk_index.9d850002.js";import{V as I}from"../chunks/chunk_Vector2.bd43e687.js";import{S as ft}from"../chunks/chunk_SceneSystem.6a586ad9.js";import{Q as St}from"../chunks/chunk_QuadTree.9506da7a.js";import{A as Tt}from"../chunks/chunk_AABB.0e2ff503.js";const Rt=o=>t=>o(1-t),B=o=>o,Ct=o=>Math.sin(o/1*(Math.PI*.5)),nt=(o=1.70158)=>t=>1*t*t*((o+1)*t-o),Pt=(o=1.70158)=>t=>(t=t-1,1*(t*t*((o+1)*t+o)+1));class it extends f{constructor({x:t,y:e,startRadius:n,endRadius:i,duration:s,color:a,easeRadius:r=B,easeOpacity:c=B,removeOnComplete:d=!1}){super(),this._circle=A.create(t,e,n),this._startRadius=n,this._endRadius=i,this._duration=s,this._color=a,this._progress=0,this._easeRadius=r,this._easeOpacity=c,this._removeOnComplete=d}update(t){const e=t/this._duration;this._progress=Math.min(1,this._progress+e),this._circle=this._circle.withRadius(ht(this._startRadius,this._endRadius,this._easeRadius(this._progress))),this._progress===1&&this._removeOnComplete&&this.getScene().removeChild(this)}draw(t){t.beginPath();const e=this._easeOpacity(this._progress);t.fillStyle=this._color.fade(e).toString(),R(t,this._circle.center.x,this._circle.center.y,this._circle.radius),t.fill()}}new C("#F8FFE5");const k=new C("#06D6A0");new C("#1B9AAA");const V=new C("#EF476F"),Ot=new C("#FFC43D");var g=(o=>(o.IN="in",o.OUT="out",o))(g||{});class ${constructor(){this.incoming=[],this.outgoing=[]}add(t,e){switch(e){case g.IN:this.addIncoming(t);break;case g.OUT:this.addOutgoing(t);break;default:throw new Error(`unknow connection direction ${e}`)}}addIncoming(t){this.incoming.push(t)}addOutgoing(t){this.outgoing.push(t)}sampleIncoming(){return U(this.incoming)}sampleOutgoing(){return U(this.outgoing)}}const Et=1e3,X=20,vt=30,wt=25,It=150,Dt=500,Ft=V.lighten(.2).desaturate(.5),K=V.darken(.2),Nt=V.lighten(.2).fade(.4);class y extends f{constructor(t,e,n=Et){super(),this.isDestination=!0,this._timer=0,this._connectionSet=new $,this._circle=A.create(t,e,X),this._visualConnectionCircle=A.create(t,e,vt),this._cooldown=n}get position(){return this._circle.center}get canConsumeTraveller(){return this._timer>=this._cooldown}get incomingConnections(){return this._connectionSet.incoming}get outgoingConnections(){return this._connectionSet.outgoing}getVisualConnectionPointAtAngle(t){return this._visualConnectionCircle.pointOnCircumference(t)}getAllReachableNodes(t=new Set){return t.add(this),[this]}connectTo(t,e){this._connectionSet.add(t,e)}consumeTraveller(){l(this.canConsumeTraveller,"must be ready to consumer traveller"),this._resetTimer(),this._pulse()}update(t){this._timer=_(0,this._cooldown,this._timer+t)}draw(t){const e=this._timer/this._cooldown,n=_(0,1,w(0,It,1,0,this._timer)),i=Ft.mix(K,n);t.beginPath(),t.fillStyle=i.toString(),R(t,this._circle.center.x,this._circle.center.y,this._circle.radius),t.fill(),t.beginPath(),t.fillStyle=K.toString(),t.moveTo(this._circle.center.x,this._circle.center.y),R(t,this._circle.center.x,this._circle.center.y,this._circle.radius*e),t.fill()}_resetTimer(){this._timer=0}_pulse(){this.getScene().addChildBefore(this,new it({x:this._circle.center.x,y:this._circle.center.y,endRadius:X,startRadius:wt,duration:Dt,color:Nt,easeRadius:nt(4),easeOpacity:Rt(B),removeOnComplete:!0}))}}class D extends ft{removeTraveller(t){this._quadTree.remove(t)}afterAddToScene(t){super.afterAddToScene(t),this._quadTree=new St(Tt.fromLeftTopRightBottom(0,0,t.width,t.height),e=>e.position)}beforeUpdate(){const t=this.getScene();this._quadTree.clear(),t.children.forEach(e=>{e instanceof P&&this._quadTree.insert(e)})}findTravellersInCircle(t){return this._quadTree.findItemsInCircle(t)}}D.systemName="TravellerFinder";const v={getNextRoad(o,t){const e=new Set(o.getAllReachableNodes());e.add(o),l(e.has(t),"destination must be reachable");const n=new Map,i=new Map;for(n.set(o,0);e.size;){const{node:s,cost:a}=v._nodeWithShortestDistance(e,n);if(e.delete(s),s===t)return v._nextRoadFromRoute(i,o,t);v._updateNeighbours(s,n,a,i)}throw new Error("unreachable i hope")},_nodeWithShortestDistance(o,t){let e=1/0,n=null;return o.forEach(i=>{const s=t.get(i);s!=null&&s<=e&&(e=s,n=i)}),l(n,"node must be found"),{node:n,cost:e}},_updateNeighbours(o,t,e,n){o.outgoingConnections.forEach(i=>{const s=i.to,a=t.get(s),r=e+i.expectedTimeFromStartToEnd;(a==null||r<=a)&&(t.set(s,r),n.set(s,i))})},_nextRoadFromRoute(o,t,e){let n=e;for(;o.has(n);){const i=o.get(n);if(l(i,"road must exist"),n=i.from,n===t)return i}throw new Error("prev road must be found")}};class st{constructor(t,e){this.isDestination=!1,this._connectionSet=new $,this.position=new I(t,e)}get incomingConnections(){return this._connectionSet.incoming}get outgoingConnections(){return this._connectionSet.outgoing}get canConsumeTraveller(){return!0}consumeTraveller(t){const e=t.destination;l(e,"traveller must have destination");const n=v.getNextRoad(this,e);l(this.outgoingConnections.includes(n),"nextRoad must be from this intersection"),t.removeFromCurrentRoad(),n.addTravellerAtStart(t)}getAllReachableNodes(t=new Set){return t.add(this),z(Z(this._connectionSet.outgoing.map(e=>e.getAllReachableNodes(t))))}getVisualConnectionPointAtAngle(){return this.position}getClosestOutgoingTraveller(){let t=null,e=1/0;return this.outgoingConnections.forEach(n=>{const i=n.getTravellerAfterPosition(-1);i&&i.positionOnCurrentRoad<e&&(t=i,e=i.positionOnCurrentRoad)}),t}getClosestIncomingTraveller(){let t=null,e=1/0;return this.incomingConnections.forEach(n=>{const i=n.getTravellerBeforePosition(n.length);i&&i.distanceToEndOfCurrentRoad<e&&(t=i,e=i.distanceToEndOfCurrentRoad)}),t}connectTo(t,e){this._connectionSet.add(t,e)}}function Lt(o){const t=new lt;t.addComponent(et,o);const e=ut();return t.addComponent(_t,e).setAnimationController(new gt(e)),t.addComponent(pt,e),t}const bt=60,yt=60,xt=30,Ut=30,Bt=200,Mt=5,ot=80,kt=200,x=-200,Vt=0,$t=1500,Y=100,qt=400,j=400,Wt=Pt(3),Ht=nt(3);var rt=(o=>(o.STOPPED_FOR_DESTINATION="STOPPED_FOR_DESTINATION",o.STOPPED_FOR_TRAFFIC_IN_FRONT="STOPPED_FOR_TRAFFIC_IN_FRONT",o.STOPPED_FOR_TRAFFIC_NEARBY="STOPPED_FOR_TRAFFIC_NEARBY",o))(rt||{});class P extends f{constructor(){super(...arguments),this.comfortableRadius=W(bt,yt),this.safeRadius=W(xt,Ut),this._currentRoad=null,this._destination=null,this._positionOnCurrentRoad=0,this._speed=Mt,this._age=0,this._exitStartedAt=null,this._stoppedTime=0,this._forceAccelerateTimer=0,this._stopReason=null,this._stoppedFor=[],this._pal=null}get currentRoad(){return this._currentRoad}get position(){return l(this._currentRoad,"currentRoad must be defined"),this._currentRoad.getPointAtPosition(this._positionOnCurrentRoad)}get predictedStopPoint(){const t=this._currentRoad;l(t,"currentRoad must be defined");const e=this._getPredictedStopPositionIfDecelerating();return this._getPredictedPointForPosition(t,e)}get predictedStopArea(){const t=this.predictedStopPoint;return A.create(t.x,t.y,this.safeRadius)}get potentialNextPredictedStopPoint(){const t=this._currentRoad;l(t,"currentRoad must be defined");const e=this._getPredictedStopPositionIfDecelerating();return this._getPredictedPointForPosition(t,e+1)}get positionOnCurrentRoad(){return this._positionOnCurrentRoad}get distanceToEndOfCurrentRoad(){return l(this._currentRoad,"traveller is not on a road"),this._currentRoad.length-this._positionOnCurrentRoad}get destination(){return this._destination}get speed(){return this._speed}get isStopped(){return this.speed===0}get stoppedTime(){return this._stoppedTime}get stopReason(){return this._stopReason}isStoppedFor(t){return this._stoppedFor.includes(t)}onAddedToRoad(t){this._currentRoad=t,this._positionOnCurrentRoad=0,this._destination||this._pickDestination()}onRemovedFromRoad(){this.getScene().getSystem(D).removeTraveller(this),this._currentRoad=null}onRemovedFromScene(){this.removeFromCurrentRoad()}removeFromCurrentRoad(){this._currentRoad&&this._currentRoad.removeTraveller(this)}update(t){this._age+=t,this._stopReason=null,this._stoppedFor=[];const e=this._currentRoad;l(e,"current road must be defined"),this._move(t,e);const n=this._getPal();n.getComponent(et).setPosition(this.position,e.getAngleAtPosition(this._positionOnCurrentRoad),t/1e3),n.update(t),this._getEnterTransitionScale(),this._checkAtEndOfRoad(e),this._checkExit()}draw(t,e){const n=this._currentRoad;l(n,"current road must be defined"),this._getPal().draw(t,e)}getSortOrder(){return this.position.y}get _isExiting(){return this._exitStartedAt!==null}_getPal(){return this._pal||(this._pal=Lt(this.position)),this._pal}_getEnterTransitionScale(){return Wt(_(0,1,w(0,qt,0,1,this._age)))}_getExitTransitionScale(){return this._exitStartedAt===null?1:1-Ht(_(0,1,w(this._exitStartedAt,this._exitStartedAt+j,0,1,this._age)))}_getPredictedStopPositionIfDecelerating(){const t=-this._speed/x;return this._positionOnCurrentRoad+this._speed*t+.5*x*t*t}_getPredictedPointForPosition(t,e){if(e<=t.length)return t.getPointAtPosition(e);const n=e-t.length,i=t.getAngleAtPosition(t.length);return I.fromPolar(i,n).add(t.end)}_pickDestination(){if(!this._currentRoad)return;const t=this._currentRoad.getAllReachableNodes().filter(n=>n.isDestination),e=U(t);this._destination=e}_move(t,e){const n=t/1e3;this._forceAccelerateTimer=_(0,Y,this._forceAccelerateTimer-t),this._forceAccelerateTimer<=0&&this._shouldDecelerate(e)?this._accelerate(x,n,e):this._accelerate(kt,n,e),this._speed===0?this._stoppedTime+=t:this._stoppedTime=0}_shouldDecelerate(t){const e=this._getPredictedStopPositionIfDecelerating();if(t.to===this._destination&&t.length+Vt<e)return this._stopReason="STOPPED_FOR_DESTINATION",!0;const n=t.getTravellerAfterPosition(this._positionOnCurrentRoad),i=e+this.comfortableRadius;if(n&&n.positionOnCurrentRoad<i)return this._stopReason="STOPPED_FOR_TRAFFIC_IN_FRONT",this._stoppedFor.push(n),!0;if(t.to instanceof st){const s=t.to,a=s.getClosestOutgoingTraveller();if(a&&t.length+a.positionOnCurrentRoad<i)return this._stopReason="STOPPED_FOR_TRAFFIC_IN_FRONT",this._stoppedFor.push(a),!0;const r=s.getClosestIncomingTraveller();if(r&&r!==this&&t.length-r.distanceToEndOfCurrentRoad<i)return this._stopReason="STOPPED_FOR_TRAFFIC_IN_FRONT",this._stoppedFor.push(r),!0}return this._shouldDecelerateForNearbyTravellers(t)?(this._stopReason="STOPPED_FOR_TRAFFIC_NEARBY",!0):!1}_shouldDecelerateForNearbyTravellers(t){const e=this.getScene().getSystem(D),n=this.predictedStopArea,i=n.center,s=this.potentialNextPredictedStopPoint,a=n.withRadius(Bt),r=e.findTravellersInCircle(a);for(const c of r){if(c===this)continue;const d=c.predictedStopArea,F=d.center;if(!n.intersectsCircle(d))continue;const O=c.potentialNextPredictedStopPoint,N=i.distanceTo(d.center);if(s.distanceTo(O)>N)continue;const L=i.distanceTo(O),b=F.distanceTo(s);if(!(L<b)&&!(L-b<.15)){if(L===b)return Math.random()<.5;if(this._stoppedTime>$t&&!c.isStopped)return this._forceAcceleration(),!1;c.isStoppedFor(this)||this._stoppedFor.push(c)}}return!!this._stoppedFor.length}_forceAcceleration(){this._forceAccelerateTimer=Y}_accelerate(t,e,n){const i=this._speed;this._speed=_(0,ot,this._speed+t*e);const s=(i+this._speed)/2;this._positionOnCurrentRoad=_(0,n.length,this._positionOnCurrentRoad+s*e)}_checkAtEndOfRoad(t){if(this._positionOnCurrentRoad===t.length){if(this._isExiting)return;this._onReachEndOfCurrentRoad(t)}}_checkExit(){this._isExiting&&(l(this._exitStartedAt),this._age>=this._exitStartedAt+j&&this._onExit())}_onReachEndOfCurrentRoad(t){const e=t.to,n=this._destination;e.canConsumeTraveller&&(e.consumeTraveller(this),e===n&&this._onReachDestination())}_onReachDestination(){this._exit()}_onExit(){this.getScene().removeChild(this)}_exit(){this._exitStartedAt=this._age}}P.MAX_SPEED=ot;P.StopReason=rt;class p{constructor(...t){this.segments=[],this.addSegments(...t)}static straightThroughPoints(...t){let[e,...n]=t;const i=new p;for(const s of n)i.addSegment(new m(e,s)),e=s;return i}static segmentAcrossCircle(t,e,n){e=e+Math.PI;const i=t.pointOnCircumference(e),s=t.pointOnCircumference(n),a=new H(t.center,i).perpendicularLineThroughPoint(i),r=new H(t.center,s).perpendicularLineThroughPoint(s);if(a.isParallelTo(r))return new m(i,s);const c=a.pointAtIntersectionWith(r),d=i.distanceTo(c);return new mt(c,d,i.sub(c).angle,s.sub(c).angle)}getStart(){return this.segments[0].getStart()}getEnd(){return this.segments[this.segments.length-1].getEnd()}getLength(){return this.segments.reduce((t,e)=>t+e.getLength(),0)}getPointAtPosition(t){const e=_(0,this.getLength(),t);let n=0;for(const i of this.segments){if(e<=n+i.getLength())return i.getPointAtPosition(e-n);n+=i.getLength()}throw new Error("this is supposed to be unreachable oops")}getAngleAtPosition(t){const e=_(0,this.getLength(),t);let n=0;for(const i of this.segments){if(e<=n+i.getLength())return i.getAngleAtPosition(e-n);n+=i.getLength()}throw new Error("this is supposed to be unreachable oops")}addSegment(t){const e=this.segments[this.segments.length-1];return e&&l(e.getEnd().equals(t.getStart()),`segments must neatly join together - ${e.getEnd().toString()} !== ${t.getStart().toString()}`),this.segments.push(t),this}addSegments(...t){return t.forEach(e=>this.addSegment(e)),this}autoRound(t){const e=this.segments.map((r,c)=>{const d=c===0?null:this.segments[c-1];if(!d)return r instanceof m?null:r;if(!(r instanceof m))return r;if(!(d instanceof m))return null;l(d.getEnd().equals(r.getStart()),"segments must join");const F=d.angle,O=r.angle,N=Math.min(t,d.getLength()/2,r.getLength()/2),q=A.create(r.getStart().x,r.getStart().y,N);return p.segmentAcrossCircle(q,F,O)}),n=tt(e),i=this.getStart(),s=this.getEnd();let a=i;return this.segments=[],n.forEach(r=>{r.getStart().equals(a)?this.addSegment(r):(this.addSegment(new m(a,r.getStart())),this.addSegment(r)),a=r.getEnd()}),a.equals(s)||this.addSegment(new m(a,s)),this}}class T extends f{constructor(t,e,n){super(),this._intersectionsByAngle={},this._incomingIntersections=new Set,this._outgoingIntersections=new Set,this._roads=[],this._circle=A.create(t,e,n)}get position(){return this._circle.center}onAddedToScene(t){super.onAddedToScene(t),this._roads.forEach(e=>t.addChild(e))}getVisualConnectionPointAtAngle(t){return this._circle.pointOnCircumference(t)}connectToRoadAtAngle(t,e,n){const i=this._intersectionAtAngle(e);i.connectTo(t,n);const s=n===g.IN||this._incomingIntersections.has(i),a=n===g.OUT||this._outgoingIntersections.has(i);return s&&this._incomingIntersections.add(i),a&&this._outgoingIntersections.add(i),this._intersections.forEach(r=>{if(r!==i){if(s&&this._outgoingIntersections.has(r)){const c=new p(p.segmentAcrossCircle(this._circle,this._circle.center.sub(i.position).angle,r.position.sub(this._circle.center).angle));this._addRoad(new u(i,r,{path:c}))}if(a&&this._incomingIntersections.has(r)){const c=new p(p.segmentAcrossCircle(this._circle,this._circle.center.sub(r.position).angle,i.position.sub(this._circle.center).angle));this._addRoad(new u(r,i,{path:c}))}}}),i}_intersectionAtAngle(t){const e=t.toString();if(this._intersectionsByAngle[e])return this._intersectionsByAngle[e];const n=this._createIntersectionAtAngle(t);return this._intersectionsByAngle[e]=n,n}_createIntersectionAtAngle(t){const e=this.getVisualConnectionPointAtAngle(t);return new st(e.x,e.y)}get _intersections(){return tt(Object.keys(this._intersectionsByAngle).map(t=>this._intersectionsByAngle[t]))}_addRoad(t){this._roads.push(t),this.hasScene()&&this.getScene().addChild(t)}}const Xt=Ot.darken(.2),Kt=3,at=[5,10],S=at.reduce((o,t)=>o+t,0),Yt=.05;class u extends f{constructor(t,e,{points:n,autoRound:i,path:s}={}){super(),this.isNode=!1,this._currentTravellers=[];const a=n?t.position.angleTo(n[0]):t.position.angleTo(e.position),r=n?e.position.angleTo(n[n.length-1]):e.position.angleTo(t.position);s?this._path=s:n?this._path=p.straightThroughPoints(t.getVisualConnectionPointAtAngle(a),...n,e.getVisualConnectionPointAtAngle(r)):this._path=new p().addSegment(new m(t.getVisualConnectionPointAtAngle(a),e.getVisualConnectionPointAtAngle(r))),i!=null&&this._path.autoRound(i),t instanceof T?this.from=t.connectToRoadAtAngle(this,a,g.OUT):(this.from=t,t.connectTo(this,g.OUT)),e instanceof T?this.to=e.connectToRoadAtAngle(this,r,g.IN):(this.to=e,e.connectTo(this,g.IN))}get length(){return this._path.getLength()}get start(){return this._path.getStart()}get end(){return this._path.getEnd()}get expectedTimeFromStartToEnd(){if(this._currentTravellers.length){const t=this._currentTravellers.reduce((e,n)=>e+n.speed,0)/this._currentTravellers.length;return this.length/t}return this.length/(P.MAX_SPEED*.7)}canAddTravellerAtStart(){const t=this.getTravellerAfterPosition(0);return t?t.positionOnCurrentRoad>t.comfortableRadius:!0}addTravellerAtStart(t){this._currentTravellers.push(t),t.onAddedToRoad(this)}removeTraveller(t){const e=this._currentTravellers.indexOf(t);return e===-1?!1:(this.removeTravellerAtIndex(e),!0)}removeTravellerAtIndex(t){const e=this._currentTravellers[t];return this._currentTravellers.splice(t,1),e.onRemovedFromRoad(),e}getAllReachableNodes(t=new Set){const e=[];return t.has(this.to)?e:[...this.to.getAllReachableNodes(t),this.to]}getPointAtPosition(t){return this._path.getPointAtPosition(t)}getAngleAtPosition(t){return this._path.getAngleAtPosition(t)}getTravellerAfterPosition(t){let e=null,n=1/0;return this._currentTravellers.forEach(i=>{const s=i.positionOnCurrentRoad-t;s<=0||s<n&&(n=s,e=i)}),e}getTravellerBeforePosition(t){let e=null,n=1/0;return this._currentTravellers.forEach(i=>{const s=t-i.positionOnCurrentRoad;s<=0||s<n&&(n=s,e=i)}),e}draw(t,e){t.beginPath(),t.lineCap="round",t.lineJoin="round",At(t,this._path);const n=this._getLineDashScale(),i=S*n;t.setLineDash(at.map(s=>s*n)),t.strokeStyle=Xt.toString(),t.lineDashOffset=-e*Yt*n%i,t.lineWidth=Kt,t.stroke()}_getLineDashScale(){const e=Math.floor(this.length/S)*S,n=this.length-e,i=e+S-this.length;return n<i?this.length/e:this.length/(e+S)}}const jt=500,M=20,Jt=30,Gt=M*.7,Qt=35,zt=500,Zt=150,J=k.lighten(.1),G=k.darken(.1),te=k.lighten(.2).fade(.1);class Q extends f{constructor(t,e,n=jt){super(),this.isDestination=!1,this.canConsumeTraveller=!1,this._connectionSet=new $,this._circle=A.create(t,e,M),this._visualConnectionCircle=A.create(t,e,Jt),this._cooldown=n,this._timer=n}get position(){return this._circle.center}get incomingConnections(){return this._connectionSet.incoming}get outgoingConnections(){return this._connectionSet.outgoing}getAllReachableNodes(t=new Set){return t.add(this),z(Z(this._connectionSet.outgoing.map(e=>e.getAllReachableNodes(t))))}getVisualConnectionPointAtAngle(t){return this._visualConnectionCircle.pointOnCircumference(t)}consumeTraveller(){throw new Error("producer cannot consume traveller")}connectTo(t,e){this._connectionSet.add(t,e)}update(t){this._timer=_(0,this._cooldown,this._timer+t),this._timer>=this._cooldown&&this._onTimerEnd()}draw(t){const e=this._timer/this._cooldown,n=_(0,1,w(0,Zt,1,0,this._timer)),i=J.mix(G,n);t.beginPath(),t.fillStyle=i.toString(),R(t,this._circle.center.x,this._circle.center.y,this._circle.radius),t.fill(),t.beginPath(),t.fillStyle=G.toString(),t.moveTo(this._circle.center.x,this._circle.center.y),t.arc(this._circle.center.x,this._circle.center.y,this._circle.radius,-Math.PI/2,e*2*Math.PI-Math.PI/2,!1),t.fill(),t.beginPath(),t.fillStyle=J.toString(),R(t,this._circle.center.x,this._circle.center.y,Gt),t.fill()}_resetTimer(){this._timer=0}_onTimerEnd(){this._attemptEmitTraveller()&&(this._pulse(),this._resetTimer())}_pulse(){this.getScene().addChildBefore(this,new it({x:this._circle.center.x,y:this._circle.center.y,startRadius:M,endRadius:Qt,duration:zt,color:te,easeRadius:Ct,removeOnComplete:!0}))}_attemptEmitTraveller(){const t=this._connectionSet.sampleOutgoing();if(!(t instanceof u))return!1;if(t.canAddTravellerAtStart()){const e=new P;return t.addTravellerAtStart(e),this.getScene().addChild(e),!0}else return!1}}const E=50,h=new dt(800,600,window.devicePixelRatio),ct=document.getElementById("root");l(ct,"#root must be present");h.appendTo(ct);h.addSystem(new D);ee();h.start();function ee(){const o=new y(300,550,1500),t=new y(100,450,1500),e=new y(100,250,1500),n=new Q(600,150,500),i=new Q(100,100,500);h.addChild(o),h.addChild(t),h.addChild(e),h.addChild(n),h.addChild(i);const s=new T(300,150,E),a=new T(500,370,E),r=new T(330,400,E);h.addChild(s),h.addChild(a),h.addChild(r),h.addChild(new u(i,s)),h.addChild(new u(n,a)),h.addChild(new u(a,r)),h.addChild(new u(a,s,{points:[new I(400,300),new I(500,50)],autoRound:E})),h.addChild(new u(s,r)),h.addChild(new u(r,o)),h.addChild(new u(s,t)),h.addChild(new u(s,e))}
