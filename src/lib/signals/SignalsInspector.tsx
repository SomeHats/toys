import DragCover from "@/lib/DragCover";
import { assert } from "@/lib/assert";
import { useLocalStorageState } from "@/lib/hooks/useStoredState";
import { ListenToMidiInputFn } from "@/lib/midi";
import { Schema } from "@/lib/schema";
import {
    ControllableSignal,
    Signal,
    SignalManager,
} from "@/lib/signals/Signals";
import useSignal from "@/lib/signals/useSignal";
import { groupBy, mapRange, partition, sortBy } from "@/lib/utils";
import cx from "classnames";
import * as React from "react";
import { useSubscription } from "use-subscription";

const format = (value: number, significantFigures: number): string => {
    const valueParts = value.toString().split(".");
    if (valueParts.length === 1) {
        return valueParts[0];
    } else if (valueParts.length === 2) {
        if (valueParts[0].length >= significantFigures) {
            return valueParts[0];
        } else {
            const decimalFigures = significantFigures - valueParts[0].length;
            return `${valueParts[0]}.${valueParts[1].slice(0, decimalFigures)}`;
        }
    }

    throw new Error(`unexpected number of value parts: ${valueParts.length}`);
};

const SignalValue = React.memo(function _SignalValue({
    signal,
    className,
}: {
    signal: Signal;
    className?: string;
}) {
    const value = useSignal(signal);

    return (
        <div className={cx("text-gray-400", className)}>{format(value, 5)}</div>
    );
});

const SignalGraph = React.memo(function _SignalGraph({
    signals,
    width,
}: {
    signals: ReadonlyArray<Signal>;
    width: number;
}) {
    const pad = 8;
    const rangeFontSize = 8;

    let [{ lines, min, max }, setState] = React.useState(() => {
        const initialValues = signals.map((s) => s.read());
        return {
            lines: initialValues.map((value) => [value]),
            min: Math.min(...initialValues),
            max: Math.max(...initialValues),
        };
    });

    React.useEffect(() => {
        return signals[0].manager.onUpdate(() => {
            const nextPoints = signals.map((s) => s.read());
            setState((prev) => ({
                lines: prev.lines.map((prevLine, i) => [
                    nextPoints[i],
                    ...prevLine.slice(0, width - 1),
                ]),
                min: Math.min(prev.min, ...nextPoints),
                max: Math.max(prev.max, ...nextPoints),
            }));
        });
    }, [signals, width]);

    const height = Math.round(width / 2);
    if (min === max) {
        min = min - 0.1;
        max = max + 0.1;
    }

    return (
        <svg width={width} height={height}>
            <text
                x={width - pad}
                y={rangeFontSize + pad}
                fill="#cbd5e0"
                fontSize={rangeFontSize}
                textAnchor="end"
            >
                {format(max, 5)}
            </text>
            <text
                x={width - pad}
                y={height - pad}
                fill="#cbd5e0"
                fontSize={rangeFontSize}
                textAnchor="end"
            >
                {format(min, 5)}
            </text>
            {lines.map((points, i) => {
                const pathParts = [];
                for (let i = 0; i < points.length; i++) {
                    const command = i === 0 ? "M" : "L";
                    pathParts.push(
                        `${command} ${width - i} ${mapRange(
                            min,
                            max,
                            height - pad,
                            pad,
                            points[i],
                        ).toFixed(1)}`,
                    );
                }
                return (
                    <path
                        key={i}
                        d={pathParts.join(" ")}
                        stroke="#cbd5e0"
                        strokeWidth={1}
                        fill="none"
                    />
                );
            })}
        </svg>
    );
});

function SignalControl({
    name,
    signal,
    listenToMidi,
}: {
    name: string;
    signal: ControllableSignal;
    listenToMidi: ListenToMidiInputFn;
}) {
    const [isWaitingForMidi, setIsWaitingForMidi] = React.useState(false);
    const [midiControlId, setMidiControlId] = useLocalStorageState(
        `midiControlForSignal.${name}`,
        Schema.string.nullable(),
        null,
    );

    React.useEffect(() => {
        return listenToMidi(({ id, value }) => {
            if (!signal.range) {
                return;
            }
            if (isWaitingForMidi) {
                setMidiControlId(id);
                setIsWaitingForMidi(false);
                signal.set(
                    mapRange(0, 1, signal.range[0], signal.range[1], value),
                );
            } else if (id === midiControlId) {
                signal.set(
                    mapRange(0, 1, signal.range[0], signal.range[1], value),
                );
            }
        });
    }, [
        listenToMidi,
        signal,
        isWaitingForMidi,
        midiControlId,
        setMidiControlId,
    ]);

    function onClickMidiButton(e: React.MouseEvent) {
        e.stopPropagation();
        if (midiControlId === null) {
            setIsWaitingForMidi(!isWaitingForMidi);
        } else {
            setMidiControlId(null);
        }
    }

    function onMouseDown(e: React.MouseEvent) {
        e.preventDefault();

        const startYPosition = e.screenY;
        const startSignalValue = signal.read();
        const adjustPerPx =
            signal.range ?
                Math.abs(signal.range[1] - signal.range[0]) / 250
            :   Math.abs(
                    startSignalValue === 0 ? 0.1 : startSignalValue * 0.01,
                );

        const onMove = (nextYPosition: number) => {
            const delta = (startYPosition - nextYPosition) * adjustPerPx;
            signal.set(startSignalValue + delta);
        };

        const dragCover = new DragCover({
            move: (e: MouseEvent) => {
                onMove(e.screenY);
            },
            up: (e: MouseEvent) => {
                onMove(e.screenY);
                dragCover.remove();
            },
            cursor: "ns-resize",
        });

        dragCover.attach();
    }

    return (
        <>
            {signal.range && (
                <div
                    className={cx(
                        "cursor-pointer px-1 py-1",
                        isWaitingForMidi ? "text-gray-100"
                        : midiControlId !== null ? "text-gray-300"
                        : "text-gray-500 hover:text-gray-300",
                    )}
                    onClick={onClickMidiButton}
                >
                    {isWaitingForMidi ?
                        "◎"
                    : midiControlId !== null ?
                        "◉"
                    :   "○"}
                </div>
            )}
            <div
                className="cursor-move py-1 pr-2 pl-1"
                style={{ cursor: "ns-resize" }}
                onMouseDown={onMouseDown}
            >
                ↕
                <SignalValue signal={signal} className="inline-block pl-1" />
            </div>
        </>
    );
}

const SignalInspector = React.memo(function _SignalInspector({
    signals,
    name,
    displayName = name,
    width,
    listenToMidi,
}: {
    signals: ReadonlyArray<Signal>;
    name: string;
    displayName?: string;
    width: number;
    listenToMidi: ListenToMidiInputFn;
}) {
    const [isExpanded, setIsExpanded] = useLocalStorageState(
        `signal.${name}`,
        Schema.boolean,
        false,
    );
    const controllableSignals = signals.filter(
        (s): s is ControllableSignal => s instanceof ControllableSignal,
    );

    return (
        <div className="border-t border-gray-700 text-xs">
            <div
                className="flex cursor-pointer hover:bg-gray-800"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex-auto whitespace-pre px-2 py-1">
                    {displayName}
                </div>
                {controllableSignals.length ?
                    <SignalControl
                        name={name}
                        signal={controllableSignals[0]}
                        listenToMidi={listenToMidi}
                    />
                :   <SignalValue signal={signals[0]} className="px-2 py-1" />}
            </div>
            {isExpanded && <SignalGraph signals={signals} width={width} />}
        </div>
    );
});

function SignalInspectorGroup({
    groupName,
    signalNamePairs,
    width,
    listenToMidi,
}: {
    groupName: string;
    signalNamePairs: ReadonlyArray<readonly [string, ReadonlyArray<Signal>]>;
    width: number;
    listenToMidi: ListenToMidiInputFn;
}) {
    const [isExpanded, setIsExpanded] = useLocalStorageState(
        `group.${groupName}`,
        Schema.boolean,
        false,
    );
    return (
        <div className="border-t border-gray-700 text-xs">
            <div
                className="flex cursor-pointer px-2 py-1 hover:bg-gray-800"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex-auto">{groupName}</div>
                <div className="text-gray-600">{isExpanded ? "▽" : "▷"}</div>
            </div>
            {isExpanded && (
                <>
                    {signalNamePairs.map(([name, signals]) => (
                        <SignalInspector
                            key={name}
                            name={name}
                            displayName={`  ${name.slice(
                                groupName.length + 1,
                            )}`}
                            signals={signals}
                            width={width}
                            listenToMidi={listenToMidi}
                        />
                    ))}
                </>
            )}
        </div>
    );
}

const SignalsInspector = React.memo(function _SignalsInspector({
    signalManager,
    width,
    listenToMidi,
}: {
    signalManager: SignalManager;
    width: number;
    listenToMidi: ListenToMidiInputFn;
}) {
    const signalsByName = useSubscription(
        React.useMemo(
            () => ({
                getCurrentValue: () => signalManager.debugSignalsByName,
                subscribe: (cb) => signalManager.onDebugSignalsChange(cb),
            }),
            [signalManager],
        ),
    );

    const signalNamePairs = sortBy(
        Object.entries(signalsByName).filter(([name]) => !name.startsWith("_")),
        (pair) => pair[0],
    );
    const [groupedSignalNamePairs, ungroupedSignalNamePairs] = partition(
        signalNamePairs,
        ([name]) => name.includes("."),
    );

    const signalGroups = groupBy(groupedSignalNamePairs, ([name]) => {
        const lastDotIdx = name.indexOf(".");
        assert(lastDotIdx !== -1);
        return name.slice(0, lastDotIdx);
    });

    return (
        <div
            className="absolute right-0 top-0 bottom-0 h-full overflow-auto border-l border-gray-600 text-sm"
            style={{ width }}
        >
            <div className="py-1 px-2">signals</div>
            {Array.from(signalGroups).map(([group, signalNamePairs]) => (
                <SignalInspectorGroup
                    key={group}
                    groupName={group}
                    signalNamePairs={signalNamePairs}
                    width={width - 1}
                    listenToMidi={listenToMidi}
                />
            ))}
            {ungroupedSignalNamePairs.map(([name, signals]) => (
                <SignalInspector
                    key={name}
                    name={name}
                    signals={signals}
                    width={width - 1}
                    listenToMidi={listenToMidi}
                />
            ))}
        </div>
    );
});

export default SignalsInspector;
