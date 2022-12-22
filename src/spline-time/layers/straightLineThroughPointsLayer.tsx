/* eslint-disable react/display-name */
import { SvgPathBuilder } from "@/lib/svgPathBuilder";
import { windows } from "@/lib/utils";
import { DottedGuideLine, FinalLine } from "@/spline-time/guides";
import { LayerProps } from "@/spline-time/layers/Layer";

export function straightLineThroughPointsLayer({ style }: { style: "final" | "dotted" }) {
    if (style === "final") {
        return ({ line }: LayerProps) => {
            if (!line.points.length) {
                return null;
            }
            const path = new SvgPathBuilder();
            path.moveTo(line.points[0]);
            for (let i = 1; i < line.points.length; i++) {
                path.lineTo(line.points[i]);
            }
            return <FinalLine path={path.toString()} />;
        };
    }

    return ({ line }: LayerProps) => {
        const segments = windows(line.points, 2).map(([from, to], i) => (
            <DottedGuideLine key={i} from={from} to={to} />
        ));

        return <>{segments}</>;
    };
}
