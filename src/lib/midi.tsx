import { WebMidi } from "webmidi";
import { assert, assertNumber } from "@/lib/assert";
import EventEmitter, { Unsubscribe } from "@/lib/EventEmitter";
import { mapRange } from "@/lib/utils";

export async function enableMidi(): Promise<typeof WebMidi> {
    return await WebMidi.enable();
}

export type MidiInputChangeEvent = {
    id: string;
    value: number;
};
export type ListenToMidiInputFn = (cb: (event: MidiInputChangeEvent) => void) => Unsubscribe;

export async function getListenToMidiInput(): Promise<ListenToMidiInputFn> {
    try {
        await enableMidi();
    } catch (err) {
        console.log(err);
        return () => () => {};
    }

    console.log(WebMidi);

    const midiEventEmitter = new EventEmitter<{ id: string; value: number }>();
    for (const input of WebMidi.inputs) {
        input.addListener("controlchange", (event) => {
            midiEventEmitter.emit({
                id: `${input.id}.${event.type}.${event.controller.number}`,
                value: assertNumber(event.value),
            });
        });
        input.addListener("pitchbend", (event) => {
            midiEventEmitter.emit({
                id: `${input.id}.${event.type}`,
                value: mapRange(-1, 1, 0, 1, assertNumber(event.value)),
            });
        });
        input.addListener("noteon", (event) => {
            midiEventEmitter.emit({
                id: `${input.id}.note.${event.note.number}`,
                value: assertNumber(event.value),
            });
        });
        input.addListener("noteoff", (event) => {
            midiEventEmitter.emit({
                id: `${input.id}.note.${event.note.number}`,
                value: 0,
            });
        });
    }

    return (cb) => midiEventEmitter.listen(cb);
}
