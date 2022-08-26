import Vector2 from "@/lib/geom/Vector2";
import { Viewport } from "@/splatapus/Viewport";
import classNames from "classnames";
import { ReactNode } from "react";

export function PositionedDiv({
    position,
    children,
    className,
}: {
    position: Vector2;
    children?: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={classNames("absolute top-0 left-0", className)}
            style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        >
            {children}
        </div>
    );
}

export function ScenePositionedDiv({
    position,
    viewport,
    screenOffset = Vector2.ZERO,
    children,
    className,
}: {
    position: Vector2;
    viewport: Viewport;
    screenOffset?: Vector2;
    children?: ReactNode;
    className?: string;
}) {
    return (
        <PositionedDiv
            position={viewport.sceneToScreen(position).add(screenOffset)}
            className={className}
        >
            {children}
        </PositionedDiv>
    );
}
