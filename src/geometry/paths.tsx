import { Vector2 } from "@/lib/geom/Vector2";
import { SvgPathBuilder } from "@/lib/svgPathBuilder";

export const paths = {
    x(position: Vector2, size = 5) {
        const path = new SvgPathBuilder()
            .moveTo(position.add(size, size))
            .lineTo(position.add(-size, -size))
            .moveTo(position.add(-size, size))
            .lineTo(position.add(size, -size));

        return path.toString();
    },
};
