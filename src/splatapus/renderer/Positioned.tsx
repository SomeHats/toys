import Vector2 from "@/lib/geom/Vector2";
import { useEditorState } from "@/splatapus/editor/useEditorState";
import classNames from "classnames";
import { ComponentProps } from "react";

interface PositionedDivProps extends ComponentProps<"div"> {
    position: Vector2;
}

export function PositionedDiv({
    position,
    children,
    className,
    style,
    ...props
}: PositionedDivProps) {
    return (
        <div
            className={classNames("absolute top-0 left-0", className)}
            style={{ transform: `translate(${position.x}px, ${position.y}px)`, ...style }}
            {...props}
        >
            {children}
        </div>
    );
}

interface ScenePositionedDiv extends PositionedDivProps {
    screenOffset?: Vector2;
}

export function ScenePositionedDiv({
    position,
    screenOffset = Vector2.ZERO,
    ...props
}: ScenePositionedDiv) {
    const viewport = useEditorState((state) => state.location.viewport);
    return (
        <PositionedDiv position={viewport.sceneToScreen(position).add(screenOffset)} {...props} />
    );
}
