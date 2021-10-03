import { loadImage } from '../lib/loadImage';
import { C, SpriteOpts } from './C';

export type SpriteManifest = {
  url: Promise<{ default: string }>;
  scale: number;
  originX: number;
  originY: number;
};

export class Sprite {
  static async load(manifest: SpriteManifest) {
    const { default: url } = await manifest.url;
    const image = await loadImage(url);
    return new Sprite(image, manifest);
  }

  constructor(
    private readonly image: HTMLImageElement,
    private readonly manifest: Omit<SpriteManifest, 'url'>,
  ) {}

  draw(c: C, opts?: Omit<SpriteOpts, 'pixelScale'>) {
    c.drawSprite(
      this.image,
      -this.image.naturalWidth * this.manifest.originX,
      -this.image.naturalHeight * this.manifest.originY,
      { ...opts, pixelScale: this.manifest.scale },
    );
  }
}
