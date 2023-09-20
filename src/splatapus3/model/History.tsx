import { assert } from "@/lib/assert";
import { reactive } from "@/lib/signia";
import { values } from "@/lib/utils";
import { IdGenerator } from "@/splatapus/model/Ids";
import { Splat } from "@/splatapus3/model/Splat";
import { SplatSerializedStore } from "@/splatapus3/model/schema";
import { transact } from "@tldraw/state";

export const HistoryEntryId = new IdGenerator("undo");
export type HistoryEntryId = typeof HistoryEntryId.Id;

type HistoryEntry = {
    readonly id: HistoryEntryId;
    readonly store: SplatSerializedStore;
};

export class SplatHistory {
    @reactive private accessor undos = [] as readonly HistoryEntry[];
    @reactive private accessor redos = [] as readonly HistoryEntry[];

    constructor(private readonly splat: Splat) {}

    get canUndo() {
        return this.undos.length > 0;
    }

    get canRedo() {
        return this.redos.length > 0;
    }

    private restore(entry: HistoryEntry) {
        transact(() => {
            this.splat.store.clear();
            this.splat.store.put(values(entry.store));
            this.splat.ensureStoreIsUsable();
        });
    }

    mark() {
        const entry = {
            id: HistoryEntryId.generate(),
            store: this.splat.store.serialize(),
        };
        this.undos = [entry, ...this.undos];
        this.redos = [];
        return entry.id;
    }

    undo() {
        if (this.canUndo) {
            const [entry, ...rest] = this.undos;
            this.undos = rest;
            this.redos = [entry, ...this.redos];
            this.restore(entry);
        }
    }

    redo() {
        if (this.canRedo) {
            const [entry, ...rest] = this.redos;
            this.redos = rest;
            this.undos = [entry, ...this.undos];
            this.restore(entry);
        }
    }

    bailToMark(mark: HistoryEntryId) {
        const lastUndo = this.undos[0];
        assert(lastUndo.id === mark);
        this.undos = this.undos.slice(0, -1);
        this.restore(lastUndo);
    }
}
