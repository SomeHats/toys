import { getTexelSize } from "@/txdraw/utils/texel";
import {
    modulate,
    suffixSafeId,
    TLGridProps,
    useEditor,
    useUniqueSafeId,
} from "tldraw";

export function Grid({ x, y, z }: TLGridProps) {
    const id = useUniqueSafeId("grid");
    const editor = useEditor();
    const { gridSteps } = editor.options;
    const size = getTexelSize(editor);
    return (
        <svg
            className="tl-grid"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <defs>
                {gridSteps.map(({ min, mid, step }, i) => {
                    const sx = step * z * size.x;
                    const sy = step * z * size.y;
                    const xo = 0.5 + x * z;
                    const yo = 0.5 + y * z;
                    const gxo = xo > 0 ? xo % sx : sx + (xo % sx);
                    const gyo = yo > 0 ? yo % sy : sy + (yo % sy);
                    const opacity =
                        z < mid ? modulate(z, [min, mid], [0, 1]) : 1;

                    return (
                        <pattern
                            key={i}
                            id={suffixSafeId(id, `${step}`)}
                            width={sx}
                            height={sy}
                            patternUnits="userSpaceOnUse"
                        >
                            <circle
                                className="tl-grid-dot"
                                cx={gxo}
                                cy={gyo}
                                r={1}
                                opacity={opacity}
                            />
                        </pattern>
                    );
                })}
            </defs>
            {gridSteps.map(({ step }, i) => (
                <rect
                    key={i}
                    width="100%"
                    height="100%"
                    fill={`url(#${id}_${step})`}
                />
            ))}
        </svg>
    );
}
