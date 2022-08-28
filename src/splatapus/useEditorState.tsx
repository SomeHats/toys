import { assert } from "@/lib/assert";
import { useEvent } from "@/lib/hooks/useEvent";
import { CallbackAction, UpdateAction, applyUpdateWithin, applyUpdate } from "@/lib/utils";
import { Interaction } from "@/splatapus/Interaction";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { SplatLocation } from "@/splatapus/SplatLocation";
import { SplatapusState } from "@/splatapus/store";
import { PointerEventType } from "@/splatapus/tools/lib/EventContext";
import { ToolType } from "@/splatapus/tools/ToolType";
import { OpOptions, UndoStack } from "@/splatapus/UndoStack";
import { Viewport, ViewportState } from "@/splatapus/Viewport";
import { PointerEvent, useMemo, useReducer } from "react";

export type EditorState = {
    undoStack: UndoStack;
    interaction: Interaction;
};

export const EditorState = {
    initialize: (state: SplatapusState): EditorState => ({
        undoStack: UndoStack.initialize(state),
        interaction: Interaction.initialize(ToolType.Draw),
    }),
    updateUndoStack: (state: EditorState, update: CallbackAction<UndoStack>) =>
        applyUpdateWithin(state, "undoStack", update),
    updateLocation: (state: EditorState, update: UpdateAction<SplatLocation>) =>
        EditorState.updateUndoStack(state, (undoStack) =>
            UndoStack.updateLocation(undoStack, update),
        ),
    updateDocument: (
        state: EditorState,
        update: UpdateAction<SplatDocModel>,
        options?: OpOptions,
    ) =>
        EditorState.updateUndoStack(state, (undoStack) =>
            UndoStack.updateDocument(undoStack, update, options),
        ),
    updateViewport: (state: EditorState, update: UpdateAction<ViewportState>) =>
        EditorState.updateLocation(state, (location) =>
            location.with({ viewport: applyUpdate(location.viewportState, update) }),
        ),
    updateInteraction: (state: EditorState, update: UpdateAction<Interaction>) =>
        applyUpdateWithin(state, "interaction", update),
};

export interface CapturedCtx {
    viewport: Viewport;
}

export interface ReducerCtx extends CapturedCtx {
    update: (update: CallbackAction<EditorState>) => void;
    updateUndoStack: (update: CallbackAction<UndoStack>) => void;
    updateLocation: (update: UpdateAction<SplatLocation>) => void;
    updateDocument: (update: UpdateAction<SplatDocModel>, options?: OpOptions) => void;
    updateViewport: (update: UpdateAction<ViewportState>) => void;
    updateInteraction: (update: UpdateAction<Interaction>) => void;
    document: SplatDocModel;
    location: SplatLocation;
}

export type CtxAction<T> = (ctx: ReducerCtx, state: T) => T;

function makeReducer(capture: () => CapturedCtx) {
    return (state: EditorState, update: (ctx: ReducerCtx) => void): EditorState => {
        const queue: Array<CallbackAction<EditorState>> = [];
        let isDone = false;

        function enqueueUpdate(fn: CallbackAction<EditorState>) {
            assert(!isDone);
            queue.push(fn);
        }

        const captured = capture();

        update({
            update: enqueueUpdate,
            updateUndoStack: (update) =>
                enqueueUpdate((state) => EditorState.updateUndoStack(state, update)),
            updateLocation: (update) =>
                enqueueUpdate((state) => EditorState.updateLocation(state, update)),
            updateDocument: (update, options) =>
                enqueueUpdate((state) => EditorState.updateDocument(state, update, options)),
            updateViewport: (update) =>
                enqueueUpdate((state) => EditorState.updateViewport(state, update)),
            updateInteraction: (update) =>
                enqueueUpdate((state) => EditorState.updateInteraction(state, update)),
            document: state.undoStack.current.doc,
            location: state.undoStack.current.location,
            viewport: captured.viewport,
        });

        for (let i = 0; i < queue.length; i++) {
            state = queue[i](state);
        }

        isDone = true;
        return state;
    };
}

export function useEditorState(initialize: () => EditorState, _capture: () => CapturedCtx) {
    const capture = useEvent(_capture);
    const reducer = useMemo(() => makeReducer(capture), [capture]);
    const [state, dispatch] = useReducer(reducer, null, initialize);

    const events = useMemo(() => {
        const updateInteraction = (update: CtxAction<Interaction>) =>
            dispatch((ctx) => ctx.updateInteraction((state) => update(ctx, state)));

        const onPointerEvent = (eventType: PointerEventType) => (event: PointerEvent) =>
            updateInteraction((ctx, interaction) =>
                Interaction.onPointerEvent({ ...ctx, event, eventType }, interaction),
            );

        return {
            updateUndoStack: (update: CtxAction<UndoStack>) =>
                dispatch((ctx) => ctx.updateUndoStack((state) => update(ctx, state))),
            updateLocation: (update: CtxAction<SplatLocation>) =>
                dispatch((ctx) => ctx.updateLocation((state) => update(ctx, state))),
            updateDocument: (update: CtxAction<SplatDocModel>, options: OpOptions) =>
                dispatch((ctx) => ctx.updateDocument((state) => update(ctx, state), options)),
            updateViewport: (update: CtxAction<ViewportState>) =>
                dispatch((ctx) => ctx.updateViewport((state) => update(ctx, state))),
            updateInteraction,

            onPointerDown: onPointerEvent("down"),
            onPointerMove: onPointerEvent("move"),
            onPointerUp: onPointerEvent("up"),
            onPointerCancel: onPointerEvent("cancel"),

            onKeyDown: (event: KeyboardEvent) =>
                updateInteraction((ctx, interaction) =>
                    Interaction.onKeyDown({ ...ctx, event }, interaction),
                ),
            onKeyUp: (event: KeyboardEvent) =>
                updateInteraction((ctx, interaction) =>
                    Interaction.onKeyUp({ ...ctx, event }, interaction),
                ),
        };
    }, []);

    return {
        ...events,
        document: state.undoStack.current.doc,
        location: state.undoStack.current.location,
        interaction: state.interaction,
    };
}
