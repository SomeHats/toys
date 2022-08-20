import { assert, assertExists } from "@/lib/assert";
import { useEvent } from "@/lib/hooks/useEvent";
import { useCallback, useMemo, useReducer, useState } from "react";
import { UNDO_ACTIONS } from "@/splatapus/constants";
import { deepEqual } from "@/lib/utils";

type UndoEntry<Doc, Location> = {
    doc: Doc;
    location: Location;
};

type UndoStackState<Doc, Location> = {
    undoStates: ReadonlyArray<UndoEntry<Doc, Location>>;
    redoStates: ReadonlyArray<UndoEntry<Doc, Location>> | null;
    pendingOp: null | {
        id: number;
        initialState: Doc;
    };
    current: UndoEntry<Doc, Location>;
};

export type UpdateAction<T> = ((state: T) => T) | T;
function applyUpdate<T>(prev: T, action: UpdateAction<T>): T {
    if (typeof action == "function") {
        return (action as (state: T) => T)(prev);
    } else {
        return action;
    }
}

export function useUndoStack<Doc, Location>(initialize: () => UndoEntry<Doc, Location>) {
    const [state, setState] = useState<UndoStackState<Doc, Location>>(() => ({
        undoStates: [],
        redoStates: null,
        pendingOp: null,
        current: initialize(),
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
                    initialState: state.current.doc,
                },
            };
        });

        return {
            update: (action: UpdateAction<Doc>) => updateOperation(id, action),
            revert: () => revertOperation(id),
            commit: () => commitOperation(id),
        };
    });

    const updateOperation = useCallback((id: number, action: UpdateAction<Doc>) => {
        setState((state) => {
            console.log("UPDATE");
            assert(state.pendingOp?.id === id, "Pending op mismatch");
            return {
                ...state,
                current: {
                    doc: applyUpdate(state.current.doc, action),
                    location: state.current.location,
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
                    doc: state.pendingOp.initialState,
                    location: state.current.location,
                },
            };
        });
    }, []);

    const commitOperation = useCallback((id: number) => {
        console.log("COMMIT");
        setState((state) => {
            assert(state.pendingOp?.id === id, "Pending op mismatch");
            const undoStates = [
                { doc: state.pendingOp.initialState, location: state.current.location },
                ...state.undoStates,
            ];
            while (undoStates.length > UNDO_ACTIONS) {
                undoStates.pop();
            }
            return {
                ...state,
                pendingOp: null,
                undoStates: undoStates,
                redoStates: null,
            };
        });
    }, []);

    const updateDocument = useEvent((action: UpdateAction<Doc>) => {
        const operation = beginOperation();
        operation.update(action);
        operation.commit();
    });

    const undo = useCallback(() => {
        console.log("UNDO");
        setState((state) => {
            assert(state.pendingOp == null, "Pending op in progress");
            if (state.undoStates.length == 0) {
                return state;
            }

            const [targetState, ...undoStates] = state.undoStates;
            if (!deepEqual(targetState.location, state.current.location)) {
                return {
                    ...state,
                    current: { location: targetState.location, doc: state.current.doc },
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
            if (!deepEqual(targetState.location, state.current.location)) {
                return {
                    ...state,
                    current: { location: targetState.location, doc: state.current.doc },
                };
            }

            const undoStates = [state.current, ...state.undoStates];
            return {
                ...state,
                current: targetState,
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
        console.log("RENDER CHANGED", state);
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
