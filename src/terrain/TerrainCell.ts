import Vector2 from '../lib/geom/Vector2';
import { DelaunayCell } from './Delaunay';
import Terrain from './Terrain';
import { fromEntries, compact, lerp, mapRange, clamp } from '../lib/utils';
import { Noise2D } from './fractalNoise';
import { TectonicPlate } from './TectonicPlate';
import * as config from './config';
import makeInterpolateGradiant from './makeInterpolateGradient';

const interpolateBiome = makeInterpolateGradiant([
  { color: '#1A237E', stop: 0 },
  { color: '#1976D2', stop: 0.2 },
  { color: '#90CAF9', stop: 0.4 },
  { color: '#FFF59D', stop: 0.42 },
  { color: '#81C784', stop: 0.5 },
  { color: '#388E3C', stop: 0.6 },
  { color: '#9CCC65', stop: 0.7 },
  { color: '#C5E1A5', stop: 0.75 },
  { color: '#9E9E9E', stop: 0.85 },
  { color: '#78909C', stop: 0.9 },
  { color: '#ECEFF1', stop: 1 },
]);

export class TerrainCell {
  public readonly position: Vector2;
  public readonly neighbourCellIds: ReadonlyArray<number>;
  public readonly neighbourCellIdsByEdgeIndex: ReadonlyArray<number | null>;
  public readonly edgeIndexByNeighbourCellId: {
    [cellId: number]: number | undefined;
  };
  public readonly polygon: ReadonlyArray<Vector2>;
  private readonly noiseHeight: number;
  private heightAdjustment = 0;
  public totalDriftPressure = 0;

  constructor(
    public readonly id: number,
    cell: DelaunayCell,
    private readonly terrain: Terrain,
    getNoiseHeight: Noise2D,
    private readonly getTectonicHeightNoise: Noise2D,
  ) {
    this.polygon = cell.map(edge => edge.leadingPoint);

    this.position = Vector2.average(this.polygon);

    this.neighbourCellIdsByEdgeIndex = cell
      .map(edge => edge.neighbourCellId)
      .map(id => (terrain.isActiveByCellId[id] ? id : null));

    this.neighbourCellIds = compact(this.neighbourCellIdsByEdgeIndex);

    this.edgeIndexByNeighbourCellId = fromEntries(
      compact(
        this.neighbourCellIdsByEdgeIndex.map((cellId, edgeIndex) =>
          cellId !== null ? [cellId, edgeIndex] : null,
        ),
      ),
    );

    this.noiseHeight = getNoiseHeight(this.position.x, this.position.y);
  }

  *iterateEdgesStartingFromIndex(startIndex: number): IterableIterator<number> {
    for (let i = 0; i < this.polygon.length; i++) {
      yield (startIndex + i) % this.polygon.length;
    }
  }

  getPlate(): TectonicPlate {
    return this.terrain.platesById[this.terrain.plateIdByCellId[this.id]];
  }

  getHeightFromDriftPressure(): number {
    return (
      this.totalDriftPressure ** (1 / 2) *
      0.8 *
      this.getTectonicHeightNoise(this.position.x, this.position.y)
    );
  }

  getHeight(shouldIncludeDrift = true): number {
    return (
      this.getPlate().baseHeight +
      this.noiseHeight +
      this.heightAdjustment +
      (shouldIncludeDrift ? this.getHeightFromDriftPressure() : 0)
    );
  }

  getSeaLevel(): number {
    return mapRange(0, 1, -1, 1, 0.4);
  }

  get3dHeight(shouldIncludeDrift = true): number {
    return Math.max(this.getSeaLevel(), this.getHeight(shouldIncludeDrift));
  }

  getColor(shouldIncludeDrift = true): string {
    return interpolateBiome(
      mapRange(-1, 1, 0, 1, this.getHeight(shouldIncludeDrift)),
    );
  }

  findConnectedCellsInRadius(radius: number): Array<TerrainCell> {
    const toVisit: Array<TerrainCell> = [this];
    const result = new Set<TerrainCell>([this]);

    let cell;
    while ((cell = toVisit.pop())) {
      for (const neighbourCellId of cell.neighbourCellIds) {
        const neighbourCell = this.terrain.cellsById[neighbourCellId];

        if (
          !result.has(neighbourCell) &&
          neighbourCell.position.distanceTo(this.position) <= radius
        ) {
          toVisit.push(neighbourCell);
          result.add(neighbourCell);
        }
      }
    }

    return Array.from(result);
  }

  adjustHeight(amount: number) {
    this.heightAdjustment += amount;
  }

  private getPressureForNeighbour(
    neighbour: TerrainCell,
    pressure: Vector2,
  ): Vector2 | null {
    const positionDifference = neighbour.position.sub(this.position);

    const pressureCoefficient = Math.cos(
      clamp(
        -Math.PI / 2,
        Math.PI / 2,
        positionDifference.angleBetween(pressure) * 1,
      ),
    );

    if (pressureCoefficient <= 0) {
      return null;
    }

    return pressure.scale(pressureCoefficient);
  }

  private applyPressureForDrift(pressure: Vector2) {
    const magnitude = pressure.magnitude;
    this.totalDriftPressure += pressure.magnitude;
    if (magnitude < config.MIN_DRIFT_MAGNITUDE_TO_PROPAGATE) {
      return;
    }

    const neighboursToPropagateTo: Array<[TerrainCell, Vector2]> = [];
    for (const neighbourId of this.neighbourCellIds) {
      const neighbour = this.terrain.cellsById[neighbourId];
      const neighbourPressure = this.getPressureForNeighbour(
        neighbour,
        pressure,
      );
      if (neighbourPressure) {
        neighboursToPropagateTo.push([neighbour, neighbourPressure]);
      }
    }

    for (const [neighbour, neighbourPressure] of neighboursToPropagateTo) {
      neighbour.applyPressureForDrift(
        neighbourPressure.scale(1 / Math.sqrt(neighboursToPropagateTo.length)),
      );
    }
  }

  propagateTectonicDrift() {
    const drift = this.getPlate().drift;
    const neighboursToPropagateTo: Array<[TerrainCell, Vector2]> = [];
    for (const neighbourId of this.neighbourCellIds) {
      const neighbour = this.terrain.cellsById[neighbourId];
      const neighbourDrift = neighbour.getPlate().drift;
      const pressure = drift.sub(neighbourDrift);

      if (pressure.equals(Vector2.ZERO)) {
        continue;
      }

      const neighbourPressure = this.getPressureForNeighbour(
        neighbour,
        pressure,
      );
      if (neighbourPressure) {
        neighboursToPropagateTo.push([neighbour, neighbourPressure]);
      }
    }

    for (const [neighbour, neighbourPressure] of neighboursToPropagateTo) {
      neighbour.applyPressureForDrift(
        neighbourPressure.scale(1 / neighboursToPropagateTo.length),
      );
    }
  }
}
