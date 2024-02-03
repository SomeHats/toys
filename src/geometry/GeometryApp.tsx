import { Vector2 } from "@/lib/geom/Vector2";
import {
    sizeFromBorderBox,
    useResizeObserver,
} from "@/lib/hooks/useResizeObserver";
import { Button } from "@/splatapus/ui/Button";
import classNames from "classnames";
import { useState } from "react";

export interface Entry {
    id: string;
    name: string;
    component: React.ComponentType<{ size: Vector2 }>;
}

export function GeometryApp({
    entries,
    current,
}: {
    entries: Entry[];
    current: Entry;
}) {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const size = useResizeObserver(container, sizeFromBorderBox);

    return (
        <div className="absolute inset-0 flex bg-stone-100 p-3 gap-3">
            <div className="flex flex-col gap-2">
                <h1 className="font-bold tracking-wide text-stone-600 text-center">
                    geometries
                </h1>
                <div>
                    {entries.map((entry) => {
                        const isActive = entry.id === current.id;
                        return (
                            <Button
                                key={entry.id}
                                href={`#/${entry.id}`}
                                className={classNames(
                                    isActive &&
                                        "pointer-events-none bg-gradient-to-br from-fuchsia-500 to-violet-500 !text-white",
                                )}
                            >
                                {entry.name}
                            </Button>
                        );
                    })}
                </div>
            </div>
            <div
                className="relative flex-auto touch-none bg-white rounded-lg"
                ref={setContainer}
            >
                {size && <current.component size={size} />}
            </div>
        </div>
    );
}
