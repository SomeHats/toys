import { BaseTexture, Rectangle, Texture } from "pixi.js";
import { assert } from "@/lib/assert";
import { loadAndParseJson } from "@/lib/load";
import { mapRange, normalizeAngle } from "@/lib/utils";
import { Schema, SchemaType } from "@/lib/schema";

const animatedSpriteStackGeometrySchema = Schema.object({
    width: Schema.number,
    height: Schema.number,
    frames: Schema.number,
    angles: Schema.number,
    rows: Schema.number,
    cols: Schema.number,
    regions: Schema.arrayOf(Schema.number),
    trims: Schema.arrayOf(Schema.number),
});

export type AnimatedSpriteStackGeometry = SchemaType<typeof animatedSpriteStackGeometrySchema>;

export type SpriteStackManifest = {
    geometry: URL;
    baseTexture: Promise<BaseTexture>;
    resolution: number;
    framesPerSecond: number;
    originX: number;
    originY: number;
    angleOffset: number;
};

export class AnimatedSpriteStackSheet {
    static async load(manifest: SpriteStackManifest): Promise<AnimatedSpriteStackSheet> {
        const geometry = await loadAndParseJson(
            manifest.geometry,
            animatedSpriteStackGeometrySchema,
        );
        return new AnimatedSpriteStackSheet(await manifest.baseTexture, geometry, manifest);
    }

    private readonly texturesByAngleThenFrame: Texture[][];
    public readonly angles: number;
    public readonly frames: number;
    public readonly resolution: number;
    public readonly framesPerSecond: number;
    public readonly msPerFrame: number;
    public readonly originX: number;
    public readonly originY: number;
    public readonly angleOffset: number;

    constructor(
        baseTexture: BaseTexture,
        geometry: AnimatedSpriteStackGeometry,
        manifest: SpriteStackManifest,
    ) {
        this.angles = geometry.angles;
        this.frames = geometry.frames;
        this.resolution = manifest.resolution;
        this.framesPerSecond = manifest.framesPerSecond;
        this.msPerFrame = 1000 / this.framesPerSecond;
        this.originX = manifest.originX;
        this.originY = manifest.originY;
        this.angleOffset = manifest.angleOffset;

        const texturesByAngleThenFrame: Texture[][] = [];

        for (let angleIndex = 0; angleIndex < this.angles; angleIndex++) {
            texturesByAngleThenFrame[angleIndex] = [];
            for (let frameIndex = 0; frameIndex < this.frames; frameIndex++) {
                const dataIndex = frameIndex * geometry.rows + angleIndex;
                const regionIndex = dataIndex * 4;
                const x = geometry.regions[regionIndex];
                const y = geometry.regions[regionIndex + 1];
                const width = geometry.regions[regionIndex + 2];
                const height = geometry.regions[regionIndex + 3];
                const trimIndex = dataIndex * 2;
                const trimX = geometry.trims[trimIndex];
                const trimY = geometry.trims[trimIndex + 1];

                const texture = new Texture(
                    baseTexture,
                    new Rectangle(x, y, width, height),
                    new Rectangle(
                        0,
                        0,
                        geometry.width / this.resolution,
                        geometry.height / this.resolution,
                    ),
                    new Rectangle(
                        trimX / this.resolution,
                        trimY / this.resolution,
                        width / this.resolution,
                        height / this.resolution,
                    ),
                    0,
                    { x: manifest.originX, y: manifest.originY },
                );

                texturesByAngleThenFrame[angleIndex][frameIndex] = texture;
            }
        }

        this.texturesByAngleThenFrame = texturesByAngleThenFrame;
    }

    getFrameAtAngle(angleRadians: number, frameIndex: number): Texture {
        const angleIndex = Math.floor(
            mapRange(
                -Math.PI,
                Math.PI,
                0,
                this.angles,
                normalizeAngle(angleRadians + this.angleOffset * Math.PI),
            ),
        );
        assert(frameIndex >= 0 && frameIndex < this.frames);
        return this.texturesByAngleThenFrame[angleIndex][frameIndex];
    }

    getElapsedTimeAtAngle(angleRadians: number, elapsedTimeMs: number) {
        const frameIndex = Math.floor(elapsedTimeMs / this.msPerFrame) % this.frames;
        return this.getFrameAtAngle(angleRadians, frameIndex);
    }
}
