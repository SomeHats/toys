import{a as r}from"./chunk_index.0b2a17fa.js";class d{constructor(){this.handlers=new Set}listen(e){const t=s=>e(s);return this.handlers.add(t),()=>{this.handlers.delete(t)}}emit(...e){r.exports.unstable_batchedUpdates(()=>{for(const t of this.handlers)t(e[0])})}}export{d as E};