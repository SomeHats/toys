import { snapPxHeightToTexel, snapPxWidthToTexel } from "@/txdraw/utils/texel";
import { Editor } from "tldraw";

export function snapShapesToGrid(editor: Editor) {
    editor.sideEffects.registerBeforeCreateHandler("shape", (shape) => {
        const snappedX = snapPxWidthToTexel(editor, shape.x);
        const snappedY = snapPxHeightToTexel(editor, shape.y);
        if (snappedX !== shape.x || snappedY !== shape.y) {
            return {
                ...shape,
                x: snappedX,
                y: snappedY,
            };
        }

        return shape;
    });

    editor.sideEffects.registerBeforeChangeHandler(
        "shape",
        (prevShape, nextShape) => {
            if (prevShape.x !== nextShape.x || prevShape.y !== nextShape.y) {
                return {
                    ...nextShape,
                    x: snapPxWidthToTexel(editor, nextShape.x),
                    y: snapPxHeightToTexel(editor, nextShape.y),
                };
            }

            return nextShape;
        },
    );
}
