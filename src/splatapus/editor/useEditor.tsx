import { Interaction } from "@/splatapus/editor/Interaction";
import { SplatLocation } from "@/splatapus/editor/SplatLocation";
import { SplatapusState } from "@/splatapus/model/store";
import { ToolType } from "@/splatapus/editor/tools/ToolType";
import { OpOptions, UndoStack } from "@/splatapus/editor/UndoStack";
import { Viewport } from "@/splatapus/editor/Viewport";
import { PointerEvent, useEffect, useState } from "react";
import { Vector2 } from "@/lib/geom/Vector2";
import { Vfx } from "@/splatapus/editor/Vfx";
import { LiveValue, LiveMemo, LiveMemoWritable } from "@/lib/live";
import { PointerEventType } from "@/splatapus/editor/lib/EventContext";
import { PreviewPosition } from "@/splatapus/editor/PreviewPosition";

export type SplatapusAction<T> = (splatapus: Splatapus, state: T) => T;

export class Splatapus {
    readonly undoStack: LiveValue<UndoStack>;
    readonly interaction: LiveValue<Interaction>;
    readonly vfx = new Vfx();
    readonly location = new LiveMemoWritable(
        () => this.undoStack.live().current.location,
        (update) =>
            this.undoStack.update((undoStack) => UndoStack.updateLocation(undoStack, update)),
    );
    readonly document = new LiveMemoWritable(
        () => this.undoStack.live().current.document,
        (update, options?: OpOptions) =>
            this.undoStack.update((undoStack) =>
                UndoStack.updateDocument(undoStack, update, options),
            ),
    );
    readonly viewport = new Viewport(
        this.screenSize,
        new LiveMemo(() => Interaction.isSidebarOpen(this.interaction.live())),
        new LiveMemoWritable(
            () => this.location.live().viewport,
            (update) =>
                this.location.update((location) => SplatLocation.updateViewport(location, update)),
        ),
    );

    constructor(readonly screenSize: LiveValue<Vector2>, state: SplatapusState) {
        this.undoStack = new LiveValue(UndoStack.initialize(state));
        this.interaction = new LiveValue(Interaction.initialize(ToolType.Draw));
    }

    private onPointerEvent(eventType: PointerEventType, event: PointerEvent) {
        this.interaction.update((interaction) =>
            Interaction.onPointerEvent({ event, eventType, splatapus: this }, interaction),
        );
    }

    onPointerDown = (event: PointerEvent) => this.onPointerEvent("down", event);
    onPointerMove = (event: PointerEvent) => this.onPointerEvent("move", event);
    onPointerUp = (event: PointerEvent) => this.onPointerEvent("up", event);
    onPointerCancel = (event: PointerEvent) => this.onPointerEvent("cancel", event);
    onWheel = (event: WheelEvent) => {
        this.viewport.handleWheelEvent(event);
    };
    onKeyDown = (event: KeyboardEvent) =>
        this.interaction.update((interaction) =>
            Interaction.onKeyDown({ event, splatapus: this }, interaction),
        );
    onKeyUp = (event: KeyboardEvent) =>
        this.interaction.update((interaction) =>
            Interaction.onKeyUp({ event, splatapus: this }, interaction),
        );

    previewPosition = new LiveMemo(() => {
        const location = this.location.live();
        return (
            Interaction.getPreviewPosition(this.interaction.live(), location.shapeId) ??
            PreviewPosition.keyPointId(location.keyPointId, location.shapeId)
        );
    });
}

export function useSplatapus(initialize: () => SplatapusState) {
    const splatapus = useState(() => new Splatapus(new LiveValue(Vector2.ZERO), initialize()))[0];
    useEffect(() => {
        // @ts-expect-error expose splatapus on window
        window.splatapus = splatapus;
    }, [splatapus]);
    return splatapus;
}
