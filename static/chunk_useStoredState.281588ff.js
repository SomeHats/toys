import{r as o}from"./chunk_index.0b9c6f54.js";import{I as l}from"./chunk_assert.30730bef.js";import{e as f,f as d}from"./chunk_storage.39edd6db.js";function s(t,e,a,u){const[r,i]=o.useState(()=>({dirty:!1,value:f(t,e,a,u)}));return o.useEffect(()=>{r.dirty&&d(t,e,a,r.value)},[t,e,a,r]),[r.value,o.useCallback(n=>{i(S=>({dirty:!0,value:l(S.value,n)}))},[])]}function m(t,e,a){return s(window.localStorage,t,e,a)}function v(t,e,a){return s(window.sessionStorage,t,e,a)}export{v as a,m as u};
