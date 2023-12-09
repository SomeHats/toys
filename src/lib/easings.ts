import { approxEq } from "@/lib/utils";

type CubicBezier = `cubic-bezier(${number}, ${number}, ${number}, ${number})`;

/** n should be between 0 and 1 */
export type EasingFn = (n: number) => number;
/** n should be between 0 and 1 */
export type Easing = {
    (n: number): number;
    cubicBezier: CubicBezier;
};

// based on https://github.com/servo/servo/blob/0d0cfd030347ab0711b3c0607a9ee07ffe7124cf/components/style/bezier.rs
class UnitBezier {
    private static readonly NEWTON_METHOD_ITERATIONS = 8;
    private static readonly DEFAULT_EPSILON = 1e-6;
    private readonly ax: number;
    private readonly bx: number;
    private readonly cx: number;
    private readonly ay: number;
    private readonly by: number;
    private readonly cy: number;

    constructor(x1: number, y1: number, x2: number, y2: number) {
        const cx = 3 * x1;
        const bx = 3 * (x2 - x1) - cx;

        const cy = 3 * y1;
        const by = 3 * (y2 - y1) - cy;

        this.ax = 1.0 - cx - bx;
        this.bx = bx;
        this.cx = cx;
        this.ay = 1.0 - cy - by;
        this.by = by;
        this.cy = cy;
    }

    private sampleCurveX(t: number): number {
        return ((this.ax * t + this.bx) * t + this.cx) * t;
    }

    private sampleCurveY(t: number): number {
        return ((this.ay * t + this.by) * t + this.cy) * t;
    }

    private sampleCurveDerivativeX(t: number): number {
        return (3.0 * this.ax * t + 2.0 * this.bx) * t + this.cx;
    }

    private solveCurveX(x: number, epsilon: number): number {
        // Fast path: Use Newton's method.
        let t = x;
        for (let i = 0; i < UnitBezier.NEWTON_METHOD_ITERATIONS; i++) {
            const x2 = this.sampleCurveX(t);
            if (approxEq(x2, x, epsilon)) {
                return t;
            }
            const dx = this.sampleCurveDerivativeX(t);
            if (approxEq(dx, 0.0, 1e-6)) {
                break;
            }
            t -= (x2 - x) / dx;
        }

        // Slow path: Use bisection.
        let lo = 0;
        let hi = 1;
        t = x;

        if (t < lo) {
            return lo;
        }
        if (t > hi) {
            return hi;
        }

        while (lo < hi) {
            const x2 = this.sampleCurveX(t);
            if (approxEq(x2, x, epsilon)) {
                return t;
            }
            if (x > x2) {
                lo = t;
            } else {
                hi = t;
            }
            t = (hi - lo) / 2.0 + lo;
        }

        return t;
    }

    solve(x: number, epsilon: number = UnitBezier.DEFAULT_EPSILON): number {
        return this.sampleCurveY(this.solveCurveX(x, epsilon));
    }
}

export const cubicBezier = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
): Easing => {
    const bezier = new UnitBezier(x1, y1, x2, y2);
    const fn: Easing = (x: number) => bezier.solve(x);
    fn.cubicBezier = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
    return fn;
};

// https://gist.github.com/rezoner/713615dabedb59a15470
// http://gsgd.co.uk/sandbox/jquery/easing/
export const reverse =
    (easing: (n: number) => number) =>
    (n: number): number =>
        easing(1 - n);

export const linear: Easing = (n) => n;
linear.cubicBezier = "cubic-bezier(0.5, 0.5, 0.5, 0.5)";

export const inQuad: Easing = (t) => t * t;
inQuad.cubicBezier = "cubic-bezier(0.11, 0, 0.5, 0)";

export const outQuad: Easing = (t) => t * (2 - t);
outQuad.cubicBezier = "cubic-bezier(0.5, 1, 0.89, 1)";

export const inOutQuad: Easing = (t) =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
inOutQuad.cubicBezier = "cubic-bezier(0.45, 0, 0.55, 1)";

export const inCubic: Easing = (t) => t * t * t;
inCubic.cubicBezier = "cubic-bezier(0.32, 0, 0.67, 0)";

export const outCubic: Easing = (t) => --t * t * t + 1;
outCubic.cubicBezier = "cubic-bezier(0.33, 1, 0.68, 1)";

export const inOutCubic: Easing = (t) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
inOutCubic.cubicBezier = "cubic-bezier(0.65, 0, 0.35, 1)";

export const inQuart: Easing = (t) => t * t * t * t;
inQuart.cubicBezier = "cubic-bezier(0.5, 0, 0.75, 0)";

export const outQuart: Easing = (t) => 1 - --t * t * t * t;
outQuart.cubicBezier = "cubic-bezier(0.25, 1, 0.5, 1)";

export const inOutQuart: Easing = (t) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
inOutQuart.cubicBezier = "cubic-bezier(0.76, 0, 0.24, 1)";

export const inQuint: Easing = (t) => t * t * t * t * t;
inQuint.cubicBezier = "cubic-bezier(0.64, 0, 0.78, 0)";

export const outQuint: Easing = (t) => 1 + --t * t * t * t * t;
outQuint.cubicBezier = "cubic-bezier(0.22, 1, 0.36, 1)";

export const inOutQuint: Easing = (t) =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
inOutQuint.cubicBezier = "cubic-bezier(0.83, 0, 0.17, 1)";

export const inSin: Easing = (t) => -1 * Math.cos(t * Math.PI * 0.5) + 1;
inSin.cubicBezier = "cubic-bezier(0.12, 0, 0.39, 0)";

export const outSin: Easing = (t) => Math.sin(t * Math.PI * 0.5);
outSin.cubicBezier = "cubic-bezier(0.61, 1, 0.88, 1)";

export const inOutSin: Easing = (t) => (-1 / 2) * (Math.cos(Math.PI * t) - 1);
inOutSin.cubicBezier = "cubic-bezier(0.37, 0, 0.63, 1)";

export const inExpo: Easing = (t) => (t == 0 ? 0 : Math.pow(2, 10 * (t - 1)));
inExpo.cubicBezier = "cubic-bezier(0.7, 0, 0.84, 0)";

export const outExpo: Easing = (t) => (t == 1 ? 1 : -Math.pow(2, -10 * t) + 1);
outExpo.cubicBezier = "cubic-bezier(0.16, 1, 0.3, 1)";

export const inOutExpo: Easing = (t) => {
    if (t == 0) return 0;
    if (t == 1) return 1;
    if ((t /= 1 / 2) < 1) return (1 / 2) * Math.pow(2, 10 * (t - 1));
    return (1 / 2) * (-Math.pow(2, -10 * --t) + 2);
};
inOutExpo.cubicBezier = "cubic-bezier(0.87, 0, 0.13, 1)";

export const inCirc: Easing = (t) => -1 * (Math.sqrt(1 - t * t) - 1);
inCirc.cubicBezier = "cubic-bezier(0.55, 0, 1, 0.45)";

export const outCirc: Easing = (t) => Math.sqrt(1 - (t = t - 1) * t);
outCirc.cubicBezier = "cubic-bezier(0, 0.55, 0.45, 1)";

export const inOutCirc: Easing = (t) => {
    if ((t /= 1 / 2) < 1) return (-1 / 2) * (Math.sqrt(1 - t * t) - 1);
    return (1 / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1);
};
inOutCirc.cubicBezier = "cubic-bezier(0.85, 0, 0.15, 1)";

export const inElastic = (t: number): number => {
    let s = 1.70158;
    let p = 0;
    let a = 1;
    if (t == 0) return 0;
    if (t == 1) return 1;
    if (!p) p = 0.3;
    if (a < 1) {
        a = 1;
        s = p / 4;
    } else {
        s = (p / (2 * Math.PI)) * Math.asin(1 / a);
    }
    return -(
        a *
        Math.pow(2, 10 * (t -= 1)) *
        Math.sin(((t - s) * (2 * Math.PI)) / p)
    );
};

export const outElastic = (t: number): number => {
    let s = 1.70158;
    let p = 0;
    let a = 1;
    if (t == 0) return 0;
    if (t == 1) return 1;
    if (!p) p = 0.3;
    if (a < 1) {
        a = 1;
        s = p / 4;
    } else {
        s = (p / (2 * Math.PI)) * Math.asin(1 / a);
    }
    return (
        a * Math.pow(2, -10 * t) * Math.sin(((t - s) * (2 * Math.PI)) / p) + 1
    );
};

export const inOutElastic = (t: number): number => {
    let s = 1.70158;
    let p = 0;
    let a = 1;
    if (t == 0) return 0;
    if ((t /= 1 / 2) == 2) return 1;
    if (!p) p = 0.3 * 1.5;
    if (a < 1) {
        a = 1;
        s = p / 4;
    } else {
        s = (p / (2 * Math.PI)) * Math.asin(1 / a);
    }
    if (t < 1)
        return (
            -0.5 *
            (a *
                Math.pow(2, 10 * (t -= 1)) *
                Math.sin(((t - s) * (2 * Math.PI)) / p))
        );
    return (
        a *
            Math.pow(2, -10 * (t -= 1)) *
            Math.sin(((t - s) * (2 * Math.PI)) / p) *
            0.5 +
        1
    );
};

export const inBack =
    (s = 1.70158) =>
    (t: number): number => {
        return 1 * t * t * ((s + 1) * t - s);
    };

export const outBack =
    (s = 1.70158) =>
    (t: number): number => {
        t = t - 1;
        return 1 * (t * t * ((s + 1) * t + s) + 1);
    };

export const inOutBack =
    (s = 1.70158) =>
    (t: number): number => {
        if ((t /= 1 / 2) < 1)
            return (1 / 2) * (t * t * (((s *= 1.525) + 1) * t - s));
        return (1 / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2);
    };

export const inBounce = (t: number): number => {
    return 1 - outBounce(1 - t);
};

export const outBounce = (t: number): number => {
    if ((t /= 1) < 1 / 2.75) {
        return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
        return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
        return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
        return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
};

export const inOutBounce = (t: number): number => {
    if (t < 1 / 2) return inBounce(t * 2) * 0.5;
    return outBounce(t * 2 - 1) * 0.5 + 0.5;
};
