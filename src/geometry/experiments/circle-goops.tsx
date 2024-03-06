import { GeoCircle, GeometryExperiment } from "@/geometry/GeometryExperiment";
import { paths } from "@/geometry/paths";
import { inOutSin } from "@/lib/easings";
import { Vector2 } from "@/lib/geom/Vector2";
import { SvgPathBuilder } from "@/lib/svgPathBuilder";
import { tailwindColors } from "@/lib/theme";
import { clamp01, lerp } from "@/lib/utils";
import { DottedGuideLine } from "@/spline-time/guides";
import { track } from "@tldraw/state";
import { Fragment, useState } from "react";

export const name = "Circle goops";

export default track(function CircleGoops({ size }: { size: Vector2 }) {
    const [things] = useState({
        a: new GeoCircle({
            x: 400,
            y: 400,
            r: 100,
            color: tailwindColors.fuchsia300,
        }),
        b: new GeoCircle({
            x: 600,
            y: 600,
            r: 50,
            color: tailwindColors.fuchsia300,
        }),
        // c: new GeoPoint({
        //     x: 400,
        //     y: 600,
        // }),
    });
    const { a, b } = things;

    const aToB = b.circle.center.sub(a.circle.center);
    const aEdge = a.circle.center.add(aToB.withMagnitude(a.circle.radius));
    const bEdge = b.circle.center.sub(aToB.withMagnitude(b.circle.radius));

    // const r = a.circle.center.distanceTo(c.point) - a.circle.radius;

    const r1 = aToB.magnitude() + a.circle.radius + b.circle.radius;
    const r2 =
        aToB.magnitude() ** 2 / (a.circle.radius + b.circle.radius) / Math.PI;
    const rRaw = lerp(
        r1,
        r2,
        inOutSin(
            clamp01(
                (aToB.magnitude() - (a.circle.radius + b.circle.radius)) /
                    ((a.circle.radius + b.circle.radius) * 1),
            ),
        ),
    );
    const r = rRaw; // useSpring({ target: rRaw, tension: 150 });

    const goopArcCenters = a.circle
        .withRadius(r + a.circle.radius)
        .intersectWithCircle(b.circle.withRadius(r + b.circle.radius));

    const fullPath = (() => {
        if (!goopArcCenters || goopArcCenters.length !== 2) return null;

        const goop1 = {
            center: goopArcCenters[0],
            startPoint: a.circle.center
                .sub(goopArcCenters[0])
                .withMagnitude(r)
                .add(goopArcCenters[0]),
            endPoint: b.circle.center
                .sub(goopArcCenters[0])
                .withMagnitude(r)
                .add(goopArcCenters[0]),
        };

        const goop2 = {
            center: goopArcCenters[1],
            startPoint: a.circle.center
                .sub(goopArcCenters[1])
                .withMagnitude(r)
                .add(goopArcCenters[1]),
            endPoint: b.circle.center
                .sub(goopArcCenters[1])
                .withMagnitude(r)
                .add(goopArcCenters[1]),
        };

        const path = new SvgPathBuilder()
            .moveTo(goop1.startPoint)
            .counterClockwiseArcTo(goop1.center, goop1.endPoint)
            .clockwiseArcTo(b.circle.center, goop2.endPoint)
            .counterClockwiseArcTo(goop2.center, goop2.startPoint)
            .clockwiseArcTo(a.circle.center, goop1.startPoint);

        return path.toString();
    })();

    return (
        <GeometryExperiment
            shapes={things}
            size={size}
            above={
                fullPath && (
                    <path
                        d={fullPath}
                        stroke={tailwindColors.fuchsia500}
                        strokeWidth={3}
                        fill="none"
                    />
                )
            }
            below={
                <>
                    <DottedGuideLine from={aEdge} to={bEdge} />
                    <circle
                        cx={a.circle.center.x}
                        cy={a.circle.center.y}
                        r={r + a.circle.radius}
                        fill="none"
                        strokeWidth={2}
                        strokeDasharray="0 4"
                        stroke={tailwindColors.purple300}
                    />
                    <circle
                        cx={b.circle.center.x}
                        cy={b.circle.center.y}
                        r={r + b.circle.radius}
                        fill="none"
                        strokeWidth={2}
                        strokeDasharray="0 4"
                        stroke={tailwindColors.purple300}
                    />
                    {goopArcCenters?.map((p, i) => (
                        <Fragment key={i}>
                            <path
                                key={i}
                                d={paths.x(p)}
                                strokeWidth={2}
                                stroke={
                                    i === 0 ?
                                        tailwindColors.amber500
                                    :   tailwindColors.green500
                                }
                            />
                            <circle
                                cx={p.x}
                                cy={p.y}
                                r={r}
                                fill="none"
                                strokeWidth={2}
                                stroke={
                                    i === 0 ?
                                        tailwindColors.amber300
                                    :   tailwindColors.green300
                                }
                                strokeDasharray={"0 4"}
                            />
                        </Fragment>
                    ))}
                </>
            }
        />
    );
});
