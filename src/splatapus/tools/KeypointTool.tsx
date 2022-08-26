import Vector2 from "@/lib/geom/Vector2";
import { ScenePositionedDiv } from "@/splatapus/renderer/Positioned";
import { createTool, ToolRenderComponent, ToolRenderProps } from "@/splatapus/tools/AbstractTool";
import classNames from "classnames";

export type KeypointToolState = {
    readonly type: "idle";
};

export class KeypointTool extends createTool<"keypoint", KeypointToolState>("keypoint") {
    static readonly toolName = "keypoint" as const;
    getSelected() {
        return this;
    }
    isIdle(): boolean {
        return this.state.type === "idle";
    }
    override getScreenHtmlComponent(): ToolRenderComponent {
        return KeyPointToolOverlay;
    }
    debugProperties(): Record<string, string> {
        return { _: this.state.type };
    }
}

const keypointOffset = new Vector2(-12, -12);
function KeyPointToolOverlay({ viewport, document, location, updateTool }: ToolRenderProps) {
    return (
        <>
            {Array.from(document.data.keyPoints, (keyPoint, i) => (
                <ScenePositionedDiv
                    key={keyPoint.id}
                    position={keyPoint.position}
                    screenOffset={keypointOffset}
                    viewport={viewport}
                    className={classNames(
                        "flex h-6 w-6 items-center justify-center rounded-full border border-stone-200 bg-white text-xs text-stone-400 shadow-md",
                        keyPoint.id === location.keyPointId
                            ? "text-stone-500 ring-2 ring-inset ring-purple-400"
                            : "text-stone-400",
                    )}
                >
                    {i + 1}
                </ScenePositionedDiv>
            ))}
        </>
    );
}
