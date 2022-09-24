import{a as oh,r as An,t as Vr,j as lh,y as fo,O as ch,m as ki,G as hh,b as Zl,s as po,T as uh,C as dh,U as fh}from"../chunks/chunk_assert.132f6b36.js";import{V as xt}from"../chunks/chunk_Vector2.98bc2363.js";import{A as Kr}from"../chunks/chunk_AABB.beaf8cac.js";import{a as mo,n as ph,g as mh,c as gh,b as go}from"../chunks/chunk_color.0fee8ab4.js";import{D as vh}from"../chunks/chunk_DebugDraw.ccead2ae.js";const vo=function s(e){var t=mh(e);function n(i,r){var a=t((i=mo(i)).r,(r=mo(r)).r),o=t(i.g,r.g),l=t(i.b,r.b),c=ph(i.opacity,r.opacity);return function(h){return i.r=a(h),i.g=o(h),i.b=l(h),i.opacity=c(h),i+""}}return n.gamma=s,n}(1);function xh(s,e){e||(e=[]);var t=s?Math.min(e.length,s.length):0,n=e.slice(),i;return function(r){for(i=0;i<t;++i)n[i]=s[i]*(1-r)+e[i]*r;return n}}function _h(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function yh(s,e){var t=e?e.length:0,n=s?Math.min(t,s.length):0,i=new Array(n),r=new Array(t),a;for(a=0;a<n;++a)i[a]=Ra(s[a],e[a]);for(;a<t;++a)r[a]=e[a];return function(o){for(a=0;a<n;++a)r[a]=i[a](o);return r}}function bh(s,e){var t=new Date;return s=+s,e=+e,function(n){return t.setTime(s*(1-n)+e*n),t}}function fa(s,e){return s=+s,e=+e,function(t){return s*(1-t)+e*t}}function Mh(s,e){var t={},n={},i;(s===null||typeof s!="object")&&(s={}),(e===null||typeof e!="object")&&(e={});for(i in e)i in s?t[i]=Ra(s[i],e[i]):n[i]=e[i];return function(r){for(i in t)n[i]=t[i](r);return n}}var pa=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,_s=new RegExp(pa.source,"g");function wh(s){return function(){return s}}function Sh(s){return function(e){return s(e)+""}}function Th(s,e){var t=pa.lastIndex=_s.lastIndex=0,n,i,r,a=-1,o=[],l=[];for(s=s+"",e=e+"";(n=pa.exec(s))&&(i=_s.exec(e));)(r=i.index)>t&&(r=e.slice(t,r),o[a]?o[a]+=r:o[++a]=r),(n=n[0])===(i=i[0])?o[a]?o[a]+=i:o[++a]=i:(o[++a]=null,l.push({i:a,x:fa(n,i)})),t=_s.lastIndex;return t<e.length&&(r=e.slice(t),o[a]?o[a]+=r:o[++a]=r),o.length<2?l[0]?Sh(l[0].x):wh(e):(e=l.length,function(c){for(var h=0,u;h<e;++h)o[(u=l[h]).i]=u.x(c);return o.join("")})}function Ra(s,e){var t=typeof e,n;return e==null||t==="boolean"?gh(e):(t==="number"?fa:t==="string"?(n=go(e))?(e=n,vo):Th:e instanceof go?vo:e instanceof Date?bh:_h(e)?xh:Array.isArray(e)?yh:typeof e.valueOf!="function"&&typeof e.toString!="function"||isNaN(e)?Mh:fa)(s,e)}class ma{constructor(e=[]){this.items=[],this.items=e.slice()}add(e){this.items.push(e)}get size(){return this.items.length}pop(){oh(this.size,"RandomQueue must not be empty");const e=Math.floor(An(this.items.length)),t=this.items[e];return this.items.splice(e,1),t}}class Eh{constructor(e){this.size=e.floor(),this.rows=Vr(this.size.y,()=>Vr(this.size.y,()=>{}))}areCoordsInBounds(e){return 0<=e.x&&e.x<this.size.x&&0<=e.y&&e.y<this.size.y}vectorToGridCoords(e,t){return e.div(t).floor()}get({x:e,y:t}){return this.rows[t][e]}set({x:e,y:t},n){this.rows[t][e]=n}squareAroundCell(e,t){const n=[],i=e.sub(new xt(t,t).div(2)).round();for(let r=0;r<t;r++)for(let a=0;a<t;a++){const o=new xt(r,a).add(i);this.areCoordsInBounds(o)&&n.push(o)}return n}}function Ah(s,e,t){const n=new Kr(xt.ZERO,s.size),i=e/Math.SQRT2,r=new Eh(s.size.div(i).ceil()),a=new ma,o=[],l=new xt(An(s.size.x),An(s.size.y));for(a.add(l),o.push(l.add(s.origin));a.size;){const c=a.pop();for(let h=0;h<t;h++){const u=Lh(c,e);n.contains(u)&&!Ch(r,u,e,i)&&(a.add(u),o.push(u.add(s.origin)),r.set(r.vectorToGridCoords(u,i),u))}}return o}function Lh(s,e){const t=An(e,2*e),n=An(Math.PI*2);return xt.fromPolar(n,t).add(s)}function Ch(s,e,t,n){const i=s.vectorToGridCoords(e,n),r=s.squareAroundCell(i,5);for(const a of r){const o=s.get(a);if(o&&o.distanceTo(e)<t)return!0}return!1}const Qt=11102230246251565e-32,st=134217729,Rh=(3+8*Qt)*Qt;function ys(s,e,t,n,i){let r,a,o,l,c=e[0],h=n[0],u=0,d=0;h>c==h>-c?(r=c,c=e[++u]):(r=h,h=n[++d]);let f=0;if(u<s&&d<t)for(h>c==h>-c?(a=c+r,o=r-(a-c),c=e[++u]):(a=h+r,o=r-(a-h),h=n[++d]),r=a,o!==0&&(i[f++]=o);u<s&&d<t;)h>c==h>-c?(a=r+c,l=a-r,o=r-(a-l)+(c-l),c=e[++u]):(a=r+h,l=a-r,o=r-(a-l)+(h-l),h=n[++d]),r=a,o!==0&&(i[f++]=o);for(;u<s;)a=r+c,l=a-r,o=r-(a-l)+(c-l),c=e[++u],r=a,o!==0&&(i[f++]=o);for(;d<t;)a=r+h,l=a-r,o=r-(a-l)+(h-l),h=n[++d],r=a,o!==0&&(i[f++]=o);return(r!==0||f===0)&&(i[f++]=r),f}function Ph(s,e){let t=e[0];for(let n=1;n<s;n++)t+=e[n];return t}function Ji(s){return new Float64Array(s)}const Ih=(3+16*Qt)*Qt,Dh=(2+12*Qt)*Qt,Fh=(9+64*Qt)*Qt*Qt,Rn=Ji(4),xo=Ji(8),_o=Ji(12),yo=Ji(16),ct=Ji(4);function Nh(s,e,t,n,i,r,a){let o,l,c,h,u,d,f,m,v,x,p,g,w,M,T,L,_,F;const W=s-i,C=t-i,A=e-r,V=n-r;M=W*V,d=st*W,f=d-(d-W),m=W-f,d=st*V,v=d-(d-V),x=V-v,T=m*x-(M-f*v-m*v-f*x),L=A*C,d=st*A,f=d-(d-A),m=A-f,d=st*C,v=d-(d-C),x=C-v,_=m*x-(L-f*v-m*v-f*x),p=T-_,u=T-p,Rn[0]=T-(p+u)+(u-_),g=M+p,u=g-M,w=M-(g-u)+(p-u),p=w-L,u=w-p,Rn[1]=w-(p+u)+(u-L),F=g+p,u=F-g,Rn[2]=g-(F-u)+(p-u),Rn[3]=F;let P=Ph(4,Rn),N=Dh*a;if(P>=N||-P>=N||(u=s-W,o=s-(W+u)+(u-i),u=t-C,c=t-(C+u)+(u-i),u=e-A,l=e-(A+u)+(u-r),u=n-V,h=n-(V+u)+(u-r),o===0&&l===0&&c===0&&h===0)||(N=Fh*a+Rh*Math.abs(P),P+=W*h+V*o-(A*c+C*l),P>=N||-P>=N))return P;M=o*V,d=st*o,f=d-(d-o),m=o-f,d=st*V,v=d-(d-V),x=V-v,T=m*x-(M-f*v-m*v-f*x),L=l*C,d=st*l,f=d-(d-l),m=l-f,d=st*C,v=d-(d-C),x=C-v,_=m*x-(L-f*v-m*v-f*x),p=T-_,u=T-p,ct[0]=T-(p+u)+(u-_),g=M+p,u=g-M,w=M-(g-u)+(p-u),p=w-L,u=w-p,ct[1]=w-(p+u)+(u-L),F=g+p,u=F-g,ct[2]=g-(F-u)+(p-u),ct[3]=F;const O=ys(4,Rn,4,ct,xo);M=W*h,d=st*W,f=d-(d-W),m=W-f,d=st*h,v=d-(d-h),x=h-v,T=m*x-(M-f*v-m*v-f*x),L=A*c,d=st*A,f=d-(d-A),m=A-f,d=st*c,v=d-(d-c),x=c-v,_=m*x-(L-f*v-m*v-f*x),p=T-_,u=T-p,ct[0]=T-(p+u)+(u-_),g=M+p,u=g-M,w=M-(g-u)+(p-u),p=w-L,u=w-p,ct[1]=w-(p+u)+(u-L),F=g+p,u=F-g,ct[2]=g-(F-u)+(p-u),ct[3]=F;const B=ys(O,xo,4,ct,_o);M=o*h,d=st*o,f=d-(d-o),m=o-f,d=st*h,v=d-(d-h),x=h-v,T=m*x-(M-f*v-m*v-f*x),L=l*c,d=st*l,f=d-(d-l),m=l-f,d=st*c,v=d-(d-c),x=c-v,_=m*x-(L-f*v-m*v-f*x),p=T-_,u=T-p,ct[0]=T-(p+u)+(u-_),g=M+p,u=g-M,w=M-(g-u)+(p-u),p=w-L,u=w-p,ct[1]=w-(p+u)+(u-L),F=g+p,u=F-g,ct[2]=g-(F-u)+(p-u),ct[3]=F;const I=ys(B,_o,4,ct,yo);return yo[I-1]}function ir(s,e,t,n,i,r){const a=(e-r)*(t-i),o=(s-i)*(n-r),l=a-o;if(a===0||o===0||a>0!=o>0)return l;const c=Math.abs(a+o);return Math.abs(l)>=Ih*c?l:-Nh(s,e,t,n,i,r,c)}const bo=Math.pow(2,-52),rr=new Uint32Array(512);class Pa{static from(e,t=Hh,n=Gh){const i=e.length,r=new Float64Array(i*2);for(let a=0;a<i;a++){const o=e[a];r[2*a]=t(o),r[2*a+1]=n(o)}return new Pa(r)}constructor(e){const t=e.length>>1;if(t>0&&typeof e[0]!="number")throw new Error("Expected coords to contain numbers.");this.coords=e;const n=Math.max(2*t-5,0);this._triangles=new Uint32Array(n*3),this._halfedges=new Int32Array(n*3),this._hashSize=Math.ceil(Math.sqrt(t)),this._hullPrev=new Uint32Array(t),this._hullNext=new Uint32Array(t),this._hullTri=new Uint32Array(t),this._hullHash=new Int32Array(this._hashSize).fill(-1),this._ids=new Uint32Array(t),this._dists=new Float64Array(t),this.update()}update(){const{coords:e,_hullPrev:t,_hullNext:n,_hullTri:i,_hullHash:r}=this,a=e.length>>1;let o=1/0,l=1/0,c=-1/0,h=-1/0;for(let C=0;C<a;C++){const A=e[2*C],V=e[2*C+1];A<o&&(o=A),V<l&&(l=V),A>c&&(c=A),V>h&&(h=V),this._ids[C]=C}const u=(o+c)/2,d=(l+h)/2;let f=1/0,m,v,x;for(let C=0;C<a;C++){const A=bs(u,d,e[2*C],e[2*C+1]);A<f&&(m=C,f=A)}const p=e[2*m],g=e[2*m+1];f=1/0;for(let C=0;C<a;C++){if(C===m)continue;const A=bs(p,g,e[2*C],e[2*C+1]);A<f&&A>0&&(v=C,f=A)}let w=e[2*v],M=e[2*v+1],T=1/0;for(let C=0;C<a;C++){if(C===m||C===v)continue;const A=Uh(p,g,w,M,e[2*C],e[2*C+1]);A<T&&(x=C,T=A)}let L=e[2*x],_=e[2*x+1];if(T===1/0){for(let V=0;V<a;V++)this._dists[V]=e[2*V]-e[0]||e[2*V+1]-e[1];$n(this._ids,this._dists,0,a-1);const C=new Uint32Array(a);let A=0;for(let V=0,P=-1/0;V<a;V++){const N=this._ids[V];this._dists[N]>P&&(C[A++]=N,P=this._dists[N])}this.hull=C.subarray(0,A),this.triangles=new Uint32Array(0),this.halfedges=new Uint32Array(0);return}if(ir(p,g,w,M,L,_)<0){const C=v,A=w,V=M;v=x,w=L,M=_,x=C,L=A,_=V}const F=Oh(p,g,w,M,L,_);this._cx=F.x,this._cy=F.y;for(let C=0;C<a;C++)this._dists[C]=bs(e[2*C],e[2*C+1],F.x,F.y);$n(this._ids,this._dists,0,a-1),this._hullStart=m;let W=3;n[m]=t[x]=v,n[v]=t[m]=x,n[x]=t[v]=m,i[m]=0,i[v]=1,i[x]=2,r.fill(-1),r[this._hashKey(p,g)]=m,r[this._hashKey(w,M)]=v,r[this._hashKey(L,_)]=x,this.trianglesLen=0,this._addTriangle(m,v,x,-1,-1,-1);for(let C=0,A,V;C<this._ids.length;C++){const P=this._ids[C],N=e[2*P],O=e[2*P+1];if(C>0&&Math.abs(N-A)<=bo&&Math.abs(O-V)<=bo||(A=N,V=O,P===m||P===v||P===x))continue;let B=0;for(let K=0,de=this._hashKey(N,O);K<this._hashSize&&(B=r[(de+K)%this._hashSize],!(B!==-1&&B!==n[B]));K++);B=t[B];let I=B,q;for(;q=n[I],ir(N,O,e[2*I],e[2*I+1],e[2*q],e[2*q+1])>=0;)if(I=q,I===B){I=-1;break}if(I===-1)continue;let $=this._addTriangle(I,P,n[I],-1,-1,i[I]);i[P]=this._legalize($+2),i[I]=$,W++;let ie=n[I];for(;q=n[ie],ir(N,O,e[2*ie],e[2*ie+1],e[2*q],e[2*q+1])<0;)$=this._addTriangle(ie,P,q,i[P],-1,i[ie]),i[P]=this._legalize($+2),n[ie]=ie,W--,ie=q;if(I===B)for(;q=t[I],ir(N,O,e[2*q],e[2*q+1],e[2*I],e[2*I+1])<0;)$=this._addTriangle(q,P,I,-1,i[I],i[q]),this._legalize($+2),i[q]=$,n[I]=I,W--,I=q;this._hullStart=t[P]=I,n[I]=t[ie]=P,n[P]=ie,r[this._hashKey(N,O)]=P,r[this._hashKey(e[2*I],e[2*I+1])]=I}this.hull=new Uint32Array(W);for(let C=0,A=this._hullStart;C<W;C++)this.hull[C]=A,A=n[A];this.triangles=this._triangles.subarray(0,this.trianglesLen),this.halfedges=this._halfedges.subarray(0,this.trianglesLen)}_hashKey(e,t){return Math.floor(Bh(e-this._cx,t-this._cy)*this._hashSize)%this._hashSize}_legalize(e){const{_triangles:t,_halfedges:n,coords:i}=this;let r=0,a=0;for(;;){const o=n[e],l=e-e%3;if(a=l+(e+2)%3,o===-1){if(r===0)break;e=rr[--r];continue}const c=o-o%3,h=l+(e+1)%3,u=c+(o+2)%3,d=t[a],f=t[e],m=t[h],v=t[u];if(zh(i[2*d],i[2*d+1],i[2*f],i[2*f+1],i[2*m],i[2*m+1],i[2*v],i[2*v+1])){t[e]=v,t[o]=d;const p=n[u];if(p===-1){let w=this._hullStart;do{if(this._hullTri[w]===u){this._hullTri[w]=e;break}w=this._hullPrev[w]}while(w!==this._hullStart)}this._link(e,p),this._link(o,n[a]),this._link(a,u);const g=c+(o+1)%3;r<rr.length&&(rr[r++]=g)}else{if(r===0)break;e=rr[--r]}}return a}_link(e,t){this._halfedges[e]=t,t!==-1&&(this._halfedges[t]=e)}_addTriangle(e,t,n,i,r,a){const o=this.trianglesLen;return this._triangles[o]=e,this._triangles[o+1]=t,this._triangles[o+2]=n,this._link(o,i),this._link(o+1,r),this._link(o+2,a),this.trianglesLen+=3,o}}function Bh(s,e){const t=s/(Math.abs(s)+Math.abs(e));return(e>0?3-t:1+t)/4}function bs(s,e,t,n){const i=s-t,r=e-n;return i*i+r*r}function zh(s,e,t,n,i,r,a,o){const l=s-a,c=e-o,h=t-a,u=n-o,d=i-a,f=r-o,m=l*l+c*c,v=h*h+u*u,x=d*d+f*f;return l*(u*x-v*f)-c*(h*x-v*d)+m*(h*f-u*d)<0}function Uh(s,e,t,n,i,r){const a=t-s,o=n-e,l=i-s,c=r-e,h=a*a+o*o,u=l*l+c*c,d=.5/(a*c-o*l),f=(c*h-o*u)*d,m=(a*u-l*h)*d;return f*f+m*m}function Oh(s,e,t,n,i,r){const a=t-s,o=n-e,l=i-s,c=r-e,h=a*a+o*o,u=l*l+c*c,d=.5/(a*c-o*l),f=s+(c*h-o*u)*d,m=e+(a*u-l*h)*d;return{x:f,y:m}}function $n(s,e,t,n){if(n-t<=20)for(let i=t+1;i<=n;i++){const r=s[i],a=e[r];let o=i-1;for(;o>=t&&e[s[o]]>a;)s[o+1]=s[o--];s[o+1]=r}else{const i=t+n>>1;let r=t+1,a=n;bi(s,i,r),e[s[t]]>e[s[n]]&&bi(s,t,n),e[s[r]]>e[s[n]]&&bi(s,r,n),e[s[t]]>e[s[r]]&&bi(s,t,r);const o=s[r],l=e[o];for(;;){do r++;while(e[s[r]]<l);do a--;while(e[s[a]]>l);if(a<r)break;bi(s,r,a)}s[t+1]=s[a],s[a]=o,n-r+1>=a-t?($n(s,e,r,n),$n(s,e,t,a-1)):($n(s,e,t,a-1),$n(s,e,r,n))}}function bi(s,e,t){const n=s[e];s[e]=s[t],s[t]=n}function Hh(s){return s[0]}function Gh(s){return s[1]}function Wr(s){return s%3===2?s-2:s+1}function kh({triangles:s},e){const t=[];for(let n=0;n<s.length;n+=3){const i=e[s[n]],r=e[s[n+1]],a=e[s[n+2]],o=(i.x+r.x+a.x)/3,l=(i.y+r.y+a.y)/3;t.push(new xt(o,l))}return t}function Vh({triangles:s,halfedges:e},t){const n=[],i=new Set;for(let r=0;r<s.length;r++){const a=s[Wr(r)];if(!i.has(a)){i.add(a),n[a]=[];let o=r;do{n[a].push({neighbourCellId:s[o],leadingPoint:t[Math.floor(o/3)]});const l=Wr(o);o=e[l]}while(o!==-1&&o!==r)}}return n}class Wh{constructor(e){this.points=e,console.time("delauney.delaunator"),this.delaunator=Pa.from(e,t=>t.x,t=>t.y),console.timeEnd("delauney.delaunator"),console.time("delauney.getTriangleCenters"),this.triangleCenters=kh(this.delaunator,e),console.timeEnd("delauney.getTriangleCenters"),console.time("delauney.getCellsByPointId"),this.cellsByPointId=Vh(this.delaunator,this.triangleCenters),console.timeEnd("delauney.getCellsByPointId")}forEachTriangleEdge(e){for(let t=0;t<this.delaunator.triangles.length;t++)if(t>this.delaunator.halfedges[t]){const n=this.delaunator.triangles[t],i=this.delaunator.triangles[Wr(t)];e(n,i)}}forEachPolygonEdge(e){for(let t=0;t<this.delaunator.triangles.length;t++){const n=this.delaunator.halfedges[t];if(t>n&&n!==-1){const i=this.triangleCenters[Math.floor(t/3)],r=this.triangleCenters[Math.floor(n/3)];e(i,r)}}}isPointIdInHull(e){let t=e;do{const n=Wr(t);if(t=this.delaunator.halfedges[n],t===-1)return!0}while(t!==e);return!1}}const mt=Math.max(window.innerWidth,window.innerHeight),mn=5,qh=1600,Xh=-.9,Yh=.45,Mo=.3,Zh=1/mn*.1,jh=mn*10,Jh=mn*20,Qh=1/mn*.9,$h=.5,Kh=1,eu=.005,tu=1/mn*.1,nu=1;function iu(s){return e=>{if(e<=0)return s[0].color;if(e>=1)return s[s.length-1].color;const t=s.findIndex(({stop:r})=>r>=e),n=s[t-1],i=s[t];return Ra(n.color,i.color)(lh(n.stop,i.stop,e))}}const ru=iu([{color:"#1A237E",stop:0},{color:"#1976D2",stop:.2},{color:"#90CAF9",stop:.4},{color:"#FFF59D",stop:.42},{color:"#81C784",stop:.5},{color:"#388E3C",stop:.6},{color:"#9CCC65",stop:.7},{color:"#C5E1A5",stop:.75},{color:"#9E9E9E",stop:.85},{color:"#78909C",stop:.9},{color:"#ECEFF1",stop:1}]);class su{constructor(e,t,n,i,r){this.id=e,this.terrain=n,this.getTectonicHeightNoise=r,this.heightAdjustment=0,this.totalDriftPressure=0,this.polygon=t.map(a=>a.leadingPoint),this.position=xt.average(this.polygon),this.neighbourCellIdsByEdgeIndex=t.map(a=>a.neighbourCellId).map(a=>n.isActiveByCellId[a]?a:null),this.neighbourCellIds=fo(this.neighbourCellIdsByEdgeIndex),this.edgeIndexByNeighbourCellId=ch(fo(this.neighbourCellIdsByEdgeIndex.map((a,o)=>a!==null?[a,o]:null))),this.noiseHeight=i(this.position.x,this.position.y)}*iterateEdgesStartingFromIndex(e){for(let t=0;t<this.polygon.length;t++)yield(e+t)%this.polygon.length}getPlate(){return this.terrain.platesById[this.terrain.plateIdByCellId[this.id]]}getHeightFromDriftPressure(){return this.totalDriftPressure**(1/2)*.8*this.getTectonicHeightNoise(this.position.x,this.position.y)}getHeight(e=!0){return this.getPlate().baseHeight+this.noiseHeight+this.heightAdjustment+(e?this.getHeightFromDriftPressure():0)}getSeaLevel(){return ki(0,1,-1,1,.4)}get3dHeight(e=!0){return Math.max(this.getSeaLevel(),this.getHeight(e))}getColor(e=!0){return ru(ki(-1,1,0,1,this.getHeight(e)))}findConnectedCellsInRadius(e){const t=[this],n=new Set([this]);let i;for(;i=t.pop();)for(const r of i.neighbourCellIds){const a=this.terrain.cellsById[r];!n.has(a)&&a.position.distanceTo(this.position)<=e&&(t.push(a),n.add(a))}return Array.from(n)}adjustHeight(e){this.heightAdjustment+=e}getPressureForNeighbour(e,t){const n=e.position.sub(this.position),i=Math.cos(hh(-Math.PI/2,Math.PI/2,n.angleBetween(t)*1));return i<=0?null:t.scale(i)}applyPressureForDrift(e){const t=e.magnitude;if(this.totalDriftPressure+=e.magnitude,t<eu)return;const n=[];for(const i of this.neighbourCellIds){const r=this.terrain.cellsById[i],a=this.getPressureForNeighbour(r,e);a&&n.push([r,a])}for(const[i,r]of n)i.applyPressureForDrift(r.scale(1/Math.sqrt(n.length)))}propagateTectonicDrift(){const e=this.getPlate().drift,t=[];for(const n of this.neighbourCellIds){const i=this.terrain.cellsById[n],r=i.getPlate().drift,a=e.sub(r);if(a.equals(xt.ZERO))continue;const o=this.getPressureForNeighbour(i,a);o&&t.push([i,o])}for(const[n,i]of t)n.applyPressureForDrift(i.scale(1/t.length))}}const ui=document.createElement("canvas"),Ia=Zl(ui.getContext("2d")),jl=mt,Jl=mt,qr=window.devicePixelRatio;ui.width=jl*qr;ui.height=Jl*qr;ui.style.width=`${jl}px`;ui.style.height=`${Jl}px`;Ia.scale(qr,qr);const Kn=new vh(Ia);document.body.appendChild(ui);function au(s,e,t,n){const i=m=>m===null||n[m]!==s,r=t.find(m=>e.cellsById[m].neighbourCellIdsByEdgeIndex.some(i));if(r==null)throw new Error("startingEdgeCellId must exist");const a=new Set,o=new Set,l=e.cellsById[r],c=l.neighbourCellIdsByEdgeIndex.findIndex(i);if(c===-1)throw new Error("startingEdgeCellStartingEdgeIndex must exist");let h=l,u=c,d=null,f=0;for(;f<5e4;){f++,a.add(h.id);const m=h;for(const v of h.iterateEdgesStartingFromIndex(u)){const x=h.neighbourCellIdsByEdgeIndex[v];if(i(x)){if(d=h.polygon[v],o.has(d))return{polygon:Array.from(o),edgeCellIds:a};o.add(d)}else{if(x===null)throw new Error("neighbourCellId must exist");if(d===null)throw new Error("lastPolygonPoint must exist");const p=e.cellsById[x],g=p.polygon.findIndex(w=>Zl(d).equals(w));if(g===-1)throw new Error("currentEdgeIndexInCell must exist");h=p,u=g+1;break}}if(m===h)throw new Error("currentCell must change during edge iteration")}throw new Error("loop never completed")}class ou{constructor(e,t,n,i,r){this.id=e,this.terrain=t,this.baseHeight=n,this.drift=xt.fromPolar(An(-Math.PI,Math.PI),An($h,Kh)),this.cellIds=new Set(i),console.time("plate.findPlateEdges");const a=au(e,t,i,r);this.edgeCellIds=a.edgeCellIds,this.polygon=a.polygon,console.timeEnd("plate.findPlateEdges")}getCell(e){if(!this.cellIds.has(e))throw new Error(`Cell not in plate: ${e}`);return this.terrain.cellsById[e]}calculateDriftHeightOffsets(){for(const e of this.edgeCellIds){const t=this.getCell(e),n=t.neighbourCellIds.filter(a=>this.terrain.plateIdByCellId[a]!==this.id).map(a=>this.terrain.platesById[this.terrain.plateIdByCellId[a]].drift);if(!n.length)continue;const r=xt.average(n).dot(this.drift);Kn.debugPointX(t.position,{label:String(r.toFixed(1))})}}}var Ql={},es={},Qi={};Object.defineProperty(Qi,"__esModule",{value:!0});function lu(s){var e=new Uint32Array(1);return e[0]=s[0]*1664525+1013904223,e}Qi.default=lu;Object.defineProperty(es,"__esModule",{value:!0});es.makeNoise2D=void 0;var sr=Qi,cu=1/47,ga=(Math.sqrt(2+1)-1)/2,hu=(1/Math.sqrt(2+1)-1)/2;function wo(s,e,t){return{dx:-e-s*ga,dy:-t-s*ga,xsb:e,ysb:t}}function uu(s){for(var e=[],t=0;t<Mi.length;t+=4){for(var n=du[Mi[t]],i=null,r=null,a=0;a<n.length;a+=3)r=wo(n[a],n[a+1],n[a+2]),i===null?e[t/4]=r:i.next=r,i=r;r.next=wo(Mi[t+1],Mi[t+2],Mi[t+3])}for(var o=[],t=0;t<Ms.length;t+=2)o[Ms[t]]=e[Ms[t+1]];for(var l=new Uint8Array(256),c=new Uint8Array(256),h=new Uint8Array(256),t=0;t<256;t++)h[t]=t;var u=new Uint32Array(1);u[0]=s,u=sr.default(sr.default(sr.default(u)));for(var t=255;t>=0;t--){u=sr.default(u);var d=new Uint32Array(1);d[0]=(u[0]+31)%(t+1),d[0]<0&&(d[0]+=t+1),l[t]=h[d[0]],c[t]=l[t]&14,h[d[0]]=h[t]}return function(f,m){for(var v=(f+m)*hu,x=f+v,p=m+v,g=Math.floor(x),w=Math.floor(p),M=(g+w)*ga,T=f-(g+M),L=m-(w+M),_=x-g,F=p-w,W=_+F,C=_-F+1|W<<1|W+F<<2|W+_<<4,A=0,V=o[C];V!==void 0;V=V.next){var P=T+V.dx,N=L+V.dy,O=2-P*P-N*N;if(O>0){var B=g+V.xsb,I=w+V.ysb,q=l[B&255],$=c[q+I&255],ie=So[$]*P+So[$+1]*N;A+=O*O*O*O*ie}}return A*cu}}es.makeNoise2D=uu;var du=[[1,1,0,1,0,1,0,0,0],[1,1,0,1,0,1,2,1,1]],So=[5,2,2,5,-5,2,-2,5,5,-2,2,-5,-5,-2,-2,-5],Ms=[0,1,1,0,4,1,17,0,20,2,21,2,22,5,23,5,26,4,39,3,42,4,43,3],Mi=[0,0,1,-1,0,0,-1,1,0,2,1,1,1,2,2,0,1,2,0,2,1,0,0,0],ts={};Object.defineProperty(ts,"__esModule",{value:!0});ts.makeNoise3D=void 0;var ar=Qi,fu=1/103,Gr=(Math.sqrt(3+1)-1)/3,pu=(1/Math.sqrt(3+1)-1)/3;function ws(s,e,t,n){return{dx:-e-s*Gr,dy:-t-s*Gr,dz:-n-s*Gr,xsb:e,ysb:t,zsb:n}}function mu(s){for(var e=[],t=0;t<Nt.length;t+=9){for(var n=gu[Nt[t]],i=null,r=null,a=0;a<n.length;a+=4)r=ws(n[a],n[a+1],n[a+2],n[a+3]),i===null?e[t/9]=r:i.next=r,i=r;r.next=ws(Nt[t+1],Nt[t+2],Nt[t+3],Nt[t+4]),r.next.next=ws(Nt[t+5],Nt[t+6],Nt[t+7],Nt[t+8])}for(var o=[],t=0;t<Ts.length;t+=2)o[Ts[t]]=e[Ts[t+1]];for(var l=new Uint8Array(256),c=new Uint8Array(256),h=new Uint8Array(256),t=0;t<256;t++)h[t]=t;var u=new Uint32Array(1);u[0]=s,u=ar.default(ar.default(ar.default(u)));for(var t=255;t>=0;t--){u=ar.default(u);var d=new Uint32Array(1);d[0]=(u[0]+31)%(t+1),d[0]<0&&(d[0]+=t+1),l[t]=h[d[0]],c[t]=l[t]%24*3,h[d[0]]=h[t]}return function(f,m,v){for(var x=(f+m+v)*pu,p=f+x,g=m+x,w=v+x,M=Math.floor(p),T=Math.floor(g),L=Math.floor(w),_=(M+T+L)*Gr,F=f-(M+_),W=m-(T+_),C=v-(L+_),A=p-M,V=g-T,P=w-L,N=A+V+P,O=V-P+1|A-V+1<<1|A-P+1<<2|N<<3|N+P<<5|N+V<<7|N+A<<9,B=0,I=o[O];I!==void 0;I=I.next){var q=F+I.dx,$=W+I.dy,ie=C+I.dz,K=2-q*q-$*$-ie*ie;if(K>0){var de=M+I.xsb,X=T+I.ysb,Q=L+I.zsb,oe=l[de&255],U=l[oe+X&255],ue=c[U+Q&255],_e=Ss[ue]*q+Ss[ue+1]*$+Ss[ue+2]*ie;B+=K*K*K*K*_e}}return B*fu}}ts.makeNoise3D=mu;var gu=[[0,0,0,0,1,1,0,0,1,0,1,0,1,0,0,1],[2,1,1,0,2,1,0,1,2,0,1,1,3,1,1,1],[1,1,0,0,1,0,1,0,1,0,0,1,2,1,1,0,2,1,0,1,2,0,1,1]],Ss=[-11,4,4,-4,11,4,-4,4,11,11,4,4,4,11,4,4,4,11,-11,-4,4,-4,-11,4,-4,-4,11,11,-4,4,4,-11,4,4,-4,11,-11,4,-4,-4,11,-4,-4,4,-11,11,4,-4,4,11,-4,4,4,-11,-11,-4,-4,-4,-11,-4,-4,-4,-11,11,-4,-4,4,-11,-4,4,-4,-11],Ts=[0,2,1,1,2,2,5,1,6,0,7,0,32,2,34,2,129,1,133,1,160,5,161,5,518,0,519,0,546,4,550,4,645,3,647,3,672,5,673,5,674,4,677,3,678,4,679,3,680,13,681,13,682,12,685,14,686,12,687,14,712,20,714,18,809,21,813,23,840,20,841,21,1198,19,1199,22,1226,18,1230,19,1325,23,1327,22,1352,15,1353,17,1354,15,1357,17,1358,16,1359,16,1360,11,1361,10,1362,11,1365,10,1366,9,1367,9,1392,11,1394,11,1489,10,1493,10,1520,8,1521,8,1878,9,1879,9,1906,7,1910,7,2005,6,2007,6,2032,8,2033,8,2034,7,2037,6,2038,7,2039,6],Nt=[0,0,1,-1,0,0,1,0,-1,0,0,-1,1,0,0,0,1,-1,0,0,-1,0,1,0,0,-1,1,0,2,1,1,0,1,1,1,-1,0,2,1,0,1,1,1,-1,1,0,2,0,1,1,1,-1,1,1,1,3,2,1,0,3,1,2,0,1,3,2,0,1,3,1,0,2,1,3,0,2,1,3,0,1,2,1,1,1,0,0,2,2,0,0,1,1,0,1,0,2,0,2,0,1,1,0,0,1,2,0,0,2,2,0,0,0,0,1,1,-1,1,2,0,0,0,0,1,-1,1,1,2,0,0,0,0,1,1,1,-1,2,3,1,1,1,2,0,0,2,2,3,1,1,1,2,2,0,0,2,3,1,1,1,2,0,2,0,2,1,1,-1,1,2,0,0,2,2,1,1,-1,1,2,2,0,0,2,1,-1,1,1,2,0,0,2,2,1,-1,1,1,2,0,2,0,2,1,1,1,-1,2,2,0,0,2,1,1,1,-1,2,0,2,0],ns={};Object.defineProperty(ns,"__esModule",{value:!0});ns.makeNoise4D=void 0;var or=Qi,vu=1/30,Fi=(Math.sqrt(4+1)-1)/4,xu=(1/Math.sqrt(4+1)-1)/4;function lr(s,e,t,n,i){return{dx:-e-s*Fi,dy:-t-s*Fi,dz:-n-s*Fi,dw:-i-s*Fi,xsb:e,ysb:t,zsb:n,wsb:i}}function _u(s){for(var e=[],t=0;t<Ke.length;t+=16){for(var n=yu[Ke[t]],i=null,r=null,a=0;a<n.length;a+=5)r=lr(n[a],n[a+1],n[a+2],n[a+3],n[a+4]),i===null?e[t/16]=r:i.next=r,i=r;r.next=lr(Ke[t+1],Ke[t+2],Ke[t+3],Ke[t+4],Ke[t+5]),r.next.next=lr(Ke[t+6],Ke[t+7],Ke[t+8],Ke[t+9],Ke[t+10]),r.next.next.next=lr(Ke[t+11],Ke[t+12],Ke[t+13],Ke[t+14],Ke[t+15])}for(var o=[],t=0;t<Es.length;t+=2)o[Es[t]]=e[Es[t+1]];for(var l=new Uint8Array(256),c=new Uint8Array(256),h=new Uint8Array(256),t=0;t<256;t++)h[t]=t;var u=new Uint32Array(1);u[0]=s,u=or.default(or.default(or.default(u)));for(var t=255;t>=0;t--){u=or.default(u);var d=new Uint32Array(1);d[0]=(u[0]+31)%(t+1),d[0]<0&&(d[0]+=t+1),l[t]=h[d[0]],c[t]=l[t]&252,h[d[0]]=h[t]}return function(f,m,v,x){for(var p=(f+m+v+x)*xu,g=f+p,w=m+p,M=v+p,T=x+p,L=Math.floor(g),_=Math.floor(w),F=Math.floor(M),W=Math.floor(T),C=(L+_+F+W)*Fi,A=f-(L+C),V=m-(_+C),P=v-(F+C),N=x-(W+C),O=g-L,B=w-_,I=M-F,q=T-W,$=O+B+I+q,ie=I-q+1|B-I+1<<1|B-q+1<<2|O-B+1<<3|O-I+1<<4|O-q+1<<5|$<<6|$+q<<8|$+I<<11|$+B<<14|$+O<<17,K=0,de=o[ie];de!==void 0;de=de.next){var X=A+de.dx,Q=V+de.dy,oe=P+de.dz,U=N+de.dw,ue=2-X*X-Q*Q-oe*oe-U*U;if(ue>0){var _e=L+de.xsb,le=_+de.ysb,pe=F+de.zsb,Ee=W+de.wsb,k=l[_e&255],j=l[k+le&255],ee=l[j+pe&255],fe=c[ee+Ee&255],re=cr[fe]*X+cr[fe+1]*Q+cr[fe+2]*oe+cr[fe+3]*U;K+=ue*ue*ue*ue*re}}return K*vu}}ns.makeNoise4D=_u;var yu=[[0,0,0,0,0,1,1,0,0,0,1,0,1,0,0,1,0,0,1,0,1,0,0,0,1],[3,1,1,1,0,3,1,1,0,1,3,1,0,1,1,3,0,1,1,1,4,1,1,1,1],[1,1,0,0,0,1,0,1,0,0,1,0,0,1,0,1,0,0,0,1,2,1,1,0,0,2,1,0,1,0,2,1,0,0,1,2,0,1,1,0,2,0,1,0,1,2,0,0,1,1],[3,1,1,1,0,3,1,1,0,1,3,1,0,1,1,3,0,1,1,1,2,1,1,0,0,2,1,0,1,0,2,1,0,0,1,2,0,1,1,0,2,0,1,0,1,2,0,0,1,1]],cr=[3,1,1,1,1,3,1,1,1,1,3,1,1,1,1,3,-3,1,1,1,-1,3,1,1,-1,1,3,1,-1,1,1,3,3,-1,1,1,1,-3,1,1,1,-1,3,1,1,-1,1,3,-3,-1,1,1,-1,-3,1,1,-1,-1,3,1,-1,-1,1,3,3,1,-1,1,1,3,-1,1,1,1,-3,1,1,1,-1,3,-3,1,-1,1,-1,3,-1,1,-1,1,-3,1,-1,1,-1,3,3,-1,-1,1,1,-3,-1,1,1,-1,-3,1,1,-1,-1,3,-3,-1,-1,1,-1,-3,-1,1,-1,-1,-3,1,-1,-1,-1,3,3,1,1,-1,1,3,1,-1,1,1,3,-1,1,1,1,-3,-3,1,1,-1,-1,3,1,-1,-1,1,3,-1,-1,1,1,-3,3,-1,1,-1,1,-3,1,-1,1,-1,3,-1,1,-1,1,-3,-3,-1,1,-1,-1,-3,1,-1,-1,-1,3,-1,-1,-1,1,-3,3,1,-1,-1,1,3,-1,-1,1,1,-3,-1,1,1,-1,-3,-3,1,-1,-1,-1,3,-1,-1,-1,1,-3,-1,-1,1,-1,-3,3,-1,-1,-1,1,-3,-1,-1,1,-1,-3,-1,1,-1,-1,-3,-3,-1,-1,-1,-1,-3,-1,-1,-1,-1,-3,-1,-1,-1,-1,-3],Es=[0,3,1,2,2,3,5,2,6,1,7,1,8,3,9,2,10,3,13,2,16,3,18,3,22,1,23,1,24,3,26,3,33,2,37,2,38,1,39,1,41,2,45,2,54,1,55,1,56,0,57,0,58,0,59,0,60,0,61,0,62,0,63,0,256,3,258,3,264,3,266,3,272,3,274,3,280,3,282,3,2049,2,2053,2,2057,2,2061,2,2081,2,2085,2,2089,2,2093,2,2304,9,2305,9,2312,9,2313,9,16390,1,16391,1,16406,1,16407,1,16422,1,16423,1,16438,1,16439,1,16642,8,16646,8,16658,8,16662,8,18437,6,18439,6,18469,6,18471,6,18688,9,18689,9,18690,8,18693,6,18694,8,18695,6,18696,9,18697,9,18706,8,18710,8,18725,6,18727,6,131128,0,131129,0,131130,0,131131,0,131132,0,131133,0,131134,0,131135,0,131352,7,131354,7,131384,7,131386,7,133161,5,133165,5,133177,5,133181,5,133376,9,133377,9,133384,9,133385,9,133400,7,133402,7,133417,5,133421,5,133432,7,133433,5,133434,7,133437,5,147510,4,147511,4,147518,4,147519,4,147714,8,147718,8,147730,8,147734,8,147736,7,147738,7,147766,4,147767,4,147768,7,147770,7,147774,4,147775,4,149509,6,149511,6,149541,6,149543,6,149545,5,149549,5,149558,4,149559,4,149561,5,149565,5,149566,4,149567,4,149760,9,149761,9,149762,8,149765,6,149766,8,149767,6,149768,9,149769,9,149778,8,149782,8,149784,7,149786,7,149797,6,149799,6,149801,5,149805,5,149814,4,149815,4,149816,7,149817,5,149818,7,149821,5,149822,4,149823,4,149824,37,149825,37,149826,36,149829,34,149830,36,149831,34,149832,37,149833,37,149842,36,149846,36,149848,35,149850,35,149861,34,149863,34,149865,33,149869,33,149878,32,149879,32,149880,35,149881,33,149882,35,149885,33,149886,32,149887,32,150080,49,150082,48,150088,49,150098,48,150104,47,150106,47,151873,46,151877,45,151881,46,151909,45,151913,44,151917,44,152128,49,152129,46,152136,49,152137,46,166214,43,166215,42,166230,43,166247,42,166262,41,166263,41,166466,48,166470,43,166482,48,166486,43,168261,45,168263,42,168293,45,168295,42,168512,31,168513,28,168514,31,168517,28,168518,25,168519,25,280952,40,280953,39,280954,40,280957,39,280958,38,280959,38,281176,47,281178,47,281208,40,281210,40,282985,44,282989,44,283001,39,283005,39,283208,30,283209,27,283224,30,283241,27,283256,22,283257,22,297334,41,297335,41,297342,38,297343,38,297554,29,297558,24,297562,29,297590,24,297594,21,297598,21,299365,26,299367,23,299373,26,299383,23,299389,20,299391,20,299584,31,299585,28,299586,31,299589,28,299590,25,299591,25,299592,30,299593,27,299602,29,299606,24,299608,30,299610,29,299621,26,299623,23,299625,27,299629,26,299638,24,299639,23,299640,22,299641,22,299642,21,299645,20,299646,21,299647,20,299648,61,299649,60,299650,61,299653,60,299654,59,299655,59,299656,58,299657,57,299666,55,299670,54,299672,58,299674,55,299685,52,299687,51,299689,57,299693,52,299702,54,299703,51,299704,56,299705,56,299706,53,299709,50,299710,53,299711,50,299904,61,299906,61,299912,58,299922,55,299928,58,299930,55,301697,60,301701,60,301705,57,301733,52,301737,57,301741,52,301952,79,301953,79,301960,76,301961,76,316038,59,316039,59,316054,54,316071,51,316086,54,316087,51,316290,78,316294,78,316306,73,316310,73,318085,77,318087,77,318117,70,318119,70,318336,79,318337,79,318338,78,318341,77,318342,78,318343,77,430776,56,430777,56,430778,53,430781,50,430782,53,430783,50,431e3,75,431002,72,431032,75,431034,72,432809,74,432813,69,432825,74,432829,69,433032,76,433033,76,433048,75,433065,74,433080,75,433081,74,447158,71,447159,68,447166,71,447167,68,447378,73,447382,73,447386,72,447414,71,447418,72,447422,71,449189,70,449191,70,449197,69,449207,68,449213,69,449215,68,449408,67,449409,67,449410,66,449413,64,449414,66,449415,64,449416,67,449417,67,449426,66,449430,66,449432,65,449434,65,449445,64,449447,64,449449,63,449453,63,449462,62,449463,62,449464,65,449465,63,449466,65,449469,63,449470,62,449471,62,449472,19,449473,19,449474,18,449477,16,449478,18,449479,16,449480,19,449481,19,449490,18,449494,18,449496,17,449498,17,449509,16,449511,16,449513,15,449517,15,449526,14,449527,14,449528,17,449529,15,449530,17,449533,15,449534,14,449535,14,449728,19,449729,19,449730,18,449734,18,449736,19,449737,19,449746,18,449750,18,449752,17,449754,17,449784,17,449786,17,451520,19,451521,19,451525,16,451527,16,451528,19,451529,19,451557,16,451559,16,451561,15,451565,15,451577,15,451581,15,451776,19,451777,19,451784,19,451785,19,465858,18,465861,16,465862,18,465863,16,465874,18,465878,18,465893,16,465895,16,465910,14,465911,14,465918,14,465919,14,466114,18,466118,18,466130,18,466134,18,467909,16,467911,16,467941,16,467943,16,468160,13,468161,13,468162,13,468163,13,468164,13,468165,13,468166,13,468167,13,580568,17,580570,17,580585,15,580589,15,580598,14,580599,14,580600,17,580601,15,580602,17,580605,15,580606,14,580607,14,580824,17,580826,17,580856,17,580858,17,582633,15,582637,15,582649,15,582653,15,582856,12,582857,12,582872,12,582873,12,582888,12,582889,12,582904,12,582905,12,596982,14,596983,14,596990,14,596991,14,597202,11,597206,11,597210,11,597214,11,597234,11,597238,11,597242,11,597246,11,599013,10,599015,10,599021,10,599023,10,599029,10,599031,10,599037,10,599039,10,599232,13,599233,13,599234,13,599235,13,599236,13,599237,13,599238,13,599239,13,599240,12,599241,12,599250,11,599254,11,599256,12,599257,12,599258,11,599262,11,599269,10,599271,10,599272,12,599273,12,599277,10,599279,10,599282,11,599285,10,599286,11,599287,10,599288,12,599289,12,599290,11,599293,10,599294,11,599295,10],Ke=[0,0,1,-1,0,0,0,1,0,-1,0,0,1,0,0,-1,0,0,-1,1,0,0,0,0,1,-1,0,0,0,1,0,-1,0,0,-1,0,1,0,0,0,-1,1,0,0,0,0,1,-1,0,0,-1,0,0,1,0,0,-1,0,1,0,0,0,-1,1,0,2,1,1,0,0,1,1,1,-1,0,1,1,1,0,-1,0,2,1,0,1,0,1,1,-1,1,0,1,1,0,1,-1,0,2,0,1,1,0,1,-1,1,1,0,1,0,1,1,-1,0,2,1,0,0,1,1,1,-1,0,1,1,1,0,-1,1,0,2,0,1,0,1,1,-1,1,0,1,1,0,1,-1,1,0,2,0,0,1,1,1,-1,0,1,1,1,0,-1,1,1,1,4,2,1,1,0,4,1,2,1,0,4,1,1,2,0,1,4,2,1,0,1,4,1,2,0,1,4,1,1,0,2,1,4,2,0,1,1,4,1,0,2,1,4,1,0,1,2,1,4,0,2,1,1,4,0,1,2,1,4,0,1,1,2,1,2,1,1,0,0,3,2,1,0,0,3,1,2,0,0,1,2,1,0,1,0,3,2,0,1,0,3,1,0,2,0,1,2,0,1,1,0,3,0,2,1,0,3,0,1,2,0,1,2,1,0,0,1,3,2,0,0,1,3,1,0,0,2,1,2,0,1,0,1,3,0,2,0,1,3,0,1,0,2,1,2,0,0,1,1,3,0,0,2,1,3,0,0,1,2,2,3,1,1,1,0,2,1,1,1,-1,2,2,0,0,0,2,3,1,1,0,1,2,1,1,-1,1,2,2,0,0,0,2,3,1,0,1,1,2,1,-1,1,1,2,2,0,0,0,2,3,1,1,1,0,2,1,1,1,-1,2,0,2,0,0,2,3,1,1,0,1,2,1,1,-1,1,2,0,2,0,0,2,3,0,1,1,1,2,-1,1,1,1,2,0,2,0,0,2,3,1,1,1,0,2,1,1,1,-1,2,0,0,2,0,2,3,1,0,1,1,2,1,-1,1,1,2,0,0,2,0,2,3,0,1,1,1,2,-1,1,1,1,2,0,0,2,0,2,3,1,1,0,1,2,1,1,-1,1,2,0,0,0,2,2,3,1,0,1,1,2,1,-1,1,1,2,0,0,0,2,2,3,0,1,1,1,2,-1,1,1,1,2,0,0,0,2,2,1,1,1,-1,0,1,1,1,0,-1,0,0,0,0,0,2,1,1,-1,1,0,1,1,0,1,-1,0,0,0,0,0,2,1,-1,1,1,0,1,0,1,1,-1,0,0,0,0,0,2,1,1,-1,0,1,1,1,0,-1,1,0,0,0,0,0,2,1,-1,1,0,1,1,0,1,-1,1,0,0,0,0,0,2,1,-1,0,1,1,1,0,-1,1,1,0,0,0,0,0,2,1,1,1,-1,0,1,1,1,0,-1,2,2,0,0,0,2,1,1,-1,1,0,1,1,0,1,-1,2,2,0,0,0,2,1,1,-1,0,1,1,1,0,-1,1,2,2,0,0,0,2,1,1,1,-1,0,1,1,1,0,-1,2,0,2,0,0,2,1,-1,1,1,0,1,0,1,1,-1,2,0,2,0,0,2,1,-1,1,0,1,1,0,1,-1,1,2,0,2,0,0,2,1,1,-1,1,0,1,1,0,1,-1,2,0,0,2,0,2,1,-1,1,1,0,1,0,1,1,-1,2,0,0,2,0,2,1,-1,0,1,1,1,0,-1,1,1,2,0,0,2,0,2,1,1,-1,0,1,1,1,0,-1,1,2,0,0,0,2,2,1,-1,1,0,1,1,0,1,-1,1,2,0,0,0,2,2,1,-1,0,1,1,1,0,-1,1,1,2,0,0,0,2,3,1,1,0,0,0,2,2,0,0,0,2,1,1,1,-1,3,1,0,1,0,0,2,0,2,0,0,2,1,1,1,-1,3,1,0,0,1,0,2,0,0,2,0,2,1,1,1,-1,3,1,1,0,0,0,2,2,0,0,0,2,1,1,-1,1,3,1,0,1,0,0,2,0,2,0,0,2,1,1,-1,1,3,1,0,0,0,1,2,0,0,0,2,2,1,1,-1,1,3,1,1,0,0,0,2,2,0,0,0,2,1,-1,1,1,3,1,0,0,1,0,2,0,0,2,0,2,1,-1,1,1,3,1,0,0,0,1,2,0,0,0,2,2,1,-1,1,1,3,1,0,1,0,0,2,0,2,0,0,2,-1,1,1,1,3,1,0,0,1,0,2,0,0,2,0,2,-1,1,1,1,3,1,0,0,0,1,2,0,0,0,2,2,-1,1,1,1,3,3,2,1,0,0,3,1,2,0,0,4,1,1,1,1,3,3,2,0,1,0,3,1,0,2,0,4,1,1,1,1,3,3,0,2,1,0,3,0,1,2,0,4,1,1,1,1,3,3,2,0,0,1,3,1,0,0,2,4,1,1,1,1,3,3,0,2,0,1,3,0,1,0,2,4,1,1,1,1,3,3,0,0,2,1,3,0,0,1,2,4,1,1,1,1,3,3,2,1,0,0,3,1,2,0,0,2,1,1,1,-1,3,3,2,0,1,0,3,1,0,2,0,2,1,1,1,-1,3,3,0,2,1,0,3,0,1,2,0,2,1,1,1,-1,3,3,2,1,0,0,3,1,2,0,0,2,1,1,-1,1,3,3,2,0,0,1,3,1,0,0,2,2,1,1,-1,1,3,3,0,2,0,1,3,0,1,0,2,2,1,1,-1,1,3,3,2,0,1,0,3,1,0,2,0,2,1,-1,1,1,3,3,2,0,0,1,3,1,0,0,2,2,1,-1,1,1,3,3,0,0,2,1,3,0,0,1,2,2,1,-1,1,1,3,3,0,2,1,0,3,0,1,2,0,2,-1,1,1,1,3,3,0,2,0,1,3,0,1,0,2,2,-1,1,1,1,3,3,0,0,2,1,3,0,0,1,2,2,-1,1,1,1];(function(s){Object.defineProperty(s,"__esModule",{value:!0}),s.makeNoise4D=s.makeNoise3D=s.makeNoise2D=void 0;var e=es;Object.defineProperty(s,"makeNoise2D",{enumerable:!0,get:function(){return e.makeNoise2D}});var t=ts;Object.defineProperty(s,"makeNoise3D",{enumerable:!0,get:function(){return t.makeNoise3D}});var n=ns;Object.defineProperty(s,"makeNoise4D",{enumerable:!0,get:function(){return n.makeNoise4D}})})(Ql);function As(s,e,t,n){return(i,r)=>ki(-1,1,e,t,n(i*s,r*s))}function Ls(s,e=.5,t=2){const n=Vr(s,()=>Ql.makeNoise2D(Math.random()));return(i,r)=>{let a=0,o=1,l=1,c=0;for(const h of n)a+=h(i*l,r*l)*o,c+=o,o*=e,l*=t;return a/c}}function bu(s){const e=+this._x.call(null,s),t=+this._y.call(null,s);return $l(this.cover(e,t),e,t,s)}function $l(s,e,t,n){if(isNaN(e)||isNaN(t))return s;var i,r=s._root,a={data:n},o=s._x0,l=s._y0,c=s._x1,h=s._y1,u,d,f,m,v,x,p,g;if(!r)return s._root=a,s;for(;r.length;)if((v=e>=(u=(o+c)/2))?o=u:c=u,(x=t>=(d=(l+h)/2))?l=d:h=d,i=r,!(r=r[p=x<<1|v]))return i[p]=a,s;if(f=+s._x.call(null,r.data),m=+s._y.call(null,r.data),e===f&&t===m)return a.next=r,i?i[p]=a:s._root=a,s;do i=i?i[p]=new Array(4):s._root=new Array(4),(v=e>=(u=(o+c)/2))?o=u:c=u,(x=t>=(d=(l+h)/2))?l=d:h=d;while((p=x<<1|v)===(g=(m>=d)<<1|f>=u));return i[g]=r,i[p]=a,s}function Mu(s){var e,t,n=s.length,i,r,a=new Array(n),o=new Array(n),l=1/0,c=1/0,h=-1/0,u=-1/0;for(t=0;t<n;++t)isNaN(i=+this._x.call(null,e=s[t]))||isNaN(r=+this._y.call(null,e))||(a[t]=i,o[t]=r,i<l&&(l=i),i>h&&(h=i),r<c&&(c=r),r>u&&(u=r));if(l>h||c>u)return this;for(this.cover(l,c).cover(h,u),t=0;t<n;++t)$l(this,a[t],o[t],s[t]);return this}function wu(s,e){if(isNaN(s=+s)||isNaN(e=+e))return this;var t=this._x0,n=this._y0,i=this._x1,r=this._y1;if(isNaN(t))i=(t=Math.floor(s))+1,r=(n=Math.floor(e))+1;else{for(var a=i-t||1,o=this._root,l,c;t>s||s>=i||n>e||e>=r;)switch(c=(e<n)<<1|s<t,l=new Array(4),l[c]=o,o=l,a*=2,c){case 0:i=t+a,r=n+a;break;case 1:t=i-a,r=n+a;break;case 2:i=t+a,n=r-a;break;case 3:t=i-a,n=r-a;break}this._root&&this._root.length&&(this._root=o)}return this._x0=t,this._y0=n,this._x1=i,this._y1=r,this}function Su(){var s=[];return this.visit(function(e){if(!e.length)do s.push(e.data);while(e=e.next)}),s}function Tu(s){return arguments.length?this.cover(+s[0][0],+s[0][1]).cover(+s[1][0],+s[1][1]):isNaN(this._x0)?void 0:[[this._x0,this._y0],[this._x1,this._y1]]}function ut(s,e,t,n,i){this.node=s,this.x0=e,this.y0=t,this.x1=n,this.y1=i}function Eu(s,e,t){var n,i=this._x0,r=this._y0,a,o,l,c,h=this._x1,u=this._y1,d=[],f=this._root,m,v;for(f&&d.push(new ut(f,i,r,h,u)),t==null?t=1/0:(i=s-t,r=e-t,h=s+t,u=e+t,t*=t);m=d.pop();)if(!(!(f=m.node)||(a=m.x0)>h||(o=m.y0)>u||(l=m.x1)<i||(c=m.y1)<r))if(f.length){var x=(a+l)/2,p=(o+c)/2;d.push(new ut(f[3],x,p,l,c),new ut(f[2],a,p,x,c),new ut(f[1],x,o,l,p),new ut(f[0],a,o,x,p)),(v=(e>=p)<<1|s>=x)&&(m=d[d.length-1],d[d.length-1]=d[d.length-1-v],d[d.length-1-v]=m)}else{var g=s-+this._x.call(null,f.data),w=e-+this._y.call(null,f.data),M=g*g+w*w;if(M<t){var T=Math.sqrt(t=M);i=s-T,r=e-T,h=s+T,u=e+T,n=f.data}}return n}function Au(s){if(isNaN(h=+this._x.call(null,s))||isNaN(u=+this._y.call(null,s)))return this;var e,t=this._root,n,i,r,a=this._x0,o=this._y0,l=this._x1,c=this._y1,h,u,d,f,m,v,x,p;if(!t)return this;if(t.length)for(;;){if((m=h>=(d=(a+l)/2))?a=d:l=d,(v=u>=(f=(o+c)/2))?o=f:c=f,e=t,!(t=t[x=v<<1|m]))return this;if(!t.length)break;(e[x+1&3]||e[x+2&3]||e[x+3&3])&&(n=e,p=x)}for(;t.data!==s;)if(i=t,!(t=t.next))return this;return(r=t.next)&&delete t.next,i?(r?i.next=r:delete i.next,this):e?(r?e[x]=r:delete e[x],(t=e[0]||e[1]||e[2]||e[3])&&t===(e[3]||e[2]||e[1]||e[0])&&!t.length&&(n?n[p]=t:this._root=t),this):(this._root=r,this)}function Lu(s){for(var e=0,t=s.length;e<t;++e)this.remove(s[e]);return this}function Cu(){return this._root}function Ru(){var s=0;return this.visit(function(e){if(!e.length)do++s;while(e=e.next)}),s}function Pu(s){var e=[],t,n=this._root,i,r,a,o,l;for(n&&e.push(new ut(n,this._x0,this._y0,this._x1,this._y1));t=e.pop();)if(!s(n=t.node,r=t.x0,a=t.y0,o=t.x1,l=t.y1)&&n.length){var c=(r+o)/2,h=(a+l)/2;(i=n[3])&&e.push(new ut(i,c,h,o,l)),(i=n[2])&&e.push(new ut(i,r,h,c,l)),(i=n[1])&&e.push(new ut(i,c,a,o,h)),(i=n[0])&&e.push(new ut(i,r,a,c,h))}return this}function Iu(s){var e=[],t=[],n;for(this._root&&e.push(new ut(this._root,this._x0,this._y0,this._x1,this._y1));n=e.pop();){var i=n.node;if(i.length){var r,a=n.x0,o=n.y0,l=n.x1,c=n.y1,h=(a+l)/2,u=(o+c)/2;(r=i[0])&&e.push(new ut(r,a,o,h,u)),(r=i[1])&&e.push(new ut(r,h,o,l,u)),(r=i[2])&&e.push(new ut(r,a,u,h,c)),(r=i[3])&&e.push(new ut(r,h,u,l,c))}t.push(n)}for(;n=t.pop();)s(n.node,n.x0,n.y0,n.x1,n.y1);return this}function Du(s){return s[0]}function Fu(s){return arguments.length?(this._x=s,this):this._x}function Nu(s){return s[1]}function Bu(s){return arguments.length?(this._y=s,this):this._y}function Kl(s,e,t){var n=new Da(e==null?Du:e,t==null?Nu:t,NaN,NaN,NaN,NaN);return s==null?n:n.addAll(s)}function Da(s,e,t,n,i,r){this._x=s,this._y=e,this._x0=t,this._y0=n,this._x1=i,this._y1=r,this._root=void 0}function To(s){for(var e={data:s.data},t=e;s=s.next;)t=t.next={data:s.data};return e}var pt=Kl.prototype=Da.prototype;pt.copy=function(){var s=new Da(this._x,this._y,this._x0,this._y0,this._x1,this._y1),e=this._root,t,n;if(!e)return s;if(!e.length)return s._root=To(e),s;for(t=[{source:e,target:s._root=new Array(4)}];e=t.pop();)for(var i=0;i<4;++i)(n=e.source[i])&&(n.length?t.push({source:n,target:e.target[i]=new Array(4)}):e.target[i]=To(n));return s};pt.add=bu;pt.addAll=Mu;pt.cover=wu;pt.data=Su;pt.extent=Tu;pt.find=Eu;pt.remove=Au;pt.removeAll=Lu;pt.root=Cu;pt.size=Ru;pt.visit=Pu;pt.visitAfter=Iu;pt.x=Fu;pt.y=Bu;function zu(s,e){const t=new Set(e.activeCellIds),n=new ma(e.activeCellIds),i=new Array(e.activeCellIds.length),r=Vr(s,l=>{const c=n.pop();return t.delete(c),i[c]=l,{activeCellIds:new ma([c]),allCellIds:new Set([c]),id:l}}),a=r.slice();for(;t.size>0;){const l=po(a);if(!l)break;for(;l.activeCellIds.size;){const c=l.activeCellIds.pop(),h=e.cellsById[c].neighbourCellIds;if(h.filter(d=>t.has(d)).length){const d=po(h);t.has(d)&&(t.delete(d),l.activeCellIds.add(d),l.allCellIds.add(d),i[d]=l.id),l.activeCellIds.add(c);break}}l.activeCellIds.size||uh(a,l)}const o=dh(r.map((l,c)=>ki(0,Math.max(1,r.length-1),Xh,Yh,c)));return{plateIdByCellId:i,platesById:r.map(({id:l,allCellIds:c},h)=>new ou(l,e,o[h],Array.from(c),i))}}class Uu{constructor(e,t){this.allCellIds=e.points.map((o,l)=>l),this.isActiveByCellId=e.points.map(o=>t.contains(o)),this.activeCellIds=this.allCellIds.filter(o=>this.isActiveByCellId[o]);const n=As(Zh,-Mo,Mo,Ls(5)),i=As(tu,1-nu,1,Ls(5));this.cellsById=e.cellsByPointId.map((o,l)=>new su(l,o,this,n,i)),this.cellsQuadTree=Kl(this.cellsById,o=>o.position.x,o=>o.position.y),console.time("assignPlates");const{plateIdByCellId:r,platesById:a}=zu(Math.ceil(this.activeCellIds.length/qh),this);console.timeEnd("assignPlates"),this.plateIdByCellId=r,this.platesById=a}getCellAtPosition(e){const t=this.activeCellIds.find(n=>e.isInPolygon(this.cellsById[n].polygon));return t==null?null:this.cellsById[t]}smoothCellsBasedOnPlateHeight(){const e=As(Qh,jh,Jh,Ls(4));for(const t of this.activeCellIds){const n=this.cellsById[t],i=e(n.position.x,n.position.y),r=n.findConnectedCellsInRadius(i),l=r.reduce((c,h)=>c+h.getPlate().baseHeight,0)/r.length-n.getPlate().baseHeight;n.adjustHeight(l)}}calculateDriftHeightOffsets(){for(const e of this.platesById)e.calculateDriftHeightOffsets()}propagateTectonicDrift(){for(const e of this.activeCellIds)this.cellsById[e].propagateTectonicDrift()}}function is(s){for(var e=s.length/6|0,t=new Array(e),n=0;n<e;)t[n]="#"+s.slice(n*6,++n*6);return t}function rs(s){var e=s.length;return function(t){return s[Math.max(0,Math.min(e-1,Math.floor(t*e)))]}}rs(is("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));var Ou=rs(is("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));rs(is("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));rs(is("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));/**
 * @license
 * Copyright 2010-2021 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ec="132",Hu=0,Eo=1,Gu=2,tc=1,ku=2,Ni=3,Vi=0,Xe=1,oi=2,nc=1,hn=0,Ui=1,Ao=2,Lo=3,Co=4,Vu=5,Qn=100,Wu=101,qu=102,Ro=103,Po=104,Xu=200,Yu=201,Zu=202,ju=203,ic=204,rc=205,Ju=206,Qu=207,$u=208,Ku=209,ed=210,td=0,nd=1,id=2,va=3,rd=4,sd=5,ad=6,od=7,ss=0,ld=1,cd=2,En=0,hd=1,ud=2,dd=3,fd=4,pd=5,sc=300,as=301,os=302,xa=303,_a=304,ls=306,Fa=307,ya=1e3,wt=1001,ba=1002,Je=1003,Io=1004,Do=1005,Et=1006,md=1007,cs=1008,li=1009,gd=1010,vd=1011,Xr=1012,xd=1013,kr=1014,Tn=1015,ii=1016,_d=1017,yd=1018,bd=1019,Oi=1020,Md=1021,un=1022,St=1023,wd=1024,Sd=1025,Td=St,ri=1026,Wi=1027,Ed=1028,Ad=1029,Ld=1030,Cd=1031,Rd=1032,Pd=1033,Fo=33776,No=33777,Bo=33778,zo=33779,Uo=35840,Oo=35841,Ho=35842,Go=35843,Id=36196,ko=37492,Vo=37496,Dd=37808,Fd=37809,Nd=37810,Bd=37811,zd=37812,Ud=37813,Od=37814,Hd=37815,Gd=37816,kd=37817,Vd=37818,Wd=37819,qd=37820,Xd=37821,Yd=36492,Zd=37840,jd=37841,Jd=37842,Qd=37843,$d=37844,Kd=37845,ef=37846,tf=37847,nf=37848,rf=37849,sf=37850,af=37851,of=37852,lf=37853,cf=2200,hf=2201,uf=2202,Yr=2300,Zr=2301,Cs=2302,ei=2400,ti=2401,jr=2402,Na=2500,ac=2501,df=0,_t=3e3,hs=3001,Ba=3007,za=3002,ff=3003,oc=3004,lc=3005,cc=3006,pf=3200,mf=3201,di=0,gf=1,Rs=7680,vf=519,qi=35044,Jr=35048,Wo="300 es";class Cn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,e);e.target=null}}}const et=[];for(let s=0;s<256;s++)et[s]=(s<16?"0":"")+s.toString(16);const Ps=Math.PI/180,Ma=180/Math.PI;function Ot(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(et[s&255]+et[s>>8&255]+et[s>>16&255]+et[s>>24&255]+"-"+et[e&255]+et[e>>8&255]+"-"+et[e>>16&15|64]+et[e>>24&255]+"-"+et[t&63|128]+et[t>>8&255]+"-"+et[t>>16&255]+et[t>>24&255]+et[n&255]+et[n>>8&255]+et[n>>16&255]+et[n>>24&255]).toUpperCase()}function Mt(s,e,t){return Math.max(e,Math.min(t,s))}function xf(s,e){return(s%e+e)%e}function Is(s,e,t){return(1-t)*s+t*e}function qo(s){return(s&s-1)===0&&s!==0}function _f(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}class te{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e,t){return t!==void 0?(console.warn("THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead."),this.addVectors(e,t)):(this.x+=e.x,this.y+=e.y,this)}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e,t){return t!==void 0?(console.warn("THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."),this.subVectors(e,t)):(this.x-=e.x,this.y-=e.y,this)}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t,n){return n!==void 0&&console.warn("THREE.Vector2: offset has been removed from .fromBufferAttribute()."),this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*i+e.x,this.y=r*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}}te.prototype.isVector2=!0;class tt{constructor(){this.elements=[1,0,0,0,1,0,0,0,1],arguments.length>0&&console.error("THREE.Matrix3: the constructor no longer reads arguments. use .set() instead.")}set(e,t,n,i,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=i,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],m=n[8],v=i[0],x=i[3],p=i[6],g=i[1],w=i[4],M=i[7],T=i[2],L=i[5],_=i[8];return r[0]=a*v+o*g+l*T,r[3]=a*x+o*w+l*L,r[6]=a*p+o*M+l*_,r[1]=c*v+h*g+u*T,r[4]=c*x+h*w+u*L,r[7]=c*p+h*M+u*_,r[2]=d*v+f*g+m*T,r[5]=d*x+f*w+m*L,r[8]=d*p+f*M+m*_,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+i*r*c-i*a*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,d=o*l-h*r,f=c*r-a*l,m=t*u+n*d+i*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/m;return e[0]=u*v,e[1]=(i*c-h*n)*v,e[2]=(o*n-i*a)*v,e[3]=d*v,e[4]=(h*t-i*l)*v,e[5]=(i*r-o*t)*v,e[6]=f*v,e[7]=(n*l-c*t)*v,e[8]=(a*t-n*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=t,n[4]*=t,n[7]*=t,this}rotate(e){const t=Math.cos(e),n=Math.sin(e),i=this.elements,r=i[0],a=i[3],o=i[6],l=i[1],c=i[4],h=i[7];return i[0]=t*r+n*l,i[3]=t*a+n*c,i[6]=t*o+n*h,i[1]=-n*r+t*l,i[4]=-n*a+t*c,i[7]=-n*o+t*h,this}translate(e,t){const n=this.elements;return n[0]+=e*n[2],n[3]+=e*n[5],n[6]+=e*n[8],n[1]+=t*n[2],n[4]+=t*n[5],n[7]+=t*n[8],this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}tt.prototype.isMatrix3=!0;let Pn;class fi{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Pn===void 0&&(Pn=document.createElementNS("http://www.w3.org/1999/xhtml","canvas")),Pn.width=e.width,Pn.height=e.height;const n=Pn.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Pn}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}}let yf=0;class nt extends Cn{constructor(e=nt.DEFAULT_IMAGE,t=nt.DEFAULT_MAPPING,n=wt,i=wt,r=Et,a=cs,o=St,l=li,c=1,h=_t){super(),Object.defineProperty(this,"id",{value:yf++}),this.uuid=Ot(),this.name="",this.image=e,this.mipmaps=[],this.mapping=t,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new te(0,0),this.repeat=new te(1,1),this.center=new te(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new tt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.encoding=h,this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.image=e.image,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.encoding=e.encoding,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.5,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,mapping:this.mapping,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,type:this.type,encoding:this.encoding,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};if(this.image!==void 0){const i=this.image;if(i.uuid===void 0&&(i.uuid=Ot()),!t&&e.images[i.uuid]===void 0){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(Ds(i[a].image)):r.push(Ds(i[a]))}else r=Ds(i);e.images[i.uuid]={uuid:i.uuid,url:r}}n.image=i.uuid}return t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==sc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ya:e.x=e.x-Math.floor(e.x);break;case wt:e.x=e.x<0?0:1;break;case ba:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case ya:e.y=e.y-Math.floor(e.y);break;case wt:e.y=e.y<0?0:1;break;case ba:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&this.version++}}nt.DEFAULT_IMAGE=void 0;nt.DEFAULT_MAPPING=sc;nt.prototype.isTexture=!0;function Ds(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?fi.getDataURL(s):s.data?{data:Array.prototype.slice.call(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}class ze{constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e,t){return t!==void 0?(console.warn("THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead."),this.addVectors(e,t)):(this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this)}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e,t){return t!==void 0?(console.warn("THREE.Vector4: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."),this.subVectors(e,t)):(this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this)}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],m=l[9],v=l[2],x=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(m-x)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(m+x)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const w=(c+1)/2,M=(f+1)/2,T=(p+1)/2,L=(h+d)/4,_=(u+v)/4,F=(m+x)/4;return w>M&&w>T?w<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(w),i=L/n,r=_/n):M>T?M<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(M),n=L/i,r=F/i):T<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(T),n=_/r,i=F/r),this.set(n,i,r,t),this}let g=Math.sqrt((x-m)*(x-m)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(g)<.001&&(g=1),this.x=(x-m)/g,this.y=(u-v)/g,this.z=(d-h)/g,this.w=Math.acos((c+f+p-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this.z=this.z<0?Math.ceil(this.z):Math.floor(this.z),this.w=this.w<0?Math.ceil(this.w):Math.floor(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t,n){return n!==void 0&&console.warn("THREE.Vector4: offset has been removed from .fromBufferAttribute()."),this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}}ze.prototype.isVector4=!0;class Ht extends Cn{constructor(e,t,n={}){super(),this.width=e,this.height=t,this.depth=1,this.scissor=new ze(0,0,e,t),this.scissorTest=!1,this.viewport=new ze(0,0,e,t),this.texture=new nt(void 0,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.encoding),this.texture.isRenderTargetTexture=!0,this.texture.image={width:e,height:t,depth:1},this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.internalFormat=n.internalFormat!==void 0?n.internalFormat:null,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:Et,this.depthBuffer=n.depthBuffer!==void 0?n.depthBuffer:!0,this.stencilBuffer=n.stencilBuffer!==void 0?n.stencilBuffer:!1,this.depthTexture=n.depthTexture!==void 0?n.depthTexture:null}setTexture(e){e.image={width:this.width,height:this.height,depth:this.depth},this.texture=e}setSize(e,t,n=1){(this.width!==e||this.height!==t||this.depth!==n)&&(this.width=e,this.height=t,this.depth=n,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.width=e.width,this.height=e.height,this.depth=e.depth,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.image={...this.texture.image},this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.depthTexture=e.depthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}Ht.prototype.isWebGLRenderTarget=!0;class bf extends Ht{constructor(e,t,n){super(e,t);const i=this.texture;this.texture=[];for(let r=0;r<n;r++)this.texture[r]=i.clone()}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.texture.length;i<r;i++)this.texture[i].image.width=e,this.texture[i].image.height=t,this.texture[i].image.depth=n;this.dispose()}return this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t),this}copy(e){this.dispose(),this.width=e.width,this.height=e.height,this.depth=e.depth,this.viewport.set(0,0,this.width,this.height),this.scissor.set(0,0,this.width,this.height),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.depthTexture=e.depthTexture,this.texture.length=0;for(let t=0,n=e.texture.length;t<n;t++)this.texture[t]=e.texture[t].clone();return this}}bf.prototype.isWebGLMultipleRenderTargets=!0;class hc extends Ht{constructor(e,t,n){super(e,t,n),this.samples=4}copy(e){return super.copy.call(this,e),this.samples=e.samples,this}}hc.prototype.isWebGLMultisampleRenderTarget=!0;class vt{constructor(e=0,t=0,n=0,i=1){this._x=e,this._y=t,this._z=n,this._w=i}static slerp(e,t,n,i){return console.warn("THREE.Quaternion: Static .slerp() has been deprecated. Use qm.slerpQuaternions( qa, qb, t ) instead."),n.slerpQuaternions(e,t,i)}static slerpFlat(e,t,n,i,r,a,o){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3];const d=r[a+0],f=r[a+1],m=r[a+2],v=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(o===1){e[t+0]=d,e[t+1]=f,e[t+2]=m,e[t+3]=v;return}if(u!==v||l!==d||c!==f||h!==m){let x=1-o;const p=l*d+c*f+h*m+u*v,g=p>=0?1:-1,w=1-p*p;if(w>Number.EPSILON){const T=Math.sqrt(w),L=Math.atan2(T,p*g);x=Math.sin(x*L)/T,o=Math.sin(o*L)/T}const M=o*g;if(l=l*x+d*M,c=c*x+f*M,h=h*x+m*M,u=u*x+v*M,x===1-o){const T=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=T,c*=T,h*=T,u*=T}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,r,a){const o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=r[a],d=r[a+1],f=r[a+2],m=r[a+3];return e[t]=o*m+h*u+l*f-c*d,e[t+1]=l*m+h*d+c*u-o*f,e[t+2]=c*m+h*f+o*d-l*u,e[t+3]=h*m-o*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t){if(!(e&&e.isEuler))throw new Error("THREE.Quaternion: .setFromEuler() now expects an Euler rotation rather than a Vector3 and order.");const n=e._x,i=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),u=o(r/2),d=l(n/2),f=l(i/2),m=l(r/2);switch(a){case"XYZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"YXZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"ZXY":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"ZYX":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"YZX":this._x=d*h*u+c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u-d*f*m;break;case"XZY":this._x=d*h*u-c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u+d*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t!==!1&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-i)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(h-l)/f,this._x=.25*f,this._y=(i+a)/f,this._z=(r+c)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(r-c)/f,this._x=(i+a)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(a-i)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Mt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e,t){return t!==void 0?(console.warn("THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead."),this.multiplyQuaternions(e,t)):this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+i*c-r*l,this._y=i*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-i*o,this._w=a*h-n*o-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,r=this._z,a=this._w;let o=a*e._w+n*e._x+i*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=i,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const f=1-t;return this._w=f*a+t*this._w,this._x=f*n+t*this._x,this._y=f*i+t*this._y,this._z=f*r+t*this._z,this.normalize(),this._onChangeCallback(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-t)*h)/c,d=Math.sin(t*h)/c;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){this.copy(e).slerp(t,n)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}}vt.prototype.isQuaternion=!0;class E{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e,t){return t!==void 0?(console.warn("THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead."),this.addVectors(e,t)):(this.x+=e.x,this.y+=e.y,this.z+=e.z,this)}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e,t){return t!==void 0?(console.warn("THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."),this.subVectors(e,t)):(this.x-=e.x,this.y-=e.y,this.z-=e.z,this)}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e,t){return t!==void 0?(console.warn("THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead."),this.multiplyVectors(e,t)):(this.x*=e.x,this.y*=e.y,this.z*=e.z,this)}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return e&&e.isEuler||console.error("THREE.Vector3: .applyEuler() now expects an Euler rotation rather than a Vector3 and order."),this.applyQuaternion(Xo.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Xo.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=l*t+a*i-o*n,h=l*n+o*t-r*i,u=l*i+r*n-a*t,d=-r*t-a*n-o*i;return this.x=c*l+d*-r+h*-o-u*-a,this.y=h*l+d*-a+u*-r-c*-o,this.z=u*l+d*-o+c*-a-h*-r,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this.z=this.z<0?Math.ceil(this.z):Math.floor(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e,t){return t!==void 0?(console.warn("THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead."),this.crossVectors(e,t)):this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-r*o,this.y=r*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Fs.copy(this).projectOnVector(e),this.sub(Fs)}reflect(e){return this.sub(Fs.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Mt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t,n){return n!==void 0&&console.warn("THREE.Vector3: offset has been removed from .fromBufferAttribute()."),this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}}E.prototype.isVector3=!0;const Fs=new E,Xo=new vt;class Dt{constructor(e=new E(1/0,1/0,1/0),t=new E(-1/0,-1/0,-1/0)){this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){let t=1/0,n=1/0,i=1/0,r=-1/0,a=-1/0,o=-1/0;for(let l=0,c=e.length;l<c;l+=3){const h=e[l],u=e[l+1],d=e[l+2];h<t&&(t=h),u<n&&(n=u),d<i&&(i=d),h>r&&(r=h),u>a&&(a=u),d>o&&(o=d)}return this.min.set(t,n,i),this.max.set(r,a,o),this}setFromBufferAttribute(e){let t=1/0,n=1/0,i=1/0,r=-1/0,a=-1/0,o=-1/0;for(let l=0,c=e.count;l<c;l++){const h=e.getX(l),u=e.getY(l),d=e.getZ(l);h<t&&(t=h),u<n&&(n=u),d<i&&(i=d),h>r&&(r=h),u>a&&(a=u),d>o&&(o=d)}return this.min.set(t,n,i),this.max.set(r,a,o),this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=wi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e){return this.makeEmpty(),this.expandByObject(e)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e){e.updateWorldMatrix(!1,!1);const t=e.geometry;t!==void 0&&(t.boundingBox===null&&t.computeBoundingBox(),Ns.copy(t.boundingBox),Ns.applyMatrix4(e.matrixWorld),this.union(Ns));const n=e.children;for(let i=0,r=n.length;i<r;i++)this.expandByObject(n[i]);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,wi),wi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Si),hr.subVectors(this.max,Si),In.subVectors(e.a,Si),Dn.subVectors(e.b,Si),Fn.subVectors(e.c,Si),tn.subVectors(Dn,In),nn.subVectors(Fn,Dn),Mn.subVectors(In,Fn);let t=[0,-tn.z,tn.y,0,-nn.z,nn.y,0,-Mn.z,Mn.y,tn.z,0,-tn.x,nn.z,0,-nn.x,Mn.z,0,-Mn.x,-tn.y,tn.x,0,-nn.y,nn.x,0,-Mn.y,Mn.x,0];return!Bs(t,In,Dn,Fn,hr)||(t=[1,0,0,0,1,0,0,0,1],!Bs(t,In,Dn,Fn,hr))?!1:(ur.crossVectors(tn,nn),t=[ur.x,ur.y,ur.z],Bs(t,In,Dn,Fn,hr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return wi.copy(e).clamp(this.min,this.max).sub(e).length()}getBoundingSphere(e){return this.getCenter(e.center),e.radius=this.getSize(wi).length()*.5,e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(qt[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),qt[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),qt[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),qt[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),qt[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),qt[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),qt[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),qt[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(qt),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}Dt.prototype.isBox3=!0;const qt=[new E,new E,new E,new E,new E,new E,new E,new E],wi=new E,Ns=new Dt,In=new E,Dn=new E,Fn=new E,tn=new E,nn=new E,Mn=new E,Si=new E,hr=new E,ur=new E,wn=new E;function Bs(s,e,t,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){wn.fromArray(s,r);const o=i.x*Math.abs(wn.x)+i.y*Math.abs(wn.y)+i.z*Math.abs(wn.z),l=e.dot(wn),c=t.dot(wn),h=n.dot(wn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Mf=new Dt,Yo=new E,zs=new E,Us=new E;class pi{constructor(e=new E,t=-1){this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Mf.setFromPoints(e).getCenter(n);let i=0;for(let r=0,a=e.length;r<a;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){Us.subVectors(e,this.center);const t=Us.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.add(Us.multiplyScalar(i/n)),this.radius+=i}return this}union(e){return zs.subVectors(e.center,this.center).normalize().multiplyScalar(e.radius),this.expandByPoint(Yo.copy(e.center).add(zs)),this.expandByPoint(Yo.copy(e.center).sub(zs)),this}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Xt=new E,Os=new E,dr=new E,rn=new E,Hs=new E,fr=new E,Gs=new E;class mi{constructor(e=new E,t=new E(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.direction).multiplyScalar(e).add(this.origin)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Xt)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.direction).multiplyScalar(n).add(this.origin)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Xt.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Xt.copy(this.direction).multiplyScalar(t).add(this.origin),Xt.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Os.copy(e).add(t).multiplyScalar(.5),dr.copy(t).sub(e).normalize(),rn.copy(this.origin).sub(Os);const r=e.distanceTo(t)*.5,a=-this.direction.dot(dr),o=rn.dot(this.direction),l=-rn.dot(dr),c=rn.lengthSq(),h=Math.abs(1-a*a);let u,d,f,m;if(h>0)if(u=a*l-o,d=a*o-l,m=r*h,u>=0)if(d>=-m)if(d<=m){const v=1/h;u*=v,d*=v,f=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d<=-m?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=m?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.direction).multiplyScalar(u).add(this.origin),i&&i.copy(dr).multiplyScalar(d).add(Os),f}intersectSphere(e,t){Xt.subVectors(e.center,this.origin);const n=Xt.dot(this.direction),i=Xt.dot(Xt)-n*n,r=e.radius*e.radius;if(i>r)return null;const a=Math.sqrt(r-i),o=n-a,l=n+a;return o<0&&l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,i=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,i=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||r>i||((r>n||n!==n)&&(n=r),(a<i||i!==i)&&(i=a),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,Xt)!==null}intersectTriangle(e,t,n,i,r){Hs.subVectors(t,e),fr.subVectors(n,e),Gs.crossVectors(Hs,fr);let a=this.direction.dot(Gs),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;rn.subVectors(this.origin,e);const l=o*this.direction.dot(fr.crossVectors(rn,fr));if(l<0)return null;const c=o*this.direction.dot(Hs.cross(rn));if(c<0||l+c>a)return null;const h=-o*rn.dot(Gs);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class be{constructor(){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],arguments.length>0&&console.error("THREE.Matrix4: the constructor no longer reads arguments. use .set() instead.")}set(e,t,n,i,r,a,o,l,c,h,u,d,f,m,v,x){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=i,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=m,p[11]=v,p[15]=x,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new be().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/Nn.setFromMatrixColumn(e,0).length(),r=1/Nn.setFromMatrixColumn(e,1).length(),a=1/Nn.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){e&&e.isEuler||console.error("THREE.Matrix4: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.");const t=this.elements,n=e.x,i=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const d=a*h,f=a*u,m=o*h,v=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+m*c,t[5]=d-v*c,t[9]=-o*l,t[2]=v-d*c,t[6]=m+f*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*h,f=l*u,m=c*h,v=c*u;t[0]=d+v*o,t[4]=m*o-f,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=f*o-m,t[6]=v+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*h,f=l*u,m=c*h,v=c*u;t[0]=d-v*o,t[4]=-a*u,t[8]=m+f*o,t[1]=f+m*o,t[5]=a*h,t[9]=v-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*h,f=a*u,m=o*h,v=o*u;t[0]=l*h,t[4]=m*c-f,t[8]=d*c+v,t[1]=l*u,t[5]=v*c+d,t[9]=f*c-m,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,f=a*c,m=o*l,v=o*c;t[0]=l*h,t[4]=v-d*u,t[8]=m*u+f,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=f*u+m,t[10]=d-v*u}else if(e.order==="XZY"){const d=a*l,f=a*c,m=o*l,v=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+v,t[5]=a*h,t[9]=f*u-m,t[2]=m*u-f,t[6]=o*h,t[10]=v*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(wf,e,Sf)}lookAt(e,t,n){const i=this.elements;return yt.subVectors(e,t),yt.lengthSq()===0&&(yt.z=1),yt.normalize(),sn.crossVectors(n,yt),sn.lengthSq()===0&&(Math.abs(n.z)===1?yt.x+=1e-4:yt.z+=1e-4,yt.normalize(),sn.crossVectors(n,yt)),sn.normalize(),pr.crossVectors(yt,sn),i[0]=sn.x,i[4]=pr.x,i[8]=yt.x,i[1]=sn.y,i[5]=pr.y,i[9]=yt.y,i[2]=sn.z,i[6]=pr.z,i[10]=yt.z,this}multiply(e,t){return t!==void 0?(console.warn("THREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead."),this.multiplyMatrices(e,t)):this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],m=n[2],v=n[6],x=n[10],p=n[14],g=n[3],w=n[7],M=n[11],T=n[15],L=i[0],_=i[4],F=i[8],W=i[12],C=i[1],A=i[5],V=i[9],P=i[13],N=i[2],O=i[6],B=i[10],I=i[14],q=i[3],$=i[7],ie=i[11],K=i[15];return r[0]=a*L+o*C+l*N+c*q,r[4]=a*_+o*A+l*O+c*$,r[8]=a*F+o*V+l*B+c*ie,r[12]=a*W+o*P+l*I+c*K,r[1]=h*L+u*C+d*N+f*q,r[5]=h*_+u*A+d*O+f*$,r[9]=h*F+u*V+d*B+f*ie,r[13]=h*W+u*P+d*I+f*K,r[2]=m*L+v*C+x*N+p*q,r[6]=m*_+v*A+x*O+p*$,r[10]=m*F+v*V+x*B+p*ie,r[14]=m*W+v*P+x*I+p*K,r[3]=g*L+w*C+M*N+T*q,r[7]=g*_+w*A+M*O+T*$,r[11]=g*F+w*V+M*B+T*ie,r[15]=g*W+w*P+M*I+T*K,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],m=e[3],v=e[7],x=e[11],p=e[15];return m*(+r*l*u-i*c*u-r*o*d+n*c*d+i*o*f-n*l*f)+v*(+t*l*f-t*c*d+r*a*d-i*a*f+i*c*h-r*l*h)+x*(+t*c*u-t*o*f-r*a*u+n*a*f+r*o*h-n*c*h)+p*(-i*o*h-t*l*u+t*o*d+i*a*u-n*a*d+n*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],m=e[12],v=e[13],x=e[14],p=e[15],g=u*x*c-v*d*c+v*l*f-o*x*f-u*l*p+o*d*p,w=m*d*c-h*x*c-m*l*f+a*x*f+h*l*p-a*d*p,M=h*v*c-m*u*c+m*o*f-a*v*f-h*o*p+a*u*p,T=m*u*l-h*v*l-m*o*d+a*v*d+h*o*x-a*u*x,L=t*g+n*w+i*M+r*T;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const _=1/L;return e[0]=g*_,e[1]=(v*d*r-u*x*r-v*i*f+n*x*f+u*i*p-n*d*p)*_,e[2]=(o*x*r-v*l*r+v*i*c-n*x*c-o*i*p+n*l*p)*_,e[3]=(u*l*r-o*d*r-u*i*c+n*d*c+o*i*f-n*l*f)*_,e[4]=w*_,e[5]=(h*x*r-m*d*r+m*i*f-t*x*f-h*i*p+t*d*p)*_,e[6]=(m*l*r-a*x*r-m*i*c+t*x*c+a*i*p-t*l*p)*_,e[7]=(a*d*r-h*l*r+h*i*c-t*d*c-a*i*f+t*l*f)*_,e[8]=M*_,e[9]=(m*u*r-h*v*r-m*n*f+t*v*f+h*n*p-t*u*p)*_,e[10]=(a*v*r-m*o*r+m*n*c-t*v*c-a*n*p+t*o*p)*_,e[11]=(h*o*r-a*u*r-h*n*c+t*u*c+a*n*f-t*o*f)*_,e[12]=T*_,e[13]=(h*v*i-m*u*i+m*n*d-t*v*d-h*n*x+t*u*x)*_,e[14]=(m*o*i-a*v*i-m*n*l+t*v*l+a*n*x-t*o*x)*_,e[15]=(a*u*i-h*o*i+h*n*l-t*u*l-a*n*d+t*o*d)*_,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*a,0,c*l-i*o,h*l+i*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,a){return this.set(1,n,r,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,u=o+o,d=r*c,f=r*h,m=r*u,v=a*h,x=a*u,p=o*u,g=l*c,w=l*h,M=l*u,T=n.x,L=n.y,_=n.z;return i[0]=(1-(v+p))*T,i[1]=(f+M)*T,i[2]=(m-w)*T,i[3]=0,i[4]=(f-M)*L,i[5]=(1-(d+p))*L,i[6]=(x+g)*L,i[7]=0,i[8]=(m+w)*_,i[9]=(x-g)*_,i[10]=(1-(d+v))*_,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let r=Nn.set(i[0],i[1],i[2]).length();const a=Nn.set(i[4],i[5],i[6]).length(),o=Nn.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],Ct.copy(this);const c=1/r,h=1/a,u=1/o;return Ct.elements[0]*=c,Ct.elements[1]*=c,Ct.elements[2]*=c,Ct.elements[4]*=h,Ct.elements[5]*=h,Ct.elements[6]*=h,Ct.elements[8]*=u,Ct.elements[9]*=u,Ct.elements[10]*=u,t.setFromRotationMatrix(Ct),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,i,r,a){a===void 0&&console.warn("THREE.Matrix4: .makePerspective() has been redefined and has a new signature. Please check the docs.");const o=this.elements,l=2*r/(t-e),c=2*r/(n-i),h=(t+e)/(t-e),u=(n+i)/(n-i),d=-(a+r)/(a-r),f=-2*a*r/(a-r);return o[0]=l,o[4]=0,o[8]=h,o[12]=0,o[1]=0,o[5]=c,o[9]=u,o[13]=0,o[2]=0,o[6]=0,o[10]=d,o[14]=f,o[3]=0,o[7]=0,o[11]=-1,o[15]=0,this}makeOrthographic(e,t,n,i,r,a){const o=this.elements,l=1/(t-e),c=1/(n-i),h=1/(a-r),u=(t+e)*l,d=(n+i)*c,f=(a+r)*h;return o[0]=2*l,o[4]=0,o[8]=0,o[12]=-u,o[1]=0,o[5]=2*c,o[9]=0,o[13]=-d,o[2]=0,o[6]=0,o[10]=-2*h,o[14]=-f,o[3]=0,o[7]=0,o[11]=0,o[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}be.prototype.isMatrix4=!0;const Nn=new E,Ct=new be,wf=new E(0,0,0),Sf=new E(1,1,1),sn=new E,pr=new E,yt=new E,Zo=new be,jo=new vt;class gi{constructor(e=0,t=0,n=0,i=gi.DefaultOrder){this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],a=i[4],o=i[8],l=i[1],c=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(Mt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Mt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Mt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Mt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Mt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Mt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Zo.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Zo,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return jo.setFromEuler(this),this.setFromQuaternion(jo,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}toVector3(e){return e?e.set(this._x,this._y,this._z):new E(this._x,this._y,this._z)}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}}gi.prototype.isEuler=!0;gi.DefaultOrder="XYZ";gi.RotationOrders=["XYZ","YZX","ZXY","XZY","YXZ","ZYX"];class Tf{constructor(){this.mask=1}set(e){this.mask=1<<e|0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}}let Ef=0;const Jo=new E,Bn=new vt,Yt=new be,mr=new E,Ti=new E,Af=new E,Lf=new vt,Qo=new E(1,0,0),$o=new E(0,1,0),Ko=new E(0,0,1),Cf={type:"added"},el={type:"removed"};class De extends Cn{constructor(){super(),Object.defineProperty(this,"id",{value:Ef++}),this.uuid=Ot(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=De.DefaultUp.clone();const e=new E,t=new gi,n=new vt,i=new E(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new be},normalMatrix:{value:new tt}}),this.matrix=new be,this.matrixWorld=new be,this.matrixAutoUpdate=De.DefaultMatrixAutoUpdate,this.matrixWorldNeedsUpdate=!1,this.layers=new Tf,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Bn.setFromAxisAngle(e,t),this.quaternion.multiply(Bn),this}rotateOnWorldAxis(e,t){return Bn.setFromAxisAngle(e,t),this.quaternion.premultiply(Bn),this}rotateX(e){return this.rotateOnAxis(Qo,e)}rotateY(e){return this.rotateOnAxis($o,e)}rotateZ(e){return this.rotateOnAxis(Ko,e)}translateOnAxis(e,t){return Jo.copy(e).applyQuaternion(this.quaternion),this.position.add(Jo.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Qo,e)}translateY(e){return this.translateOnAxis($o,e)}translateZ(e){return this.translateOnAxis(Ko,e)}localToWorld(e){return e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return e.applyMatrix4(Yt.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?mr.copy(e):mr.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Ti.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Yt.lookAt(Ti,mr,this.up):Yt.lookAt(mr,Ti,this.up),this.quaternion.setFromRotationMatrix(Yt),i&&(Yt.extractRotation(i.matrixWorld),Bn.setFromRotationMatrix(Yt),this.quaternion.premultiply(Bn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(Cf)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(el)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){for(let e=0;e<this.children.length;e++){const t=this.children[e];t.parent=null,t.dispatchEvent(el)}return this.children.length=0,this}attach(e){return this.updateWorldMatrix(!0,!1),Yt.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Yt.multiply(e.parent.matrixWorld)),e.applyMatrix4(Yt),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ti,e,Af),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ti,Lf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{}},n.metadata={version:4.5,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),JSON.stringify(this.userData)!=="{}"&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));i.material=o}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),f=a(e.animations);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f)}return n.object=i,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}De.DefaultUp=new E(0,1,0);De.DefaultMatrixAutoUpdate=!0;De.prototype.isObject3D=!0;const Rt=new E,Zt=new E,ks=new E,jt=new E,zn=new E,Un=new E,tl=new E,Vs=new E,Ws=new E,qs=new E;class qe{constructor(e=new E,t=new E,n=new E){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Rt.subVectors(e,t),i.cross(Rt);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){Rt.subVectors(i,t),Zt.subVectors(n,t),ks.subVectors(e,t);const a=Rt.dot(Rt),o=Rt.dot(Zt),l=Rt.dot(ks),c=Zt.dot(Zt),h=Zt.dot(ks),u=a*c-o*o;if(u===0)return r.set(-2,-1,-1);const d=1/u,f=(c*l-o*h)*d,m=(a*h-o*l)*d;return r.set(1-f-m,m,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,jt),jt.x>=0&&jt.y>=0&&jt.x+jt.y<=1}static getUV(e,t,n,i,r,a,o,l){return this.getBarycoord(e,t,n,i,jt),l.set(0,0),l.addScaledVector(r,jt.x),l.addScaledVector(a,jt.y),l.addScaledVector(o,jt.z),l}static isFrontFacing(e,t,n,i){return Rt.subVectors(n,t),Zt.subVectors(e,t),Rt.cross(Zt).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Rt.subVectors(this.c,this.b),Zt.subVectors(this.a,this.b),Rt.cross(Zt).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return qe.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return qe.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,n,i,r){return qe.getUV(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return qe.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return qe.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let a,o;zn.subVectors(i,n),Un.subVectors(r,n),Vs.subVectors(e,n);const l=zn.dot(Vs),c=Un.dot(Vs);if(l<=0&&c<=0)return t.copy(n);Ws.subVectors(e,i);const h=zn.dot(Ws),u=Un.dot(Ws);if(h>=0&&u<=h)return t.copy(i);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(zn,a);qs.subVectors(e,r);const f=zn.dot(qs),m=Un.dot(qs);if(m>=0&&f<=m)return t.copy(r);const v=f*c-l*m;if(v<=0&&c>=0&&m<=0)return o=c/(c-m),t.copy(n).addScaledVector(Un,o);const x=h*m-f*u;if(x<=0&&u-h>=0&&f-m>=0)return tl.subVectors(r,i),o=(u-h)/(u-h+(f-m)),t.copy(i).addScaledVector(tl,o);const p=1/(x+v+d);return a=v*p,o=d*p,t.copy(n).addScaledVector(zn,a).addScaledVector(Un,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}let Rf=0;class lt extends Cn{constructor(){super(),Object.defineProperty(this,"id",{value:Rf++}),this.uuid=Ot(),this.name="",this.type="Material",this.fog=!0,this.blending=Ui,this.side=Vi,this.vertexColors=!1,this.opacity=1,this.format=St,this.transparent=!1,this.blendSrc=ic,this.blendDst=rc,this.blendEquation=Qn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.depthFunc=va,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=vf,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Rs,this.stencilZFail=Rs,this.stencilZPass=Rs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn("THREE.Material: '"+t+"' parameter is undefined.");continue}if(t==="shading"){console.warn("THREE."+this.type+": .shading has been removed. Use the boolean .flatShading instead."),this.flatShading=n===nc;continue}const i=this[t];if(i===void 0){console.warn("THREE."+this.type+": '"+t+"' is not a property of this material.");continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.5,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheenTint&&this.sheenTint.isColor&&(n.sheenTint=this.sheenTint.getHex()),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularTint&&this.specularTint.isColor&&(n.specularTint=this.specularTint.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularTintMap&&this.specularTintMap.isTexture&&(n.specularTintMap=this.specularTintMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationTint!==void 0&&(n.attenuationTint=this.attenuationTint.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ui&&(n.blending=this.blending),this.side!==Vi&&(n.side=this.side),this.vertexColors&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.format!==St&&(n.format=this.format),this.transparent===!0&&(n.transparent=this.transparent),n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.stencilWrite=this.stencilWrite,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,this.rotation&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaToCoverage===!0&&(n.alphaToCoverage=this.alphaToCoverage),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=this.premultipliedAlpha),this.wireframe===!0&&(n.wireframe=this.wireframe),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=this.flatShading),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),JSON.stringify(this.userData)!=="{}"&&(n.userData=this.userData);function i(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=i(e.textures),a=i(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.fog=e.fog,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.format=e.format,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}lt.prototype.isMaterial=!0;const uc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Pt={h:0,s:0,l:0},gr={h:0,s:0,l:0};function Xs(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}function Ys(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Zs(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}class ve{constructor(e,t,n){return t===void 0&&n===void 0?this.set(e):this.setRGB(e,t,n)}set(e){return e&&e.isColor?this.copy(e):typeof e=="number"?this.setHex(e):typeof e=="string"&&this.setStyle(e),this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,this}setRGB(e,t,n){return this.r=e,this.g=t,this.b=n,this}setHSL(e,t,n){if(e=xf(e,1),t=Mt(t,0,1),n=Mt(n,0,1),t===0)this.r=this.g=this.b=n;else{const i=n<=.5?n*(1+t):n+t-n*t,r=2*n-i;this.r=Xs(r,i,e+1/3),this.g=Xs(r,i,e),this.b=Xs(r,i,e-1/3)}return this}setStyle(e){function t(i){i!==void 0&&parseFloat(i)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let n;if(n=/^((?:rgb|hsl)a?)\(([^\)]*)\)/.exec(e)){let i;const r=n[1],a=n[2];switch(r){case"rgb":case"rgba":if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return this.r=Math.min(255,parseInt(i[1],10))/255,this.g=Math.min(255,parseInt(i[2],10))/255,this.b=Math.min(255,parseInt(i[3],10))/255,t(i[4]),this;if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return this.r=Math.min(100,parseInt(i[1],10))/100,this.g=Math.min(100,parseInt(i[2],10))/100,this.b=Math.min(100,parseInt(i[3],10))/100,t(i[4]),this;break;case"hsl":case"hsla":if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a)){const o=parseFloat(i[1])/360,l=parseInt(i[2],10)/100,c=parseInt(i[3],10)/100;return t(i[4]),this.setHSL(o,l,c)}break}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(e)){const i=n[1],r=i.length;if(r===3)return this.r=parseInt(i.charAt(0)+i.charAt(0),16)/255,this.g=parseInt(i.charAt(1)+i.charAt(1),16)/255,this.b=parseInt(i.charAt(2)+i.charAt(2),16)/255,this;if(r===6)return this.r=parseInt(i.charAt(0)+i.charAt(1),16)/255,this.g=parseInt(i.charAt(2)+i.charAt(3),16)/255,this.b=parseInt(i.charAt(4)+i.charAt(5),16)/255,this}return e&&e.length>0?this.setColorName(e):this}setColorName(e){const t=uc[e.toLowerCase()];return t!==void 0?this.setHex(t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copyGammaToLinear(e,t=2){return this.r=Math.pow(e.r,t),this.g=Math.pow(e.g,t),this.b=Math.pow(e.b,t),this}copyLinearToGamma(e,t=2){const n=t>0?1/t:1;return this.r=Math.pow(e.r,n),this.g=Math.pow(e.g,n),this.b=Math.pow(e.b,n),this}convertGammaToLinear(e){return this.copyGammaToLinear(this,e),this}convertLinearToGamma(e){return this.copyLinearToGamma(this,e),this}copySRGBToLinear(e){return this.r=Ys(e.r),this.g=Ys(e.g),this.b=Ys(e.b),this}copyLinearToSRGB(e){return this.r=Zs(e.r),this.g=Zs(e.g),this.b=Zs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(){return this.r*255<<16^this.g*255<<8^this.b*255<<0}getHexString(){return("000000"+this.getHex().toString(16)).slice(-6)}getHSL(e){const t=this.r,n=this.g,i=this.b,r=Math.max(t,n,i),a=Math.min(t,n,i);let o,l;const c=(a+r)/2;if(a===r)o=0,l=0;else{const h=r-a;switch(l=c<=.5?h/(r+a):h/(2-r-a),r){case t:o=(n-i)/h+(n<i?6:0);break;case n:o=(i-t)/h+2;break;case i:o=(t-n)/h+4;break}o/=6}return e.h=o,e.s=l,e.l=c,e}getStyle(){return"rgb("+(this.r*255|0)+","+(this.g*255|0)+","+(this.b*255|0)+")"}offsetHSL(e,t,n){return this.getHSL(Pt),Pt.h+=e,Pt.s+=t,Pt.l+=n,this.setHSL(Pt.h,Pt.s,Pt.l),this}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Pt),e.getHSL(gr);const n=Is(Pt.h,gr.h,t),i=Is(Pt.s,gr.s,t),r=Is(Pt.l,gr.l,t);return this.setHSL(n,i,r),this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),e.normalized===!0&&(this.r/=255,this.g/=255,this.b/=255),this}toJSON(){return this.getHex()}}ve.NAMES=uc;ve.prototype.isColor=!0;ve.prototype.r=1;ve.prototype.g=1;ve.prototype.b=1;class Ua extends lt{constructor(e){super(),this.type="MeshBasicMaterial",this.color=new ve(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=ss,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this}}Ua.prototype.isMeshBasicMaterial=!0;const Ue=new E,vr=new te;class Ye{constructor(e,t,n){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n===!0,this.usage=qi,this.updateRange={offset:0,count:-1},this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}copyColorsArray(e){const t=this.array;let n=0;for(let i=0,r=e.length;i<r;i++){let a=e[i];a===void 0&&(console.warn("THREE.BufferAttribute.copyColorsArray(): color is undefined",i),a=new ve),t[n++]=a.r,t[n++]=a.g,t[n++]=a.b}return this}copyVector2sArray(e){const t=this.array;let n=0;for(let i=0,r=e.length;i<r;i++){let a=e[i];a===void 0&&(console.warn("THREE.BufferAttribute.copyVector2sArray(): vector is undefined",i),a=new te),t[n++]=a.x,t[n++]=a.y}return this}copyVector3sArray(e){const t=this.array;let n=0;for(let i=0,r=e.length;i<r;i++){let a=e[i];a===void 0&&(console.warn("THREE.BufferAttribute.copyVector3sArray(): vector is undefined",i),a=new E),t[n++]=a.x,t[n++]=a.y,t[n++]=a.z}return this}copyVector4sArray(e){const t=this.array;let n=0;for(let i=0,r=e.length;i<r;i++){let a=e[i];a===void 0&&(console.warn("THREE.BufferAttribute.copyVector4sArray(): vector is undefined",i),a=new ze),t[n++]=a.x,t[n++]=a.y,t[n++]=a.z,t[n++]=a.w}return this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)vr.fromBufferAttribute(this,t),vr.applyMatrix3(e),this.setXY(t,vr.x,vr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ue.fromBufferAttribute(this,t),Ue.applyMatrix3(e),this.setXYZ(t,Ue.x,Ue.y,Ue.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ue.x=this.getX(t),Ue.y=this.getY(t),Ue.z=this.getZ(t),Ue.applyMatrix4(e),this.setXYZ(t,Ue.x,Ue.y,Ue.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ue.x=this.getX(t),Ue.y=this.getY(t),Ue.z=this.getZ(t),Ue.applyNormalMatrix(e),this.setXYZ(t,Ue.x,Ue.y,Ue.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ue.x=this.getX(t),Ue.y=this.getY(t),Ue.z=this.getZ(t),Ue.transformDirection(e),this.setXYZ(t,Ue.x,Ue.y,Ue.z);return this}set(e,t=0){return this.array.set(e,t),this}getX(e){return this.array[e*this.itemSize]}setX(e,t){return this.array[e*this.itemSize]=t,this}getY(e){return this.array[e*this.itemSize+1]}setY(e,t){return this.array[e*this.itemSize+1]=t,this}getZ(e){return this.array[e*this.itemSize+2]}setZ(e,t){return this.array[e*this.itemSize+2]=t,this}getW(e){return this.array[e*this.itemSize+3]}setW(e,t){return this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.prototype.slice.call(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==qi&&(e.usage=this.usage),(this.updateRange.offset!==0||this.updateRange.count!==-1)&&(e.updateRange=this.updateRange),e}}Ye.prototype.isBufferAttribute=!0;class dc extends Ye{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class fc extends Ye{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Pf extends Ye{constructor(e,t,n){super(new Uint16Array(e),t,n)}}Pf.prototype.isFloat16BufferAttribute=!0;class Qe extends Ye{constructor(e,t,n){super(new Float32Array(e),t,n)}}function pc(s){if(s.length===0)return-1/0;let e=s[0];for(let t=1,n=s.length;t<n;++t)s[t]>e&&(e=s[t]);return e}let If=0;const Tt=new be,js=new De,On=new E,bt=new Dt,Ei=new Dt,je=new E;class Oe extends Cn{constructor(){super(),Object.defineProperty(this,"id",{value:If++}),this.uuid=Ot(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(pc(e)>65535?fc:dc)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new tt().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Tt.makeRotationFromQuaternion(e),this.applyMatrix4(Tt),this}rotateX(e){return Tt.makeRotationX(e),this.applyMatrix4(Tt),this}rotateY(e){return Tt.makeRotationY(e),this.applyMatrix4(Tt),this}rotateZ(e){return Tt.makeRotationZ(e),this.applyMatrix4(Tt),this}translate(e,t,n){return Tt.makeTranslation(e,t,n),this.applyMatrix4(Tt),this}scale(e,t,n){return Tt.makeScale(e,t,n),this.applyMatrix4(Tt),this}lookAt(e){return js.lookAt(e),js.updateMatrix(),this.applyMatrix4(js.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(On).negate(),this.translate(On.x,On.y,On.z),this}setFromPoints(e){const t=[];for(let n=0,i=e.length;n<i;n++){const r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new Qe(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Dt);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new E(-1/0,-1/0,-1/0),new E(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];bt.setFromBufferAttribute(r),this.morphTargetsRelative?(je.addVectors(this.boundingBox.min,bt.min),this.boundingBox.expandByPoint(je),je.addVectors(this.boundingBox.max,bt.max),this.boundingBox.expandByPoint(je)):(this.boundingBox.expandByPoint(bt.min),this.boundingBox.expandByPoint(bt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new pi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new E,1/0);return}if(e){const n=this.boundingSphere.center;if(bt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Ei.setFromBufferAttribute(o),this.morphTargetsRelative?(je.addVectors(bt.min,Ei.min),bt.expandByPoint(je),je.addVectors(bt.max,Ei.max),bt.expandByPoint(je)):(bt.expandByPoint(Ei.min),bt.expandByPoint(Ei.max))}bt.getCenter(n);let i=0;for(let r=0,a=e.count;r<a;r++)je.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(je));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)je.fromBufferAttribute(o,c),l&&(On.fromBufferAttribute(e,c),je.add(On)),i=Math.max(i,n.distanceToSquared(je))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.array,i=t.position.array,r=t.normal.array,a=t.uv.array,o=i.length/3;t.tangent===void 0&&this.setAttribute("tangent",new Ye(new Float32Array(4*o),4));const l=t.tangent.array,c=[],h=[];for(let C=0;C<o;C++)c[C]=new E,h[C]=new E;const u=new E,d=new E,f=new E,m=new te,v=new te,x=new te,p=new E,g=new E;function w(C,A,V){u.fromArray(i,C*3),d.fromArray(i,A*3),f.fromArray(i,V*3),m.fromArray(a,C*2),v.fromArray(a,A*2),x.fromArray(a,V*2),d.sub(u),f.sub(u),v.sub(m),x.sub(m);const P=1/(v.x*x.y-x.x*v.y);!isFinite(P)||(p.copy(d).multiplyScalar(x.y).addScaledVector(f,-v.y).multiplyScalar(P),g.copy(f).multiplyScalar(v.x).addScaledVector(d,-x.x).multiplyScalar(P),c[C].add(p),c[A].add(p),c[V].add(p),h[C].add(g),h[A].add(g),h[V].add(g))}let M=this.groups;M.length===0&&(M=[{start:0,count:n.length}]);for(let C=0,A=M.length;C<A;++C){const V=M[C],P=V.start,N=V.count;for(let O=P,B=P+N;O<B;O+=3)w(n[O+0],n[O+1],n[O+2])}const T=new E,L=new E,_=new E,F=new E;function W(C){_.fromArray(r,C*3),F.copy(_);const A=c[C];T.copy(A),T.sub(_.multiplyScalar(_.dot(A))).normalize(),L.crossVectors(F,A);const P=L.dot(h[C])<0?-1:1;l[C*4]=T.x,l[C*4+1]=T.y,l[C*4+2]=T.z,l[C*4+3]=P}for(let C=0,A=M.length;C<A;++C){const V=M[C],P=V.start,N=V.count;for(let O=P,B=P+N;O<B;O+=3)W(n[O+0]),W(n[O+1]),W(n[O+2])}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ye(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new E,r=new E,a=new E,o=new E,l=new E,c=new E,h=new E,u=new E;if(e)for(let d=0,f=e.count;d<f;d+=3){const m=e.getX(d+0),v=e.getX(d+1),x=e.getX(d+2);i.fromBufferAttribute(t,m),r.fromBufferAttribute(t,v),a.fromBufferAttribute(t,x),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),o.fromBufferAttribute(n,m),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,x),o.add(h),l.add(h),c.add(h),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(x,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)i.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}merge(e,t){if(!(e&&e.isBufferGeometry)){console.error("THREE.BufferGeometry.merge(): geometry not an instance of THREE.BufferGeometry.",e);return}t===void 0&&(t=0,console.warn("THREE.BufferGeometry.merge(): Overwriting original geometry, starting at offset=0. Use BufferGeometryUtils.mergeBufferGeometries() for lossless merge."));const n=this.attributes;for(const i in n){if(e.attributes[i]===void 0)continue;const a=n[i].array,o=e.attributes[i],l=o.array,c=o.itemSize*t,h=Math.min(l.length,a.length-c);for(let u=0,d=c;u<h;u++,d++)a[d]=l[u]}return this}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)je.fromBufferAttribute(e,t),je.normalize(),e.setXYZ(t,je.x,je.y,je.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h);let f=0,m=0;for(let v=0,x=l.length;v<x;v++){o.isInterleavedBufferAttribute?f=l[v]*o.data.stride+o.offset:f=l[v]*h;for(let p=0;p<h;p++)d[m++]=c[f++]}return new Ye(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Oe,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=e(d,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.5,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(i[l]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new Oe().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const i=e.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}Oe.prototype.isBufferGeometry=!0;const nl=new be,Hn=new mi,Js=new pi,an=new E,on=new E,ln=new E,Qs=new E,$s=new E,Ks=new E,xr=new E,_r=new E,yr=new E,br=new te,Mr=new te,wr=new te,ea=new E,Sr=new E;class dt extends De{constructor(e=new Oe,t=new Ua){super(),this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e){return super.copy(e),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=e.material,this.geometry=e.geometry,this}updateMorphTargets(){const e=this.geometry;if(e.isBufferGeometry){const t=e.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}else{const t=e.morphTargets;t!==void 0&&t.length>0&&console.error("THREE.Mesh.updateMorphTargets() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.")}}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;if(i===void 0||(n.boundingSphere===null&&n.computeBoundingSphere(),Js.copy(n.boundingSphere),Js.applyMatrix4(r),e.ray.intersectsSphere(Js)===!1)||(nl.copy(r).invert(),Hn.copy(e.ray).applyMatrix4(nl),n.boundingBox!==null&&Hn.intersectsBox(n.boundingBox)===!1))return;let a;if(n.isBufferGeometry){const o=n.index,l=n.attributes.position,c=n.morphAttributes.position,h=n.morphTargetsRelative,u=n.attributes.uv,d=n.attributes.uv2,f=n.groups,m=n.drawRange;if(o!==null)if(Array.isArray(i))for(let v=0,x=f.length;v<x;v++){const p=f[v],g=i[p.materialIndex],w=Math.max(p.start,m.start),M=Math.min(p.start+p.count,m.start+m.count);for(let T=w,L=M;T<L;T+=3){const _=o.getX(T),F=o.getX(T+1),W=o.getX(T+2);a=Tr(this,g,e,Hn,l,c,h,u,d,_,F,W),a&&(a.faceIndex=Math.floor(T/3),a.face.materialIndex=p.materialIndex,t.push(a))}}else{const v=Math.max(0,m.start),x=Math.min(o.count,m.start+m.count);for(let p=v,g=x;p<g;p+=3){const w=o.getX(p),M=o.getX(p+1),T=o.getX(p+2);a=Tr(this,i,e,Hn,l,c,h,u,d,w,M,T),a&&(a.faceIndex=Math.floor(p/3),t.push(a))}}else if(l!==void 0)if(Array.isArray(i))for(let v=0,x=f.length;v<x;v++){const p=f[v],g=i[p.materialIndex],w=Math.max(p.start,m.start),M=Math.min(p.start+p.count,m.start+m.count);for(let T=w,L=M;T<L;T+=3){const _=T,F=T+1,W=T+2;a=Tr(this,g,e,Hn,l,c,h,u,d,_,F,W),a&&(a.faceIndex=Math.floor(T/3),a.face.materialIndex=p.materialIndex,t.push(a))}}else{const v=Math.max(0,m.start),x=Math.min(l.count,m.start+m.count);for(let p=v,g=x;p<g;p+=3){const w=p,M=p+1,T=p+2;a=Tr(this,i,e,Hn,l,c,h,u,d,w,M,T),a&&(a.faceIndex=Math.floor(p/3),t.push(a))}}}else n.isGeometry&&console.error("THREE.Mesh.raycast() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.")}}dt.prototype.isMesh=!0;function Df(s,e,t,n,i,r,a,o){let l;if(e.side===Xe?l=n.intersectTriangle(a,r,i,!0,o):l=n.intersectTriangle(i,r,a,e.side!==oi,o),l===null)return null;Sr.copy(o),Sr.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(Sr);return c<t.near||c>t.far?null:{distance:c,point:Sr.clone(),object:s}}function Tr(s,e,t,n,i,r,a,o,l,c,h,u){an.fromBufferAttribute(i,c),on.fromBufferAttribute(i,h),ln.fromBufferAttribute(i,u);const d=s.morphTargetInfluences;if(r&&d){xr.set(0,0,0),_r.set(0,0,0),yr.set(0,0,0);for(let m=0,v=r.length;m<v;m++){const x=d[m],p=r[m];x!==0&&(Qs.fromBufferAttribute(p,c),$s.fromBufferAttribute(p,h),Ks.fromBufferAttribute(p,u),a?(xr.addScaledVector(Qs,x),_r.addScaledVector($s,x),yr.addScaledVector(Ks,x)):(xr.addScaledVector(Qs.sub(an),x),_r.addScaledVector($s.sub(on),x),yr.addScaledVector(Ks.sub(ln),x)))}an.add(xr),on.add(_r),ln.add(yr)}s.isSkinnedMesh&&(s.boneTransform(c,an),s.boneTransform(h,on),s.boneTransform(u,ln));const f=Df(s,e,t,n,an,on,ln,ea);if(f){o&&(br.fromBufferAttribute(o,c),Mr.fromBufferAttribute(o,h),wr.fromBufferAttribute(o,u),f.uv=qe.getUV(ea,an,on,ln,br,Mr,wr,new te)),l&&(br.fromBufferAttribute(l,c),Mr.fromBufferAttribute(l,h),wr.fromBufferAttribute(l,u),f.uv2=qe.getUV(ea,an,on,ln,br,Mr,wr,new te));const m={a:c,b:h,c:u,normal:new E,materialIndex:0};qe.getNormal(an,on,ln,m.normal),f.face=m}return f}class $i extends Oe{constructor(e=1,t=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};const o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],u=[];let d=0,f=0;m("z","y","x",-1,-1,n,t,e,a,r,0),m("z","y","x",1,-1,n,t,-e,a,r,1),m("x","z","y",1,1,e,n,t,i,a,2),m("x","z","y",1,-1,e,n,-t,i,a,3),m("x","y","z",1,-1,e,t,n,i,r,4),m("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new Qe(c,3)),this.setAttribute("normal",new Qe(h,3)),this.setAttribute("uv",new Qe(u,2));function m(v,x,p,g,w,M,T,L,_,F,W){const C=M/_,A=T/F,V=M/2,P=T/2,N=L/2,O=_+1,B=F+1;let I=0,q=0;const $=new E;for(let ie=0;ie<B;ie++){const K=ie*A-P;for(let de=0;de<O;de++){const X=de*C-V;$[v]=X*g,$[x]=K*w,$[p]=N,c.push($.x,$.y,$.z),$[v]=0,$[x]=0,$[p]=L>0?1:-1,h.push($.x,$.y,$.z),u.push(de/_),u.push(1-ie/F),I+=1}}for(let ie=0;ie<F;ie++)for(let K=0;K<_;K++){const de=d+K+O*ie,X=d+K+O*(ie+1),Q=d+(K+1)+O*(ie+1),oe=d+(K+1)+O*ie;l.push(de,X,oe),l.push(X,Q,oe),q+=6}o.addGroup(f,q,W),f+=q,d+=I}}static fromJSON(e){return new $i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function ci(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function at(s){const e={};for(let t=0;t<s.length;t++){const n=ci(s[t]);for(const i in n)e[i]=n[i]}return e}const Ff={clone:ci,merge:at};var Nf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Bf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ln extends lt{constructor(e){super(),this.type="ShaderMaterial",this.defines={},this.uniforms={},this.vertexShader=Nf,this.fragmentShader=Bf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv2:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&(e.attributes!==void 0&&console.error("THREE.ShaderMaterial: attributes should now be defined in THREE.BufferGeometry instead."),this.setValues(e))}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ci(e.uniforms),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}Ln.prototype.isShaderMaterial=!0;class Oa extends De{constructor(){super(),this.type="Camera",this.matrixWorldInverse=new be,this.projectionMatrix=new be,this.projectionMatrixInverse=new be}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(-t[8],-t[9],-t[10]).normalize()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}Oa.prototype.isCamera=!0;class ht extends Oa{constructor(e=50,t=1,n=.1,i=2e3){super(),this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Ma*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ps*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ma*2*Math.atan(Math.tan(Ps*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,n,i,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ps*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}ht.prototype.isPerspectiveCamera=!0;const Gn=90,kn=1;class Ha extends De{constructor(e,t,n){if(super(),this.type="CubeCamera",n.isWebGLCubeRenderTarget!==!0){console.error("THREE.CubeCamera: The constructor now expects an instance of WebGLCubeRenderTarget as third parameter.");return}this.renderTarget=n;const i=new ht(Gn,kn,e,t);i.layers=this.layers,i.up.set(0,-1,0),i.lookAt(new E(1,0,0)),this.add(i);const r=new ht(Gn,kn,e,t);r.layers=this.layers,r.up.set(0,-1,0),r.lookAt(new E(-1,0,0)),this.add(r);const a=new ht(Gn,kn,e,t);a.layers=this.layers,a.up.set(0,0,1),a.lookAt(new E(0,1,0)),this.add(a);const o=new ht(Gn,kn,e,t);o.layers=this.layers,o.up.set(0,0,-1),o.lookAt(new E(0,-1,0)),this.add(o);const l=new ht(Gn,kn,e,t);l.layers=this.layers,l.up.set(0,-1,0),l.lookAt(new E(0,0,1)),this.add(l);const c=new ht(Gn,kn,e,t);c.layers=this.layers,c.up.set(0,-1,0),c.lookAt(new E(0,0,-1)),this.add(c)}update(e,t){this.parent===null&&this.updateMatrixWorld();const n=this.renderTarget,[i,r,a,o,l,c]=this.children,h=e.xr.enabled,u=e.getRenderTarget();e.xr.enabled=!1;const d=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0),e.render(t,i),e.setRenderTarget(n,1),e.render(t,r),e.setRenderTarget(n,2),e.render(t,a),e.setRenderTarget(n,3),e.render(t,o),e.setRenderTarget(n,4),e.render(t,l),n.texture.generateMipmaps=d,e.setRenderTarget(n,5),e.render(t,c),e.setRenderTarget(u),e.xr.enabled=h}}class us extends nt{constructor(e,t,n,i,r,a,o,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:as,o=o!==void 0?o:un,super(e,t,n,i,r,a,o,l,c,h),this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}us.prototype.isCubeTexture=!0;class mc extends Ht{constructor(e,t,n){Number.isInteger(t)&&(console.warn("THREE.WebGLCubeRenderTarget: constructor signature is now WebGLCubeRenderTarget( size, options )"),t=n),super(e,e,t),t=t||{},this.texture=new us(void 0,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.encoding),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Et,this.texture._needsFlipEnvMap=!1}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.format=St,this.texture.encoding=t.encoding,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new $i(5,5,5),r=new Ln({name:"CubemapFromEquirect",uniforms:ci(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Xe,blending:hn});r.uniforms.tEquirect.value=t;const a=new dt(i,r),o=t.minFilter;return t.minFilter===cs&&(t.minFilter=Et),new Ha(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,i){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(r)}}mc.prototype.isWebGLCubeRenderTarget=!0;const ta=new E,zf=new E,Uf=new tt;class Jt{constructor(e=new E(1,0,0),t=0){this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=ta.subVectors(n,t).cross(zf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(this.normal).multiplyScalar(-this.distanceToPoint(e)).add(e)}intersectLine(e,t){const n=e.delta(ta),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(n).multiplyScalar(r).add(e.start)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Uf.getNormalMatrix(e),i=this.coplanarPoint(ta).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}Jt.prototype.isPlane=!0;const Vn=new pi,Er=new E;class ds{constructor(e=new Jt,t=new Jt,n=new Jt,i=new Jt,r=new Jt,a=new Jt){this.planes=[e,t,n,i,r,a]}set(e,t,n,i,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e){const t=this.planes,n=e.elements,i=n[0],r=n[1],a=n[2],o=n[3],l=n[4],c=n[5],h=n[6],u=n[7],d=n[8],f=n[9],m=n[10],v=n[11],x=n[12],p=n[13],g=n[14],w=n[15];return t[0].setComponents(o-i,u-l,v-d,w-x).normalize(),t[1].setComponents(o+i,u+l,v+d,w+x).normalize(),t[2].setComponents(o+r,u+c,v+f,w+p).normalize(),t[3].setComponents(o-r,u-c,v-f,w-p).normalize(),t[4].setComponents(o-a,u-h,v-m,w-g).normalize(),t[5].setComponents(o+a,u+h,v+m,w+g).normalize(),this}intersectsObject(e){const t=e.geometry;return t.boundingSphere===null&&t.computeBoundingSphere(),Vn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld),this.intersectsSphere(Vn)}intersectsSprite(e){return Vn.center.set(0,0,0),Vn.radius=.7071067811865476,Vn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Vn)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Er.x=i.normal.x>0?e.max.x:e.min.x,Er.y=i.normal.y>0?e.max.y:e.min.y,Er.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Er)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function gc(){let s=null,e=!1,t=null,n=null;function i(r,a){t(r,a),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function Of(s,e){const t=e.isWebGL2,n=new WeakMap;function i(c,h){const u=c.array,d=c.usage,f=s.createBuffer();s.bindBuffer(h,f),s.bufferData(h,u,d),c.onUploadCallback();let m=5126;return u instanceof Float32Array?m=5126:u instanceof Float64Array?console.warn("THREE.WebGLAttributes: Unsupported data buffer format: Float64Array."):u instanceof Uint16Array?c.isFloat16BufferAttribute?t?m=5131:console.warn("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2."):m=5123:u instanceof Int16Array?m=5122:u instanceof Uint32Array?m=5125:u instanceof Int32Array?m=5124:u instanceof Int8Array?m=5120:(u instanceof Uint8Array||u instanceof Uint8ClampedArray)&&(m=5121),{buffer:f,type:m,bytesPerElement:u.BYTES_PER_ELEMENT,version:c.version}}function r(c,h,u){const d=h.array,f=h.updateRange;s.bindBuffer(u,c),f.count===-1?s.bufferSubData(u,0,d):(t?s.bufferSubData(u,f.offset*d.BYTES_PER_ELEMENT,d,f.offset,f.count):s.bufferSubData(u,f.offset*d.BYTES_PER_ELEMENT,d.subarray(f.offset,f.offset+f.count)),f.count=-1)}function a(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function o(c){c.isInterleavedBufferAttribute&&(c=c.data);const h=n.get(c);h&&(s.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){const d=n.get(c);(!d||d.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const u=n.get(c);u===void 0?n.set(c,i(c,h)):u.version<c.version&&(r(u.buffer,c,h),u.version=c.version)}return{get:a,remove:o,update:l}}class Ga extends Oe{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,u=e/o,d=t/l,f=[],m=[],v=[],x=[];for(let p=0;p<h;p++){const g=p*d-a;for(let w=0;w<c;w++){const M=w*u-r;m.push(M,-g,0),v.push(0,0,1),x.push(w/o),x.push(1-p/l)}}for(let p=0;p<l;p++)for(let g=0;g<o;g++){const w=g+c*p,M=g+c*(p+1),T=g+1+c*(p+1),L=g+1+c*p;f.push(w,M,L),f.push(M,T,L)}this.setIndex(f),this.setAttribute("position",new Qe(m,3)),this.setAttribute("normal",new Qe(v,3)),this.setAttribute("uv",new Qe(x,2))}static fromJSON(e){return new Ga(e.width,e.height,e.widthSegments,e.heightSegments)}}var Hf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vUv ).g;
#endif`,Gf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,kf=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Vf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Wf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vUv2 ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,qf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Xf="vec3 transformed = vec3( position );",Yf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Zf=`vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
vec3 BRDF_GGX( const in IncidentLight incidentLight, const in vec3 viewDir, const in vec3 normal, const in vec3 f0, const in float f90, const in float roughness ) {
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( incidentLight.direction + viewDir );
	float dotNL = saturate( dot( normal, incidentLight.direction ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
	float D = D_GGX( alpha, dotNH );
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in IncidentLight incidentLight, const in GeometricContext geometry, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( incidentLight.direction + geometry.viewDir );
	float dotNH = saturate( dot( geometry.normal, halfDir ) );
	float dotVH = saturate( dot( geometry.viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float NoH ) {
	float invAlpha = 1.0 / roughness;
	float cos2h = NoH * NoH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float NoV, float NoL ) {
	return saturate( 1.0 / ( 4.0 * ( NoL + NoV - NoL * NoV ) ) );
}
vec3 BRDF_Sheen( const in float roughness, const in vec3 L, const in GeometricContext geometry, vec3 specularColor ) {
	vec3 N = geometry.normal;
	vec3 V = geometry.viewDir;
	vec3 H = normalize( V + L );
	float dotNH = saturate( dot( N, H ) );
	return specularColor * D_Charlie( roughness, dotNH ) * V_Neubelt( dot(N, V), dot(N, L) );
}
#endif`,jf=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vUv );
		vec2 dSTdy = dFdy( vUv );
		float Hll = bumpScale * texture2D( bumpMap, vUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = vec3( dFdx( surf_pos.x ), dFdx( surf_pos.y ), dFdx( surf_pos.z ) );
		vec3 vSigmaY = vec3( dFdy( surf_pos.x ), dFdy( surf_pos.y ), dFdy( surf_pos.z ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Jf=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,Qf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,$f=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Kf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ep=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,tp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,np=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,ip=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,rp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 color ) { return dot( color, vec3( 0.3333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal;
#endif
};
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float linearToRelativeLuminance( const in vec3 color ) {
	vec3 weights = vec3( 0.2126, 0.7152, 0.0722 );
	return dot( weights, color.rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}`,sp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_maxMipLevel 8.0
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_maxTileSize 256.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		float texelSize = 1.0 / ( 3.0 * cubeUV_maxTileSize );
		vec2 uv = getUV( direction, face ) * ( faceSize - 1.0 );
		vec2 f = fract( uv );
		uv += 0.5 - f;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		if ( mipInt < cubeUV_maxMipLevel ) {
			uv.y += 2.0 * cubeUV_maxTileSize;
		}
		uv.y += filterInt * 2.0 * cubeUV_minTileSize;
		uv.x += 3.0 * max( 0.0, cubeUV_maxTileSize - 2.0 * faceSize );
		uv *= texelSize;
		vec3 tl = envMapTexelToLinear( texture2D( envMap, uv ) ).rgb;
		uv.x += texelSize;
		vec3 tr = envMapTexelToLinear( texture2D( envMap, uv ) ).rgb;
		uv.y += texelSize;
		vec3 br = envMapTexelToLinear( texture2D( envMap, uv ) ).rgb;
		uv.x -= texelSize;
		vec3 bl = envMapTexelToLinear( texture2D( envMap, uv ) ).rgb;
		vec3 tm = mix( tl, tr, f.x );
		vec3 bm = mix( bl, br, f.x );
		return mix( tm, bm, f.y );
	}
	#define r0 1.0
	#define v0 0.339
	#define m0 - 2.0
	#define r1 0.8
	#define v1 0.276
	#define m1 - 1.0
	#define r4 0.4
	#define v4 0.046
	#define m4 2.0
	#define r5 0.305
	#define v5 0.016
	#define m5 3.0
	#define r6 0.21
	#define v6 0.0038
	#define m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= r1 ) {
			mip = ( r0 - roughness ) * ( m1 - m0 ) / ( r0 - r1 ) + m0;
		} else if ( roughness >= r4 ) {
			mip = ( r1 - roughness ) * ( m4 - m1 ) / ( r1 - r4 ) + m1;
		} else if ( roughness >= r5 ) {
			mip = ( r4 - roughness ) * ( m5 - m4 ) / ( r4 - r5 ) + m4;
		} else if ( roughness >= r6 ) {
			mip = ( r5 - roughness ) * ( m6 - m5 ) / ( r5 - r6 ) + m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), m0, cubeUV_maxMipLevel );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,ap=`vec3 transformedNormal = objectNormal;
#ifdef USE_INSTANCING
	mat3 m = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( m[ 0 ], m[ 0 ] ), dot( m[ 1 ], m[ 1 ] ), dot( m[ 2 ], m[ 2 ] ) );
	transformedNormal = m * transformedNormal;
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	vec3 transformedTangent = ( modelViewMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,op=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,lp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vUv ).x * displacementScale + displacementBias );
#endif`,cp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vUv );
	emissiveColor.rgb = emissiveMapTexelToLinear( emissiveColor ).rgb;
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,hp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,up="gl_FragColor = linearToOutputTexel( gl_FragColor );",dp=`
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 GammaToLinear( in vec4 value, in float gammaFactor ) {
	return vec4( pow( value.rgb, vec3( gammaFactor ) ), value.a );
}
vec4 LinearToGamma( in vec4 value, in float gammaFactor ) {
	return vec4( pow( value.rgb, vec3( 1.0 / gammaFactor ) ), value.a );
}
vec4 sRGBToLinear( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 LinearTosRGB( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 RGBEToLinear( in vec4 value ) {
	return vec4( value.rgb * exp2( value.a * 255.0 - 128.0 ), 1.0 );
}
vec4 LinearToRGBE( in vec4 value ) {
	float maxComponent = max( max( value.r, value.g ), value.b );
	float fExp = clamp( ceil( log2( maxComponent ) ), -128.0, 127.0 );
	return vec4( value.rgb / exp2( fExp ), ( fExp + 128.0 ) / 255.0 );
}
vec4 RGBMToLinear( in vec4 value, in float maxRange ) {
	return vec4( value.rgb * value.a * maxRange, 1.0 );
}
vec4 LinearToRGBM( in vec4 value, in float maxRange ) {
	float maxRGB = max( value.r, max( value.g, value.b ) );
	float M = clamp( maxRGB / maxRange, 0.0, 1.0 );
	M = ceil( M * 255.0 ) / 255.0;
	return vec4( value.rgb / ( M * maxRange ), M );
}
vec4 RGBDToLinear( in vec4 value, in float maxRange ) {
	return vec4( value.rgb * ( ( maxRange / 255.0 ) / value.a ), 1.0 );
}
vec4 LinearToRGBD( in vec4 value, in float maxRange ) {
	float maxRGB = max( value.r, max( value.g, value.b ) );
	float D = max( maxRange / maxRGB, 1.0 );
	D = clamp( floor( D ) / 255.0, 0.0, 1.0 );
	return vec4( value.rgb * ( D * ( 255.0 / maxRange ) ), D );
}
const mat3 cLogLuvM = mat3( 0.2209, 0.3390, 0.4184, 0.1138, 0.6780, 0.7319, 0.0102, 0.1130, 0.2969 );
vec4 LinearToLogLuv( in vec4 value ) {
	vec3 Xp_Y_XYZp = cLogLuvM * value.rgb;
	Xp_Y_XYZp = max( Xp_Y_XYZp, vec3( 1e-6, 1e-6, 1e-6 ) );
	vec4 vResult;
	vResult.xy = Xp_Y_XYZp.xy / Xp_Y_XYZp.z;
	float Le = 2.0 * log2(Xp_Y_XYZp.y) + 127.0;
	vResult.w = fract( Le );
	vResult.z = ( Le - ( floor( vResult.w * 255.0 ) ) / 255.0 ) / 255.0;
	return vResult;
}
const mat3 cLogLuvInverseM = mat3( 6.0014, -2.7008, -1.7996, -1.3320, 3.1029, -5.7721, 0.3008, -1.0882, 5.6268 );
vec4 LogLuvToLinear( in vec4 value ) {
	float Le = value.z * 255.0 + value.w;
	vec3 Xp_Y_XYZp;
	Xp_Y_XYZp.y = exp2( ( Le - 127.0 ) / 2.0 );
	Xp_Y_XYZp.z = Xp_Y_XYZp.y / value.y;
	Xp_Y_XYZp.x = value.x * Xp_Y_XYZp.z;
	vec3 vRGB = cLogLuvInverseM * Xp_Y_XYZp.rgb;
	return vec4( max( vRGB, 0.0 ), 1.0 );
}`,fp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
		envColor = envMapTexelToLinear( envColor );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 envColor = textureCubeUV( envMap, reflectVec, 0.0 );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,pp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform int maxMipLevel;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,mp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,gp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) ||defined( PHONG )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,vp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,xp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,_p=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,yp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,bp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Mp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return texture2D( gradientMap, coord ).rgb;
	#else
		return ( coord.x < 0.7 ) ? vec3( 0.7 ) : vec3( 1.0 );
	#endif
}`,wp=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vUv2 );
	vec3 lightMapIrradiance = lightMapTexelToLinear( lightMapTexel ).rgb * lightMapIntensity;
	#ifndef PHYSICALLY_CORRECT_LIGHTS
		lightMapIrradiance *= PI;
	#endif
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Sp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Tp=`vec3 diffuse = vec3( 1.0 );
GeometricContext geometry;
geometry.position = mvPosition.xyz;
geometry.normal = normalize( transformedNormal );
geometry.viewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( -mvPosition.xyz );
GeometricContext backGeometry;
backGeometry.position = geometry.position;
backGeometry.normal = -geometry.normal;
backGeometry.viewDir = geometry.viewDir;
vLightFront = vec3( 0.0 );
vIndirectFront = vec3( 0.0 );
#ifdef DOUBLE_SIDED
	vLightBack = vec3( 0.0 );
	vIndirectBack = vec3( 0.0 );
#endif
IncidentLight directLight;
float dotNL;
vec3 directLightColor_Diffuse;
vIndirectFront += getAmbientLightIrradiance( ambientLightColor );
vIndirectFront += getLightProbeIrradiance( lightProbe, geometry );
#ifdef DOUBLE_SIDED
	vIndirectBack += getAmbientLightIrradiance( ambientLightColor );
	vIndirectBack += getLightProbeIrradiance( lightProbe, backGeometry );
#endif
#if NUM_POINT_LIGHTS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		getPointLightInfo( pointLights[ i ], geometry, directLight );
		dotNL = dot( geometry.normal, directLight.direction );
		directLightColor_Diffuse = directLight.color;
		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;
		#ifdef DOUBLE_SIDED
			vLightBack += saturate( - dotNL ) * directLightColor_Diffuse;
		#endif
	}
	#pragma unroll_loop_end
#endif
#if NUM_SPOT_LIGHTS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		getSpotLightInfo( spotLights[ i ], geometry, directLight );
		dotNL = dot( geometry.normal, directLight.direction );
		directLightColor_Diffuse = directLight.color;
		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;
		#ifdef DOUBLE_SIDED
			vLightBack += saturate( - dotNL ) * directLightColor_Diffuse;
		#endif
	}
	#pragma unroll_loop_end
#endif
#if NUM_DIR_LIGHTS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		getDirectionalLightInfo( directionalLights[ i ], geometry, directLight );
		dotNL = dot( geometry.normal, directLight.direction );
		directLightColor_Diffuse = directLight.color;
		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;
		#ifdef DOUBLE_SIDED
			vLightBack += saturate( - dotNL ) * directLightColor_Diffuse;
		#endif
	}
	#pragma unroll_loop_end
#endif
#if NUM_HEMI_LIGHTS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
		vIndirectFront += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );
		#ifdef DOUBLE_SIDED
			vIndirectBack += getHemisphereLightIrradiance( hemisphereLights[ i ], backGeometry );
		#endif
	}
	#pragma unroll_loop_end
#endif`,Ep=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
uniform vec3 lightProbe[ 9 ];
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in GeometricContext geometry ) {
	vec3 worldNormal = inverseTransformDirection( geometry.normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( PHYSICALLY_CORRECT_LIGHTS )
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#else
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, const in GeometricContext geometry, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in GeometricContext geometry, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometry.position;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in GeometricContext geometry, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometry.position;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in GeometricContext geometry ) {
		float dotNL = dot( geometry.normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Ap=`#if defined( USE_ENVMAP )
	#ifdef ENVMAP_MODE_REFRACTION
		uniform float refractionRatio;
	#endif
	vec3 getIBLIrradiance( const in GeometricContext geometry ) {
		#if defined( ENVMAP_TYPE_CUBE_UV )
			vec3 worldNormal = inverseTransformDirection( geometry.normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#if defined( ENVMAP_TYPE_CUBE_UV )
			vec3 reflectVec;
			#ifdef ENVMAP_MODE_REFLECTION
				reflectVec = reflect( - viewDir, normal );
				reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			#else
				reflectVec = refract( - viewDir, normal, refractionRatio );
			#endif
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
#endif`,Lp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Cp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in GeometricContext geometry, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometry.normal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in GeometricContext geometry, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon
#define Material_LightProbeLOD( material )	(0)`,Rp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Pp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight, geometry, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong
#define Material_LightProbeLOD( material )	(0)`,Ip=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( geometryNormal ) ), abs( dFdy( geometryNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	#ifdef SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularTintFactor = specularTint;
		#ifdef USE_SPECULARINTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vUv ).a;
		#endif
		#ifdef USE_SPECULARTINTMAP
			specularTintFactor *= specularTintMapTexelToLinear( texture2D( specularTintMap, vUv ) ).rgb;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularTintFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( ior - 1.0 ) / ( ior + 1.0 ) ) * specularTintFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_SHEEN
	material.sheenTint = sheenTint;
#endif`,Dp=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenTint;
	#endif
};
vec3 clearcoatSpecular = vec3( 0.0 );
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	vec3 FssEss = specularColor * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = specularColor + ( 1.0 - specularColor ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometry.normal;
		vec3 viewDir = geometry.viewDir;
		vec3 position = geometry.position;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometry.clearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecular += ccIrradiance * BRDF_GGX( directLight, geometry.viewDir, geometry.clearcoatNormal, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		reflectedLight.directSpecular += irradiance * BRDF_Sheen( material.roughness, directLight.direction, geometry, material.sheenTint );
	#else
		reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight, geometry.viewDir, geometry.normal, material.specularColor, material.specularF90, material.roughness );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecular += clearcoatRadiance * EnvironmentBRDF( geometry.clearcoatNormal, geometry.viewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	computeMultiscattering( geometry.normal, geometry.viewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	vec3 diffuse = material.diffuseColor * ( 1.0 - ( singleScattering + multiScattering ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Fp=`
GeometricContext geometry;
geometry.position = - vViewPosition;
geometry.normal = normal;
geometry.viewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
#ifdef USE_CLEARCOAT
	geometry.clearcoatNormal = clearcoatNormal;
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometry, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= all( bvec2( directLight.visible, receiveShadow ) ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometry, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, geometry, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	irradiance += getLightProbeIrradiance( lightProbe, geometry );
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Np=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vUv2 );
		vec3 lightMapIrradiance = lightMapTexelToLinear( lightMapTexel ).rgb * lightMapIntensity;
		#ifndef PHYSICALLY_CORRECT_LIGHTS
			lightMapIrradiance *= PI;
		#endif
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometry );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	radiance += getIBLRadiance( geometry.viewDir, geometry.normal, material.roughness );
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometry.viewDir, geometry.clearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Bp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometry, material, reflectedLight );
#endif`,zp=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Up=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Op=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Hp=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Gp=`#ifdef USE_MAP
	vec4 texelColor = texture2D( map, vUv );
	texelColor = mapTexelToLinear( texelColor );
	diffuseColor *= texelColor;
#endif`,kp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Vp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
#endif
#ifdef USE_MAP
	vec4 mapTexel = texture2D( map, uv );
	diffuseColor *= mapTexelToLinear( mapTexel );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Wp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	uniform mat3 uvTransform;
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,qp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Xp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Yp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
	objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
	objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
	objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
#endif`,Zp=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifndef USE_MORPHNORMALS
		uniform float morphTargetInfluences[ 8 ];
	#else
		uniform float morphTargetInfluences[ 4 ];
	#endif
#endif`,jp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	transformed += morphTarget0 * morphTargetInfluences[ 0 ];
	transformed += morphTarget1 * morphTargetInfluences[ 1 ];
	transformed += morphTarget2 * morphTargetInfluences[ 2 ];
	transformed += morphTarget3 * morphTargetInfluences[ 3 ];
	#ifndef USE_MORPHNORMALS
		transformed += morphTarget4 * morphTargetInfluences[ 4 ];
		transformed += morphTarget5 * morphTargetInfluences[ 5 ];
		transformed += morphTarget6 * morphTargetInfluences[ 6 ];
		transformed += morphTarget7 * morphTargetInfluences[ 7 ];
	#endif
#endif`,Jp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = vec3( dFdx( vViewPosition.x ), dFdx( vViewPosition.y ), dFdx( vViewPosition.z ) );
	vec3 fdy = vec3( dFdy( vViewPosition.x ), dFdy( vViewPosition.y ), dFdy( vViewPosition.z ) );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	#ifdef USE_TANGENT
		vec3 tangent = normalize( vTangent );
		vec3 bitangent = normalize( vBitangent );
		#ifdef DOUBLE_SIDED
			tangent = tangent * faceDirection;
			bitangent = bitangent * faceDirection;
		#endif
		#if defined( TANGENTSPACE_NORMALMAP ) || defined( USE_CLEARCOAT_NORMALMAP )
			mat3 vTBN = mat3( tangent, bitangent, normal );
		#endif
	#endif
#endif
vec3 geometryNormal = normal;`,Qp=`#ifdef OBJECTSPACE_NORMALMAP
	normal = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( TANGENTSPACE_NORMALMAP )
	vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	#ifdef USE_TANGENT
		normal = normalize( vTBN * mapN );
	#else
		normal = perturbNormal2Arb( - vViewPosition, normal, mapN, faceDirection );
	#endif
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,$p=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Kp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,em=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,tm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef OBJECTSPACE_NORMALMAP
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( TANGENTSPACE_NORMALMAP ) || defined ( USE_CLEARCOAT_NORMALMAP ) )
	vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm, vec3 mapN, float faceDirection ) {
		vec3 q0 = vec3( dFdx( eye_pos.x ), dFdx( eye_pos.y ), dFdx( eye_pos.z ) );
		vec3 q1 = vec3( dFdy( eye_pos.x ), dFdy( eye_pos.y ), dFdy( eye_pos.z ) );
		vec2 st0 = dFdx( vUv.st );
		vec2 st1 = dFdy( vUv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : faceDirection * inversesqrt( det );
		return normalize( T * ( mapN.x * scale ) + B * ( mapN.y * scale ) + N * mapN.z );
	}
#endif`,nm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = geometryNormal;
#endif`,im=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	#ifdef USE_TANGENT
		clearcoatNormal = normalize( vTBN * clearcoatMapN );
	#else
		clearcoatNormal = perturbNormal2Arb( - vViewPosition, clearcoatNormal, clearcoatMapN, faceDirection );
	#endif
#endif`,rm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif`,sm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= transmissionAlpha + 0.1;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,am=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float linearClipZ, const in float near, const in float far ) {
	return linearClipZ * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * invClipZ - far );
}`,om=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,lm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,cm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,hm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,um=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vUv );
	roughnessFactor *= texelRoughness.g;
#endif`,dm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,fm=`#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		varying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );
		bool inFrustum = all( inFrustumVec );
		bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );
		bool frustumTest = all( frustumTestVec );
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ), 
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ), 
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ), 
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ), 
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ), 
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ), 
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,pm=`#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform mat4 spotShadowMatrix[ NUM_SPOT_LIGHT_SHADOWS ];
		varying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,mm=`#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SPOT_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0
		vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		vec4 shadowWorldPosition;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
		vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias, 0 );
		vSpotShadowCoord[ i ] = spotShadowMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
		vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
	#endif
#endif`,gm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,vm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,xm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	#ifdef BONE_TEXTURE
		uniform highp sampler2D boneTexture;
		uniform int boneTextureSize;
		mat4 getBoneMatrix( const in float i ) {
			float j = i * 4.0;
			float x = mod( j, float( boneTextureSize ) );
			float y = floor( j / float( boneTextureSize ) );
			float dx = 1.0 / float( boneTextureSize );
			float dy = 1.0 / float( boneTextureSize );
			y = dy * ( y + 0.5 );
			vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );
			vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );
			vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );
			vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );
			mat4 bone = mat4( v1, v2, v3, v4 );
			return bone;
		}
	#else
		uniform mat4 boneMatrices[ MAX_BONES ];
		mat4 getBoneMatrix( const in float i ) {
			mat4 bone = boneMatrices[ int(i) ];
			return bone;
		}
	#endif
#endif`,_m=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ym=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,bm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Mm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,wm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Sm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return toneMappingExposure * color;
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Tm=`#ifdef USE_TRANSMISSION
	float transmissionAlpha = 1.0;
	float transmissionFactor = transmission;
	float thicknessFactor = thickness;
	#ifdef USE_TRANSMISSIONMAP
		transmissionFactor *= texture2D( transmissionMap, vUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		thicknessFactor *= texture2D( thicknessMap, vUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmission = getIBLVolumeRefraction(
		n, v, roughnessFactor, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, ior, thicknessFactor,
		attenuationTint, attenuationDistance );
	totalDiffuse = mix( totalDiffuse, transmission.rgb, transmissionFactor );
	transmissionAlpha = transmission.a;
#endif`,Em=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationTint;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	vec3 getVolumeTransmissionRay( vec3 n, vec3 v, float thickness, float ior, mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( float roughness, float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( vec2 fragCoord, float roughness, float ior ) {
		float framebufferLod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		#ifdef TEXTURE_LOD_EXT
			return texture2DLodEXT( transmissionSamplerMap, fragCoord.xy, framebufferLod );
		#else
			return texture2D( transmissionSamplerMap, fragCoord.xy, framebufferLod );
		#endif
	}
	vec3 applyVolumeAttenuation( vec3 radiance, float transmissionDistance, vec3 attenuationColor, float attenuationDistance ) {
		if ( attenuationDistance == 0.0 ) {
			return radiance;
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance * radiance;
		}
	}
	vec4 getIBLVolumeRefraction( vec3 n, vec3 v, float roughness, vec3 diffuseColor, vec3 specularColor, float specularF90,
		vec3 position, mat4 modelMatrix, mat4 viewMatrix, mat4 projMatrix, float ior, float thickness,
		vec3 attenuationColor, float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 attenuatedColor = applyVolumeAttenuation( transmittedLight.rgb, length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		return vec4( ( 1.0 - F ) * attenuatedColor * diffuseColor, transmittedLight.a );
	}
#endif`,Am=`#if ( defined( USE_UV ) && ! defined( UVS_VERTEX_ONLY ) )
	varying vec2 vUv;
#endif`,Lm=`#ifdef USE_UV
	#ifdef UVS_VERTEX_ONLY
		vec2 vUv;
	#else
		varying vec2 vUv;
	#endif
	uniform mat3 uvTransform;
#endif`,Cm=`#ifdef USE_UV
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
#endif`,Rm=`#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	varying vec2 vUv2;
#endif`,Pm=`#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	attribute vec2 uv2;
	varying vec2 vUv2;
	uniform mat3 uv2Transform;
#endif`,Im=`#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	vUv2 = ( uv2Transform * vec3( uv2, 1 ) ).xy;
#endif`,Dm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION )
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Fm=`uniform sampler2D t2D;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	gl_FragColor = mapTexelToLinear( texColor );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,Nm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Bm=`#include <envmap_common_pars_fragment>
uniform float opacity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	vec3 vReflect = vWorldDirection;
	#include <envmap_fragment>
	gl_FragColor = envColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,zm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Um=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,Om=`#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Hm=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Gm=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,km=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	vec4 texColor = texture2D( tEquirect, sampleUV );
	gl_FragColor = mapTexelToLinear( texColor );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,Vm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Wm=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,qm=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <color_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Xm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel= texture2D( lightMap, vUv2 );
		reflectedLight.indirectDiffuse += lightMapTexelToLinear( lightMapTexel ).rgb * lightMapIntensity;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ym=`#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Zm=`uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
varying vec3 vLightFront;
varying vec3 vIndirectFront;
#ifdef DOUBLE_SIDED
	varying vec3 vLightBack;
	varying vec3 vIndirectBack;
#endif
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <fog_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <emissivemap_fragment>
	#ifdef DOUBLE_SIDED
		reflectedLight.indirectDiffuse += ( gl_FrontFacing ) ? vIndirectFront : vIndirectBack;
	#else
		reflectedLight.indirectDiffuse += vIndirectFront;
	#endif
	#include <lightmap_fragment>
	reflectedLight.indirectDiffuse *= BRDF_Lambert( diffuseColor.rgb );
	#ifdef DOUBLE_SIDED
		reflectedLight.directDiffuse = ( gl_FrontFacing ) ? vLightFront : vLightBack;
	#else
		reflectedLight.directDiffuse = vLightFront;
	#endif
	reflectedLight.directDiffuse *= BRDF_Lambert( diffuseColor.rgb ) * getShadowMask();
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,jm=`#define LAMBERT
varying vec3 vLightFront;
varying vec3 vIndirectFront;
#ifdef DOUBLE_SIDED
	varying vec3 vLightBack;
	varying vec3 vIndirectBack;
#endif
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <envmap_pars_vertex>
#include <bsdfs>
#include <lights_pars_begin>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <lights_lambert_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Jm=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
		matcapColor = matcapTexelToLinear( matcapColor );
	#else
		vec4 matcapColor = vec4( 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Qm=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,$m=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
}`,Km=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )
	vViewPosition = - mvPosition.xyz;
#endif
}`,eg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,tg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ng=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularTint;
	#ifdef USE_SPECULARINTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
	#ifdef USE_SPECULARTINTMAP
		uniform sampler2D specularTintMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenTint;
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <bsdfs>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometry.clearcoatNormal, geometry.viewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - clearcoat * Fcc ) + clearcoatSpecular * clearcoat;
	#endif
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ig=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,rg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,sg=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ag=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,og=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <color_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,lg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
}`,cg=`#include <common>
#include <fog_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <begin_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,hg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
}`,ug=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`;const Ce={alphamap_fragment:Hf,alphamap_pars_fragment:Gf,alphatest_fragment:kf,alphatest_pars_fragment:Vf,aomap_fragment:Wf,aomap_pars_fragment:qf,begin_vertex:Xf,beginnormal_vertex:Yf,bsdfs:Zf,bumpmap_pars_fragment:jf,clipping_planes_fragment:Jf,clipping_planes_pars_fragment:Qf,clipping_planes_pars_vertex:$f,clipping_planes_vertex:Kf,color_fragment:ep,color_pars_fragment:tp,color_pars_vertex:np,color_vertex:ip,common:rp,cube_uv_reflection_fragment:sp,defaultnormal_vertex:ap,displacementmap_pars_vertex:op,displacementmap_vertex:lp,emissivemap_fragment:cp,emissivemap_pars_fragment:hp,encodings_fragment:up,encodings_pars_fragment:dp,envmap_fragment:fp,envmap_common_pars_fragment:pp,envmap_pars_fragment:mp,envmap_pars_vertex:gp,envmap_physical_pars_fragment:Ap,envmap_vertex:vp,fog_vertex:xp,fog_pars_vertex:_p,fog_fragment:yp,fog_pars_fragment:bp,gradientmap_pars_fragment:Mp,lightmap_fragment:wp,lightmap_pars_fragment:Sp,lights_lambert_vertex:Tp,lights_pars_begin:Ep,lights_toon_fragment:Lp,lights_toon_pars_fragment:Cp,lights_phong_fragment:Rp,lights_phong_pars_fragment:Pp,lights_physical_fragment:Ip,lights_physical_pars_fragment:Dp,lights_fragment_begin:Fp,lights_fragment_maps:Np,lights_fragment_end:Bp,logdepthbuf_fragment:zp,logdepthbuf_pars_fragment:Up,logdepthbuf_pars_vertex:Op,logdepthbuf_vertex:Hp,map_fragment:Gp,map_pars_fragment:kp,map_particle_fragment:Vp,map_particle_pars_fragment:Wp,metalnessmap_fragment:qp,metalnessmap_pars_fragment:Xp,morphnormal_vertex:Yp,morphtarget_pars_vertex:Zp,morphtarget_vertex:jp,normal_fragment_begin:Jp,normal_fragment_maps:Qp,normal_pars_fragment:$p,normal_pars_vertex:Kp,normal_vertex:em,normalmap_pars_fragment:tm,clearcoat_normal_fragment_begin:nm,clearcoat_normal_fragment_maps:im,clearcoat_pars_fragment:rm,output_fragment:sm,packing:am,premultiplied_alpha_fragment:om,project_vertex:lm,dithering_fragment:cm,dithering_pars_fragment:hm,roughnessmap_fragment:um,roughnessmap_pars_fragment:dm,shadowmap_pars_fragment:fm,shadowmap_pars_vertex:pm,shadowmap_vertex:mm,shadowmask_pars_fragment:gm,skinbase_vertex:vm,skinning_pars_vertex:xm,skinning_vertex:_m,skinnormal_vertex:ym,specularmap_fragment:bm,specularmap_pars_fragment:Mm,tonemapping_fragment:wm,tonemapping_pars_fragment:Sm,transmission_fragment:Tm,transmission_pars_fragment:Em,uv_pars_fragment:Am,uv_pars_vertex:Lm,uv_vertex:Cm,uv2_pars_fragment:Rm,uv2_pars_vertex:Pm,uv2_vertex:Im,worldpos_vertex:Dm,background_frag:Fm,background_vert:Nm,cube_frag:Bm,cube_vert:zm,depth_frag:Um,depth_vert:Om,distanceRGBA_frag:Hm,distanceRGBA_vert:Gm,equirect_frag:km,equirect_vert:Vm,linedashed_frag:Wm,linedashed_vert:qm,meshbasic_frag:Xm,meshbasic_vert:Ym,meshlambert_frag:Zm,meshlambert_vert:jm,meshmatcap_frag:Jm,meshmatcap_vert:Qm,meshnormal_frag:$m,meshnormal_vert:Km,meshphong_frag:eg,meshphong_vert:tg,meshphysical_frag:ng,meshphysical_vert:ig,meshtoon_frag:rg,meshtoon_vert:sg,points_frag:ag,points_vert:og,shadow_frag:lg,shadow_vert:cg,sprite_frag:hg,sprite_vert:ug},ne={common:{diffuse:{value:new ve(16777215)},opacity:{value:1},map:{value:null},uvTransform:{value:new tt},uv2Transform:{value:new tt},alphaMap:{value:null},alphaTest:{value:0}},specularmap:{specularMap:{value:null}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},maxMipLevel:{value:0}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1}},emissivemap:{emissiveMap:{value:null}},bumpmap:{bumpMap:{value:null},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalScale:{value:new te(1,1)}},displacementmap:{displacementMap:{value:null},displacementScale:{value:1},displacementBias:{value:0}},roughnessmap:{roughnessMap:{value:null}},metalnessmap:{metalnessMap:{value:null}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ve(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotShadowMap:{value:[]},spotShadowMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ve(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaTest:{value:0},uvTransform:{value:new tt}},sprite:{diffuse:{value:new ve(16777215)},opacity:{value:1},center:{value:new te(.5,.5)},rotation:{value:0},map:{value:null},alphaMap:{value:null},alphaTest:{value:0},uvTransform:{value:new tt}}},zt={basic:{uniforms:at([ne.common,ne.specularmap,ne.envmap,ne.aomap,ne.lightmap,ne.fog]),vertexShader:Ce.meshbasic_vert,fragmentShader:Ce.meshbasic_frag},lambert:{uniforms:at([ne.common,ne.specularmap,ne.envmap,ne.aomap,ne.lightmap,ne.emissivemap,ne.fog,ne.lights,{emissive:{value:new ve(0)}}]),vertexShader:Ce.meshlambert_vert,fragmentShader:Ce.meshlambert_frag},phong:{uniforms:at([ne.common,ne.specularmap,ne.envmap,ne.aomap,ne.lightmap,ne.emissivemap,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.fog,ne.lights,{emissive:{value:new ve(0)},specular:{value:new ve(1118481)},shininess:{value:30}}]),vertexShader:Ce.meshphong_vert,fragmentShader:Ce.meshphong_frag},standard:{uniforms:at([ne.common,ne.envmap,ne.aomap,ne.lightmap,ne.emissivemap,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.roughnessmap,ne.metalnessmap,ne.fog,ne.lights,{emissive:{value:new ve(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ce.meshphysical_vert,fragmentShader:Ce.meshphysical_frag},toon:{uniforms:at([ne.common,ne.aomap,ne.lightmap,ne.emissivemap,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.gradientmap,ne.fog,ne.lights,{emissive:{value:new ve(0)}}]),vertexShader:Ce.meshtoon_vert,fragmentShader:Ce.meshtoon_frag},matcap:{uniforms:at([ne.common,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.fog,{matcap:{value:null}}]),vertexShader:Ce.meshmatcap_vert,fragmentShader:Ce.meshmatcap_frag},points:{uniforms:at([ne.points,ne.fog]),vertexShader:Ce.points_vert,fragmentShader:Ce.points_frag},dashed:{uniforms:at([ne.common,ne.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ce.linedashed_vert,fragmentShader:Ce.linedashed_frag},depth:{uniforms:at([ne.common,ne.displacementmap]),vertexShader:Ce.depth_vert,fragmentShader:Ce.depth_frag},normal:{uniforms:at([ne.common,ne.bumpmap,ne.normalmap,ne.displacementmap,{opacity:{value:1}}]),vertexShader:Ce.meshnormal_vert,fragmentShader:Ce.meshnormal_frag},sprite:{uniforms:at([ne.sprite,ne.fog]),vertexShader:Ce.sprite_vert,fragmentShader:Ce.sprite_frag},background:{uniforms:{uvTransform:{value:new tt},t2D:{value:null}},vertexShader:Ce.background_vert,fragmentShader:Ce.background_frag},cube:{uniforms:at([ne.envmap,{opacity:{value:1}}]),vertexShader:Ce.cube_vert,fragmentShader:Ce.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ce.equirect_vert,fragmentShader:Ce.equirect_frag},distanceRGBA:{uniforms:at([ne.common,ne.displacementmap,{referencePosition:{value:new E},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ce.distanceRGBA_vert,fragmentShader:Ce.distanceRGBA_frag},shadow:{uniforms:at([ne.lights,ne.fog,{color:{value:new ve(0)},opacity:{value:1}}]),vertexShader:Ce.shadow_vert,fragmentShader:Ce.shadow_frag}};zt.physical={uniforms:at([zt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatNormalScale:{value:new te(1,1)},clearcoatNormalMap:{value:null},sheenTint:{value:new ve(0)},transmission:{value:0},transmissionMap:{value:null},transmissionSamplerSize:{value:new te},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},attenuationDistance:{value:0},attenuationTint:{value:new ve(0)},specularIntensity:{value:0},specularIntensityMap:{value:null},specularTint:{value:new ve(1,1,1)},specularTintMap:{value:null}}]),vertexShader:Ce.meshphysical_vert,fragmentShader:Ce.meshphysical_frag};function dg(s,e,t,n,i){const r=new ve(0);let a=0,o,l,c=null,h=0,u=null;function d(m,v){let x=!1,p=v.isScene===!0?v.background:null;p&&p.isTexture&&(p=e.get(p));const g=s.xr,w=g.getSession&&g.getSession();w&&w.environmentBlendMode==="additive"&&(p=null),p===null?f(r,a):p&&p.isColor&&(f(p,1),x=!0),(s.autoClear||x)&&s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil),p&&(p.isCubeTexture||p.mapping===ls)?(l===void 0&&(l=new dt(new $i(1,1,1),new Ln({name:"BackgroundCubeMaterial",uniforms:ci(zt.cube.uniforms),vertexShader:zt.cube.vertexShader,fragmentShader:zt.cube.fragmentShader,side:Xe,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(M,T,L){this.matrixWorld.copyPosition(L.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),l.material.uniforms.envMap.value=p,l.material.uniforms.flipEnvMap.value=p.isCubeTexture&&p.isRenderTargetTexture===!1?-1:1,(c!==p||h!==p.version||u!==s.toneMapping)&&(l.material.needsUpdate=!0,c=p,h=p.version,u=s.toneMapping),m.unshift(l,l.geometry,l.material,0,0,null)):p&&p.isTexture&&(o===void 0&&(o=new dt(new Ga(2,2),new Ln({name:"BackgroundMaterial",uniforms:ci(zt.background.uniforms),vertexShader:zt.background.vertexShader,fragmentShader:zt.background.fragmentShader,side:Vi,depthTest:!1,depthWrite:!1,fog:!1})),o.geometry.deleteAttribute("normal"),Object.defineProperty(o.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(o)),o.material.uniforms.t2D.value=p,p.matrixAutoUpdate===!0&&p.updateMatrix(),o.material.uniforms.uvTransform.value.copy(p.matrix),(c!==p||h!==p.version||u!==s.toneMapping)&&(o.material.needsUpdate=!0,c=p,h=p.version,u=s.toneMapping),m.unshift(o,o.geometry,o.material,0,0,null))}function f(m,v){t.buffers.color.setClear(m.r,m.g,m.b,v,i)}return{getClearColor:function(){return r},setClearColor:function(m,v=1){r.set(m),a=v,f(r,a)},getClearAlpha:function(){return a},setClearAlpha:function(m){a=m,f(r,a)},render:d}}function fg(s,e,t,n){const i=s.getParameter(34921),r=n.isWebGL2?null:e.get("OES_vertex_array_object"),a=n.isWebGL2||r!==null,o={},l=v(null);let c=l;function h(P,N,O,B,I){let q=!1;if(a){const $=m(B,O,N);c!==$&&(c=$,d(c.object)),q=x(B,I),q&&p(B,I)}else{const $=N.wireframe===!0;(c.geometry!==B.id||c.program!==O.id||c.wireframe!==$)&&(c.geometry=B.id,c.program=O.id,c.wireframe=$,q=!0)}P.isInstancedMesh===!0&&(q=!0),I!==null&&t.update(I,34963),q&&(_(P,N,O,B),I!==null&&s.bindBuffer(34963,t.get(I).buffer))}function u(){return n.isWebGL2?s.createVertexArray():r.createVertexArrayOES()}function d(P){return n.isWebGL2?s.bindVertexArray(P):r.bindVertexArrayOES(P)}function f(P){return n.isWebGL2?s.deleteVertexArray(P):r.deleteVertexArrayOES(P)}function m(P,N,O){const B=O.wireframe===!0;let I=o[P.id];I===void 0&&(I={},o[P.id]=I);let q=I[N.id];q===void 0&&(q={},I[N.id]=q);let $=q[B];return $===void 0&&($=v(u()),q[B]=$),$}function v(P){const N=[],O=[],B=[];for(let I=0;I<i;I++)N[I]=0,O[I]=0,B[I]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:O,attributeDivisors:B,object:P,attributes:{},index:null}}function x(P,N){const O=c.attributes,B=P.attributes;let I=0;for(const q in B){const $=O[q],ie=B[q];if($===void 0||$.attribute!==ie||$.data!==ie.data)return!0;I++}return c.attributesNum!==I||c.index!==N}function p(P,N){const O={},B=P.attributes;let I=0;for(const q in B){const $=B[q],ie={};ie.attribute=$,$.data&&(ie.data=$.data),O[q]=ie,I++}c.attributes=O,c.attributesNum=I,c.index=N}function g(){const P=c.newAttributes;for(let N=0,O=P.length;N<O;N++)P[N]=0}function w(P){M(P,0)}function M(P,N){const O=c.newAttributes,B=c.enabledAttributes,I=c.attributeDivisors;O[P]=1,B[P]===0&&(s.enableVertexAttribArray(P),B[P]=1),I[P]!==N&&((n.isWebGL2?s:e.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](P,N),I[P]=N)}function T(){const P=c.newAttributes,N=c.enabledAttributes;for(let O=0,B=N.length;O<B;O++)N[O]!==P[O]&&(s.disableVertexAttribArray(O),N[O]=0)}function L(P,N,O,B,I,q){n.isWebGL2===!0&&(O===5124||O===5125)?s.vertexAttribIPointer(P,N,O,I,q):s.vertexAttribPointer(P,N,O,B,I,q)}function _(P,N,O,B){if(n.isWebGL2===!1&&(P.isInstancedMesh||B.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;g();const I=B.attributes,q=O.getAttributes(),$=N.defaultAttributeValues;for(const ie in q){const K=q[ie];if(K.location>=0){let de=I[ie];if(de===void 0&&(ie==="instanceMatrix"&&P.instanceMatrix&&(de=P.instanceMatrix),ie==="instanceColor"&&P.instanceColor&&(de=P.instanceColor)),de!==void 0){const X=de.normalized,Q=de.itemSize,oe=t.get(de);if(oe===void 0)continue;const U=oe.buffer,ue=oe.type,_e=oe.bytesPerElement;if(de.isInterleavedBufferAttribute){const le=de.data,pe=le.stride,Ee=de.offset;if(le&&le.isInstancedInterleavedBuffer){for(let k=0;k<K.locationSize;k++)M(K.location+k,le.meshPerAttribute);P.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=le.meshPerAttribute*le.count)}else for(let k=0;k<K.locationSize;k++)w(K.location+k);s.bindBuffer(34962,U);for(let k=0;k<K.locationSize;k++)L(K.location+k,Q/K.locationSize,ue,X,pe*_e,(Ee+Q/K.locationSize*k)*_e)}else{if(de.isInstancedBufferAttribute){for(let le=0;le<K.locationSize;le++)M(K.location+le,de.meshPerAttribute);P.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let le=0;le<K.locationSize;le++)w(K.location+le);s.bindBuffer(34962,U);for(let le=0;le<K.locationSize;le++)L(K.location+le,Q/K.locationSize,ue,X,Q*_e,Q/K.locationSize*le*_e)}}else if($!==void 0){const X=$[ie];if(X!==void 0)switch(X.length){case 2:s.vertexAttrib2fv(K.location,X);break;case 3:s.vertexAttrib3fv(K.location,X);break;case 4:s.vertexAttrib4fv(K.location,X);break;default:s.vertexAttrib1fv(K.location,X)}}}}T()}function F(){A();for(const P in o){const N=o[P];for(const O in N){const B=N[O];for(const I in B)f(B[I].object),delete B[I];delete N[O]}delete o[P]}}function W(P){if(o[P.id]===void 0)return;const N=o[P.id];for(const O in N){const B=N[O];for(const I in B)f(B[I].object),delete B[I];delete N[O]}delete o[P.id]}function C(P){for(const N in o){const O=o[N];if(O[P.id]===void 0)continue;const B=O[P.id];for(const I in B)f(B[I].object),delete B[I];delete O[P.id]}}function A(){V(),c!==l&&(c=l,d(c.object))}function V(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:h,reset:A,resetDefaultState:V,dispose:F,releaseStatesOfGeometry:W,releaseStatesOfProgram:C,initAttributes:g,enableAttribute:w,disableUnusedAttributes:T}}function pg(s,e,t,n){const i=n.isWebGL2;let r;function a(c){r=c}function o(c,h){s.drawArrays(r,c,h),t.update(h,r,1)}function l(c,h,u){if(u===0)return;let d,f;if(i)d=s,f="drawArraysInstanced";else if(d=e.get("ANGLE_instanced_arrays"),f="drawArraysInstancedANGLE",d===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}d[f](r,c,h,u),t.update(h,r,u)}this.setMode=a,this.render=o,this.renderInstances=l}function mg(s,e,t){let n;function i(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){const _=e.get("EXT_texture_filter_anisotropic");n=s.getParameter(_.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(_){if(_==="highp"){if(s.getShaderPrecisionFormat(35633,36338).precision>0&&s.getShaderPrecisionFormat(35632,36338).precision>0)return"highp";_="mediump"}return _==="mediump"&&s.getShaderPrecisionFormat(35633,36337).precision>0&&s.getShaderPrecisionFormat(35632,36337).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&s instanceof WebGL2RenderingContext||typeof WebGL2ComputeRenderingContext<"u"&&s instanceof WebGL2ComputeRenderingContext;let o=t.precision!==void 0?t.precision:"highp";const l=r(o);l!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",l,"instead."),o=l);const c=a||e.has("WEBGL_draw_buffers"),h=t.logarithmicDepthBuffer===!0,u=s.getParameter(34930),d=s.getParameter(35660),f=s.getParameter(3379),m=s.getParameter(34076),v=s.getParameter(34921),x=s.getParameter(36347),p=s.getParameter(36348),g=s.getParameter(36349),w=d>0,M=a||e.has("OES_texture_float"),T=w&&M,L=a?s.getParameter(36183):0;return{isWebGL2:a,drawBuffers:c,getMaxAnisotropy:i,getMaxPrecision:r,precision:o,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:d,maxTextureSize:f,maxCubemapSize:m,maxAttributes:v,maxVertexUniforms:x,maxVaryings:p,maxFragmentUniforms:g,vertexTextures:w,floatFragmentTextures:M,floatVertexTextures:T,maxSamples:L}}function gg(s){const e=this;let t=null,n=0,i=!1,r=!1;const a=new Jt,o=new tt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d,f){const m=u.length!==0||d||n!==0||i;return i=d,t=h(u,f,0),n=u.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1,c()},this.setState=function(u,d,f){const m=u.clippingPlanes,v=u.clipIntersection,x=u.clipShadows,p=s.get(u);if(!i||m===null||m.length===0||r&&!x)r?h(null):c();else{const g=r?0:n,w=g*4;let M=p.clippingState||null;l.value=M,M=h(m,d,w,f);for(let T=0;T!==w;++T)M[T]=t[T];p.clippingState=M,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=g}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,m){const v=u!==null?u.length:0;let x=null;if(v!==0){if(x=l.value,m!==!0||x===null){const p=f+v*4,g=d.matrixWorldInverse;o.getNormalMatrix(g),(x===null||x.length<p)&&(x=new Float32Array(p));for(let w=0,M=f;w!==v;++w,M+=4)a.copy(u[w]).applyMatrix4(g,o),a.normal.toArray(x,M),x[M+3]=a.constant}l.value=x,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,x}}function vg(s){let e=new WeakMap;function t(a,o){return o===xa?a.mapping=as:o===_a&&(a.mapping=os),a}function n(a){if(a&&a.isTexture&&a.isRenderTargetTexture===!1){const o=a.mapping;if(o===xa||o===_a)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=s.getRenderTarget(),h=new mc(l.height/2);return h.fromEquirectangularTexture(s,a),e.set(a,h),s.setRenderTarget(c),a.addEventListener("dispose",i),t(h.texture,a.mapping)}else return null}}return a}function i(a){const o=a.target;o.removeEventListener("dispose",i);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}class ka extends Oa{constructor(e=-1,t=1,n=1,i=-1,r=.1,a=2e3){super(),this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}ka.prototype.isOrthographicCamera=!0;class fs extends Ln{constructor(e){super(e),this.type="RawShaderMaterial"}}fs.prototype.isRawShaderMaterial=!0;const si=4,dn=8,Bt=Math.pow(2,dn),vc=[.125,.215,.35,.446,.526,.582],xc=dn-si+1+vc.length,Wn=20,Ut={[_t]:0,[hs]:1,[za]:2,[oc]:3,[lc]:4,[cc]:5,[Ba]:6},na=new ka,{_lodPlanes:Ai,_sizeLods:il,_sigmas:Ar}=yg(),rl=new ve;let ia=null;const Sn=(1+Math.sqrt(5))/2,qn=1/Sn,sl=[new E(1,1,1),new E(-1,1,1),new E(1,1,-1),new E(-1,1,-1),new E(0,Sn,qn),new E(0,Sn,-qn),new E(qn,0,Sn),new E(-qn,0,Sn),new E(Sn,qn,0),new E(-Sn,qn,0)];class xg{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._blurMaterial=bg(Wn),this._equirectShader=null,this._cubemapShader=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){ia=this._renderer.getRenderTarget();const r=this._allocateTargets();return this._sceneToCubeUV(e,n,i,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e){return this._fromTexture(e)}fromCubemap(e){return this._fromTexture(e)}compileCubemapShader(){this._cubemapShader===null&&(this._cubemapShader=ll(),this._compileMaterial(this._cubemapShader))}compileEquirectangularShader(){this._equirectShader===null&&(this._equirectShader=ol(),this._compileMaterial(this._equirectShader))}dispose(){this._blurMaterial.dispose(),this._cubemapShader!==null&&this._cubemapShader.dispose(),this._equirectShader!==null&&this._equirectShader.dispose();for(let e=0;e<Ai.length;e++)Ai[e].dispose()}_cleanup(e){this._pingPongRenderTarget.dispose(),this._renderer.setRenderTarget(ia),e.scissorTest=!1,Lr(e,0,0,e.width,e.height)}_fromTexture(e){ia=this._renderer.getRenderTarget();const t=this._allocateTargets(e);return this._textureToCubeUV(e,t),this._applyPMREM(t),this._cleanup(t),t}_allocateTargets(e){const t={magFilter:Je,minFilter:Je,generateMipmaps:!1,type:li,format:Td,encoding:_g(e)?e.encoding:za,depthBuffer:!1},n=al(t);return n.depthBuffer=!e,this._pingPongRenderTarget=al(t),n}_compileMaterial(e){const t=new dt(Ai[0],e);this._renderer.compile(t,na)}_sceneToCubeUV(e,t,n,i){const o=new ht(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.outputEncoding,f=h.toneMapping;h.getClearColor(rl),h.toneMapping=En,h.outputEncoding=_t,h.autoClear=!1;const m=new Ua({name:"PMREM.Background",side:Xe,depthWrite:!1,depthTest:!1}),v=new dt(new $i,m);let x=!1;const p=e.background;p?p.isColor&&(m.color.copy(p),e.background=null,x=!0):(m.color.copy(rl),x=!0);for(let g=0;g<6;g++){const w=g%3;w==0?(o.up.set(0,l[g],0),o.lookAt(c[g],0,0)):w==1?(o.up.set(0,0,l[g]),o.lookAt(0,c[g],0)):(o.up.set(0,l[g],0),o.lookAt(0,0,c[g])),Lr(i,w*Bt,g>2?Bt:0,Bt,Bt),h.setRenderTarget(i),x&&h.render(v,o),h.render(e,o)}v.geometry.dispose(),v.material.dispose(),h.toneMapping=f,h.outputEncoding=d,h.autoClear=u,e.background=p}_textureToCubeUV(e,t){const n=this._renderer;e.isCubeTexture?this._cubemapShader==null&&(this._cubemapShader=ll()):this._equirectShader==null&&(this._equirectShader=ol());const i=e.isCubeTexture?this._cubemapShader:this._equirectShader,r=new dt(Ai[0],i),a=i.uniforms;a.envMap.value=e,e.isCubeTexture||a.texelSize.value.set(1/e.image.width,1/e.image.height),a.inputEncoding.value=Ut[e.encoding],a.outputEncoding.value=Ut[t.texture.encoding],Lr(t,0,0,3*Bt,2*Bt),n.setRenderTarget(t),n.render(r,na)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;for(let i=1;i<xc;i++){const r=Math.sqrt(Ar[i]*Ar[i]-Ar[i-1]*Ar[i-1]),a=sl[(i-1)%sl.length];this._blur(e,i-1,i,r,a)}t.autoClear=n}_blur(e,t,n,i,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,i,"latitudinal",r),this._halfBlur(a,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new dt(Ai[i],c),d=c.uniforms,f=il[n]-1,m=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Wn-1),v=r/m,x=isFinite(r)?1+Math.floor(h*v):Wn;x>Wn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${x} samples when the maximum is set to ${Wn}`);const p=[];let g=0;for(let L=0;L<Wn;++L){const _=L/v,F=Math.exp(-_*_/2);p.push(F),L==0?g+=F:L<x&&(g+=2*F)}for(let L=0;L<p.length;L++)p[L]=p[L]/g;d.envMap.value=e.texture,d.samples.value=x,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o),d.dTheta.value=m,d.mipInt.value=dn-n,d.inputEncoding.value=Ut[e.texture.encoding],d.outputEncoding.value=Ut[e.texture.encoding];const w=il[i],M=3*Math.max(0,Bt-2*w),T=(i===0?0:2*Bt)+2*w*(i>dn-si?i-dn+si:0);Lr(t,M,T,3*w,2*w),l.setRenderTarget(t),l.render(u,na)}}function _g(s){return s===void 0||s.type!==li?!1:s.encoding===_t||s.encoding===hs||s.encoding===Ba}function yg(){const s=[],e=[],t=[];let n=dn;for(let i=0;i<xc;i++){const r=Math.pow(2,n);e.push(r);let a=1/r;i>dn-si?a=vc[i-dn+si-1]:i==0&&(a=0),t.push(a);const o=1/(r-1),l=-o/2,c=1+o/2,h=[l,l,c,l,c,c,l,l,c,c,l,c],u=6,d=6,f=3,m=2,v=1,x=new Float32Array(f*d*u),p=new Float32Array(m*d*u),g=new Float32Array(v*d*u);for(let M=0;M<u;M++){const T=M%3*2/3-1,L=M>2?0:-1,_=[T,L,0,T+2/3,L,0,T+2/3,L+1,0,T,L,0,T+2/3,L+1,0,T,L+1,0];x.set(_,f*d*M),p.set(h,m*d*M);const F=[M,M,M,M,M,M];g.set(F,v*d*M)}const w=new Oe;w.setAttribute("position",new Ye(x,f)),w.setAttribute("uv",new Ye(p,m)),w.setAttribute("faceIndex",new Ye(g,v)),s.push(w),n>si&&n--}return{_lodPlanes:s,_sizeLods:e,_sigmas:t}}function al(s){const e=new Ht(3*Bt,3*Bt,s);return e.texture.mapping=ls,e.texture.name="PMREM.cubeUv",e.scissorTest=!0,e}function Lr(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function bg(s){const e=new Float32Array(s),t=new E(0,1,0);return new fs({name:"SphericalGaussianBlur",defines:{n:s},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:e},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:t},inputEncoding:{value:Ut[_t]},outputEncoding:{value:Ut[_t]}},vertexShader:Va(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			${Wa()}

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

				gl_FragColor = linearToOutputTexel( gl_FragColor );

			}
		`,blending:hn,depthTest:!1,depthWrite:!1})}function ol(){const s=new te(1,1);return new fs({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null},texelSize:{value:s},inputEncoding:{value:Ut[_t]},outputEncoding:{value:Ut[_t]}},vertexShader:Va(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform vec2 texelSize;

			${Wa()}

			#include <common>

			void main() {

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				vec2 f = fract( uv / texelSize - 0.5 );
				uv -= f * texelSize;
				vec3 tl = envMapTexelToLinear( texture2D ( envMap, uv ) ).rgb;
				uv.x += texelSize.x;
				vec3 tr = envMapTexelToLinear( texture2D ( envMap, uv ) ).rgb;
				uv.y += texelSize.y;
				vec3 br = envMapTexelToLinear( texture2D ( envMap, uv ) ).rgb;
				uv.x -= texelSize.x;
				vec3 bl = envMapTexelToLinear( texture2D ( envMap, uv ) ).rgb;

				vec3 tm = mix( tl, tr, f.x );
				vec3 bm = mix( bl, br, f.x );
				gl_FragColor.rgb = mix( tm, bm, f.y );

				gl_FragColor = linearToOutputTexel( gl_FragColor );

			}
		`,blending:hn,depthTest:!1,depthWrite:!1})}function ll(){return new fs({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},inputEncoding:{value:Ut[_t]},outputEncoding:{value:Ut[_t]}},vertexShader:Va(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			${Wa()}

			void main() {

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb = envMapTexelToLinear( textureCube( envMap, vec3( - vOutputDirection.x, vOutputDirection.yz ) ) ).rgb;
				gl_FragColor = linearToOutputTexel( gl_FragColor );

			}
		`,blending:hn,depthTest:!1,depthWrite:!1})}function Va(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 position;
		attribute vec2 uv;
		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Wa(){return`

		uniform int inputEncoding;
		uniform int outputEncoding;

		#include <encodings_pars_fragment>

		vec4 inputTexelToLinear( vec4 value ) {

			if ( inputEncoding == 0 ) {

				return value;

			} else if ( inputEncoding == 1 ) {

				return sRGBToLinear( value );

			} else if ( inputEncoding == 2 ) {

				return RGBEToLinear( value );

			} else if ( inputEncoding == 3 ) {

				return RGBMToLinear( value, 7.0 );

			} else if ( inputEncoding == 4 ) {

				return RGBMToLinear( value, 16.0 );

			} else if ( inputEncoding == 5 ) {

				return RGBDToLinear( value, 256.0 );

			} else {

				return GammaToLinear( value, 2.2 );

			}

		}

		vec4 linearToOutputTexel( vec4 value ) {

			if ( outputEncoding == 0 ) {

				return value;

			} else if ( outputEncoding == 1 ) {

				return LinearTosRGB( value );

			} else if ( outputEncoding == 2 ) {

				return LinearToRGBE( value );

			} else if ( outputEncoding == 3 ) {

				return LinearToRGBM( value, 7.0 );

			} else if ( outputEncoding == 4 ) {

				return LinearToRGBM( value, 16.0 );

			} else if ( outputEncoding == 5 ) {

				return LinearToRGBD( value, 256.0 );

			} else {

				return LinearToGamma( value, 2.2 );

			}

		}

		vec4 envMapTexelToLinear( vec4 color ) {

			return inputTexelToLinear( color );

		}
	`}function Mg(s){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture&&o.isRenderTargetTexture===!1){const l=o.mapping,c=l===xa||l===_a,h=l===as||l===os;if(c||h){if(e.has(o))return e.get(o).texture;{const u=o.image;if(c&&u&&u.height>0||h&&u&&i(u)){const d=s.getRenderTarget();t===null&&(t=new xg(s));const f=c?t.fromEquirectangular(o):t.fromCubemap(o);return e.set(o,f),s.setRenderTarget(d),o.addEventListener("dispose",r),f.texture}else return null}}}return o}function i(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function wg(s){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(n){n.isWebGL2?t("EXT_color_buffer_float"):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float")},get:function(n){const i=t(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Sg(s,e,t,n){const i={},r=new WeakMap;function a(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const m in d.attributes)e.remove(d.attributes[m]);d.removeEventListener("dispose",a),delete i[d.id];const f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(u,d){return i[d.id]===!0||(d.addEventListener("dispose",a),i[d.id]=!0,t.memory.geometries++),d}function l(u){const d=u.attributes;for(const m in d)e.update(d[m],34962);const f=u.morphAttributes;for(const m in f){const v=f[m];for(let x=0,p=v.length;x<p;x++)e.update(v[x],34962)}}function c(u){const d=[],f=u.index,m=u.attributes.position;let v=0;if(f!==null){const g=f.array;v=f.version;for(let w=0,M=g.length;w<M;w+=3){const T=g[w+0],L=g[w+1],_=g[w+2];d.push(T,L,L,_,_,T)}}else{const g=m.array;v=m.version;for(let w=0,M=g.length/3-1;w<M;w+=3){const T=w+0,L=w+1,_=w+2;d.push(T,L,L,_,_,T)}}const x=new(pc(d)>65535?fc:dc)(d,1);x.version=v;const p=r.get(u);p&&e.remove(p),r.set(u,x)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function Tg(s,e,t,n){const i=n.isWebGL2;let r;function a(d){r=d}let o,l;function c(d){o=d.type,l=d.bytesPerElement}function h(d,f){s.drawElements(r,f,o,d*l),t.update(f,r,1)}function u(d,f,m){if(m===0)return;let v,x;if(i)v=s,x="drawElementsInstanced";else if(v=e.get("ANGLE_instanced_arrays"),x="drawElementsInstancedANGLE",v===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}v[x](r,f,o,d*l,m),t.update(f,r,m)}this.setMode=a,this.setIndex=c,this.render=h,this.renderInstances=u}function Eg(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case 4:t.triangles+=o*(r/3);break;case 1:t.lines+=o*(r/2);break;case 3:t.lines+=o*(r-1);break;case 2:t.lines+=o*r;break;case 0:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){t.frame++,t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function Ag(s,e){return s[0]-e[0]}function Lg(s,e){return Math.abs(e[1])-Math.abs(s[1])}function Cg(s){const e={},t=new Float32Array(8),n=[];for(let r=0;r<8;r++)n[r]=[r,0];function i(r,a,o,l){const c=r.morphTargetInfluences,h=c===void 0?0:c.length;let u=e[a.id];if(u===void 0||u.length!==h){u=[];for(let x=0;x<h;x++)u[x]=[x,0];e[a.id]=u}for(let x=0;x<h;x++){const p=u[x];p[0]=x,p[1]=c[x]}u.sort(Lg);for(let x=0;x<8;x++)x<h&&u[x][1]?(n[x][0]=u[x][0],n[x][1]=u[x][1]):(n[x][0]=Number.MAX_SAFE_INTEGER,n[x][1]=0);n.sort(Ag);const d=a.morphAttributes.position,f=a.morphAttributes.normal;let m=0;for(let x=0;x<8;x++){const p=n[x],g=p[0],w=p[1];g!==Number.MAX_SAFE_INTEGER&&w?(d&&a.getAttribute("morphTarget"+x)!==d[g]&&a.setAttribute("morphTarget"+x,d[g]),f&&a.getAttribute("morphNormal"+x)!==f[g]&&a.setAttribute("morphNormal"+x,f[g]),t[x]=w,m+=w):(d&&a.hasAttribute("morphTarget"+x)===!0&&a.deleteAttribute("morphTarget"+x),f&&a.hasAttribute("morphNormal"+x)===!0&&a.deleteAttribute("morphNormal"+x),t[x]=0)}const v=a.morphTargetsRelative?1:1-m;l.getUniforms().setValue(s,"morphTargetBaseInfluence",v),l.getUniforms().setValue(s,"morphTargetInfluences",t)}return{update:i}}function Rg(s,e,t,n){let i=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,u=e.get(l,h);return i.get(u)!==c&&(e.update(u),i.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),t.update(l.instanceMatrix,34962),l.instanceColor!==null&&t.update(l.instanceColor,34962)),u}function a(){i=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}class _c extends nt{constructor(e=null,t=1,n=1,i=1){super(null),this.image={data:e,width:t,height:n,depth:i},this.magFilter=Je,this.minFilter=Je,this.wrapR=wt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.needsUpdate=!0}}_c.prototype.isDataTexture2DArray=!0;class yc extends nt{constructor(e=null,t=1,n=1,i=1){super(null),this.image={data:e,width:t,height:n,depth:i},this.magFilter=Je,this.minFilter=Je,this.wrapR=wt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.needsUpdate=!0}}yc.prototype.isDataTexture3D=!0;const bc=new nt,Pg=new _c,Ig=new yc,Mc=new us,cl=[],hl=[],ul=new Float32Array(16),dl=new Float32Array(9),fl=new Float32Array(4);function vi(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=cl[i];if(r===void 0&&(r=new Float32Array(i),cl[i]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,s[a].toArray(r,o)}return r}function ft(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function ot(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function wc(s,e){let t=hl[e];t===void 0&&(t=new Int32Array(e),hl[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function Dg(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function Fg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ft(t,e))return;s.uniform2fv(this.addr,e),ot(t,e)}}function Ng(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(ft(t,e))return;s.uniform3fv(this.addr,e),ot(t,e)}}function Bg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ft(t,e))return;s.uniform4fv(this.addr,e),ot(t,e)}}function zg(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(ft(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),ot(t,e)}else{if(ft(t,n))return;fl.set(n),s.uniformMatrix2fv(this.addr,!1,fl),ot(t,n)}}function Ug(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(ft(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),ot(t,e)}else{if(ft(t,n))return;dl.set(n),s.uniformMatrix3fv(this.addr,!1,dl),ot(t,n)}}function Og(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(ft(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),ot(t,e)}else{if(ft(t,n))return;ul.set(n),s.uniformMatrix4fv(this.addr,!1,ul),ot(t,n)}}function Hg(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function Gg(s,e){const t=this.cache;ft(t,e)||(s.uniform2iv(this.addr,e),ot(t,e))}function kg(s,e){const t=this.cache;ft(t,e)||(s.uniform3iv(this.addr,e),ot(t,e))}function Vg(s,e){const t=this.cache;ft(t,e)||(s.uniform4iv(this.addr,e),ot(t,e))}function Wg(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function qg(s,e){const t=this.cache;ft(t,e)||(s.uniform2uiv(this.addr,e),ot(t,e))}function Xg(s,e){const t=this.cache;ft(t,e)||(s.uniform3uiv(this.addr,e),ot(t,e))}function Yg(s,e){const t=this.cache;ft(t,e)||(s.uniform4uiv(this.addr,e),ot(t,e))}function Zg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.safeSetTexture2D(e||bc,i)}function jg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Ig,i)}function Jg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.safeSetTextureCube(e||Mc,i)}function Qg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Pg,i)}function $g(s){switch(s){case 5126:return Dg;case 35664:return Fg;case 35665:return Ng;case 35666:return Bg;case 35674:return zg;case 35675:return Ug;case 35676:return Og;case 5124:case 35670:return Hg;case 35667:case 35671:return Gg;case 35668:case 35672:return kg;case 35669:case 35673:return Vg;case 5125:return Wg;case 36294:return qg;case 36295:return Xg;case 36296:return Yg;case 35678:case 36198:case 36298:case 36306:case 35682:return Zg;case 35679:case 36299:case 36307:return jg;case 35680:case 36300:case 36308:case 36293:return Jg;case 36289:case 36303:case 36311:case 36292:return Qg}}function Kg(s,e){s.uniform1fv(this.addr,e)}function e0(s,e){const t=vi(e,this.size,2);s.uniform2fv(this.addr,t)}function t0(s,e){const t=vi(e,this.size,3);s.uniform3fv(this.addr,t)}function n0(s,e){const t=vi(e,this.size,4);s.uniform4fv(this.addr,t)}function i0(s,e){const t=vi(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function r0(s,e){const t=vi(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function s0(s,e){const t=vi(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function a0(s,e){s.uniform1iv(this.addr,e)}function o0(s,e){s.uniform2iv(this.addr,e)}function l0(s,e){s.uniform3iv(this.addr,e)}function c0(s,e){s.uniform4iv(this.addr,e)}function h0(s,e){s.uniform1uiv(this.addr,e)}function u0(s,e){s.uniform2uiv(this.addr,e)}function d0(s,e){s.uniform3uiv(this.addr,e)}function f0(s,e){s.uniform4uiv(this.addr,e)}function p0(s,e,t){const n=e.length,i=wc(t,n);s.uniform1iv(this.addr,i);for(let r=0;r!==n;++r)t.safeSetTexture2D(e[r]||bc,i[r])}function m0(s,e,t){const n=e.length,i=wc(t,n);s.uniform1iv(this.addr,i);for(let r=0;r!==n;++r)t.safeSetTextureCube(e[r]||Mc,i[r])}function g0(s){switch(s){case 5126:return Kg;case 35664:return e0;case 35665:return t0;case 35666:return n0;case 35674:return i0;case 35675:return r0;case 35676:return s0;case 5124:case 35670:return a0;case 35667:case 35671:return o0;case 35668:case 35672:return l0;case 35669:case 35673:return c0;case 5125:return h0;case 36294:return u0;case 36295:return d0;case 36296:return f0;case 35678:case 36198:case 36298:case 36306:case 35682:return p0;case 35680:case 36300:case 36308:case 36293:return m0}}function v0(s,e,t){this.id=s,this.addr=t,this.cache=[],this.setValue=$g(e.type)}function Sc(s,e,t){this.id=s,this.addr=t,this.cache=[],this.size=e.size,this.setValue=g0(e.type)}Sc.prototype.updateCache=function(s){const e=this.cache;s instanceof Float32Array&&e.length!==s.length&&(this.cache=new Float32Array(s.length)),ot(e,s)};function Tc(s){this.id=s,this.seq=[],this.map={}}Tc.prototype.setValue=function(s,e,t){const n=this.seq;for(let i=0,r=n.length;i!==r;++i){const a=n[i];a.setValue(s,e[a.id],t)}};const ra=/(\w+)(\])?(\[|\.)?/g;function pl(s,e){s.seq.push(e),s.map[e.id]=e}function x0(s,e,t){const n=s.name,i=n.length;for(ra.lastIndex=0;;){const r=ra.exec(n),a=ra.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){pl(t,c===void 0?new v0(o,s,e):new Sc(o,s,e));break}else{let u=t.map[o];u===void 0&&(u=new Tc(o),pl(t,u)),t=u}}}function fn(s,e){this.seq=[],this.map={};const t=s.getProgramParameter(e,35718);for(let n=0;n<t;++n){const i=s.getActiveUniform(e,n),r=s.getUniformLocation(e,i.name);x0(i,r,this)}}fn.prototype.setValue=function(s,e,t,n){const i=this.map[e];i!==void 0&&i.setValue(s,t,n)};fn.prototype.setOptional=function(s,e,t){const n=e[t];n!==void 0&&this.setValue(s,t,n)};fn.upload=function(s,e,t,n){for(let i=0,r=e.length;i!==r;++i){const a=e[i],o=t[a.id];o.needsUpdate!==!1&&a.setValue(s,o.value,n)}};fn.seqWithValue=function(s,e){const t=[];for(let n=0,i=s.length;n!==i;++n){const r=s[n];r.id in e&&t.push(r)}return t};function ml(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}let _0=0;function y0(s){const e=s.split(`
`);for(let t=0;t<e.length;t++)e[t]=t+1+": "+e[t];return e.join(`
`)}function Ec(s){switch(s){case _t:return["Linear","( value )"];case hs:return["sRGB","( value )"];case za:return["RGBE","( value )"];case oc:return["RGBM","( value, 7.0 )"];case lc:return["RGBM","( value, 16.0 )"];case cc:return["RGBD","( value, 256.0 )"];case Ba:return["Gamma","( value, float( GAMMA_FACTOR ) )"];case ff:return["LogLuv","( value )"];default:return console.warn("THREE.WebGLProgram: Unsupported encoding:",s),["Linear","( value )"]}}function gl(s,e,t){const n=s.getShaderParameter(e,35713),i=s.getShaderInfoLog(e).trim();return n&&i===""?"":t.toUpperCase()+`

`+i+`

`+y0(s.getShaderSource(e))}function Xn(s,e){const t=Ec(e);return"vec4 "+s+"( vec4 value ) { return "+t[0]+"ToLinear"+t[1]+"; }"}function b0(s,e){const t=Ec(e);return"vec4 "+s+"( vec4 value ) { return LinearTo"+t[0]+t[1]+"; }"}function M0(s,e){let t;switch(e){case hd:t="Linear";break;case ud:t="Reinhard";break;case dd:t="OptimizedCineon";break;case fd:t="ACESFilmic";break;case pd:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function w0(s){return[s.extensionDerivatives||s.envMapCubeUV||s.bumpMap||s.tangentSpaceNormalMap||s.clearcoatNormalMap||s.flatShading||s.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(s.extensionFragDepth||s.logarithmicDepthBuffer)&&s.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",s.extensionDrawBuffers&&s.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(s.extensionShaderTextureLOD||s.envMap||s.transmission)&&s.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Bi).join(`
`)}function S0(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function T0(s,e){const t={},n=s.getProgramParameter(e,35721);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),a=r.name;let o=1;r.type===35674&&(o=2),r.type===35675&&(o=3),r.type===35676&&(o=4),t[a]={type:r.type,location:s.getAttribLocation(e,a),locationSize:o}}return t}function Bi(s){return s!==""}function vl(s,e){return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function xl(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const E0=/^[ \t]*#include +<([\w\d./]+)>/gm;function wa(s){return s.replace(E0,A0)}function A0(s,e){const t=Ce[e];if(t===void 0)throw new Error("Can not resolve #include <"+e+">");return wa(t)}const L0=/#pragma unroll_loop[\s]+?for \( int i \= (\d+)\; i < (\d+)\; i \+\+ \) \{([\s\S]+?)(?=\})\}/g,C0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function _l(s){return s.replace(C0,Ac).replace(L0,R0)}function R0(s,e,t,n){return console.warn("WebGLProgram: #pragma unroll_loop shader syntax is deprecated. Please use #pragma unroll_loop_start syntax instead."),Ac(s,e,t,n)}function Ac(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function yl(s){let e="precision "+s.precision+` float;
precision `+s.precision+" int;";return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function P0(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===tc?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===ku?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Ni&&(e="SHADOWMAP_TYPE_VSM"),e}function I0(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case as:case os:e="ENVMAP_TYPE_CUBE";break;case ls:case Fa:e="ENVMAP_TYPE_CUBE_UV";break}return e}function D0(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case os:case Fa:e="ENVMAP_MODE_REFRACTION";break}return e}function F0(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case ss:e="ENVMAP_BLENDING_MULTIPLY";break;case ld:e="ENVMAP_BLENDING_MIX";break;case cd:e="ENVMAP_BLENDING_ADD";break}return e}function N0(s,e,t,n){const i=s.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=P0(t),c=I0(t),h=D0(t),u=F0(t),d=s.gammaFactor>0?s.gammaFactor:1,f=t.isWebGL2?"":w0(t),m=S0(r),v=i.createProgram();let x,p,g=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(x=[m].filter(Bi).join(`
`),x.length>0&&(x+=`
`),p=[f,m].filter(Bi).join(`
`),p.length>0&&(p+=`
`)):(x=[yl(t),"#define SHADER_NAME "+t.shaderName,m,t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.supportsVertexTextures?"#define VERTEX_TEXTURES":"","#define GAMMA_FACTOR "+d,"#define MAX_BONES "+t.maxBones,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMap&&t.objectSpaceNormalMap?"#define OBJECTSPACE_NORMALMAP":"",t.normalMap&&t.tangentSpaceNormalMap?"#define TANGENTSPACE_NORMALMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.displacementMap&&t.supportsVertexTextures?"#define USE_DISPLACEMENTMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularIntensityMap?"#define USE_SPECULARINTENSITYMAP":"",t.specularTintMap?"#define USE_SPECULARTINTMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUvs?"#define USE_UV":"",t.uvsVertexOnly?"#define UVS_VERTEX_ONLY":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.useVertexTexture?"#define BONE_TEXTURE":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_MORPHTARGETS","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Bi).join(`
`),p=[f,yl(t),"#define SHADER_NAME "+t.shaderName,m,"#define GAMMA_FACTOR "+d,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMap&&t.objectSpaceNormalMap?"#define OBJECTSPACE_NORMALMAP":"",t.normalMap&&t.tangentSpaceNormalMap?"#define TANGENTSPACE_NORMALMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularIntensityMap?"#define USE_SPECULARINTENSITYMAP":"",t.specularTintMap?"#define USE_SPECULARTINTMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.sheenTint?"#define USE_SHEEN":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUvs?"#define USE_UV":"",t.uvsVertexOnly?"#define UVS_VERTEX_ONLY":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.physicallyCorrectLights?"#define PHYSICALLY_CORRECT_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"",(t.extensionShaderTextureLOD||t.envMap)&&t.rendererExtensionShaderTextureLod?"#define TEXTURE_LOD_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==En?"#define TONE_MAPPING":"",t.toneMapping!==En?Ce.tonemapping_pars_fragment:"",t.toneMapping!==En?M0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.format===un?"#define OPAQUE":"",Ce.encodings_pars_fragment,t.map?Xn("mapTexelToLinear",t.mapEncoding):"",t.matcap?Xn("matcapTexelToLinear",t.matcapEncoding):"",t.envMap?Xn("envMapTexelToLinear",t.envMapEncoding):"",t.emissiveMap?Xn("emissiveMapTexelToLinear",t.emissiveMapEncoding):"",t.specularTintMap?Xn("specularTintMapTexelToLinear",t.specularTintMapEncoding):"",t.lightMap?Xn("lightMapTexelToLinear",t.lightMapEncoding):"",b0("linearToOutputTexel",t.outputEncoding),t.depthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Bi).join(`
`)),a=wa(a),a=vl(a,t),a=xl(a,t),o=wa(o),o=vl(o,t),o=xl(o,t),a=_l(a),o=_l(o),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(g=`#version 300 es
`,x=["#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,p=["#define varying in",t.glslVersion===Wo?"":"out highp vec4 pc_fragColor;",t.glslVersion===Wo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const w=g+x+a,M=g+p+o,T=ml(i,35633,w),L=ml(i,35632,M);if(i.attachShader(v,T),i.attachShader(v,L),t.index0AttributeName!==void 0?i.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(v,0,"position"),i.linkProgram(v),s.debug.checkShaderErrors){const W=i.getProgramInfoLog(v).trim(),C=i.getShaderInfoLog(T).trim(),A=i.getShaderInfoLog(L).trim();let V=!0,P=!0;if(i.getProgramParameter(v,35714)===!1){V=!1;const N=gl(i,T,"vertex"),O=gl(i,L,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(v,35715)+`

Program Info Log: `+W+`
`+N+`
`+O)}else W!==""?console.warn("THREE.WebGLProgram: Program Info Log:",W):(C===""||A==="")&&(P=!1);P&&(this.diagnostics={runnable:V,programLog:W,vertexShader:{log:C,prefix:x},fragmentShader:{log:A,prefix:p}})}i.deleteShader(T),i.deleteShader(L);let _;this.getUniforms=function(){return _===void 0&&(_=new fn(i,v)),_};let F;return this.getAttributes=function(){return F===void 0&&(F=T0(i,v)),F},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(v),this.program=void 0},this.name=t.shaderName,this.id=_0++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=T,this.fragmentShader=L,this}function B0(s,e,t,n,i,r,a){const o=[],l=i.isWebGL2,c=i.logarithmicDepthBuffer,h=i.floatVertexTextures,u=i.maxVertexUniforms,d=i.vertexTextures;let f=i.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"},v=["precision","isWebGL2","supportsVertexTextures","outputEncoding","instancing","instancingColor","map","mapEncoding","matcap","matcapEncoding","envMap","envMapMode","envMapEncoding","envMapCubeUV","lightMap","lightMapEncoding","aoMap","emissiveMap","emissiveMapEncoding","bumpMap","normalMap","objectSpaceNormalMap","tangentSpaceNormalMap","clearcoat","clearcoatMap","clearcoatRoughnessMap","clearcoatNormalMap","displacementMap","specularMap","specularIntensityMap","specularTintMap","specularTintMapEncoding","roughnessMap","metalnessMap","gradientMap","alphaMap","alphaTest","combine","vertexColors","vertexAlphas","vertexTangents","vertexUvs","uvsVertexOnly","fog","useFog","fogExp2","flatShading","sizeAttenuation","logarithmicDepthBuffer","skinning","maxBones","useVertexTexture","morphTargets","morphNormals","premultipliedAlpha","numDirLights","numPointLights","numSpotLights","numHemiLights","numRectAreaLights","numDirLightShadows","numPointLightShadows","numSpotLightShadows","shadowMapEnabled","shadowMapType","toneMapping","physicallyCorrectLights","doubleSided","flipSided","numClippingPlanes","numClipIntersection","depthPacking","dithering","format","sheenTint","transmission","transmissionMap","thicknessMap"];function x(_){const W=_.skeleton.bones;if(h)return 1024;{const A=Math.floor((u-20)/4),V=Math.min(A,W.length);return V<W.length?(console.warn("THREE.WebGLRenderer: Skeleton has "+W.length+" bones. This GPU supports "+V+"."),0):V}}function p(_){let F;return _&&_.isTexture?F=_.encoding:_&&_.isWebGLRenderTarget?(console.warn("THREE.WebGLPrograms.getTextureEncodingFromMap: don't use render targets as textures. Use their .texture property instead."),F=_.texture.encoding):F=_t,F}function g(_,F,W,C,A){const V=C.fog,P=_.isMeshStandardMaterial?C.environment:null,N=(_.isMeshStandardMaterial?t:e).get(_.envMap||P),O=m[_.type],B=A.isSkinnedMesh?x(A):0;_.precision!==null&&(f=i.getMaxPrecision(_.precision),f!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",f,"instead."));let I,q;if(O){const X=zt[O];I=X.vertexShader,q=X.fragmentShader}else I=_.vertexShader,q=_.fragmentShader;const $=s.getRenderTarget(),ie=_.alphaTest>0,K=_.clearcoat>0;return{isWebGL2:l,shaderID:O,shaderName:_.type,vertexShader:I,fragmentShader:q,defines:_.defines,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:f,instancing:A.isInstancedMesh===!0,instancingColor:A.isInstancedMesh===!0&&A.instanceColor!==null,supportsVertexTextures:d,outputEncoding:$!==null?p($.texture):s.outputEncoding,map:!!_.map,mapEncoding:p(_.map),matcap:!!_.matcap,matcapEncoding:p(_.matcap),envMap:!!N,envMapMode:N&&N.mapping,envMapEncoding:p(N),envMapCubeUV:!!N&&(N.mapping===ls||N.mapping===Fa),lightMap:!!_.lightMap,lightMapEncoding:p(_.lightMap),aoMap:!!_.aoMap,emissiveMap:!!_.emissiveMap,emissiveMapEncoding:p(_.emissiveMap),bumpMap:!!_.bumpMap,normalMap:!!_.normalMap,objectSpaceNormalMap:_.normalMapType===gf,tangentSpaceNormalMap:_.normalMapType===di,clearcoat:K,clearcoatMap:K&&!!_.clearcoatMap,clearcoatRoughnessMap:K&&!!_.clearcoatRoughnessMap,clearcoatNormalMap:K&&!!_.clearcoatNormalMap,displacementMap:!!_.displacementMap,roughnessMap:!!_.roughnessMap,metalnessMap:!!_.metalnessMap,specularMap:!!_.specularMap,specularIntensityMap:!!_.specularIntensityMap,specularTintMap:!!_.specularTintMap,specularTintMapEncoding:p(_.specularTintMap),alphaMap:!!_.alphaMap,alphaTest:ie,gradientMap:!!_.gradientMap,sheenTint:!!_.sheenTint&&(_.sheenTint.r>0||_.sheenTint.g>0||_.sheenTint.b>0),transmission:_.transmission>0,transmissionMap:!!_.transmissionMap,thicknessMap:!!_.thicknessMap,combine:_.combine,vertexTangents:!!_.normalMap&&!!A.geometry&&!!A.geometry.attributes.tangent,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!A.geometry&&!!A.geometry.attributes.color&&A.geometry.attributes.color.itemSize===4,vertexUvs:!!_.map||!!_.bumpMap||!!_.normalMap||!!_.specularMap||!!_.alphaMap||!!_.emissiveMap||!!_.roughnessMap||!!_.metalnessMap||!!_.clearcoatMap||!!_.clearcoatRoughnessMap||!!_.clearcoatNormalMap||!!_.displacementMap||!!_.transmissionMap||!!_.thicknessMap||!!_.specularIntensityMap||!!_.specularTintMap,uvsVertexOnly:!(!!_.map||!!_.bumpMap||!!_.normalMap||!!_.specularMap||!!_.alphaMap||!!_.emissiveMap||!!_.roughnessMap||!!_.metalnessMap||!!_.clearcoatNormalMap||_.transmission>0||!!_.transmissionMap||!!_.thicknessMap||!!_.specularIntensityMap||!!_.specularTintMap)&&!!_.displacementMap,fog:!!V,useFog:_.fog,fogExp2:V&&V.isFogExp2,flatShading:!!_.flatShading,sizeAttenuation:_.sizeAttenuation,logarithmicDepthBuffer:c,skinning:A.isSkinnedMesh===!0&&B>0,maxBones:B,useVertexTexture:h,morphTargets:!!A.geometry&&!!A.geometry.morphAttributes.position,morphNormals:!!A.geometry&&!!A.geometry.morphAttributes.normal,numDirLights:F.directional.length,numPointLights:F.point.length,numSpotLights:F.spot.length,numRectAreaLights:F.rectArea.length,numHemiLights:F.hemi.length,numDirLightShadows:F.directionalShadowMap.length,numPointLightShadows:F.pointShadowMap.length,numSpotLightShadows:F.spotShadowMap.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,format:_.format,dithering:_.dithering,shadowMapEnabled:s.shadowMap.enabled&&W.length>0,shadowMapType:s.shadowMap.type,toneMapping:_.toneMapped?s.toneMapping:En,physicallyCorrectLights:s.physicallyCorrectLights,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===oi,flipSided:_.side===Xe,depthPacking:_.depthPacking!==void 0?_.depthPacking:!1,index0AttributeName:_.index0AttributeName,extensionDerivatives:_.extensions&&_.extensions.derivatives,extensionFragDepth:_.extensions&&_.extensions.fragDepth,extensionDrawBuffers:_.extensions&&_.extensions.drawBuffers,extensionShaderTextureLOD:_.extensions&&_.extensions.shaderTextureLOD,rendererExtensionFragDepth:l||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:l||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:l||n.has("EXT_shader_texture_lod"),customProgramCacheKey:_.customProgramCacheKey()}}function w(_){const F=[];if(_.shaderID?F.push(_.shaderID):(F.push(_.fragmentShader),F.push(_.vertexShader)),_.defines!==void 0)for(const W in _.defines)F.push(W),F.push(_.defines[W]);if(_.isRawShaderMaterial===!1){for(let W=0;W<v.length;W++)F.push(_[v[W]]);F.push(s.outputEncoding),F.push(s.gammaFactor)}return F.push(_.customProgramCacheKey),F.join()}function M(_){const F=m[_.type];let W;if(F){const C=zt[F];W=Ff.clone(C.uniforms)}else W=_.uniforms;return W}function T(_,F){let W;for(let C=0,A=o.length;C<A;C++){const V=o[C];if(V.cacheKey===F){W=V,++W.usedTimes;break}}return W===void 0&&(W=new N0(s,F,_,r),o.push(W)),W}function L(_){if(--_.usedTimes===0){const F=o.indexOf(_);o[F]=o[o.length-1],o.pop(),_.destroy()}}return{getParameters:g,getProgramCacheKey:w,getUniforms:M,acquireProgram:T,releaseProgram:L,programs:o}}function z0(){let s=new WeakMap;function e(r){let a=s.get(r);return a===void 0&&(a={},s.set(r,a)),a}function t(r){s.delete(r)}function n(r,a,o){s.get(r)[a]=o}function i(){s=new WeakMap}return{get:e,remove:t,update:n,dispose:i}}function U0(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.program!==e.program?s.program.id-e.program.id:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function bl(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function Ml(s){const e=[];let t=0;const n=[],i=[],r=[],a={id:-1};function o(){t=0,n.length=0,i.length=0,r.length=0}function l(f,m,v,x,p,g){let w=e[t];const M=s.get(v);return w===void 0?(w={id:f.id,object:f,geometry:m,material:v,program:M.program||a,groupOrder:x,renderOrder:f.renderOrder,z:p,group:g},e[t]=w):(w.id=f.id,w.object=f,w.geometry=m,w.material=v,w.program=M.program||a,w.groupOrder=x,w.renderOrder=f.renderOrder,w.z=p,w.group=g),t++,w}function c(f,m,v,x,p,g){const w=l(f,m,v,x,p,g);v.transmission>0?i.push(w):v.transparent===!0?r.push(w):n.push(w)}function h(f,m,v,x,p,g){const w=l(f,m,v,x,p,g);v.transmission>0?i.unshift(w):v.transparent===!0?r.unshift(w):n.unshift(w)}function u(f,m){n.length>1&&n.sort(f||U0),i.length>1&&i.sort(m||bl),r.length>1&&r.sort(m||bl)}function d(){for(let f=t,m=e.length;f<m;f++){const v=e[f];if(v.id===null)break;v.id=null,v.object=null,v.geometry=null,v.material=null,v.program=null,v.group=null}}return{opaque:n,transmissive:i,transparent:r,init:o,push:c,unshift:h,finish:d,sort:u}}function O0(s){let e=new WeakMap;function t(i,r){let a;return e.has(i)===!1?(a=new Ml(s),e.set(i,[a])):r>=e.get(i).length?(a=new Ml(s),e.get(i).push(a)):a=e.get(i)[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}function H0(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new E,color:new ve};break;case"SpotLight":t={position:new E,direction:new E,color:new ve,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new E,color:new ve,distance:0,decay:0};break;case"HemisphereLight":t={direction:new E,skyColor:new ve,groundColor:new ve};break;case"RectAreaLight":t={color:new ve,position:new E,halfWidth:new E,halfHeight:new E};break}return s[e.id]=t,t}}}function G0(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new te};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new te};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new te,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let k0=0;function V0(s,e){return(e.castShadow?1:0)-(s.castShadow?1:0)}function W0(s,e){const t=new H0,n=G0(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotShadow:[],spotShadowMap:[],spotShadowMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[]};for(let h=0;h<9;h++)i.probe.push(new E);const r=new E,a=new be,o=new be;function l(h,u){let d=0,f=0,m=0;for(let W=0;W<9;W++)i.probe[W].set(0,0,0);let v=0,x=0,p=0,g=0,w=0,M=0,T=0,L=0;h.sort(V0);const _=u!==!0?Math.PI:1;for(let W=0,C=h.length;W<C;W++){const A=h[W],V=A.color,P=A.intensity,N=A.distance,O=A.shadow&&A.shadow.map?A.shadow.map.texture:null;if(A.isAmbientLight)d+=V.r*P*_,f+=V.g*P*_,m+=V.b*P*_;else if(A.isLightProbe)for(let B=0;B<9;B++)i.probe[B].addScaledVector(A.sh.coefficients[B],P);else if(A.isDirectionalLight){const B=t.get(A);if(B.color.copy(A.color).multiplyScalar(A.intensity*_),A.castShadow){const I=A.shadow,q=n.get(A);q.shadowBias=I.bias,q.shadowNormalBias=I.normalBias,q.shadowRadius=I.radius,q.shadowMapSize=I.mapSize,i.directionalShadow[v]=q,i.directionalShadowMap[v]=O,i.directionalShadowMatrix[v]=A.shadow.matrix,M++}i.directional[v]=B,v++}else if(A.isSpotLight){const B=t.get(A);if(B.position.setFromMatrixPosition(A.matrixWorld),B.color.copy(V).multiplyScalar(P*_),B.distance=N,B.coneCos=Math.cos(A.angle),B.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),B.decay=A.decay,A.castShadow){const I=A.shadow,q=n.get(A);q.shadowBias=I.bias,q.shadowNormalBias=I.normalBias,q.shadowRadius=I.radius,q.shadowMapSize=I.mapSize,i.spotShadow[p]=q,i.spotShadowMap[p]=O,i.spotShadowMatrix[p]=A.shadow.matrix,L++}i.spot[p]=B,p++}else if(A.isRectAreaLight){const B=t.get(A);B.color.copy(V).multiplyScalar(P),B.halfWidth.set(A.width*.5,0,0),B.halfHeight.set(0,A.height*.5,0),i.rectArea[g]=B,g++}else if(A.isPointLight){const B=t.get(A);if(B.color.copy(A.color).multiplyScalar(A.intensity*_),B.distance=A.distance,B.decay=A.decay,A.castShadow){const I=A.shadow,q=n.get(A);q.shadowBias=I.bias,q.shadowNormalBias=I.normalBias,q.shadowRadius=I.radius,q.shadowMapSize=I.mapSize,q.shadowCameraNear=I.camera.near,q.shadowCameraFar=I.camera.far,i.pointShadow[x]=q,i.pointShadowMap[x]=O,i.pointShadowMatrix[x]=A.shadow.matrix,T++}i.point[x]=B,x++}else if(A.isHemisphereLight){const B=t.get(A);B.skyColor.copy(A.color).multiplyScalar(P*_),B.groundColor.copy(A.groundColor).multiplyScalar(P*_),i.hemi[w]=B,w++}}g>0&&(e.isWebGL2||s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ne.LTC_FLOAT_1,i.rectAreaLTC2=ne.LTC_FLOAT_2):s.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=ne.LTC_HALF_1,i.rectAreaLTC2=ne.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=d,i.ambient[1]=f,i.ambient[2]=m;const F=i.hash;(F.directionalLength!==v||F.pointLength!==x||F.spotLength!==p||F.rectAreaLength!==g||F.hemiLength!==w||F.numDirectionalShadows!==M||F.numPointShadows!==T||F.numSpotShadows!==L)&&(i.directional.length=v,i.spot.length=p,i.rectArea.length=g,i.point.length=x,i.hemi.length=w,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.pointShadow.length=T,i.pointShadowMap.length=T,i.spotShadow.length=L,i.spotShadowMap.length=L,i.directionalShadowMatrix.length=M,i.pointShadowMatrix.length=T,i.spotShadowMatrix.length=L,F.directionalLength=v,F.pointLength=x,F.spotLength=p,F.rectAreaLength=g,F.hemiLength=w,F.numDirectionalShadows=M,F.numPointShadows=T,F.numSpotShadows=L,i.version=k0++)}function c(h,u){let d=0,f=0,m=0,v=0,x=0;const p=u.matrixWorldInverse;for(let g=0,w=h.length;g<w;g++){const M=h[g];if(M.isDirectionalLight){const T=i.directional[d];T.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),T.direction.sub(r),T.direction.transformDirection(p),d++}else if(M.isSpotLight){const T=i.spot[m];T.position.setFromMatrixPosition(M.matrixWorld),T.position.applyMatrix4(p),T.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),T.direction.sub(r),T.direction.transformDirection(p),m++}else if(M.isRectAreaLight){const T=i.rectArea[v];T.position.setFromMatrixPosition(M.matrixWorld),T.position.applyMatrix4(p),o.identity(),a.copy(M.matrixWorld),a.premultiply(p),o.extractRotation(a),T.halfWidth.set(M.width*.5,0,0),T.halfHeight.set(0,M.height*.5,0),T.halfWidth.applyMatrix4(o),T.halfHeight.applyMatrix4(o),v++}else if(M.isPointLight){const T=i.point[f];T.position.setFromMatrixPosition(M.matrixWorld),T.position.applyMatrix4(p),f++}else if(M.isHemisphereLight){const T=i.hemi[x];T.direction.setFromMatrixPosition(M.matrixWorld),T.direction.transformDirection(p),T.direction.normalize(),x++}}}return{setup:l,setupView:c,state:i}}function wl(s,e){const t=new W0(s,e),n=[],i=[];function r(){n.length=0,i.length=0}function a(u){n.push(u)}function o(u){i.push(u)}function l(u){t.setup(n,u)}function c(u){t.setupView(n,u)}return{init:r,state:{lightsArray:n,shadowsArray:i,lights:t},setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function q0(s,e){let t=new WeakMap;function n(r,a=0){let o;return t.has(r)===!1?(o=new wl(s,e),t.set(r,[o])):a>=t.get(r).length?(o=new wl(s,e),t.get(r).push(o)):o=t.get(r)[a],o}function i(){t=new WeakMap}return{get:n,dispose:i}}class Lc extends lt{constructor(e){super(),this.type="MeshDepthMaterial",this.depthPacking=pf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}Lc.prototype.isMeshDepthMaterial=!0;class Cc extends lt{constructor(e){super(),this.type="MeshDistanceMaterial",this.referencePosition=new E,this.nearDistance=1,this.farDistance=1e3,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.fog=!1,this.setValues(e)}copy(e){return super.copy(e),this.referencePosition.copy(e.referencePosition),this.nearDistance=e.nearDistance,this.farDistance=e.farDistance,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}Cc.prototype.isMeshDistanceMaterial=!0;var X0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
uniform float samples;
#include <packing>
void main() {
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`,Y0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`;function Rc(s,e,t){let n=new ds;const i=new te,r=new te,a=new ze,o=new Lc({depthPacking:mf}),l=new Cc,c={},h=t.maxTextureSize,u={0:Xe,1:Vi,2:oi},d=new Ln({uniforms:{shadow_pass:{value:null},resolution:{value:new te},radius:{value:4},samples:{value:8}},vertexShader:Y0,fragmentShader:X0}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const m=new Oe;m.setAttribute("position",new Ye(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new dt(m,d),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=tc,this.render=function(M,T,L){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||M.length===0)return;const _=s.getRenderTarget(),F=s.getActiveCubeFace(),W=s.getActiveMipmapLevel(),C=s.state;C.setBlending(hn),C.buffers.color.setClear(1,1,1,1),C.buffers.depth.setTest(!0),C.setScissorTest(!1);for(let A=0,V=M.length;A<V;A++){const P=M[A],N=P.shadow;if(N===void 0){console.warn("THREE.WebGLShadowMap:",P,"has no shadow.");continue}if(N.autoUpdate===!1&&N.needsUpdate===!1)continue;i.copy(N.mapSize);const O=N.getFrameExtents();if(i.multiply(O),r.copy(N.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/O.x),i.x=r.x*O.x,N.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/O.y),i.y=r.y*O.y,N.mapSize.y=r.y)),N.map===null&&!N.isPointLightShadow&&this.type===Ni){const I={minFilter:Et,magFilter:Et,format:St};N.map=new Ht(i.x,i.y,I),N.map.texture.name=P.name+".shadowMap",N.mapPass=new Ht(i.x,i.y,I),N.camera.updateProjectionMatrix()}if(N.map===null){const I={minFilter:Je,magFilter:Je,format:St};N.map=new Ht(i.x,i.y,I),N.map.texture.name=P.name+".shadowMap",N.camera.updateProjectionMatrix()}s.setRenderTarget(N.map),s.clear();const B=N.getViewportCount();for(let I=0;I<B;I++){const q=N.getViewport(I);a.set(r.x*q.x,r.y*q.y,r.x*q.z,r.y*q.w),C.viewport(a),N.updateMatrices(P,I),n=N.getFrustum(),w(T,L,N.camera,P,this.type)}!N.isPointLightShadow&&this.type===Ni&&p(N,L),N.needsUpdate=!1}x.needsUpdate=!1,s.setRenderTarget(_,F,W)};function p(M,T){const L=e.update(v);d.uniforms.shadow_pass.value=M.map.texture,d.uniforms.resolution.value=M.mapSize,d.uniforms.radius.value=M.radius,d.uniforms.samples.value=M.blurSamples,s.setRenderTarget(M.mapPass),s.clear(),s.renderBufferDirect(T,null,L,d,v,null),f.uniforms.shadow_pass.value=M.mapPass.texture,f.uniforms.resolution.value=M.mapSize,f.uniforms.radius.value=M.radius,f.uniforms.samples.value=M.blurSamples,s.setRenderTarget(M.map),s.clear(),s.renderBufferDirect(T,null,L,f,v,null)}function g(M,T,L,_,F,W,C){let A=null;const V=_.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(V!==void 0?A=V:A=_.isPointLight===!0?l:o,s.localClippingEnabled&&L.clipShadows===!0&&L.clippingPlanes.length!==0||L.displacementMap&&L.displacementScale!==0||L.alphaMap&&L.alphaTest>0){const P=A.uuid,N=L.uuid;let O=c[P];O===void 0&&(O={},c[P]=O);let B=O[N];B===void 0&&(B=A.clone(),O[N]=B),A=B}return A.visible=L.visible,A.wireframe=L.wireframe,C===Ni?A.side=L.shadowSide!==null?L.shadowSide:L.side:A.side=L.shadowSide!==null?L.shadowSide:u[L.side],A.alphaMap=L.alphaMap,A.alphaTest=L.alphaTest,A.clipShadows=L.clipShadows,A.clippingPlanes=L.clippingPlanes,A.clipIntersection=L.clipIntersection,A.displacementMap=L.displacementMap,A.displacementScale=L.displacementScale,A.displacementBias=L.displacementBias,A.wireframeLinewidth=L.wireframeLinewidth,A.linewidth=L.linewidth,_.isPointLight===!0&&A.isMeshDistanceMaterial===!0&&(A.referencePosition.setFromMatrixPosition(_.matrixWorld),A.nearDistance=F,A.farDistance=W),A}function w(M,T,L,_,F){if(M.visible===!1)return;if(M.layers.test(T.layers)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&F===Ni)&&(!M.frustumCulled||n.intersectsObject(M))){M.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,M.matrixWorld);const A=e.update(M),V=M.material;if(Array.isArray(V)){const P=A.groups;for(let N=0,O=P.length;N<O;N++){const B=P[N],I=V[B.materialIndex];if(I&&I.visible){const q=g(M,A,I,_,L.near,L.far,F);s.renderBufferDirect(L,null,A,q,M,B)}}}else if(V.visible){const P=g(M,A,V,_,L.near,L.far,F);s.renderBufferDirect(L,null,A,P,M,null)}}const C=M.children;for(let A=0,V=C.length;A<V;A++)w(C[A],T,L,_,F)}}function Z0(s,e,t){const n=t.isWebGL2;function i(){let R=!1;const ae=new ze;let Y=null;const he=new ze(0,0,0,0);return{setMask:function(me){Y!==me&&!R&&(s.colorMask(me,me,me,me),Y=me)},setLocked:function(me){R=me},setClear:function(me,Re,it,rt,$t){$t===!0&&(me*=rt,Re*=rt,it*=rt),ae.set(me,Re,it,rt),he.equals(ae)===!1&&(s.clearColor(me,Re,it,rt),he.copy(ae))},reset:function(){R=!1,Y=null,he.set(-1,0,0,0)}}}function r(){let R=!1,ae=null,Y=null,he=null;return{setTest:function(me){me?Q(2929):oe(2929)},setMask:function(me){ae!==me&&!R&&(s.depthMask(me),ae=me)},setFunc:function(me){if(Y!==me){if(me)switch(me){case td:s.depthFunc(512);break;case nd:s.depthFunc(519);break;case id:s.depthFunc(513);break;case va:s.depthFunc(515);break;case rd:s.depthFunc(514);break;case sd:s.depthFunc(518);break;case ad:s.depthFunc(516);break;case od:s.depthFunc(517);break;default:s.depthFunc(515)}else s.depthFunc(515);Y=me}},setLocked:function(me){R=me},setClear:function(me){he!==me&&(s.clearDepth(me),he=me)},reset:function(){R=!1,ae=null,Y=null,he=null}}}function a(){let R=!1,ae=null,Y=null,he=null,me=null,Re=null,it=null,rt=null,$t=null;return{setTest:function(ke){R||(ke?Q(2960):oe(2960))},setMask:function(ke){ae!==ke&&!R&&(s.stencilMask(ke),ae=ke)},setFunc:function(ke,Vt,Wt){(Y!==ke||he!==Vt||me!==Wt)&&(s.stencilFunc(ke,Vt,Wt),Y=ke,he=Vt,me=Wt)},setOp:function(ke,Vt,Wt){(Re!==ke||it!==Vt||rt!==Wt)&&(s.stencilOp(ke,Vt,Wt),Re=ke,it=Vt,rt=Wt)},setLocked:function(ke){R=ke},setClear:function(ke){$t!==ke&&(s.clearStencil(ke),$t=ke)},reset:function(){R=!1,ae=null,Y=null,he=null,me=null,Re=null,it=null,rt=null,$t=null}}}const o=new i,l=new r,c=new a;let h={},u=null,d={},f=null,m=!1,v=null,x=null,p=null,g=null,w=null,M=null,T=null,L=!1,_=null,F=null,W=null,C=null,A=null;const V=s.getParameter(35661);let P=!1,N=0;const O=s.getParameter(7938);O.indexOf("WebGL")!==-1?(N=parseFloat(/^WebGL (\d)/.exec(O)[1]),P=N>=1):O.indexOf("OpenGL ES")!==-1&&(N=parseFloat(/^OpenGL ES (\d)/.exec(O)[1]),P=N>=2);let B=null,I={};const q=s.getParameter(3088),$=s.getParameter(2978),ie=new ze().fromArray(q),K=new ze().fromArray($);function de(R,ae,Y){const he=new Uint8Array(4),me=s.createTexture();s.bindTexture(R,me),s.texParameteri(R,10241,9728),s.texParameteri(R,10240,9728);for(let Re=0;Re<Y;Re++)s.texImage2D(ae+Re,0,6408,1,1,0,6408,5121,he);return me}const X={};X[3553]=de(3553,3553,1),X[34067]=de(34067,34069,6),o.setClear(0,0,0,1),l.setClear(1),c.setClear(0),Q(2929),l.setFunc(va),j(!1),ee(Eo),Q(2884),Ee(hn);function Q(R){h[R]!==!0&&(s.enable(R),h[R]=!0)}function oe(R){h[R]!==!1&&(s.disable(R),h[R]=!1)}function U(R){R!==u&&(s.bindFramebuffer(36160,R),u=R)}function ue(R,ae){return ae===null&&u!==null&&(ae=u),d[R]!==ae?(s.bindFramebuffer(R,ae),d[R]=ae,n&&(R===36009&&(d[36160]=ae),R===36160&&(d[36009]=ae)),!0):!1}function _e(R){return f!==R?(s.useProgram(R),f=R,!0):!1}const le={[Qn]:32774,[Wu]:32778,[qu]:32779};if(n)le[Ro]=32775,le[Po]=32776;else{const R=e.get("EXT_blend_minmax");R!==null&&(le[Ro]=R.MIN_EXT,le[Po]=R.MAX_EXT)}const pe={[Xu]:0,[Yu]:1,[Zu]:768,[ic]:770,[ed]:776,[$u]:774,[Ju]:772,[ju]:769,[rc]:771,[Ku]:775,[Qu]:773};function Ee(R,ae,Y,he,me,Re,it,rt){if(R===hn){m===!0&&(oe(3042),m=!1);return}if(m===!1&&(Q(3042),m=!0),R!==Vu){if(R!==v||rt!==L){if((x!==Qn||w!==Qn)&&(s.blendEquation(32774),x=Qn,w=Qn),rt)switch(R){case Ui:s.blendFuncSeparate(1,771,1,771);break;case Ao:s.blendFunc(1,1);break;case Lo:s.blendFuncSeparate(0,0,769,771);break;case Co:s.blendFuncSeparate(0,768,0,770);break;default:console.error("THREE.WebGLState: Invalid blending: ",R);break}else switch(R){case Ui:s.blendFuncSeparate(770,771,1,771);break;case Ao:s.blendFunc(770,1);break;case Lo:s.blendFunc(0,769);break;case Co:s.blendFunc(0,768);break;default:console.error("THREE.WebGLState: Invalid blending: ",R);break}p=null,g=null,M=null,T=null,v=R,L=rt}return}me=me||ae,Re=Re||Y,it=it||he,(ae!==x||me!==w)&&(s.blendEquationSeparate(le[ae],le[me]),x=ae,w=me),(Y!==p||he!==g||Re!==M||it!==T)&&(s.blendFuncSeparate(pe[Y],pe[he],pe[Re],pe[it]),p=Y,g=he,M=Re,T=it),v=R,L=null}function k(R,ae){R.side===oi?oe(2884):Q(2884);let Y=R.side===Xe;ae&&(Y=!Y),j(Y),R.blending===Ui&&R.transparent===!1?Ee(hn):Ee(R.blending,R.blendEquation,R.blendSrc,R.blendDst,R.blendEquationAlpha,R.blendSrcAlpha,R.blendDstAlpha,R.premultipliedAlpha),l.setFunc(R.depthFunc),l.setTest(R.depthTest),l.setMask(R.depthWrite),o.setMask(R.colorWrite);const he=R.stencilWrite;c.setTest(he),he&&(c.setMask(R.stencilWriteMask),c.setFunc(R.stencilFunc,R.stencilRef,R.stencilFuncMask),c.setOp(R.stencilFail,R.stencilZFail,R.stencilZPass)),re(R.polygonOffset,R.polygonOffsetFactor,R.polygonOffsetUnits),R.alphaToCoverage===!0?Q(32926):oe(32926)}function j(R){_!==R&&(R?s.frontFace(2304):s.frontFace(2305),_=R)}function ee(R){R!==Hu?(Q(2884),R!==F&&(R===Eo?s.cullFace(1029):R===Gu?s.cullFace(1028):s.cullFace(1032))):oe(2884),F=R}function fe(R){R!==W&&(P&&s.lineWidth(R),W=R)}function re(R,ae,Y){R?(Q(32823),(C!==ae||A!==Y)&&(s.polygonOffset(ae,Y),C=ae,A=Y)):oe(32823)}function S(R){R?Q(3089):oe(3089)}function b(R){R===void 0&&(R=33984+V-1),B!==R&&(s.activeTexture(R),B=R)}function G(R,ae){B===null&&b();let Y=I[B];Y===void 0&&(Y={type:void 0,texture:void 0},I[B]=Y),(Y.type!==R||Y.texture!==ae)&&(s.bindTexture(R,ae||X[R]),Y.type=R,Y.texture=ae)}function Z(){const R=I[B];R!==void 0&&R.type!==void 0&&(s.bindTexture(R.type,null),R.type=void 0,R.texture=void 0)}function se(){try{s.compressedTexImage2D.apply(s,arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function ce(){try{s.texImage2D.apply(s,arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function we(){try{s.texImage3D.apply(s,arguments)}catch(R){console.error("THREE.WebGLState:",R)}}function xe(R){ie.equals(R)===!1&&(s.scissor(R.x,R.y,R.z,R.w),ie.copy(R))}function Te(R){K.equals(R)===!1&&(s.viewport(R.x,R.y,R.z,R.w),K.copy(R))}function ge(){s.disable(3042),s.disable(2884),s.disable(2929),s.disable(32823),s.disable(3089),s.disable(2960),s.disable(32926),s.blendEquation(32774),s.blendFunc(1,0),s.blendFuncSeparate(1,0,1,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(513),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(519,0,4294967295),s.stencilOp(7680,7680,7680),s.clearStencil(0),s.cullFace(1029),s.frontFace(2305),s.polygonOffset(0,0),s.activeTexture(33984),s.bindFramebuffer(36160,null),n===!0&&(s.bindFramebuffer(36009,null),s.bindFramebuffer(36008,null)),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),h={},B=null,I={},u=null,d={},f=null,m=!1,v=null,x=null,p=null,g=null,w=null,M=null,T=null,L=!1,_=null,F=null,W=null,C=null,A=null,ie.set(0,0,s.canvas.width,s.canvas.height),K.set(0,0,s.canvas.width,s.canvas.height),o.reset(),l.reset(),c.reset()}return{buffers:{color:o,depth:l,stencil:c},enable:Q,disable:oe,bindFramebuffer:ue,bindXRFramebuffer:U,useProgram:_e,setBlending:Ee,setMaterial:k,setFlipSided:j,setCullFace:ee,setLineWidth:fe,setPolygonOffset:re,setScissorTest:S,activeTexture:b,bindTexture:G,unbindTexture:Z,compressedTexImage2D:se,texImage2D:ce,texImage3D:we,scissor:xe,viewport:Te,reset:ge}}function j0(s,e,t,n,i,r,a){const o=i.isWebGL2,l=i.maxTextures,c=i.maxCubemapSize,h=i.maxTextureSize,u=i.maxSamples,d=new WeakMap;let f,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(S,b){return m?new OffscreenCanvas(S,b):document.createElementNS("http://www.w3.org/1999/xhtml","canvas")}function x(S,b,G,Z){let se=1;if((S.width>Z||S.height>Z)&&(se=Z/Math.max(S.width,S.height)),se<1||b===!0)if(typeof HTMLImageElement<"u"&&S instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&S instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&S instanceof ImageBitmap){const ce=b?_f:Math.floor,we=ce(se*S.width),xe=ce(se*S.height);f===void 0&&(f=v(we,xe));const Te=G?v(we,xe):f;return Te.width=we,Te.height=xe,Te.getContext("2d").drawImage(S,0,0,we,xe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+S.width+"x"+S.height+") to ("+we+"x"+xe+")."),Te}else return"data"in S&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+S.width+"x"+S.height+")."),S;return S}function p(S){return qo(S.width)&&qo(S.height)}function g(S){return o?!1:S.wrapS!==wt||S.wrapT!==wt||S.minFilter!==Je&&S.minFilter!==Et}function w(S,b){return S.generateMipmaps&&b&&S.minFilter!==Je&&S.minFilter!==Et}function M(S,b,G,Z,se=1){s.generateMipmap(S);const ce=n.get(b);ce.__maxMipLevel=Math.log2(Math.max(G,Z,se))}function T(S,b,G){if(o===!1)return b;if(S!==null){if(s[S]!==void 0)return s[S];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+S+"'")}let Z=b;return b===6403&&(G===5126&&(Z=33326),G===5131&&(Z=33325),G===5121&&(Z=33321)),b===6407&&(G===5126&&(Z=34837),G===5131&&(Z=34843),G===5121&&(Z=32849)),b===6408&&(G===5126&&(Z=34836),G===5131&&(Z=34842),G===5121&&(Z=32856)),(Z===33325||Z===33326||Z===34842||Z===34836)&&e.get("EXT_color_buffer_float"),Z}function L(S){return S===Je||S===Io||S===Do?9728:9729}function _(S){const b=S.target;b.removeEventListener("dispose",_),W(b),b.isVideoTexture&&d.delete(b),a.memory.textures--}function F(S){const b=S.target;b.removeEventListener("dispose",F),C(b)}function W(S){const b=n.get(S);b.__webglInit!==void 0&&(s.deleteTexture(b.__webglTexture),n.remove(S))}function C(S){const b=S.texture,G=n.get(S),Z=n.get(b);if(!!S){if(Z.__webglTexture!==void 0&&(s.deleteTexture(Z.__webglTexture),a.memory.textures--),S.depthTexture&&S.depthTexture.dispose(),S.isWebGLCubeRenderTarget)for(let se=0;se<6;se++)s.deleteFramebuffer(G.__webglFramebuffer[se]),G.__webglDepthbuffer&&s.deleteRenderbuffer(G.__webglDepthbuffer[se]);else s.deleteFramebuffer(G.__webglFramebuffer),G.__webglDepthbuffer&&s.deleteRenderbuffer(G.__webglDepthbuffer),G.__webglMultisampledFramebuffer&&s.deleteFramebuffer(G.__webglMultisampledFramebuffer),G.__webglColorRenderbuffer&&s.deleteRenderbuffer(G.__webglColorRenderbuffer),G.__webglDepthRenderbuffer&&s.deleteRenderbuffer(G.__webglDepthRenderbuffer);if(S.isWebGLMultipleRenderTargets)for(let se=0,ce=b.length;se<ce;se++){const we=n.get(b[se]);we.__webglTexture&&(s.deleteTexture(we.__webglTexture),a.memory.textures--),n.remove(b[se])}n.remove(b),n.remove(S)}}let A=0;function V(){A=0}function P(){const S=A;return S>=l&&console.warn("THREE.WebGLTextures: Trying to use "+S+" texture units while this GPU supports only "+l),A+=1,S}function N(S,b){const G=n.get(S);if(S.isVideoTexture&&k(S),S.version>0&&G.__version!==S.version){const Z=S.image;if(Z===void 0)console.warn("THREE.WebGLRenderer: Texture marked for update but image is undefined");else if(Z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{de(G,S,b);return}}t.activeTexture(33984+b),t.bindTexture(3553,G.__webglTexture)}function O(S,b){const G=n.get(S);if(S.version>0&&G.__version!==S.version){de(G,S,b);return}t.activeTexture(33984+b),t.bindTexture(35866,G.__webglTexture)}function B(S,b){const G=n.get(S);if(S.version>0&&G.__version!==S.version){de(G,S,b);return}t.activeTexture(33984+b),t.bindTexture(32879,G.__webglTexture)}function I(S,b){const G=n.get(S);if(S.version>0&&G.__version!==S.version){X(G,S,b);return}t.activeTexture(33984+b),t.bindTexture(34067,G.__webglTexture)}const q={[ya]:10497,[wt]:33071,[ba]:33648},$={[Je]:9728,[Io]:9984,[Do]:9986,[Et]:9729,[md]:9985,[cs]:9987};function ie(S,b,G){if(G?(s.texParameteri(S,10242,q[b.wrapS]),s.texParameteri(S,10243,q[b.wrapT]),(S===32879||S===35866)&&s.texParameteri(S,32882,q[b.wrapR]),s.texParameteri(S,10240,$[b.magFilter]),s.texParameteri(S,10241,$[b.minFilter])):(s.texParameteri(S,10242,33071),s.texParameteri(S,10243,33071),(S===32879||S===35866)&&s.texParameteri(S,32882,33071),(b.wrapS!==wt||b.wrapT!==wt)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),s.texParameteri(S,10240,L(b.magFilter)),s.texParameteri(S,10241,L(b.minFilter)),b.minFilter!==Je&&b.minFilter!==Et&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),e.has("EXT_texture_filter_anisotropic")===!0){const Z=e.get("EXT_texture_filter_anisotropic");if(b.type===Tn&&e.has("OES_texture_float_linear")===!1||o===!1&&b.type===ii&&e.has("OES_texture_half_float_linear")===!1)return;(b.anisotropy>1||n.get(b).__currentAnisotropy)&&(s.texParameterf(S,Z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,i.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy)}}function K(S,b){S.__webglInit===void 0&&(S.__webglInit=!0,b.addEventListener("dispose",_),S.__webglTexture=s.createTexture(),a.memory.textures++)}function de(S,b,G){let Z=3553;b.isDataTexture2DArray&&(Z=35866),b.isDataTexture3D&&(Z=32879),K(S,b),t.activeTexture(33984+G),t.bindTexture(Z,S.__webglTexture),s.pixelStorei(37440,b.flipY),s.pixelStorei(37441,b.premultiplyAlpha),s.pixelStorei(3317,b.unpackAlignment),s.pixelStorei(37443,0);const se=g(b)&&p(b.image)===!1,ce=x(b.image,se,!1,h),we=p(ce)||o,xe=r.convert(b.format);let Te=r.convert(b.type),ge=T(b.internalFormat,xe,Te);ie(Z,b,we);let R;const ae=b.mipmaps;if(b.isDepthTexture)ge=6402,o?b.type===Tn?ge=36012:b.type===kr?ge=33190:b.type===Oi?ge=35056:ge=33189:b.type===Tn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),b.format===ri&&ge===6402&&b.type!==Xr&&b.type!==kr&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),b.type=Xr,Te=r.convert(b.type)),b.format===Wi&&ge===6402&&(ge=34041,b.type!==Oi&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),b.type=Oi,Te=r.convert(b.type))),t.texImage2D(3553,0,ge,ce.width,ce.height,0,xe,Te,null);else if(b.isDataTexture)if(ae.length>0&&we){for(let Y=0,he=ae.length;Y<he;Y++)R=ae[Y],t.texImage2D(3553,Y,ge,R.width,R.height,0,xe,Te,R.data);b.generateMipmaps=!1,S.__maxMipLevel=ae.length-1}else t.texImage2D(3553,0,ge,ce.width,ce.height,0,xe,Te,ce.data),S.__maxMipLevel=0;else if(b.isCompressedTexture){for(let Y=0,he=ae.length;Y<he;Y++)R=ae[Y],b.format!==St&&b.format!==un?xe!==null?t.compressedTexImage2D(3553,Y,ge,R.width,R.height,0,R.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):t.texImage2D(3553,Y,ge,R.width,R.height,0,xe,Te,R.data);S.__maxMipLevel=ae.length-1}else if(b.isDataTexture2DArray)t.texImage3D(35866,0,ge,ce.width,ce.height,ce.depth,0,xe,Te,ce.data),S.__maxMipLevel=0;else if(b.isDataTexture3D)t.texImage3D(32879,0,ge,ce.width,ce.height,ce.depth,0,xe,Te,ce.data),S.__maxMipLevel=0;else if(ae.length>0&&we){for(let Y=0,he=ae.length;Y<he;Y++)R=ae[Y],t.texImage2D(3553,Y,ge,xe,Te,R);b.generateMipmaps=!1,S.__maxMipLevel=ae.length-1}else t.texImage2D(3553,0,ge,xe,Te,ce),S.__maxMipLevel=0;w(b,we)&&M(Z,b,ce.width,ce.height),S.__version=b.version,b.onUpdate&&b.onUpdate(b)}function X(S,b,G){if(b.image.length!==6)return;K(S,b),t.activeTexture(33984+G),t.bindTexture(34067,S.__webglTexture),s.pixelStorei(37440,b.flipY),s.pixelStorei(37441,b.premultiplyAlpha),s.pixelStorei(3317,b.unpackAlignment),s.pixelStorei(37443,0);const Z=b&&(b.isCompressedTexture||b.image[0].isCompressedTexture),se=b.image[0]&&b.image[0].isDataTexture,ce=[];for(let Y=0;Y<6;Y++)!Z&&!se?ce[Y]=x(b.image[Y],!1,!0,c):ce[Y]=se?b.image[Y].image:b.image[Y];const we=ce[0],xe=p(we)||o,Te=r.convert(b.format),ge=r.convert(b.type),R=T(b.internalFormat,Te,ge);ie(34067,b,xe);let ae;if(Z){for(let Y=0;Y<6;Y++){ae=ce[Y].mipmaps;for(let he=0;he<ae.length;he++){const me=ae[he];b.format!==St&&b.format!==un?Te!==null?t.compressedTexImage2D(34069+Y,he,R,me.width,me.height,0,me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):t.texImage2D(34069+Y,he,R,me.width,me.height,0,Te,ge,me.data)}}S.__maxMipLevel=ae.length-1}else{ae=b.mipmaps;for(let Y=0;Y<6;Y++)if(se){t.texImage2D(34069+Y,0,R,ce[Y].width,ce[Y].height,0,Te,ge,ce[Y].data);for(let he=0;he<ae.length;he++){const Re=ae[he].image[Y].image;t.texImage2D(34069+Y,he+1,R,Re.width,Re.height,0,Te,ge,Re.data)}}else{t.texImage2D(34069+Y,0,R,Te,ge,ce[Y]);for(let he=0;he<ae.length;he++){const me=ae[he];t.texImage2D(34069+Y,he+1,R,Te,ge,me.image[Y])}}S.__maxMipLevel=ae.length}w(b,xe)&&M(34067,b,we.width,we.height),S.__version=b.version,b.onUpdate&&b.onUpdate(b)}function Q(S,b,G,Z,se){const ce=r.convert(G.format),we=r.convert(G.type),xe=T(G.internalFormat,ce,we);se===32879||se===35866?t.texImage3D(se,0,xe,b.width,b.height,b.depth,0,ce,we,null):t.texImage2D(se,0,xe,b.width,b.height,0,ce,we,null),t.bindFramebuffer(36160,S),s.framebufferTexture2D(36160,Z,se,n.get(G).__webglTexture,0),t.bindFramebuffer(36160,null)}function oe(S,b,G){if(s.bindRenderbuffer(36161,S),b.depthBuffer&&!b.stencilBuffer){let Z=33189;if(G){const se=b.depthTexture;se&&se.isDepthTexture&&(se.type===Tn?Z=36012:se.type===kr&&(Z=33190));const ce=Ee(b);s.renderbufferStorageMultisample(36161,ce,Z,b.width,b.height)}else s.renderbufferStorage(36161,Z,b.width,b.height);s.framebufferRenderbuffer(36160,36096,36161,S)}else if(b.depthBuffer&&b.stencilBuffer){if(G){const Z=Ee(b);s.renderbufferStorageMultisample(36161,Z,35056,b.width,b.height)}else s.renderbufferStorage(36161,34041,b.width,b.height);s.framebufferRenderbuffer(36160,33306,36161,S)}else{const Z=b.isWebGLMultipleRenderTargets===!0?b.texture[0]:b.texture,se=r.convert(Z.format),ce=r.convert(Z.type),we=T(Z.internalFormat,se,ce);if(G){const xe=Ee(b);s.renderbufferStorageMultisample(36161,xe,we,b.width,b.height)}else s.renderbufferStorage(36161,we,b.width,b.height)}s.bindRenderbuffer(36161,null)}function U(S,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(36160,S),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(b.depthTexture).__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),N(b.depthTexture,0);const Z=n.get(b.depthTexture).__webglTexture;if(b.depthTexture.format===ri)s.framebufferTexture2D(36160,36096,3553,Z,0);else if(b.depthTexture.format===Wi)s.framebufferTexture2D(36160,33306,3553,Z,0);else throw new Error("Unknown depthTexture format")}function ue(S){const b=n.get(S),G=S.isWebGLCubeRenderTarget===!0;if(S.depthTexture){if(G)throw new Error("target.depthTexture not supported in Cube render targets");U(b.__webglFramebuffer,S)}else if(G){b.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)t.bindFramebuffer(36160,b.__webglFramebuffer[Z]),b.__webglDepthbuffer[Z]=s.createRenderbuffer(),oe(b.__webglDepthbuffer[Z],S,!1)}else t.bindFramebuffer(36160,b.__webglFramebuffer),b.__webglDepthbuffer=s.createRenderbuffer(),oe(b.__webglDepthbuffer,S,!1);t.bindFramebuffer(36160,null)}function _e(S){const b=S.texture,G=n.get(S),Z=n.get(b);S.addEventListener("dispose",F),S.isWebGLMultipleRenderTargets!==!0&&(Z.__webglTexture=s.createTexture(),Z.__version=b.version,a.memory.textures++);const se=S.isWebGLCubeRenderTarget===!0,ce=S.isWebGLMultipleRenderTargets===!0,we=S.isWebGLMultisampleRenderTarget===!0,xe=b.isDataTexture3D||b.isDataTexture2DArray,Te=p(S)||o;if(o&&b.format===un&&(b.type===Tn||b.type===ii)&&(b.format=St,console.warn("THREE.WebGLRenderer: Rendering to textures with RGB format is not supported. Using RGBA format instead.")),se){G.__webglFramebuffer=[];for(let ge=0;ge<6;ge++)G.__webglFramebuffer[ge]=s.createFramebuffer()}else if(G.__webglFramebuffer=s.createFramebuffer(),ce)if(i.drawBuffers){const ge=S.texture;for(let R=0,ae=ge.length;R<ae;R++){const Y=n.get(ge[R]);Y.__webglTexture===void 0&&(Y.__webglTexture=s.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");else if(we)if(o){G.__webglMultisampledFramebuffer=s.createFramebuffer(),G.__webglColorRenderbuffer=s.createRenderbuffer(),s.bindRenderbuffer(36161,G.__webglColorRenderbuffer);const ge=r.convert(b.format),R=r.convert(b.type),ae=T(b.internalFormat,ge,R),Y=Ee(S);s.renderbufferStorageMultisample(36161,Y,ae,S.width,S.height),t.bindFramebuffer(36160,G.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(36160,36064,36161,G.__webglColorRenderbuffer),s.bindRenderbuffer(36161,null),S.depthBuffer&&(G.__webglDepthRenderbuffer=s.createRenderbuffer(),oe(G.__webglDepthRenderbuffer,S,!0)),t.bindFramebuffer(36160,null)}else console.warn("THREE.WebGLRenderer: WebGLMultisampleRenderTarget can only be used with WebGL2.");if(se){t.bindTexture(34067,Z.__webglTexture),ie(34067,b,Te);for(let ge=0;ge<6;ge++)Q(G.__webglFramebuffer[ge],S,b,36064,34069+ge);w(b,Te)&&M(34067,b,S.width,S.height),t.unbindTexture()}else if(ce){const ge=S.texture;for(let R=0,ae=ge.length;R<ae;R++){const Y=ge[R],he=n.get(Y);t.bindTexture(3553,he.__webglTexture),ie(3553,Y,Te),Q(G.__webglFramebuffer,S,Y,36064+R,3553),w(Y,Te)&&M(3553,Y,S.width,S.height)}t.unbindTexture()}else{let ge=3553;xe&&(o?ge=b.isDataTexture3D?32879:35866:console.warn("THREE.DataTexture3D and THREE.DataTexture2DArray only supported with WebGL2.")),t.bindTexture(ge,Z.__webglTexture),ie(ge,b,Te),Q(G.__webglFramebuffer,S,b,36064,ge),w(b,Te)&&M(ge,b,S.width,S.height,S.depth),t.unbindTexture()}S.depthBuffer&&ue(S)}function le(S){const b=p(S)||o,G=S.isWebGLMultipleRenderTargets===!0?S.texture:[S.texture];for(let Z=0,se=G.length;Z<se;Z++){const ce=G[Z];if(w(ce,b)){const we=S.isWebGLCubeRenderTarget?34067:3553,xe=n.get(ce).__webglTexture;t.bindTexture(we,xe),M(we,ce,S.width,S.height),t.unbindTexture()}}}function pe(S){if(S.isWebGLMultisampleRenderTarget)if(o){const b=S.width,G=S.height;let Z=16384;S.depthBuffer&&(Z|=256),S.stencilBuffer&&(Z|=1024);const se=n.get(S);t.bindFramebuffer(36008,se.__webglMultisampledFramebuffer),t.bindFramebuffer(36009,se.__webglFramebuffer),s.blitFramebuffer(0,0,b,G,0,0,b,G,Z,9728),t.bindFramebuffer(36008,null),t.bindFramebuffer(36009,se.__webglMultisampledFramebuffer)}else console.warn("THREE.WebGLRenderer: WebGLMultisampleRenderTarget can only be used with WebGL2.")}function Ee(S){return o&&S.isWebGLMultisampleRenderTarget?Math.min(u,S.samples):0}function k(S){const b=a.render.frame;d.get(S)!==b&&(d.set(S,b),S.update())}let j=!1,ee=!1;function fe(S,b){S&&S.isWebGLRenderTarget&&(j===!1&&(console.warn("THREE.WebGLTextures.safeSetTexture2D: don't use render targets as textures. Use their .texture property instead."),j=!0),S=S.texture),N(S,b)}function re(S,b){S&&S.isWebGLCubeRenderTarget&&(ee===!1&&(console.warn("THREE.WebGLTextures.safeSetTextureCube: don't use cube render targets as textures. Use their .texture property instead."),ee=!0),S=S.texture),I(S,b)}this.allocateTextureUnit=P,this.resetTextureUnits=V,this.setTexture2D=N,this.setTexture2DArray=O,this.setTexture3D=B,this.setTextureCube=I,this.setupRenderTarget=_e,this.updateRenderTargetMipmap=le,this.updateMultisampleRenderTarget=pe,this.safeSetTexture2D=fe,this.safeSetTextureCube=re}function J0(s,e,t){const n=t.isWebGL2;function i(r){let a;if(r===li)return 5121;if(r===_d)return 32819;if(r===yd)return 32820;if(r===bd)return 33635;if(r===gd)return 5120;if(r===vd)return 5122;if(r===Xr)return 5123;if(r===xd)return 5124;if(r===kr)return 5125;if(r===Tn)return 5126;if(r===ii)return n?5131:(a=e.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===Md)return 6406;if(r===un)return 6407;if(r===St)return 6408;if(r===wd)return 6409;if(r===Sd)return 6410;if(r===ri)return 6402;if(r===Wi)return 34041;if(r===Ed)return 6403;if(r===Ad)return 36244;if(r===Ld)return 33319;if(r===Cd)return 33320;if(r===Rd)return 36248;if(r===Pd)return 36249;if(r===Fo||r===No||r===Bo||r===zo)if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===Fo)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===No)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Bo)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===zo)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Uo||r===Oo||r===Ho||r===Go)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===Uo)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Oo)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Ho)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Go)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Id)return a=e.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if((r===ko||r===Vo)&&(a=e.get("WEBGL_compressed_texture_etc"),a!==null)){if(r===ko)return a.COMPRESSED_RGB8_ETC2;if(r===Vo)return a.COMPRESSED_RGBA8_ETC2_EAC}if(r===Dd||r===Fd||r===Nd||r===Bd||r===zd||r===Ud||r===Od||r===Hd||r===Gd||r===kd||r===Vd||r===Wd||r===qd||r===Xd||r===Zd||r===jd||r===Jd||r===Qd||r===$d||r===Kd||r===ef||r===tf||r===nf||r===rf||r===sf||r===af||r===of||r===lf)return a=e.get("WEBGL_compressed_texture_astc"),a!==null?r:null;if(r===Yd)return a=e.get("EXT_texture_compression_bptc"),a!==null?r:null;if(r===Oi)return n?34042:(a=e.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null)}return{convert:i}}class Pc extends ht{constructor(e=[]){super(),this.cameras=e}}Pc.prototype.isArrayCamera=!0;class zi extends De{constructor(){super(),this.type="Group"}}zi.prototype.isGroup=!0;const Q0={type:"move"};class sa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new zi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new zi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new E,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new E),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new zi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new E,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new E),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred")if(o!==null&&(i=t.getPose(e.targetRaySpace,n),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Q0))),c&&e.hand){a=!0;for(const v of e.hand.values()){const x=t.getJointPose(v,n);if(c.joints[v.jointName]===void 0){const g=new zi;g.matrixAutoUpdate=!1,g.visible=!1,c.joints[v.jointName]=g,c.add(g)}const p=c.joints[v.jointName];x!==null&&(p.matrix.fromArray(x.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.jointRadius=x.radius),p.visible=x!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,m=.005;c.inputState.pinching&&d>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}}class $0 extends Cn{constructor(e,t){super();const n=this,i=e.state;let r=null,a=1,o=null,l="local-floor",c=null,h=null,u=null,d=null,f=null,m=!1,v=null,x=null,p=null,g=null,w=null,M=null;const T=[],L=new Map,_=new ht;_.layers.enable(1),_.viewport=new ze;const F=new ht;F.layers.enable(2),F.viewport=new ze;const W=[_,F],C=new Pc;C.layers.enable(1),C.layers.enable(2);let A=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let Q=T[X];return Q===void 0&&(Q=new sa,T[X]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(X){let Q=T[X];return Q===void 0&&(Q=new sa,T[X]=Q),Q.getGripSpace()},this.getHand=function(X){let Q=T[X];return Q===void 0&&(Q=new sa,T[X]=Q),Q.getHandSpace()};function P(X){const Q=L.get(X.inputSource);Q&&Q.dispatchEvent({type:X.type,data:X.inputSource})}function N(){L.forEach(function(X,Q){X.disconnect(Q)}),L.clear(),A=null,V=null,i.bindXRFramebuffer(null),e.setRenderTarget(e.getRenderTarget()),u&&t.deleteFramebuffer(u),v&&t.deleteFramebuffer(v),x&&t.deleteRenderbuffer(x),p&&t.deleteRenderbuffer(p),u=null,v=null,x=null,p=null,f=null,d=null,h=null,r=null,de.stop(),n.isPresenting=!1,n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){a=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){l=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return o},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(X){if(r=X,r!==null){r.addEventListener("select",P),r.addEventListener("selectstart",P),r.addEventListener("selectend",P),r.addEventListener("squeeze",P),r.addEventListener("squeezestart",P),r.addEventListener("squeezeend",P),r.addEventListener("end",N),r.addEventListener("inputsourceschange",O);const Q=t.getContextAttributes();if(Q.xrCompatible!==!0&&await t.makeXRCompatible(),r.renderState.layers===void 0){const oe={antialias:Q.antialias,alpha:Q.alpha,depth:Q.depth,stencil:Q.stencil,framebufferScaleFactor:a};f=new XRWebGLLayer(r,t,oe),r.updateRenderState({baseLayer:f})}else if(t instanceof WebGLRenderingContext){const oe={antialias:!0,alpha:Q.alpha,depth:Q.depth,stencil:Q.stencil,framebufferScaleFactor:a};f=new XRWebGLLayer(r,t,oe),r.updateRenderState({layers:[f]})}else{m=Q.antialias;let oe=null;Q.depth&&(M=256,Q.stencil&&(M|=1024),w=Q.stencil?33306:36096,oe=Q.stencil?35056:33190);const U={colorFormat:Q.alpha?32856:32849,depthFormat:oe,scaleFactor:a};h=new XRWebGLBinding(r,t),d=h.createProjectionLayer(U),u=t.createFramebuffer(),r.updateRenderState({layers:[d]}),m&&(v=t.createFramebuffer(),x=t.createRenderbuffer(),t.bindRenderbuffer(36161,x),t.renderbufferStorageMultisample(36161,4,32856,d.textureWidth,d.textureHeight),i.bindFramebuffer(36160,v),t.framebufferRenderbuffer(36160,36064,36161,x),t.bindRenderbuffer(36161,null),oe!==null&&(p=t.createRenderbuffer(),t.bindRenderbuffer(36161,p),t.renderbufferStorageMultisample(36161,4,oe,d.textureWidth,d.textureHeight),t.framebufferRenderbuffer(36160,w,36161,p),t.bindRenderbuffer(36161,null)),i.bindFramebuffer(36160,null))}o=await r.requestReferenceSpace(l),de.setContext(r),de.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}};function O(X){const Q=r.inputSources;for(let oe=0;oe<T.length;oe++)L.set(Q[oe],T[oe]);for(let oe=0;oe<X.removed.length;oe++){const U=X.removed[oe],ue=L.get(U);ue&&(ue.dispatchEvent({type:"disconnected",data:U}),L.delete(U))}for(let oe=0;oe<X.added.length;oe++){const U=X.added[oe],ue=L.get(U);ue&&ue.dispatchEvent({type:"connected",data:U})}}const B=new E,I=new E;function q(X,Q,oe){B.setFromMatrixPosition(Q.matrixWorld),I.setFromMatrixPosition(oe.matrixWorld);const U=B.distanceTo(I),ue=Q.projectionMatrix.elements,_e=oe.projectionMatrix.elements,le=ue[14]/(ue[10]-1),pe=ue[14]/(ue[10]+1),Ee=(ue[9]+1)/ue[5],k=(ue[9]-1)/ue[5],j=(ue[8]-1)/ue[0],ee=(_e[8]+1)/_e[0],fe=le*j,re=le*ee,S=U/(-j+ee),b=S*-j;Q.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(b),X.translateZ(S),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert();const G=le+S,Z=pe+S,se=fe-b,ce=re+(U-b),we=Ee*pe/Z*G,xe=k*pe/Z*G;X.projectionMatrix.makePerspective(se,ce,we,xe,G,Z)}function $(X,Q){Q===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(Q.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(r===null)return;C.near=F.near=_.near=X.near,C.far=F.far=_.far=X.far,(A!==C.near||V!==C.far)&&(r.updateRenderState({depthNear:C.near,depthFar:C.far}),A=C.near,V=C.far);const Q=X.parent,oe=C.cameras;$(C,Q);for(let ue=0;ue<oe.length;ue++)$(oe[ue],Q);C.matrixWorld.decompose(C.position,C.quaternion,C.scale),X.position.copy(C.position),X.quaternion.copy(C.quaternion),X.scale.copy(C.scale),X.matrix.copy(C.matrix),X.matrixWorld.copy(C.matrixWorld);const U=X.children;for(let ue=0,_e=U.length;ue<_e;ue++)U[ue].updateMatrixWorld(!0);oe.length===2?q(C,_,F):C.projectionMatrix.copy(_.projectionMatrix)},this.getCamera=function(){return C},this.getFoveation=function(){if(d!==null)return d.fixedFoveation;if(f!==null)return f.fixedFoveation},this.setFoveation=function(X){d!==null&&(d.fixedFoveation=X),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=X)};let ie=null;function K(X,Q){if(c=Q.getViewerPose(o),g=Q,c!==null){const U=c.views;f!==null&&i.bindXRFramebuffer(f.framebuffer);let ue=!1;U.length!==C.cameras.length&&(C.cameras.length=0,ue=!0);for(let _e=0;_e<U.length;_e++){const le=U[_e];let pe=null;if(f!==null)pe=f.getViewport(le);else{const k=h.getViewSubImage(d,le);i.bindXRFramebuffer(u),k.depthStencilTexture!==void 0&&t.framebufferTexture2D(36160,w,3553,k.depthStencilTexture,0),t.framebufferTexture2D(36160,36064,3553,k.colorTexture,0),pe=k.viewport}const Ee=W[_e];Ee.matrix.fromArray(le.transform.matrix),Ee.projectionMatrix.fromArray(le.projectionMatrix),Ee.viewport.set(pe.x,pe.y,pe.width,pe.height),_e===0&&C.matrix.copy(Ee.matrix),ue===!0&&C.cameras.push(Ee)}m&&(i.bindXRFramebuffer(v),M!==null&&t.clear(M))}const oe=r.inputSources;for(let U=0;U<T.length;U++){const ue=T[U],_e=oe[U];ue.update(_e,Q,o)}if(ie&&ie(X,Q),m){const U=d.textureWidth,ue=d.textureHeight;i.bindFramebuffer(36008,v),i.bindFramebuffer(36009,u),t.invalidateFramebuffer(36008,[w]),t.invalidateFramebuffer(36009,[w]),t.blitFramebuffer(0,0,U,ue,0,0,U,ue,16384,9728),t.invalidateFramebuffer(36008,[36064]),i.bindFramebuffer(36008,null),i.bindFramebuffer(36009,null),i.bindFramebuffer(36160,v)}g=null}const de=new gc;de.setAnimationLoop(K),this.setAnimationLoop=function(X){ie=X},this.dispose=function(){}}}function K0(s){function e(p,g){p.fogColor.value.copy(g.color),g.isFog?(p.fogNear.value=g.near,p.fogFar.value=g.far):g.isFogExp2&&(p.fogDensity.value=g.density)}function t(p,g,w,M,T){g.isMeshBasicMaterial?n(p,g):g.isMeshLambertMaterial?(n(p,g),l(p,g)):g.isMeshToonMaterial?(n(p,g),h(p,g)):g.isMeshPhongMaterial?(n(p,g),c(p,g)):g.isMeshStandardMaterial?(n(p,g),g.isMeshPhysicalMaterial?d(p,g,T):u(p,g)):g.isMeshMatcapMaterial?(n(p,g),f(p,g)):g.isMeshDepthMaterial?(n(p,g),m(p,g)):g.isMeshDistanceMaterial?(n(p,g),v(p,g)):g.isMeshNormalMaterial?(n(p,g),x(p,g)):g.isLineBasicMaterial?(i(p,g),g.isLineDashedMaterial&&r(p,g)):g.isPointsMaterial?a(p,g,w,M):g.isSpriteMaterial?o(p,g):g.isShadowMaterial?(p.color.value.copy(g.color),p.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function n(p,g){p.opacity.value=g.opacity,g.color&&p.diffuse.value.copy(g.color),g.emissive&&p.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(p.map.value=g.map),g.alphaMap&&(p.alphaMap.value=g.alphaMap),g.specularMap&&(p.specularMap.value=g.specularMap),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest);const w=s.get(g).envMap;if(w){p.envMap.value=w,p.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=g.reflectivity,p.ior.value=g.ior,p.refractionRatio.value=g.refractionRatio;const L=s.get(w).__maxMipLevel;L!==void 0&&(p.maxMipLevel.value=L)}g.lightMap&&(p.lightMap.value=g.lightMap,p.lightMapIntensity.value=g.lightMapIntensity),g.aoMap&&(p.aoMap.value=g.aoMap,p.aoMapIntensity.value=g.aoMapIntensity);let M;g.map?M=g.map:g.specularMap?M=g.specularMap:g.displacementMap?M=g.displacementMap:g.normalMap?M=g.normalMap:g.bumpMap?M=g.bumpMap:g.roughnessMap?M=g.roughnessMap:g.metalnessMap?M=g.metalnessMap:g.alphaMap?M=g.alphaMap:g.emissiveMap?M=g.emissiveMap:g.clearcoatMap?M=g.clearcoatMap:g.clearcoatNormalMap?M=g.clearcoatNormalMap:g.clearcoatRoughnessMap?M=g.clearcoatRoughnessMap:g.specularIntensityMap?M=g.specularIntensityMap:g.specularTintMap?M=g.specularTintMap:g.transmissionMap?M=g.transmissionMap:g.thicknessMap&&(M=g.thicknessMap),M!==void 0&&(M.isWebGLRenderTarget&&(M=M.texture),M.matrixAutoUpdate===!0&&M.updateMatrix(),p.uvTransform.value.copy(M.matrix));let T;g.aoMap?T=g.aoMap:g.lightMap&&(T=g.lightMap),T!==void 0&&(T.isWebGLRenderTarget&&(T=T.texture),T.matrixAutoUpdate===!0&&T.updateMatrix(),p.uv2Transform.value.copy(T.matrix))}function i(p,g){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity}function r(p,g){p.dashSize.value=g.dashSize,p.totalSize.value=g.dashSize+g.gapSize,p.scale.value=g.scale}function a(p,g,w,M){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,p.size.value=g.size*w,p.scale.value=M*.5,g.map&&(p.map.value=g.map),g.alphaMap&&(p.alphaMap.value=g.alphaMap),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest);let T;g.map?T=g.map:g.alphaMap&&(T=g.alphaMap),T!==void 0&&(T.matrixAutoUpdate===!0&&T.updateMatrix(),p.uvTransform.value.copy(T.matrix))}function o(p,g){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,p.rotation.value=g.rotation,g.map&&(p.map.value=g.map),g.alphaMap&&(p.alphaMap.value=g.alphaMap),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest);let w;g.map?w=g.map:g.alphaMap&&(w=g.alphaMap),w!==void 0&&(w.matrixAutoUpdate===!0&&w.updateMatrix(),p.uvTransform.value.copy(w.matrix))}function l(p,g){g.emissiveMap&&(p.emissiveMap.value=g.emissiveMap)}function c(p,g){p.specular.value.copy(g.specular),p.shininess.value=Math.max(g.shininess,1e-4),g.emissiveMap&&(p.emissiveMap.value=g.emissiveMap),g.bumpMap&&(p.bumpMap.value=g.bumpMap,p.bumpScale.value=g.bumpScale,g.side===Xe&&(p.bumpScale.value*=-1)),g.normalMap&&(p.normalMap.value=g.normalMap,p.normalScale.value.copy(g.normalScale),g.side===Xe&&p.normalScale.value.negate()),g.displacementMap&&(p.displacementMap.value=g.displacementMap,p.displacementScale.value=g.displacementScale,p.displacementBias.value=g.displacementBias)}function h(p,g){g.gradientMap&&(p.gradientMap.value=g.gradientMap),g.emissiveMap&&(p.emissiveMap.value=g.emissiveMap),g.bumpMap&&(p.bumpMap.value=g.bumpMap,p.bumpScale.value=g.bumpScale,g.side===Xe&&(p.bumpScale.value*=-1)),g.normalMap&&(p.normalMap.value=g.normalMap,p.normalScale.value.copy(g.normalScale),g.side===Xe&&p.normalScale.value.negate()),g.displacementMap&&(p.displacementMap.value=g.displacementMap,p.displacementScale.value=g.displacementScale,p.displacementBias.value=g.displacementBias)}function u(p,g){p.roughness.value=g.roughness,p.metalness.value=g.metalness,g.roughnessMap&&(p.roughnessMap.value=g.roughnessMap),g.metalnessMap&&(p.metalnessMap.value=g.metalnessMap),g.emissiveMap&&(p.emissiveMap.value=g.emissiveMap),g.bumpMap&&(p.bumpMap.value=g.bumpMap,p.bumpScale.value=g.bumpScale,g.side===Xe&&(p.bumpScale.value*=-1)),g.normalMap&&(p.normalMap.value=g.normalMap,p.normalScale.value.copy(g.normalScale),g.side===Xe&&p.normalScale.value.negate()),g.displacementMap&&(p.displacementMap.value=g.displacementMap,p.displacementScale.value=g.displacementScale,p.displacementBias.value=g.displacementBias),s.get(g).envMap&&(p.envMapIntensity.value=g.envMapIntensity)}function d(p,g,w){u(p,g),p.ior.value=g.ior,g.sheenTint&&p.sheenTint.value.copy(g.sheenTint),g.clearcoat>0&&(p.clearcoat.value=g.clearcoat,p.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(p.clearcoatMap.value=g.clearcoatMap),g.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap),g.clearcoatNormalMap&&(p.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),p.clearcoatNormalMap.value=g.clearcoatNormalMap,g.side===Xe&&p.clearcoatNormalScale.value.negate())),g.transmission>0&&(p.transmission.value=g.transmission,p.transmissionSamplerMap.value=w.texture,p.transmissionSamplerSize.value.set(w.width,w.height),g.transmissionMap&&(p.transmissionMap.value=g.transmissionMap),p.thickness.value=g.thickness,g.thicknessMap&&(p.thicknessMap.value=g.thicknessMap),p.attenuationDistance.value=g.attenuationDistance,p.attenuationTint.value.copy(g.attenuationTint)),p.specularIntensity.value=g.specularIntensity,p.specularTint.value.copy(g.specularTint),g.specularIntensityMap&&(p.specularIntensityMap.value=g.specularIntensityMap),g.specularTintMap&&(p.specularTintMap.value=g.specularTintMap)}function f(p,g){g.matcap&&(p.matcap.value=g.matcap),g.bumpMap&&(p.bumpMap.value=g.bumpMap,p.bumpScale.value=g.bumpScale,g.side===Xe&&(p.bumpScale.value*=-1)),g.normalMap&&(p.normalMap.value=g.normalMap,p.normalScale.value.copy(g.normalScale),g.side===Xe&&p.normalScale.value.negate()),g.displacementMap&&(p.displacementMap.value=g.displacementMap,p.displacementScale.value=g.displacementScale,p.displacementBias.value=g.displacementBias)}function m(p,g){g.displacementMap&&(p.displacementMap.value=g.displacementMap,p.displacementScale.value=g.displacementScale,p.displacementBias.value=g.displacementBias)}function v(p,g){g.displacementMap&&(p.displacementMap.value=g.displacementMap,p.displacementScale.value=g.displacementScale,p.displacementBias.value=g.displacementBias),p.referencePosition.value.copy(g.referencePosition),p.nearDistance.value=g.nearDistance,p.farDistance.value=g.farDistance}function x(p,g){g.bumpMap&&(p.bumpMap.value=g.bumpMap,p.bumpScale.value=g.bumpScale,g.side===Xe&&(p.bumpScale.value*=-1)),g.normalMap&&(p.normalMap.value=g.normalMap,p.normalScale.value.copy(g.normalScale),g.side===Xe&&p.normalScale.value.negate()),g.displacementMap&&(p.displacementMap.value=g.displacementMap,p.displacementScale.value=g.displacementScale,p.displacementBias.value=g.displacementBias)}return{refreshFogUniforms:e,refreshMaterialUniforms:t}}function e1(){const s=document.createElementNS("http://www.w3.org/1999/xhtml","canvas");return s.style.display="block",s}function Be(s={}){const e=s.canvas!==void 0?s.canvas:e1(),t=s.context!==void 0?s.context:null,n=s.alpha!==void 0?s.alpha:!1,i=s.depth!==void 0?s.depth:!0,r=s.stencil!==void 0?s.stencil:!0,a=s.antialias!==void 0?s.antialias:!1,o=s.premultipliedAlpha!==void 0?s.premultipliedAlpha:!0,l=s.preserveDrawingBuffer!==void 0?s.preserveDrawingBuffer:!1,c=s.powerPreference!==void 0?s.powerPreference:"default",h=s.failIfMajorPerformanceCaveat!==void 0?s.failIfMajorPerformanceCaveat:!1;let u=null,d=null;const f=[],m=[];this.domElement=e,this.debug={checkShaderErrors:!0},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.gammaFactor=2,this.outputEncoding=_t,this.physicallyCorrectLights=!1,this.toneMapping=En,this.toneMappingExposure=1;const v=this;let x=!1,p=0,g=0,w=null,M=-1,T=null;const L=new ze,_=new ze;let F=null,W=e.width,C=e.height,A=1,V=null,P=null;const N=new ze(0,0,W,C),O=new ze(0,0,W,C);let B=!1;const I=[],q=new ds;let $=!1,ie=!1,K=null;const de=new be,X=new E,Q={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function oe(){return w===null?A:1}let U=t;function ue(y,z){for(let D=0;D<y.length;D++){const H=y[D],J=e.getContext(H,z);if(J!==null)return J}return null}try{const y={alpha:n,depth:i,stencil:r,antialias:a,premultipliedAlpha:o,preserveDrawingBuffer:l,powerPreference:c,failIfMajorPerformanceCaveat:h};if(e.addEventListener("webglcontextlost",it,!1),e.addEventListener("webglcontextrestored",rt,!1),U===null){const z=["webgl2","webgl","experimental-webgl"];if(v.isWebGL1Renderer===!0&&z.shift(),U=ue(z,y),U===null)throw ue(z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}U.getShaderPrecisionFormat===void 0&&(U.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(y){throw console.error("THREE.WebGLRenderer: "+y.message),y}let _e,le,pe,Ee,k,j,ee,fe,re,S,b,G,Z,se,ce,we,xe,Te,ge,R,ae,Y,he;function me(){_e=new wg(U),le=new mg(U,_e,s),_e.init(le),Y=new J0(U,_e,le),pe=new Z0(U,_e,le),I[0]=1029,Ee=new Eg,k=new z0,j=new j0(U,_e,pe,k,le,Y,Ee),ee=new vg(v),fe=new Mg(v),re=new Of(U,le),he=new fg(U,_e,re,le),S=new Sg(U,re,Ee,he),b=new Rg(U,S,re,Ee),ge=new Cg(U),we=new gg(k),G=new B0(v,ee,fe,_e,le,he,we),Z=new K0(k),se=new O0(k),ce=new q0(_e,le),Te=new dg(v,ee,pe,b,o),xe=new Rc(v,b,le),R=new pg(U,_e,Ee,le),ae=new Tg(U,_e,Ee,le),Ee.programs=G.programs,v.capabilities=le,v.extensions=_e,v.properties=k,v.renderLists=se,v.shadowMap=xe,v.state=pe,v.info=Ee}me();const Re=new $0(v,U);this.xr=Re,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const y=_e.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=_e.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return A},this.setPixelRatio=function(y){y!==void 0&&(A=y,this.setSize(W,C,!1))},this.getSize=function(y){return y.set(W,C)},this.setSize=function(y,z,D){if(Re.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=y,C=z,e.width=Math.floor(y*A),e.height=Math.floor(z*A),D!==!1&&(e.style.width=y+"px",e.style.height=z+"px"),this.setViewport(0,0,y,z)},this.getDrawingBufferSize=function(y){return y.set(W*A,C*A).floor()},this.setDrawingBufferSize=function(y,z,D){W=y,C=z,A=D,e.width=Math.floor(y*D),e.height=Math.floor(z*D),this.setViewport(0,0,y,z)},this.getCurrentViewport=function(y){return y.copy(L)},this.getViewport=function(y){return y.copy(N)},this.setViewport=function(y,z,D,H){y.isVector4?N.set(y.x,y.y,y.z,y.w):N.set(y,z,D,H),pe.viewport(L.copy(N).multiplyScalar(A).floor())},this.getScissor=function(y){return y.copy(O)},this.setScissor=function(y,z,D,H){y.isVector4?O.set(y.x,y.y,y.z,y.w):O.set(y,z,D,H),pe.scissor(_.copy(O).multiplyScalar(A).floor())},this.getScissorTest=function(){return B},this.setScissorTest=function(y){pe.setScissorTest(B=y)},this.setOpaqueSort=function(y){V=y},this.setTransparentSort=function(y){P=y},this.getClearColor=function(y){return y.copy(Te.getClearColor())},this.setClearColor=function(){Te.setClearColor.apply(Te,arguments)},this.getClearAlpha=function(){return Te.getClearAlpha()},this.setClearAlpha=function(){Te.setClearAlpha.apply(Te,arguments)},this.clear=function(y,z,D){let H=0;(y===void 0||y)&&(H|=16384),(z===void 0||z)&&(H|=256),(D===void 0||D)&&(H|=1024),U.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",it,!1),e.removeEventListener("webglcontextrestored",rt,!1),se.dispose(),ce.dispose(),k.dispose(),ee.dispose(),fe.dispose(),b.dispose(),he.dispose(),Re.dispose(),Re.removeEventListener("sessionstart",ao),Re.removeEventListener("sessionend",oo),K&&(K.dispose(),K=null),_n.stop()};function it(y){y.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),x=!0}function rt(){console.log("THREE.WebGLRenderer: Context Restored."),x=!1;const y=Ee.autoReset,z=xe.enabled,D=xe.autoUpdate,H=xe.needsUpdate,J=xe.type;me(),Ee.autoReset=y,xe.enabled=z,xe.autoUpdate=D,xe.needsUpdate=H,xe.type=J}function $t(y){const z=y.target;z.removeEventListener("dispose",$t),ke(z)}function ke(y){Vt(y),k.remove(y)}function Vt(y){const z=k.get(y).programs;z!==void 0&&z.forEach(function(D){G.releaseProgram(D)})}function Wt(y,z){y.render(function(D){v.renderBufferImmediate(D,z)})}this.renderBufferImmediate=function(y,z){he.initAttributes();const D=k.get(y);y.hasPositions&&!D.position&&(D.position=U.createBuffer()),y.hasNormals&&!D.normal&&(D.normal=U.createBuffer()),y.hasUvs&&!D.uv&&(D.uv=U.createBuffer()),y.hasColors&&!D.color&&(D.color=U.createBuffer());const H=z.getAttributes();y.hasPositions&&(U.bindBuffer(34962,D.position),U.bufferData(34962,y.positionArray,35048),he.enableAttribute(H.position.location),U.vertexAttribPointer(H.position.location,3,5126,!1,0,0)),y.hasNormals&&(U.bindBuffer(34962,D.normal),U.bufferData(34962,y.normalArray,35048),he.enableAttribute(H.normal.location),U.vertexAttribPointer(H.normal.location,3,5126,!1,0,0)),y.hasUvs&&(U.bindBuffer(34962,D.uv),U.bufferData(34962,y.uvArray,35048),he.enableAttribute(H.uv.location),U.vertexAttribPointer(H.uv.location,2,5126,!1,0,0)),y.hasColors&&(U.bindBuffer(34962,D.color),U.bufferData(34962,y.colorArray,35048),he.enableAttribute(H.color.location),U.vertexAttribPointer(H.color.location,3,5126,!1,0,0)),he.disableUnusedAttributes(),U.drawArrays(4,0,y.count),y.count=0},this.renderBufferDirect=function(y,z,D,H,J,Ae){z===null&&(z=Q);const Me=J.isMesh&&J.matrixWorld.determinant()<0,ye=uo(y,z,H,J);pe.setMaterial(H,Me);let Le=D.index;const Fe=D.attributes.position;if(Le===null){if(Fe===void 0||Fe.count===0)return}else if(Le.count===0)return;let Pe=1;H.wireframe===!0&&(Le=S.getWireframeAttribute(D),Pe=2),(D.morphAttributes.position!==void 0||D.morphAttributes.normal!==void 0)&&ge.update(J,D,H,ye),he.setup(J,H,ye,D,Le);let Ie,Se=R;Le!==null&&(Ie=re.get(Le),Se=ae,Se.setIndex(Ie));const yn=Le!==null?Le.count:Fe.count,We=D.drawRange.start*Pe,Kt=D.drawRange.count*Pe,Lt=Ae!==null?Ae.start*Pe:0,bn=Ae!==null?Ae.count*Pe:1/0,en=Math.max(We,Lt),Ze=Math.min(yn,We+Kt,Lt+bn)-1,Ft=Math.max(0,Ze-en+1);if(Ft!==0){if(J.isMesh)H.wireframe===!0?(pe.setLineWidth(H.wireframeLinewidth*oe()),Se.setMode(1)):Se.setMode(4);else if(J.isLine){let $e=H.linewidth;$e===void 0&&($e=1),pe.setLineWidth($e*oe()),J.isLineSegments?Se.setMode(1):J.isLineLoop?Se.setMode(2):Se.setMode(3)}else J.isPoints?Se.setMode(0):J.isSprite&&Se.setMode(4);if(J.isInstancedMesh)Se.renderInstances(en,Ft,J.count);else if(D.isInstancedBufferGeometry){const $e=Math.min(D.instanceCount,D._maxInstanceCount);Se.renderInstances(en,Ft,$e)}else Se.render(en,Ft)}},this.compile=function(y,z){d=ce.get(y),d.init(),m.push(d),y.traverseVisible(function(D){D.isLight&&D.layers.test(z.layers)&&(d.pushLight(D),D.castShadow&&d.pushShadow(D))}),d.setupLights(v.physicallyCorrectLights),y.traverse(function(D){const H=D.material;if(H)if(Array.isArray(H))for(let J=0;J<H.length;J++){const Ae=H[J];xs(Ae,y,D)}else xs(H,y,D)}),m.pop(),d=null};let vs=null;function nh(y){vs&&vs(y)}function ao(){_n.stop()}function oo(){_n.start()}const _n=new gc;_n.setAnimationLoop(nh),typeof window<"u"&&_n.setContext(window),this.setAnimationLoop=function(y){vs=y,Re.setAnimationLoop(y),y===null?_n.stop():_n.start()},Re.addEventListener("sessionstart",ao),Re.addEventListener("sessionend",oo),this.render=function(y,z){if(z!==void 0&&z.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(x===!0)return;y.autoUpdate===!0&&y.updateMatrixWorld(),z.parent===null&&z.updateMatrixWorld(),Re.enabled===!0&&Re.isPresenting===!0&&(Re.cameraAutoUpdate===!0&&Re.updateCamera(z),z=Re.getCamera()),y.isScene===!0&&y.onBeforeRender(v,y,z,w),d=ce.get(y,m.length),d.init(),m.push(d),de.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),q.setFromProjectionMatrix(de),ie=this.localClippingEnabled,$=we.init(this.clippingPlanes,ie,z),u=se.get(y,f.length),u.init(),f.push(u),lo(y,z,0,v.sortObjects),u.finish(),v.sortObjects===!0&&u.sort(V,P),$===!0&&we.beginShadows();const D=d.state.shadowsArray;if(xe.render(D,y,z),$===!0&&we.endShadows(),this.info.autoReset===!0&&this.info.reset(),Te.render(u,y),d.setupLights(v.physicallyCorrectLights),z.isArrayCamera){const H=z.cameras;for(let J=0,Ae=H.length;J<Ae;J++){const Me=H[J];co(u,y,Me,Me.viewport)}}else co(u,y,z);w!==null&&(j.updateMultisampleRenderTarget(w),j.updateRenderTargetMipmap(w)),y.isScene===!0&&y.onAfterRender(v,y,z),pe.buffers.depth.setTest(!0),pe.buffers.depth.setMask(!0),pe.buffers.color.setMask(!0),pe.setPolygonOffset(!1),he.resetDefaultState(),M=-1,T=null,m.pop(),m.length>0?d=m[m.length-1]:d=null,f.pop(),f.length>0?u=f[f.length-1]:u=null};function lo(y,z,D,H){if(y.visible===!1)return;if(y.layers.test(z.layers)){if(y.isGroup)D=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(z);else if(y.isLight)d.pushLight(y),y.castShadow&&d.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||q.intersectsSprite(y)){H&&X.setFromMatrixPosition(y.matrixWorld).applyMatrix4(de);const Me=b.update(y),ye=y.material;ye.visible&&u.push(y,Me,ye,D,X.z,null)}}else if(y.isImmediateRenderObject)H&&X.setFromMatrixPosition(y.matrixWorld).applyMatrix4(de),u.push(y,null,y.material,D,X.z,null);else if((y.isMesh||y.isLine||y.isPoints)&&(y.isSkinnedMesh&&y.skeleton.frame!==Ee.render.frame&&(y.skeleton.update(),y.skeleton.frame=Ee.render.frame),!y.frustumCulled||q.intersectsObject(y))){H&&X.setFromMatrixPosition(y.matrixWorld).applyMatrix4(de);const Me=b.update(y),ye=y.material;if(Array.isArray(ye)){const Le=Me.groups;for(let Fe=0,Pe=Le.length;Fe<Pe;Fe++){const Ie=Le[Fe],Se=ye[Ie.materialIndex];Se&&Se.visible&&u.push(y,Me,Se,D,X.z,Ie)}}else ye.visible&&u.push(y,Me,ye,D,X.z,null)}}const Ae=y.children;for(let Me=0,ye=Ae.length;Me<ye;Me++)lo(Ae[Me],z,D,H)}function co(y,z,D,H){const J=y.opaque,Ae=y.transmissive,Me=y.transparent;d.setupLightsView(D),Ae.length>0&&ih(J,z,D),H&&pe.viewport(L.copy(H)),J.length>0&&nr(J,z,D),Ae.length>0&&nr(Ae,z,D),Me.length>0&&nr(Me,z,D)}function ih(y,z,D){if(K===null){const Me=a===!0&&le.isWebGL2===!0?hc:Ht;K=new Me(1024,1024,{generateMipmaps:!0,type:Y.convert(ii)!==null?ii:li,minFilter:cs,magFilter:Je,wrapS:wt,wrapT:wt})}const H=v.getRenderTarget();v.setRenderTarget(K),v.clear();const J=v.toneMapping;v.toneMapping=En,nr(y,z,D),v.toneMapping=J,j.updateMultisampleRenderTarget(K),j.updateRenderTargetMipmap(K),v.setRenderTarget(H)}function nr(y,z,D){const H=z.isScene===!0?z.overrideMaterial:null;for(let J=0,Ae=y.length;J<Ae;J++){const Me=y[J],ye=Me.object,Le=Me.geometry,Fe=H===null?Me.material:H,Pe=Me.group;ye.layers.test(D.layers)&&rh(ye,z,D,Le,Fe,Pe)}}function rh(y,z,D,H,J,Ae){if(y.onBeforeRender(v,z,D,H,J,Ae),y.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),y.isImmediateRenderObject){const Me=uo(D,z,J,y);pe.setMaterial(J),he.reset(),Wt(y,Me)}else J.transparent===!0&&J.side===oi?(J.side=Xe,J.needsUpdate=!0,v.renderBufferDirect(D,z,H,J,y,Ae),J.side=Vi,J.needsUpdate=!0,v.renderBufferDirect(D,z,H,J,y,Ae),J.side=oi):v.renderBufferDirect(D,z,H,J,y,Ae);y.onAfterRender(v,z,D,H,J,Ae)}function xs(y,z,D){z.isScene!==!0&&(z=Q);const H=k.get(y),J=d.state.lights,Ae=d.state.shadowsArray,Me=J.state.version,ye=G.getParameters(y,J.state,Ae,z,D),Le=G.getProgramCacheKey(ye);let Fe=H.programs;H.environment=y.isMeshStandardMaterial?z.environment:null,H.fog=z.fog,H.envMap=(y.isMeshStandardMaterial?fe:ee).get(y.envMap||H.environment),Fe===void 0&&(y.addEventListener("dispose",$t),Fe=new Map,H.programs=Fe);let Pe=Fe.get(Le);if(Pe!==void 0){if(H.currentProgram===Pe&&H.lightsStateVersion===Me)return ho(y,ye),Pe}else ye.uniforms=G.getUniforms(y),y.onBuild(ye,v),y.onBeforeCompile(ye,v),Pe=G.acquireProgram(ye,Le),Fe.set(Le,Pe),H.uniforms=ye.uniforms;const Ie=H.uniforms;(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Ie.clippingPlanes=we.uniform),ho(y,ye),H.needsLights=ah(y),H.lightsStateVersion=Me,H.needsLights&&(Ie.ambientLightColor.value=J.state.ambient,Ie.lightProbe.value=J.state.probe,Ie.directionalLights.value=J.state.directional,Ie.directionalLightShadows.value=J.state.directionalShadow,Ie.spotLights.value=J.state.spot,Ie.spotLightShadows.value=J.state.spotShadow,Ie.rectAreaLights.value=J.state.rectArea,Ie.ltc_1.value=J.state.rectAreaLTC1,Ie.ltc_2.value=J.state.rectAreaLTC2,Ie.pointLights.value=J.state.point,Ie.pointLightShadows.value=J.state.pointShadow,Ie.hemisphereLights.value=J.state.hemi,Ie.directionalShadowMap.value=J.state.directionalShadowMap,Ie.directionalShadowMatrix.value=J.state.directionalShadowMatrix,Ie.spotShadowMap.value=J.state.spotShadowMap,Ie.spotShadowMatrix.value=J.state.spotShadowMatrix,Ie.pointShadowMap.value=J.state.pointShadowMap,Ie.pointShadowMatrix.value=J.state.pointShadowMatrix);const Se=Pe.getUniforms(),yn=fn.seqWithValue(Se.seq,Ie);return H.currentProgram=Pe,H.uniformsList=yn,Pe}function ho(y,z){const D=k.get(y);D.outputEncoding=z.outputEncoding,D.instancing=z.instancing,D.skinning=z.skinning,D.morphTargets=z.morphTargets,D.morphNormals=z.morphNormals,D.numClippingPlanes=z.numClippingPlanes,D.numIntersection=z.numClipIntersection,D.vertexAlphas=z.vertexAlphas,D.vertexTangents=z.vertexTangents}function uo(y,z,D,H){z.isScene!==!0&&(z=Q),j.resetTextureUnits();const J=z.fog,Ae=D.isMeshStandardMaterial?z.environment:null,Me=w===null?v.outputEncoding:w.texture.encoding,ye=(D.isMeshStandardMaterial?fe:ee).get(D.envMap||Ae),Le=D.vertexColors===!0&&!!H.geometry&&!!H.geometry.attributes.color&&H.geometry.attributes.color.itemSize===4,Fe=!!H.geometry&&!!H.geometry.attributes.tangent,Pe=!!H.geometry&&!!H.geometry.morphAttributes.position,Ie=!!H.geometry&&!!H.geometry.morphAttributes.normal,Se=k.get(D),yn=d.state.lights;if($===!0&&(ie===!0||y!==T)){const $e=y===T&&D.id===M;we.setState(D,y,$e)}let We=!1;D.version===Se.__version?(Se.needsLights&&Se.lightsStateVersion!==yn.state.version||Se.outputEncoding!==Me||H.isInstancedMesh&&Se.instancing===!1||!H.isInstancedMesh&&Se.instancing===!0||H.isSkinnedMesh&&Se.skinning===!1||!H.isSkinnedMesh&&Se.skinning===!0||Se.envMap!==ye||D.fog&&Se.fog!==J||Se.numClippingPlanes!==void 0&&(Se.numClippingPlanes!==we.numPlanes||Se.numIntersection!==we.numIntersection)||Se.vertexAlphas!==Le||Se.vertexTangents!==Fe||Se.morphTargets!==Pe||Se.morphNormals!==Ie)&&(We=!0):(We=!0,Se.__version=D.version);let Kt=Se.currentProgram;We===!0&&(Kt=xs(D,z,H));let Lt=!1,bn=!1,en=!1;const Ze=Kt.getUniforms(),Ft=Se.uniforms;if(pe.useProgram(Kt.program)&&(Lt=!0,bn=!0,en=!0),D.id!==M&&(M=D.id,bn=!0),Lt||T!==y){if(Ze.setValue(U,"projectionMatrix",y.projectionMatrix),le.logarithmicDepthBuffer&&Ze.setValue(U,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),T!==y&&(T=y,bn=!0,en=!0),D.isShaderMaterial||D.isMeshPhongMaterial||D.isMeshToonMaterial||D.isMeshStandardMaterial||D.envMap){const $e=Ze.map.cameraPosition;$e!==void 0&&$e.setValue(U,X.setFromMatrixPosition(y.matrixWorld))}(D.isMeshPhongMaterial||D.isMeshToonMaterial||D.isMeshLambertMaterial||D.isMeshBasicMaterial||D.isMeshStandardMaterial||D.isShaderMaterial)&&Ze.setValue(U,"isOrthographic",y.isOrthographicCamera===!0),(D.isMeshPhongMaterial||D.isMeshToonMaterial||D.isMeshLambertMaterial||D.isMeshBasicMaterial||D.isMeshStandardMaterial||D.isShaderMaterial||D.isShadowMaterial||H.isSkinnedMesh)&&Ze.setValue(U,"viewMatrix",y.matrixWorldInverse)}if(H.isSkinnedMesh){Ze.setOptional(U,H,"bindMatrix"),Ze.setOptional(U,H,"bindMatrixInverse");const $e=H.skeleton;$e&&(le.floatVertexTextures?($e.boneTexture===null&&$e.computeBoneTexture(),Ze.setValue(U,"boneTexture",$e.boneTexture,j),Ze.setValue(U,"boneTextureSize",$e.boneTextureSize)):Ze.setOptional(U,$e,"boneMatrices"))}return(bn||Se.receiveShadow!==H.receiveShadow)&&(Se.receiveShadow=H.receiveShadow,Ze.setValue(U,"receiveShadow",H.receiveShadow)),bn&&(Ze.setValue(U,"toneMappingExposure",v.toneMappingExposure),Se.needsLights&&sh(Ft,en),J&&D.fog&&Z.refreshFogUniforms(Ft,J),Z.refreshMaterialUniforms(Ft,D,A,C,K),fn.upload(U,Se.uniformsList,Ft,j)),D.isShaderMaterial&&D.uniformsNeedUpdate===!0&&(fn.upload(U,Se.uniformsList,Ft,j),D.uniformsNeedUpdate=!1),D.isSpriteMaterial&&Ze.setValue(U,"center",H.center),Ze.setValue(U,"modelViewMatrix",H.modelViewMatrix),Ze.setValue(U,"normalMatrix",H.normalMatrix),Ze.setValue(U,"modelMatrix",H.matrixWorld),Kt}function sh(y,z){y.ambientLightColor.needsUpdate=z,y.lightProbe.needsUpdate=z,y.directionalLights.needsUpdate=z,y.directionalLightShadows.needsUpdate=z,y.pointLights.needsUpdate=z,y.pointLightShadows.needsUpdate=z,y.spotLights.needsUpdate=z,y.spotLightShadows.needsUpdate=z,y.rectAreaLights.needsUpdate=z,y.hemisphereLights.needsUpdate=z}function ah(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return p},this.getActiveMipmapLevel=function(){return g},this.getRenderTarget=function(){return w},this.setRenderTarget=function(y,z=0,D=0){w=y,p=z,g=D,y&&k.get(y).__webglFramebuffer===void 0&&j.setupRenderTarget(y);let H=null,J=!1,Ae=!1;if(y){const ye=y.texture;(ye.isDataTexture3D||ye.isDataTexture2DArray)&&(Ae=!0);const Le=k.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(H=Le[z],J=!0):y.isWebGLMultisampleRenderTarget?H=k.get(y).__webglMultisampledFramebuffer:H=Le,L.copy(y.viewport),_.copy(y.scissor),F=y.scissorTest}else L.copy(N).multiplyScalar(A).floor(),_.copy(O).multiplyScalar(A).floor(),F=B;if(pe.bindFramebuffer(36160,H)&&le.drawBuffers){let ye=!1;if(y)if(y.isWebGLMultipleRenderTargets){const Le=y.texture;if(I.length!==Le.length||I[0]!==36064){for(let Fe=0,Pe=Le.length;Fe<Pe;Fe++)I[Fe]=36064+Fe;I.length=Le.length,ye=!0}}else(I.length!==1||I[0]!==36064)&&(I[0]=36064,I.length=1,ye=!0);else(I.length!==1||I[0]!==1029)&&(I[0]=1029,I.length=1,ye=!0);ye&&(le.isWebGL2?U.drawBuffers(I):_e.get("WEBGL_draw_buffers").drawBuffersWEBGL(I))}if(pe.viewport(L),pe.scissor(_),pe.setScissorTest(F),J){const ye=k.get(y.texture);U.framebufferTexture2D(36160,36064,34069+z,ye.__webglTexture,D)}else if(Ae){const ye=k.get(y.texture),Le=z||0;U.framebufferTextureLayer(36160,36064,ye.__webglTexture,D||0,Le)}M=-1},this.readRenderTargetPixels=function(y,z,D,H,J,Ae,Me){if(!(y&&y.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ye=k.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Me!==void 0&&(ye=ye[Me]),ye){pe.bindFramebuffer(36160,ye);try{const Le=y.texture,Fe=Le.format,Pe=Le.type;if(Fe!==St&&Y.convert(Fe)!==U.getParameter(35739)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Ie=Pe===ii&&(_e.has("EXT_color_buffer_half_float")||le.isWebGL2&&_e.has("EXT_color_buffer_float"));if(Pe!==li&&Y.convert(Pe)!==U.getParameter(35738)&&!(Pe===Tn&&(le.isWebGL2||_e.has("OES_texture_float")||_e.has("WEBGL_color_buffer_float")))&&!Ie){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U.checkFramebufferStatus(36160)===36053?z>=0&&z<=y.width-H&&D>=0&&D<=y.height-J&&U.readPixels(z,D,H,J,Y.convert(Fe),Y.convert(Pe),Ae):console.error("THREE.WebGLRenderer.readRenderTargetPixels: readPixels from renderTarget failed. Framebuffer not complete.")}finally{const Le=w!==null?k.get(w).__webglFramebuffer:null;pe.bindFramebuffer(36160,Le)}}},this.copyFramebufferToTexture=function(y,z,D=0){const H=Math.pow(2,-D),J=Math.floor(z.image.width*H),Ae=Math.floor(z.image.height*H);let Me=Y.convert(z.format);le.isWebGL2&&(Me===6407&&(Me=32849),Me===6408&&(Me=32856)),j.setTexture2D(z,0),U.copyTexImage2D(3553,D,Me,y.x,y.y,J,Ae,0),pe.unbindTexture()},this.copyTextureToTexture=function(y,z,D,H=0){const J=z.image.width,Ae=z.image.height,Me=Y.convert(D.format),ye=Y.convert(D.type);j.setTexture2D(D,0),U.pixelStorei(37440,D.flipY),U.pixelStorei(37441,D.premultiplyAlpha),U.pixelStorei(3317,D.unpackAlignment),z.isDataTexture?U.texSubImage2D(3553,H,y.x,y.y,J,Ae,Me,ye,z.image.data):z.isCompressedTexture?U.compressedTexSubImage2D(3553,H,y.x,y.y,z.mipmaps[0].width,z.mipmaps[0].height,Me,z.mipmaps[0].data):U.texSubImage2D(3553,H,y.x,y.y,Me,ye,z.image),H===0&&D.generateMipmaps&&U.generateMipmap(3553),pe.unbindTexture()},this.copyTextureToTexture3D=function(y,z,D,H,J=0){if(v.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const Ae=y.max.x-y.min.x+1,Me=y.max.y-y.min.y+1,ye=y.max.z-y.min.z+1,Le=Y.convert(H.format),Fe=Y.convert(H.type);let Pe;if(H.isDataTexture3D)j.setTexture3D(H,0),Pe=32879;else if(H.isDataTexture2DArray)j.setTexture2DArray(H,0),Pe=35866;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}U.pixelStorei(37440,H.flipY),U.pixelStorei(37441,H.premultiplyAlpha),U.pixelStorei(3317,H.unpackAlignment);const Ie=U.getParameter(3314),Se=U.getParameter(32878),yn=U.getParameter(3316),We=U.getParameter(3315),Kt=U.getParameter(32877),Lt=D.isCompressedTexture?D.mipmaps[0]:D.image;U.pixelStorei(3314,Lt.width),U.pixelStorei(32878,Lt.height),U.pixelStorei(3316,y.min.x),U.pixelStorei(3315,y.min.y),U.pixelStorei(32877,y.min.z),D.isDataTexture||D.isDataTexture3D?U.texSubImage3D(Pe,J,z.x,z.y,z.z,Ae,Me,ye,Le,Fe,Lt.data):D.isCompressedTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),U.compressedTexSubImage3D(Pe,J,z.x,z.y,z.z,Ae,Me,ye,Le,Lt.data)):U.texSubImage3D(Pe,J,z.x,z.y,z.z,Ae,Me,ye,Le,Fe,Lt),U.pixelStorei(3314,Ie),U.pixelStorei(32878,Se),U.pixelStorei(3316,yn),U.pixelStorei(3315,We),U.pixelStorei(32877,Kt),J===0&&H.generateMipmaps&&U.generateMipmap(Pe),pe.unbindTexture()},this.initTexture=function(y){j.setTexture2D(y,0),pe.unbindTexture()},this.resetState=function(){p=0,g=0,w=null,pe.reset(),he.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}class t1 extends Be{}t1.prototype.isWebGL1Renderer=!0;class qa extends De{constructor(){super(),this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.overrideMaterial=null,this.autoUpdate=!0,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.autoUpdate=e.autoUpdate,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t}}qa.prototype.isScene=!0;class Ki{constructor(e,t){this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=qi,this.updateRange={offset:0,count:-1},this.version=0,this.uuid=Ot()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ot()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ot()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.prototype.slice.call(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}Ki.prototype.isInterleavedBuffer=!0;const Ve=new E;class Xi{constructor(e,t,n,i=!1){this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i===!0}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Ve.x=this.getX(t),Ve.y=this.getY(t),Ve.z=this.getZ(t),Ve.applyMatrix4(e),this.setXYZ(t,Ve.x,Ve.y,Ve.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ve.x=this.getX(t),Ve.y=this.getY(t),Ve.z=this.getZ(t),Ve.applyNormalMatrix(e),this.setXYZ(t,Ve.x,Ve.y,Ve.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ve.x=this.getX(t),Ve.y=this.getY(t),Ve.z=this.getZ(t),Ve.transformDirection(e),this.setXYZ(t,Ve.x,Ve.y,Ve.z);return this}setX(e,t){return this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){return this.data.array[e*this.data.stride+this.offset]}getY(e){return this.data.array[e*this.data.stride+this.offset+1]}getZ(e){return this.data.array[e*this.data.stride+this.offset+2]}getW(e){return this.data.array[e*this.data.stride+this.offset+3]}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interlaved buffer attribute will deinterleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new Ye(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Xi(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interlaved buffer attribute will deinterleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}Xi.prototype.isInterleavedBufferAttribute=!0;class Ic extends lt{constructor(e){super(),this.type="SpriteMaterial",this.color=new ve(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this}}Ic.prototype.isSpriteMaterial=!0;let Yn;const Li=new E,Zn=new E,jn=new E,Jn=new te,Ci=new te,Dc=new be,Cr=new E,Ri=new E,Rr=new E,Sl=new te,aa=new te,Tl=new te;class n1 extends De{constructor(e){if(super(),this.type="Sprite",Yn===void 0){Yn=new Oe;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Ki(t,5);Yn.setIndex([0,1,2,0,2,3]),Yn.setAttribute("position",new Xi(n,3,0,!1)),Yn.setAttribute("uv",new Xi(n,2,3,!1))}this.geometry=Yn,this.material=e!==void 0?e:new Ic,this.center=new te(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Zn.setFromMatrixScale(this.matrixWorld),Dc.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),jn.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Zn.multiplyScalar(-jn.z);const n=this.material.rotation;let i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));const a=this.center;Pr(Cr.set(-.5,-.5,0),jn,a,Zn,i,r),Pr(Ri.set(.5,-.5,0),jn,a,Zn,i,r),Pr(Rr.set(.5,.5,0),jn,a,Zn,i,r),Sl.set(0,0),aa.set(1,0),Tl.set(1,1);let o=e.ray.intersectTriangle(Cr,Ri,Rr,!1,Li);if(o===null&&(Pr(Ri.set(-.5,.5,0),jn,a,Zn,i,r),aa.set(0,1),o=e.ray.intersectTriangle(Cr,Rr,Ri,!1,Li),o===null))return;const l=e.ray.origin.distanceTo(Li);l<e.near||l>e.far||t.push({distance:l,point:Li.clone(),uv:qe.getUV(Li,Cr,Ri,Rr,Sl,aa,Tl,new te),face:null,object:this})}copy(e){return super.copy(e),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}n1.prototype.isSprite=!0;function Pr(s,e,t,n,i,r){Jn.subVectors(s,t).addScalar(.5).multiply(n),i!==void 0?(Ci.x=r*Jn.x-i*Jn.y,Ci.y=i*Jn.x+r*Jn.y):Ci.copy(Jn),s.copy(e),s.x+=Ci.x,s.y+=Ci.y,s.applyMatrix4(Dc)}const El=new E,Al=new ze,Ll=new ze,i1=new E,Cl=new be;class Fc extends dt{constructor(e,t){super(e,t),this.type="SkinnedMesh",this.bindMode="attached",this.bindMatrix=new be,this.bindMatrixInverse=new be}copy(e){return super.copy(e),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,this}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new ze,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.x=t.getX(n),e.y=t.getY(n),e.z=t.getZ(n),e.w=t.getW(n);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode==="attached"?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode==="detached"?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}boneTransform(e,t){const n=this.skeleton,i=this.geometry;Al.fromBufferAttribute(i.attributes.skinIndex,e),Ll.fromBufferAttribute(i.attributes.skinWeight,e),El.fromBufferAttribute(i.attributes.position,e).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){const a=Ll.getComponent(r);if(a!==0){const o=Al.getComponent(r);Cl.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(i1.copy(El).applyMatrix4(Cl),a)}}return t.applyMatrix4(this.bindMatrixInverse)}}Fc.prototype.isSkinnedMesh=!0;class r1 extends De{constructor(){super(),this.type="Bone"}}r1.prototype.isBone=!0;class s1 extends nt{constructor(e=null,t=1,n=1,i,r,a,o,l,c=Je,h=Je,u,d){super(null,a,o,l,c,h,i,r,u,d),this.image={data:e,width:t,height:n},this.magFilter=c,this.minFilter=h,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.needsUpdate=!0}}s1.prototype.isDataTexture=!0;class Sa extends Ye{constructor(e,t,n,i=1){typeof n=="number"&&(i=n,n=!1,console.error("THREE.InstancedBufferAttribute: The constructor now expects normalized as the third argument.")),super(e,t,n),this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}Sa.prototype.isInstancedBufferAttribute=!0;const Rl=new be,Pl=new be,Ir=[],Pi=new dt;class a1 extends dt{constructor(e,t,n){super(e,t),this.instanceMatrix=new Sa(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.frustumCulled=!1}copy(e){return super.copy(e),this.instanceMatrix.copy(e.instanceMatrix),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}raycast(e,t){const n=this.matrixWorld,i=this.count;if(Pi.geometry=this.geometry,Pi.material=this.material,Pi.material!==void 0)for(let r=0;r<i;r++){this.getMatrixAt(r,Rl),Pl.multiplyMatrices(n,Rl),Pi.matrixWorld=Pl,Pi.raycast(e,Ir);for(let a=0,o=Ir.length;a<o;a++){const l=Ir[a];l.instanceId=r,l.object=this,t.push(l)}Ir.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Sa(new Float32Array(this.instanceMatrix.count*3),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}a1.prototype.isInstancedMesh=!0;class er extends lt{constructor(e){super(),this.type="LineBasicMaterial",this.color=new ve(16777215),this.linewidth=1,this.linecap="round",this.linejoin="round",this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this}}er.prototype.isLineBasicMaterial=!0;const Il=new E,Dl=new E,Fl=new be,oa=new mi,Dr=new pi;class Xa extends De{constructor(e=new Oe,t=new er){super(),this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e){return super.copy(e),this.material=e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.isBufferGeometry)if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)Il.fromBufferAttribute(t,i-1),Dl.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Il.distanceTo(Dl);e.setAttribute("lineDistance",new Qe(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");else e.isGeometry&&console.error("THREE.Line.computeLineDistances() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Dr.copy(n.boundingSphere),Dr.applyMatrix4(i),Dr.radius+=r,e.ray.intersectsSphere(Dr)===!1)return;Fl.copy(i).invert(),oa.copy(e.ray).applyMatrix4(Fl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=new E,h=new E,u=new E,d=new E,f=this.isLineSegments?2:1;if(n.isBufferGeometry){const m=n.index,x=n.attributes.position;if(m!==null){const p=Math.max(0,a.start),g=Math.min(m.count,a.start+a.count);for(let w=p,M=g-1;w<M;w+=f){const T=m.getX(w),L=m.getX(w+1);if(c.fromBufferAttribute(x,T),h.fromBufferAttribute(x,L),oa.distanceSqToSegment(c,h,d,u)>l)continue;d.applyMatrix4(this.matrixWorld);const F=e.ray.origin.distanceTo(d);F<e.near||F>e.far||t.push({distance:F,point:u.clone().applyMatrix4(this.matrixWorld),index:w,face:null,faceIndex:null,object:this})}}else{const p=Math.max(0,a.start),g=Math.min(x.count,a.start+a.count);for(let w=p,M=g-1;w<M;w+=f){if(c.fromBufferAttribute(x,w),h.fromBufferAttribute(x,w+1),oa.distanceSqToSegment(c,h,d,u)>l)continue;d.applyMatrix4(this.matrixWorld);const L=e.ray.origin.distanceTo(d);L<e.near||L>e.far||t.push({distance:L,point:u.clone().applyMatrix4(this.matrixWorld),index:w,face:null,faceIndex:null,object:this})}}}else n.isGeometry&&console.error("THREE.Line.raycast() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.")}updateMorphTargets(){const e=this.geometry;if(e.isBufferGeometry){const t=e.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}else{const t=e.morphTargets;t!==void 0&&t.length>0&&console.error("THREE.Line.updateMorphTargets() does not support THREE.Geometry. Use THREE.BufferGeometry instead.")}}}Xa.prototype.isLine=!0;const Nl=new E,Bl=new E;class Ya extends Xa{constructor(e,t){super(e,t),this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.isBufferGeometry)if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)Nl.fromBufferAttribute(t,i),Bl.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Nl.distanceTo(Bl);e.setAttribute("lineDistance",new Qe(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");else e.isGeometry&&console.error("THREE.LineSegments.computeLineDistances() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.");return this}}Ya.prototype.isLineSegments=!0;class o1 extends Xa{constructor(e,t){super(e,t),this.type="LineLoop"}}o1.prototype.isLineLoop=!0;class Nc extends lt{constructor(e){super(),this.type="PointsMaterial",this.color=new ve(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this}}Nc.prototype.isPointsMaterial=!0;const zl=new be,Ta=new mi,Fr=new pi,Nr=new E;class l1 extends De{constructor(e=new Oe,t=new Nc){super(),this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e){return super.copy(e),this.material=e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Fr.copy(n.boundingSphere),Fr.applyMatrix4(i),Fr.radius+=r,e.ray.intersectsSphere(Fr)===!1)return;zl.copy(i).invert(),Ta.copy(e.ray).applyMatrix4(zl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o;if(n.isBufferGeometry){const c=n.index,u=n.attributes.position;if(c!==null){const d=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let m=d,v=f;m<v;m++){const x=c.getX(m);Nr.fromBufferAttribute(u,x),Ul(Nr,x,l,i,e,t,this)}}else{const d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let m=d,v=f;m<v;m++)Nr.fromBufferAttribute(u,m),Ul(Nr,m,l,i,e,t,this)}}else console.error("THREE.Points.raycast() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.")}updateMorphTargets(){const e=this.geometry;if(e.isBufferGeometry){const t=e.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}else{const t=e.morphTargets;t!==void 0&&t.length>0&&console.error("THREE.Points.updateMorphTargets() does not support THREE.Geometry. Use THREE.BufferGeometry instead.")}}}l1.prototype.isPoints=!0;function Ul(s,e,t,n,i,r,a){const o=Ta.distanceSqToPoint(s);if(o<t){const l=new E;Ta.closestPointToPoint(s,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,object:a})}}class c1 extends nt{constructor(e,t,n,i,r,a,o,l,c){super(e,t,n,i,r,a,o,l,c),this.format=o!==void 0?o:un,this.minFilter=a!==void 0?a:Et,this.magFilter=r!==void 0?r:Et,this.generateMipmaps=!1;const h=this;function u(){h.needsUpdate=!0,e.requestVideoFrameCallback(u)}"requestVideoFrameCallback"in e&&e.requestVideoFrameCallback(u)}clone(){return new this.constructor(this.image).copy(this)}update(){const e=this.image;"requestVideoFrameCallback"in e===!1&&e.readyState>=e.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}}c1.prototype.isVideoTexture=!0;class h1 extends nt{constructor(e,t,n,i,r,a,o,l,c,h,u,d){super(null,a,o,l,c,h,i,r,u,d),this.image={width:t,height:n},this.mipmaps=e,this.flipY=!1,this.generateMipmaps=!1}}h1.prototype.isCompressedTexture=!0;class u1 extends nt{constructor(e,t,n,i,r,a,o,l,c){super(e,t,n,i,r,a,o,l,c),this.needsUpdate=!0}}u1.prototype.isCanvasTexture=!0;class d1 extends nt{constructor(e,t,n,i,r,a,o,l,c,h){if(h=h!==void 0?h:ri,h!==ri&&h!==Wi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===ri&&(n=Xr),n===void 0&&h===Wi&&(n=Oi),super(null,i,r,a,o,l,h,n,c),this.image={width:e,height:t},this.magFilter=o!==void 0?o:Je,this.minFilter=l!==void 0?l:Je,this.flipY=!1,this.generateMipmaps=!1}}d1.prototype.isDepthTexture=!0;new E;new E;new E;new qe;class At{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,i=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(i),t.push(r),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const n=this.getLengths();let i=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(i=Math.floor(o+(l-o)/2),c=n[i]-a,c<0)o=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===a)return i/(r-1);const h=n[i],d=n[i+1]-h,f=(a-h)/d;return(i+f)/(r-1)}getTangent(e,t){let i=e-1e-4,r=e+1e-4;i<0&&(i=0),r>1&&(r=1);const a=this.getPoint(i),o=this.getPoint(r),l=t||(a.isVector2?new te:new E);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){const n=new E,i=[],r=[],a=[],o=new E,l=new be;for(let f=0;f<=e;f++){const m=f/e;i[f]=this.getTangentAt(m,new E),i[f].normalize()}r[0]=new E,a[0]=new E;let c=Number.MAX_VALUE;const h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],o),a[0].crossVectors(i[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(i[f-1],i[f]),o.length()>Number.EPSILON){o.normalize();const m=Math.acos(Mt(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,m))}a[f].crossVectors(i[f],r[f])}if(t===!0){let f=Math.acos(Mt(r[0].dot(r[e]),-1,1));f/=e,i[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let m=1;m<=e;m++)r[m].applyMatrix4(l.makeRotationAxis(i[m],f*m)),a[m].crossVectors(i[m],r[m])}return{tangents:i,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.5,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class ps extends At{constructor(e=0,t=0,n=1,i=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t){const n=t||new te,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(a?r=0:r=i),this.aClockwise===!0&&!a&&(r===i?r=-i:r=r-i);const o=this.aStartAngle+e*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}ps.prototype.isEllipseCurve=!0;class Bc extends ps{constructor(e,t,n,i,r,a){super(e,t,n,n,i,r,a),this.type="ArcCurve"}}Bc.prototype.isArcCurve=!0;function Za(){let s=0,e=0,t=0,n=0;function i(r,a,o,l){s=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){i(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,u){let d=(a-r)/c-(o-r)/(c+h)+(o-a)/h,f=(o-a)/h-(l-a)/(h+u)+(l-o)/u;d*=h,f*=h,i(a,o,d,f)},calc:function(r){const a=r*r,o=a*r;return s+e*r+t*a+n*o}}}const Br=new E,la=new Za,ca=new Za,ha=new Za;class zc extends At{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new E){const n=t,i=this.points,r=i.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=i[(o-1)%r]:(Br.subVectors(i[0],i[1]).add(i[0]),c=Br);const u=i[o%r],d=i[(o+1)%r];if(this.closed||o+2<r?h=i[(o+2)%r]:(Br.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=Br),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let m=Math.pow(c.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(d),f),x=Math.pow(d.distanceToSquared(h),f);v<1e-4&&(v=1),m<1e-4&&(m=v),x<1e-4&&(x=v),la.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,m,v,x),ca.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,m,v,x),ha.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,m,v,x)}else this.curveType==="catmullrom"&&(la.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),ca.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),ha.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(la.calc(l),ca.calc(l),ha.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new E().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}zc.prototype.isCatmullRomCurve3=!0;function Ol(s,e,t,n,i){const r=(n-e)*.5,a=(i-t)*.5,o=s*s,l=s*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*s+t}function f1(s,e){const t=1-s;return t*t*e}function p1(s,e){return 2*(1-s)*s*e}function m1(s,e){return s*s*e}function Hi(s,e,t,n){return f1(s,e)+p1(s,t)+m1(s,n)}function g1(s,e){const t=1-s;return t*t*t*e}function v1(s,e){const t=1-s;return 3*t*t*s*e}function x1(s,e){return 3*(1-s)*s*s*e}function _1(s,e){return s*s*s*e}function Gi(s,e,t,n,i){return g1(s,e)+v1(s,t)+x1(s,n)+_1(s,i)}class ja extends At{constructor(e=new te,t=new te,n=new te,i=new te){super(),this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new te){const n=t,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Gi(e,i.x,r.x,a.x,o.x),Gi(e,i.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}ja.prototype.isCubicBezierCurve=!0;class Uc extends At{constructor(e=new E,t=new E,n=new E,i=new E){super(),this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new E){const n=t,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Gi(e,i.x,r.x,a.x,o.x),Gi(e,i.y,r.y,a.y,o.y),Gi(e,i.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}Uc.prototype.isCubicBezierCurve3=!0;class ms extends At{constructor(e=new te,t=new te){super(),this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new te){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t){const n=t||new te;return n.copy(this.v2).sub(this.v1).normalize(),n}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}ms.prototype.isLineCurve=!0;class y1 extends At{constructor(e=new E,t=new E){super(),this.type="LineCurve3",this.isLineCurve3=!0,this.v1=e,this.v2=t}getPoint(e,t=new E){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Ja extends At{constructor(e=new te,t=new te,n=new te){super(),this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new te){const n=t,i=this.v0,r=this.v1,a=this.v2;return n.set(Hi(e,i.x,r.x,a.x),Hi(e,i.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}Ja.prototype.isQuadraticBezierCurve=!0;class Oc extends At{constructor(e=new E,t=new E,n=new E){super(),this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new E){const n=t,i=this.v0,r=this.v1,a=this.v2;return n.set(Hi(e,i.x,r.x,a.x),Hi(e,i.y,r.y,a.y),Hi(e,i.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}Oc.prototype.isQuadraticBezierCurve3=!0;class Qa extends At{constructor(e=[]){super(),this.type="SplineCurve",this.points=e}getPoint(e,t=new te){const n=t,i=this.points,r=(i.length-1)*e,a=Math.floor(r),o=r-a,l=i[a===0?a:a-1],c=i[a],h=i[a>i.length-2?i.length-1:a+1],u=i[a>i.length-3?i.length-1:a+2];return n.set(Ol(o,l.x,c.x,h.x,u.x),Ol(o,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new te().fromArray(i))}return this}}Qa.prototype.isSplineCurve=!0;var Hc=Object.freeze({__proto__:null,ArcCurve:Bc,CatmullRomCurve3:zc,CubicBezierCurve:ja,CubicBezierCurve3:Uc,EllipseCurve:ps,LineCurve:ms,LineCurve3:y1,QuadraticBezierCurve:Ja,QuadraticBezierCurve3:Oc,SplineCurve:Qa});const b1={triangulate:function(s,e,t=2){const n=e&&e.length,i=n?e[0]*t:s.length;let r=Gc(s,0,i,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c,h,u,d,f;if(n&&(r=E1(s,e,r,t)),s.length>80*t){o=c=s[0],l=h=s[1];for(let m=t;m<i;m+=t)u=s[m],d=s[m+1],u<o&&(o=u),d<l&&(l=d),u>c&&(c=u),d>h&&(h=d);f=Math.max(c-o,h-l),f=f!==0?1/f:0}return Yi(r,a,t,o,l,f),a}};function Gc(s,e,t,n,i){let r,a;if(i===z1(s,e,t,n)>0)for(r=e;r<t;r+=n)a=Hl(r,s[r],s[r+1],a);else for(r=t-n;r>=e;r-=n)a=Hl(r,s[r],s[r+1],a);return a&&gs(a,a.next)&&(ji(a),a=a.next),a}function gn(s,e){if(!s)return s;e||(e=s);let t=s,n;do if(n=!1,!t.steiner&&(gs(t,t.next)||Ge(t.prev,t,t.next)===0)){if(ji(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Yi(s,e,t,n,i,r,a){if(!s)return;!a&&r&&P1(s,n,i,r);let o=s,l,c;for(;s.prev!==s.next;){if(l=s.prev,c=s.next,r?w1(s,n,i,r):M1(s)){e.push(l.i/t),e.push(s.i/t),e.push(c.i/t),ji(s),s=c.next,o=c.next;continue}if(s=c,s===o){a?a===1?(s=S1(gn(s),e,t),Yi(s,e,t,n,i,r,2)):a===2&&T1(s,e,t,n,i,r):Yi(gn(s),e,t,n,i,r,1);break}}}function M1(s){const e=s.prev,t=s,n=s.next;if(Ge(e,t,n)>=0)return!1;let i=s.next.next;for(;i!==s.prev;){if(ni(e.x,e.y,t.x,t.y,n.x,n.y,i.x,i.y)&&Ge(i.prev,i,i.next)>=0)return!1;i=i.next}return!0}function w1(s,e,t,n){const i=s.prev,r=s,a=s.next;if(Ge(i,r,a)>=0)return!1;const o=i.x<r.x?i.x<a.x?i.x:a.x:r.x<a.x?r.x:a.x,l=i.y<r.y?i.y<a.y?i.y:a.y:r.y<a.y?r.y:a.y,c=i.x>r.x?i.x>a.x?i.x:a.x:r.x>a.x?r.x:a.x,h=i.y>r.y?i.y>a.y?i.y:a.y:r.y>a.y?r.y:a.y,u=Ea(o,l,e,t,n),d=Ea(c,h,e,t,n);let f=s.prevZ,m=s.nextZ;for(;f&&f.z>=u&&m&&m.z<=d;){if(f!==s.prev&&f!==s.next&&ni(i.x,i.y,r.x,r.y,a.x,a.y,f.x,f.y)&&Ge(f.prev,f,f.next)>=0||(f=f.prevZ,m!==s.prev&&m!==s.next&&ni(i.x,i.y,r.x,r.y,a.x,a.y,m.x,m.y)&&Ge(m.prev,m,m.next)>=0))return!1;m=m.nextZ}for(;f&&f.z>=u;){if(f!==s.prev&&f!==s.next&&ni(i.x,i.y,r.x,r.y,a.x,a.y,f.x,f.y)&&Ge(f.prev,f,f.next)>=0)return!1;f=f.prevZ}for(;m&&m.z<=d;){if(m!==s.prev&&m!==s.next&&ni(i.x,i.y,r.x,r.y,a.x,a.y,m.x,m.y)&&Ge(m.prev,m,m.next)>=0)return!1;m=m.nextZ}return!0}function S1(s,e,t){let n=s;do{const i=n.prev,r=n.next.next;!gs(i,r)&&kc(i,n,n.next,r)&&Zi(i,r)&&Zi(r,i)&&(e.push(i.i/t),e.push(n.i/t),e.push(r.i/t),ji(n),ji(n.next),n=s=r),n=n.next}while(n!==s);return gn(n)}function T1(s,e,t,n,i,r){let a=s;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&F1(a,o)){let l=Vc(a,o);a=gn(a,a.next),l=gn(l,l.next),Yi(a,e,t,n,i,r),Yi(l,e,t,n,i,r);return}o=o.next}a=a.next}while(a!==s)}function E1(s,e,t,n){const i=[];let r,a,o,l,c;for(r=0,a=e.length;r<a;r++)o=e[r]*n,l=r<a-1?e[r+1]*n:s.length,c=Gc(s,o,l,n,!1),c===c.next&&(c.steiner=!0),i.push(D1(c));for(i.sort(A1),r=0;r<i.length;r++)L1(i[r],t),t=gn(t,t.next);return t}function A1(s,e){return s.x-e.x}function L1(s,e){if(e=C1(s,e),e){const t=Vc(e,s);gn(e,e.next),gn(t,t.next)}}function C1(s,e){let t=e;const n=s.x,i=s.y;let r=-1/0,a;do{if(i<=t.y&&i>=t.next.y&&t.next.y!==t.y){const d=t.x+(i-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=n&&d>r){if(r=d,d===n){if(i===t.y)return t;if(i===t.next.y)return t.next}a=t.x<t.next.x?t:t.next}}t=t.next}while(t!==e);if(!a)return null;if(n===r)return a;const o=a,l=a.x,c=a.y;let h=1/0,u;t=a;do n>=t.x&&t.x>=l&&n!==t.x&&ni(i<c?n:r,i,l,c,i<c?r:n,i,t.x,t.y)&&(u=Math.abs(i-t.y)/(n-t.x),Zi(t,s)&&(u<h||u===h&&(t.x>a.x||t.x===a.x&&R1(a,t)))&&(a=t,h=u)),t=t.next;while(t!==o);return a}function R1(s,e){return Ge(s.prev,s,e.prev)<0&&Ge(e.next,s,s.next)<0}function P1(s,e,t,n){let i=s;do i.z===null&&(i.z=Ea(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,I1(i)}function I1(s){let e,t,n,i,r,a,o,l,c=1;do{for(t=s,s=null,r=null,a=0;t;){for(a++,n=t,o=0,e=0;e<c&&(o++,n=n.nextZ,!!n);e++);for(l=c;o>0||l>0&&n;)o!==0&&(l===0||!n||t.z<=n.z)?(i=t,t=t.nextZ,o--):(i=n,n=n.nextZ,l--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;t=n}r.nextZ=null,c*=2}while(a>1);return s}function Ea(s,e,t,n,i){return s=32767*(s-t)*i,e=32767*(e-n)*i,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,s|e<<1}function D1(s){let e=s,t=s;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==s);return t}function ni(s,e,t,n,i,r,a,o){return(i-a)*(e-o)-(s-a)*(r-o)>=0&&(s-a)*(n-o)-(t-a)*(e-o)>=0&&(t-a)*(r-o)-(i-a)*(n-o)>=0}function F1(s,e){return s.next.i!==e.i&&s.prev.i!==e.i&&!N1(s,e)&&(Zi(s,e)&&Zi(e,s)&&B1(s,e)&&(Ge(s.prev,s,e.prev)||Ge(s,e.prev,e))||gs(s,e)&&Ge(s.prev,s,s.next)>0&&Ge(e.prev,e,e.next)>0)}function Ge(s,e,t){return(e.y-s.y)*(t.x-e.x)-(e.x-s.x)*(t.y-e.y)}function gs(s,e){return s.x===e.x&&s.y===e.y}function kc(s,e,t,n){const i=Ur(Ge(s,e,t)),r=Ur(Ge(s,e,n)),a=Ur(Ge(t,n,s)),o=Ur(Ge(t,n,e));return!!(i!==r&&a!==o||i===0&&zr(s,t,e)||r===0&&zr(s,n,e)||a===0&&zr(t,s,n)||o===0&&zr(t,e,n))}function zr(s,e,t){return e.x<=Math.max(s.x,t.x)&&e.x>=Math.min(s.x,t.x)&&e.y<=Math.max(s.y,t.y)&&e.y>=Math.min(s.y,t.y)}function Ur(s){return s>0?1:s<0?-1:0}function N1(s,e){let t=s;do{if(t.i!==s.i&&t.next.i!==s.i&&t.i!==e.i&&t.next.i!==e.i&&kc(t,t.next,s,e))return!0;t=t.next}while(t!==s);return!1}function Zi(s,e){return Ge(s.prev,s,s.next)<0?Ge(s,e,s.next)>=0&&Ge(s,s.prev,e)>=0:Ge(s,e,s.prev)<0||Ge(s,s.next,e)<0}function B1(s,e){let t=s,n=!1;const i=(s.x+e.x)/2,r=(s.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&i<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==s);return n}function Vc(s,e){const t=new Aa(s.i,s.x,s.y),n=new Aa(e.i,e.x,e.y),i=s.next,r=e.prev;return s.next=e,e.prev=s,t.next=i,i.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Hl(s,e,t,n){const i=new Aa(s,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function ji(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function Aa(s,e,t){this.i=s,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=null,this.prevZ=null,this.nextZ=null,this.steiner=!1}function z1(s,e,t,n){let i=0;for(let r=e,a=t-n;r<t;r+=n)i+=(s[a]-s[r])*(s[r+1]+s[a+1]),a=r;return i}class pn{static area(e){const t=e.length;let n=0;for(let i=t-1,r=0;r<t;i=r++)n+=e[i].x*e[r].y-e[r].x*e[i].y;return n*.5}static isClockWise(e){return pn.area(e)<0}static triangulateShape(e,t){const n=[],i=[],r=[];Gl(e),kl(n,e);let a=e.length;t.forEach(Gl);for(let l=0;l<t.length;l++)i.push(a),a+=t[l].length,kl(n,t[l]);const o=b1.triangulate(n,i);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function Gl(s){const e=s.length;e>2&&s[e-1].equals(s[0])&&s.pop()}function kl(s,e){for(let t=0;t<e.length;t++)s.push(e[t].x),s.push(e[t].y)}class xi extends Oe{constructor(e,t){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,i=[],r=[];for(let o=0,l=e.length;o<l;o++){const c=e[o];a(c)}this.setAttribute("position",new Qe(i,3)),this.setAttribute("uv",new Qe(r,2)),this.computeVertexNormals();function a(o){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1;let u=t.depth!==void 0?t.depth:100,d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:6,m=t.bevelSize!==void 0?t.bevelSize:f-2,v=t.bevelOffset!==void 0?t.bevelOffset:0,x=t.bevelSegments!==void 0?t.bevelSegments:3;const p=t.extrudePath,g=t.UVGenerator!==void 0?t.UVGenerator:U1;t.amount!==void 0&&(console.warn("THREE.ExtrudeBufferGeometry: amount has been renamed to depth."),u=t.amount);let w,M=!1,T,L,_,F;p&&(w=p.getSpacedPoints(h),M=!0,d=!1,T=p.computeFrenetFrames(h,!1),L=new E,_=new E,F=new E),d||(x=0,f=0,m=0,v=0);const W=o.extractPoints(c);let C=W.shape;const A=W.holes;if(!pn.isClockWise(C)){C=C.reverse();for(let k=0,j=A.length;k<j;k++){const ee=A[k];pn.isClockWise(ee)&&(A[k]=ee.reverse())}}const P=pn.triangulateShape(C,A),N=C;for(let k=0,j=A.length;k<j;k++){const ee=A[k];C=C.concat(ee)}function O(k,j,ee){return j||console.error("THREE.ExtrudeGeometry: vec does not exist"),j.clone().multiplyScalar(ee).add(k)}const B=C.length,I=P.length;function q(k,j,ee){let fe,re,S;const b=k.x-j.x,G=k.y-j.y,Z=ee.x-k.x,se=ee.y-k.y,ce=b*b+G*G,we=b*se-G*Z;if(Math.abs(we)>Number.EPSILON){const xe=Math.sqrt(ce),Te=Math.sqrt(Z*Z+se*se),ge=j.x-G/xe,R=j.y+b/xe,ae=ee.x-se/Te,Y=ee.y+Z/Te,he=((ae-ge)*se-(Y-R)*Z)/(b*se-G*Z);fe=ge+b*he-k.x,re=R+G*he-k.y;const me=fe*fe+re*re;if(me<=2)return new te(fe,re);S=Math.sqrt(me/2)}else{let xe=!1;b>Number.EPSILON?Z>Number.EPSILON&&(xe=!0):b<-Number.EPSILON?Z<-Number.EPSILON&&(xe=!0):Math.sign(G)===Math.sign(se)&&(xe=!0),xe?(fe=-G,re=b,S=Math.sqrt(ce)):(fe=b,re=G,S=Math.sqrt(ce/2))}return new te(fe/S,re/S)}const $=[];for(let k=0,j=N.length,ee=j-1,fe=k+1;k<j;k++,ee++,fe++)ee===j&&(ee=0),fe===j&&(fe=0),$[k]=q(N[k],N[ee],N[fe]);const ie=[];let K,de=$.concat();for(let k=0,j=A.length;k<j;k++){const ee=A[k];K=[];for(let fe=0,re=ee.length,S=re-1,b=fe+1;fe<re;fe++,S++,b++)S===re&&(S=0),b===re&&(b=0),K[fe]=q(ee[fe],ee[S],ee[b]);ie.push(K),de=de.concat(K)}for(let k=0;k<x;k++){const j=k/x,ee=f*Math.cos(j*Math.PI/2),fe=m*Math.sin(j*Math.PI/2)+v;for(let re=0,S=N.length;re<S;re++){const b=O(N[re],$[re],fe);ue(b.x,b.y,-ee)}for(let re=0,S=A.length;re<S;re++){const b=A[re];K=ie[re];for(let G=0,Z=b.length;G<Z;G++){const se=O(b[G],K[G],fe);ue(se.x,se.y,-ee)}}}const X=m+v;for(let k=0;k<B;k++){const j=d?O(C[k],de[k],X):C[k];M?(_.copy(T.normals[0]).multiplyScalar(j.x),L.copy(T.binormals[0]).multiplyScalar(j.y),F.copy(w[0]).add(_).add(L),ue(F.x,F.y,F.z)):ue(j.x,j.y,0)}for(let k=1;k<=h;k++)for(let j=0;j<B;j++){const ee=d?O(C[j],de[j],X):C[j];M?(_.copy(T.normals[k]).multiplyScalar(ee.x),L.copy(T.binormals[k]).multiplyScalar(ee.y),F.copy(w[k]).add(_).add(L),ue(F.x,F.y,F.z)):ue(ee.x,ee.y,u/h*k)}for(let k=x-1;k>=0;k--){const j=k/x,ee=f*Math.cos(j*Math.PI/2),fe=m*Math.sin(j*Math.PI/2)+v;for(let re=0,S=N.length;re<S;re++){const b=O(N[re],$[re],fe);ue(b.x,b.y,u+ee)}for(let re=0,S=A.length;re<S;re++){const b=A[re];K=ie[re];for(let G=0,Z=b.length;G<Z;G++){const se=O(b[G],K[G],fe);M?ue(se.x,se.y+w[h-1].y,w[h-1].x+ee):ue(se.x,se.y,u+ee)}}}Q(),oe();function Q(){const k=i.length/3;if(d){let j=0,ee=B*j;for(let fe=0;fe<I;fe++){const re=P[fe];_e(re[2]+ee,re[1]+ee,re[0]+ee)}j=h+x*2,ee=B*j;for(let fe=0;fe<I;fe++){const re=P[fe];_e(re[0]+ee,re[1]+ee,re[2]+ee)}}else{for(let j=0;j<I;j++){const ee=P[j];_e(ee[2],ee[1],ee[0])}for(let j=0;j<I;j++){const ee=P[j];_e(ee[0]+B*h,ee[1]+B*h,ee[2]+B*h)}}n.addGroup(k,i.length/3-k,0)}function oe(){const k=i.length/3;let j=0;U(N,j),j+=N.length;for(let ee=0,fe=A.length;ee<fe;ee++){const re=A[ee];U(re,j),j+=re.length}n.addGroup(k,i.length/3-k,1)}function U(k,j){let ee=k.length;for(;--ee>=0;){const fe=ee;let re=ee-1;re<0&&(re=k.length-1);for(let S=0,b=h+x*2;S<b;S++){const G=B*S,Z=B*(S+1),se=j+fe+G,ce=j+re+G,we=j+re+Z,xe=j+fe+Z;le(se,ce,we,xe)}}}function ue(k,j,ee){l.push(k),l.push(j),l.push(ee)}function _e(k,j,ee){pe(k),pe(j),pe(ee);const fe=i.length/3,re=g.generateTopUV(n,i,fe-3,fe-2,fe-1);Ee(re[0]),Ee(re[1]),Ee(re[2])}function le(k,j,ee,fe){pe(k),pe(j),pe(fe),pe(j),pe(ee),pe(fe);const re=i.length/3,S=g.generateSideWallUV(n,i,re-6,re-3,re-2,re-1);Ee(S[0]),Ee(S[1]),Ee(S[3]),Ee(S[1]),Ee(S[2]),Ee(S[3])}function pe(k){i.push(l[k*3+0]),i.push(l[k*3+1]),i.push(l[k*3+2])}function Ee(k){r.push(k.x),r.push(k.y)}}}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return O1(t,n,e)}static fromJSON(e,t){const n=[];for(let r=0,a=e.shapes.length;r<a;r++){const o=t[e.shapes[r]];n.push(o)}const i=e.options.extrudePath;return i!==void 0&&(e.options.extrudePath=new Hc[i.type]().fromJSON(i)),new xi(n,e.options)}}const U1={generateTopUV:function(s,e,t,n,i){const r=e[t*3],a=e[t*3+1],o=e[n*3],l=e[n*3+1],c=e[i*3],h=e[i*3+1];return[new te(r,a),new te(o,l),new te(c,h)]},generateSideWallUV:function(s,e,t,n,i,r){const a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],u=e[n*3+2],d=e[i*3],f=e[i*3+1],m=e[i*3+2],v=e[r*3],x=e[r*3+1],p=e[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new te(a,1-l),new te(c,1-u),new te(d,1-m),new te(v,1-p)]:[new te(o,1-l),new te(h,1-u),new te(f,1-m),new te(x,1-p)]}};function O1(s,e,t){if(t.shapes=[],Array.isArray(s))for(let n=0,i=s.length;n<i;n++){const r=s[n];t.shapes.push(r.uuid)}else t.shapes.push(s.uuid);return e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class $a extends Oe{constructor(e,t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],i=[],r=[],a=[];let o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new Qe(i,3)),this.setAttribute("normal",new Qe(r,3)),this.setAttribute("uv",new Qe(a,2));function c(h){const u=i.length/3,d=h.extractPoints(t);let f=d.shape;const m=d.holes;pn.isClockWise(f)===!1&&(f=f.reverse());for(let x=0,p=m.length;x<p;x++){const g=m[x];pn.isClockWise(g)===!0&&(m[x]=g.reverse())}const v=pn.triangulateShape(f,m);for(let x=0,p=m.length;x<p;x++){const g=m[x];f=f.concat(g)}for(let x=0,p=f.length;x<p;x++){const g=f[x];i.push(g.x,g.y,0),r.push(0,0,1),a.push(g.x,g.y)}for(let x=0,p=v.length;x<p;x++){const g=v[x],w=g[0]+u,M=g[1]+u,T=g[2]+u;n.push(w,M,T),l+=3}}}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return H1(t,e)}static fromJSON(e,t){const n=[];for(let i=0,r=e.shapes.length;i<r;i++){const a=t[e.shapes[i]];n.push(a)}return new $a(n,e.curveSegments)}}function H1(s,e){if(e.shapes=[],Array.isArray(s))for(let t=0,n=s.length;t<n;t++){const i=s[t];e.shapes.push(i.uuid)}else e.shapes.push(s.uuid);return e}class G1 extends lt{constructor(e){super(),this.type="ShadowMaterial",this.color=new ve(0),this.transparent=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this}}G1.prototype.isShadowMaterial=!0;class Wc extends lt{constructor(e){super(),this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new ve(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ve(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=di,this.normalScale=new te(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this}}Wc.prototype.isMeshStandardMaterial=!0;class k1 extends Wc{constructor(e){super(),this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new te(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Mt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.sheenTint=new ve(0),this.transmission=0,this.transmissionMap=null,this.thickness=.01,this.thicknessMap=null,this.attenuationDistance=0,this.attenuationTint=new ve(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularTint=new ve(1,1,1),this.specularTintMap=null,this._clearcoat=0,this._transmission=0,this.setValues(e)}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.ior=e.ior,this.sheenTint.copy(e.sheenTint),this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationTint.copy(e.attenuationTint),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularTint.copy(e.specularTint),this.specularTintMap=e.specularTintMap,this}}k1.prototype.isMeshPhysicalMaterial=!0;class qc extends lt{constructor(e){super(),this.type="MeshPhongMaterial",this.color=new ve(16777215),this.specular=new ve(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ve(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=di,this.normalScale=new te(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=ss,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this}}qc.prototype.isMeshPhongMaterial=!0;class V1 extends lt{constructor(e){super(),this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new ve(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ve(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=di,this.normalScale=new te(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.gradientMap=e.gradientMap,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this}}V1.prototype.isMeshToonMaterial=!0;class W1 extends lt{constructor(e){super(),this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=di,this.normalScale=new te(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}}W1.prototype.isMeshNormalMaterial=!0;class q1 extends lt{constructor(e){super(),this.type="MeshLambertMaterial",this.color=new ve(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ve(0),this.emissiveIntensity=1,this.emissiveMap=null,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=ss,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this}}q1.prototype.isMeshLambertMaterial=!0;class X1 extends lt{constructor(e){super(),this.defines={MATCAP:""},this.type="MeshMatcapMaterial",this.color=new ve(16777215),this.matcap=null,this.map=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=di,this.normalScale=new te(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.defines={MATCAP:""},this.color.copy(e.color),this.matcap=e.matcap,this.map=e.map,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.flatShading=e.flatShading,this}}X1.prototype.isMeshMatcapMaterial=!0;class Y1 extends er{constructor(e){super(),this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}Y1.prototype.isLineDashedMaterial=!0;const He={arraySlice:function(s,e,t){return He.isTypedArray(s)?new s.constructor(s.subarray(e,t!==void 0?t:s.length)):s.slice(e,t)},convertArray:function(s,e,t){return!s||!t&&s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)},isTypedArray:function(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)},getKeyframeOrder:function(s){function e(i,r){return s[i]-s[r]}const t=s.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n},sortedArray:function(s,e,t){const n=s.length,i=new s.constructor(n);for(let r=0,a=0;a!==n;++r){const o=t[r]*e;for(let l=0;l!==e;++l)i[a++]=s[o+l]}return i},flattenJSON:function(s,e,t,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(e.push(r.time),t.push.apply(t,a)),r=s[i++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=s[i++];while(r!==void 0);else do a=r[n],a!==void 0&&(e.push(r.time),t.push(a)),r=s[i++];while(r!==void 0)},subclip:function(s,e,t,n,i=30){const r=s.clone();r.name=e;const a=[];for(let l=0;l<r.tracks.length;++l){const c=r.tracks[l],h=c.getValueSize(),u=[],d=[];for(let f=0;f<c.times.length;++f){const m=c.times[f]*i;if(!(m<t||m>=n)){u.push(c.times[f]);for(let v=0;v<h;++v)d.push(c.values[f*h+v])}}u.length!==0&&(c.times=He.convertArray(u,c.times.constructor),c.values=He.convertArray(d,c.values.constructor),a.push(c))}r.tracks=a;let o=1/0;for(let l=0;l<r.tracks.length;++l)o>r.tracks[l].times[0]&&(o=r.tracks[l].times[0]);for(let l=0;l<r.tracks.length;++l)r.tracks[l].shift(-1*o);return r.resetDuration(),r},makeClipAdditive:function(s,e=0,t=s,n=30){n<=0&&(n=30);const i=t.tracks.length,r=e/n;for(let a=0;a<i;++a){const o=t.tracks[a],l=o.ValueTypeName;if(l==="bool"||l==="string")continue;const c=s.tracks.find(function(p){return p.name===o.name&&p.ValueTypeName===l});if(c===void 0)continue;let h=0;const u=o.getValueSize();o.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(h=u/3);let d=0;const f=c.getValueSize();c.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(d=f/3);const m=o.times.length-1;let v;if(r<=o.times[0]){const p=h,g=u-h;v=He.arraySlice(o.values,p,g)}else if(r>=o.times[m]){const p=m*u+h,g=p+u-h;v=He.arraySlice(o.values,p,g)}else{const p=o.createInterpolant(),g=h,w=u-h;p.evaluate(r),v=He.arraySlice(p.resultBuffer,g,w)}l==="quaternion"&&new vt().fromArray(v).normalize().conjugate().toArray(v);const x=c.times.length;for(let p=0;p<x;++p){const g=p*f+d;if(l==="quaternion")vt.multiplyQuaternionsFlat(c.values,g,v,0,c.values,g);else{const w=f-d*2;for(let M=0;M<w;++M)c.values[g+M]-=v[M]}}}return s.blendMode=ac,s}};class vn{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],r=t[n-1];e:{t:{let a;n:{i:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.afterEnd_(n-1,e,r)}if(n===o)break;if(r=i,i=t[++n],e<i)break t}a=t.length;break n}if(!(e>=r)){const o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.beforeStart_(0,e,i);if(n===l)break;if(i=r,r=t[--n-1],e>=r)break t}a=n,n=0;break n}break e}for(;n<a;){const o=n+a>>>1;e<t[o]?a=o:n=o+1}if(i=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.beforeStart_(0,e,i);if(i===void 0)return n=t.length,this._cachedIndex=n,this.afterEnd_(n-1,r,e)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i;for(let a=0;a!==i;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}vn.prototype.beforeStart_=vn.prototype.copySampleValue_;vn.prototype.afterEnd_=vn.prototype.copySampleValue_;class Z1 extends vn{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ei,endingEnd:ei}}intervalChanged_(e,t,n){const i=this.parameterPositions;let r=e-2,a=e+1,o=i[r],l=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case ti:r=e,o=2*t-n;break;case jr:r=i.length-2,o=t+i[r]-i[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case ti:a=e,l=2*n-t;break;case jr:a=1,l=n+i[1]-i[0];break;default:a=e-1,l=t}const c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,m=(n-t)/(i-t),v=m*m,x=v*m,p=-d*x+2*d*v-d*m,g=(1+d)*x+(-1.5-2*d)*v+(-.5+d)*m+1,w=(-1-f)*x+(1.5+f)*v+.5*m,M=f*x-f*v;for(let T=0;T!==o;++T)r[T]=p*a[h+T]+g*a[c+T]+w*a[l+T]+M*a[u+T];return r}}class Xc extends vn{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(i-t),u=1-h;for(let d=0;d!==o;++d)r[d]=a[c+d]*u+a[l+d]*h;return r}}class j1 extends vn{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class kt{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=He.convertArray(t,this.TimeBufferType),this.values=He.convertArray(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:He.convertArray(e.times,Array),values:He.convertArray(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new j1(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Xc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Z1(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Yr:t=this.InterpolantFactoryMethodDiscrete;break;case Zr:t=this.InterpolantFactoryMethodLinear;break;case Cs:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Yr;case this.InterpolantFactoryMethodLinear:return Zr;case this.InterpolantFactoryMethodSmooth:return Cs}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){const n=this.times,i=n.length;let r=0,a=i-1;for(;r!==i&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==i){r>=a&&(a=Math.max(a,1),r=a-1);const o=this.getValueSize();this.times=He.arraySlice(n,r,a),this.values=He.arraySlice(this.values,r*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){const l=n[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(i!==void 0&&He.isTypedArray(i))for(let o=0,l=i.length;o!==l;++o){const c=i[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){const e=He.arraySlice(this.times),t=He.arraySlice(this.values),n=this.getValueSize(),i=this.getInterpolation()===Cs,r=e.length-1;let a=1;for(let o=1;o<r;++o){let l=!1;const c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(i)l=!0;else{const u=o*n,d=u-n,f=u+n;for(let m=0;m!==n;++m){const v=t[u+m];if(v!==t[d+m]||v!==t[f+m]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];const u=o*n,d=a*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=He.arraySlice(e,0,a),this.values=He.arraySlice(t,0,a*n)):(this.times=e,this.values=t),this}clone(){const e=He.arraySlice(this.times,0),t=He.arraySlice(this.values,0),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}}kt.prototype.TimeBufferType=Float32Array;kt.prototype.ValueBufferType=Float32Array;kt.prototype.DefaultInterpolation=Zr;class _i extends kt{}_i.prototype.ValueTypeName="bool";_i.prototype.ValueBufferType=Array;_i.prototype.DefaultInterpolation=Yr;_i.prototype.InterpolantFactoryMethodLinear=void 0;_i.prototype.InterpolantFactoryMethodSmooth=void 0;class Yc extends kt{}Yc.prototype.ValueTypeName="color";class Qr extends kt{}Qr.prototype.ValueTypeName="number";class J1 extends vn{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(i-t);let c=e*o;for(let h=c+o;c!==h;c+=4)vt.slerpFlat(r,0,a,c-o,a,c,l);return r}}class tr extends kt{InterpolantFactoryMethodLinear(e){return new J1(this.times,this.values,this.getValueSize(),e)}}tr.prototype.ValueTypeName="quaternion";tr.prototype.DefaultInterpolation=Zr;tr.prototype.InterpolantFactoryMethodSmooth=void 0;class yi extends kt{}yi.prototype.ValueTypeName="string";yi.prototype.ValueBufferType=Array;yi.prototype.DefaultInterpolation=Yr;yi.prototype.InterpolantFactoryMethodLinear=void 0;yi.prototype.InterpolantFactoryMethodSmooth=void 0;class $r extends kt{}$r.prototype.ValueTypeName="vector";class Vl{constructor(e,t=-1,n,i=Na){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=Ot(),this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push($1(n[a]).scale(i));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let r=0,a=n.length;r!==a;++r)t.push(kt.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const r=t.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);const h=He.getKeyframeOrder(l);l=He.sortedArray(l,1,h),c=He.sortedArray(c,1,h),!i&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new Qr(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){const c=e[o],h=c.name.match(r);if(h&&h.length>1){const u=h[1];let d=i[u];d||(i[u]=d=[]),d.push(c)}}const a=[];for(const o in i)a.push(this.CreateFromMorphTargetSequence(o,i[o],t,n));return a}static parseAnimation(e,t){if(!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(u,d,f,m,v){if(f.length!==0){const x=[],p=[];He.flattenJSON(f,x,p,m),x.length!==0&&v.push(new u(d,x,p))}},i=[],r=e.name||"default",a=e.fps||30,o=e.blendMode;let l=e.length||-1;const c=e.hierarchy||[];for(let u=0;u<c.length;u++){const d=c[u].keys;if(!(!d||d.length===0))if(d[0].morphTargets){const f={};let m;for(m=0;m<d.length;m++)if(d[m].morphTargets)for(let v=0;v<d[m].morphTargets.length;v++)f[d[m].morphTargets[v]]=-1;for(const v in f){const x=[],p=[];for(let g=0;g!==d[m].morphTargets.length;++g){const w=d[m];x.push(w.time),p.push(w.morphTarget===v?1:0)}i.push(new Qr(".morphTargetInfluence["+v+"]",x,p))}l=f.length*(a||1)}else{const f=".bones["+t[u].name+"]";n($r,f+".position",d,"pos",i),n(tr,f+".quaternion",d,"rot",i),n($r,f+".scale",d,"scl",i)}}return i.length===0?null:new this(r,l,i,o)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function Q1(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Qr;case"vector":case"vector2":case"vector3":case"vector4":return $r;case"color":return Yc;case"quaternion":return tr;case"bool":case"boolean":return _i;case"string":return yi}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function $1(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=Q1(s.type);if(s.times===void 0){const t=[],n=[];He.flattenJSON(s.keys,t,n,"value"),s.times=t,s.values=n}return e.parse!==void 0?e.parse(s):new e(s.name,s.times,s.values,s.interpolation)}const hi={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(this.files[s]=e)},get:function(s){if(this.enabled!==!1)return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};class K1{constructor(e,t,n){const i=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){o++,r===!1&&i.onStart!==void 0&&i.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,i.onProgress!==void 0&&i.onProgress(h,a,o),a===o&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){const u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){const f=c[u],m=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return m}return null}}}const ev=new K1;class xn{constructor(e){this.manager=e!==void 0?e:ev,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,r){n.load(e,i,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}const It={};class tv extends xn{constructor(e){super(e)}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=hi.get(e);if(a!==void 0)return r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a;if(It[e]!==void 0){It[e].push({onLoad:t,onProgress:n,onError:i});return}const o=/^data:(.*?)(;base64)?,(.*)$/,l=e.match(o);let c;if(l){const h=l[1],u=!!l[2];let d=l[3];d=decodeURIComponent(d),u&&(d=atob(d));try{let f;const m=(this.responseType||"").toLowerCase();switch(m){case"arraybuffer":case"blob":const v=new Uint8Array(d.length);for(let p=0;p<d.length;p++)v[p]=d.charCodeAt(p);m==="blob"?f=new Blob([v.buffer],{type:h}):f=v.buffer;break;case"document":f=new DOMParser().parseFromString(d,h);break;case"json":f=JSON.parse(d);break;default:f=d;break}setTimeout(function(){t&&t(f),r.manager.itemEnd(e)},0)}catch(f){setTimeout(function(){i&&i(f),r.manager.itemError(e),r.manager.itemEnd(e)},0)}}else{It[e]=[],It[e].push({onLoad:t,onProgress:n,onError:i}),c=new XMLHttpRequest,c.open("GET",e,!0),c.addEventListener("load",function(h){const u=this.response,d=It[e];if(delete It[e],this.status===200||this.status===0){this.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),hi.add(e,u);for(let f=0,m=d.length;f<m;f++){const v=d[f];v.onLoad&&v.onLoad(u)}r.manager.itemEnd(e)}else{for(let f=0,m=d.length;f<m;f++){const v=d[f];v.onError&&v.onError(h)}r.manager.itemError(e),r.manager.itemEnd(e)}},!1),c.addEventListener("progress",function(h){const u=It[e];for(let d=0,f=u.length;d<f;d++){const m=u[d];m.onProgress&&m.onProgress(h)}},!1),c.addEventListener("error",function(h){const u=It[e];delete It[e];for(let d=0,f=u.length;d<f;d++){const m=u[d];m.onError&&m.onError(h)}r.manager.itemError(e),r.manager.itemEnd(e)},!1),c.addEventListener("abort",function(h){const u=It[e];delete It[e];for(let d=0,f=u.length;d<f;d++){const m=u[d];m.onError&&m.onError(h)}r.manager.itemError(e),r.manager.itemEnd(e)},!1),this.responseType!==void 0&&(c.responseType=this.responseType),this.withCredentials!==void 0&&(c.withCredentials=this.withCredentials),c.overrideMimeType&&c.overrideMimeType(this.mimeType!==void 0?this.mimeType:"text/plain");for(const h in this.requestHeader)c.setRequestHeader(h,this.requestHeader[h]);c.send(null)}return r.manager.itemStart(e),c}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class Zc extends xn{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=hi.get(e);if(a!==void 0)return r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a;const o=document.createElementNS("http://www.w3.org/1999/xhtml","img");function l(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1),hi.add(e,this),t&&t(this),r.manager.itemEnd(e)}function c(h){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1),i&&i(h),r.manager.itemError(e),r.manager.itemEnd(e)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.substr(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),r.manager.itemStart(e),o.src=e,o}}class nv extends xn{constructor(e){super(e)}load(e,t,n,i){const r=new us,a=new Zc(this.manager);a.setCrossOrigin(this.crossOrigin),a.setPath(this.path);let o=0;function l(c){a.load(e[c],function(h){r.images[c]=h,o++,o===6&&(r.needsUpdate=!0,t&&t(r))},void 0,i)}for(let c=0;c<e.length;++c)l(c);return r}}class iv extends xn{constructor(e){super(e)}load(e,t,n,i){const r=new nt,a=new Zc(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o;const l=e.search(/\.jpe?g($|\?)/i)>0||e.search(/^data\:image\/jpeg/)===0;r.format=l?un:St,r.needsUpdate=!0,t!==void 0&&t(r)},n,i),r}}class rv extends At{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);e.equals(t)||this.curves.push(new ms(t,e))}getPoint(e){const t=e*this.getLength(),n=this.getCurveLengths();let i=0;for(;i<n.length;){if(n[i]>=t){const r=n[i]-t,a=this.curves[i],o=a.getLength(),l=o===0?0:1-r/o;return a.getPointAt(l)}i++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let i=0,r=this.curves;i<r.length;i++){const a=r[i],o=a&&a.isEllipseCurve?e*2:a&&(a.isLineCurve||a.isLineCurve3)?1:a&&a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(new Hc[i.type]().fromJSON(i))}return this}}class La extends rv{constructor(e){super(),this.type="Path",this.currentPoint=new te,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new ms(this.currentPoint.clone(),new te(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){const r=new Ja(this.currentPoint.clone(),new te(e,t),new te(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,r,a){const o=new ja(this.currentPoint.clone(),new te(e,t),new te(n,i),new te(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new Qa(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,i,r,a),this}absarc(e,t,n,i,r,a){return this.absellipse(e,t,n,n,i,r,a),this}ellipse(e,t,n,i,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,i,r,a,o,l),this}absellipse(e,t,n,i,r,a,o,l){const c=new ps(e,t,n,i,r,a,o,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Ka extends La{constructor(e){super(e),this.uuid=Ot(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(new La().fromJSON(i))}return this}}class Gt extends De{constructor(e,t=1){super(),this.type="Light",this.color=new ve(e),this.intensity=t}dispose(){}copy(e){return super.copy(e),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}Gt.prototype.isLight=!0;class sv extends Gt{constructor(e,t,n){super(e,n),this.type="HemisphereLight",this.position.copy(De.DefaultUp),this.updateMatrix(),this.groundColor=new ve(t)}copy(e){return Gt.prototype.copy.call(this,e),this.groundColor.copy(e.groundColor),this}}sv.prototype.isHemisphereLight=!0;const Wl=new be,ql=new E,Xl=new E;class eo{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new te(512,512),this.map=null,this.mapPass=null,this.matrix=new be,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ds,this._frameExtents=new te(1,1),this._viewportCount=1,this._viewports=[new ze(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;ql.setFromMatrixPosition(e.matrixWorld),t.position.copy(ql),Xl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Xl),t.updateMatrixWorld(),Wl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Wl),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(t.projectionMatrix),n.multiply(t.matrixWorldInverse)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class jc extends eo{constructor(){super(new ht(50,1,.5,500)),this.focus=1}updateMatrices(e){const t=this.camera,n=Ma*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height,r=e.distance||t.far;(n!==t.fov||i!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=i,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}jc.prototype.isSpotLightShadow=!0;class av extends Gt{constructor(e,t,n=0,i=Math.PI/3,r=0,a=1){super(e,t),this.type="SpotLight",this.position.copy(De.DefaultUp),this.updateMatrix(),this.target=new De,this.distance=n,this.angle=i,this.penumbra=r,this.decay=a,this.shadow=new jc}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}av.prototype.isSpotLight=!0;const Yl=new be,Ii=new E,ua=new E;class Jc extends eo{constructor(){super(new ht(90,1,.5,500)),this._frameExtents=new te(4,2),this._viewportCount=6,this._viewports=[new ze(2,1,1,1),new ze(0,1,1,1),new ze(3,1,1,1),new ze(1,1,1,1),new ze(3,0,1,1),new ze(1,0,1,1)],this._cubeDirections=[new E(1,0,0),new E(-1,0,0),new E(0,0,1),new E(0,0,-1),new E(0,1,0),new E(0,-1,0)],this._cubeUps=[new E(0,1,0),new E(0,1,0),new E(0,1,0),new E(0,1,0),new E(0,0,1),new E(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,i=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Ii.setFromMatrixPosition(e.matrixWorld),n.position.copy(Ii),ua.copy(n.position),ua.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(ua),n.updateMatrixWorld(),i.makeTranslation(-Ii.x,-Ii.y,-Ii.z),Yl.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Yl)}}Jc.prototype.isPointLightShadow=!0;class ov extends Gt{constructor(e,t,n=0,i=1){super(e,t),this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Jc}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}ov.prototype.isPointLight=!0;class Qc extends eo{constructor(){super(new ka(-5,5,5,-5,.5,500))}}Qc.prototype.isDirectionalLightShadow=!0;class $c extends Gt{constructor(e,t){super(e,t),this.type="DirectionalLight",this.position.copy(De.DefaultUp),this.updateMatrix(),this.target=new De,this.shadow=new Qc}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}$c.prototype.isDirectionalLight=!0;class Kc extends Gt{constructor(e,t){super(e,t),this.type="AmbientLight"}}Kc.prototype.isAmbientLight=!0;class lv extends Gt{constructor(e,t,n=10,i=10){super(e,t),this.type="RectAreaLight",this.width=n,this.height=i}get power(){return this.intensity*this.width*this.height*Math.PI}set power(e){this.intensity=e/(this.width*this.height*Math.PI)}copy(e){return super.copy(e),this.width=e.width,this.height=e.height,this}toJSON(e){const t=super.toJSON(e);return t.object.width=this.width,t.object.height=this.height,t}}lv.prototype.isRectAreaLight=!0;class eh{constructor(){this.coefficients=[];for(let e=0;e<9;e++)this.coefficients.push(new E)}set(e){for(let t=0;t<9;t++)this.coefficients[t].copy(e[t]);return this}zero(){for(let e=0;e<9;e++)this.coefficients[e].set(0,0,0);return this}getAt(e,t){const n=e.x,i=e.y,r=e.z,a=this.coefficients;return t.copy(a[0]).multiplyScalar(.282095),t.addScaledVector(a[1],.488603*i),t.addScaledVector(a[2],.488603*r),t.addScaledVector(a[3],.488603*n),t.addScaledVector(a[4],1.092548*(n*i)),t.addScaledVector(a[5],1.092548*(i*r)),t.addScaledVector(a[6],.315392*(3*r*r-1)),t.addScaledVector(a[7],1.092548*(n*r)),t.addScaledVector(a[8],.546274*(n*n-i*i)),t}getIrradianceAt(e,t){const n=e.x,i=e.y,r=e.z,a=this.coefficients;return t.copy(a[0]).multiplyScalar(.886227),t.addScaledVector(a[1],2*.511664*i),t.addScaledVector(a[2],2*.511664*r),t.addScaledVector(a[3],2*.511664*n),t.addScaledVector(a[4],2*.429043*n*i),t.addScaledVector(a[5],2*.429043*i*r),t.addScaledVector(a[6],.743125*r*r-.247708),t.addScaledVector(a[7],2*.429043*n*r),t.addScaledVector(a[8],.429043*(n*n-i*i)),t}add(e){for(let t=0;t<9;t++)this.coefficients[t].add(e.coefficients[t]);return this}addScaledSH(e,t){for(let n=0;n<9;n++)this.coefficients[n].addScaledVector(e.coefficients[n],t);return this}scale(e){for(let t=0;t<9;t++)this.coefficients[t].multiplyScalar(e);return this}lerp(e,t){for(let n=0;n<9;n++)this.coefficients[n].lerp(e.coefficients[n],t);return this}equals(e){for(let t=0;t<9;t++)if(!this.coefficients[t].equals(e.coefficients[t]))return!1;return!0}copy(e){return this.set(e.coefficients)}clone(){return new this.constructor().copy(this)}fromArray(e,t=0){const n=this.coefficients;for(let i=0;i<9;i++)n[i].fromArray(e,t+i*3);return this}toArray(e=[],t=0){const n=this.coefficients;for(let i=0;i<9;i++)n[i].toArray(e,t+i*3);return e}static getBasisAt(e,t){const n=e.x,i=e.y,r=e.z;t[0]=.282095,t[1]=.488603*i,t[2]=.488603*r,t[3]=.488603*n,t[4]=1.092548*n*i,t[5]=1.092548*i*r,t[6]=.315392*(3*r*r-1),t[7]=1.092548*n*r,t[8]=.546274*(n*n-i*i)}}eh.prototype.isSphericalHarmonics3=!0;class to extends Gt{constructor(e=new eh,t=1){super(void 0,t),this.sh=e}copy(e){return super.copy(e),this.sh.copy(e.sh),this}fromJSON(e){return this.intensity=e.intensity,this.sh.fromArray(e.sh),this}toJSON(e){const t=super.toJSON(e);return t.object.sh=this.sh.toArray(),t}}to.prototype.isLightProbe=!0;class cv{static decodeText(e){if(typeof TextDecoder<"u")return new TextDecoder().decode(e);let t="";for(let n=0,i=e.length;n<i;n++)t+=String.fromCharCode(e[n]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.substr(0,t+1)}}class hv extends Oe{constructor(){super(),this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}clone(){return new this.constructor().copy(this)}toJSON(){const e=super.toJSON(this);return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}hv.prototype.isInstancedBufferGeometry=!0;class uv extends xn{constructor(e){super(e),typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=hi.get(e);if(a!==void 0)return r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a;const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,fetch(e,o).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(l){hi.add(e,l),t&&t(l),r.manager.itemEnd(e)}).catch(function(l){i&&i(l),r.manager.itemError(e),r.manager.itemEnd(e)}),r.manager.itemStart(e)}}uv.prototype.isImageBitmapLoader=!0;let Or;const dv={getContext:function(){return Or===void 0&&(Or=new(window.AudioContext||window.webkitAudioContext)),Or},setContext:function(s){Or=s}};class fv extends xn{constructor(e){super(e)}load(e,t,n,i){const r=this,a=new tv(this.manager);a.setResponseType("arraybuffer"),a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(e,function(o){try{const l=o.slice(0);dv.getContext().decodeAudioData(l,function(h){t(h)})}catch(l){i?i(l):console.error(l),r.manager.itemError(e)}},n,i)}}class pv extends to{constructor(e,t,n=1){super(void 0,n);const i=new ve().set(e),r=new ve().set(t),a=new E(i.r,i.g,i.b),o=new E(r.r,r.g,r.b),l=Math.sqrt(Math.PI),c=l*Math.sqrt(.75);this.sh.coefficients[0].copy(a).add(o).multiplyScalar(l),this.sh.coefficients[1].copy(a).sub(o).multiplyScalar(c)}}pv.prototype.isHemisphereLightProbe=!0;class mv extends to{constructor(e,t=1){super(void 0,t);const n=new ve().set(e);this.sh.coefficients[0].set(n.r,n.g,n.b).multiplyScalar(2*Math.sqrt(Math.PI))}}mv.prototype.isAmbientLightProbe=!0;class gv extends De{constructor(e){super(),this.type="Audio",this.listener=e,this.context=e.context,this.gain=this.context.createGain(),this.gain.connect(e.getInput()),this.autoplay=!1,this.buffer=null,this.detune=0,this.loop=!1,this.loopStart=0,this.loopEnd=0,this.offset=0,this.duration=void 0,this.playbackRate=1,this.isPlaying=!1,this.hasPlaybackControl=!0,this.source=null,this.sourceType="empty",this._startedAt=0,this._progress=0,this._connected=!1,this.filters=[]}getOutput(){return this.gain}setNodeSource(e){return this.hasPlaybackControl=!1,this.sourceType="audioNode",this.source=e,this.connect(),this}setMediaElementSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaNode",this.source=this.context.createMediaElementSource(e),this.connect(),this}setMediaStreamSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaStreamNode",this.source=this.context.createMediaStreamSource(e),this.connect(),this}setBuffer(e){return this.buffer=e,this.sourceType="buffer",this.autoplay&&this.play(),this}play(e=0){if(this.isPlaying===!0){console.warn("THREE.Audio: Audio is already playing.");return}if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}this._startedAt=this.context.currentTime+e;const t=this.context.createBufferSource();return t.buffer=this.buffer,t.loop=this.loop,t.loopStart=this.loopStart,t.loopEnd=this.loopEnd,t.onended=this.onEnded.bind(this),t.start(this._startedAt,this._progress+this.offset,this.duration),this.isPlaying=!0,this.source=t,this.setDetune(this.detune),this.setPlaybackRate(this.playbackRate),this.connect()}pause(){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.isPlaying===!0&&(this._progress+=Math.max(this.context.currentTime-this._startedAt,0)*this.playbackRate,this.loop===!0&&(this._progress=this._progress%(this.duration||this.buffer.duration)),this.source.stop(),this.source.onended=null,this.isPlaying=!1),this}stop(){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this._progress=0,this.source.stop(),this.source.onended=null,this.isPlaying=!1,this}connect(){if(this.filters.length>0){this.source.connect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].connect(this.filters[e]);this.filters[this.filters.length-1].connect(this.getOutput())}else this.source.connect(this.getOutput());return this._connected=!0,this}disconnect(){if(this.filters.length>0){this.source.disconnect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].disconnect(this.filters[e]);this.filters[this.filters.length-1].disconnect(this.getOutput())}else this.source.disconnect(this.getOutput());return this._connected=!1,this}getFilters(){return this.filters}setFilters(e){return e||(e=[]),this._connected===!0?(this.disconnect(),this.filters=e.slice(),this.connect()):this.filters=e.slice(),this}setDetune(e){if(this.detune=e,this.source.detune!==void 0)return this.isPlaying===!0&&this.source.detune.setTargetAtTime(this.detune,this.context.currentTime,.01),this}getDetune(){return this.detune}getFilter(){return this.getFilters()[0]}setFilter(e){return this.setFilters(e?[e]:[])}setPlaybackRate(e){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.playbackRate=e,this.isPlaying===!0&&this.source.playbackRate.setTargetAtTime(this.playbackRate,this.context.currentTime,.01),this}getPlaybackRate(){return this.playbackRate}onEnded(){this.isPlaying=!1}getLoop(){return this.hasPlaybackControl===!1?(console.warn("THREE.Audio: this Audio has no playback control."),!1):this.loop}setLoop(e){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.loop=e,this.isPlaying===!0&&(this.source.loop=this.loop),this}setLoopStart(e){return this.loopStart=e,this}setLoopEnd(e){return this.loopEnd=e,this}getVolume(){return this.gain.gain.value}setVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}}class vv{constructor(e,t,n){this.binding=e,this.valueSize=n;let i,r,a;switch(t){case"quaternion":i=this._slerp,r=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,r=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,r=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=r,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){const n=this.buffer,i=this.valueSize,r=e*i+i;let a=this.cumulativeWeight;if(a===0){for(let o=0;o!==i;++o)n[r+o]=n[o];a=t}else{a+=t;const o=t/a;this._mixBufferRegion(n,r,0,o,i)}this.cumulativeWeight=a}accumulateAdditive(e){const t=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,i,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){const t=this.valueSize,n=this.buffer,i=e*t+t,r=this.cumulativeWeight,a=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){const l=t*this._origIndex;this._mixBufferRegion(n,i,l,1-r,t)}a>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*t,1,t);for(let l=t,c=t+t;l!==c;++l)if(n[l]!==n[l+t]){o.setValue(n,i);break}}saveOriginalState(){const e=this.binding,t=this.buffer,n=this.valueSize,i=n*this._origIndex;e.getValue(t,i);for(let r=n,a=i;r!==a;++r)t[r]=t[i+r%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){const e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,i,r){if(i>=.5)for(let a=0;a!==r;++a)e[t+a]=e[n+a]}_slerp(e,t,n,i){vt.slerpFlat(e,t,e,t,e,n,i)}_slerpAdditive(e,t,n,i,r){const a=this._workIndex*r;vt.multiplyQuaternionsFlat(e,a,e,t,e,n),vt.slerpFlat(e,t,e,t,e,a,i)}_lerp(e,t,n,i,r){const a=1-i;for(let o=0;o!==r;++o){const l=t+o;e[l]=e[l]*a+e[n+o]*i}}_lerpAdditive(e,t,n,i,r){for(let a=0;a!==r;++a){const o=t+a;e[o]=e[o]+e[n+a]*i}}}const no="\\[\\]\\.:\\/",xv=new RegExp("["+no+"]","g"),io="[^"+no+"]",_v="[^"+no.replace("\\.","")+"]",yv=/((?:WC+[\/:])*)/.source.replace("WC",io),bv=/(WCOD+)?/.source.replace("WCOD",_v),Mv=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",io),wv=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",io),Sv=new RegExp("^"+yv+bv+Mv+wv+"$"),Tv=["material","materials","bones"];class Ev{constructor(e,t,n){const i=n||Ne.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class Ne{constructor(e,t,n){this.path=t,this.parsedPath=n||Ne.parseTrackName(t),this.node=Ne.findNode(e,this.parsedPath.nodeName)||e,this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new Ne.Composite(e,t,n):new Ne(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(xv,"")}static parseTrackName(e){const t=Sv.exec(e);if(!t)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const r=n.nodeName.substring(i+1);Tv.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(!t||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(r){for(let a=0;a<r.length;a++){const o=r[a];if(o.name===t||o.uuid===t)return o;const l=n(o.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let r=t.propertyIndex;if(e||(e=Ne.findNode(this.rootNode,t.nodeName)||this.rootNode,this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.error("THREE.PropertyBinding: Trying to update node for track: "+this.path+" but it wasn't found.");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const a=e[i];if(a===void 0){const c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(e.geometry.isBufferGeometry){if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}else{console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences on THREE.Geometry. Use THREE.BufferGeometry instead.",this);return}}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}Ne.Composite=Ev;Ne.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ne.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ne.prototype.GetterByBindingType=[Ne.prototype._getValue_direct,Ne.prototype._getValue_array,Ne.prototype._getValue_arrayElement,Ne.prototype._getValue_toArray];Ne.prototype.SetterByBindingTypeAndVersioning=[[Ne.prototype._setValue_direct,Ne.prototype._setValue_direct_setNeedsUpdate,Ne.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ne.prototype._setValue_array,Ne.prototype._setValue_array_setNeedsUpdate,Ne.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ne.prototype._setValue_arrayElement,Ne.prototype._setValue_arrayElement_setNeedsUpdate,Ne.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ne.prototype._setValue_fromArray,Ne.prototype._setValue_fromArray_setNeedsUpdate,Ne.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class Av{constructor(e,t,n=null,i=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=i;const r=t.tracks,a=r.length,o=new Array(a),l={endingStart:ei,endingEnd:ei};for(let c=0;c!==a;++c){const h=r[c].createInterpolant(null);o[c]=h,h.settings=l}this._interpolantSettings=l,this._interpolants=o,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=hf,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n){if(e.fadeOut(t),this.fadeIn(t),n){const i=this._clip.duration,r=e._clip.duration,a=r/i,o=i/r;e.warp(1,a,t),this.warp(o,1,t)}return this}crossFadeTo(e,t,n){return e.crossFadeFrom(this,t,n)}stopFading(){const e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){const i=this._mixer,r=i.time,a=this.timeScale;let o=this._timeScaleInterpolant;o===null&&(o=i._lendControlInterpolant(),this._timeScaleInterpolant=o);const l=o.parameterPositions,c=o.sampleValues;return l[0]=r,l[1]=r+n,c[0]=e/a,c[1]=t/a,this}stopWarping(){const e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,i){if(!this.enabled){this._updateWeight(e);return}const r=this._startTime;if(r!==null){const l=(e-r)*n;if(l<0||n===0)return;this._startTime=null,t=n*l}t*=this._updateTimeScale(e);const a=this._updateTime(t),o=this._updateWeight(e);if(o>0){const l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case ac:for(let h=0,u=l.length;h!==u;++h)l[h].evaluate(a),c[h].accumulateAdditive(o);break;case Na:default:for(let h=0,u=l.length;h!==u;++h)l[h].evaluate(a),c[h].accumulate(i,o)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;const n=this._weightInterpolant;if(n!==null){const i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;const n=this._timeScaleInterpolant;n!==null&&(t*=n.evaluate(e)[0],e>n.parameterPositions[1]&&(this.stopWarping(),t===0?this.paused=!0:this.timeScale=t))}return this._effectiveTimeScale=t,t}_updateTime(e){const t=this._clip.duration,n=this.loop;let i=this.time+e,r=this._loopCount;const a=n===uf;if(e===0)return r===-1?i:a&&(r&1)===1?t-i:i;if(n===cf){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(i>=t)i=t;else if(i<0)i=0;else{this.time=i;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(r===-1&&(e>=0?(r=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),i>=t||i<0){const o=Math.floor(i/t);i-=t*o,r+=Math.abs(o);const l=this.repetitions-r;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=e>0?t:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(l===1){const c=e<0;this._setEndings(c,!c,a)}else this._setEndings(!1,!1,a);this._loopCount=r,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this.time=i;if(a&&(r&1)===1)return t-i}return i}_setEndings(e,t,n){const i=this._interpolantSettings;n?(i.endingStart=ti,i.endingEnd=ti):(e?i.endingStart=this.zeroSlopeAtStart?ti:ei:i.endingStart=jr,t?i.endingEnd=this.zeroSlopeAtEnd?ti:ei:i.endingEnd=jr)}_scheduleFading(e,t,n){const i=this._mixer,r=i.time;let a=this._weightInterpolant;a===null&&(a=i._lendControlInterpolant(),this._weightInterpolant=a);const o=a.parameterPositions,l=a.sampleValues;return o[0]=r,l[0]=t,o[1]=r+e,l[1]=n,this}}class Lv extends Cn{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(e,t){const n=e._localRoot||this._root,i=e._clip.tracks,r=i.length,a=e._propertyBindings,o=e._interpolants,l=n.uuid,c=this._bindingsByRootAndName;let h=c[l];h===void 0&&(h={},c[l]=h);for(let u=0;u!==r;++u){const d=i[u],f=d.name;let m=h[f];if(m!==void 0)a[u]=m;else{if(m=a[u],m!==void 0){m._cacheIndex===null&&(++m.referenceCount,this._addInactiveBinding(m,l,f));continue}const v=t&&t._propertyBindings[u].binding.parsedPath;m=new vv(Ne.create(n,f,v),d.ValueTypeName,d.getValueSize()),++m.referenceCount,this._addInactiveBinding(m,l,f),a[u]=m}o[u].resultBuffer=m.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){const n=(e._localRoot||this._root).uuid,i=e._clip.uuid,r=this._actionsByClip[i];this._bindAction(e,r&&r.knownActions[0]),this._addInactiveAction(e,i,n)}const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const r=t[n];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const r=t[n];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){const t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){const i=this._actions,r=this._actionsByClip;let a=r[t];if(a===void 0)a={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,r[t]=a;else{const o=a.knownActions;e._byClipCacheIndex=o.length,o.push(e)}e._cacheIndex=i.length,i.push(e),a.actionByRoot[n]=e}_removeInactiveAction(e){const t=this._actions,n=t[t.length-1],i=e._cacheIndex;n._cacheIndex=i,t[i]=n,t.pop(),e._cacheIndex=null;const r=e._clip.uuid,a=this._actionsByClip,o=a[r],l=o.knownActions,c=l[l.length-1],h=e._byClipCacheIndex;c._byClipCacheIndex=h,l[h]=c,l.pop(),e._byClipCacheIndex=null;const u=o.actionByRoot,d=(e._localRoot||this._root).uuid;delete u[d],l.length===0&&delete a[r],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const r=t[n];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(e){const t=this._actions,n=e._cacheIndex,i=this._nActiveActions++,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_takeBackAction(e){const t=this._actions,n=e._cacheIndex,i=--this._nActiveActions,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_addInactiveBinding(e,t,n){const i=this._bindingsByRootAndName,r=this._bindings;let a=i[t];a===void 0&&(a={},i[t]=a),a[n]=e,e._cacheIndex=r.length,r.push(e)}_removeInactiveBinding(e){const t=this._bindings,n=e.binding,i=n.rootNode.uuid,r=n.path,a=this._bindingsByRootAndName,o=a[i],l=t[t.length-1],c=e._cacheIndex;l._cacheIndex=c,t[c]=l,t.pop(),delete o[r],Object.keys(o).length===0&&delete a[i]}_lendBinding(e){const t=this._bindings,n=e._cacheIndex,i=this._nActiveBindings++,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_takeBackBinding(e){const t=this._bindings,n=e._cacheIndex,i=--this._nActiveBindings,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_lendControlInterpolant(){const e=this._controlInterpolants,t=this._nActiveControlInterpolants++;let n=e[t];return n===void 0&&(n=new Xc(new Float32Array(2),new Float32Array(2),1,this._controlInterpolantsResultBuffer),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){const t=this._controlInterpolants,n=e.__cacheIndex,i=--this._nActiveControlInterpolants,r=t[i];e.__cacheIndex=i,t[i]=e,r.__cacheIndex=n,t[n]=r}clipAction(e,t,n){const i=t||this._root,r=i.uuid;let a=typeof e=="string"?Vl.findByName(i,e):e;const o=a!==null?a.uuid:e,l=this._actionsByClip[o];let c=null;if(n===void 0&&(a!==null?n=a.blendMode:n=Na),l!==void 0){const u=l.actionByRoot[r];if(u!==void 0&&u.blendMode===n)return u;c=l.knownActions[0],a===null&&(a=c._clip)}if(a===null)return null;const h=new Av(this,a,t,n);return this._bindAction(h,c),this._addInactiveAction(h,o,r),h}existingAction(e,t){const n=t||this._root,i=n.uuid,r=typeof e=="string"?Vl.findByName(n,e):e,a=r?r.uuid:e,o=this._actionsByClip[a];return o!==void 0&&o.actionByRoot[i]||null}stopAllAction(){const e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;const t=this._actions,n=this._nActiveActions,i=this.time+=e,r=Math.sign(e),a=this._accuIndex^=1;for(let c=0;c!==n;++c)t[c]._update(i,e,r,a);const o=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)o[c].apply(a);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){const t=this._actions,n=e.uuid,i=this._actionsByClip,r=i[n];if(r!==void 0){const a=r.knownActions;for(let o=0,l=a.length;o!==l;++o){const c=a[o];this._deactivateAction(c);const h=c._cacheIndex,u=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,u._cacheIndex=h,t[h]=u,t.pop(),this._removeInactiveBindingsForAction(c)}delete i[n]}}uncacheRoot(e){const t=e.uuid,n=this._actionsByClip;for(const a in n){const o=n[a].actionByRoot,l=o[t];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}const i=this._bindingsByRootAndName,r=i[t];if(r!==void 0)for(const a in r){const o=r[a];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(e,t){const n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}}Lv.prototype._controlInterpolantsResultBuffer=new Float32Array(1);class Cv extends Ki{constructor(e,t,n=1){super(e,t),this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){const t=super.clone(e);return t.meshPerAttribute=this.meshPerAttribute,t}toJSON(e){const t=super.toJSON(e);return t.isInstancedInterleavedBuffer=!0,t.meshPerAttribute=this.meshPerAttribute,t}}Cv.prototype.isInstancedInterleavedBuffer=!0;class Rv extends De{constructor(e){super(),this.material=e,this.render=function(){},this.hasPositions=!1,this.hasNormals=!1,this.hasColors=!1,this.hasUvs=!1,this.positionArray=null,this.normalArray=null,this.colorArray=null,this.uvArray=null,this.count=0}}Rv.prototype.isImmediateRenderObject=!0;const cn=new E,Hr=new be,da=new be;class Pv extends Ya{constructor(e){const t=th(e),n=new Oe,i=[],r=[],a=new ve(0,0,1),o=new ve(0,1,0);for(let c=0;c<t.length;c++){const h=t[c];h.parent&&h.parent.isBone&&(i.push(0,0,0),i.push(0,0,0),r.push(a.r,a.g,a.b),r.push(o.r,o.g,o.b))}n.setAttribute("position",new Qe(i,3)),n.setAttribute("color",new Qe(r,3));const l=new er({vertexColors:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0});super(n,l),this.type="SkeletonHelper",this.isSkeletonHelper=!0,this.root=e,this.bones=t,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1}updateMatrixWorld(e){const t=this.bones,n=this.geometry,i=n.getAttribute("position");da.copy(this.root.matrixWorld).invert();for(let r=0,a=0;r<t.length;r++){const o=t[r];o.parent&&o.parent.isBone&&(Hr.multiplyMatrices(da,o.matrixWorld),cn.setFromMatrixPosition(Hr),i.setXYZ(a,cn.x,cn.y,cn.z),Hr.multiplyMatrices(da,o.parent.matrixWorld),cn.setFromMatrixPosition(Hr),i.setXYZ(a+1,cn.x,cn.y,cn.z),a+=2)}n.getAttribute("position").needsUpdate=!0,super.updateMatrixWorld(e)}}function th(s){const e=[];s&&s.isBone&&e.push(s);for(let t=0;t<s.children.length;t++)e.push.apply(e,th(s.children[t]));return e}class Iv extends Ya{constructor(e=10,t=10,n=4473924,i=8947848){n=new ve(n),i=new ve(i);const r=t/2,a=e/t,o=e/2,l=[],c=[];for(let d=0,f=0,m=-o;d<=t;d++,m+=a){l.push(-o,0,m,o,0,m),l.push(m,0,-o,m,0,o);const v=d===r?n:i;v.toArray(c,f),f+=3,v.toArray(c,f),f+=3,v.toArray(c,f),f+=3,v.toArray(c,f),f+=3}const h=new Oe;h.setAttribute("position",new Qe(l,3)),h.setAttribute("color",new Qe(c,3));const u=new er({vertexColors:!0,toneMapped:!1});super(h,u),this.type="GridHelper"}}const Dv=new Float32Array(1);new Int32Array(Dv.buffer);At.create=function(s,e){return console.log("THREE.Curve.create() has been deprecated"),s.prototype=Object.create(At.prototype),s.prototype.constructor=s,s.prototype.getPoint=e,s};La.prototype.fromPoints=function(s){return console.warn("THREE.Path: .fromPoints() has been renamed to .setFromPoints()."),this.setFromPoints(s)};Iv.prototype.setColors=function(){console.error("THREE.GridHelper: setColors() has been deprecated, pass them in the constructor instead.")};Pv.prototype.update=function(){console.error("THREE.SkeletonHelper: update() no longer needs to be called.")};xn.prototype.extractUrlBase=function(s){return console.warn("THREE.Loader: .extractUrlBase() has been deprecated. Use THREE.LoaderUtils.extractUrlBase() instead."),cv.extractUrlBase(s)};xn.Handlers={add:function(){console.error("THREE.Loader: Handlers.add() has been removed. Use LoadingManager.addHandler() instead.")},get:function(){console.error("THREE.Loader: Handlers.get() has been removed. Use LoadingManager.getHandler() instead.")}};Dt.prototype.center=function(s){return console.warn("THREE.Box3: .center() has been renamed to .getCenter()."),this.getCenter(s)};Dt.prototype.empty=function(){return console.warn("THREE.Box3: .empty() has been renamed to .isEmpty()."),this.isEmpty()};Dt.prototype.isIntersectionBox=function(s){return console.warn("THREE.Box3: .isIntersectionBox() has been renamed to .intersectsBox()."),this.intersectsBox(s)};Dt.prototype.isIntersectionSphere=function(s){return console.warn("THREE.Box3: .isIntersectionSphere() has been renamed to .intersectsSphere()."),this.intersectsSphere(s)};Dt.prototype.size=function(s){return console.warn("THREE.Box3: .size() has been renamed to .getSize()."),this.getSize(s)};pi.prototype.empty=function(){return console.warn("THREE.Sphere: .empty() has been renamed to .isEmpty()."),this.isEmpty()};ds.prototype.setFromMatrix=function(s){return console.warn("THREE.Frustum: .setFromMatrix() has been renamed to .setFromProjectionMatrix()."),this.setFromProjectionMatrix(s)};tt.prototype.flattenToArrayOffset=function(s,e){return console.warn("THREE.Matrix3: .flattenToArrayOffset() has been deprecated. Use .toArray() instead."),this.toArray(s,e)};tt.prototype.multiplyVector3=function(s){return console.warn("THREE.Matrix3: .multiplyVector3() has been removed. Use vector.applyMatrix3( matrix ) instead."),s.applyMatrix3(this)};tt.prototype.multiplyVector3Array=function(){console.error("THREE.Matrix3: .multiplyVector3Array() has been removed.")};tt.prototype.applyToBufferAttribute=function(s){return console.warn("THREE.Matrix3: .applyToBufferAttribute() has been removed. Use attribute.applyMatrix3( matrix ) instead."),s.applyMatrix3(this)};tt.prototype.applyToVector3Array=function(){console.error("THREE.Matrix3: .applyToVector3Array() has been removed.")};tt.prototype.getInverse=function(s){return console.warn("THREE.Matrix3: .getInverse() has been removed. Use matrixInv.copy( matrix ).invert(); instead."),this.copy(s).invert()};be.prototype.extractPosition=function(s){return console.warn("THREE.Matrix4: .extractPosition() has been renamed to .copyPosition()."),this.copyPosition(s)};be.prototype.flattenToArrayOffset=function(s,e){return console.warn("THREE.Matrix4: .flattenToArrayOffset() has been deprecated. Use .toArray() instead."),this.toArray(s,e)};be.prototype.getPosition=function(){return console.warn("THREE.Matrix4: .getPosition() has been removed. Use Vector3.setFromMatrixPosition( matrix ) instead."),new E().setFromMatrixColumn(this,3)};be.prototype.setRotationFromQuaternion=function(s){return console.warn("THREE.Matrix4: .setRotationFromQuaternion() has been renamed to .makeRotationFromQuaternion()."),this.makeRotationFromQuaternion(s)};be.prototype.multiplyToArray=function(){console.warn("THREE.Matrix4: .multiplyToArray() has been removed.")};be.prototype.multiplyVector3=function(s){return console.warn("THREE.Matrix4: .multiplyVector3() has been removed. Use vector.applyMatrix4( matrix ) instead."),s.applyMatrix4(this)};be.prototype.multiplyVector4=function(s){return console.warn("THREE.Matrix4: .multiplyVector4() has been removed. Use vector.applyMatrix4( matrix ) instead."),s.applyMatrix4(this)};be.prototype.multiplyVector3Array=function(){console.error("THREE.Matrix4: .multiplyVector3Array() has been removed.")};be.prototype.rotateAxis=function(s){console.warn("THREE.Matrix4: .rotateAxis() has been removed. Use Vector3.transformDirection( matrix ) instead."),s.transformDirection(this)};be.prototype.crossVector=function(s){return console.warn("THREE.Matrix4: .crossVector() has been removed. Use vector.applyMatrix4( matrix ) instead."),s.applyMatrix4(this)};be.prototype.translate=function(){console.error("THREE.Matrix4: .translate() has been removed.")};be.prototype.rotateX=function(){console.error("THREE.Matrix4: .rotateX() has been removed.")};be.prototype.rotateY=function(){console.error("THREE.Matrix4: .rotateY() has been removed.")};be.prototype.rotateZ=function(){console.error("THREE.Matrix4: .rotateZ() has been removed.")};be.prototype.rotateByAxis=function(){console.error("THREE.Matrix4: .rotateByAxis() has been removed.")};be.prototype.applyToBufferAttribute=function(s){return console.warn("THREE.Matrix4: .applyToBufferAttribute() has been removed. Use attribute.applyMatrix4( matrix ) instead."),s.applyMatrix4(this)};be.prototype.applyToVector3Array=function(){console.error("THREE.Matrix4: .applyToVector3Array() has been removed.")};be.prototype.makeFrustum=function(s,e,t,n,i,r){return console.warn("THREE.Matrix4: .makeFrustum() has been removed. Use .makePerspective( left, right, top, bottom, near, far ) instead."),this.makePerspective(s,e,n,t,i,r)};be.prototype.getInverse=function(s){return console.warn("THREE.Matrix4: .getInverse() has been removed. Use matrixInv.copy( matrix ).invert(); instead."),this.copy(s).invert()};Jt.prototype.isIntersectionLine=function(s){return console.warn("THREE.Plane: .isIntersectionLine() has been renamed to .intersectsLine()."),this.intersectsLine(s)};vt.prototype.multiplyVector3=function(s){return console.warn("THREE.Quaternion: .multiplyVector3() has been removed. Use is now vector.applyQuaternion( quaternion ) instead."),s.applyQuaternion(this)};vt.prototype.inverse=function(){return console.warn("THREE.Quaternion: .inverse() has been renamed to invert()."),this.invert()};mi.prototype.isIntersectionBox=function(s){return console.warn("THREE.Ray: .isIntersectionBox() has been renamed to .intersectsBox()."),this.intersectsBox(s)};mi.prototype.isIntersectionPlane=function(s){return console.warn("THREE.Ray: .isIntersectionPlane() has been renamed to .intersectsPlane()."),this.intersectsPlane(s)};mi.prototype.isIntersectionSphere=function(s){return console.warn("THREE.Ray: .isIntersectionSphere() has been renamed to .intersectsSphere()."),this.intersectsSphere(s)};qe.prototype.area=function(){return console.warn("THREE.Triangle: .area() has been renamed to .getArea()."),this.getArea()};qe.prototype.barycoordFromPoint=function(s,e){return console.warn("THREE.Triangle: .barycoordFromPoint() has been renamed to .getBarycoord()."),this.getBarycoord(s,e)};qe.prototype.midpoint=function(s){return console.warn("THREE.Triangle: .midpoint() has been renamed to .getMidpoint()."),this.getMidpoint(s)};qe.prototypenormal=function(s){return console.warn("THREE.Triangle: .normal() has been renamed to .getNormal()."),this.getNormal(s)};qe.prototype.plane=function(s){return console.warn("THREE.Triangle: .plane() has been renamed to .getPlane()."),this.getPlane(s)};qe.barycoordFromPoint=function(s,e,t,n,i){return console.warn("THREE.Triangle: .barycoordFromPoint() has been renamed to .getBarycoord()."),qe.getBarycoord(s,e,t,n,i)};qe.normal=function(s,e,t,n){return console.warn("THREE.Triangle: .normal() has been renamed to .getNormal()."),qe.getNormal(s,e,t,n)};Ka.prototype.extractAllPoints=function(s){return console.warn("THREE.Shape: .extractAllPoints() has been removed. Use .extractPoints() instead."),this.extractPoints(s)};Ka.prototype.extrude=function(s){return console.warn("THREE.Shape: .extrude() has been removed. Use ExtrudeGeometry() instead."),new xi(this,s)};Ka.prototype.makeGeometry=function(s){return console.warn("THREE.Shape: .makeGeometry() has been removed. Use ShapeGeometry() instead."),new $a(this,s)};te.prototype.fromAttribute=function(s,e,t){return console.warn("THREE.Vector2: .fromAttribute() has been renamed to .fromBufferAttribute()."),this.fromBufferAttribute(s,e,t)};te.prototype.distanceToManhattan=function(s){return console.warn("THREE.Vector2: .distanceToManhattan() has been renamed to .manhattanDistanceTo()."),this.manhattanDistanceTo(s)};te.prototype.lengthManhattan=function(){return console.warn("THREE.Vector2: .lengthManhattan() has been renamed to .manhattanLength()."),this.manhattanLength()};E.prototype.setEulerFromRotationMatrix=function(){console.error("THREE.Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.")};E.prototype.setEulerFromQuaternion=function(){console.error("THREE.Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead.")};E.prototype.getPositionFromMatrix=function(s){return console.warn("THREE.Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition()."),this.setFromMatrixPosition(s)};E.prototype.getScaleFromMatrix=function(s){return console.warn("THREE.Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale()."),this.setFromMatrixScale(s)};E.prototype.getColumnFromMatrix=function(s,e){return console.warn("THREE.Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn()."),this.setFromMatrixColumn(e,s)};E.prototype.applyProjection=function(s){return console.warn("THREE.Vector3: .applyProjection() has been removed. Use .applyMatrix4( m ) instead."),this.applyMatrix4(s)};E.prototype.fromAttribute=function(s,e,t){return console.warn("THREE.Vector3: .fromAttribute() has been renamed to .fromBufferAttribute()."),this.fromBufferAttribute(s,e,t)};E.prototype.distanceToManhattan=function(s){return console.warn("THREE.Vector3: .distanceToManhattan() has been renamed to .manhattanDistanceTo()."),this.manhattanDistanceTo(s)};E.prototype.lengthManhattan=function(){return console.warn("THREE.Vector3: .lengthManhattan() has been renamed to .manhattanLength()."),this.manhattanLength()};ze.prototype.fromAttribute=function(s,e,t){return console.warn("THREE.Vector4: .fromAttribute() has been renamed to .fromBufferAttribute()."),this.fromBufferAttribute(s,e,t)};ze.prototype.lengthManhattan=function(){return console.warn("THREE.Vector4: .lengthManhattan() has been renamed to .manhattanLength()."),this.manhattanLength()};De.prototype.getChildByName=function(s){return console.warn("THREE.Object3D: .getChildByName() has been renamed to .getObjectByName()."),this.getObjectByName(s)};De.prototype.renderDepth=function(){console.warn("THREE.Object3D: .renderDepth has been removed. Use .renderOrder, instead.")};De.prototype.translate=function(s,e){return console.warn("THREE.Object3D: .translate() has been removed. Use .translateOnAxis( axis, distance ) instead."),this.translateOnAxis(e,s)};De.prototype.getWorldRotation=function(){console.error("THREE.Object3D: .getWorldRotation() has been removed. Use THREE.Object3D.getWorldQuaternion( target ) instead.")};De.prototype.applyMatrix=function(s){return console.warn("THREE.Object3D: .applyMatrix() has been renamed to .applyMatrix4()."),this.applyMatrix4(s)};Object.defineProperties(De.prototype,{eulerOrder:{get:function(){return console.warn("THREE.Object3D: .eulerOrder is now .rotation.order."),this.rotation.order},set:function(s){console.warn("THREE.Object3D: .eulerOrder is now .rotation.order."),this.rotation.order=s}},useQuaternion:{get:function(){console.warn("THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.")},set:function(){console.warn("THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.")}}});dt.prototype.setDrawMode=function(){console.error("THREE.Mesh: .setDrawMode() has been removed. The renderer now always assumes THREE.TrianglesDrawMode. Transform your geometry via BufferGeometryUtils.toTrianglesDrawMode() if necessary.")};Object.defineProperties(dt.prototype,{drawMode:{get:function(){return console.error("THREE.Mesh: .drawMode has been removed. The renderer now always assumes THREE.TrianglesDrawMode."),df},set:function(){console.error("THREE.Mesh: .drawMode has been removed. The renderer now always assumes THREE.TrianglesDrawMode. Transform your geometry via BufferGeometryUtils.toTrianglesDrawMode() if necessary.")}}});Fc.prototype.initBones=function(){console.error("THREE.SkinnedMesh: initBones() has been removed.")};ht.prototype.setLens=function(s,e){console.warn("THREE.PerspectiveCamera.setLens is deprecated. Use .setFocalLength and .filmGauge for a photographic setup."),e!==void 0&&(this.filmGauge=e),this.setFocalLength(s)};Object.defineProperties(Gt.prototype,{onlyShadow:{set:function(){console.warn("THREE.Light: .onlyShadow has been removed.")}},shadowCameraFov:{set:function(s){console.warn("THREE.Light: .shadowCameraFov is now .shadow.camera.fov."),this.shadow.camera.fov=s}},shadowCameraLeft:{set:function(s){console.warn("THREE.Light: .shadowCameraLeft is now .shadow.camera.left."),this.shadow.camera.left=s}},shadowCameraRight:{set:function(s){console.warn("THREE.Light: .shadowCameraRight is now .shadow.camera.right."),this.shadow.camera.right=s}},shadowCameraTop:{set:function(s){console.warn("THREE.Light: .shadowCameraTop is now .shadow.camera.top."),this.shadow.camera.top=s}},shadowCameraBottom:{set:function(s){console.warn("THREE.Light: .shadowCameraBottom is now .shadow.camera.bottom."),this.shadow.camera.bottom=s}},shadowCameraNear:{set:function(s){console.warn("THREE.Light: .shadowCameraNear is now .shadow.camera.near."),this.shadow.camera.near=s}},shadowCameraFar:{set:function(s){console.warn("THREE.Light: .shadowCameraFar is now .shadow.camera.far."),this.shadow.camera.far=s}},shadowCameraVisible:{set:function(){console.warn("THREE.Light: .shadowCameraVisible has been removed. Use new THREE.CameraHelper( light.shadow.camera ) instead.")}},shadowBias:{set:function(s){console.warn("THREE.Light: .shadowBias is now .shadow.bias."),this.shadow.bias=s}},shadowDarkness:{set:function(){console.warn("THREE.Light: .shadowDarkness has been removed.")}},shadowMapWidth:{set:function(s){console.warn("THREE.Light: .shadowMapWidth is now .shadow.mapSize.width."),this.shadow.mapSize.width=s}},shadowMapHeight:{set:function(s){console.warn("THREE.Light: .shadowMapHeight is now .shadow.mapSize.height."),this.shadow.mapSize.height=s}}});Object.defineProperties(Ye.prototype,{length:{get:function(){return console.warn("THREE.BufferAttribute: .length has been deprecated. Use .count instead."),this.array.length}},dynamic:{get:function(){return console.warn("THREE.BufferAttribute: .dynamic has been deprecated. Use .usage instead."),this.usage===Jr},set:function(){console.warn("THREE.BufferAttribute: .dynamic has been deprecated. Use .usage instead."),this.setUsage(Jr)}}});Ye.prototype.setDynamic=function(s){return console.warn("THREE.BufferAttribute: .setDynamic() has been deprecated. Use .setUsage() instead."),this.setUsage(s===!0?Jr:qi),this};Ye.prototype.copyIndicesArray=function(){console.error("THREE.BufferAttribute: .copyIndicesArray() has been removed.")},Ye.prototype.setArray=function(){console.error("THREE.BufferAttribute: .setArray has been removed. Use BufferGeometry .setAttribute to replace/resize attribute buffers")};Oe.prototype.addIndex=function(s){console.warn("THREE.BufferGeometry: .addIndex() has been renamed to .setIndex()."),this.setIndex(s)};Oe.prototype.addAttribute=function(s,e){return console.warn("THREE.BufferGeometry: .addAttribute() has been renamed to .setAttribute()."),!(e&&e.isBufferAttribute)&&!(e&&e.isInterleavedBufferAttribute)?(console.warn("THREE.BufferGeometry: .addAttribute() now expects ( name, attribute )."),this.setAttribute(s,new Ye(arguments[1],arguments[2]))):s==="index"?(console.warn("THREE.BufferGeometry.addAttribute: Use .setIndex() for index attribute."),this.setIndex(e),this):this.setAttribute(s,e)};Oe.prototype.addDrawCall=function(s,e,t){t!==void 0&&console.warn("THREE.BufferGeometry: .addDrawCall() no longer supports indexOffset."),console.warn("THREE.BufferGeometry: .addDrawCall() is now .addGroup()."),this.addGroup(s,e)};Oe.prototype.clearDrawCalls=function(){console.warn("THREE.BufferGeometry: .clearDrawCalls() is now .clearGroups()."),this.clearGroups()};Oe.prototype.computeOffsets=function(){console.warn("THREE.BufferGeometry: .computeOffsets() has been removed.")};Oe.prototype.removeAttribute=function(s){return console.warn("THREE.BufferGeometry: .removeAttribute() has been renamed to .deleteAttribute()."),this.deleteAttribute(s)};Oe.prototype.applyMatrix=function(s){return console.warn("THREE.BufferGeometry: .applyMatrix() has been renamed to .applyMatrix4()."),this.applyMatrix4(s)};Object.defineProperties(Oe.prototype,{drawcalls:{get:function(){return console.error("THREE.BufferGeometry: .drawcalls has been renamed to .groups."),this.groups}},offsets:{get:function(){return console.warn("THREE.BufferGeometry: .offsets has been renamed to .groups."),this.groups}}});Ki.prototype.setDynamic=function(s){return console.warn("THREE.InterleavedBuffer: .setDynamic() has been deprecated. Use .setUsage() instead."),this.setUsage(s===!0?Jr:qi),this};Ki.prototype.setArray=function(){console.error("THREE.InterleavedBuffer: .setArray has been removed. Use BufferGeometry .setAttribute to replace/resize attribute buffers")};xi.prototype.getArrays=function(){console.error("THREE.ExtrudeGeometry: .getArrays() has been removed.")};xi.prototype.addShapeList=function(){console.error("THREE.ExtrudeGeometry: .addShapeList() has been removed.")};xi.prototype.addShape=function(){console.error("THREE.ExtrudeGeometry: .addShape() has been removed.")};qa.prototype.dispose=function(){console.error("THREE.Scene: .dispose() has been removed.")};Object.defineProperties(lt.prototype,{wrapAround:{get:function(){console.warn("THREE.Material: .wrapAround has been removed.")},set:function(){console.warn("THREE.Material: .wrapAround has been removed.")}},overdraw:{get:function(){console.warn("THREE.Material: .overdraw has been removed.")},set:function(){console.warn("THREE.Material: .overdraw has been removed.")}},wrapRGB:{get:function(){return console.warn("THREE.Material: .wrapRGB has been removed."),new ve}},shading:{get:function(){console.error("THREE."+this.type+": .shading has been removed. Use the boolean .flatShading instead.")},set:function(s){console.warn("THREE."+this.type+": .shading has been removed. Use the boolean .flatShading instead."),this.flatShading=s===nc}},stencilMask:{get:function(){return console.warn("THREE."+this.type+": .stencilMask has been removed. Use .stencilFuncMask instead."),this.stencilFuncMask},set:function(s){console.warn("THREE."+this.type+": .stencilMask has been removed. Use .stencilFuncMask instead."),this.stencilFuncMask=s}},vertexTangents:{get:function(){console.warn("THREE."+this.type+": .vertexTangents has been removed.")},set:function(){console.warn("THREE."+this.type+": .vertexTangents has been removed.")}}});Object.defineProperties(Ln.prototype,{derivatives:{get:function(){return console.warn("THREE.ShaderMaterial: .derivatives has been moved to .extensions.derivatives."),this.extensions.derivatives},set:function(s){console.warn("THREE. ShaderMaterial: .derivatives has been moved to .extensions.derivatives."),this.extensions.derivatives=s}}});Be.prototype.clearTarget=function(s,e,t,n){console.warn("THREE.WebGLRenderer: .clearTarget() has been deprecated. Use .setRenderTarget() and .clear() instead."),this.setRenderTarget(s),this.clear(e,t,n)};Be.prototype.animate=function(s){console.warn("THREE.WebGLRenderer: .animate() is now .setAnimationLoop()."),this.setAnimationLoop(s)};Be.prototype.getCurrentRenderTarget=function(){return console.warn("THREE.WebGLRenderer: .getCurrentRenderTarget() is now .getRenderTarget()."),this.getRenderTarget()};Be.prototype.getMaxAnisotropy=function(){return console.warn("THREE.WebGLRenderer: .getMaxAnisotropy() is now .capabilities.getMaxAnisotropy()."),this.capabilities.getMaxAnisotropy()};Be.prototype.getPrecision=function(){return console.warn("THREE.WebGLRenderer: .getPrecision() is now .capabilities.precision."),this.capabilities.precision};Be.prototype.resetGLState=function(){return console.warn("THREE.WebGLRenderer: .resetGLState() is now .state.reset()."),this.state.reset()};Be.prototype.supportsFloatTextures=function(){return console.warn("THREE.WebGLRenderer: .supportsFloatTextures() is now .extensions.get( 'OES_texture_float' )."),this.extensions.get("OES_texture_float")};Be.prototype.supportsHalfFloatTextures=function(){return console.warn("THREE.WebGLRenderer: .supportsHalfFloatTextures() is now .extensions.get( 'OES_texture_half_float' )."),this.extensions.get("OES_texture_half_float")};Be.prototype.supportsStandardDerivatives=function(){return console.warn("THREE.WebGLRenderer: .supportsStandardDerivatives() is now .extensions.get( 'OES_standard_derivatives' )."),this.extensions.get("OES_standard_derivatives")};Be.prototype.supportsCompressedTextureS3TC=function(){return console.warn("THREE.WebGLRenderer: .supportsCompressedTextureS3TC() is now .extensions.get( 'WEBGL_compressed_texture_s3tc' )."),this.extensions.get("WEBGL_compressed_texture_s3tc")};Be.prototype.supportsCompressedTexturePVRTC=function(){return console.warn("THREE.WebGLRenderer: .supportsCompressedTexturePVRTC() is now .extensions.get( 'WEBGL_compressed_texture_pvrtc' )."),this.extensions.get("WEBGL_compressed_texture_pvrtc")};Be.prototype.supportsBlendMinMax=function(){return console.warn("THREE.WebGLRenderer: .supportsBlendMinMax() is now .extensions.get( 'EXT_blend_minmax' )."),this.extensions.get("EXT_blend_minmax")};Be.prototype.supportsVertexTextures=function(){return console.warn("THREE.WebGLRenderer: .supportsVertexTextures() is now .capabilities.vertexTextures."),this.capabilities.vertexTextures};Be.prototype.supportsInstancedArrays=function(){return console.warn("THREE.WebGLRenderer: .supportsInstancedArrays() is now .extensions.get( 'ANGLE_instanced_arrays' )."),this.extensions.get("ANGLE_instanced_arrays")};Be.prototype.enableScissorTest=function(s){console.warn("THREE.WebGLRenderer: .enableScissorTest() is now .setScissorTest()."),this.setScissorTest(s)};Be.prototype.initMaterial=function(){console.warn("THREE.WebGLRenderer: .initMaterial() has been removed.")};Be.prototype.addPrePlugin=function(){console.warn("THREE.WebGLRenderer: .addPrePlugin() has been removed.")};Be.prototype.addPostPlugin=function(){console.warn("THREE.WebGLRenderer: .addPostPlugin() has been removed.")};Be.prototype.updateShadowMap=function(){console.warn("THREE.WebGLRenderer: .updateShadowMap() has been removed.")};Be.prototype.setFaceCulling=function(){console.warn("THREE.WebGLRenderer: .setFaceCulling() has been removed.")};Be.prototype.allocTextureUnit=function(){console.warn("THREE.WebGLRenderer: .allocTextureUnit() has been removed.")};Be.prototype.setTexture=function(){console.warn("THREE.WebGLRenderer: .setTexture() has been removed.")};Be.prototype.setTexture2D=function(){console.warn("THREE.WebGLRenderer: .setTexture2D() has been removed.")};Be.prototype.setTextureCube=function(){console.warn("THREE.WebGLRenderer: .setTextureCube() has been removed.")};Be.prototype.getActiveMipMapLevel=function(){return console.warn("THREE.WebGLRenderer: .getActiveMipMapLevel() is now .getActiveMipmapLevel()."),this.getActiveMipmapLevel()};Object.defineProperties(Be.prototype,{shadowMapEnabled:{get:function(){return this.shadowMap.enabled},set:function(s){console.warn("THREE.WebGLRenderer: .shadowMapEnabled is now .shadowMap.enabled."),this.shadowMap.enabled=s}},shadowMapType:{get:function(){return this.shadowMap.type},set:function(s){console.warn("THREE.WebGLRenderer: .shadowMapType is now .shadowMap.type."),this.shadowMap.type=s}},shadowMapCullFace:{get:function(){console.warn("THREE.WebGLRenderer: .shadowMapCullFace has been removed. Set Material.shadowSide instead.")},set:function(){console.warn("THREE.WebGLRenderer: .shadowMapCullFace has been removed. Set Material.shadowSide instead.")}},context:{get:function(){return console.warn("THREE.WebGLRenderer: .context has been removed. Use .getContext() instead."),this.getContext()}},vr:{get:function(){return console.warn("THREE.WebGLRenderer: .vr has been renamed to .xr"),this.xr}},gammaInput:{get:function(){return console.warn("THREE.WebGLRenderer: .gammaInput has been removed. Set the encoding for textures via Texture.encoding instead."),!1},set:function(){console.warn("THREE.WebGLRenderer: .gammaInput has been removed. Set the encoding for textures via Texture.encoding instead.")}},gammaOutput:{get:function(){return console.warn("THREE.WebGLRenderer: .gammaOutput has been removed. Set WebGLRenderer.outputEncoding instead."),!1},set:function(s){console.warn("THREE.WebGLRenderer: .gammaOutput has been removed. Set WebGLRenderer.outputEncoding instead."),this.outputEncoding=s===!0?hs:_t}},toneMappingWhitePoint:{get:function(){return console.warn("THREE.WebGLRenderer: .toneMappingWhitePoint has been removed."),1},set:function(){console.warn("THREE.WebGLRenderer: .toneMappingWhitePoint has been removed.")}}});Object.defineProperties(Rc.prototype,{cullFace:{get:function(){console.warn("THREE.WebGLRenderer: .shadowMap.cullFace has been removed. Set Material.shadowSide instead.")},set:function(){console.warn("THREE.WebGLRenderer: .shadowMap.cullFace has been removed. Set Material.shadowSide instead.")}},renderReverseSided:{get:function(){console.warn("THREE.WebGLRenderer: .shadowMap.renderReverseSided has been removed. Set Material.shadowSide instead.")},set:function(){console.warn("THREE.WebGLRenderer: .shadowMap.renderReverseSided has been removed. Set Material.shadowSide instead.")}},renderSingleSided:{get:function(){console.warn("THREE.WebGLRenderer: .shadowMap.renderSingleSided has been removed. Set Material.shadowSide instead.")},set:function(){console.warn("THREE.WebGLRenderer: .shadowMap.renderSingleSided has been removed. Set Material.shadowSide instead.")}}});Object.defineProperties(Ht.prototype,{wrapS:{get:function(){return console.warn("THREE.WebGLRenderTarget: .wrapS is now .texture.wrapS."),this.texture.wrapS},set:function(s){console.warn("THREE.WebGLRenderTarget: .wrapS is now .texture.wrapS."),this.texture.wrapS=s}},wrapT:{get:function(){return console.warn("THREE.WebGLRenderTarget: .wrapT is now .texture.wrapT."),this.texture.wrapT},set:function(s){console.warn("THREE.WebGLRenderTarget: .wrapT is now .texture.wrapT."),this.texture.wrapT=s}},magFilter:{get:function(){return console.warn("THREE.WebGLRenderTarget: .magFilter is now .texture.magFilter."),this.texture.magFilter},set:function(s){console.warn("THREE.WebGLRenderTarget: .magFilter is now .texture.magFilter."),this.texture.magFilter=s}},minFilter:{get:function(){return console.warn("THREE.WebGLRenderTarget: .minFilter is now .texture.minFilter."),this.texture.minFilter},set:function(s){console.warn("THREE.WebGLRenderTarget: .minFilter is now .texture.minFilter."),this.texture.minFilter=s}},anisotropy:{get:function(){return console.warn("THREE.WebGLRenderTarget: .anisotropy is now .texture.anisotropy."),this.texture.anisotropy},set:function(s){console.warn("THREE.WebGLRenderTarget: .anisotropy is now .texture.anisotropy."),this.texture.anisotropy=s}},offset:{get:function(){return console.warn("THREE.WebGLRenderTarget: .offset is now .texture.offset."),this.texture.offset},set:function(s){console.warn("THREE.WebGLRenderTarget: .offset is now .texture.offset."),this.texture.offset=s}},repeat:{get:function(){return console.warn("THREE.WebGLRenderTarget: .repeat is now .texture.repeat."),this.texture.repeat},set:function(s){console.warn("THREE.WebGLRenderTarget: .repeat is now .texture.repeat."),this.texture.repeat=s}},format:{get:function(){return console.warn("THREE.WebGLRenderTarget: .format is now .texture.format."),this.texture.format},set:function(s){console.warn("THREE.WebGLRenderTarget: .format is now .texture.format."),this.texture.format=s}},type:{get:function(){return console.warn("THREE.WebGLRenderTarget: .type is now .texture.type."),this.texture.type},set:function(s){console.warn("THREE.WebGLRenderTarget: .type is now .texture.type."),this.texture.type=s}},generateMipmaps:{get:function(){return console.warn("THREE.WebGLRenderTarget: .generateMipmaps is now .texture.generateMipmaps."),this.texture.generateMipmaps},set:function(s){console.warn("THREE.WebGLRenderTarget: .generateMipmaps is now .texture.generateMipmaps."),this.texture.generateMipmaps=s}}});gv.prototype.load=function(s){console.warn("THREE.Audio: .load has been deprecated. Use THREE.AudioLoader instead.");const e=this;return new fv().load(s,function(n){e.setBuffer(n)}),this};Ha.prototype.updateCubeMap=function(s,e){return console.warn("THREE.CubeCamera: .updateCubeMap() is now .update()."),this.update(s,e)};Ha.prototype.clear=function(s,e,t,n){return console.warn("THREE.CubeCamera: .clear() is now .renderTarget.clear()."),this.renderTarget.clear(s,e,t,n)};fi.crossOrigin=void 0;fi.loadTexture=function(s,e,t,n){console.warn("THREE.ImageUtils.loadTexture has been deprecated. Use THREE.TextureLoader() instead.");const i=new iv;i.setCrossOrigin(this.crossOrigin);const r=i.load(s,t,void 0,n);return e&&(r.mapping=e),r};fi.loadTextureCube=function(s,e,t,n){console.warn("THREE.ImageUtils.loadTextureCube has been deprecated. Use THREE.CubeTextureLoader() instead.");const i=new nv;i.setCrossOrigin(this.crossOrigin);const r=i.load(s,t,void 0,n);return e&&(r.mapping=e),r};fi.loadCompressedTexture=function(){console.error("THREE.ImageUtils.loadCompressedTexture has been removed. Use THREE.DDSLoader instead.")};fi.loadCompressedTextureCube=function(){console.error("THREE.ImageUtils.loadCompressedTextureCube has been removed. Use THREE.DDSLoader instead.")};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ec}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ec);function Fv(s){const e=new qa,t=new ht(75,window.innerWidth/window.innerHeight,.1,1e4),n=new Be;n.setSize(window.innerWidth,window.innerHeight),n.setPixelRatio(window.devicePixelRatio),document.body.appendChild(n.domElement);const i=new Oe,r=0-s.cellsById[0].getSeaLevel(),a=f=>(f+=r,f**1.3*30),o=(f,m,v,x)=>{f.setX(mt/2-f.x),f.setY(-(mt/2-f.y)),f.setZ(a(f.z)),m.setX(mt/2-m.x),m.setY(-(mt/2-m.y)),m.setZ(a(m.z)),v.setX(mt/2-v.x),v.setY(-(mt/2-v.y)),v.setZ(a(v.z))};console.time("addTriangles");for(const f of s.activeCellIds){const m=s.cellsById[f];for(const v of m.iterateEdgesStartingFromIndex(0)){const x=(v+1)%m.polygon.length,p=(x+1)%m.polygon.length,g=m.neighbourCellIdsByEdgeIndex[v],w=m.neighbourCellIdsByEdgeIndex[x],M=m.neighbourCellIdsByEdgeIndex[p];if(g!==null&&w!==null&&M!==null){const T=s.cellsById[g],L=s.cellsById[w],_=s.cellsById[M],F=m.get3dHeight(),W=T.get3dHeight(),C=L.get3dHeight(),A=_.get3dHeight();o(new E(m.position.x,m.position.y,m.get3dHeight()),new E(m.polygon[x].x,m.polygon[x].y,(F+C+A)/3),new E(m.polygon[v].x,m.polygon[v].y,(F+W+C)/3),m.getColor())}}}console.timeEnd("addTriangles"),console.time("normals"),i.computeVertexNormals(),console.timeEnd("normals");const l=new qc({shininess:0});l.flatShading=!0;const c=new dt(i,l);e.add(c);const h=new Kc(4210752);e.add(h);const u=new $c(16777215,.7);u.position.x=.5,e.add(u),t.position.z=new xt(mt,mt).magnitude*.4,c.rotation.x=-.8,c.position.y=300,(async()=>{for(;;)c.rotation.z+=.002,n.render(e,t),await fh()})(),document.addEventListener("mousemove",f=>{c.rotation.x=ki(0,window.innerHeight,-.4,-1.5,f.clientY)})}const ai=new xt(mn,mn),ro=new xt(mt,mt),Nv=new Kr(xt.ZERO,ro),Bv=new Kr(ai.negate(),ro.add(ai).add(ai));new Kr(ai,ro.sub(ai).sub(ai));const zv=Nv;console.time("generatePoisson");const Uv=Ah(Bv,mn,15);console.timeEnd("generatePoisson");const so=new Wh(Uv);console.log(so);const gt=new Uu(so,zv);Object.assign(window,{delaunay:so,terrain:gt});function Ca(s=!0){for(const e of gt.activeCellIds){const t=gt.cellsById[e];Kn.polygon(t.polygon,{fill:t.getColor(s),stroke:t.getColor(s),strokeWidth:1})}for(const e of gt.platesById)for(const t of e.edgeCellIds)gt.cellsById[t]}console.time("terrain.smoothCellsBasedOnPlateHeight");gt.smoothCellsBasedOnPlateHeight();console.timeEnd("terrain.smoothCellsBasedOnPlateHeight");console.time("propagateTectonicDrift");gt.propagateTectonicDrift();console.timeEnd("propagateTectonicDrift");Ca();let Di=0;window.addEventListener("click",()=>{if(Ia.clearRect(0,0,mt,mt),Di=(Di+1)%4,Di===0)Ca();else if(Di===1)Ca(!1);else if(Di===2)for(const s of gt.activeCellIds){const e=gt.cellsById[s];Kn.polygon(e.polygon,{fill:Ou(e.getHeightFromDriftPressure())})}else{for(const e of gt.activeCellIds){const t=gt.cellsById[e];Kn.polygon(t.polygon,{stroke:"cyan",strokeWidth:.1})}let s=0;for(const e of gt.platesById){Kn.polygon(e.polygon,{stroke:"red",strokeWidth:1});for(const t of e.edgeCellIds){const n=gt.cellsById[t];s++,s%3===0&&Kn.debugVectorAtPoint(e.drift.scale(15),n.position,{color:"white"})}}}});Fv(gt);
