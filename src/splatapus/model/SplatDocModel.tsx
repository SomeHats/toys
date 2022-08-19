import { SplatDocData } from "@/splatapus/model/SplatDocData";
import { SplatDoc } from "@/splatapus/model/SplatDoc";
import { Table } from "@/splatapus/model/Table";

export class SplatDocModel {
    static deserialize(data: SplatDoc): SplatDocModel {
        return new SplatDocModel(
            new SplatDocData(data.id, new Table(data.keyframes), new Table(data.shapes)),
        );
    }

    private constructor(private readonly data: SplatDocData) {}

    serialize(): SplatDoc {
        return {
            id: this.data.id,
            keyframes: this.data.keyframes.data,
            shapes: this.data.shapes.data,
        };
    }
}
