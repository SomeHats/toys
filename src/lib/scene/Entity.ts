import SceneObject from './SceneObject';
import Component from './Component';
import { assert } from '../assert';
import SortOrderProvider from './SortOrderProvider';
import Scene from './Scene';

type ComponentClass<T extends Component = Component, Arg = any> = {
  name: string;
  new (entity: Entity, arg: Arg): T;
};

export default class Entity extends SceneObject {
  private componentInstances = new Map<
    ComponentClass<Component, any>,
    Component
  >();

  addComponent<T extends Component, A>(
    component: ComponentClass<T, A>,
    arg: A,
  ): T {
    assert(
      !this.componentInstances.has(component),
      `component instance ${component.name} already exists`,
    );
    const instance = new component(this, arg);
    this.componentInstances.set(component, instance);
    return instance;
  }

  hasComponent(component: ComponentClass): boolean {
    return this.componentInstances.has(component);
  }

  getComponent<T extends Component>(component: ComponentClass<T>): T {
    const instance = this.componentInstances.get(component);
    assert(instance, `no instance for ${component.name} exists`);
    assert(instance instanceof component, 'wrong instance type');
    return instance;
  }

  removeComponent<T extends Component>(component: ComponentClass<T>): T {
    const instance = this.getComponent(component);
    this.componentInstances.delete(component);
    instance.onRemove();
    return instance;
  }

  draw(ctx: CanvasRenderingContext2D, elapsedTime: number): void {
    for (const component of this.componentInstances.values()) {
      component.beforeDraw(ctx, elapsedTime);
    }
    for (const component of this.componentInstances.values()) {
      component.draw(ctx, elapsedTime);
    }
    for (const component of this.componentInstances.values()) {
      component.afterDraw(ctx, elapsedTime);
    }
  }
  update(delta: number): void {
    for (const component of this.componentInstances.values()) {
      component.beforeUpdate(delta);
    }
    for (const component of this.componentInstances.values()) {
      component.update(delta);
    }
    for (const component of this.componentInstances.values()) {
      component.afterUpdate(delta);
    }
  }

  onAddedToScene(scene: Scene) {
    super.onAddedToScene(scene);
    for (const component of this.componentInstances.values()) {
      component.onAddedToScene(scene);
    }
  }

  onRemovedFromScene() {
    const scene = this.getScene();
    super.onRemovedFromScene();
    for (const component of this.componentInstances.values()) {
      component.onRemovedFromScene(scene);
    }
  }

  getSortOrder() {
    if (this.hasComponent(SortOrderProvider)) {
      return this.getComponent(SortOrderProvider).getSortOrder();
    } else {
      return super.getSortOrder();
    }
  }
}
