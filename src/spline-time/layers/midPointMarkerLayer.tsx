import { windows } from "@/lib/utils";
import { LineMarker } from "@/spline-time/guides";
import { LayerProps } from "@/spline-time/layers/Layer";

export function midPointMarkerLayer({ line, showExtras }: LayerProps) {
    if (!showExtras) return null;

    const midpoints = windows(line.points, 2).map(([p1, p2], i) => (
        <LineMarker key={i} from={p1} to={p2} progress={0.5} />
    ));

    return <>{midpoints}</>;
}
