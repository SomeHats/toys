import Entity from './Entity';
import Scene from './Scene';

export default abstract class Component {
  readonly entity: Entity;
  constructor(entity: Entity) {
    this.entity = entity;
  }

  onRemove() {}

  onAddedToScene(scene: Scene) {}

  onRemovedFromScene(scene: Scene) {}

  beforeUpdate(delta: number) {}

  update(delta: number) {}

  afterUpdate(delta: number) {}

  beforeDraw(ctx: CanvasRenderingContext2D, time: number) {}

  draw(ctx: CanvasRenderingContext2D, time: number) {}

  afterDraw(ctx: CanvasRenderingContext2D, time: number) {}
}
