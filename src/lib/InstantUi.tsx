import { useEvent } from "@/lib/hooks/useEvent";
import {
    copyArrayAndReplace,
    deepEqual,
    exhaustiveSwitchError,
    UpdateAction,
} from "@/lib/utils";
import classNames from "classnames";
import { useId, useMemo, useRef, useState } from "react";

interface RangeUiEntry {
    readonly type: "range";
    readonly label: string;
    readonly min: number;
    readonly max: number;
    readonly step: number;
    readonly value: number;
    readonly oldValue: number;
}

interface CheckboxUiEntry {
    readonly type: "checkbox";
    readonly label: string;
    readonly value: boolean;
    readonly oldValue: boolean;
}

interface ColorPickerUiEntry<T> {
    readonly type: "colorPicker";
    readonly label: string;
    readonly value: T;
    readonly oldValue: T;
    readonly options: readonly { value: T; color: string }[];
}

interface SegmentedControlEntry<T> {
    readonly type: "segmentedControl";
    readonly label: string;
    readonly value: T;
    readonly oldValue: T;
    readonly options: readonly { label: string; value: T }[];
}

type UiEntry =
    | RangeUiEntry
    | CheckboxUiEntry
    | ColorPickerUiEntry<unknown>
    | SegmentedControlEntry<unknown>;

export function useInstantUi() {
    const [state, setState] = useState<readonly UiEntry[]>([]);
    const pendingUiRef = useRef<UiEntry[]>([]);

    const range = useEvent(
        (
            label: string,
            value: number,
            props: { min: number; max: number; step: number },
        ): number => {
            pendingUiRef.current.push({
                type: "range",
                label,
                value,
                oldValue: value,
                ...props,
            });
            return (
                state.find(
                    (entry): entry is RangeUiEntry =>
                        entry.type === "range" &&
                        entry.label === label &&
                        entry.oldValue === value,
                )?.value ?? value
            );
        },
    );
    const colorPicker = useEvent(function colorPicker<T>(
        label: string,
        value: T,
        options: readonly { value: T; color: string }[],
    ): unknown {
        pendingUiRef.current.push({
            type: "colorPicker",
            label,
            value,
            options,
            oldValue: value,
        });
        return (
            state.find(
                (entry): entry is ColorPickerUiEntry<T> =>
                    entry.type === "colorPicker" &&
                    entry.label === label &&
                    deepEqual(entry.oldValue, value),
            )?.value ?? value
        );
    });
    const segmentedControl = useEvent(function segmentedControl<T>(
        label: string,
        value: T,
        options: readonly { value: T; label: string }[],
    ) {
        pendingUiRef.current.push({
            type: "segmentedControl",
            label,
            value,
            options,
            oldValue: value,
        });
        return (
            state.find(
                (entry): entry is SegmentedControlEntry<T> =>
                    entry.type === "segmentedControl" &&
                    entry.label === label &&
                    deepEqual(entry.oldValue, value),
            )?.value ?? value
        );
    });
    const checkbox = useEvent((label: string, value: boolean): boolean => {
        pendingUiRef.current.push({
            type: "checkbox",
            label,
            value,
            oldValue: value,
        });
        return (
            state.find(
                (entry): entry is CheckboxUiEntry =>
                    entry.type === "checkbox" &&
                    entry.label === label &&
                    entry.oldValue === value,
            )?.value ?? value
        );
    });
    const flush = useEvent(() => {
        if (!deepEqual(state, pendingUiRef.current)) {
            setState(pendingUiRef.current);
        }
        pendingUiRef.current = [];
    });

    return {
        render: () => <InstantUiRenderer state={state} onChange={setState} />,
        ui: useMemo(
            () => ({ checkbox, range, flush, colorPicker, segmentedControl }),
            [checkbox, colorPicker, flush, range, segmentedControl],
        ),
    };
}

export type InstantUi = ReturnType<typeof useInstantUi>["ui"];

function InstantUiRenderer({
    state,
    onChange,
}: {
    state: readonly UiEntry[];
    onChange: (update: UpdateAction<readonly UiEntry[]>) => void;
}) {
    return (
        <>
            {state.map((entry, i) => {
                switch (entry.type) {
                    case "checkbox":
                        return (
                            <CheckboxInput
                                key={i}
                                label={entry.label}
                                value={entry.value}
                                onChange={(value) =>
                                    onChange(
                                        copyArrayAndReplace(state, i, {
                                            ...entry,
                                            value,
                                        }),
                                    )
                                }
                            />
                        );
                    case "range":
                        return (
                            <RangeInput
                                key={i}
                                label={entry.label}
                                value={entry.value}
                                onChange={(value) =>
                                    onChange(
                                        copyArrayAndReplace(state, i, {
                                            ...entry,
                                            value,
                                        }),
                                    )
                                }
                                min={entry.min}
                                max={entry.max}
                                step={entry.step}
                            />
                        );

                    case "colorPicker":
                        return (
                            <ColorPickerInput
                                key={i}
                                label={entry.label}
                                value={entry.value}
                                options={entry.options}
                                onChange={(value) =>
                                    onChange(
                                        copyArrayAndReplace(state, i, {
                                            ...entry,
                                            value,
                                        }),
                                    )
                                }
                            />
                        );

                    case "segmentedControl":
                        return (
                            <SegmentedControlInput
                                key={i}
                                label={entry.label}
                                value={entry.value}
                                options={entry.options}
                                onChange={(value) =>
                                    onChange(
                                        copyArrayAndReplace(state, i, {
                                            ...entry,
                                            value,
                                        }),
                                    )
                                }
                            />
                        );
                    default:
                        exhaustiveSwitchError(entry);
                }
            })}
        </>
    );
}

function RangeInput({
    label,
    value,
    onChange,
    min,
    max,
    step,
}: {
    label: string;
    value: number;
    onChange: (newValue: number) => void;
    min: number;
    max: number;
    step: number;
}) {
    const id = useId();
    return (
        <div className="flex flex-col gap-2 p-3">
            <label htmlFor={id}>{label}</label>
            <div className="flex items-center justify-between gap-3">
                <input
                    id={id}
                    className="w-2/3 flex-auto"
                    type="range"
                    value={value}
                    min={min}
                    max={max}
                    step={step}
                    onChange={(e) => onChange(e.currentTarget.valueAsNumber)}
                />
                <span className="w-1/3 flex-none text-right">
                    {value.toPrecision(3)}
                </span>
            </div>
        </div>
    );
}

function CheckboxInput({
    label,
    value,
    onChange,
}: {
    label: string;
    value: boolean;
    onChange: (newValue: boolean) => void;
}) {
    const id = useId();
    return (
        <div className="flex gap-3 p-3">
            <input
                id={id}
                type="checkbox"
                onChange={(e) => onChange(e.currentTarget.checked)}
                checked={value}
            />
            <label htmlFor={id}>{label}</label>
        </div>
    );
}

function ColorPickerInput({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: unknown;
    onChange: (newValue: unknown) => void;
    options: readonly { value: unknown; color: string }[];
}) {
    return (
        <div className="flex-col gap-3 p-3">
            {label}
            <div className="flex gap-1">
                {options.map((option, i) => (
                    <div
                        key={i}
                        style={{ background: option.color }}
                        className="flex h-6 flex-1 cursor-pointer items-center justify-center"
                        onClick={() => onChange(option.value)}
                    >
                        {deepEqual(option.value, value) && (
                            <div className="h-3 w-3 rounded-full border-2 border-black bg-white" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function SegmentedControlInput({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: unknown;
    onChange: (newValue: unknown) => void;
    options: readonly { value: unknown; label: string }[];
}) {
    return (
        <div className="flex-col gap-3 p-3">
            {label}
            <div className="flex gap-2">
                {options.map((option, i) => (
                    <button
                        key={i}
                        className={classNames(
                            "flex h-6 flex-auto items-center justify-center rounded text-sm",
                            deepEqual(option.value, value) ? "bg-gray-600" : (
                                "hover:bg-gray-800"
                            ),
                        )}
                        onClick={() => onChange(option.value)}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
