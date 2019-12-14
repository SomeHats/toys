import { makeNoise2D } from "open-simplex-noise";
import { times, mapRange } from "./utils";

export type Noise2D = (x: number, y: number) => number;

export function mapNoise2d(
  scale: number,
  min: number,
  max: number,
  noise: Noise2D
): Noise2D {
  return (x: number, y: number) =>
    mapRange(-1, 1, min, max, noise(x * scale, y * scale));
}

export function makeFractalNoise2d(
  count: number,
  scaleDropOff: number = 0.5,
  sizeScale: number = 2
): Noise2D {
  const levels = times(count, () => makeNoise2D(Math.random()));
  return (x, y) => {
    let result = 0;
    let scale = 1;
    let size = 1;
    let max = 0;

    for (const level of levels) {
      result += level(x * size, y * size) * scale;
      max += scale;
      scale *= scaleDropOff;
      size *= sizeScale;
    }

    return result / max;
  };
}
