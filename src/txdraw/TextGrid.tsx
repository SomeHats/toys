import { assert } from "@/lib/assert";
import { createComputedCache, Editor, TLShape, TLShapeId } from "tldraw";

export class TextGrid {
    private chars = new Set<string>();
    private grid: string[][] = [];
    private x = 0;
    private y = 0;
    private w = 0;
    private h = 0;

    write(text: string): this;
    write(y: number, text: string): this;
    write(x: number, y: number, text: string): this;
    write(...args: [string] | [number, string] | [number, number, string]) {
        let x = 0,
            y = 0,
            text;
        if (args.length === 1) {
            text = args[0];
        } else if (args.length === 2) {
            x = args[0];
            text = args[1];
        } else {
            x = args[0];
            y = args[1];
            text = args[2];
        }

        assert(x >= 0);
        assert(y >= 0);

        const lines = text.split("\n");
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const len = line.length;

            const _y = y + i;
            this.h = Math.max(this.h, _y);
            const row = (this.grid[_y] ??= []);

            for (let j = 0; j < len; j++) {
                const c = line[j];
                const _x = x + j;
                this.w = Math.max(this.w, _x);
                row[_x] = c;
                this.chars.add(c);
            }
        }

        return this;
    }

    horizontalLine(x: number, y: number, length: number, char: string) {
        return this.write(x, y, char.repeat(length));
    }

    verticalLine(x: number, y: number, length: number, char: string) {
        return this.write(x, y, `${char}\n`.repeat(length));
    }

    box(x: number, y: number, w: number, h: number) {
        return this.write(x, y, "┏")
            .write(x + w - 1, y, "┓")
            .write(x, y + h - 1, "┗")
            .write(x + w - 1, y + h - 1, "┛")
            .horizontalLine(x + 1, y, w - 2, "━")
            .horizontalLine(x + 1, y + h - 1, w - 2, "━")
            .verticalLine(x, y + 1, h - 2, "┃")
            .verticalLine(x + w - 1, y + 1, h - 2, "┃");
    }

    writeTextGrid(textGrid: TextGrid, offsetX = 0, offsetY = 0) {
        for (let y = 0; y < textGrid.grid.length; y++) {
            const row = textGrid.grid[y];
            if (!row) continue;

            for (let x = 0; x < row.length; x++) {
                const c = row[x];
                if (!c) continue;

                const _x = x + offsetX + textGrid.x;
                const _y = y + offsetY + textGrid.y;
                assert(_x >= 0);
                assert(_y >= 0);
                console.log({ _x, _y, c });
                this.w = Math.max(this.w, _x);
                this.h = Math.max(this.h, _y);
                (this.grid[_y] ??= [])[_x] = c;
                this.chars.add(c);
            }
        }
        return this;
    }

    getChars(): ReadonlySet<string> {
        return this.chars;
    }

    getGrid(): readonly (readonly string[])[] {
        return this.grid;
    }
}

const textGridCache = createComputedCache(
    "text grids",
    (editor: Editor, shape: TLShape) => {
        const util = editor.getShapeUtil(shape);
        if (util.renderText) {
            return util.renderText(shape);
        }
        return undefined;
    },
    {
        areRecordsEqual: (a, b) => a.props === b.props,
    },
);

export function getTextGrid(editor: Editor, shapeId: TLShapeId) {
    return textGridCache.get(editor, shapeId);
}
