import { useLive } from "@/lib/live";
import { toolClassNames } from "@/splatapus/editor/toolClassNames";
import { ToolType } from "@/splatapus/editor/tools/ToolType";
import { Splatapus } from "@/splatapus/editor/useEditor";
import { ActionButton } from "@/splatapus/ui/Button";
import classNames from "classnames";
import React, { ReactNode } from "react";

export const ModePicker = React.memo(function ModePicker({ splatapus }: { splatapus: Splatapus }) {
    return (
        <>
            <ModeButton toolType={ToolType.Draw} splatapus={splatapus}>
                draw
            </ModeButton>
            <ModeButton toolType={ToolType.Rig} splatapus={splatapus}>
                rig
            </ModeButton>
            <ModeButton toolType={ToolType.Play} splatapus={splatapus}>
                play
            </ModeButton>
        </>
    );
});

const ModeButton = function ModeButton({
    toolType,
    splatapus,
    children,
}: {
    toolType: ToolType;
    splatapus: Splatapus;
    children: ReactNode;
}) {
    const selectedToolType = useLive(
        () => splatapus.interaction.selectedTool.live().type,
        [splatapus.interaction],
    );

    const isActive = selectedToolType === toolType;
    return (
        <ActionButton
            actionName={toolType}
            vfx={splatapus.vfx}
            onClick={() => {
                splatapus.vfx.triggerAnimation(toolType);
                splatapus.interaction.requestSetSelectedTool(toolType);
            }}
            className={classNames(
                isActive &&
                    `pointer-events-none bg-gradient-to-br ${toolClassNames[toolType].gradient500} !text-white`,
            )}
            disabled={isActive}
        >
            {children}
        </ActionButton>
    );
};
