import { LiveEffect, LiveValue, runLive, useLiveValue } from "@/lib/live";
import { Schema, SchemaType } from "@/lib/schema";
import {
    getSessionStorageItemUnchecked,
    setSessionStorageItemUnchecked,
} from "@/lib/storage";
import { Button, PlainButton } from "@/splatapus/ui/Button";
import { useSquircleClipPath } from "@/splatapus/ui/useSquircle";
import { Popover, Switch, Transition } from "@headlessui/react";
import classNames from "classnames";
import { ReactNode, useState } from "react";

const STORAGE_KEY = "splatapus.debugSettings";

const debugSettingsSchema = Schema.object({
    shouldShowPoints: Schema.boolean,
    shouldShowRawPoints: Schema.boolean,
    shouldShowSmoothPoints: Schema.boolean,
    useSmartNormalization: Schema.boolean,
});

type DebugSettings = SchemaType<typeof debugSettingsSchema>;
const defaultDebugSettings: DebugSettings = {
    shouldShowPoints: false,
    shouldShowRawPoints: false,
    shouldShowSmoothPoints: false,
    useSmartNormalization: true,
};

export function DebugSettingsMenu() {
    const settings = useLiveValue(debugSettings);
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
                    className={classNames(
                        "flex  w-60 flex-col gap-3 bg-stone-100 p-3",
                    )}
                    style={{ clipPath }}
                >
                    <ToggleItem
                        label="Show points"
                        value={settings.shouldShowPoints}
                        onChange={(shouldShowPoints) =>
                            debugSettings.update({
                                ...settings,
                                shouldShowPoints,
                            })
                        }
                    />
                    <ToggleItem
                        label="Show raw points"
                        value={settings.shouldShowRawPoints}
                        onChange={(shouldShowRawPoints) =>
                            debugSettings.update({
                                ...settings,
                                shouldShowRawPoints,
                            })
                        }
                    />
                    <ToggleItem
                        label="Smooth points"
                        value={settings.shouldShowSmoothPoints}
                        onChange={(shouldShowSmoothPoints) =>
                            debugSettings.update({
                                ...settings,
                                shouldShowSmoothPoints,
                            })
                        }
                    />
                    <ToggleItem
                        label="Smart normalization"
                        value={settings.useSmartNormalization}
                        onChange={(useSmartNormalization) =>
                            debugSettings.update({
                                ...settings,
                                useSmartNormalization,
                            })
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
    const contents = getSessionStorageItemUnchecked(STORAGE_KEY);
    try {
        return debugSettingsSchema
            .parse(JSON.parse(contents as string))
            .unwrap();
    } catch (err) {
        return defaultDebugSettings;
    }
}

const debugSettings = new LiveValue(readDebugSettings(), "debugSettings");
runLive(LiveEffect.idle, () => {
    setSessionStorageItemUnchecked(
        STORAGE_KEY,
        JSON.stringify(debugSettings.live()),
    );
});

export function useDebugSetting<K extends keyof DebugSettings>(
    key: K,
): DebugSettings[K] {
    return useLiveValue(debugSettings)[key];
}
