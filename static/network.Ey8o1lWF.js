import{e as lt,s as L,a as l,E as Q,F as tt,r as Y,G as u,m as D,x as dt,j as ut}from"./chunk_utils.ferkvykK.js";import{E as _t,S as f,a as gt}from"./chunk_Entity.W6Xbqdkc.js";import{C as p}from"./chunk_Circle.l2ddYVT-.js";import{P as m}from"./chunk_Path.9sWWE_4X.js";import{P as et,g as pt,a as mt,b as ft,c as At,p as Rt,d as C}from"./chunk_PalWalkAnimationController.jDlE5oOi.js";import{S as Tt}from"./chunk_StraightPathSegment.zc5W1TEX.js";import{b as St,c as nt,l as U,r as Ct,o as Pt}from"./chunk_easings.6psAoSVH.js";import{V as b}from"./chunk_Vector2.Rt8uspPZ.js";import{A as T}from"./chunk_AABB.JpHgKg04.js";import{S as Ot}from"./chunk_SceneSystem.IGNvYCC1.js";import{C as I}from"./chunk_index.Cok3ROqf.js";import"./chunk_Line2.A9Q_MvOg.js";import"./chunk_svgPathBuilder.tgy0QjT8.js";import"./chunk__commonjsHelpers.5-cIlDoe.js";var _=(o=>(o.IN="in",o.OUT="out",o))(_||{});const g=class g{constructor(t,e){this._items=[],this._nextItemIndex=0,this._subdivisions=null,this.boundary=t,this._getPosition=e}insert(t){const e=this._getPosition(t);if(!this.boundary.contains(e))return!1;if(this._nextItemIndex<g.NODE_CAPACITY)return this._items[this._nextItemIndex]=t,this._nextItemIndex++,!0;const n=this._getSubdivisions();if(n[0].insert(t)||n[1].insert(t)||n[2].insert(t)||n[3].insert(t))return!0;throw new Error("Couldnt insert item")}remove(t){const e=this._getPosition(t);if(!this.boundary.contains(e))return!1;const n=this._items.indexOf(t);if(n!==-1)return this._items.splice(n,1),this._nextItemIndex--,!0;const i=this._subdivisions;return!!(i&&(i[0].remove(t)||i[1].remove(t)||i[2].remove(t)||i[3].remove(t)))}clear(){for(let t=0;t<this._nextItemIndex;t++)this._items[t]=void 0,this._nextItemIndex=0;this._subdivisions&&this._subdivisions.forEach(t=>t.clear())}findItemsInRect(t){const e=[];if(!this.boundary.intersects(t))return e;for(let i=0;i<this._nextItemIndex;i++){const s=this._items[i];if(s==null)continue;const c=this._getPosition(s);t.contains(c)&&e.push(s)}const n=this._subdivisions;return n&&(n[0].boundary.intersects(t)&&e.push(...n[0].findItemsInRect(t)),n[1].boundary.intersects(t)&&e.push(...n[1].findItemsInRect(t)),n[2].boundary.intersects(t)&&e.push(...n[2].findItemsInRect(t)),n[3].boundary.intersects(t)&&e.push(...n[3].findItemsInRect(t))),e}findItemsInCircle(t){return this.findItemsInRect(t.getBoundingBox()).filter(e=>t.containsPoint(this._getPosition(e)))}_getSubdivisions(){if(this._subdivisions)return this._subdivisions;const t=this.boundary.getCenter(),e=[new g(T.fromLeftTopRightBottom(this.boundary.left,this.boundary.top,t.x,t.y),this._getPosition),new g(T.fromLeftTopRightBottom(t.x,this.boundary.top,this.boundary.right,t.y),this._getPosition),new g(T.fromLeftTopRightBottom(this.boundary.left,t.y,t.x,this.boundary.bottom),this._getPosition),new g(T.fromLeftTopRightBottom(t.x,t.y,this.boundary.right,this.boundary.bottom),this._getPosition)];return this._subdivisions=e,e}};g.NODE_CAPACITY=4;let B=g;const H=class H extends Ot{removeTraveller(t){this._quadTree.remove(t)}afterAddToScene(t){super.afterAddToScene(t),this._quadTree=new B(T.fromLeftTopRightBottom(0,0,t.width,t.height),e=>e.position)}beforeUpdate(){const t=this.getScene();this._quadTree.clear(),t.children.forEach(e=>{e instanceof O&&this._quadTree.insert(e)})}findTravellersInCircle(t){return this._quadTree.findItemsInCircle(t)}};H.systemName="TravellerFinder";let P=H;class V{constructor(){this.incoming=[],this.outgoing=[]}add(t,e){switch(e){case _.IN:this.addIncoming(t);break;case _.OUT:this.addOutgoing(t);break;default:lt(e)}}addIncoming(t){this.incoming.push(t)}addOutgoing(t){this.outgoing.push(t)}sampleIncoming(){return L(this.incoming)}sampleOutgoing(){return L(this.outgoing)}}const v={getNextRoad(o,t){const e=new Set(o.getAllReachableNodes());e.add(o),l(e.has(t),"destination must be reachable");const n=new Map,i=new Map;for(n.set(o,0);e.size;){const{node:s,cost:c}=v._nodeWithShortestDistance(e,n);if(e.delete(s),s===t)return v._nextRoadFromRoute(i,o,t);v._updateNeighbours(s,n,c,i)}throw new Error("unreachable i hope")},_nodeWithShortestDistance(o,t){let e=1/0,n=null;return o.forEach(i=>{const s=t.get(i);s!=null&&s<=e&&(e=s,n=i)}),l(n,"node must be found"),{node:n,cost:e}},_updateNeighbours(o,t,e,n){o.outgoingConnections.forEach(i=>{const s=i.to,c=t.get(s),r=e+i.expectedTimeFromStartToEnd;(c==null||r<=c)&&(t.set(s,r),n.set(s,i))})},_nextRoadFromRoute(o,t,e){let n=e;for(;o.has(n);){const i=o.get(n);if(l(i,"road must exist"),n=i.from,n===t)return i}throw new Error("prev road must be found")}},It=v;class it{constructor(t,e){this.isDestination=!1,this._connectionSet=new V,this.canConsumeTraveller=!0,this.position=new b(t,e)}get incomingConnections(){return this._connectionSet.incoming}get outgoingConnections(){return this._connectionSet.outgoing}consumeTraveller(t){const e=t.destination;l(e,"traveller must have destination");const n=It.getNextRoad(this,e);l(this.outgoingConnections.includes(n),"nextRoad must be from this intersection"),t.removeFromCurrentRoad(),n.addTravellerAtStart(t)}getAllReachableNodes(t=new Set){return t.add(this),Q(tt(this._connectionSet.outgoing.map(e=>e.getAllReachableNodes(t))))}getVisualConnectionPointAtAngle(){return this.position}getClosestOutgoingTraveller(){let t=null,e=1/0;return this.outgoingConnections.forEach(n=>{const i=n.getTravellerAfterPosition(-1);i&&i.positionOnCurrentRoad<e&&(t=i,e=i.positionOnCurrentRoad)}),t}getClosestIncomingTraveller(){let t=null,e=1/0;return this.incomingConnections.forEach(n=>{const i=n.getTravellerBeforePosition(n.length);i&&i.distanceToEndOfCurrentRoad<e&&(t=i,e=i.distanceToEndOfCurrentRoad)}),t}connectTo(t,e){this._connectionSet.add(t,e)}}function Et(o){const t=new _t;t.addComponent(et,o);const e=pt();return t.addComponent(mt,e).setAnimationController(new ft(e)),t.addComponent(At,e),t}const vt=60,Dt=60,bt=30,wt=30,Ft=200,Nt=5,q=80,yt=200,y=-200,xt=0,Lt=1500,X=100,Ut=400,K=400,Bt=St(3),kt=nt(3);var st=(o=>(o.STOPPED_FOR_DESTINATION="STOPPED_FOR_DESTINATION",o.STOPPED_FOR_TRAFFIC_IN_FRONT="STOPPED_FOR_TRAFFIC_IN_FRONT",o.STOPPED_FOR_TRAFFIC_NEARBY="STOPPED_FOR_TRAFFIC_NEARBY",o))(st||{});const w=class w extends f{constructor(){super(...arguments),this.comfortableRadius=Y(vt,Dt),this.safeRadius=Y(bt,wt),this._currentRoad=null,this._destination=null,this._positionOnCurrentRoad=0,this._speed=Nt,this._age=0,this._exitStartedAt=null,this._stoppedTime=0,this._forceAccelerateTimer=0,this._stopReason=null,this._stoppedFor=[],this._pal=null}get currentRoad(){return this._currentRoad}get position(){return l(this._currentRoad,"currentRoad must be defined"),this._currentRoad.getPointAtPosition(this._positionOnCurrentRoad)}get predictedStopPoint(){const t=this._currentRoad;l(t,"currentRoad must be defined");const e=this._getPredictedStopPositionIfDecelerating();return this._getPredictedPointForPosition(t,e)}get predictedStopArea(){const t=this.predictedStopPoint;return p.create(t.x,t.y,this.safeRadius)}get potentialNextPredictedStopPoint(){const t=this._currentRoad;l(t,"currentRoad must be defined");const e=this._getPredictedStopPositionIfDecelerating();return this._getPredictedPointForPosition(t,e+1)}get positionOnCurrentRoad(){return this._positionOnCurrentRoad}get distanceToEndOfCurrentRoad(){return l(this._currentRoad,"traveller is not on a road"),this._currentRoad.length-this._positionOnCurrentRoad}get destination(){return this._destination}get speed(){return this._speed}get isStopped(){return this.speed===0}get stoppedTime(){return this._stoppedTime}get stopReason(){return this._stopReason}isStoppedFor(t){return this._stoppedFor.includes(t)}onAddedToRoad(t){this._currentRoad=t,this._positionOnCurrentRoad=0,this._destination||this._pickDestination()}onRemovedFromRoad(){this.getScene().getSystem(P).removeTraveller(this),this._currentRoad=null}onRemovedFromScene(){this.removeFromCurrentRoad()}removeFromCurrentRoad(){this._currentRoad&&this._currentRoad.removeTraveller(this)}update(t){this._age+=t,this._stopReason=null,this._stoppedFor=[];const e=this._currentRoad;l(e,"current road must be defined"),this._move(t,e);const n=this._getPal();n.getComponent(et).setPosition(this.position,e.getAngleAtPosition(this._positionOnCurrentRoad),t/1e3),n.update(t),this._getEnterTransitionScale(),this._checkAtEndOfRoad(e),this._checkExit()}draw(t,e){const n=this._currentRoad;l(n,"current road must be defined"),this._getPal().draw(t,e)}getSortOrder(){return this.position.y}get _isExiting(){return this._exitStartedAt!==null}_getPal(){return this._pal||(this._pal=Et(this.position)),this._pal}_getEnterTransitionScale(){return Bt(u(0,1,D(0,Ut,0,1,this._age)))}_getExitTransitionScale(){return this._exitStartedAt===null?1:1-kt(u(0,1,D(this._exitStartedAt,this._exitStartedAt+K,0,1,this._age)))}_getPredictedStopPositionIfDecelerating(){const t=-this._speed/y;return this._positionOnCurrentRoad+this._speed*t+.5*y*t*t}_getPredictedPointForPosition(t,e){if(e<=t.length)return t.getPointAtPosition(e);const n=e-t.length,i=t.getAngleAtPosition(t.length);return b.fromPolar(i,n).add(t.end)}_pickDestination(){if(!this._currentRoad)return;const t=this._currentRoad.getAllReachableNodes().filter(n=>n.isDestination),e=L(t);this._destination=e}_move(t,e){const n=t/1e3;this._forceAccelerateTimer=u(0,X,this._forceAccelerateTimer-t),this._forceAccelerateTimer<=0&&this._shouldDecelerate(e)?this._accelerate(y,n,e):this._accelerate(yt,n,e),this._speed===0?this._stoppedTime+=t:this._stoppedTime=0}_shouldDecelerate(t){const e=this._getPredictedStopPositionIfDecelerating();if(t.to===this._destination&&t.length+xt<e)return this._stopReason="STOPPED_FOR_DESTINATION",!0;const n=t.getTravellerAfterPosition(this._positionOnCurrentRoad),i=e+this.comfortableRadius;if(n&&n.positionOnCurrentRoad<i)return this._stopReason="STOPPED_FOR_TRAFFIC_IN_FRONT",this._stoppedFor.push(n),!0;if(t.to instanceof it){const s=t.to,c=s.getClosestOutgoingTraveller();if(c&&t.length+c.positionOnCurrentRoad<i)return this._stopReason="STOPPED_FOR_TRAFFIC_IN_FRONT",this._stoppedFor.push(c),!0;const r=s.getClosestIncomingTraveller();if(r&&r!==this&&t.length-r.distanceToEndOfCurrentRoad<i)return this._stopReason="STOPPED_FOR_TRAFFIC_IN_FRONT",this._stoppedFor.push(r),!0}return this._shouldDecelerateForNearbyTravellers(t)?(this._stopReason="STOPPED_FOR_TRAFFIC_NEARBY",!0):!1}_shouldDecelerateForNearbyTravellers(t){const e=this.getScene().getSystem(P),n=this.predictedStopArea,i=n.center,s=this.potentialNextPredictedStopPoint,c=n.withRadius(Ft),r=e.findTravellersInCircle(c);for(const h of r){if(h===this)continue;const A=h.predictedStopArea,at=A.center;if(!n.intersectsCircle(A))continue;const W=h.potentialNextPredictedStopPoint,ht=i.distanceTo(A.center);if(s.distanceTo(W)>ht)continue;const F=i.distanceTo(W),N=at.distanceTo(s);if(!(F<N)&&!(F-N<.15)){if(F===N)return Math.random()<.5;if(this._stoppedTime>Lt&&!h.isStopped)return this._forceAcceleration(),!1;h.isStoppedFor(this)||this._stoppedFor.push(h)}}return!!this._stoppedFor.length}_forceAcceleration(){this._forceAccelerateTimer=X}_accelerate(t,e,n){const i=this._speed;this._speed=u(0,q,this._speed+t*e);const s=(i+this._speed)/2;this._positionOnCurrentRoad=u(0,n.length,this._positionOnCurrentRoad+s*e)}_checkAtEndOfRoad(t){if(this._positionOnCurrentRoad===t.length){if(this._isExiting)return;this._onReachEndOfCurrentRoad(t)}}_checkExit(){this._isExiting&&(l(this._exitStartedAt,"Assertion Error: this._exitStartedAt"),this._age>=this._exitStartedAt+K&&this._onExit())}_onReachEndOfCurrentRoad(t){const e=t.to,n=this._destination;e.canConsumeTraveller&&(e.consumeTraveller(this),e===n&&this._onReachDestination())}_onReachDestination(){this._exit()}_onExit(){this.getScene().removeChild(this)}_exit(){this._exitStartedAt=this._age}};w.MAX_SPEED=q,w.StopReason=st;let O=w;new I("#F8FFE5");const M=new I("#06D6A0");new I("#1B9AAA");const $=new I("#EF476F"),Vt=new I("#FFC43D"),Mt=Vt.darken(.2),$t=3,ot=[5,10],R=ot.reduce((o,t)=>o+t,0),Ht=.05;class d extends f{constructor(t,e,{points:n,autoRound:i,path:s}={}){super(),this.isNode=!1,this._currentTravellers=[];const c=n?t.position.angleTo(n[0]):t.position.angleTo(e.position),r=n?e.position.angleTo(n[n.length-1]):e.position.angleTo(t.position);s?this._path=s:n?this._path=m.straightThroughPoints(t.getVisualConnectionPointAtAngle(c),...n,e.getVisualConnectionPointAtAngle(r)):this._path=new m().addSegment(new Tt(t.getVisualConnectionPointAtAngle(c),e.getVisualConnectionPointAtAngle(r))),i!=null&&this._path.autoRound(i),t instanceof S?this.from=t.connectToRoadAtAngle(this,c,_.OUT):(this.from=t,t.connectTo(this,_.OUT)),e instanceof S?this.to=e.connectToRoadAtAngle(this,r,_.IN):(this.to=e,e.connectTo(this,_.IN))}get length(){return this._path.getLength()}get start(){return this._path.getStart()}get end(){return this._path.getEnd()}get expectedTimeFromStartToEnd(){if(this._currentTravellers.length){const t=this._currentTravellers.reduce((e,n)=>e+n.speed,0)/this._currentTravellers.length;return this.length/t}return this.length/(O.MAX_SPEED*.7)}canAddTravellerAtStart(){const t=this.getTravellerAfterPosition(0);return t?t.positionOnCurrentRoad>t.comfortableRadius:!0}addTravellerAtStart(t){this._currentTravellers.push(t),t.onAddedToRoad(this)}removeTraveller(t){const e=this._currentTravellers.indexOf(t);return e===-1?!1:(this.removeTravellerAtIndex(e),!0)}removeTravellerAtIndex(t){const e=this._currentTravellers[t];return this._currentTravellers.splice(t,1),e.onRemovedFromRoad(),e}getAllReachableNodes(t=new Set){const e=[];return t.has(this.to)?e:[...this.to.getAllReachableNodes(t),this.to]}getPointAtPosition(t){return this._path.getPointAtPosition(t)}getAngleAtPosition(t){return this._path.getAngleAtPosition(t)}getTravellerAfterPosition(t){let e=null,n=1/0;return this._currentTravellers.forEach(i=>{const s=i.positionOnCurrentRoad-t;s<=0||s<n&&(n=s,e=i)}),e}getTravellerBeforePosition(t){let e=null,n=1/0;return this._currentTravellers.forEach(i=>{const s=t-i.positionOnCurrentRoad;s<=0||s<n&&(n=s,e=i)}),e}draw(t,e){t.beginPath(),t.lineCap="round",t.lineJoin="round",Rt(t,this._path);const n=this._getLineDashScale(),i=R*n;t.setLineDash(ot.map(s=>s*n)),t.strokeStyle=Mt.toString(),t.lineDashOffset=-e*Ht*n%i,t.lineWidth=$t,t.stroke()}_getLineDashScale(){const e=Math.floor(this.length/R)*R,n=this.length-e,i=e+R-this.length;return n<i?this.length/e:this.length/(e+R)}}class S extends f{constructor(t,e,n){super(),this._intersectionsByAngle={},this._incomingIntersections=new Set,this._outgoingIntersections=new Set,this._roads=[],this._circle=p.create(t,e,n)}get position(){return this._circle.center}onAddedToScene(t){super.onAddedToScene(t),this._roads.forEach(e=>t.addChild(e))}getVisualConnectionPointAtAngle(t){return this._circle.pointOnCircumference(t)}connectToRoadAtAngle(t,e,n){const i=this._intersectionAtAngle(e);i.connectTo(t,n);const s=n===_.IN||this._incomingIntersections.has(i),c=n===_.OUT||this._outgoingIntersections.has(i);return s&&this._incomingIntersections.add(i),c&&this._outgoingIntersections.add(i),this._intersections.forEach(r=>{if(r!==i){if(s&&this._outgoingIntersections.has(r)){const h=new m(m.segmentAcrossCircle(this._circle,this._circle.center.sub(i.position).angle(),r.position.sub(this._circle.center).angle()));this._addRoad(new d(i,r,{path:h}))}if(c&&this._incomingIntersections.has(r)){const h=new m(m.segmentAcrossCircle(this._circle,this._circle.center.sub(r.position).angle(),i.position.sub(this._circle.center).angle()));this._addRoad(new d(r,i,{path:h}))}}}),i}_intersectionAtAngle(t){const e=t.toString();if(this._intersectionsByAngle[e])return this._intersectionsByAngle[e];const n=this._createIntersectionAtAngle(t);return this._intersectionsByAngle[e]=n,n}_createIntersectionAtAngle(t){const e=this.getVisualConnectionPointAtAngle(t);return new it(e.x,e.y)}get _intersections(){return dt(Object.keys(this._intersectionsByAngle).map(t=>this._intersectionsByAngle[t]))}_addRoad(t){this._roads.push(t),this.hasScene()&&this.getScene().addChild(t)}}class rt extends f{constructor({x:t,y:e,startRadius:n,endRadius:i,duration:s,color:c,easeRadius:r=U,easeOpacity:h=U,removeOnComplete:A=!1}){super(),this._circle=p.create(t,e,n),this._startRadius=n,this._endRadius=i,this._duration=s,this._color=c,this._progress=0,this._easeRadius=r,this._easeOpacity=h,this._removeOnComplete=A}update(t){const e=t/this._duration;this._progress=Math.min(1,this._progress+e),this._circle=this._circle.withRadius(ut(this._startRadius,this._endRadius,this._easeRadius(this._progress))),this._progress===1&&this._removeOnComplete&&this.getScene().removeChild(this)}draw(t){t.beginPath();const e=this._easeOpacity(this._progress);t.fillStyle=this._color.fade(e).toString(),C(t,this._circle.center.x,this._circle.center.y,this._circle.radius),t.fill()}}const Wt=1e3,J=20,Yt=30,qt=25,Xt=150,Kt=500,Jt=$.lighten(.2).desaturate(.5),j=$.darken(.2),jt=$.lighten(.2).fade(.4);class x extends f{constructor(t,e,n=Wt){super(),this.isDestination=!0,this._timer=0,this._connectionSet=new V,this._circle=p.create(t,e,J),this._visualConnectionCircle=p.create(t,e,Yt),this._cooldown=n}get position(){return this._circle.center}get canConsumeTraveller(){return this._timer>=this._cooldown}get incomingConnections(){return this._connectionSet.incoming}get outgoingConnections(){return this._connectionSet.outgoing}getVisualConnectionPointAtAngle(t){return this._visualConnectionCircle.pointOnCircumference(t)}getAllReachableNodes(t=new Set){return t.add(this),[this]}connectTo(t,e){this._connectionSet.add(t,e)}consumeTraveller(){l(this.canConsumeTraveller,"must be ready to consumer traveller"),this._resetTimer(),this._pulse()}update(t){this._timer=u(0,this._cooldown,this._timer+t)}draw(t){const e=this._timer/this._cooldown,n=u(0,1,D(0,Xt,1,0,this._timer)),i=Jt.mix(j,n);t.beginPath(),t.fillStyle=i.toString(),C(t,this._circle.center.x,this._circle.center.y,this._circle.radius),t.fill(),t.beginPath(),t.fillStyle=j.toString(),t.moveTo(this._circle.center.x,this._circle.center.y),C(t,this._circle.center.x,this._circle.center.y,this._circle.radius*e),t.fill()}_resetTimer(){this._timer=0}_pulse(){this.getScene().addChildBefore(this,new rt({x:this._circle.center.x,y:this._circle.center.y,endRadius:J,startRadius:qt,duration:Kt,color:jt,easeRadius:nt(4),easeOpacity:Ct(U),removeOnComplete:!0}))}}const Gt=500,k=20,zt=30,Zt=k*.7,Qt=35,te=500,ee=150,G=M.lighten(.1),z=M.darken(.1),ne=M.lighten(.2).fade(.1);class Z extends f{constructor(t,e,n=Gt){super(),this.isDestination=!1,this.canConsumeTraveller=!1,this._connectionSet=new V,this._circle=p.create(t,e,k),this._visualConnectionCircle=p.create(t,e,zt),this._cooldown=n,this._timer=n}get position(){return this._circle.center}get incomingConnections(){return this._connectionSet.incoming}get outgoingConnections(){return this._connectionSet.outgoing}getAllReachableNodes(t=new Set){return t.add(this),Q(tt(this._connectionSet.outgoing.map(e=>e.getAllReachableNodes(t))))}getVisualConnectionPointAtAngle(t){return this._visualConnectionCircle.pointOnCircumference(t)}consumeTraveller(){throw new Error("producer cannot consume traveller")}connectTo(t,e){this._connectionSet.add(t,e)}update(t){this._timer=u(0,this._cooldown,this._timer+t),this._timer>=this._cooldown&&this._onTimerEnd()}draw(t){const e=this._timer/this._cooldown,n=u(0,1,D(0,ee,1,0,this._timer)),i=G.mix(z,n);t.beginPath(),t.fillStyle=i.toString(),C(t,this._circle.center.x,this._circle.center.y,this._circle.radius),t.fill(),t.beginPath(),t.fillStyle=z.toString(),t.moveTo(this._circle.center.x,this._circle.center.y),t.arc(this._circle.center.x,this._circle.center.y,this._circle.radius,-Math.PI/2,e*2*Math.PI-Math.PI/2,!1),t.fill(),t.beginPath(),t.fillStyle=G.toString(),C(t,this._circle.center.x,this._circle.center.y,Zt),t.fill()}_resetTimer(){this._timer=0}_onTimerEnd(){this._attemptEmitTraveller()&&(this._pulse(),this._resetTimer())}_pulse(){this.getScene().addChildBefore(this,new rt({x:this._circle.center.x,y:this._circle.center.y,startRadius:k,endRadius:Qt,duration:te,color:ne,easeRadius:Pt,removeOnComplete:!0}))}_attemptEmitTraveller(){const t=this._connectionSet.sampleOutgoing();if(!(t instanceof d))return!1;if(t.canAddTravellerAtStart()){const e=new O;return t.addTravellerAtStart(e),this.getScene().addChild(e),!0}else return!1}}const E=50,a=new gt(800,600,window.devicePixelRatio),ct=document.getElementById("root");l(ct,"#root must be present");a.appendTo(ct);a.addSystem(new P);ie();a.start();function ie(){const o=new x(300,550,1500),t=new x(100,450,1500),e=new x(100,250,1500),n=new Z(600,150,500),i=new Z(100,100,500);a.addChild(o),a.addChild(t),a.addChild(e),a.addChild(n),a.addChild(i);const s=new S(300,150,E),c=new S(500,370,E),r=new S(330,400,E);a.addChild(s),a.addChild(c),a.addChild(r),a.addChild(new d(i,s)),a.addChild(new d(n,c)),a.addChild(new d(c,r)),a.addChild(new d(c,s,{points:[new b(400,300),new b(500,50)],autoRound:E})),a.addChild(new d(s,r)),a.addChild(new d(r,o)),a.addChild(new d(s,t)),a.addChild(new d(s,e))}