import { Vector2 } from "@/lib/geom/Vector2";
import { useLive } from "@/lib/live";
import { Splatapus } from "@/splatapus/editor/useEditor";
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
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                ...style,
            }}
            {...props}
        >
            {children}
        </div>
    );
}

interface ScenePositionedDivProps extends PositionedDivProps {
    screenOffset?: Vector2;
    splatapus: Splatapus;
}

export function ScenePositionedDiv({
    position,
    screenOffset = Vector2.ZERO,
    splatapus,
    ...props
}: ScenePositionedDivProps) {
    const screenPosition = useLive(
        () => splatapus.viewport.sceneToScreenLive(position).add(screenOffset),
        [position, screenOffset, splatapus.viewport],
    );
    return <PositionedDiv position={screenPosition} {...props} />;
}
