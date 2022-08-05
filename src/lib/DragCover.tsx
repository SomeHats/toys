// @flow

type MouseEventHandler = (event: MouseEvent) => void;

type DragCoverOptions = {
    down?: MouseEventHandler;
    move?: MouseEventHandler;
    up?: MouseEventHandler;
    debug?: boolean;
    cursor?: string;
};

const dragCoverStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: "100000",
    touchAction: "none",
};

export default class DragCover {
    private onDown?: MouseEventHandler;
    private onMove?: MouseEventHandler;
    private onUp?: MouseEventHandler;
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
        }
    }

    remove() {
        if (this.attachedTo) {
            this.attachedTo.removeChild(this.cover);
            this.attachedTo = null;
            this.removeEvents();
        }
    }

    private attachEvents() {
        if (this.onDown) {
            window.addEventListener("mousedown", this.onDown, false);
        }

        if (this.onMove) {
            window.addEventListener("mousemove", this.onMove, false);
        }

        if (this.onUp) {
            window.addEventListener("mouseup", this.onUp, false);
        }
    }

    private removeEvents() {
        if (this.onDown) {
            window.removeEventListener("mousedown", this.onDown);
        }

        if (this.onMove) {
            window.removeEventListener("mousemove", this.onMove);
        }

        if (this.onUp) {
            window.removeEventListener("mouseup", this.onUp);
        }
    }
}
