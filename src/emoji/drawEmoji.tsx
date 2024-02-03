import { loadImage } from "@/lib/load";
import { tailwindColors } from "@/lib/theme";
import { lazy } from "@/lib/utils";

interface Assets {
    emoji: HTMLImageElement;
    emojiMasked: HTMLImageElement;
}

const ASSET_TILE_SIZE_PX = 256;

export const characters = ["blob", "yeti"] as const;
export const emotions = [0, 1, 2, 3, 4] as const;
export const colors = {
    auto: null,
    red: tailwindColors.cyberRed,
    orange: tailwindColors.cyberOrange,
    yellow: tailwindColors.cyberYellow,
    green: tailwindColors.cyberGreen,
    blue: tailwindColors.cyberBlue,
    purple: tailwindColors.cyberPurple,
    pink: tailwindColors.cyberPink,
};

export interface Emoji {
    character: (typeof characters)[number];
    emotion: (typeof emotions)[number];
    color: { name: keyof typeof colors; level: 30 | 40 | 50 | 70 };
}

export type DrawEmoji = Awaited<ReturnType<typeof createDrawEmoji>>;

const loadAssets = lazy(async (): Promise<Assets> => {
    const [emoji, emojiMasked] = await Promise.all([
        loadImage(new URL("./assets/emoji.png", import.meta.url)),
        loadImage(new URL("./assets/emoji-masked.png", import.meta.url)),
    ]);
    return { emoji, emojiMasked };
});

export async function createDrawEmoji() {
    const assets = await loadAssets();
    return drawEmoji.bind(null, assets);
}

function drawEmoji(
    assets: Assets,
    ctx: CanvasRenderingContext2D,
    emoji: Emoji,
    sizePx: number,
) {
    ctx.drawImage(
        assets.emoji,
        emoji.emotion * ASSET_TILE_SIZE_PX,
        characters.indexOf(emoji.character) * ASSET_TILE_SIZE_PX,
        ASSET_TILE_SIZE_PX,
        ASSET_TILE_SIZE_PX,
        0,
        0,
        sizePx,
        sizePx,
    );

    if (emoji.color.name === "auto") return;

    console.log(ctx.globalCompositeOperation);
    ctx.globalCompositeOperation = "source-in";
    ctx.fillStyle = colors[emoji.color.name](emoji.color.level);
    ctx.fillRect(0, 0, sizePx, sizePx);

    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(
        assets.emojiMasked,
        emoji.emotion * ASSET_TILE_SIZE_PX,
        characters.indexOf(emoji.character) * ASSET_TILE_SIZE_PX,
        ASSET_TILE_SIZE_PX,
        ASSET_TILE_SIZE_PX,
        0,
        0,
        sizePx,
        sizePx,
    );
}
