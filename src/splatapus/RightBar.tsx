import { inOutCubic } from "@/lib/easings";
import { times } from "@/lib/utils";
import { SIDEBAR_WIDTH_PX } from "@/splatapus/constants";
import { SplatShapeId } from "@/splatapus/model/SplatDoc";
import { SplatDocModel } from "@/splatapus/model/SplatDocModel";
import { SplatLocation } from "@/splatapus/SplatLocation";
import { OpOptions } from "@/splatapus/UndoStack";
import { CtxAction } from "@/splatapus/useEditorState";
import classNames from "classnames";

const fadeSize = 60;
const stopCount = 10;
const colorStops = times(
    stopCount,
    (i) =>
        `rgba(250, 250, 249, ${inOutCubic(i / (stopCount - 1)) * 1}) ${(
            fadeSize *
            (i / (stopCount - 1))
        ).toFixed(2)}px`,
);
const style = {
    width: SIDEBAR_WIDTH_PX + fadeSize,
    background: "rgba(250, 250, 249, 0.7)",
    webkitMaskImage: `linear-gradient(to right, ${colorStops.join(",")})`,
    maskImage: `linear-gradient(to right, ${colorStops.join(",")})`,
};

export function RightBar({
    document,
    location,
    updateDocument,
    updateLocation,
}: {
    document: SplatDocModel;
    location: SplatLocation;
    updateDocument: (ctx: CtxAction<SplatDocModel>, options: OpOptions) => void;
    updateLocation: (ctx: CtxAction<SplatLocation>) => void;
}) {
    return (
        <div
            className="absolute top-0 right-0 h-full overflow-auto pl-8 backdrop-blur-lg"
            style={style}
        >
            <div className="flex flex-col gap-3 p-5">
                {Array.from(document.shapes, (shape, i) => (
                    <button
                        className="flex items-center justify-between rounded px-3 py-1 hover:bg-stone-300/25"
                        onClick={() =>
                            updateLocation(({ location }) => location.with({ shapeId: shape.id }))
                        }
                    >
                        Shape {i + 1}
                        {shape.id === location.shapeId && (
                            <div className="h-3 w-3 rounded-full bg-purple-500" />
                        )}
                    </button>
                ))}
                <button
                    className="flex items-center justify-center rounded px-3 py-1 text-center hover:bg-stone-300/25"
                    onClick={() => {
                        const shapeId = SplatShapeId.generate();
                        updateDocument(({ document }) => document.addShape(shapeId), {
                            lockstepLocation: (location) => location.with({ shapeId }),
                        });
                    }}
                >
                    + shape
                </button>
            </div>
        </div>
    );
}
