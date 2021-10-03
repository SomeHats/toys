import { assert } from '../lib/assert';
import AABB from '../lib/geom/AABB';
import Vector2 from '../lib/geom/Vector2';

const SQRT_3 = Math.sqrt(3);

/**
 * Triangular coordinate system.
 *
 * Adapted from https://www.boristhebrave.com/2021/05/23/triangle-grids/
 */
export class TriCoord {
  /**
   * Each unit of a, b, c moves you in the direction of one of the edges of a
   * down triangle, in linear combination. Or equivalently, this function
   * multiplies by the inverse matrix to pick_tri NB: This function has the nice
   * property that if you pass in x,y,z values that sum to zero (not a valid
   * triangle), it'll return co-ordinates for the vertices of the triangles.
   */
  static toCartesian(a: number, b: number, c: number, scale = 1): Vector2 {
    return new Vector2(
      (0.5 * a + -0.5 * c) * scale,
      ((-SQRT_3 / 6) * a + (SQRT_3 / 3) * b - (SQRT_3 / 6) * c) * scale,
    );
  }

  /** Returns the triangle that contains a given cartesian co-ordinate point */
  static atCartesian({ x, y }: Vector2, scale = 1): TriCoord {
    return new TriCoord(
      Math.ceil((1 * x - (SQRT_3 / 3) * y) / scale),
      Math.floor((((SQRT_3 * 2) / 3) * y) / scale) + 1,
      Math.ceil((-1 * x - (SQRT_3 / 3) * y) / scale),
    );
  }

  /** Returns the tris that intersect the rectangle specified in cartesian co-ordinates */
  static intersectingAABB(aabb: AABB, scale = 1): Array<TriCoord> {
    const results: Array<TriCoord> = [];

    // For consistency, we treat the triangles as exclusive of their border, and the rect as inclusive
    const x = aabb.origin.x / scale;
    const y = aabb.origin.y / scale;
    const width = aabb.size.x / scale;
    const height = aabb.size.y / scale;
    // Lower and upper bound by row
    const fl = ((SQRT_3 * 2) / 3) * y;
    const fu = ((SQRT_3 * 2) / 3) * (y + height);
    // Loop over all rows that the rectangle is in
    for (let b = Math.floor(fl) + 1; b < Math.ceil(fu) + 1; b++) {
      // Consider each row vs a trimmed rect
      const minB = Math.max(b - 1, fl);
      const maxB = Math.min(b, fu);
      // The smallest / largest values for the diagonals
      // can be read from the trimmed rect corners
      const minA = Math.floor(x - maxB / 2) + 1;
      const maxA = Math.ceil(x + width - minB / 2);
      const minC = Math.floor(-x - width - maxB / 2) + 1;
      const maxC = Math.ceil(-x - minB / 2);
      // Walk along the row left to right
      let a = minA;
      let c = maxC;
      assert(a + b + c === 1 || a + b + c === 2);
      while (a <= maxA && c >= minC) {
        results.push(new TriCoord(a, b, c));
        if (a + b + c === 1) {
          a += 1;
        } else {
          c -= 1;
        }
      }
    }

    return results;
  }

  constructor(
    public readonly a: number,
    public readonly b: number,
    public readonly c: number,
  ) {
    assert(Number.isInteger(a));
    assert(Number.isInteger(b));
    assert(Number.isInteger(c));
    const sum = a + b + c;
    assert(sum === 1 || sum === 2);
  }

  /** Returns the center of a given triangle in cartesian co-ordinates */
  center(scale = 1): Vector2 {
    return TriCoord.toCartesian(this.a, this.b, this.c, scale);
  }

  /** Returns true if this is an upwards-pointing triangle, otherwise false. */
  pointsUp(): boolean {
    return this.a + this.b + this.c === 2;
  }

  /** Returns the three corners of a given triangle in cartesian co-ordinates */
  vertices(scale = 1): [Vector2, Vector2, Vector2] {
    if (this.pointsUp()) {
      return [
        TriCoord.toCartesian(1 + this.a, this.b, this.c, scale),
        TriCoord.toCartesian(this.a, this.b, 1 + this.c, scale),
        TriCoord.toCartesian(this.a, 1 + this.b, this.c, scale),
      ];
    } else {
      return [
        TriCoord.toCartesian(-1 + this.a, this.b, this.c, scale),
        TriCoord.toCartesian(this.a, this.b, -1 + this.c, scale),
        TriCoord.toCartesian(this.a, -1 + this.b, this.c, scale),
      ];
    }
  }

  /** Returns the tris that share an edge with the given tri */
  neighbours(): [TriCoord, TriCoord, TriCoord] {
    if (this.pointsUp()) {
      return [
        new TriCoord(this.a - 1, this.b, this.c),
        new TriCoord(this.a, this.b - 1, this.c),
        new TriCoord(this.a, this.b, this.c - 1),
      ];
    } else {
      return [
        new TriCoord(this.a + 1, this.b, this.c),
        new TriCoord(this.a, this.b + 1, this.c),
        new TriCoord(this.a, this.b, this.c + 1),
      ];
    }
  }

  /** Returns how many steps one tri is from another */
  distanceTo(other: TriCoord): number {
    return (
      Math.abs(this.a - other.a) +
      Math.abs(this.b - other.b) +
      Math.abs(this.c - other.c)
    );
  }
}
