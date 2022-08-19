import { assert, assertExists } from "@/lib/assert";
import { useEvent } from "@/lib/hooks/useEvent";
import { useCallback, useMemo, useReducer, useState } from "react";

type UndoEntry<State, Location> = {
    state: State;
    location: Location;
};

type UndoStackState<State, Location> = {
    undoStates: ReadonlyArray<UndoEntry<State, Location>>;
    redoStates: ReadonlyArray<UndoEntry<State, Location>> | null;
    pendingOp: null | {
        id: number;
        initialState: State;
    };
    current: UndoEntry<State, Location>;
};

export type UpdateAction<T> = ((state: T) => T) | T;
function applyUpdate<T>(prev: T, action: UpdateAction<T>): T {
    if (typeof action == "function") {
        return (action as (state: T) => T)(prev);
    } else {
        return action;
    }
}

export function useUndoStack<State, Location>(
    initialState: () => State,
    initialLocation: () => Location,
) {
    const [state, setState] = useState<UndoStackState<State, Location>>(() => ({
        undoStates: [],
        redoStates: null,
        pendingOp: null,
        current: { state: initialState(), location: initialLocation() },
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
                    initialState: state.current.state,
                },
            };
        });

        return {
            update: (action: UpdateAction<State>) => updateOperation(id, action),
            revert: () => revertOperation(id),
            commit: () => commitOperation(id),
        };
    });

    const updateOperation = useCallback((id: number, action: UpdateAction<State>) => {
        setState((state) => {
            console.log("UPDATE");
            assert(state.pendingOp?.id === id, "Pending op mismatch");
            return {
                ...state,
                current: {
                    state: applyUpdate(state.current.state, action),
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
                    state: state.pendingOp.initialState,
                    location: state.current.location,
                },
            };
        });
    }, []);

    const commitOperation = useCallback((id: number) => {
        console.log("COMMIT");
        setState((state) => {
            assert(state.pendingOp?.id === id, "Pending op mismatch");
            return {
                ...state,
                pendingOp: null,
                undoStates: [
                    { state: state.pendingOp.initialState, location: state.current.location },
                    ...state.undoStates,
                ],
                redoStates: null,
            };
        });
    }, []);

    const change = useEvent((action: UpdateAction<State>) => {
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

            const [current, ...undoStates] = state.undoStates;
            const redoStates = [state.current, ...(state.redoStates ?? [])];
            return {
                ...state,
                current,
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

            const [current, ...redoStates] = state.redoStates;
            const undoStates = [state.current, ...state.undoStates];
            return {
                ...state,
                current,
                undoStates,
                redoStates: redoStates.length === 0 ? null : redoStates,
            };
        });
    }, []);

    const changeLocation = useCallback((action: UpdateAction<Location>) => {
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
            state: state.current.state,
            location: state.current.location,
            beginOperation,
            change,
            changeLocation,
            undo,
            redo,
        }),
        [beginOperation, change, changeLocation, redo, state, undo],
    );
}
