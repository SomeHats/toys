import { createContext, useContextSelector, useContext } from "use-context-selector";
import { assert, assertExists } from "@/lib/assert";
import { CallbackAction, UpdateAction, applyUpdateWithin, applyUpdate } from "@/lib/utils";
import { Interaction } from "@/splatapus/editor/Interaction";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { PreviewPosition } from "@/splatapus/editor/PreviewPosition";
import { SplatLocation } from "@/splatapus/editor/SplatLocation";
import { SplatapusState } from "@/splatapus/model/store";
import { PointerEventType } from "@/splatapus/editor/lib/EventContext";
import { ToolType } from "@/splatapus/editor/tools/ToolType";
import { OpOptions, UndoStack } from "@/splatapus/editor/UndoStack";
import { Viewport } from "@/splatapus/editor/Viewport";
import React, { PointerEvent, ReactNode, useCallback, useMemo, useReducer } from "react";
import { Vector2 } from "@/lib/geom/Vector2";
import { useEvent } from "@/lib/hooks/useEvent";
import { Vfx, VfxController } from "@/splatapus/editor/Vfx";

export type EditorState = {
    undoStack: UndoStack;
    interaction: Interaction;
    vfx: Vfx;
};

export const EditorState = {
    initialize: (state: SplatapusState): EditorState => ({
        undoStack: UndoStack.initialize(state),
        interaction: Interaction.initialize(ToolType.Draw),
        vfx: Vfx.initialize(),
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
    updateViewport: (state: EditorState, update: UpdateAction<Viewport>) =>
        EditorState.updateLocation(state, (location) =>
            location.with({ viewport: applyUpdate(location.viewport, update) }),
        ),
    updateInteraction: (state: EditorState, update: UpdateAction<Interaction>) =>
        applyUpdateWithin(state, "interaction", update),
    updateVfx: (state: EditorState, update: CallbackAction<Vfx>) =>
        applyUpdateWithin(state, "vfx", update),
    afterUpdate: (state: EditorState, previousState: EditorState): EditorState => {
        const isSidebarOpen = Interaction.isSidebarOpen(state.interaction);
        if (isSidebarOpen !== state.undoStack.current.location.viewport.isSidebarOpen) {
            state = EditorState.updateViewport(state, (viewport) =>
                viewport.with({ isSidebarOpen }),
            );
        }
        return state;
    },
};

export interface ReducerCtx {
    update: (update: CallbackAction<EditorState>) => void;
    updateUndoStack: (update: CallbackAction<UndoStack>) => void;
    updateLocation: (update: UpdateAction<SplatLocation>) => void;
    updateDocument: (update: UpdateAction<SplatDocModel>, options?: OpOptions) => void;
    updateViewport: (update: UpdateAction<Viewport>) => void;
    updateInteraction: (update: UpdateAction<Interaction>) => void;
    updateVfx: (update: CallbackAction<Vfx>) => void;
    vfx: VfxController;
    document: SplatDocModel;
    location: SplatLocation;
    viewport: Viewport;
    state: EditorState;
}

export type CtxAction<T> = (ctx: ReducerCtx, state: T) => T;

function makeReducerCtx(
    state: EditorState,
    enqueueUpdate: (fn: CallbackAction<EditorState>) => void,
): ReducerCtx {
    const updateVfx = (update: CallbackAction<Vfx>) =>
        enqueueUpdate((state) => EditorState.updateVfx(state, update));
    return {
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
        updateVfx,
        vfx: new VfxController(updateVfx),
        document: state.undoStack.current.document,
        location: state.undoStack.current.location,
        viewport: state.undoStack.current.location.viewport,
        state,
    };
}

function reducer(state: EditorState, update: (ctx: ReducerCtx) => void): EditorState {
    const queue: Array<CallbackAction<EditorState>> = [];
    let isDone = false;

    function enqueueUpdate(fn: CallbackAction<EditorState>) {
        assert(!isDone);
        queue.push(fn);
    }

    update(makeReducerCtx(state, enqueueUpdate));
    const initialState = state;
    for (let i = 0; i < queue.length; i++) {
        state = queue[i](state);
    }
    state = EditorState.afterUpdate(state, initialState);

    if (state !== initialState) {
        console.log("STATE CHANGED");
    }

    isDone = true;
    return state;
}

function useEditorStateRoot(initialize: () => EditorState, size: Vector2) {
    const [state, _dispatch] = useReducer(reducer, null, initialize);

    const getState = useEvent(() => state);

    const events = useCallback(
        (runUpdate: (cb: () => void) => void) => {
            const dispatch: typeof _dispatch = (update) => {
                runUpdate(() => {
                    _dispatch(update);
                });
            };
            const updateInteraction = (update: CtxAction<Interaction>) =>
                dispatch((ctx) => ctx.updateInteraction((state) => update(ctx, state)));
            const updateViewport = (update: CtxAction<Viewport>) =>
                dispatch((ctx) => ctx.updateViewport((state) => update(ctx, state)));

            const onPointerEvent = (eventType: PointerEventType) => (event: PointerEvent) =>
                updateInteraction((ctx, interaction) =>
                    Interaction.onPointerEvent({ ...ctx, event, eventType }, interaction),
                );

            const getContextForEvent = () =>
                makeReducerCtx(getState(), (update) => {
                    dispatch((ctx) => update(ctx.state));
                });

            return {
                getContextForEvent,

                updateUndoStack: (update: CtxAction<UndoStack>) =>
                    dispatch((ctx) => ctx.updateUndoStack((state) => update(ctx, state))),
                updateLocation: (update: CtxAction<SplatLocation>) =>
                    dispatch((ctx) => ctx.updateLocation((state) => update(ctx, state))),
                updateDocument: (update: CtxAction<SplatDocModel>, options: OpOptions) =>
                    dispatch((ctx) => ctx.updateDocument((state) => update(ctx, state), options)),
                updateViewport,
                updateInteraction,
                updateVfx: (update: CtxAction<Vfx>) =>
                    dispatch((ctx) => ctx.updateVfx((state) => update(ctx, state))),

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
                onWheel: (event: WheelEvent) =>
                    updateViewport((ctx, viewport) => viewport.handleWheelEvent(event)),
            };
        },
        [getState],
    );

    const document = state.undoStack.current.document;
    const location = state.undoStack.current.location;

    const { keyPointId, shapeId } = state.undoStack.current.location;
    const interactionPreviewPosition = Interaction.getPreviewPosition(state.interaction, shapeId);
    const previewPosition = useMemo(
        (): PreviewPosition =>
            interactionPreviewPosition ?? PreviewPosition.keyPointId(keyPointId, shapeId),
        [interactionPreviewPosition, keyPointId, shapeId],
    );

    return useMemo(
        () => ({
            events,
            document,
            location,
            undoStack: state.undoStack,
            interaction: state.interaction,
            previewPosition,
            vfx: state.vfx,
        }),
        [
            document,
            events,
            location,
            previewPosition,
            state.interaction,
            state.undoStack,
            state.vfx,
        ],
    );
}

export type EditorStateHook = ReturnType<typeof useEditorStateRoot>;
export type EditorStateEventsThunk = EditorStateHook["events"];
export type EditorStateEvents = ReturnType<EditorStateEventsThunk>;
export type UpdateUndoStack = EditorStateEvents["updateUndoStack"];
export type UpdateLocation = EditorStateEvents["updateLocation"];
export type UpdateDocument = EditorStateEvents["updateDocument"];
export type UpdateViewport = EditorStateEvents["updateViewport"];
export type UpdateInteraction = EditorStateEvents["updateInteraction"];

const EditorStateContext = createContext<EditorStateHook | null>(null);
const EditorEventsContext = createContext<EditorStateEvents | null>(null);

export function EditorStateProvider({
    initialize,
    size,
    children,
}: {
    initialize: () => EditorState;
    size: Vector2;
    children: ReactNode;
}) {
    const state = useEditorStateRoot(initialize, size);
    return (
        <EditorStateContext.Provider value={state}>
            <_EventProvider events={state.events}>{children}</_EventProvider>
        </EditorStateContext.Provider>
    );
}

const _EventProvider = React.memo(function _EventProvider({
    events,
    children,
}: {
    events: EditorStateEventsThunk;
    children: ReactNode;
}) {
    // const update = useContextUpdate(EditorStateContext);
    const boundEvents = useMemo(() => events((cb) => cb()), [events]);
    return (
        <EditorEventsContext.Provider value={boundEvents}>{children}</EditorEventsContext.Provider>
    );
});

export function useEditorState<T>(selector: (state: EditorStateHook) => T): T {
    return useContextSelector(EditorStateContext, (state) => {
        assert(state);
        return selector(state);
    });
}
export function useEditorKey<Key extends keyof EditorStateHook>(key: Key): EditorStateHook[Key] {
    return useEditorState((state) => state[key]);
}

export function useEditorEvents() {
    return assertExists(useContext(EditorEventsContext));
}
