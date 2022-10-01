import { assert } from "@/lib/assert";
import { UNDO_ACTIONS } from "@/splatapus/constants";
import { deepEqual, UpdateAction, applyUpdate } from "@/lib/utils";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { SplatLocation } from "@/splatapus/editor/SplatLocation";
import { Vfx } from "@/splatapus/editor/Vfx";

export type OpOptions = {
    readonly lockstepLocation?: UpdateAction<SplatLocation>;
};

type UndoEntry = {
    readonly document: SplatDocModel;
    readonly location: SplatLocation;
    readonly options: OpOptions;
};

export type UndoStack = {
    undoStates: ReadonlyArray<UndoEntry>;
    redoStates: ReadonlyArray<UndoEntry> | null;
    pendingOp: null | {
        txId: number;
        initialDoc: SplatDocModel;
        initialOptions: OpOptions;
    };
    current: UndoEntry;
};

export const UndoStack = {
    initialize: (entry: Omit<UndoEntry, "options">): UndoStack => ({
        undoStates: [],
        redoStates: [],
        pendingOp: null,
        current: { ...entry, options: {} },
    }),
    canUndo: (undoStack: UndoStack): boolean => undoStack.undoStates.length > 0,
    canRedo: (undoStack: UndoStack): boolean => (undoStack.redoStates?.length ?? 0) > 0,
    beginOperation: (undoStack: UndoStack): { undoStack: UndoStack; txId: number } => {
        const txId = Math.random();
        assert(undoStack.pendingOp == null, "pending op already in progress");

        return {
            undoStack: {
                ...undoStack,
                pendingOp: {
                    txId,
                    initialDoc: undoStack.current.document,
                    initialOptions: undoStack.current.options,
                },
                current: {
                    ...undoStack.current,
                    options: {},
                },
            },
            txId,
        };
    },
    updateOperation: (
        undoStack: UndoStack,
        txId: number,
        action: UpdateAction<SplatDocModel>,
    ): UndoStack => {
        assert(undoStack.pendingOp?.txId === txId, "pending op mismatch");
        return {
            ...undoStack,
            current: {
                ...undoStack.current,
                document: applyUpdate(undoStack.current.document, action),
            },
        };
    },
    revertOperation: (undoStack: UndoStack, txId: number): UndoStack => {
        assert(undoStack.pendingOp?.txId === txId, "Pending op mismatch");
        return {
            ...undoStack,
            pendingOp: null,
            current: {
                document: undoStack.pendingOp.initialDoc,
                location: undoStack.current.location,
                options: undoStack.pendingOp.initialOptions,
            },
        };
    },
    commitOperation: (undoStack: UndoStack, txId: number, options: OpOptions = {}): UndoStack => {
        assert(undoStack.pendingOp?.txId === txId, "Pending op mismatch");
        const undoStates = [
            {
                document: undoStack.pendingOp.initialDoc,
                location: undoStack.current.location,
                options: undoStack.pendingOp.initialOptions,
            },
            ...undoStack.undoStates,
        ];
        while (undoStates.length > UNDO_ACTIONS) {
            undoStates.pop();
        }
        const current = { ...undoStack.current, options };
        if (options.lockstepLocation) {
            current.location = applyUpdate(current.location, options.lockstepLocation);
        }
        return {
            ...undoStack,
            current,
            pendingOp: null,
            undoStates: undoStates,
            redoStates: null,
        };
    },
    updateDocument: (
        undoStack: UndoStack,
        action: UpdateAction<SplatDocModel>,
        options?: OpOptions,
    ): UndoStack => {
        let txId;
        ({ undoStack, txId } = UndoStack.beginOperation(undoStack));
        undoStack = UndoStack.updateOperation(undoStack, txId, action);
        return UndoStack.commitOperation(undoStack, txId, options);
    },
    undo: (undoStack: UndoStack, vfx: Vfx): UndoStack => {
        assert(undoStack.pendingOp == null, "Pending op in progress");
        if (undoStack.undoStates.length == 0) {
            return undoStack;
        }

        vfx.triggerAnimation("undo");

        const [targetState, ...undoStates] = undoStack.undoStates;
        if (
            !deepEqual(targetState.location, undoStack.current.location) &&
            !undoStack.current.options.lockstepLocation
        ) {
            return {
                ...undoStack,
                current: {
                    ...undoStack.current,
                    location: targetState.location,
                },
            };
        }

        const redoStates = [undoStack.current, ...(undoStack.redoStates ?? [])];
        return {
            ...undoStack,
            current: targetState,
            undoStates,
            redoStates,
        };
    },
    redo: (undoStack: UndoStack, vfx: Vfx): UndoStack => {
        assert(undoStack.pendingOp == null, "pending op in progress");
        if (!undoStack.redoStates || undoStack.redoStates.length == 0) {
            return undoStack;
        }

        vfx.triggerAnimation("redo");

        const [targetState, ...redoStates] = undoStack.redoStates;
        if (
            !deepEqual(targetState.location, undoStack.current.location) &&
            !targetState.options.lockstepLocation
        ) {
            return {
                ...undoStack,
                current: {
                    ...undoStack.current,
                    location: targetState.location,
                },
            };
        }

        const undoStates = [undoStack.current, ...undoStack.undoStates];
        return {
            ...undoStack,
            current: targetState.options.lockstepLocation
                ? {
                      ...targetState,
                      location: applyUpdate(
                          undoStack.current.location,
                          targetState.options.lockstepLocation,
                      ),
                  }
                : targetState,
            undoStates,
            redoStates: redoStates.length === 0 ? null : redoStates,
        };
    },
    updateLocation: (undoStack: UndoStack, action: UpdateAction<SplatLocation>): UndoStack => {
        return {
            ...undoStack,
            current: {
                ...undoStack.current,
                location: applyUpdate(undoStack.current.location, action),
            },
        };
    },
};
