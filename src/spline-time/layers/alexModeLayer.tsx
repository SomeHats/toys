import { assert } from "@/lib/assert";
import { Vector2 } from "@/lib/geom/Vector2";
import { SvgPathBuilder } from "@/lib/svgPathBuilder";
import { invLerp } from "@/lib/utils";
import { BezierControlPoint, DottedGuideLine, FinalLine } from "@/spline-time/guides";
import { LayerProps, LayerUi } from "@/spline-time/layers/Layer";
import { Fragment, ReactNode, useState } from "react";

export function alexModeLayer(props: LayerProps) {
    return <AlexModeLayer {...props} />;
}
function AlexModeLayer({ line, showExtras, uiTarget }: LayerProps) {
    const [slop, setSlop] = useState(0.333);
    const controlPoints: Array<{ target: Vector2; control: Vector2 }> = [];
    const debug: Array<ReactNode> = [];
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

            let previousControlPointDirection = null;
            for (let i = 0; i < line.points.length - 1; i++) {
                const fromPoint = line.points[i];
                const toPoint = line.points[i + 1];
                const nextPoint = line.points[i + 2];
                const distance = fromPoint.distanceTo(toPoint);

                let controlPointBefore;
                if (previousControlPointDirection) {
                    controlPointBefore = fromPoint.add(
                        previousControlPointDirection.scale(distance * slop),
                    );
                    controlPoints.push({ target: fromPoint, control: controlPointBefore });
                }

                if (nextPoint) {
                    const nextDistance = toPoint.distanceTo(nextPoint);
                    const joinedDistance = distance + nextDistance;
                    const referencePointOnSkipLine = fromPoint.lerp(
                        nextPoint,
                        distance / joinedDistance,
                    );
                    const isLeft =
                        (nextPoint.x - fromPoint.x) * (toPoint.y - fromPoint.y) -
                            (nextPoint.y - fromPoint.y) * (toPoint.x - fromPoint.x) >
                        0;

                    debug.push(<DottedGuideLine from={fromPoint} to={nextPoint} />);
                    debug.push(<DottedGuideLine from={referencePointOnSkipLine} to={toPoint} />);

                    // const controlPointDirection = nextPoint.sub(fromPoint).normalize();
                    let controlPointDirection = toPoint
                        .sub(referencePointOnSkipLine)
                        .normalize()
                        .perpendicular();
                    if (!isLeft) {
                        controlPointDirection = controlPointDirection.scale(-1);
                    }
                    const controlPointAfter = toPoint.sub(
                        controlPointDirection.scale(distance * slop),
                    );
                    controlPoints.push({ target: toPoint, control: controlPointAfter });
                    if (controlPointBefore) {
                        path.bezierCurveTo(controlPointBefore, controlPointAfter, toPoint);
                    } else {
                        path.quadraticCurveTo(controlPointAfter, toPoint);
                    }
                    previousControlPointDirection = controlPointDirection;
                } else {
                    assert(controlPointBefore);
                    path.quadraticCurveTo(controlPointBefore, toPoint);
                }
            }
        }

        // default: {
        //     path.moveTo(line.points[0]);
        //     const controlPointDirection = line.points[2].sub(line.points[0]).normalize();
        //     let distance = line.points[0].distanceTo(line.points[1]);

        //     const controlPointAfter = line.points[1].sub(
        //         controlPointDirection.scale(distance * slop),
        //     );
        //     controlPoints.push({ target: line.points[1], control: controlPointAfter });
        //     path.quadraticCurveTo(controlPointAfter, line.points[1]);

        //     let prevControlPointDirection = controlPointDirection;
        //     for (let i = 1; i < line.points.length - 2; i++) {
        //         const controlPointDirection = line.points[i + 2].sub(line.points[i]).normalize();
        //         distance = line.points[i].distanceTo(line.points[i + 1]);

        //         const controlPointBefore = line.points[i].add(
        //             prevControlPointDirection.scale(distance * slop),
        //         );
        //         const controlPointAfter = line.points[i + 1].sub(
        //             controlPointDirection.scale(distance * slop),
        //         );
        //         controlPoints.push({ target: line.points[i], control: controlPointBefore });
        //         controlPoints.push({ target: line.points[i + 1], control: controlPointAfter });
        //         path.bezierCurveTo(controlPointBefore, controlPointAfter, line.points[i + 1]);
        //         prevControlPointDirection = controlPointDirection;
        //     }

        //     distance = line.points[line.points.length - 2].distanceTo(
        //         line.points[line.points.length - 1],
        //     );
        //     const finalControlPoint = line.points[line.points.length - 2].add(
        //         prevControlPointDirection.scale(distance * slop),
        //     );
        //     controlPoints.push({
        //         target: line.points[line.points.length - 2],
        //         control: finalControlPoint,
        //     });
        //     path.quadraticCurveTo(finalControlPoint, line.points[line.points.length - 1]);
        //     break;
        // }
    }

    return (
        <>
            {showExtras &&
                controlPoints.map(({ target, control }, i) => (
                    <BezierControlPoint target={target} control={control} key={i} />
                ))}
            {showExtras && debug.map((d, i) => <Fragment key={i}>{d}</Fragment>)}
            <FinalLine path={path.toString()} />
            <LayerUi label="alex mode" uiTarget={uiTarget}>
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
