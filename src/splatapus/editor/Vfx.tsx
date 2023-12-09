import { useEvent } from "@/lib/hooks/useEvent";
import { LiveValue, useLive } from "@/lib/live";
import { ReadonlyObjectMap, get } from "@/lib/utils";
import { ModeType } from "@/splatapus/editor/modes/Mode";
import React, { useEffect, useRef } from "react";

export type VfxActionName = "undo" | "redo" | ModeType;
let nextAnimationIdx = 1;

export class Vfx {
    activeAnimations = new LiveValue<ReadonlyObjectMap<VfxActionName, number>>(
        {},
        "vfx.activeAnimations",
    );

    triggerAnimation(name: VfxActionName) {
        this.activeAnimations.update((prev) => ({
            ...prev,
            [name]: nextAnimationIdx++,
        }));
    }

    getActiveAnimationIdLive(name: VfxActionName): number | null {
        return get(this.activeAnimations.live(), name) ?? null;
    }

    acknowledgeAnimation(name: VfxActionName, activeAnimationVersion: number) {
        this.activeAnimations.update((activeAnimations) => {
            const { [name]: foundVersion, ...remaining } = activeAnimations;
            if (foundVersion !== activeAnimationVersion) {
                return activeAnimations;
            }
            return remaining;
        });
    }
}

export function useVfxAnimation<T extends HTMLElement>(
    vfx: Vfx,
    name: VfxActionName,
    animate: () => KeyframeAnimationOptions & {
        keyFrames: Keyframe[] | PropertyIndexedKeyframes;
    },
): React.RefObject<T> {
    const ref = useRef<T | null>(null);
    const activeAnimationVersion = useLive(
        () => vfx.getActiveAnimationIdLive(name),
        [name, vfx],
    );

    const getAnimationConfig = useEvent(animate);
    useEffect(() => {
        const element = ref.current;
        if (!element || !activeAnimationVersion) {
            return undefined;
        }

        const config = getAnimationConfig();
        const animation = element.animate(config.keyFrames, config);
        animation.addEventListener("finish", () => {
            vfx.acknowledgeAnimation(name, activeAnimationVersion);
        });
        animation.play();
        return () => {
            animation.cancel();
        };
    }, [activeAnimationVersion, getAnimationConfig, name, vfx]);

    return ref;
}
