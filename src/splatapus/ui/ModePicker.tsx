import { useLive } from "@/lib/live";
import { modeClassNames } from "@/splatapus/editor/modeClassNames";
import { ModeType } from "@/splatapus/editor/modes/Mode";
import { Splatapus } from "@/splatapus/editor/useEditor";
import { ActionButton } from "@/splatapus/ui/Button";
import classNames from "classnames";
import React, { ReactNode } from "react";

export const ModePicker = React.memo(function ModePicker({
    splatapus,
}: {
    splatapus: Splatapus;
}) {
    return (
        <>
            <ModeButton modeType={ModeType.Draw} splatapus={splatapus}>
                draw
            </ModeButton>
            <ModeButton modeType={ModeType.Rig} splatapus={splatapus}>
                rig
            </ModeButton>
            <ModeButton modeType={ModeType.Play} splatapus={splatapus}>
                play
            </ModeButton>
        </>
    );
});

const ModeButton = function ModeButton({
    modeType,
    splatapus,
    children,
}: {
    modeType: ModeType;
    splatapus: Splatapus;
    children: ReactNode;
}) {
    const selectedModeType = useLive(
        () => splatapus.interaction.activeMode.live().type,
        [splatapus.interaction],
    );

    const isActive = selectedModeType === modeType;
    return (
        <ActionButton
            actionName={modeType}
            vfx={splatapus.vfx}
            onClick={() => {
                splatapus.vfx.triggerAnimation(modeType);
                splatapus.interaction.requestSetActiveMode(modeType);
            }}
            className={classNames(
                isActive &&
                    `pointer-events-none bg-gradient-to-br ${modeClassNames[modeType].gradient500} !text-white`,
            )}
            disabled={isActive}
        >
            {children}
        </ActionButton>
    );
};
