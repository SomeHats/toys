import { paths } from "@/geometry/paths";
import Circle from "@/lib/geom/Circle";
import { Vector2 } from "@/lib/geom/Vector2";
import {
    DragStartGestureHandler,
    TapGestureHandler,
    useGestureDetector,
} from "@/lib/hooks/useGestureDetector";
import { reactive } from "@/lib/signia";
import { tailwindColors } from "@/lib/theme";
import { track } from "@tldraw/state-react";
import {
    Fragment,
    ReactNode,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";

const interactionDistance = 10;

interface GeoProps {
    isHovered: boolean;
    isGestureInProgress: boolean;
    cursor: Vector2;
}
interface Geo {
    distanceTo(point: Vector2): number;
    gestures: {
        onTap?: TapGestureHandler;
        onDragStart?: DragStartGestureHandler;
    };
    render(props: GeoProps): JSX.Element;
}

export class GeoCircle implements Geo {
    @reactive accessor circle: Circle;
    @reactive accessor color: string;

    constructor({
        x = 0,
        y = 0,
        r = 100,
        color = tailwindColors.fuchsia500 as string,
    } = {}) {
        this.circle = Circle.create(x, y, r);
        this.color = color;
    }

    getDistanceToEdge(point: Vector2) {
        return Math.abs(
            this.circle.center.distanceTo(point) - this.circle.radius,
        );
    }

    getDistanceToCenter(point: Vector2) {
        return this.circle.center.distanceTo(point);
    }

    distanceTo(point: Vector2) {
        return Math.min(
            this.getDistanceToCenter(point),
            this.getDistanceToEdge(point),
        );
    }

    gestures = {
        onDragStart: (ev) => {
            const initialPoint = Vector2.fromEvent(ev);
            if (
                this.getDistanceToCenter(initialPoint) <
                this.getDistanceToEdge(initialPoint)
            ) {
                // Dragging the center - move the shape
                const offset = initialPoint.sub(this.circle.center);
                return {
                    couldBeTap: false,
                    pointerCapture: true,
                    onCancel: () => {},
                    onMove: (ev) => {
                        this.circle = new Circle(
                            Vector2.fromEvent(ev).sub(offset),
                            this.circle.radius,
                        );
                    },
                    onEnd: () => {},
                };
            }

            // Dragging the edge - resize the shape
            const centerToPoint = initialPoint.sub(this.circle.center);
            const offset = centerToPoint
                .withMagnitude(this.circle.radius)
                .sub(centerToPoint);

            return {
                couldBeTap: false,
                pointerCapture: true,
                onCancel: () => {},
                onMove: (ev) => {
                    this.circle = this.circle.withRadius(
                        Vector2.fromEvent(ev)
                            .add(offset)
                            .distanceTo(this.circle.center),
                    );
                },
                onEnd: () => {},
            };
        },
    } satisfies Geo["gestures"];

    static Component = track(function GeoCircleComponent({
        geo,
        isHovered,
        cursor,
    }: { geo: GeoCircle } & GeoProps) {
        const isNearerCenter =
            geo.getDistanceToCenter(cursor) < geo.getDistanceToEdge(cursor);
        return (
            <>
                {isHovered && isNearerCenter && (
                    <circle
                        cx={geo.circle.center.x}
                        cy={geo.circle.center.y}
                        r={interactionDistance}
                        fill={tailwindColors.sky400}
                        opacity={0.5}
                    />
                )}
                {isHovered && !isNearerCenter && (
                    <circle
                        cx={geo.circle.center.x}
                        cy={geo.circle.center.y}
                        r={geo.circle.radius}
                        fill="none"
                        strokeWidth={interactionDistance}
                        stroke={tailwindColors.sky400}
                        opacity={0.5}
                    />
                )}
                <circle
                    cx={geo.circle.center.x}
                    cy={geo.circle.center.y}
                    r={2}
                    fill={geo.color}
                />
                <circle
                    cx={geo.circle.center.x}
                    cy={geo.circle.center.y}
                    r={geo.circle.radius}
                    fill="none"
                    stroke={geo.color}
                    strokeWidth={3}
                />
            </>
        );
    });

    render(props: GeoProps) {
        return <GeoCircle.Component geo={this} {...props} />;
    }
}

export class GeoPoint implements Geo {
    @reactive accessor point: Vector2;
    @reactive accessor color: string;

    constructor({
        x = 0,
        y = 0,
        color = tailwindColors.fuchsia500 as string,
    } = {}) {
        this.point = new Vector2(x, y);
        this.color = color;
    }

    distanceTo(point: Vector2) {
        return this.point.distanceTo(point);
    }

    gestures = {
        onDragStart: (ev) => {
            const initialPoint = Vector2.fromEvent(ev);
            // Dragging the center - move the shape
            const offset = initialPoint.sub(this.point);
            return {
                couldBeTap: false,
                pointerCapture: true,
                onCancel: () => {},
                onMove: (ev) => {
                    this.point = Vector2.fromEvent(ev).sub(offset);
                },
                onEnd: () => {},
            };
        },
    } satisfies Geo["gestures"];

    static Component = track(function GeoCircleComponent({
        geo,
        isHovered,
    }: { geo: GeoPoint } & GeoProps) {
        return (
            <>
                {isHovered && (
                    <circle
                        cx={geo.point.x}
                        cy={geo.point.y}
                        r={interactionDistance}
                        fill={tailwindColors.sky400}
                        opacity={0.5}
                    />
                )}
                <path
                    d={paths.x(geo.point)}
                    strokeWidth={3}
                    stroke={geo.color}
                />
            </>
        );
    });

    render(props: GeoProps) {
        return <GeoPoint.Component geo={this} {...props} />;
    }
}

export const GeometryExperiment = track(function GeometryExperiment<
    T extends Record<string, Geo>,
>({
    size,
    shapes,
    below,
    above,
}: {
    size: Vector2;
    shapes: T;
    below?: ReactNode;
    above?: ReactNode;
}) {
    const ref = useRef<SVGSVGElement>(null);
    const [offset, setOffset] = useState(Vector2.ZERO);
    const [activeShape, setActiveShape] = useState<Geo | null>(null);
    const [cursor, setCursor] = useState<Vector2>(Vector2.ZERO);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useLayoutEffect(() => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const next = new Vector2(rect.left, rect.top);
        setOffset((ofs) => {
            if (ofs.equals(next)) return ofs;
            return next;
        });
    });

    useEffect(() => {
        const handler = (e: PointerEvent) => {
            const next = Vector2.fromEvent(e);
            setCursor((prev) => {
                if (prev.equals(next)) return prev;
                return next;
            });
        };

        window.addEventListener("pointermove", handler);
        return () => window.removeEventListener("pointermove", handler);
    }, []);

    let nearestId: string | null = null;
    let nearestDistance = Infinity;
    for (const [id, shape] of Object.entries(shapes)) {
        const distance = shape.distanceTo(cursor);
        if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestId = id;
        }
    }

    const hovered =
        nearestId && nearestDistance < interactionDistance ?
            shapes[nearestId]
        :   null;

    const { isGestureInProgress, events } = useGestureDetector({
        onDragStart: (event) => {
            if (!hovered?.gestures.onDragStart) return null;
            setActiveShape(hovered);
            return hovered.gestures.onDragStart(event);
        },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!isGestureInProgress) setActiveShape(null);
    });

    return (
        <svg
            ref={ref}
            width={size.x}
            height={size.y}
            viewBox={`${offset.x} ${offset.y} ${size.x} ${size.y}`}
            {...events}
        >
            <g strokeLinecap="round" strokeLinejoin="round">
                {below}
                {Object.entries(shapes).map(([key, shape]) => {
                    return (
                        <Fragment key={key}>
                            {shape.render({
                                isHovered:
                                    isGestureInProgress ?
                                        activeShape === shape
                                    :   hovered === shape,
                                isGestureInProgress:
                                    isGestureInProgress &&
                                    activeShape === shape,
                                cursor,
                            })}
                        </Fragment>
                    );
                })}
                {above}
            </g>
        </svg>
    );
});
