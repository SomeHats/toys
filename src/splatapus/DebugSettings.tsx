import { assertExists } from "@/lib/assert";
import { Cell, useCell, useCellValue } from "@/lib/Cell";
import { createShapeParser, parseBoolean, ParserType } from "@/lib/objectParser";
import { getLocalStorageItem, setLocalStorageItem } from "@/lib/utils";
import { Button } from "@/splatapus/ui/Button";
import { useSquircleClipPath } from "@/splatapus/ui/useSquircle";
import classNames from "classnames";
import { ReactNode, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "splatapus.debugSettings";

const parseDebugSettings = createShapeParser({
    shouldShowPoints: parseBoolean,
});

type DebugSettings = ParserType<typeof parseDebugSettings>;
const defaultDebugSettings: DebugSettings = {
    shouldShowPoints: false,
};

export function DebugSettingsMenu() {
    const [settings, setSettings] = useCell(debugSettings);
    const [isVisible, setIsVisible] = useState(false);
    const [menu, setMenu] = useState<HTMLElement | null>(null);
    const clipPath = useSquircleClipPath(menu, 24);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = assertExists(containerRef.current);
        if (!isVisible) {
            return undefined;
        }

        const hideIfOutside = (event: Event) => {
            if (event.target instanceof Node && !container.contains(event.target)) {
                setIsVisible(false);
            }
        };
        window.addEventListener("pointerdown", hideIfOutside);
        return () => {
            window.removeEventListener("pointerdown", hideIfOutside);
        };
    });

    return (
        <div className="pointer-events-auto relative px-3 py-2" ref={containerRef}>
            <Button onClick={() => setIsVisible(!isVisible)}>!</Button>
            <div
                className={classNames(
                    "absolute bottom-12 right-3 origin-bottom-right drop-shadow transition-all duration-200",
                    isVisible ? "ease-out-back" : "scale-75 opacity-0 ease-in-back",
                )}
                aria-hidden={!isVisible}
                tabIndex={-1}
            >
                <div
                    ref={setMenu}
                    className={classNames("flex  w-60 flex-col gap-3 bg-stone-100 p-3")}
                    style={{ clipPath }}
                >
                    <ToggleItem
                        label="Show points"
                        value={settings.shouldShowPoints}
                        onChange={(shouldShowPoints) =>
                            setSettings({ ...settings, shouldShowPoints })
                        }
                    />
                    <ToggleItem
                        label="Show points"
                        value={settings.shouldShowPoints}
                        onChange={(shouldShowPoints) =>
                            setSettings({ ...settings, shouldShowPoints })
                        }
                    />
                </div>
            </div>
        </div>
    );
}

function ToggleItem({
    label,
    value,
    onChange,
}: {
    label: ReactNode;
    value: boolean;
    onChange: (newValue: boolean) => void;
}) {
    return <Button>{label}</Button>;
}

function readDebugSettings(): DebugSettings {
    const contents = getLocalStorageItem(STORAGE_KEY);
    try {
        return parseDebugSettings(JSON.parse(contents as string)).unwrap();
    } catch (err) {
        return defaultDebugSettings;
    }
}

const debugSettings = new Cell(readDebugSettings());
debugSettings.subscribe((nextSettings) => {
    setLocalStorageItem(STORAGE_KEY, JSON.stringify(nextSettings));
});

export function useDebugSetting<K extends keyof DebugSettings>(key: K): DebugSettings[K] {
    return useCellValue(debugSettings).shouldShowPoints;
}
