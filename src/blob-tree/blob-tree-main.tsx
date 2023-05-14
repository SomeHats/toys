import { BlobTree } from "@/blob-tree/BlobTree";
import { BlobTreeEditor } from "@/blob-tree/BlobTreeEditor";
import { canvas } from "@/blob-tree/canvas";
import { Vector2 } from "@/lib/geom/Vector2";
import { frameLoop } from "@/lib/utils";

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

if ((module as any).hot) {
    (module as any).hot.dispose(() => window.location.reload());
}
