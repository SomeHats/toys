import { assert, assertExists } from "@/lib/assert";
import { useEvent } from "@/lib/hooks/useEvent";
import { useCallback, useMemo, useReducer, useState } from "react";
import { UNDO_ACTIONS } from "@/splatapus/constants";
import { deepEqual, UpdateAction, applyUpdate } from "@/lib/utils";

export type OpOptions<Location> = {
    lockstepLocation?: UpdateAction<Location>;
};

type UndoEntry<Doc, Location> = {
    doc: Doc;
    location: Location;
    options: OpOptions<Location>;
};

type UndoStackState<Doc, Location> = {
    undoStates: ReadonlyArray<UndoEntry<Doc, Location>>;
    redoStates: ReadonlyArray<UndoEntry<Doc, Location>> | null;
    pendingOp: null | {
        id: number;
        initialDoc: Doc;
        initialOptions: OpOptions<Location>;
    };
    current: UndoEntry<Doc, Location>;
};

export function useUndoStack<Doc, Location>(
    initialize: () => Omit<UndoEntry<Doc, Location>, "options">,
) {
    const [state, setState] = useState<UndoStackState<Doc, Location>>(() => ({
        undoStates: [],
        redoStates: null,
        pendingOp: null,
        current: { ...initialize(), options: {} },
    }));

    const beginOperation = useEvent(() => {
        console.log("BEGIN");
        const id = Math.random();
        setState((state) => {
            assert(state.pendingOp == null, "Pending op already in progress");
            return {
                ...state,
                pendingOp: {
                    id,
                    initialDoc: state.current.doc,
                    initialOptions: state.current.options,
                },
                current: {
                    ...state.current,
                    options: {},
                },
            };
        });

        return {
            update: (action: UpdateAction<Doc>) => updateOperation(id, action),
            revert: () => revertOperation(id),
            commit: (options: OpOptions<Location> = {}) => commitOperation(id, options),
        };
    });

    const updateOperation = useCallback((id: number, action: UpdateAction<Doc>) => {
        setState((state) => {
            console.log("UPDATE");
            assert(state.pendingOp?.id === id, "Pending op mismatch");
            return {
                ...state,
                current: {
                    ...state.current,
                    doc: applyUpdate(state.current.doc, action),
                },
            };
        });
    }, []);

    const revertOperation = useCallback((id: number) => {
        console.log("REVERT");
        setState((state) => {
            assert(state.pendingOp?.id === id, "Pending op mismatch");
            return {
                ...state,
                pendingOp: null,
                current: {
                    doc: state.pendingOp.initialDoc,
                    location: state.current.location,
                    options: state.pendingOp.initialOptions,
                },
            };
        });
    }, []);

    const commitOperation = useCallback((id: number, options: OpOptions<Location>) => {
        console.log("COMMIT");
        setState((state) => {
            assert(state.pendingOp?.id === id, "Pending op mismatch");
            const undoStates = [
                {
                    doc: state.pendingOp.initialDoc,
                    location: state.current.location,
                    options: state.pendingOp.initialOptions,
                },
                ...state.undoStates,
            ];
            while (undoStates.length > UNDO_ACTIONS) {
                undoStates.pop();
            }
            const current = { ...state.current, options };
            if (options.lockstepLocation) {
                current.location = applyUpdate(current.location, options.lockstepLocation);
            }
            return {
                ...state,
                current,
                pendingOp: null,
                undoStates: undoStates,
                redoStates: null,
            };
        });
    }, []);

    const updateDocument = useEvent(
        (action: UpdateAction<Doc>, options: OpOptions<Location> = {}) => {
            const operation = beginOperation();
            operation.update(action);
            operation.commit(options);
        },
    );

    const undo = useCallback(() => {
        console.log("UNDO");
        setState((state) => {
            assert(state.pendingOp == null, "Pending op in progress");
            if (state.undoStates.length == 0) {
                return state;
            }

            const [targetState, ...undoStates] = state.undoStates;
            if (
                !deepEqual(targetState.location, state.current.location) &&
                !state.current.options.lockstepLocation
            ) {
                return {
                    ...state,
                    current: {
                        ...state.current,
                        location: targetState.location,
                    },
                };
            }

            const redoStates = [state.current, ...(state.redoStates ?? [])];
            return {
                ...state,
                current: targetState,
                undoStates,
                redoStates,
            };
        });
    }, []);

    const redo = useCallback(() => {
        console.log("REDO");
        setState((state) => {
            assert(state.pendingOp == null, "pendign op in progress");
            if (!state.redoStates || state.redoStates.length == 0) {
                return state;
            }

            const [targetState, ...redoStates] = state.redoStates;
            if (
                !deepEqual(targetState.location, state.current.location) &&
                !targetState.options.lockstepLocation
            ) {
                return {
                    ...state,
                    current: {
                        ...state.current,
                        location: targetState.location,
                    },
                };
            }

            const undoStates = [state.current, ...state.undoStates];
            return {
                ...state,
                current: targetState.options.lockstepLocation
                    ? {
                          ...targetState,
                          location: applyUpdate(
                              state.current.location,
                              targetState.options.lockstepLocation,
                          ),
                      }
                    : targetState,
                undoStates,
                redoStates: redoStates.length === 0 ? null : redoStates,
            };
        });
    }, []);

    const updateLocation = useCallback((action: UpdateAction<Location>) => {
        setState((state) => {
            return {
                ...state,
                current: {
                    ...state.current,
                    location: applyUpdate(state.current.location, action),
                },
            };
        });
    }, []);

    useMemo(() => {
        console.log("UNDO STATE CHANGED", state);
    }, [state]);

    return useMemo(
        () => ({
            document: state.current.doc,
            location: state.current.location,
            beginOperation,
            updateDocument,
            updateLocation,
            undo,
            redo,
        }),
        [beginOperation, updateDocument, updateLocation, redo, state, undo],
    );
}
