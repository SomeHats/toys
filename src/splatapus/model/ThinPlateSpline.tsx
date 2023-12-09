import { assert, fail } from "@/lib/assert";
import { times } from "@/lib/utils";

type VectorN = ReadonlyArray<number>;
type MutVectorN = Array<number>;

export class Tps {
    private static distance(pnt1: VectorN, pnt2: VectorN) {
        let sum = 0;
        // if (!pnt1.length) return Math.sqrt(Math.pow(pnt1 - pnt2, 2));
        for (let i = 0; i < pnt1.length; i++) {
            sum += Math.pow(pnt1[i] - pnt2[i], 2);
        }
        return Math.sqrt(sum);
    }

    // this is going to be a thin-plate spline f(x,y) = a1 + a2x + a3y + SUM(wi *
    // kernel())
    private static kernel(pnt1: VectorN, pnt2: VectorN) {
        const r = Tps.distance(pnt1, pnt2);
        if (r === 0) return 0;
        return Math.pow(r, 2) * Math.log(r);
    }

    private centers: ReadonlyArray<VectorN>;
    private ws: Matrix;

    constructor(centers: ReadonlyArray<VectorN>, rawYs: ReadonlyArray<number>) {
        if (centers.length === 0) {
            fail("bad centers array :/");
        }

        if (!centers.every((element) => element.length === centers[0].length)) {
            fail("centers must have same dimensions :/");
        }

        this.centers = centers;

        const ys: number[] = rawYs.slice();
        const matrix: number[][] = [];
        const P = [];
        for (let i = 0; i < centers.length; i++) {
            const matRow: number[] = [];
            const pRow: number[] = [1];
            for (let k = 0; k < centers[i].length; k++) {
                pRow.push(centers[i][k]);
            }

            for (let j = 0; j < centers.length; j++) {
                matRow.push(Tps.kernel(centers[i], centers[j]));
            }
            P.push(pRow);
            matrix.push(matRow.concat(pRow));
        }

        const pT = Matrix.transpose(P);

        const newRows: number[][] = pT.map((row: number[]) => {
            for (let i = row.length; i < matrix[0].length; i++) {
                row.push(0);
            }
            return row;
        });

        for (let i = 0; i < newRows.length; i++) {
            matrix.push(newRows[i]);
            ys.push(0);
        }

        const ws = this.solve(ys, matrix);
        if (!ws) {
            fail(
                "rbf failed to compile with given centers./nCenters must be unique :/",
            );
        }

        this.ws = ws;
    }

    private solve(b: number[], x: number[][]): Matrix | null {
        const xInverse = Matrix.inverse(x);
        if (!xInverse) {
            return null;
        }
        return Matrix.multiplyVector(xInverse, b);
    }

    getValue(pnt: VectorN): number {
        assert(this.ws);
        let result = 0,
            i = 0;
        for (i = 0; i < this.centers.length; i++) {
            result += Number(this.ws[i]) * Tps.kernel(pnt, this.centers[i]);
        }
        result += Number(this.ws[this.centers.length]);
        for (i = 0; i < pnt.length; i++) {
            result += pnt[i] * Number(this.ws[this.centers.length + (i + 1)]);
        }
        return result;
    }
}

/**
 * https://github.com/jcoglan/sylvester
 *
 * Copyright (c) 2007-2015 James Coglan Permission is hereby granted, free of
 * charge, to any person obtaining a copy of this software and associated
 * documentation files (the 'Software'), to deal in the Software without
 * restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
type Matrix = number[][];
const Matrix = {
    create(elements: number[][]): Matrix {
        return elements.map((row) => row.slice());
    },
    fromVector(vector: VectorN): Matrix {
        return vector.map((n) => [n]);
    },
    identity(n: number): Matrix {
        return times(n, (i) => times(n, (j) => (i === j ? 1 : 0)));
    },
    col(self: Matrix, j: number): MutVectorN {
        return self.map((row) => row[j - 1]);
    },
    clone(self: Matrix): Matrix {
        return self.slice();
    },
    canMultiplyFromLeft(self: Matrix, other: Matrix): boolean {
        return self[0].length === other.length;
    },
    multiplyMatrix(self: Matrix, other: Matrix): Matrix | null {
        if (!Matrix.canMultiplyFromLeft(self, other)) {
            return null;
        }

        const cols = self[0].length;
        return times(self.length, (i) =>
            times(other[0].length, (j) => {
                let sum = 0;
                for (let c = 0; c < cols; c++) {
                    sum += self[i][c] * other[c][j];
                }
                return sum;
            }),
        );
    },
    multiplyVector(self: Matrix, other: VectorN): Matrix | null {
        return Matrix.multiplyMatrix(self, Matrix.fromVector(other));
    },
    transpose(self: Matrix): Matrix {
        return times(self[0].length, (i) =>
            times(self.length, (j) => self[j][i]),
        );
    },
    isSquare(self: Matrix): boolean {
        return self.length === self[0].length;
    },
    toRightTriangular(self: Matrix): Matrix {
        const result = Matrix.clone(self);
        const n = self.length;
        const np = self[0].length;
        for (let i = 0; i < n; i++) {
            if (result[i][i] === 0) {
                for (let j = i + 1; j < n; j++) {
                    if (result[j][i] !== 0) {
                        const els = [];
                        for (let p = 0; p < np; p++) {
                            els.push(result[i][p] + result[j][p]);
                        }
                        result[i] = els;
                        break;
                    }
                }
            }
            if (result[i][i] !== 0) {
                for (let j = i + 1; j < n; j++) {
                    const multiplier = result[j][i] / result[i][i];
                    const els = [];
                    for (let p = 0; p < np; p++) {
                        // Elements with column numbers up to an including the
                        // number of the row that we're subtracting can safely
                        // be set straight to zero, since that's the point of
                        // this routine and it avoids having to loop over and
                        // correct rounding errors later
                        els.push(
                            p <= i ? 0 : (
                                result[j][p] - result[i][p] * multiplier
                            ),
                        );
                    }
                    result[j] = els;
                }
            }
        }
        return result;
    },
    determinant(self: Matrix): number | null {
        if (!Matrix.isSquare(self)) {
            return null;
        }
        const triangular = Matrix.toRightTriangular(self);
        let det = triangular[0][0];
        for (let i = 1; i < triangular.length; i++) {
            det = det * triangular[i][i];
        }
        return det;
    },
    isSingular(self: Matrix): boolean {
        return Matrix.isSquare(self) && Matrix.determinant(self) === 0;
    },
    augment(self: Matrix, other: Matrix): Matrix {
        const result = Matrix.clone(self);
        const cols = result[0].length;
        assert(result.length === other.length);
        for (let i = 0; i < result.length; i++) {
            for (let j = 0; j < other[0].length; j++) {
                result[i][cols + j] = other[i][j];
            }
        }
        return result;
    },
    inverse(self: Matrix): Matrix | null {
        if (!Matrix.isSquare(self) || Matrix.isSingular(self)) {
            return null;
        }

        const n = self.length;
        const inverse: Matrix = [];
        const M = Matrix.toRightTriangular(
            Matrix.augment(self, Matrix.identity(n)),
        );
        const np = M[0].length;

        let i = self.length;
        while (i--) {
            // First, normalise diagonal elements to 1
            const els = [];
            inverse[i] = [];
            const divisor = M[i][i];
            for (let p = 0; p < np; p++) {
                const newEl = M[i][p] / divisor;
                els.push(newEl);
                // Shuffle off the current row of the right hand side into the
                // results array as it will not be modified by later runs
                // through this loop
                if (p >= n) {
                    inverse[i].push(newEl);
                }
            }
            M[i] = els;
            // Then, subtract this row from those above it to give the identity
            // matrix on the left hand side
            let j = i;
            while (j--) {
                const els = [];
                for (let p = 0; p < np; p++) {
                    els.push(M[j][p] - M[i][p] * M[j][i]);
                }
                M[j] = els;
            }
        }
        return inverse;
    },
};
