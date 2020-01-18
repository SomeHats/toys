// @flow
import { assert } from '../assert';
import Scene from './Scene';

const DEFAULT_NAME = '$$AbstractSceneSystem$$';

export default abstract class SceneSystem {
  static systemName = DEFAULT_NAME;
  private scene: Scene | null = null;

  constructor() {
    assert(
      this.constructor !== SceneSystem,
      'SceneSystem is an abstract class that must be extended',
    );
    assert(
      (this.constructor as any).systemName !== DEFAULT_NAME,
      'classes extending SceneSystem must override SceneSystem.systemName',
    );
  }

  getScene(): Scene {
    assert(this.scene, 'scene is required');
    return this.scene;
  }

  afterAddToScene(scene: Scene) {
    this.scene = scene;
  }

  // eslint-disable-next-line no-unused-vars
  beforeRemoveFromScene(scene: Scene) {
    this.scene = null;
  }

  // eslint-disable-next-line no-unused-vars
  beforeUpdate(delta: number) {}

  // eslint-disable-next-line no-unused-vars
  afterUpdate(delta: number) {}

  // eslint-disable-next-line no-unused-vars
  beforeDraw(ctx: CanvasRenderingContext2D, time: number) {}

  // eslint-disable-next-line no-unused-vars
  afterDraw(ctx: CanvasRenderingContext2D, time: number) {}
}
