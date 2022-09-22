import { assert, assertExists } from "@/lib/assert";
import Vector2 from "@/lib/geom/Vector2";
import { Gl } from "@/lib/gl/Gl";
import { useEffect, useRef } from "react";
import shaderFragSrc from "@/blob-factory/shader.frag";
import shaderVertSrc from "@/blob-factory/shader.vert";
import {
    GlBufferUsage,
    GlPixelType,
    GlPixelFormat,
    GlShaderType,
    GlTextureInternalFormat,
    GlVertexAttribType,
} from "@/lib/gl/GlTypes";
import { exhaustiveSwitchError, frameLoop, random, sample, times } from "@/lib/utils";
import { DebugDraw } from "@/lib/DebugDraw";
import { matchesKey } from "@/lib/hooks/useKeyPress";
import { debugStateToString } from "@/lib/debugPropsToString";
import { InstantUi, useInstantUi } from "@/lib/InstantUi";
import { floatColor, floatColorToHex } from "@/blob-factory/colors";

const initialBlobCount = Math.floor(random(5, 10));
const possibleColors = [
    floatColor("red-50"),
    floatColor("orange-50"),
    floatColor("yellow-50"),
    floatColor("green-50"),
    floatColor("cyan-50"),
    floatColor("indigo-50"),
    floatColor("purple-50"),
    floatColor("pink-50"),
];
const colorOptions = possibleColors.map((color) => ({
    value: color,
    color: floatColorToHex(color),
}));

export function BlobFactoryRenderer({ size }: { size: Vector2 }) {
    const displayCanvasRef = useRef<HTMLCanvasElement>(null);
    const uiCanvasRef = useRef<HTMLCanvasElement>(null);
    const blobFactoryRef = useRef<BlobFactory>();
    const instantUi = useInstantUi();

    useEffect(() => {
        assert(displayCanvasRef.current && uiCanvasRef.current);
        blobFactoryRef.current = startBlobFactory(
            displayCanvasRef.current,
            uiCanvasRef.current,
            instantUi.ui,
        );
        return () => {
            assert(blobFactoryRef.current);
            blobFactoryRef.current.destroy();
            blobFactoryRef.current = undefined;
        };
    }, [instantUi.ui]);

    useEffect(() => {
        assert(blobFactoryRef.current);
        blobFactoryRef.current.setSize(size);
    }, [size]);

    return (
        <>
            <div
                className="absolute inset-0"
                onPointerMove={(e) => {
                    if (blobFactoryRef.current) {
                        blobFactoryRef.current.onPointerMove(Vector2.fromEvent(e));
                    }
                }}
                onPointerDown={(e) => {
                    if (blobFactoryRef.current) {
                        blobFactoryRef.current.onPointerDown(Vector2.fromEvent(e));
                    }
                }}
                onPointerUp={(e) => {
                    if (blobFactoryRef.current) {
                        blobFactoryRef.current.onPointerUp(Vector2.fromEvent(e));
                    }
                }}
            >
                <canvas
                    ref={displayCanvasRef}
                    width={size.x * window.devicePixelRatio}
                    height={size.y * window.devicePixelRatio}
                    className="absolute inset-0 h-full w-full"
                />
                <canvas
                    ref={uiCanvasRef}
                    width={size.x * window.devicePixelRatio}
                    height={size.y * window.devicePixelRatio}
                    className="absolute inset-0 h-full w-full"
                />
            </div>
            <div className="absolute right-0 top-0 h-full w-72 bg-gray-900">
                <ul className="list-disc py-3 px-5 text-xs">
                    <li>drag circles to move them</li>
                    <li>drag an edge to resize</li>
                    <li>drag in empty space for a new one</li>
                    <li>backspace to delete</li>
                    <li>refresh for something new</li>
                </ul>
                {/* <RangeInput
                    label="smoothness"
                    value={smoothness}
                    onChange={setSmoothness}
                    min={0}
                    max={100}
                    step={0.1}
                /> */}
                {instantUi.render()}
            </div>
        </>
    );
}

type BlobFactory = ReturnType<typeof startBlobFactory>;

type BlobFactoryState =
    | {
          type: "idle";
      }
    | {
          type: "selected";
          blob: Blob;
      }
    | {
          type: "moving";
          offset: Vector2;
          blob: Blob;
      }
    | {
          type: "resizing";
          blob: Blob;
      }
    | {
          type: "unconfirmedCreate";
          center: Vector2;
      };

enum BlobFactoryMode {
    Blur = 0,
    Inside = 1,
    Outside = 2,
    Fill = 3,
}
const modes = [
    { label: "blur", value: BlobFactoryMode.Blur },
    { label: "fill", value: BlobFactoryMode.Fill },
    { label: "inside", value: BlobFactoryMode.Inside },
    { label: "outside", value: BlobFactoryMode.Outside },
];

function startBlobFactory(
    displayCanvas: HTMLCanvasElement,
    uiCanvas: HTMLCanvasElement,
    controls: InstantUi,
) {
    let cursor = Vector2.ZERO;

    let state: BlobFactoryState = { type: "idle" };

    const uiCtx = assertExists(uiCanvas.getContext("2d"));
    const ui = new DebugDraw(uiCtx);

    const displayGl = new Gl(displayCanvas);
    const fragShader = displayGl.createShader(GlShaderType.Fragment, shaderFragSrc);
    const vertShader = displayGl.createShader(GlShaderType.Vertex, shaderVertSrc);
    const program = displayGl.createProgram(vertShader, fragShader);

    const blobStore = { current: new Float32Array(Blob.size * initialBlobCount) };
    const blobs = times(initialBlobCount, (i) => {
        const blob = new Blob(blobStore, i);
        blob.color = sample(possibleColors);
        blob.x = random(200, 600);
        blob.y = random(200, 600);
        blob.radius = random(30, 100);
        return blob;
    });

    const size = program.uniformVector2("u_resolution", new Vector2(100, 100));
    const smoothness = program.uniformFloat("u_smoothness", random(50, 100));
    const blurSize = program.uniformFloat("u_blurSize", random(70, 150));
    const blurSpread = program.uniformFloat("u_blurSpread", random(0.1, 0.7));
    const mode = program.uniformEnum("u_mode", sample(modes).value);

    const positionsVao = program.createAndBindVertexArray({
        name: "a_position",
        size: 2,
        type: GlVertexAttribType.Float,
    });

    const texture = displayGl.createTexture(0, {
        internalFormat: GlTextureInternalFormat.Rgba32f,
        pixelType: GlPixelType.Float,
        pixelFormat: GlPixelFormat.Rgba,
    });
    texture.configureForData();
    program.uniformTexture2d("u_blobs", texture);

    const setSize = (newSize: Vector2) => {
        size.value = newSize;
        displayGl.setDefaultViewport();
        const positions = [
            0,
            0,
            newSize.x,
            newSize.y,
            0,
            newSize.y,
            0,
            0,
            newSize.x,
            0,
            newSize.x,
            newSize.y,
        ];
        positionsVao.bufferData(new Float32Array(positions), GlBufferUsage.StaticDraw);
        draw();
    };

    const getHover = () => {
        switch (state.type) {
            case "idle":
            case "unconfirmedCreate":
            case "selected": {
                let nearestDist = Infinity;
                let nearest = null;
                for (const blob of blobs) {
                    const distance = blob.center.distanceTo(cursor);
                    if (distance < blob.radius + 5 && distance < nearestDist) {
                        nearestDist = distance;
                        nearest = blob;
                    }
                }

                return nearest;
            }
            case "moving":
            case "resizing":
                return state.blob;
            default:
                exhaustiveSwitchError(state);
        }
    };

    const getSelected = () => {
        switch (state.type) {
            case "idle":
            case "unconfirmedCreate":
                return null;
            case "moving":
            case "selected":
            case "resizing":
                return state.blob;
            default:
                exhaustiveSwitchError(state);
        }
    };

    const draw = () => {
        // controls:
        mode.value = controls.segmentedControl("mode", mode.value, modes);
        if (mode.value === BlobFactoryMode.Inside || mode.value === BlobFactoryMode.Outside) {
            smoothness.value = controls.range("smoothness", smoothness.value, {
                min: 0,
                max: 100,
                step: 0.1,
            });
        }
        blurSize.value = controls.range("blur size", blurSize.value, {
            min: 0,
            max: 150,
            step: 0.1,
        });
        if (mode.value === BlobFactoryMode.Blur) {
            blurSpread.value = controls.range("blur spread", blurSpread.value, {
                min: 0.01,
                max: 0.99,
                step: 0.01,
            });
        }

        // draw actual:
        displayGl.clear();

        texture.update({
            width: blobs.length * 2,
            height: 1,
            data: blobStore.current,
        });

        program.use();
        positionsVao.bindVao();
        displayGl.gl.drawArrays(WebGL2RenderingContext.TRIANGLES, 0, 6);

        // draw ui:
        ui.clear();
        ui.ctx.resetTransform();
        ui.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        const hovered = getHover();
        const selected = getSelected();
        if (hovered && hovered !== selected) {
            ui.circle(hovered.center, hovered.radius, { stroke: "cyan", strokeWidth: 1 });
        }
        if (selected) {
            ui.circle(selected.center, selected.radius, { stroke: "cyan", strokeWidth: 2 });
            selected.color = controls.colorPicker("color", selected.color, colorOptions) as [
                number,
                number,
                number,
            ];
        }
        ui.fillText(stateToString(state), new Vector2(30, 40), { fill: "white" });

        controls.flush();
    };

    let isCancelled = false;
    frameLoop((t, cancel) => {
        if (isCancelled) {
            cancel();
            return;
        }
        draw();
    });

    const onKeyDown = (e: KeyboardEvent) => {
        if (state.type === "selected" && matchesKey(e, "backspace")) {
            const newData = [...blobStore.current];
            newData.splice(state.blob.index * Blob.size, Blob.size);
            blobStore.current = new Float32Array(newData);
            blobs.pop();
            state = { type: "idle" };
        }
    };
    window.addEventListener("keydown", onKeyDown);

    const destroy = () => {
        displayGl.destory();
        window.removeEventListener("keydown", onKeyDown);
        isCancelled = true;
    };

    return {
        setSize,
        destroy,
        onPointerMove: (newPosition: Vector2) => {
            cursor = newPosition;
            switch (state.type) {
                case "idle":
                case "selected":
                    break;
                case "moving":
                    state.blob.center = cursor.add(state.offset);
                    break;
                case "resizing":
                    state.blob.radius = cursor.distanceTo(state.blob.center);
                    break;
                case "unconfirmedCreate": {
                    const distance = state.center.distanceTo(cursor);
                    if (distance > 5) {
                        const newData = [...blobStore.current, ...times(Blob.size, () => 0)];
                        blobStore.current = new Float32Array(newData);
                        const blob = new Blob(blobStore, blobs.length);
                        blob.color = sample(possibleColors);
                        blob.center = state.center;
                        blob.radius = distance;
                        blobs.push(blob);
                        state = { type: "resizing", blob };
                    }
                    break;
                }
                default:
                    exhaustiveSwitchError(state);
            }
        },
        onPointerDown: (newPosition: Vector2) => {
            cursor = newPosition;
            const hovered = getHover();
            switch (state.type) {
                case "idle":
                case "selected": {
                    if (hovered) {
                        const distanceFromEdge = Math.abs(
                            hovered.center.distanceTo(cursor) - hovered.radius,
                        );
                        if (distanceFromEdge < 5) {
                            state = {
                                type: "resizing",
                                blob: hovered,
                            };
                        } else {
                            state = {
                                type: "moving",
                                offset: hovered.center.sub(cursor),
                                blob: hovered,
                            };
                        }
                    } else {
                        state = { type: "unconfirmedCreate", center: cursor };
                    }
                    break;
                }
                case "moving":
                case "unconfirmedCreate":
                case "resizing":
                    break;
                default:
                    exhaustiveSwitchError(state);
            }
        },
        onPointerUp: (newPosition: Vector2) => {
            cursor = newPosition;
            switch (state.type) {
                case "idle":
                case "selected":
                    break;
                case "moving":
                case "resizing":
                    state = { type: "selected", blob: state.blob };
                    break;
                case "unconfirmedCreate":
                    state = { type: "idle" };
                    break;
                default:
                    exhaustiveSwitchError(state);
            }
        },
    };
}

class Blob {
    static size = 8 as const;
    constructor(private readonly backingStore: { current: Float32Array }, readonly index: number) {}

    private getAt(offset: number): number {
        return this.backingStore.current[this.index * Blob.size + offset];
    }

    private setAt(offset: number, value: number) {
        this.backingStore.current[this.index * Blob.size + offset] = value;
    }

    get x() {
        return this.getAt(0);
    }
    set x(value: number) {
        this.setAt(0, value);
    }

    get y() {
        return this.getAt(1);
    }
    set y(value: number) {
        this.setAt(1, value);
    }

    get radius() {
        return this.getAt(2);
    }
    set radius(value: number) {
        this.setAt(2, value);
    }

    get center(): Vector2 {
        return new Vector2(this.x, this.y);
    }
    set center(value: Vector2) {
        this.x = value.x;
        this.y = value.y;
    }

    get red() {
        return this.getAt(4);
    }
    set red(value: number) {
        this.setAt(4, value);
    }
    get green() {
        return this.getAt(5);
    }
    set green(value: number) {
        this.setAt(5, value);
    }
    get blue() {
        return this.getAt(6);
    }
    set blue(value: number) {
        this.setAt(6, value);
    }
    get color(): [number, number, number] {
        return [this.red, this.green, this.blue];
    }
    set color(color: [number, number, number]) {
        this.red = color[0];
        this.green = color[1];
        this.blue = color[2];
    }

    toJSON() {
        return { center: this.center, radius: this.radius };
    }
}

function stateToString(state: BlobFactoryState): string {
    switch (state.type) {
        case "idle":
            return debugStateToString(state.type);
        case "resizing":
        case "selected":
            return debugStateToString(state.type, { blob: state.blob.index });
        case "moving":
            return debugStateToString(state.type, {
                offset: state.offset.toString(2),
                blob: state.blob.index,
            });
        case "unconfirmedCreate":
            return debugStateToString(state.type, { center: state.center.toString(2) });
    }
}
