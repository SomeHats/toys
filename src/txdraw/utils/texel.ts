import { Editor, VecModel, WeakCache } from "tldraw";

const texelSizeCache = new WeakCache<Editor, VecModel>();
export function getTexelSize(editor: Editor) {
    return texelSizeCache.get(editor, () => {
        const box = editor.textMeasure.measureText("╋", {
            maxWidth: null,
            fontFamily: "tldraw_mono, monospace",
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

export function pxToTxWidthCeil(editor: Editor, px: number): number {
    const { x } = getTexelSize(editor);
    return Math.ceil(px / x);
}

export function pxToTxHeightCeil(editor: Editor, px: number): number {
    const { y } = getTexelSize(editor);
    return Math.ceil(px / y);
}

export function pxToTxWidthFloor(editor: Editor, px: number): number {
    const { x } = getTexelSize(editor);
    return Math.floor(px / x);
}

export function pxToTxHeightFloor(editor: Editor, px: number): number {
    const { y } = getTexelSize(editor);
    return Math.floor(px / y);
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
