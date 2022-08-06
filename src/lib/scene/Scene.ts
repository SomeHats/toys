import { assert } from "@/lib/assert";
import SceneObject from "@/lib/scene/SceneObject";
import SceneSystem from "@/lib/scene/SceneSystem";

const speed = 1;
const scale = 1;
const repeatUpdate = 1;

type SystemClass<T extends SceneSystem = SceneSystem> = {
    systemName: string;
    new (): T;
};

export default class Scene {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    private _scaleFactor: number;
    private _children: SceneObject[] = [];
    private _isPlaying = false;
    private frameHandle: number | null = null;
    private lastElapsedTime: number | null = null;
    private systemsByClass = new Map<SystemClass<SceneSystem>, SceneSystem>();

    constructor(width: number, height: number, scaleFactor = 1) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = width * scaleFactor;
        this.canvas.height = height * scaleFactor;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        const ctx = this.canvas.getContext("2d");
        assert(ctx, "ctx");
        this.ctx = ctx;
        this._scaleFactor = scaleFactor * scale;

        this._setupVisiblityChange();
    }

    get width(): number {
        return this.canvas.width / this._scaleFactor;
    }

    get height(): number {
        return this.canvas.height / this._scaleFactor;
    }

    get scaleFactor(): number {
        return this._scaleFactor;
    }

    get isPlaying(): boolean {
        return this.frameHandle !== null && this._isPlaying;
    }

    set isPlaying(newValue: boolean) {
        assert(this.frameHandle !== null, "cannot set isPlaying without calling start");
        this._isPlaying = newValue;
    }

    get children(): SceneObject[] {
        return this._children;
    }

    appendTo(element: HTMLElement) {
        element.appendChild(this.canvas);
    }

    hasSystem(systemType: SystemClass): boolean {
        return this.systemsByClass.has(systemType);
    }

    getSystem<T extends SceneSystem>(systemType: SystemClass<T>): T {
        const system = this.systemsByClass.get(systemType);
        assert(system, `system, ${systemType.systemName} not found`);
        assert(system instanceof systemType, "system is wrong instance type");
        return system;
    }

    addSystem(system: SceneSystem) {
        assert(
            !this.hasSystem(system.constructor as SystemClass<SceneSystem>),
            "only one system of each type allowed",
        );
        this.systemsByClass.set(system.constructor as SystemClass<SceneSystem>, system);
        system.afterAddToScene(this);
    }

    removeSystem(systemType: SystemClass) {
        const system = this.getSystem(systemType);
        system.beforeRemoveFromScene(this);
        this.systemsByClass.delete(systemType);
    }

    addChild(child: SceneObject) {
        this._children.push(child);
        child.onAddedToScene(this);
    }

    addChildBefore(targetChild: SceneObject, newChild: SceneObject) {
        const index = this._children.indexOf(targetChild);
        assert(index !== -1, "target child must be present");

        this.addChildAtIndex(index, newChild);
    }

    addChildAfter(targetChild: SceneObject, newChild: SceneObject) {
        const index = this._children.indexOf(targetChild);
        assert(index !== -1, "target child must be present");

        this.addChildAtIndex(index + 1, newChild);
    }

    addChildAtIndex(index: number, child: SceneObject) {
        this._children.splice(index, 0, child);
        child.onAddedToScene(this);
    }

    removeChild(child: SceneObject): boolean {
        const index = this._children.indexOf(child);
        if (index === -1) return false;

        this.removeChildAtIndex(index);
        return true;
    }

    removeChildAtIndex(index: number): SceneObject {
        const child = this._children[index];
        this._children.splice(index, 1);
        child.onRemovedFromScene();
        return child;
    }

    update(delta: number) {
        for (let i = 0; i < repeatUpdate; i++) {
            for (const system of this.systemsByClass.values()) {
                system.beforeUpdate(delta);
            }
            this._children.forEach((child) => child.update(delta));
            for (const system of this.systemsByClass.values()) {
                system.afterUpdate(delta);
            }
        }
    }

    draw(elapsedTime: number) {
        this.ctx.save();
        this.ctx.scale(this._scaleFactor, this._scaleFactor);
        this.ctx.clearRect(0, 0, this.width, this.height);

        for (const system of this.systemsByClass.values()) {
            system.beforeDraw(this.ctx, elapsedTime);
        }
        this._children
            .sort((a, b) => a.getSortOrder() - b.getSortOrder())
            .forEach((child) => child.draw(this.ctx, elapsedTime));
        for (const system of this.systemsByClass.values()) {
            system.afterDraw(this.ctx, elapsedTime);
        }

        this.ctx.restore();
    }

    start() {
        this._isPlaying = true;
        this.frameHandle = window.requestAnimationFrame(this._tick);
    }

    stop() {
        if (this.frameHandle !== null) {
            window.cancelAnimationFrame(this.frameHandle);
            this.frameHandle = null;
        }
        this._isPlaying = false;
        this.lastElapsedTime = null;
    }

    _tick = (elapsedTime: number) => {
        elapsedTime = elapsedTime * speed;
        const lastElapsedTime = this.lastElapsedTime;
        if (lastElapsedTime !== null) {
            const deltaTime = elapsedTime - lastElapsedTime;
            if (this.isPlaying) {
                this.update(deltaTime);
                this.draw(elapsedTime);
            }
        }

        this.lastElapsedTime = elapsedTime;
        this.frameHandle = window.requestAnimationFrame(this._tick);
    };

    _setupVisiblityChange() {
        let playOnVisible = false;
        document.addEventListener("visibilitychange", () => {
            if (document.hidden && this.isPlaying) {
                playOnVisible = true;
                this.stop();
            }
            if (playOnVisible && !document.hidden) {
                playOnVisible = false;
                this.start();
            }
        });
    }
}
