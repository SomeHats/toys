import { Vector2 } from "@/lib/geom/Vector2";
import { createTool } from "@/splatapus/editor/lib/createTool";
import { createGestureDetector, GestureType } from "@/splatapus/editor/lib/GestureDetection";
import { QuickToolType } from "@/splatapus/editor/tools/ToolType";

export type IdleQuickPanTool = { readonly state: "idle" };
export type ActiveQuickPanTool = {
    readonly state: "active";
    readonly initialPan: Vector2;
    readonly previousScreenPoint: Vector2;
};

const QuickPanGesture = createGestureDetector<IdleQuickPanTool, ActiveQuickPanTool>({
    onDragStart: ({ event, splatapus }) => ({
        state: "active",
        initialPan: splatapus.viewport.state.getWithoutListening().pan,
        previousScreenPoint: Vector2.fromEvent(event),
    }),
    onDragMove: ({ event, splatapus }, state) => {
        const screenPoint = Vector2.fromEvent(event);
        splatapus.viewport.state.update(({ pan, zoom }) => ({
            pan: pan.add(state.previousScreenPoint.sub(screenPoint)),
            zoom,
        }));
        return { ...state, previousScreenPoint: screenPoint };
    },
    onDragEnd: () => ({ state: "idle" }),
    onDragCancel: ({ splatapus }, state) => {
        splatapus.viewport.state.update(({ pan, zoom }) => ({ pan: state.initialPan, zoom }));
        return { state: "idle" };
    },
});

export type QuickPanTool = {
    readonly type: QuickToolType.Pan;
    readonly gesture: GestureType<typeof QuickPanGesture>;
};
export const QuickPanTool = createTool<QuickPanTool>()({
    initialize: () => ({
        type: QuickToolType.Pan,
        gesture: QuickPanGesture.initialize({ state: "idle" }),
    }),
    getDebugProperties: (tool) => {
        const state = QuickPanGesture.getState(tool.gesture);
        switch (state.state) {
            case "idle":
                return { _: state.state };
            case "active":
                return {
                    _: state.state,
                    initialPan: state.initialPan.toString(2),
                    previousScreenPoint: state.previousScreenPoint.toString(0),
                };
        }
    },
    isIdle: (tool) => QuickPanGesture.isIdle(tool.gesture),
    getCanvasClassName: (tool) => {
        if (QuickPanTool.isIdle(tool)) {
            return "cursor-grab";
        }
        return "cursor-grabbing";
    },
    onPointerEvent: QuickPanGesture.createOnPointerEvent<"gesture", QuickPanTool>("gesture"),
});
