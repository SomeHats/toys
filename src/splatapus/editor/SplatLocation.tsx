import { Vector2 } from "@/lib/geom/Vector2";
import { createShapeParser, ParserType } from "@/lib/objectParser";
import { SplatKeyPointId, SplatShapeId } from "@/splatapus/model/SplatDoc";
import { parseToolType, ToolType } from "@/splatapus/editor/tools/ToolType";
import { parseSerializedViewport, Viewport } from "@/splatapus/editor/Viewport";

export const parseSerializedSplatLocation = createShapeParser({
    keyPointId: SplatKeyPointId.parse,
    shapeId: SplatShapeId.parse,
    viewport: parseSerializedViewport,
    tool: parseToolType,
});
export type SerializedSplatLocation = ParserType<typeof parseSerializedSplatLocation>;

type SplatLocationState = {
    keyPointId: SplatKeyPointId;
    shapeId: SplatShapeId;
    viewport: Viewport;
    tool: ToolType;
};

export class SplatLocation {
    static deserialize(state: SerializedSplatLocation, screenSize: Vector2) {
        return new SplatLocation({
            keyPointId: state.keyPointId,
            shapeId: state.shapeId,
            viewport: Viewport.deserialize(state.viewport, screenSize),
            tool: state.tool,
        });
    }

    readonly keyPointId: SplatKeyPointId;
    readonly shapeId: SplatShapeId;
    readonly viewport: Viewport;
    readonly tool: ToolType;

    constructor({ keyPointId, shapeId, viewport, tool }: SplatLocationState) {
        this.keyPointId = keyPointId;
        this.shapeId = shapeId;
        this.viewport = viewport;
        this.tool = tool;
    }

    serialize(): SerializedSplatLocation {
        return {
            keyPointId: this.keyPointId,
            shapeId: this.shapeId,
            viewport: this.viewport.serialize(),
            tool: this.tool,
        };
    }

    with(changes: Partial<SplatLocationState>): SplatLocation {
        return new SplatLocation({
            keyPointId: changes.keyPointId ?? this.keyPointId,
            shapeId: changes.shapeId ?? this.shapeId,
            viewport: changes.viewport ?? this.viewport,
            tool: changes.tool ?? this.tool,
        });
    }
}
