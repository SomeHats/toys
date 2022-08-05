import Vector2 from "../lib/geom/Vector2";

export type SpriteOpts = {
    pixelScale?: number;
    opacity?: number;
};

export class C {
    constructor(public readonly ctx: CanvasRenderingContext2D) {}

    do(cb: () => void) {
        this.ctx.save();
        cb();
        this.ctx.restore();
    }

    scale(x: number, y: number = x) {
        this.ctx.scale(x, y);
    }

    translate(position: Vector2) {
        this.ctx.translate(position.x, position.y);
    }

    drawSpriteFromSheet(
        image: HTMLImageElement,
        sx: number,
        sy: number,
        sw: number,
        sh: number,
        dx: number,
        dy: number,
        { pixelScale = 1, opacity = 1 }: SpriteOpts = {},
    ) {
        this.do(() => {
            console.log({ sx, sy, sw, sh, dx, dy });
            this.ctx.imageSmoothingEnabled = false;
            this.ctx.globalAlpha = opacity;
            this.ctx.drawImage(
                image,
                sx,
                sy,
                sw,
                sh,
                Math.round(dx) * pixelScale,
                Math.round(dy) * pixelScale,
                sw * pixelScale,
                sh * pixelScale,
            );
        });
    }

    drawSprite(image: HTMLImageElement, x: number, y: number, opts?: SpriteOpts) {
        this.drawSpriteFromSheet(image, 0, 0, image.naturalWidth, image.naturalHeight, x, y, opts);
    }
}
