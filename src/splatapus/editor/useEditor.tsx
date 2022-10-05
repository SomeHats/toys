import { Interaction } from "@/splatapus/editor/Interaction";
import { SplatLocation } from "@/splatapus/editor/SplatLocation";
import { SplatapusState } from "@/splatapus/model/store";
import { OpOptions, UndoStack } from "@/splatapus/editor/UndoStack";
import { Viewport } from "@/splatapus/editor/Viewport";
import { PointerEvent, useEffect, useState } from "react";
import { Vector2 } from "@/lib/geom/Vector2";
import { Vfx } from "@/splatapus/editor/Vfx";
import { LiveValue, LiveMemo, LiveMemoWritable, runLive, LiveEffect } from "@/lib/live";
import { PointerEventType } from "@/splatapus/editor/EventContext";
import { PreviewPosition } from "@/splatapus/editor/PreviewPosition";
import { SplatKeyPointId } from "@/splatapus/model/SplatDoc";
import { last } from "@/lib/utils";

export class Splatapus {
    readonly undoStack: LiveValue<UndoStack>;
    readonly interaction: Interaction;
    readonly vfx = new Vfx();
    readonly location = new SplatLocation(
        new LiveMemoWritable(
            () => this.undoStack.live().current.location,
            (update) =>
                this.undoStack.update((undoStack) => UndoStack.updateLocation(undoStack, update)),
            "location",
        ),
    );
    readonly document = new LiveMemoWritable(
        () => this.undoStack.live().current.document,
        (update, options?: OpOptions) =>
            this.undoStack.update((undoStack) =>
                UndoStack.updateDocument(undoStack, update, options),
            ),
        "document",
    );
    readonly viewport = new Viewport(
        this.screenSize,
        new LiveMemo(() => this.interaction.isSidebarOpenLive(), "viewport.isSidebarOpen"),
        this.location.viewportState,
    );
    readonly keyPointIdHistory: LiveValue<ReadonlyArray<SplatKeyPointId>>;

    constructor(readonly screenSize: LiveValue<Vector2>, state: SplatapusState) {
        this.undoStack = new LiveValue(UndoStack.initialize(state), "undoStack");
        this.interaction = new Interaction(state.location.mode);
        this.keyPointIdHistory = new LiveValue<ReadonlyArray<SplatKeyPointId>>(
            Array.from(this.document.getOnce().keyPoints, (point) => point.id),
            "keyPointIdHistory",
        );
    }

    private onPointerEvent(eventType: PointerEventType, event: PointerEvent) {
        this.interaction.onPointerEvent({ event, eventType, splatapus: this });
    }

    onPointerDown = (event: PointerEvent) => this.onPointerEvent("down", event);
    onPointerMove = (event: PointerEvent) => this.onPointerEvent("move", event);
    onPointerUp = (event: PointerEvent) => this.onPointerEvent("up", event);
    onPointerCancel = (event: PointerEvent) => this.onPointerEvent("cancel", event);
    onWheel = (event: WheelEvent) => {
        this.viewport.handleWheelEvent(event);
    };
    onKeyDown = (event: KeyboardEvent) => this.interaction.onKeyDown({ event, splatapus: this });
    onKeyUp = (event: KeyboardEvent) => this.interaction.onKeyUp({ event, splatapus: this });

    previewPosition = new LiveMemo(() => {
        const interactionPosition = this.interaction.getPreviewPositionLive();
        return interactionPosition
            ? PreviewPosition.interpolated(interactionPosition, this.location.shapeId.live())
            : PreviewPosition.keyPointId(
                  this.location.keyPointId.live(),
                  this.location.shapeId.live(),
              );
    }, "previewPosition");
}

export function useSplatapus(initialize: () => SplatapusState) {
    const splatapus = useState(
        () => new Splatapus(new LiveValue(Vector2.ZERO, "screenSize"), initialize()),
    )[0];
    useEffect(() => {
        // @ts-expect-error expose splatapus on window
        window.splatapus = splatapus;

        const unsubscribes = [
            runLive(LiveEffect.eager, () => {
                const activeMode = splatapus.interaction.activeMode.live().type;
                if (splatapus.location.mode.live() !== activeMode) {
                    splatapus.location.mode.update(activeMode);
                }
            }),
            runLive(LiveEffect.eager, () => {
                const keyPointId = splatapus.location.keyPointId.live();
                const document = splatapus.document.live();
                splatapus.keyPointIdHistory.update((history) => {
                    const nextHistory = history.filter(
                        (entry) => document.keyPoints.has(entry) && entry !== keyPointId,
                    );
                    if (nextHistory.length === history.length - 1 && last(history) === keyPointId) {
                        console.log("update keyPointIdHistory (static)");
                        return history;
                    }
                    console.log("update keyPointIdHistory (changed)");
                    nextHistory.push(keyPointId);
                    return nextHistory;
                });
            }),
        ];
        return () => {
            for (const unsubscribe of unsubscribes) {
                unsubscribe();
            }
        };
    }, [splatapus]);
    return splatapus;
}
