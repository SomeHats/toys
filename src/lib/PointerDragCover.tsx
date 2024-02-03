type PointerEventHandler = (event: PointerEvent) => void;

interface DragCoverOptions {
    down?: PointerEventHandler;
    move?: PointerEventHandler;
    up?: PointerEventHandler;
    debug?: boolean;
    cursor?: string;
}

const dragCoverStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: "100000",
    touchAction: "none",
};

export default class PointerDragCover {
    private onDown?: PointerEventHandler;
    private onMove?: PointerEventHandler;
    private onUp?: PointerEventHandler;
    private cover: HTMLElement;
    private attachedTo: HTMLElement | null = null;

    constructor({ down, move, up, debug, cursor }: DragCoverOptions) {
        this.onDown = down;
        this.onMove = move;
        this.onUp = up;

        const cover = document.createElement("div");
        cover.setAttribute("touch-action", "none");
        Object.assign(cover.style, dragCoverStyle);

        if (debug) {
            cover.style.background = "rgba(0, 255, 0, 0.3)";
        }
        if (cursor) {
            cover.style.cursor = cursor;
        }

        this.cover = cover;
    }

    attach() {
        const target = document.body;
        if (!this.attachedTo && target) {
            this.attachedTo = target;
            this.attachedTo.appendChild(this.cover);
            this.attachEvents();
            document.body.style.userSelect = "none";
            document.body.style.webkitUserSelect = "none";
            document.body.style.touchAction = "none";
        }
    }

    remove() {
        if (this.attachedTo) {
            this.attachedTo.removeChild(this.cover);
            this.attachedTo = null;
            this.removeEvents();
            document.body.style.userSelect = "";
            document.body.style.webkitUserSelect = "";
            document.body.style.touchAction = "";
        }
    }

    private attachEvents() {
        if (this.onDown) {
            window.addEventListener("pointerdown", this.onDown, false);
        }

        if (this.onMove) {
            window.addEventListener("pointermove", this.onMove, false);
        }

        if (this.onUp) {
            window.addEventListener("pointerup", this.onUp, false);
        }
    }

    private removeEvents() {
        if (this.onDown) {
            window.removeEventListener("pointerdown", this.onDown);
        }

        if (this.onMove) {
            window.removeEventListener("pointermove", this.onMove);
        }

        if (this.onUp) {
            window.removeEventListener("pointerup", this.onUp);
        }
    }
}
