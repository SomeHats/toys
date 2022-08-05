import { assertExists } from "../lib/assert";
import { ButtonMapping } from "../lib/ButtonMapping";
import { DebugDraw, StrokeAndFillOptions } from "../lib/DebugDraw";
import AABB from "../lib/geom/AABB";
import Vector2 from "../lib/geom/Vector2";
import { KeyCode } from "../lib/KeyCode";
import Component from "../lib/scene/Component";
import Entity from "../lib/scene/Entity";
import Scene from "../lib/scene/Scene";
import SceneSystem from "../lib/scene/SceneSystem";

class DebugDrawSystem extends SceneSystem {
    static override systemName = "DebugDragSystem";

    debugDraw!: DebugDraw;

    override afterAddToScene(scene: Scene) {
        super.afterAddToScene(scene);
        this.debugDraw = new DebugDraw(scene.ctx);
    }
}

class AABBDrawSystem extends SceneSystem {
    static override systemName = "AABBDebugDrawSystem";

    debugDraw!: DebugDraw;

    override afterAddToScene(scene: Scene) {
        super.afterAddToScene(scene);
        this.debugDraw = new DebugDraw(scene.ctx);
    }

    override afterDraw() {}
}

class AABBComponent extends Component {
    public value: AABB;

    constructor(entity: Entity, value: AABB) {
        super(entity);
        this.value = value;
    }

    setOrigin(origin: Vector2) {
        this.value = new AABB(origin, this.value.size);
    }

    override beforeDraw(ctx: CanvasRenderingContext2D, time: number) {
        ctx.save();
        ctx.translate(this.value.left, this.value.top);
    }
    override afterDraw(ctx: CanvasRenderingContext2D, time: number) {
        ctx.restore();
    }
}

class AABBRenderer extends Component {
    constructor(entity: Entity, public opts: StrokeAndFillOptions) {
        super(entity);
    }

    getAABB(): AABB {
        return this.entity.getComponent(AABBComponent).value;
    }

    override draw(ctx: CanvasRenderingContext2D) {
        this.getScene()
            .getSystem(DebugDrawSystem)
            .debugDraw.aabb(new AABB(Vector2.ZERO, this.getAABB().size), this.opts);
    }
}

class PlayerController extends Component {
    constructor(
        entity: Entity,
        public readonly moveSpeed: number,
        public readonly controls: ButtonMapping<"left" | "right" | "jump" | "down">,
    ) {
        super(entity);
    }

    override update(delta: number) {
        const aabbComponent = this.entity.getComponent(AABBComponent);
        let origin = aabbComponent.value.origin;
        if (this.controls.isDown("left")) {
            origin = origin.sub(new Vector2(this.moveSpeed * delta, 0));
        }
        if (this.controls.isDown("right")) {
            origin = origin.add(new Vector2(this.moveSpeed * delta, 0));
        }

        if (this.controls.isDown("jump")) {
            origin = origin.sub(new Vector2(0, this.moveSpeed * delta));
        }
        if (this.controls.isDown("down")) {
            origin = origin.add(new Vector2(0, this.moveSpeed * delta));
        }
        aabbComponent.setOrigin(origin);
    }
}

const scene = new Scene(800, 600, window.devicePixelRatio);
scene.addSystem(new DebugDrawSystem());

const player = new Entity();
player.addComponent(AABBComponent, new AABB(new Vector2(200, 200), new Vector2(20, 30)));
player.addComponent(AABBRenderer, {
    fill: "lime",
    stroke: "black",
    strokeWidth: 1,
});
player.addComponent(
    PlayerController,
    0.4,
    new ButtonMapping({
        left: [KeyCode.A, KeyCode.LEFT_ARROW],
        right: [KeyCode.D, KeyCode.RIGHT_ARROW],
        jump: [KeyCode.W, KeyCode.UP_ARROW, KeyCode.SPACE],
        down: [KeyCode.S],
    }),
);
scene.addChild(player);

scene.appendTo(assertExists(document.getElementById("root")));
scene.start();

console.log(scene);
