import { assert } from "@/lib/assert";
import { getTextGrid, TextGrid } from "@/txdraw/TextGrid";
import {
    getTexelSize,
    pxToTxHeight,
    pxToTxHeightFloor,
    pxToTxWidth,
    pxToTxWidthFloor,
    txToPxHeight,
    txToPxWidth,
} from "@/txdraw/utils/texel";
import { useLayoutEffect, useRef, useState } from "react";
import {
    approximately,
    SVGContainer,
    useEditor,
    useUniqueSafeId,
    useValue,
    Vec,
    VecModel,
} from "tldraw";

export function Renderer() {
    const editor = useEditor();

    const { textGrid, offset } = useValue(
        "textGrid",
        () => {
            const shapes = editor.getCurrentPageShapesSorted();
            const bounds = editor.getCurrentPageBounds();
            const offset =
                bounds ?
                    {
                        x: pxToTxWidthFloor(editor, bounds.x),
                        y: pxToTxHeightFloor(editor, bounds.y),
                    }
                :   { x: 0, y: 0 };

            const textGrid = new TextGrid();

            for (const shape of shapes) {
                const shapeGrid = getTextGrid(editor, shape.id);
                if (!shapeGrid) continue;

                console.log({ shapeGrid });

                const transform = editor.getShapePageTransform(shape);
                const { x, y } = transform.decomposed();

                textGrid.writeTextGrid(
                    shapeGrid,
                    pxToTxWidth(editor, x) - offset.x,
                    pxToTxHeight(editor, y) - offset.y,
                );
            }

            console.log({ textGrid, offset });

            return { textGrid, offset };
        },
        [editor],
    );

    const [charOffset, setCharOffset] = useState<VecModel>({ x: 0, y: 0 });
    const renderGroup = useRef<SVGGElement>(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useLayoutEffect(() => {
        if (!renderGroup.current) return;
        const first = renderGroup.current.firstChild;
        if (!first) return;
        const offsetRect = (first as SVGUseElement).getBBox();
        const size = getTexelSize(editor);
        const offsetX = (size.x - offsetRect.width) / 2;
        const offsetY = size.y + (size.y - offsetRect.height) / 2;
        setCharOffset((v) => {
            if (
                approximately(v.x, offsetX, 0.001) &&
                approximately(v.y, offsetY, 0.001)
            ) {
                return v;
            }
            return { x: offsetX, y: offsetY };
        });
    });

    const rootId = useUniqueSafeId("text") as string;
    const ids = new Map<string, string>();
    for (const char of textGrid.getChars()) {
        let id = rootId;
        for (let i = 0; i < char.length; i++) {
            id += `_${char.charCodeAt(i)}`;
        }
        ids.set(char, id);
    }

    const chars = [];
    const rawGrid = textGrid.getGrid();
    for (let y = 0; y < rawGrid.length; y++) {
        const row = rawGrid[y];
        if (!row) continue;

        for (let x = 0; x < row.length; x++) {
            const char = row[x];
            if (!char) continue;

            const textGlyphId = ids.get(char);
            assert(textGlyphId);
            chars.push(
                <use
                    key={`${x}_${y}`}
                    href={`#${textGlyphId}`}
                    x={txToPxWidth(editor, x + offset.x) + charOffset.x}
                    y={txToPxHeight(editor, y + offset.y) + charOffset.y}
                />,
            );
        }
    }

    return (
        <SVGContainer className="tx-grid">
            <defs>
                {Array.from(textGrid.getChars(), (char) => (
                    <text key={char} id={ids.get(char)} className="tx-mono">
                        {char}
                    </text>
                ))}
            </defs>
            <g ref={renderGroup}>{chars}</g>
        </SVGContainer>
    );
}

const isVecEqual = (a: Vec, b: Vec) => Vec.Equals(a, b);
