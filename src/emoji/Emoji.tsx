import { useDrawEmoji } from "@/emoji/drawEmoji";
import { DebugCanvas } from "@/lib/react/DebugCanvasComponent";
import { CSSProperties } from "react";

export const characters = ["yeti", "cat", "tree"] as const;
export const emotions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
// export const colors = {
//     auto: null,
//     red: tailwindColors.cyberRed,
//     orange: tailwindColors.cyberOrange,
//     yellow: tailwindColors.cyberYellow,
//     green: tailwindColors.cyberGreen,
//     blue: tailwindColors.cyberBlue,
//     purple: tailwindColors.cyberPurple,
//     pink: tailwindColors.cyberPink,
// };

export interface Emoji {
    character: (typeof characters)[number];
    emotion: (typeof emotions)[number];
    // color: { name: keyof typeof colors; level: 30 | 40 | 50 | 70 };
}

export function Emoji({
    sizePx,
    emoji,
    style,
    className,
}: {
    sizePx: number;
    emoji: Emoji;
    style?: CSSProperties;
    className?: string;
}) {
    const drawEmoji = useDrawEmoji();
    return (
        <DebugCanvas
            width={sizePx}
            height={sizePx}
            draw={(c) => {
                drawEmoji(c.ctx, emoji, sizePx);
            }}
            style={style}
            className={className}
        />
    );
}
