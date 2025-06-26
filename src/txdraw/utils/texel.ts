import { Editor, VecModel, WeakCache } from "tldraw";

const texelSizeCache = new WeakCache<Editor, VecModel>();
export function getTexelSize(editor: Editor) {
    return texelSizeCache.get(editor, () => {
        const box = editor.textMeasure.measureText("╋", {
            maxWidth: null,
            fontFamily: "courier, monospace",
            fontSize: 14,
            fontStyle: "normal",
            fontWeight: "normal",
            lineHeight: 1,
            padding: "0",
        });

        return { x: box.w, y: box.h };
    });
}

export function pxToTxWidth(editor: Editor, px: number): number {
    const { x } = getTexelSize(editor);
    return Math.round(px / x);
}

export function pxToTxHeight(editor: Editor, px: number): number {
    const { y } = getTexelSize(editor);
    return Math.round(px / y);
}

export function txToPxWidth(editor: Editor, tx: number): number {
    const { x } = getTexelSize(editor);
    return tx * x;
}

export function txToPxHeight(editor: Editor, tx: number): number {
    const { y } = getTexelSize(editor);
    return tx * y;
}

export function snapPxWidthToTexel(editor: Editor, px: number): number {
    const { x } = getTexelSize(editor);
    return Math.round(px / x) * x;
}

export function snapPxHeightToTexel(editor: Editor, px: number): number {
    const { y } = getTexelSize(editor);
    return Math.round(px / y) * y;
}
