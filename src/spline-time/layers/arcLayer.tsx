import Circle from "@/lib/geom/Circle";
import CirclePathSegment from "@/lib/geom/CirclePathSegment";
import { Path } from "@/lib/geom/Path";
import { SvgPathBuilder } from "@/lib/svgPathBuilder";
import { FinalLine, LineMarker } from "@/spline-time/guides";
import { LayerProps, LayerUi } from "@/spline-time/layers/Layer";
import { Fragment, ReactNode } from "react";

export function arcLayer({ line, uiTarget, showExtras }: LayerProps) {
    const pathMarkers: Array<ReactNode> = [];

    const path = new SvgPathBuilder();
    switch (line.points.length) {
        case 0:
        case 1:
            return null;
        case 2: {
            path.moveTo(line.points[0]);
            path.lineTo(line.points[1]);
            break;
        }
        default: {
            path.moveTo(line.points[0]);
            let previousMidPoint = line.points[0].lerp(line.points[1], 0.5);
            path.lineTo(previousMidPoint);
            for (let i = 1; i < line.points.length - 1; i++) {
                const point = line.points[i];
                const nextPoint = line.points[i + 1];
                const nextMidPoint = point.lerp(nextPoint, 0.5);

                const previousMidPointDistance =
                    previousMidPoint.distanceTo(point);
                const nextMidPointDistance = nextMidPoint.distanceTo(point);
                const distanceForArc = Math.min(
                    previousMidPointDistance,
                    nextMidPointDistance,
                );

                const arcStartPoint = point.lerp(
                    previousMidPoint,
                    distanceForArc / previousMidPointDistance,
                );
                const arcEndPoint = point.lerp(
                    nextMidPoint,
                    distanceForArc / nextMidPointDistance,
                );

                pathMarkers.push(
                    <LineMarker
                        from={point}
                        to={previousMidPoint}
                        progress={distanceForArc / previousMidPointDistance}
                    />,
                );
                pathMarkers.push(
                    <LineMarker
                        from={point}
                        to={nextMidPoint}
                        progress={distanceForArc / nextMidPointDistance}
                    />,
                );

                path.lineTo(arcStartPoint);

                const pathSegment = Path.segmentAcrossCircle(
                    new Circle(point, distanceForArc),
                    arcStartPoint.angleTo(point),
                    point.angleTo(arcEndPoint),
                );
                if (pathSegment instanceof CirclePathSegment) {
                    path.lineTo(arcStartPoint);
                    path.arcTo(
                        pathSegment.circle.radius,
                        pathSegment.circle.radius,
                        0,
                        0,
                        pathSegment.isAnticlockwise ? 0 : 1,
                        arcEndPoint,
                    );
                } else {
                    path.lineTo(arcEndPoint);
                }

                previousMidPoint = nextMidPoint;
            }
            path.lineTo(line.points[line.points.length - 1]);
        }
    }

    return (
        <>
            {showExtras &&
                pathMarkers.map((d, i) => <Fragment key={i}>{d}</Fragment>)}
            <FinalLine path={path.toString()} />
            <LayerUi uiTarget={uiTarget} label={"arcs"} />
        </>
    );
}
