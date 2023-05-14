import { C, SpriteOpts } from "@/bees/C";
import { loadImage } from "@/lib/load";

export type SpriteManifest = {
    src: URL;
    scale: number;
    originX: number;
    originY: number;
};

export class Sprite {
    static async load(manifest: SpriteManifest) {
        const image = await loadImage(manifest.src);
        return new Sprite(image, manifest);
    }

    constructor(
        private readonly image: HTMLImageElement,
        private readonly manifest: Omit<SpriteManifest, "url">,
    ) {}

    draw(c: C, opts?: Omit<SpriteOpts, "pixelScale">) {
        c.drawSprite(
            this.image,
            -this.image.naturalWidth * this.manifest.originX,
            -this.image.naturalHeight * this.manifest.originY,
            { ...opts, pixelScale: this.manifest.scale },
        );
    }
}
