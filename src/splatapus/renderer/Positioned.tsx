import Vector2 from "@/lib/geom/Vector2";
import { Viewport } from "@/splatapus/Viewport";
import classNames from "classnames";
import { ComponentProps, ReactNode } from "react";

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
    viewport: Viewport;
    screenOffset?: Vector2;
}

export function ScenePositionedDiv({
    position,
    viewport,
    screenOffset = Vector2.ZERO,
    ...props
}: ScenePositionedDiv) {
    return (
        <PositionedDiv position={viewport.sceneToScreen(position).add(screenOffset)} {...props} />
    );
}
