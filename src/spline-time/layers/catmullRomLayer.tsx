import { Vector2 } from "@/lib/geom/Vector2";
import { SvgPathBuilder } from "@/lib/svgPathBuilder";
import { BezierControlPoint, FinalLine } from "@/spline-time/guides";
import { LayerProps, LayerUi } from "@/spline-time/layers/Layer";
import { useState } from "react";

export function catmullRomLayer(props: LayerProps) {
    return <CatmullRomLayer {...props} />;
}
function CatmullRomLayer({ line, showExtras, uiTarget }: LayerProps) {
    const [alpha, setAlpha] = useState(0.5);

    if (line.points.length < 2) {
        return null;
    }

    const controlPoints: Array<{ target: Vector2; control: Vector2 }> = [];
    const path = new SvgPathBuilder();

    path.moveTo(line.points[0]);

    for (let i = 0; i < line.points.length - 1; i++) {
        const p0 = i == 0 ? line.points[0] : line.points[i - 1];
        const p1 = line.points[i];
        const p2 = line.points[i + 1];
        const p3 = i + 2 < line.points.length ? line.points[i + 2] : p2;

        const d1 = Math.sqrt(
            Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y, 2),
        );
        const d2 = Math.sqrt(
            Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2),
        );
        const d3 = Math.sqrt(
            Math.pow(p2.x - p3.x, 2) + Math.pow(p2.y - p3.y, 2),
        );

        // Catmull-Rom to Cubic Bezier conversion matrix

        // A = 2d1^2a + 3d1^a * d2^a + d3^2a
        // B = 2d3^2a + 3d3^a * d2^a + d2^2a

        // [   0             1            0          0          ]
        // [   -d2^2a /N     A/N          d1^2a /N   0          ]
        // [   0             d3^2a /M     B/M        -d2^2a /M  ]
        // [   0             0            1          0          ]

        const d3powA = Math.pow(d3, alpha);
        const d3pow2A = Math.pow(d3, 2 * alpha);
        const d2powA = Math.pow(d2, alpha);
        const d2pow2A = Math.pow(d2, 2 * alpha);
        const d1powA = Math.pow(d1, alpha);
        const d1pow2A = Math.pow(d1, 2 * alpha);

        const A = 2 * d1pow2A + 3 * d1powA * d2powA + d2pow2A;
        const B = 2 * d3pow2A + 3 * d3powA * d2powA + d2pow2A;
        let N = 3 * d1powA * (d1powA + d2powA);
        if (N > 0) {
            N = 1 / N;
        }
        let M = 3 * d3powA * (d3powA + d2powA);
        if (M > 0) {
            M = 1 / M;
        }

        let bp1 = new Vector2(
            (-d2pow2A * p0.x + A * p1.x + d1pow2A * p2.x) * N,
            (-d2pow2A * p0.y + A * p1.y + d1pow2A * p2.y) * N,
        );

        let bp2 = new Vector2(
            (d3pow2A * p1.x + B * p2.x - d2pow2A * p3.x) * M,
            (d3pow2A * p1.y + B * p2.y - d2pow2A * p3.y) * M,
        );

        if (bp1.x == 0 && bp1.y == 0) {
            bp1 = p1;
        }
        if (bp2.x == 0 && bp2.y == 0) {
            bp2 = p2;
        }

        controlPoints.push({ target: p1, control: bp1 });
        controlPoints.push({ target: p2, control: bp2 });
        path.bezierCurveTo(bp1, bp2, p2);
    }

    return (
        <>
            {showExtras &&
                controlPoints.map(({ target, control }, i) => (
                    <BezierControlPoint
                        target={target}
                        control={control}
                        key={i}
                    />
                ))}
            <FinalLine path={path.toString()} />
            <LayerUi label="catmull-rom" uiTarget={uiTarget}>
                alpha:
                <input
                    type="range"
                    value={alpha}
                    onChange={(e) => setAlpha(e.currentTarget.valueAsNumber)}
                    min={0.001}
                    max={1}
                    step={0.001}
                />
                <span className="tabular-nums">{alpha.toFixed(2)}</span>
            </LayerUi>
        </>
    );
}
