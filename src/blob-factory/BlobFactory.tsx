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
import { tailwindColors } from "@/lib/theme";
import Color from "color";

const initialBlobCount = Math.floor(random(5, 10));
const possibleColors = [
    Color(tailwindColors.cyberRed50),
    Color(tailwindColors.cyberOrange50),
    Color(tailwindColors.cyberYellow50),
    Color(tailwindColors.cyberGreen50),
    Color(tailwindColors.cyberCyan50),
    Color(tailwindColors.cyberIndigo50),
    Color(tailwindColors.cyberPurple50),
    Color(tailwindColors.cyberPink50),
];
const colorOptions = possibleColors.map((color) => ({
    value: color,
    color: color.toString(),
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
          blobIndex: number;
      }
    | {
          type: "moving";
          offset: Vector2;
          blobIndex: number;
      }
    | {
          type: "resizing";
          blobIndex: number;
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

    const blobs = times(
        initialBlobCount,
        (i) =>
            new Blob(
                new Vector2(random(200, 600), random(200, 600)),
                random(30, 100),
                sample(possibleColors),
            ),
    );

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

    const blobAtIndex = (index: number) => blobs[index] ?? null;

    const getHover = (): [Blob, number] | [null, null] => {
        switch (state.type) {
            case "idle":
            case "unconfirmedCreate":
            case "selected": {
                let nearestDist = Infinity;
                let nearest = null;
                let nearestIndex = null;
                for (let i = 0; i < blobs.length; i++) {
                    const blob = blobs[i];
                    const distance = blob.center.distanceTo(cursor);
                    if (distance < blob.radius + 5 && distance < nearestDist) {
                        nearestDist = distance;
                        nearest = blob;
                        nearestIndex = i;
                    }
                }

                return [nearest, nearestIndex] as [Blob, number] | [null, null];
            }
            case "moving":
            case "resizing":
                return [blobAtIndex(state.blobIndex), state.blobIndex];
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
                return blobAtIndex(state.blobIndex);
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
            data: new Float32Array(blobs.flatMap((blob) => blob.toArray())),
        });

        program.use();
        positionsVao.bindVao();
        displayGl.gl.drawArrays(WebGL2RenderingContext.TRIANGLES, 0, 6);

        // draw ui:
        ui.clear();
        ui.ctx.resetTransform();
        ui.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        const [hovered] = getHover();
        const selected = getSelected();
        if (hovered && hovered !== selected) {
            ui.circle(hovered.center, hovered.radius, { stroke: "cyan", strokeWidth: 1 });
        }
        if (selected) {
            ui.circle(selected.center, selected.radius, { stroke: "cyan", strokeWidth: 2 });
            selected.color = controls.colorPicker("color", selected.color, colorOptions) as Color;
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
            if (blobAtIndex(state.blobIndex)) {
                blobs.splice(state.blobIndex, 1);
                state = { type: "idle" };
            }
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
                case "moving": {
                    const blob = blobAtIndex(state.blobIndex);
                    if (blob) {
                        blob.center = cursor.add(state.offset);
                    }
                    break;
                }
                case "resizing": {
                    const blob = blobAtIndex(state.blobIndex);
                    if (blob) {
                        blob.radius = cursor.distanceTo(blob.center);
                    }
                    break;
                }
                case "unconfirmedCreate": {
                    const distance = state.center.distanceTo(cursor);
                    if (distance > 5) {
                        const blobIndex = blobs.length;
                        blobs.push(new Blob(state.center, distance, sample(possibleColors)));
                        state = { type: "resizing", blobIndex };
                    }
                    break;
                }
                default:
                    exhaustiveSwitchError(state);
            }
        },
        onPointerDown: (newPosition: Vector2) => {
            cursor = newPosition;
            const [hovered, hoveredIdx] = getHover();
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
                                blobIndex: hoveredIdx,
                            };
                        } else {
                            state = {
                                type: "moving",
                                offset: hovered.center.sub(cursor),
                                blobIndex: hoveredIdx,
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
                    state = { type: "selected", blobIndex: state.blobIndex };
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

    constructor(public center: Vector2, public radius: number, public color: Color) {}

    toArray() {
        return [
            this.center.x,
            this.center.y,
            this.radius,
            0,
            this.color.red() / 255,
            this.color.green() / 255,
            this.color.blue() / 255,
            0,
        ];
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
            return debugStateToString(state.type, { blob: state.blobIndex });
        case "moving":
            return debugStateToString(state.type, {
                offset: state.offset.toString(2),
                blob: state.blobIndex,
            });
        case "unconfirmedCreate":
            return debugStateToString(state.type, { center: state.center.toString(2) });
    }
}
