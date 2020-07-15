import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { getListenToMidiInput } from '../midi';
import { SignalManager } from './Signals';
import { assert } from '../assert';
import SignalsCanvas, { SignalsCanvasScene } from './SignalsCanvas';

export default async function startSignalsApp(
  scene: SignalsCanvasScene,
  debuggerEnabled: boolean,
) {
  const listenToMidi = await getListenToMidiInput();

  const s = new SignalManager();
  const root = document.getElementById('root');
  assert(root);

  ReactDOM.render(
    <SignalsCanvas
      debuggerEnabled={debuggerEnabled}
      signalManager={s}
      listenToMidi={listenToMidi}
      scene={scene}
    />,
    root,
  );
}
