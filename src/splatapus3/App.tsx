import { DebugPolyline } from "@/lib/DebugSvg";
import { Vector2 } from "@/lib/geom/Vector2";
import {
    sizeFromContentRect,
    useResizeObserver,
} from "@/lib/hooks/useResizeObserver";
import { getLocalStorageItem, setLocalStorageItem } from "@/lib/storage";
import { debounce } from "@/lib/utils";
import { Splat } from "@/splatapus3/model/Splat";
import {
    SerializedStoreSchema,
    ShapeId,
    SplatRecord,
    Store,
} from "@/splatapus3/model/schema";
import { track } from "@tldraw/state";
import { SerializedStore } from "@tldraw/store";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export function App() {
    const [container, setContainer] = useState<Element | null>(null);
    const size = useResizeObserver(container, sizeFromContentRect);
    const [store, setStore] = useState<Store | null>(null);

    useEffect(() => {
        const initialValue = getLocalStorageItem(
            "splatapus3.doc",
            SerializedStoreSchema,
            () => ({}) as SerializedStore<SplatRecord>,
        );
        const store = new Store(initialValue);
        setStore(store);

        const saveDebounced = debounce(1000, () => {
            setLocalStorageItem(
                "splatapus3.doc",
                SerializedStoreSchema,
                store.serialize("all"),
            );
        });

        const unsubscribe = store.listen(() => {
            saveDebounced();
        });

        return () => {
            unsubscribe();
            saveDebounced.cancel();
        };
    }, []);

    return (
        <div
            ref={setContainer}
            className="absolute inset-0 touch-none select-none overflow-hidden"
        >
            {size && store && <AppMain size={size} store={store} />}
        </div>
    );
}

const AppMain = track(function AppMain({
    size,
    store,
}: {
    size: Vector2;
    store: Store;
}) {
    const [splat, setSplat] = useState(() => new Splat(store));
    if (splat.store !== store) {
        setSplat(new Splat(store));
    }

    const canvasRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        splat.viewport.screenSize = size;
    }, [splat, size]);

    return (
        <>
            <div
                ref={canvasRef}
                className="absolute inset-0"
                onPointerDown={splat.interaction.onPointerDown}
                onPointerMove={splat.interaction.onPointerMove}
                onPointerUp={splat.interaction.onPointerUp}
                onPointerCancel={splat.interaction.onPointerCancel}
            >
                {splat.interaction.toDebugString()}
                <DocumentRenderer splat={splat} />
            </div>
        </>
    );
});

const DocumentRenderer = track(function DocumentRenderer({
    splat,
}: {
    splat: Splat;
}) {
    const { screenSize } = splat.viewport;
    return (
        <svg
            viewBox={`0 0 ${screenSize.x} ${screenSize.y}`}
            className="absolute left-0 top-0"
        >
            <g>
                <DocumentPathRenderer splat={splat} />
            </g>
        </svg>
    );
});

const DocumentPathRenderer = track(function DocumentPathRenderer({
    splat,
}: {
    splat: Splat;
}) {
    const { allShapeIds } = splat;
    return (
        <>
            {allShapeIds.map((shapeId) => (
                <StrokeRenderer key={shapeId} shapeId={shapeId} splat={splat} />
            ))}
        </>
    );
});

const StrokeRenderer = track(function StrokeRenderer({
    shapeId,
    splat,
}: {
    shapeId: ShapeId;
    splat: Splat;
}) {
    const shapeVersion = splat.getShapeVersion(
        shapeId,
        splat.activeKeyPoint.id,
    );
    return (
        <>
            <DebugPolyline points={shapeVersion.rawPoints} />
        </>
    );
});
