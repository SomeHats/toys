import { Sprite } from "pixi.js";
import { AnimatedSpriteStackSheet } from "@/bees/AnimatedSpriteStackSheet";
import { Driver } from "@/bees/driver";

export class AnimatedSpriteStack extends Sprite {
    public heading = 0;

    constructor(public readonly sheet: AnimatedSpriteStackSheet, private readonly driver: Driver) {
        super(sheet.getFrameAtAngle(0, 0));
        driver.addUpdate(this);
    }

    updateTick(elapsedTimeMs: number) {
        const newTexture = this.sheet.getElapsedTimeAtAngle(this.heading, elapsedTimeMs);
        if (newTexture !== this.texture) {
            this.texture = newTexture;
        }
    }
}
