import { Signal, SignalManager, ControllableSignal } from './Signals';
import * as React from 'react';
import { useSubscription } from 'use-subscription';
import {
  groupBy,
  sortBy,
  partition,
  mapRange,
  setLocalStorageItem,
} from '../lib/utils';
import { assert } from '../lib/assert';
import useLocalStorage from '../lib/hooks/useLocalStorageState';
import DragCover from '../lib/DragCover';
import cx from 'classnames';
import { ListenToMidiInputFn } from '../lib/midi';

const format = (value: number, significantFigures: number): string => {
  const valueParts = value.toString().split('.');
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
  const value = useSubscription(
    React.useMemo(
      () => ({
        getCurrentValue: () => signal.read(),
        subscribe: (cb) => signal.manager.onUpdate(cb),
      }),
      [signal],
    ),
  );

  return (
    <div className={cx('text-gray-400', className)}>{format(value, 5)}</div>
  );
});

const SignalGraph = React.memo(function _SignalGraph({
  signal,
  width,
}: {
  signal: Signal;
  width: number;
}) {
  const pad = 8;
  const rangeFontSize = 8;

  let [{ points, min, max }, setState] = React.useState(() => ({
    points: [signal.read()],
    min: signal.read(),
    max: signal.read(),
  }));

  React.useEffect(() => {
    return signal.manager.onUpdate(() => {
      const nextPoint = signal.read();
      setState((prev) => ({
        points: [nextPoint, ...prev.points.slice(0, width - 1)],
        min: Math.min(prev.min, nextPoint),
        max: Math.max(prev.max, nextPoint),
      }));
    });
  }, [signal]);

  const height = Math.round(width / 2);
  if (min === max) {
    min = min - 0.1;
    max = max + 0.1;
  }

  let pathParts = [];
  for (let i = 0; i < points.length; i++) {
    const command = i === 0 ? 'M' : 'L';
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
      <path
        d={pathParts.join(' ')}
        stroke="#cbd5e0"
        strokeWidth={1}
        fill="none"
      />
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
  const [midiControlId, setMidiControlId] = useLocalStorage<string | null>(
    `midiControlForSignal.${name}`,
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
        signal.set(mapRange(0, 1, signal.range[0], signal.range[1], value));
      } else if (id === midiControlId) {
        signal.set(mapRange(0, 1, signal.range[0], signal.range[1], value));
      }
    });
  }, [listenToMidi, signal, isWaitingForMidi, midiControlId]);

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
    const adjustPerPx = signal.range
      ? Math.abs(signal.range[1] - signal.range[0]) / 250
      : Math.abs(startSignalValue === 0 ? 0.1 : startSignalValue * 0.01);

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
      cursor: 'ns-resize',
    });

    dragCover.attach();
  }

  return (
    <>
      {signal.range && (
        <div
          className={cx(
            'cursor-pointer px-1 py-1',
            isWaitingForMidi
              ? 'text-gray-100'
              : midiControlId !== null
              ? 'text-gray-300'
              : 'text-gray-500 hover:text-gray-300',
          )}
          onClick={onClickMidiButton}
        >
          {isWaitingForMidi ? '◎' : midiControlId !== null ? '◉' : '○'}
        </div>
      )}
      <div
        className="cursor-move pr-2 pl-1 py-1"
        style={{ cursor: 'ns-resize' }}
        onMouseDown={onMouseDown}
      >
        ↕
        <SignalValue signal={signal} className="inline-block pl-1" />
      </div>
    </>
  );
}

const SignalInspector = React.memo(function _SignalInspector({
  signal,
  name,
  displayName = name,
  width,
  listenToMidi,
}: {
  signal: Signal;
  name: string;
  displayName?: string;
  width: number;
  listenToMidi: ListenToMidiInputFn;
}) {
  const [isExpanded, setIsExpanded] = useLocalStorage(`signal.${name}`, false);

  return (
    <div className="text-xs border-t border-gray-700">
      <div
        className="flex hover:bg-gray-800 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-auto whitespace-pre px-2 py-1">{displayName}</div>
        {signal instanceof ControllableSignal ? (
          <SignalControl
            name={name}
            signal={signal}
            listenToMidi={listenToMidi}
          />
        ) : (
          <SignalValue signal={signal} className="px-2 py-1" />
        )}
      </div>
      {isExpanded && <SignalGraph signal={signal} width={width} />}
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
  signalNamePairs: Array<[string, Signal]>;
  width: number;
  listenToMidi: ListenToMidiInputFn;
}) {
  const [isExpanded, setIsExpanded] = useLocalStorage(
    `group.${groupName}`,
    false,
  );
  return (
    <div className="text-xs border-t border-gray-700">
      <div
        className="flex hover:bg-gray-800 cursor-pointer px-2 py-1"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-auto">{groupName}</div>
        <div className="text-gray-600">{isExpanded ? '▽' : '▷'}</div>
      </div>
      {isExpanded && (
        <>
          {signalNamePairs.map(([name, signal]) => (
            <SignalInspector
              key={name}
              name={name}
              displayName={`  ${name.slice(groupName.length + 1)}`}
              signal={signal}
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
        getCurrentValue: () => signalManager.signalsByName,
        subscribe: (cb) => signalManager.onSignalsChange(cb),
      }),
      [signalManager],
    ),
  );

  const signalNamePairs = sortBy(
    Array.from(signalsByName).filter(([name]) => !name.startsWith('_')),
    (pair) => pair[0],
  );
  const [
    groupedSignalNamePairs,
    ungroupedSignalNamePairs,
  ] = partition(signalNamePairs, ([name]) => name.includes('.'));

  const signalGroups = groupBy(groupedSignalNamePairs, ([name]) => {
    const lastDotIdx = name.indexOf('.');
    assert(lastDotIdx !== -1);
    return name.slice(0, lastDotIdx);
  });

  return (
    <div
      className="absolute right-0 top-0 bottom-0 border-l border-gray-600 text-sm h-full overflow-auto"
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
      {ungroupedSignalNamePairs.map(([name, signal]) => (
        <SignalInspector
          key={name}
          name={name}
          signal={signal}
          width={width - 1}
          listenToMidi={listenToMidi}
        />
      ))}
    </div>
  );
});

export default SignalsInspector;
