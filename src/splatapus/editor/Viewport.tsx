import AABB from "@/lib/geom/AABB";
import { Vector2 } from "@/lib/geom/Vector2";
import { Live, LiveMemoWritable, LiveWritable, runOnce } from "@/lib/live";
import { Schema, SchemaType } from "@/lib/schema";
import { applyUpdateWithin } from "@/lib/utils";
import { SIDEBAR_WIDTH_PX } from "@/splatapus/constants";

const viewportStateSchema = Schema.object({
    pan: Vector2.schema,
    zoom: Schema.number,
});
export type ViewportState = SchemaType<typeof viewportStateSchema>;
export const ViewportState = {
    initialize: (): ViewportState => ({
        pan: Vector2.ZERO,
        zoom: 1,
    }),
    schema: viewportStateSchema,
};

export class Viewport {
    constructor(
        readonly screenSize: Live<Vector2>,
        readonly isSidebarOpen: Live<boolean>,
        readonly state: LiveWritable<ViewportState>,
    ) {
        this.screenSize = screenSize;
        this.isSidebarOpen = isSidebarOpen;
    }

    readonly pan = new LiveMemoWritable(
        () => this.state.live().pan,
        (update) => this.state.update((state) => applyUpdateWithin(state, "pan", update)),
    );
    readonly zoom = new LiveMemoWritable(
        () => this.state.live().zoom,
        (update) => this.state.update((state) => applyUpdateWithin(state, "zoom", update)),
    );

    screenSizeWithSidebarOpenLive(): Vector2 {
        return this.screenSize.live().sub(new Vector2(SIDEBAR_WIDTH_PX, 0));
    }

    canvasScreenSizeLive(): Vector2 {
        if (this.isSidebarOpen.live()) {
            return this.screenSizeWithSidebarOpenLive();
        }
        return this.screenSize.live();
    }

    handleWheelEvent(event: WheelEvent) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const { deltaX, deltaY, ctrlKey } = event;
        this.state.update(({ pan, zoom }) => {
            if (ctrlKey) {
                const screenPosition = Vector2.fromEvent(event);
                const newZoom = Math.exp(-deltaY / 100) * zoom;
                const newPan = screenPosition
                    .add(pan)
                    .scale(newZoom / zoom)
                    .sub(screenPosition);
                return { pan: newPan, zoom: newZoom };
            } else {
                return { pan: pan.add(new Vector2(deltaX, deltaY)), zoom };
            }
        });
    }

    originLive(): Vector2 {
        const { pan, zoom } = this.state.live();
        return pan.sub(this.canvasScreenSizeLive().scale(0.5 * zoom));
    }

    visibleSceneBoundsLive(): AABB {
        return new AABB(this.originLive(), this.canvasScreenSizeLive());
    }

    screenToSceneLive(screenCoords: Vector2): Vector2 {
        return screenCoords.add(this.originLive()).scale(1 / this.state.live().zoom);
    }

    sceneToScreenLive(sceneCoords: Vector2): Vector2 {
        return sceneCoords.scale(this.state.live().zoom).sub(this.originLive());
    }

    eventSceneCoords(event: { clientX: number; clientY: number }): Vector2 {
        return runOnce(() => this.screenToSceneLive(Vector2.fromEvent(event)));
    }

    getSceneTransformLive(): string {
        const pan = this.originLive();
        const zoom = this.state.live().zoom;
        return `translate(${-pan.x}px, ${-pan.y}px) scale(${zoom}) `;
    }
}
