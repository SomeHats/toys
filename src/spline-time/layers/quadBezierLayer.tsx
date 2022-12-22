import { Vector2 } from "@/lib/geom/Vector2";
import { SvgPathBuilder } from "@/lib/svgPathBuilder";
import { BezierControlPoint, FinalLine } from "@/spline-time/guides";
import { LayerProps, LayerUi } from "@/spline-time/layers/Layer";
import { useState } from "react";

export function quadBezierLayer(props: LayerProps) {
    return <QuadBezierLayer {...props} />;
}
function QuadBezierLayer({ line, showExtras, uiTarget }: LayerProps) {
    const [slop, setSlop] = useState(0.333);
    const controlPoints: Array<{ target: Vector2; control: Vector2 }> = [];
    const path = new SvgPathBuilder();

    switch (line.points.length) {
        case 0:
        case 1:
            return null;
        case 2:
            path.moveTo(line.points[0]);
            path.lineTo(line.points[1]);
            break;
        default: {
            path.moveTo(line.points[0]);
            const controlPointDirection = line.points[2].sub(line.points[0]).normalize();
            let distance = line.points[0].distanceTo(line.points[1]);
            const controlPointRelative = controlPointDirection.scale(distance * slop);
            const controlPointBefore = line.points[1].sub(controlPointRelative);
            controlPoints.push({ target: line.points[1], control: controlPointBefore });
            path.quadraticCurveTo(controlPointBefore, line.points[1]);

            let prevControlPointDirection = controlPointDirection;
            for (let i = 1; i < line.points.length - 2; i++) {
                const controlPointDirection = line.points[i + 2].sub(line.points[i]).normalize();
                distance = line.points[i].distanceTo(line.points[i + 1]);
                const controlPointBefore = line.points[i].add(
                    prevControlPointDirection.scale(distance * slop),
                );
                const controlPointAfter = line.points[i + 1].sub(
                    controlPointDirection.scale(distance * slop),
                );
                controlPoints.push({ target: line.points[i], control: controlPointBefore });
                controlPoints.push({ target: line.points[i + 1], control: controlPointAfter });
                path.bezierCurveTo(controlPointBefore, controlPointAfter, line.points[i + 1]);
                prevControlPointDirection = controlPointDirection;
            }

            distance = line.points[line.points.length - 2].distanceTo(
                line.points[line.points.length - 1],
            );
            const controlPointAfter = line.points[line.points.length - 2].add(
                prevControlPointDirection.scale(distance * slop),
            );
            controlPoints.push({
                target: line.points[line.points.length - 2],
                control: controlPointAfter,
            });
            path.quadraticCurveTo(controlPointAfter, line.points[line.points.length - 1]);
            break;
        }
    }

    return (
        <>
            {showExtras &&
                controlPoints.map(({ target, control }, i) => (
                    <BezierControlPoint target={target} control={control} key={i} />
                ))}
            <FinalLine path={path.toString()} />
            <LayerUi label="naive tangents" uiTarget={uiTarget}>
                slop:
                <input
                    type="range"
                    value={slop}
                    onChange={(e) => setSlop(e.currentTarget.valueAsNumber)}
                    min={0}
                    max={1}
                    step={0.001}
                />
                <span className="tabular-nums">{slop.toFixed(2)}</span>
            </LayerUi>
        </>
    );
}
