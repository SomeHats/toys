import AABB from "@/lib/geom/AABB";
import Vector2 from "@/lib/geom/Vector2";
import { createShapeParser, parseNumber, ParserType } from "@/lib/objectParser";
import { UpdateAction } from "@/lib/utils";

export const parseViewportState = createShapeParser({
    pan: Vector2.parse,
    zoom: parseNumber,
});
export type ViewportState = ParserType<typeof parseViewportState>;

export class Viewport {
    readonly pan: Vector2;
    readonly zoom: number;

    constructor(
        { pan, zoom }: ViewportState,
        readonly screenSize: Vector2,
        private readonly update: (update: UpdateAction<ViewportState>) => void,
    ) {
        this.pan = pan;
        this.zoom = zoom;
    }

    handleWheelEvent(event: WheelEvent) {
        console.log("wheel", event);
        event.preventDefault();
        event.stopImmediatePropagation();
        const { deltaX, deltaY } = event;
        if (event.ctrlKey) {
            const screenPosition = Vector2.fromEvent(event);
            // const scenePosition = this.screenToScene(event);
            this.update(({ pan, zoom }) => {
                const newZoom = Math.exp(-deltaY / 100) * zoom;
                const newPan = screenPosition
                    .add(pan)
                    .scale(newZoom / zoom)
                    .sub(screenPosition);

                return { zoom: newZoom, pan: newPan };
            });
        } else {
            this.update(({ pan, zoom }) => ({ pan: pan.add(new Vector2(deltaX, deltaY)), zoom }));
        }
    }

    origin(): Vector2 {
        return this.pan.sub(this.screenSize.scale(0.5 * this.zoom));
    }

    visibleSceneBounds(): AABB {
        return new AABB(this.origin(), this.screenSize);
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
        return `translate(${-pan.x}, ${-pan.y}) scale(${this.zoom}) `;
    }
}
