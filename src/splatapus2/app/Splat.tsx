import { Result } from "@/lib/Result";
import { assertExists } from "@/lib/assert";
import { Vector2 } from "@/lib/geom/Vector2";
import { Schema } from "@/lib/schema";
import { IdGenerator } from "@/splatapus/model/Ids";
import { Inputs } from "@/splatapus2/app/Inputs";
import { RootNode } from "@/splatapus2/states/State";
import { appendIncrementalDiff } from "@/splatapus2/store/Incremental";
import { Index } from "@/splatapus2/store/Index";
import {
    Doc,
    DocDiff,
    KeyPointId,
    ShapeId,
    ShapeVersionId,
} from "@/splatapus2/store/Records";
import {
    computedIncrementalObjectProperty,
    incrementalTableAccessor,
} from "@/splatapus2/store/Signia";
import { Atom, atom, transact } from "@tldraw/state";
import Immutable, { Stack } from "immutable";

export const HistoryEntryId = new IdGenerator("hst");
export type HistoryEntryId = typeof HistoryEntryId.Id;

interface HistoryEntry {
    readonly id: HistoryEntryId;
    readonly inverse: readonly DocDiff[];
}
const historyEntrySchema = Schema.object({
    id: HistoryEntryId.schema,
    inverse: Schema.arrayOf(Doc.diffSchema),
});

export class Splat {
    readonly doc: Atom<Doc, DocDiff>;
    readonly history: Atom<Stack<HistoryEntry>>;
    readonly state = new RootNode(this);
    readonly inputs = new Inputs();

    static schema = Schema.object({
        doc: Doc.valueSchema,
        history: Schema.arrayOf(historyEntrySchema),
    }).transform(
        ({ doc, history }) => Result.ok(new Splat(doc, Stack(history))),
        Schema.cannotValidate("Splat"),
        (splat) => ({
            doc: splat.doc.get(),
            history: splat.history.get().toArray(),
        }),
    );

    static empty() {
        const keyPointId = KeyPointId.generate();
        const shapeId = ShapeId.generate();
        const shapeVersionId = ShapeVersionId.generate();

        return new Splat(
            {
                keyPoints: Immutable.Map(),
                shapes: Immutable.Map(),
                shapeVersions: Immutable.Map(),
            },
            Stack(),
        ).updateWithoutHistory({
            keyPoints: {
                insert: {
                    [keyPointId]: {
                        id: keyPointId,
                        position: Vector2.ZERO,
                    },
                },
            },
            shapes: {
                insert: {
                    [shapeId]: {
                        id: shapeId,
                    },
                },
            },
            shapeVersions: {
                insert: {
                    [shapeVersionId]: {
                        id: shapeVersionId,
                        keyPointId,
                        shapeId,
                        rawPoints: [],
                    },
                },
            },
        });
    }

    constructor(doc: Doc, history: Stack<HistoryEntry>) {
        this.doc = atom("Store.doc", doc, { historyLength: 100 });
        this.history = atom("Store.history", Stack(history));

        // react("logger", (lastReactEpoch) => {
        //     const diffs = this.doc.getDiffSince(lastReactEpoch);
        //     if (diffs !== RESET_VALUE) {
        //         console.log(
        //             "diffs",
        //             JSON.stringify(Schema.arrayOf(Doc.diffSchema).serialize(diffs)),
        //         );
        //     }
        // });
    }

    updateWithoutHistory(op: DocDiff) {
        const [updatedDoc, _] = Doc.apply(this.doc.get(), op);
        this.doc.set(updatedDoc, op);
        return this;
    }

    update(op: DocDiff) {
        const [updatedDoc, inverseOp] = Doc.apply(this.doc.get(), op);
        this.doc.set(updatedDoc, op);
        this.history.update((history) => {
            const lastHistoryItem = history.peek();

            if (lastHistoryItem) {
                return history.pop().push({
                    ...lastHistoryItem,
                    inverse: appendIncrementalDiff(
                        Doc,
                        lastHistoryItem.inverse,
                        inverseOp,
                    ),
                });
            }

            return history.push({
                id: HistoryEntryId.generate("initial"),
                inverse: [inverseOp],
            });
        });
        return this;
    }

    clear() {
        const empty = Splat.empty();
        this.doc.set(empty.doc.get());
        this.history.set(empty.history.get());
    }

    mark(name?: string): HistoryEntryId {
        const id = HistoryEntryId.generate(name);
        this.history.update((history) => history.push({ id, inverse: [] }));
        return id;
    }

    bail(to: HistoryEntryId) {
        transact(() => {
            const markIndex = this.history.get().findIndex((h) => h.id === to);
            assertExists(markIndex, "mark not found");
            const relevantHistory = this.history.get().take(markIndex + 1);
            this.history.set(this.history.get().skip(markIndex + 1));
            for (const entry of relevantHistory) {
                for (const diff of entry.inverse) {
                    this.updateWithoutHistory(diff);
                }
            }
        });
        return this;
    }

    onPointerDown(e: React.PointerEvent) {
        transact(() => {
            if (!e.isPrimary) return;
            this.inputs.onPointerDown(e);
            this.state.onPointerDown(e);
        });
    }

    onPointerMove(e: React.PointerEvent) {
        transact(() => {
            if (!e.isPrimary) return;
            this.inputs.onPointerMove(e);
            this.state.onPointerMove(e);
        });
    }

    onPointerUp(e: React.PointerEvent) {
        transact(() => {
            if (!e.isPrimary) return;
            this.inputs.onPointerUp(e);
            this.state.onPointerUp(e);
        });
    }

    onPointerCancel(e: React.PointerEvent) {
        transact(() => {
            if (!e.isPrimary) return;
            this.state.onPointerCancel(e);
        });
    }

    shapeVersions = incrementalTableAccessor(
        computedIncrementalObjectProperty(Doc, "shapeVersions", () => this.doc),
        (diff) => this.update({ shapeVersions: diff }),
    );
    shapes = incrementalTableAccessor(
        computedIncrementalObjectProperty(Doc, "shapes", () => this.doc),
        (diff) => this.update({ shapes: diff }),
    );
    keyPoints = incrementalTableAccessor(
        computedIncrementalObjectProperty(Doc, "keyPoints", () => this.doc),
        (diff) => this.update({ keyPoints: diff }),
    );

    shapeVersionsByShapeId = new Index(
        this.shapeVersions.signal,
        (shapeVersion) => shapeVersion.shapeId,
    );
}
