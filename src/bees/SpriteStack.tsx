import { mapRange, normalizeAngle } from '../lib/utils';
import { C, SpriteOpts } from './C';
import { loadImage } from '../lib/load';

export type SpriteStackData = {
  width: number;
  height: number;
  frames: number;
  angles: number;
  rows: number;
  cols: number;
  regions: number[];
  trims: number[];
};

export type SpriteStackManifest = {
  geometry: Promise<{ default: SpriteStackData }>;
  url: URL;
  scale: number;
  frameRate: number;
  originX: number;
  originY: number;
  angleOffset: number;
};

export class SpriteStack {
  static async load(manifest: SpriteStackManifest) {
    const [{ default: data }, url] = await Promise.all([
      manifest.geometry,
      manifest.url,
    ]);
    const image = await loadImage(url);
    return new SpriteStack(
      image,
      data,
      manifest.frameRate,
      manifest.scale,
      manifest.originX,
      manifest.originY,
      manifest.angleOffset,
    );
  }

  private readonly frameDelayMs: number;

  constructor(
    private readonly image: HTMLImageElement,
    private readonly data: SpriteStackData,
    frameRate: number,
    private readonly scale: number,
    private readonly originX: number,
    private readonly originY: number,
    private readonly angleOffset: number,
  ) {
    this.frameDelayMs = 1000 / frameRate;
  }

  draw(
    c: C,
    angleRadians: number,
    timeMs: number,
    opts?: Omit<SpriteOpts, 'pixelScale'>,
  ) {
    const angleIndex = Math.floor(
      mapRange(
        -Math.PI,
        Math.PI,
        0,
        this.data.angles,
        normalizeAngle(angleRadians + this.angleOffset * Math.PI),
      ),
    );

    const frameIndex =
      Math.floor(timeMs / this.frameDelayMs) % this.data.frames;

    const dataIndex = frameIndex * this.data.rows + angleIndex;
    const regionIndex = dataIndex * 4;
    const x = this.data.regions[regionIndex];
    const y = this.data.regions[regionIndex + 1];
    const width = this.data.regions[regionIndex + 2];
    const height = this.data.regions[regionIndex + 3];
    const trimIndex = dataIndex * 2;
    const trimX = this.data.trims[trimIndex];
    const trimY = this.data.trims[trimIndex + 1];

    c.drawSpriteFromSheet(
      this.image,
      x,
      y,
      width,
      height,
      trimX - this.data.width * this.originX,
      trimY - this.data.height * this.originY,
      { ...opts, pixelScale: this.scale },
    );
  }
}
