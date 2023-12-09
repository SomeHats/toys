import { times } from "@/lib/utils";
import cx from "classnames";
import * as React from "react";

const STANDARD_KEY_SIZE = 45;
const KEY_BORDER_SIZE = 1.5;
const PIANO_BORDER_SIZE = 8;

interface KeyRenderStyles {
    standardWidth: number;
    standardHeight: number;
    accidentalWidth: number;
    accidentalHeight: number;
    scale: number;
    totalWidth: number;
}

function isNoteAccidental(note: number): boolean {
    const noteWithoutOctave = note % 12;
    return (
        noteWithoutOctave === 1 ||
        noteWithoutOctave === 3 ||
        noteWithoutOctave === 6 ||
        noteWithoutOctave === 8 ||
        noteWithoutOctave === 10
    );
}

const PianoKeyboardKey = React.memo(function PianoKeyboardKey({
    offset,
    isAccidental,
    styles,
    isNoteDown,
    note,
    setRefForKey,
}: {
    offset: number;
    isAccidental: boolean;
    styles: KeyRenderStyles;
    // onNoteDown: (note: number, x: number, y: number) => void;
    // onNoteUp: (note: number, x: number, y: number) => void;
    isNoteDown: boolean;
    note: number;
    setRefForKey: (key: HTMLDivElement | null, note: number) => void;
}) {
    const style =
        isAccidental ?
            ({
                left: offset - styles.accidentalWidth / 2,
                width: styles.accidentalWidth,
                height: styles.accidentalHeight,
                position: "absolute",
                zIndex: 1,
                borderWidth: styles.scale * KEY_BORDER_SIZE,
            } as const)
        :   ({
                left: offset,
                width: styles.standardWidth,
                height: styles.standardHeight,
                position: "absolute",
                borderWidth: styles.scale * KEY_BORDER_SIZE,
            } as const);

    return (
        <div
            ref={(el) => setRefForKey(el, note)}
            style={style}
            className={cx("border-gray-600", {
                "bg-black hover:bg-blue-900": isAccidental,
                "bg-white hover:bg-blue-200": !isAccidental,
                "bg-purple-800": isAccidental && isNoteDown,
                "bg-purple-300": !isAccidental && isNoteDown,
            })}
        />
    );
});

function _PianoKeyboard({
    lowestNote,
    highestNote,
    scale,
    top,
    left,
    notesDown,
    setRefForKey,
}: {
    lowestNote: number;
    highestNote: number;
    scale: number;
    top: number;
    left: number;
    notesDown: number[];
    setRefForKey: (key: HTMLDivElement | null, note: number) => void;
}) {
    const styles = React.useMemo((): KeyRenderStyles => {
        const keyCountForWidth = (highestNote - lowestNote) * (7 / 12);
        const standardWidth = STANDARD_KEY_SIZE * scale;
        const totalWidth = keyCountForWidth * standardWidth;
        const accidentalWidth = standardWidth * 0.6;
        return {
            standardWidth,
            accidentalWidth,
            standardHeight: standardWidth * 6,
            accidentalHeight: accidentalWidth * 6,
            scale,
            totalWidth,
        };
    }, [lowestNote, highestNote, scale]);

    const pianoWidth = styles.totalWidth + 2 * PIANO_BORDER_SIZE * scale;
    const pianoHeight = styles.standardHeight + 2 * PIANO_BORDER_SIZE * scale;

    let offset = 0;
    return (
        <div
            className="absolute border-gray-600 bg-gray-600"
            style={{
                width: pianoWidth,
                height: pianoHeight,
                borderWidth: PIANO_BORDER_SIZE * scale,
                borderRadius: PIANO_BORDER_SIZE * scale,
                top: top - pianoHeight / 2,
                left: left - pianoWidth / 2,
            }}
        >
            {times(highestNote - lowestNote, (idx) => {
                const note = lowestNote + idx;
                const isAccidental = isNoteAccidental(note);
                const key = (
                    <PianoKeyboardKey
                        key={note}
                        note={note}
                        offset={offset}
                        isAccidental={isAccidental}
                        styles={styles}
                        isNoteDown={notesDown.includes(note)}
                        setRefForKey={setRefForKey}
                    />
                );
                offset += isAccidental ? 0 : styles.standardWidth;
                return key;
            })}
        </div>
    );
}

const PianoKeyboard = React.memo(_PianoKeyboard);

export default PianoKeyboard;
