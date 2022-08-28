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
        console.log(event.ctrlKey);
        const { deltaX, deltaY } = event;
        this.update(({ pan, zoom }) => ({ pan: pan.add(new Vector2(deltaX, deltaY)), zoom }));
    }

    origin(): Vector2 {
        return this.pan.sub(this.screenSize.scale(0.5));
    }

    visibleSceneBounds(): AABB {
        return new AABB(this.origin(), this.screenSize);
    }

    screenToScene(screenCoords: Vector2): Vector2 {
        return screenCoords.add(this.origin());
    }

    sceneToScreen(sceneCoords: Vector2): Vector2 {
        return sceneCoords.sub(this.origin());
    }

    getSceneTransform(): string {
        const pan = this.origin();
        return `translate(${-pan.x}, ${-pan.y})`;
    }
}