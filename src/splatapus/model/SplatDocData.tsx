import { Table } from "@/splatapus/model/Table";
import { SplatKeypoint, SplatShape, SplatDocId } from "@/splatapus/model/SplatDoc";

export class SplatDocData {
    constructor(
        readonly id: SplatDocId,
        readonly keyframes: Table<SplatKeypoint>,
        readonly shapes: Table<SplatShape>,
    ) {}

    private with(changes: {
        id?: SplatDocId;
        keyframes?: Table<SplatKeypoint>;
        shapes?: Table<SplatShape>;
    }): SplatDocData {
        return new SplatDocData(
            changes.id ?? this.id,
            changes.keyframes ?? this.keyframes,
            changes.shapes ?? this.shapes,
        );
    }
}
