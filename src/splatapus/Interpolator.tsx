import { assert, fail } from "@/lib/assert";
import Vector2 from "@/lib/geom/Vector2";
import { lerp } from "@/lib/utils";
import { Tps } from "@/splatapus/ThinPlateSpline";

export interface Interpolator {
    interpolate(center: Vector2): number;
}

class NoneInterpolator implements Interpolator {
    interpolate(center: Vector2): number {
        fail("cannot interpolate none");
    }
}

class OneInterpolator implements Interpolator {
    private readonly value: number;
    constructor(value: number) {
        this.value = value;
    }
    interpolate(center: Vector2) {
        return this.value;
    }
}

class TwoInterpolator implements Interpolator {
    constructor(
        private readonly centerA: Vector2,
        private readonly centerB: Vector2,
        private readonly valueA: number,
        private readonly valueB: number,
    ) {}
    interpolate(center: Vector2): number {
        const AB = this.centerB.sub(this.centerA);
        const AV = center.sub(this.centerA);
        const distance = AV.dot(AB) / AB.dot(AB);
        return lerp(this.valueA, this.valueB, distance);
    }
}

class TpsInterpolator extends Tps implements Interpolator {
    constructor(centers: ReadonlyArray<Vector2>, values: ReadonlyArray<number>) {
        super(
            centers.map(({ x, y }) => [x, y]),
            values,
        );
    }
    interpolate(pnt: Vector2): number {
        return this.getValue([pnt.x, pnt.y]);
    }
}

export class AutoInterpolator implements Interpolator {
    private readonly interpolator: Interpolator;

    constructor(centers: ReadonlyArray<Vector2>, values: ReadonlyArray<number>) {
        assert(centers.length === values.length);
        switch (centers.length) {
            case 0:
                fail("cannot interpolate none");
                this.interpolator = new NoneInterpolator();
                break;
            case 1:
                this.interpolator = new OneInterpolator(values[0]);
                break;
            case 2:
                this.interpolator = new TwoInterpolator(
                    centers[0],
                    centers[1],
                    values[0],
                    values[1],
                );
                break;
            default:
                this.interpolator = new TpsInterpolator(centers, values);
        }
    }

    interpolate(center: Vector2): number {
        return this.interpolator.interpolate(center);
    }
}
