import { useEvent } from "@/lib/hooks/useEvent";
import { CallbackAction, get, ReadonlyObjectMap } from "@/lib/utils";
import { ToolType } from "@/splatapus/editor/tools/ToolType";
import { useEditorEvents, useEditorState } from "@/splatapus/editor/useEditorState";
import React, { useEffect, useRef } from "react";

export type VfxActionName = "undo" | "redo" | ToolType;
let nextAnimationIdx = 1;

export type Vfx = {
    readonly activeAnimations: ReadonlyObjectMap<VfxActionName, number>;
};

export const Vfx = {
    initialize: (): Vfx => ({ activeAnimations: {} }),
    triggerAnimation: (vfx: Vfx, name: VfxActionName): Vfx => {
        return {
            activeAnimations: {
                ...vfx.activeAnimations,
                [name]: nextAnimationIdx++,
            },
        };
    },
    getActiveAnimationId: (vfx: Vfx, name: VfxActionName): number | null => {
        return get(vfx.activeAnimations, name) ?? null;
    },
    acknowledgeAnimation: (vfx: Vfx, name: VfxActionName, activeAnimationVersion: number): Vfx => {
        const { [name]: foundVersion, ...remaining } = vfx.activeAnimations;
        if (foundVersion !== activeAnimationVersion) {
            return vfx;
        }
        return {
            activeAnimations: remaining,
        };
    },
};

export class VfxController {
    constructor(private readonly updateVfx: (update: CallbackAction<Vfx>) => void) {}
    triggerAnimation(name: VfxActionName) {
        this.updateVfx((vfx) => Vfx.triggerAnimation(vfx, name));
    }
}

export function useVfxAnimation<T extends HTMLElement>(
    name: VfxActionName,
    animate: () => KeyframeAnimationOptions & {
        keyFrames: Array<Keyframe> | PropertyIndexedKeyframes;
    },
): React.RefObject<T> {
    const ref = useRef<T | null>(null);
    const activeAnimationVersion = useEditorState((state) =>
        Vfx.getActiveAnimationId(state.vfx, name),
    );
    const { updateVfx } = useEditorEvents();

    const getAnimationConfig = useEvent(animate);
    useEffect(() => {
        const element = ref.current;
        if (!element || !activeAnimationVersion) {
            return undefined;
        }

        const config = getAnimationConfig();
        const animation = element.animate(config.keyFrames, config);
        animation.addEventListener("finish", () => {
            updateVfx((ctx, vfx) => Vfx.acknowledgeAnimation(vfx, name, activeAnimationVersion));
        });
        animation.play();
        return () => {
            animation.cancel();
        };
    }, [activeAnimationVersion, getAnimationConfig, name, updateVfx]);

    return ref;
}
