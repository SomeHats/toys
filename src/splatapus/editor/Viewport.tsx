import AABB from "@/lib/geom/AABB";
import { Vector2, parseSerializedVector2 } from "@/lib/geom/Vector2";
import { createShapeParser, parseNumber, ParserType } from "@/lib/objectParser";
import { SIDEBAR_WIDTH_PX } from "@/splatapus/constants";

export const parseSerializedViewport = createShapeParser({
    pan: parseSerializedVector2,
    zoom: parseNumber,
});
export type SerializedViewport = ParserType<typeof parseSerializedViewport>;

type ViewportState = {
    readonly pan: Vector2;
    readonly zoom: number;
    readonly screenSize: Vector2;
    readonly isSidebarOpen: boolean;
};

export class Viewport {
    static default(screenSize: Vector2) {
        return new Viewport({ pan: Vector2.ZERO, zoom: 1, screenSize, isSidebarOpen: true });
    }
    static deserialize({ pan, zoom }: SerializedViewport, screenSize: Vector2) {
        return new Viewport({
            pan: Vector2.deserialize(pan),
            zoom,
            screenSize,
            isSidebarOpen: false,
        });
    }

    readonly pan: Vector2;
    readonly zoom: number;
    readonly screenSize: Vector2;
    readonly isSidebarOpen: boolean;
    constructor({ pan, zoom, screenSize, isSidebarOpen }: ViewportState) {
        this.pan = pan;
        this.zoom = zoom;
        this.screenSize = screenSize;
        this.isSidebarOpen = isSidebarOpen;
    }

    with(changes: Partial<ViewportState>) {
        return new Viewport({
            pan: changes.pan ?? this.pan,
            zoom: changes.zoom ?? this.zoom,
            screenSize: changes.screenSize ?? this.screenSize,
            isSidebarOpen: changes.isSidebarOpen ?? this.isSidebarOpen,
        });
    }

    serialize(): SerializedViewport {
        return { pan: this.pan.serialize(), zoom: this.zoom };
    }

    canvasScreenSize(): Vector2 {
        if (this.isSidebarOpen) {
            return this.screenSize.sub(new Vector2(SIDEBAR_WIDTH_PX, 0));
        }
        return this.screenSize;
    }

    handleWheelEvent(event: WheelEvent): Viewport {
        event.preventDefault();
        event.stopImmediatePropagation();
        const { deltaX, deltaY } = event;
        if (event.ctrlKey) {
            const screenPosition = Vector2.fromEvent(event);
            const { pan, zoom } = this;
            const newZoom = Math.exp(-deltaY / 100) * zoom;
            const newPan = screenPosition
                .add(pan)
                .scale(newZoom / zoom)
                .sub(screenPosition);

            return this.with({ pan: newPan, zoom: newZoom });
        } else {
            return this.with({ pan: this.pan.add(new Vector2(deltaX, deltaY)) });
        }
    }

    origin(): Vector2 {
        return this.pan.sub(this.canvasScreenSize().scale(0.5 * this.zoom));
    }

    visibleSceneBounds(): AABB {
        return new AABB(this.origin(), this.canvasScreenSize());
    }

    screenToScene(screenCoords: Vector2): Vector2 {
        return screenCoords.add(this.origin()).scale(1 / this.zoom);
    }

    sceneToScreen(sceneCoords: Vector2): Vector2 {
        return sceneCoords.scale(this.zoom).sub(this.origin());
    }

    eventSceneCoords(event: { clientX: number; clientY: number }): Vector2 {
        return this.screenToScene(Vector2.fromEvent(event));
    }

    getSceneTransform(): string {
        const pan = this.origin();
        return `translate(${-pan.x}px, ${-pan.y}px) scale(${this.zoom}) `;
    }
}
