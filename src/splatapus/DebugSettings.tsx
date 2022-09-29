import { Cell, useCell, useCellValue } from "@/lib/Cell";
import { createShapeParser, parseBoolean, ParserType } from "@/lib/objectParser";
import { getLocalStorageItem, setLocalStorageItem } from "@/lib/utils";
import { Button, PlainButton } from "@/splatapus/ui/Button";
import { useSquircleClipPath } from "@/splatapus/ui/useSquircle";
import { Popover, Transition, Switch } from "@headlessui/react";
import classNames from "classnames";
import { ReactNode, useState } from "react";

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
    const [menu, setMenu] = useState<HTMLElement | null>(null);
    const clipPath = useSquircleClipPath(menu, 16);

    return (
        <Popover className="pointer-events-auto relative px-3 py-2 opacity-0 hover:opacity-100 ui-open:opacity-100">
            <Popover.Button as={Button}>!</Popover.Button>
            <Transition
                className="absolute bottom-12 right-3 origin-bottom-right"
                enter="transition duration-200 ease-out-back"
                enterFrom="opacity-0 scale-75"
                enterTo="opacity-100"
                leave="transition duration-300 ease-in-back"
                leaveFrom="opacity-100"
                leaveTo="opacity-0 scale-75"
            >
                <Popover.Panel
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
                </Popover.Panel>
            </Transition>
        </Popover>
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
    return (
        <Switch
            checked={value}
            onChange={onChange}
            as={PlainButton}
            className="justify-between py-1 pl-3 pr-1"
        >
            <span>{label}</span>
            <div className="relative inline-flex h-6 w-10 rounded-full bg-stone-200 transition ui-checked:bg-green-400">
                <div className="absolute top-[2px] left-[2px] h-5 w-5 rounded-full bg-white transition ui-checked:translate-x-4" />
            </div>
        </Switch>
    );
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
