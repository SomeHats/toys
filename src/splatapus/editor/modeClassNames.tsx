import { useLive } from "@/lib/live";
import { ModeType } from "@/splatapus/editor/modes/ModeType";
import { Splatapus } from "@/splatapus/editor/useEditor";

export type ModeClassNames = {
    [Mode in ModeType]: {
        gradient500: string;
        border500: string;
        ring500: string;
    };
};

export const modeClassNames: ModeClassNames = {
    [ModeType.Draw]: {
        gradient500: "from-fuchsia-500 to-violet-500",
        border500: "border-purple-500",
        ring500: "ring-purple-500",
    },
    [ModeType.Rig]: {
        gradient500: "from-cyan-500 to-blue-500",
        border500: "border-sky-500",
        ring500: "ring-sky-500",
    },
    [ModeType.Play]: {
        gradient500: "from-lime-500 to-emerald-500",
        border500: "border-green-500",
        ring500: "ring-green-500",
    },
};

export function useModeClassNames(splatapus: Splatapus) {
    const selectedModeType = useLive(
        () => splatapus.interaction.activeMode.live().type,
        [splatapus],
    );
    return modeClassNames[selectedModeType];
}
