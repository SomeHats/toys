import { Emoji, characters } from "@/emoji/Emoji";
import { loadImage } from "@/lib/load";
import { lazy } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

interface Assets {
    emoji: HTMLImageElement;
    // emojiMasked: HTMLImageElement;
}

const ASSET_TILE_SIZE_PX = 256;

export type DrawEmoji = Awaited<ReturnType<typeof createDrawEmoji>>;

const loadAssets = lazy(async (): Promise<Assets> => {
    const [emoji] = await Promise.all([
        loadImage(new URL("./assets/emojis.png", import.meta.url)),
        // loadImage(new URL("./assets/emoji-masked.png", import.meta.url)),
    ]);
    return { emoji };
});

export async function createDrawEmoji() {
    const assets = await loadAssets();
    return drawEmoji.bind(null, assets);
}

export function useDrawEmoji() {
    const [assets, setAssets] = useState<Assets | null>(null);

    useEffect(() => {
        let isCancelled = false;

        loadAssets().then(
            (assets) => {
                if (isCancelled) return;
                setAssets(assets);
            },
            (error) => {
                if (isCancelled) return;
                console.error(error);
            },
        );

        return () => {
            isCancelled = true;
        };
    }, []);

    return useMemo(
        () => (assets ? drawEmoji.bind(null, assets) : null),
        [assets],
    );
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

    // if (emoji.color.name === "auto") return;

    // ctx.globalCompositeOperation = "source-in";
    // ctx.fillStyle = colors[emoji.color.name](emoji.color.level);
    // ctx.fillRect(0, 0, sizePx, sizePx);

    // ctx.globalCompositeOperation = "source-over";
    // ctx.drawImage(
    //     assets.emojiMasked,
    //     emoji.emotion * ASSET_TILE_SIZE_PX,
    //     characters.indexOf(emoji.character) * ASSET_TILE_SIZE_PX,
    //     ASSET_TILE_SIZE_PX,
    //     ASSET_TILE_SIZE_PX,
    //     0,
    //     0,
    //     sizePx,
    //     sizePx,
    // );
}
