import{a as t}from"./chunk_assert.df27ef91.js";const s="$$AbstractSceneSystem$$",c=class{constructor(){this.scene=null,t(this.constructor!==c,"SceneSystem is an abstract class that must be extended"),t(this.constructor.systemName!==s,"classes extending SceneSystem must override SceneSystem.systemName")}getScene(){return t(this.scene,"scene is required"),this.scene}afterAddToScene(e){this.scene=e}beforeRemoveFromScene(e){this.scene=null}beforeUpdate(e){}afterUpdate(e){}beforeDraw(e,n){}afterDraw(e,n){}};let r=c;r.systemName=s;export{r as S};