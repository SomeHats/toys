import WebMidi from 'webmidi';
import EventEmitter, { Unsubscribe } from './EventEmitter';
import { mapRange } from './utils';

export function enableMidi(): Promise<typeof WebMidi> {
  return new Promise((resolve, reject) => {
    WebMidi.enable((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(WebMidi);
      }
    });
  });
}

export type MidiInputChangeEvent = {
  id: string;
  value: number;
};
export type ListenToMidiInputFn = (
  cb: (event: MidiInputChangeEvent) => void,
) => Unsubscribe;

export async function getListenToMidiInput(): Promise<ListenToMidiInputFn> {
  try {
    await enableMidi();
  } catch (err) {
    console.log(err);
    return () => () => {};
  }

  const midiEventEmitter = new EventEmitter<{ id: string; value: number }>();
  for (const input of WebMidi.inputs) {
    input.addListener('controlchange', 'all', (event) => {
      midiEventEmitter.emit({
        id: `${input.id}.${event.type}.${event.controller.number}`,
        value: mapRange(0, 127, 0, 1, event.value),
      });
    });
    input.addListener('pitchbend', 'all', (event) => {
      midiEventEmitter.emit({
        id: `${input.id}.${event.type}.${event.channel}`,
        value: mapRange(-1, 1, 0, 1, event.value),
      });
    });
    input.addListener('noteon', 'all', (event) => {
      midiEventEmitter.emit({
        id: `${input.id}.note.${event.note.number}`,
        value: event.velocity,
      });
    });
    input.addListener('noteoff', 'all', (event) => {
      midiEventEmitter.emit({
        id: `${input.id}.note.${event.note.number}`,
        value: 0,
      });
    });
  }

  return (cb) => midiEventEmitter.listen(cb);
}
