import { assert } from "@/lib/assert";
import Component from "@/lib/scene/Component";
import Scene from "@/lib/scene/Scene";
import SceneObject from "@/lib/scene/SceneObject";
import SortOrderProvider from "@/lib/scene/SortOrderProvider";

type ComponentClass<T extends Component, Args extends unknown[]> = {
    name: string;
    new (entity: Entity, ...args: Args): T;
};

export default class Entity extends SceneObject {
    private componentInstances = new Map<ComponentClass<Component, any>, Component>();

    addComponent<T extends Component, Args extends unknown[]>(
        component: ComponentClass<T, Args>,
        ...args: Args
    ): T {
        assert(
            !this.componentInstances.has(component),
            `component instance ${component.name} already exists`,
        );
        const instance = new component(this, ...args);
        this.componentInstances.set(component, instance);
        return instance;
    }

    hasComponent<T extends Component>(component: ComponentClass<T, any[]>): boolean {
        return this.componentInstances.has(component);
    }

    getComponent<T extends Component>(component: ComponentClass<T, any[]>): T {
        const instance = this.componentInstances.get(component);
        assert(instance, `no instance for ${component.name} exists`);
        assert(instance instanceof component, "wrong instance type");
        return instance;
    }

    removeComponent<T extends Component>(component: ComponentClass<T, any[]>): T {
        const instance = this.getComponent(component);
        this.componentInstances.delete(component);
        instance.onRemove();
        return instance;
    }

    override draw(ctx: CanvasRenderingContext2D, elapsedTime: number): void {
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
    override update(delta: number): void {
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

    override onAddedToScene(scene: Scene) {
        super.onAddedToScene(scene);
        for (const component of this.componentInstances.values()) {
            component.onAddedToScene(scene);
        }
    }

    override onRemovedFromScene() {
        const scene = this.getScene();
        super.onRemovedFromScene();
        for (const component of this.componentInstances.values()) {
            component.onRemovedFromScene(scene);
        }
    }

    override getSortOrder() {
        if (this.hasComponent(SortOrderProvider)) {
            return this.getComponent(SortOrderProvider).getSortOrder();
        } else {
            return super.getSortOrder();
        }
    }
}
