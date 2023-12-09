import { SvgPathBuilder } from "@/lib/svgPathBuilder";
import { FinalLine } from "@/spline-time/guides";
import { LayerProps, LayerUi } from "@/spline-time/layers/Layer";

export function midPointBezierLayer({ line, uiTarget }: LayerProps) {
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
        default:
            path.moveTo(line.points[0]);
            path.lineTo(line.points[0].lerp(line.points[1], 0.5));
            for (let i = 1; i < line.points.length - 1; i++) {
                path.quadraticCurveTo(
                    line.points[i],
                    line.points[i].lerp(line.points[i + 1], 0.5),
                );
            }
            path.lineTo(line.points[line.points.length - 1]);
    }

    return (
        <>
            <FinalLine path={path.toString()} />
            <LayerUi uiTarget={uiTarget} label={"midpoint quadratic"} />
        </>
    );
}
