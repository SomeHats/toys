import { assert } from "@/lib/assert";
import Scene from "@/lib/scene/Scene";

const constructorIdCounts = {} as Record<string, number>;

const getNextCount = (name: string): string => {
    if (!constructorIdCounts[name]) constructorIdCounts[name] = 0;
    return `${name}@${constructorIdCounts[name]++}`;
};

export default abstract class SceneObject {
    id: string = getNextCount(this.constructor.name);
    private scene: Scene | null = null;

    hasScene(): boolean {
        return this.scene !== null;
    }

    getScene(): Scene {
        assert(this.scene, "scene must be present");
        return this.scene;
    }

    draw(ctx: CanvasRenderingContext2D, elapsedTime: number): void {}
    update(delta: number): void {}

    addTo(scene: Scene): this {
        scene.addChild(this);
        return this;
    }

    onAddedToScene(scene: Scene) {
        this.scene = scene;
    }

    onRemovedFromScene() {
        this.scene = null;
    }

    getSortOrder(): number {
        return 0;
    }
}
