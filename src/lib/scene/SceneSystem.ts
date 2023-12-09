// @flow
import { assert } from "@/lib/assert";
import Scene from "@/lib/scene/Scene";

const DEFAULT_NAME = "$$AbstractSceneSystem$$";

export default abstract class SceneSystem {
    static systemName = DEFAULT_NAME;
    private scene: Scene | null = null;

    constructor() {
        assert(
            this.constructor !== SceneSystem,
            "SceneSystem is an abstract class that must be extended",
        );
        assert(
            (this.constructor as typeof SceneSystem).systemName !==
                DEFAULT_NAME,
            "classes extending SceneSystem must override SceneSystem.systemName",
        );
    }

    getScene(): Scene {
        assert(this.scene, "scene is required");
        return this.scene;
    }

    afterAddToScene(scene: Scene) {
        this.scene = scene;
    }

    beforeRemoveFromScene(scene: Scene) {
        this.scene = null;
    }

    beforeUpdate(delta: number) {}

    afterUpdate(delta: number) {}

    beforeDraw(ctx: CanvasRenderingContext2D, time: number) {}

    afterDraw(ctx: CanvasRenderingContext2D, time: number) {}
}
