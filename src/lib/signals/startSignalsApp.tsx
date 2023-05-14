import { assert } from "@/lib/assert";
import { getListenToMidiInput } from "@/lib/midi";
import { SignalManager } from "@/lib/signals/Signals";
import SignalsCanvas, { SignalsCanvasScene } from "@/lib/signals/SignalsCanvas";
import * as ReactDOM from "react-dom";

export default async function startSignalsApp(scene: SignalsCanvasScene, debuggerEnabled: boolean) {
    const listenToMidi = await getListenToMidiInput();

    const s = new SignalManager();
    const root = document.getElementById("root");
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
