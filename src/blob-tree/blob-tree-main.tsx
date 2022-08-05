import { BlobTreeEditor } from "./BlobTreeEditor";
import { frameLoop } from "../lib/utils";
import { canvas } from "./canvas";
import { BlobTree } from "./BlobTree";
import Vector2 from "../lib/geom/Vector2";

const editor = new BlobTreeEditor(canvas, new BlobTree());

document.addEventListener("mousemove", (event) => {
    editor.onMouseMove(new Vector2(event.clientX, event.clientY));
});
document.addEventListener("mousedown", (event) => {
    editor.onMouseDown(new Vector2(event.clientX, event.clientY));
});
document.addEventListener("mouseup", (event) => {
    editor.onMouseUp(new Vector2(event.clientX, event.clientY));
});
document.addEventListener("keydown", (event) => {
    editor.onKeyDown(event.key);
});

frameLoop(() => {
    editor.tick();
    editor.draw();
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if ((module as any).hot) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (module as any).hot.dispose(() => window.location.reload());
}
