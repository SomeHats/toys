/*
MIT License

Copyright (c) 2021 Stephen Ruiz Ltd

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
associated documentation files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute,
sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES
OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import Vector2 from "@/lib/geom/Vector2";

const { min, PI } = Math;

// This is the rate of change for simulated pressure. It could be an option.
const RATE_OF_PRESSURE_CHANGE = 0.275;

// Browser strokes seem to be off if PI is regular, a tiny offset seems to fix it
const FIXED_PI = PI + 0.0001;

/**
 * The options object for `getStroke` or `getStrokePoints`.
 * @param points An array of points (as `[x, y, pressure]` or `{x, y, pressure}`). Pressure is optional in both cases.
 * @param options (optional) An object with options.
 * @param options.size	The base size (diameter) of the stroke.
 * @param options.thinning The effect of pressure on the stroke's size.
 * @param options.smoothing	How much to soften the stroke's edges.
 * @param options.easing	An easing function to apply to each point's pressure.
 * @param options.simulatePressure Whether to simulate pressure based on velocity.
 * @param options.start Cap, taper and easing for the start of the line.
 * @param options.end Cap, taper and easing for the end of the line.
 * @param options.last Whether to handle the points as a completed stroke.
 */
export interface StrokeOptions {
    size?: number;
    thinning?: number;
    smoothing?: number;
    streamline?: number;
    easing?: (pressure: number) => number;
    simulatePressure?: boolean;
    start?: {
        cap?: boolean;
        taper?: number | boolean;
        easing?: (distance: number) => number;
    };
    end?: {
        cap?: boolean;
        taper?: number | boolean;
        easing?: (distance: number) => number;
    };
    // Whether to handle the points as a completed stroke.
    last?: boolean;
}

/**
 * The points returned by `getStrokePoints`, and the input for `getStrokeOutlinePoints`.
 */
export interface StrokePoint {
    point: Vector2;
    pressure: number;
    distance: number;
    vector: Vector2;
    runningLength: number;
}

export interface StrokeCenterPoint {
    center: Vector2;
    radius: number;
}

/**
 * ## getStroke
 * @description Get an array of points describing a polygon that surrounds the input points.
 * @param points An array of points (as `[x, y, pressure]` or `{x, y, pressure}`). Pressure is optional in both cases.
 * @param options (optional) An object with options.
 * @param options.size	The base size (diameter) of the stroke.
 * @param options.thinning The effect of pressure on the stroke's size.
 * @param options.smoothing	How much to soften the stroke's edges.
 * @param options.easing	An easing function to apply to each point's pressure.
 * @param options.simulatePressure Whether to simulate pressure based on velocity.
 * @param options.start Cap, taper and easing for the start of the line.
 * @param options.end Cap, taper and easing for the end of the line.
 * @param options.last Whether to handle the points as a completed stroke.
 */
export function getStroke(
    points: (Vector2 | { x: number; y: number; pressure?: number })[],
    options: StrokeOptions = {} as StrokeOptions,
): Vector2[] {
    return getStrokeOutlinePoints(getStrokePoints(points, options), options);
}

/**
 * ## getStrokeOutlinePoints
 * @description Get an array of points (as `[x, y]`) representing the outline of a stroke.
 * @param points An array of StrokePoints as returned from `getStrokePoints`.
 * @param options (optional) An object with options.
 * @param options.size	The base size (diameter) of the stroke.
 * @param options.thinning The effect of pressure on the stroke's size.
 * @param options.smoothing	How much to soften the stroke's edges.
 * @param options.easing	An easing function to apply to each point's pressure.
 * @param options.simulatePressure Whether to simulate pressure based on velocity.
 * @param options.start Cap, taper and easing for the start of the line.
 * @param options.end Cap, taper and easing for the end of the line.
 * @param options.last Whether to handle the points as a completed stroke.
 */
export function getStrokeOutlinePoints(
    points: StrokePoint[],
    options: Partial<StrokeOptions> = {} as Partial<StrokeOptions>,
): Vector2[] {
    const {
        size = 16,
        smoothing = 0.5,
        thinning = 0.5,
        simulatePressure = true,
        easing = (t) => t,
        start = {},
        end = {},
        last: isComplete = false,
    } = options;

    const { cap: capStart = true, easing: taperStartEase = (t) => t * (2 - t) } = start;

    const { cap: capEnd = true, easing: taperEndEase = (t) => --t * t * t + 1 } = end;

    // We can't do anything with an empty array or a stroke with negative size.
    if (points.length === 0 || size <= 0) {
        return [];
    }

    // The total length of the line
    const totalLength = points[points.length - 1].runningLength;

    const taperStart =
        start.taper === false
            ? 0
            : start.taper === true
            ? Math.max(size, totalLength)
            : (start.taper as number);

    const taperEnd =
        end.taper === false
            ? 0
            : end.taper === true
            ? Math.max(size, totalLength)
            : (end.taper as number);

    // The minimum allowed distance between points (squared)
    const minDistance = Math.pow(size * smoothing, 2);

    // Our collected left and right points
    const leftPts: Vector2[] = [];
    const rightPts: Vector2[] = [];

    // Previous pressure (start with average of first five pressures,
    // in order to prevent fat starts for every line. Drawn lines
    // almost always start slow!
    let prevPressure = points.slice(0, 10).reduce((acc, curr) => {
        let pressure = curr.pressure;

        if (simulatePressure) {
            // Speed of change - how fast should the the pressure changing?
            const sp = min(1, curr.distance / size);
            // Rate of change - how much of a change is there?
            const rp = min(1, 1 - sp);
            // Accelerate the pressure
            pressure = min(1, acc + (rp - acc) * (sp * RATE_OF_PRESSURE_CHANGE));
        }

        return (acc + pressure) / 2;
    }, points[0].pressure);

    // The current radius
    let radius = getStrokeRadius(size, thinning, points[points.length - 1].pressure, easing);

    // The radius of the first saved point
    let firstRadius: number | undefined = undefined;

    // Previous vector
    // let prevVector = points[0].vector;

    // Previous left and right points
    let pl = points[0].point;
    let pr = pl;

    // Temporary left and right points
    let tl = pl;
    let tr = pr;

    // let short = true

    /*
        Find the outline's left and right points. Iterating through the points
        and populate the rightPts and leftPts arrays, skipping the first and
        last points, which will get caps later on.
    */

    for (let i = 0; i < points.length; i++) {
        let { pressure } = points[i];
        const { point, vector, distance, runningLength } = points[i];

        // Removes noise from the end of the line
        if (i < points.length - 1 && totalLength - runningLength < 3) {
            continue;
        }

        /*
            Calculate the radius. If not thinning, the current point's radius
            will be half the size; or otherwise, the size will be based on the
            current (real or simulated) pressure. 
        */

        if (thinning) {
            if (simulatePressure) {
                // If we're simulating pressure, then do so based on the distance
                // between the current point and the previous point, and the size
                // of the stroke. Otherwise, use the input pressure.
                const sp = min(1, distance / size);
                const rp = min(1, 1 - sp);
                pressure = min(
                    1,
                    prevPressure + (rp - prevPressure) * (sp * RATE_OF_PRESSURE_CHANGE),
                );
            }

            radius = getStrokeRadius(size, thinning, pressure, easing);
        } else {
            radius = size / 2;
        }

        if (firstRadius === undefined) {
            firstRadius = radius;
        }

        /*
            Apply tapering. If the current length is within the taper distance
            at either the start or the end, calculate the taper strengths. Apply
            the smaller of the two taper strengths to the radius.
        */

        const ts = runningLength < taperStart ? taperStartEase(runningLength / taperStart) : 1;

        const te =
            totalLength - runningLength < taperEnd
                ? taperEndEase((totalLength - runningLength) / taperEnd)
                : 1;

        radius = Math.max(0.01, radius * Math.min(ts, te));

        /* Add points to left and right */

        // Handle the last point
        if (i === points.length - 1) {
            const offset = vector.perpendicular().scale(radius);
            leftPts.push(point.sub(offset));
            rightPts.push(point.add(offset));
            continue;
        }

        const nextVector = points[i + 1].vector;

        const nextDpr = vector.dot(nextVector);

        /*
            Handle sharp corners. Find the difference (dot product) between the
            current and next vector. If the next vector is at more than a right
            angle to the current vector, draw a cap at the current point.
        */

        if (nextDpr < 0) {
            // It's a sharp corner. Draw a rounded cap and move on to the next
            // point Considering saving these and drawing them later? So that we
            // can avoid crossing future points.

            const offset = vector.perpendicular().scale(radius);

            for (let step = 1 / 13, t = 0; t <= 1; t += step) {
                tl = point.sub(offset).rotateAround(point, FIXED_PI * t);
                leftPts.push(tl);

                tr = point.add(offset).rotateAround(point, FIXED_PI * -t);
                rightPts.push(tr);
            }

            pl = tl;
            pr = tr;

            continue;
        }

        /* 
            Add regular points. Project points to either side of the current
            point, using the calculated size as a distance. If a point's
            distance to the previous point on that side greater than the minimum
            distance (or if the corner is kinda sharp), add the points to the
            side's points array.
        */

        const offset = nextVector.lerp(vector, nextDpr).perpendicular().scale(radius);

        tl = point.sub(offset);

        if (i <= 1 || pl.distanceToSq(tl)) {
            leftPts.push(tl);
            pl = tl;
        }

        tr = point.add(offset);

        if (i <= 1 || pr.distanceToSq(tr) > minDistance) {
            rightPts.push(tr);
            pr = tr;
        }

        // Set variables for next iteration
        prevPressure = pressure;
        // prevVector = vector;
    }

    /*
        Drawing caps. Now that we have our points on either side of the line, we
        need to draw caps at the start and end. Tapered lines don't have caps,
        but may have dots for very short lines.
    */

    const firstPoint = points[0].point;

    const lastPoint =
        points.length > 1 ? points[points.length - 1].point : firstPoint.add(Vector2.UNIT);

    const startCap: Vector2[] = [];

    const endCap: Vector2[] = [];

    /* 
        Draw a dot for very short or completed strokes. If the line is too short
        to gather left or right points and if the line is not tapered on either
        side, draw a dot. If the line is tapered, then only draw a dot if the
        line is both very short and complete. If we draw a dot, we can just
        return those points.
    */

    if (points.length === 1) {
        if (!(taperStart || taperEnd) || isComplete) {
            const start = firstPoint.project(
                firstPoint.sub(lastPoint).perpendicular().normalize(),
                -(firstRadius || radius),
            );
            const dotPts: Vector2[] = [];
            for (let step = 1 / 13, t = step; t <= 1; t += step) {
                dotPts.push(start.rotateAround(firstPoint, FIXED_PI * 2 * t));
            }
            return dotPts;
        }
    } else {
        /*
            Draw a start cap Unless the line has a tapered start, or unless the line
            has a tapered end and the line is very short, draw a start cap around
            the first point. Use the distance between the second left and right
            point for the cap's radius. Finally remove the first left and right
            points. :psyduck:
        */

        if (taperStart || (taperEnd && points.length === 1)) {
            // The start point is tapered, noop
        } else if (capStart) {
            // Draw the round cap - add thirteen points rotating the right point around the start point to the left point
            for (let step = 1 / 13, t = step; t <= 1; t += step) {
                const pt = rightPts[0].rotateAround(firstPoint, FIXED_PI * t);
                startCap.push(pt);
            }
        } else {
            // Draw the flat cap - add a point to the left and right of the start point
            const cornersVector = leftPts[0].sub(rightPts[0]);
            const offsetA = cornersVector.scale(0.5);
            const offsetB = cornersVector.scale(0.51);

            startCap.push(
                firstPoint.sub(offsetA),
                firstPoint.sub(offsetB),
                firstPoint.add(offsetB),
                firstPoint.add(offsetA),
            );
        }

        /*
            Draw an end cap. If the line does not have a tapered end, and unless
            the line has a tapered start and the line is very short, draw a cap
            around the last point. Finally, remove the last left and right
            points. Otherwise, add the last point. Note that This cap is a
            full-turn-and-a-half: this prevents incorrect caps on sharp end
            turns.
        */

        const direction = points[points.length - 1].vector.negate().perpendicular();

        if (taperEnd || (taperStart && points.length === 1)) {
            // Tapered end - push the last point to the line
            endCap.push(lastPoint);
        } else if (capEnd) {
            // Draw the round end cap
            const start = lastPoint.project(direction, radius);
            for (let step = 1 / 29, t = step; t < 1; t += step) {
                endCap.push(start.rotateAround(lastPoint, FIXED_PI * 3 * t));
            }
        } else {
            // Draw the flat end cap

            endCap.push(
                lastPoint.add(direction.scale(radius)),
                lastPoint.add(direction.scale(radius * 0.99)),
                lastPoint.sub(direction.scale(radius * 0.99)),
                lastPoint.sub(direction.scale(radius)),
            );
        }
    }

    /*
        Return the points in the correct winding order: begin on the left side,
        then continue around the end cap, then come back along the right side,
        and finally complete the start cap.
    */

    return leftPts.concat(endCap, rightPts.reverse(), startCap);
}

/**
 * ## getStrokeOutlinePoints
 * @description Get an array of points (as `[x, y]`) representing the outline of a stroke.
 * @param points An array of StrokePoints as returned from `getStrokePoints`.
 * @param options (optional) An object with options.
 * @param options.size	The base size (diameter) of the stroke.
 * @param options.thinning The effect of pressure on the stroke's size.
 * @param options.smoothing	How much to soften the stroke's edges.
 * @param options.easing	An easing function to apply to each point's pressure.
 * @param options.simulatePressure Whether to simulate pressure based on velocity.
 * @param options.start Cap, taper and easing for the start of the line.
 * @param options.end Cap, taper and easing for the end of the line.
 * @param options.last Whether to handle the points as a completed stroke.
 */
export function getStrokeCenterPoints(
    points: StrokePoint[],
    options: Partial<StrokeOptions> = {} as Partial<StrokeOptions>,
): StrokeCenterPoint[] {
    const {
        size = 16,
        smoothing = 0.5,
        thinning = 0.5,
        simulatePressure = true,
        easing = (t) => t,
        start = {},
        end = {},
        // last: isComplete = false,
    } = options;

    const {
        // cap: capStart = true,
        easing: taperStartEase = (t) => t * (2 - t),
    } = start;

    const {
        // cap: capEnd = true,
        easing: taperEndEase = (t) => --t * t * t + 1,
    } = end;

    // We can't do anything with an empty array or a stroke with negative size.
    if (points.length === 0 || size <= 0) {
        return [];
    }

    // The total length of the line
    const totalLength = points[points.length - 1].runningLength;

    const taperStart =
        start.taper === false
            ? 0
            : start.taper === true
            ? Math.max(size, totalLength)
            : (start.taper as number);

    const taperEnd =
        end.taper === false
            ? 0
            : end.taper === true
            ? Math.max(size, totalLength)
            : (end.taper as number);

    // The minimum allowed distance between points (squared)
    const minDistance = Math.pow(size * smoothing, 2);

    // Our collected left and right points
    // const leftPts: Vector2[] = [];
    // const rightPts: Vector2[] = [];
    const centerPts: StrokeCenterPoint[] = [];

    // Previous pressure (start with average of first five pressures,
    // in order to prevent fat starts for every line. Drawn lines
    // almost always start slow!
    let prevPressure = points.slice(0, 10).reduce((acc, curr) => {
        let pressure = curr.pressure;

        if (simulatePressure) {
            // Speed of change - how fast should the the pressure changing?
            const sp = min(1, curr.distance / size);
            // Rate of change - how much of a change is there?
            const rp = min(1, 1 - sp);
            // Accelerate the pressure
            pressure = min(1, acc + (rp - acc) * (sp * RATE_OF_PRESSURE_CHANGE));
        }

        return (acc + pressure) / 2;
    }, points[0].pressure);

    // The current radius
    let radius = getStrokeRadius(size, thinning, points[points.length - 1].pressure, easing);

    // The radius of the first saved point
    let firstRadius: number | undefined = undefined;

    // Previous vector
    // let prevVector = points[0].vector;

    // Previous left and right points
    // let pl = points[0].point;
    // let pr = pl;

    // Temporary left and right points
    // let tl = pl;
    // let tr = pr;
    /** previous center point */
    let pc = points[0].point;
    /** temporary center point */
    let tc = pc;

    // let short = true

    /*
        Find the outline's left and right points. Iterating through the points
        and populate the rightPts and leftPts arrays, skipping the first and
        last points, which will get caps later on.
    */

    for (let i = 0; i < points.length; i++) {
        let { pressure } = points[i];
        const {
            point,
            // vector,
            distance,
            runningLength,
        } = points[i];

        // Removes noise from the end of the line
        if (i < points.length - 1 && totalLength - runningLength < 3) {
            continue;
        }

        /*
            Calculate the radius. If not thinning, the current point's radius
            will be half the size; or otherwise, the size will be based on the
            current (real or simulated) pressure. 
        */

        if (thinning) {
            if (simulatePressure) {
                // If we're simulating pressure, then do so based on the distance
                // between the current point and the previous point, and the size
                // of the stroke. Otherwise, use the input pressure.
                const sp = min(1, distance / size);
                const rp = min(1, 1 - sp);
                pressure = min(
                    1,
                    prevPressure + (rp - prevPressure) * (sp * RATE_OF_PRESSURE_CHANGE),
                );
            }

            radius = getStrokeRadius(size, thinning, pressure, easing);
        } else {
            radius = size / 2;
        }

        if (firstRadius === undefined) {
            firstRadius = radius;
        }

        /*
            Apply tapering. If the current length is within the taper distance
            at either the start or the end, calculate the taper strengths. Apply
            the smaller of the two taper strengths to the radius.
        */

        const ts = runningLength < taperStart ? taperStartEase(runningLength / taperStart) : 1;

        const te =
            totalLength - runningLength < taperEnd
                ? taperEndEase((totalLength - runningLength) / taperEnd)
                : 1;

        radius = Math.max(0.01, radius * Math.min(ts, te));

        /* Add points to left and right */

        // Handle the last point
        if (i === points.length - 1) {
            // const offset = vector.perpendicular().scale(radius);
            // leftPts.push(point.sub(offset));
            // rightPts.push(point.add(offset));
            centerPts.push({ center: point, radius });
            continue;
        }

        // const nextVector = points[i + 1].vector;

        // const nextDpr = vector.dot(nextVector);

        /*
            Handle sharp corners. Find the difference (dot product) between the
            current and next vector. If the next vector is at more than a right
            angle to the current vector, draw a cap at the current point.
        */

        // TODO: restore this elsewhere?
        // if (nextDpr < 0) {
        //     // It's a sharp corner. Draw a rounded cap and move on to the next
        //     // point Considering saving these and drawing them later? So that we
        //     // can avoid crossing future points.

        //     const offset = vector.perpendicular().scale(radius);

        //     for (let step = 1 / 13, t = 0; t <= 1; t += step) {
        //         tl = point.sub(offset).rotateAround(point, FIXED_PI * t);
        //         leftPts.push(tl);

        //         tr = point.add(offset).rotateAround(point, FIXED_PI * -t);
        //         rightPts.push(tr);
        //     }

        //     pl = tl;
        //     pr = tr;

        //     continue;
        // }

        /* 
            Add regular points. Project points to either side of the current
            point, using the calculated size as a distance. If a point's
            distance to the previous point on that side greater than the minimum
            distance (or if the corner is kinda sharp), add the points to the
            side's points array.
        */

        // const offset = nextVector.lerp(vector, nextDpr).perpendicular().scale(radius);

        tc = point;
        if (i <= 1 || pc.distanceToSq(tc) > minDistance) {
            centerPts.push({ center: point, radius });
            pc = tc;
        }

        // tl = point.sub(offset);

        // if (i <= 1 || pl.distanceToSq(tl)> minDistance) {
        //     leftPts.push(tl);
        //     pl = tl;
        // }

        // tr = point.add(offset);

        // if (i <= 1 || pr.distanceToSq(tr) > minDistance) {
        //     rightPts.push(tr);
        //     pr = tr;
        // }

        // Set variables for next iteration
        prevPressure = pressure;
        // prevVector = vector;
    }

    return centerPts;
}

/**
 * ## getStrokePoints
 * @description Get an array of points as objects with an adjusted point, pressure, vector, distance, and runningLength.
 * @param points An array of points (as `[x, y, pressure]` or `{x, y, pressure}`). Pressure is optional in both cases.
 * @param options (optional) An object with options.
 * @param options.size	The base size (diameter) of the stroke.
 * @param options.thinning The effect of pressure on the stroke's size.
 * @param options.smoothing	How much to soften the stroke's edges.
 * @param options.easing	An easing function to apply to each point's pressure.
 * @param options.simulatePressure Whether to simulate pressure based on velocity.
 * @param options.start Cap, taper and easing for the start of the line.
 * @param options.end Cap, taper and easing for the end of the line.
 * @param options.last Whether to handle the points as a completed stroke.
 */
export function getStrokePoints(
    points: ReadonlyArray<{ x: number; y: number; pressure?: number }>,
    options = {} as StrokeOptions,
): StrokePoint[] {
    const { streamline = 0.5, size = 16, last: isComplete = false } = options;

    // If we don't have any points, return an empty array.
    if (points.length === 0) return [];

    // Find the interpolation level between points.
    const t = 0.15 + (1 - streamline) * 0.85;

    // Whatever the input is, make sure that the points are in Point[].
    type Pt = { point: Vector2; pressure?: number };
    let pts = points.map(
        (p): Pt => ({
            point: Vector2.fromVectorLike(p),
            pressure: p.pressure,
        }),
    );

    // Add extra points between the two, to help avoid "dash" lines
    // for strokes with tapered start and ends. Don't mutate the
    // input array!
    if (pts.length === 2) {
        const last = pts[1];
        pts = pts.slice(0, -1);
        for (let i = 1; i < 5; i++) {
            pts.push({ point: pts[0].point.lerp(last.point, i / 4), pressure: last.pressure });
            // pts.push(vec.lrp(pts[0] as Vector2, last as Vector2, i / 4));
        }
    }

    // If there's only one point, add another point at a 1pt offset.
    if (pts.length === 1) {
        pts.push({ point: pts[0].point.add(Vector2.UNIT), pressure: pts[0].pressure });
    }

    // The strokePoints array will hold the points for the stroke.
    // Start it out with the first point, which needs no adjustment.
    const strokePoints: StrokePoint[] = [
        {
            point: pts[0].point,
            pressure: pts[0].pressure != null && pts[0].pressure >= 0 ? pts[0].pressure : 0.25,
            vector: Vector2.UNIT,
            distance: 0,
            runningLength: 0,
        },
    ];

    // A flag to see whether we've already reached out minimum length
    let hasReachedMinimumLength = false;

    // We use the runningLength to keep track of the total distance
    let runningLength = 0;

    // We're set this to the latest point, so we can use it to calculate
    // the distance and vector of the next point.
    let prev = strokePoints[0];

    const max = pts.length - 1;

    // Iterate through all of the points, creating StrokePoints.
    for (let i = 1; i < pts.length; i++) {
        const pt = pts[i];
        const point =
            isComplete && i === max
                ? // If we're at the last point, and `options.last` is true,
                  // then add the actual input point.
                  pt.point
                : // Otherwise, using the t calculated from the streamline
                  // option, interpolate a new point between the previous
                  // point the current point.
                  prev.point.lerp(pt.point, t);

        // If the new point is the same as the previous point, skip ahead.
        if (prev.point.equals(point)) continue;

        // How far is the new point from the previous point?
        const distance = point.distanceTo(prev.point);

        // Add this distance to the total "running length" of the line.
        runningLength += distance;

        // At the start of the line, we wait until the new point is a
        // certain distance away from the original point, to avoid noise
        if (i < max && !hasReachedMinimumLength) {
            if (runningLength < size) continue;
            hasReachedMinimumLength = true;
            // TODO: Backfill the missing points so that tapering works correctly.
        }
        // Create a new strokepoint (it will be the new "previous" one).
        prev = {
            // The adjusted point
            point,
            // The input pressure (or .5 if not specified)
            pressure: pt.pressure != null && pt.pressure >= 0 ? pt.pressure : 0.5,
            // The vector from the current point to the previous point
            vector: prev.point.sub(point).normalize(),
            // The distance between the current point and the previous point
            distance,
            // The total distance so far
            runningLength,
        };

        // Push it to the strokePoints array.
        strokePoints.push(prev);
    }

    // Set the vector of the first point to be the same as the second point.
    strokePoints[0].vector = strokePoints[1]?.vector ?? Vector2.ZERO;

    return strokePoints;
}

/**
 * Compute a radius based on the pressure.
 * @param size
 * @param thinning
 * @param pressure
 * @param easing
 * @internal
 */
export function getStrokeRadius(
    size: number,
    thinning: number,
    pressure: number,
    easing: (t: number) => number = (t) => t,
) {
    return size * easing(0.5 - thinning * (0.5 - pressure));
}

export function getSvgPathFromStroke(stroke: Vector2[]) {
    if (!stroke.length) return "";

    const d = ["M", stroke[0].x, stroke[0].y, "Q"];
    for (let i = 0; i < stroke.length; i++) {
        const p0 = stroke[i];
        const p1 = stroke[(i + 1) % stroke.length];
        const midPoint = p0.add(p1).scale(0.5);
        d.push(p0.x, p0.y, midPoint.x, midPoint.y);
    }

    d.push("Z");
    return d.join(" ");
}
