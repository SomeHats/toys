import shaderFragSrc from "@/blob-factory/shader.frag";
import shaderVertSrc from "@/blob-factory/shader.vert";
import { DebugDraw } from "@/lib/DebugDraw";
import { InstantUi, useInstantUi } from "@/lib/InstantUi";
import { assert, assertExists } from "@/lib/assert";
import { debugStateToString } from "@/lib/debugPropsToString";
import { Vector2 } from "@/lib/geom/Vector2";
import { Gl } from "@/lib/gl/Gl";
import {
    GlBufferUsage,
    GlPixelFormat,
    GlPixelType,
    GlTextureInternalFormat,
    GlVertexAttribType,
} from "@/lib/gl/GlTypes";
import { matchesKey } from "@/lib/hooks/useKeyPress";
import { tailwindColors } from "@/lib/theme";
import { exhaustiveSwitchError, frameLoop, invLerp, random, sample, times } from "@/lib/utils";
import Color from "color";
import { interpolateHcl } from "d3-interpolate";
import { useEffect, useRef } from "react";

type CyberColorScale = (level: 5 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90) => string;
function interpolateScale(n: number, scale: CyberColorScale): Color {
    if (n < 5) return Color(scale(5));
    if (n < 10) return interpolateColors(scale(5), scale(10), invLerp(5, 10, n));
    if (n < 20) return interpolateColors(scale(10), scale(20), invLerp(10, 20, n));
    if (n < 30) return interpolateColors(scale(20), scale(30), invLerp(20, 30, n));
    if (n < 40) return interpolateColors(scale(30), scale(40), invLerp(30, 40, n));
    if (n < 50) return interpolateColors(scale(40), scale(50), invLerp(40, 50, n));
    if (n < 60) return interpolateColors(scale(50), scale(60), invLerp(50, 60, n));
    if (n < 70) return interpolateColors(scale(60), scale(70), invLerp(60, 70, n));
    if (n < 80) return interpolateColors(scale(70), scale(80), invLerp(70, 80, n));
    if (n < 90) return interpolateColors(scale(80), scale(90), invLerp(80, 90, n));
    if (n < 100) return interpolateColors(scale(90), "#000000", invLerp(90, 100, n));
    return Color("#000000");
}
function interpolateColors(a: string, b: string, n: number) {
    return Color(interpolateHcl(a, b)(n));
}

const initialBlobCount = Math.floor(random(5, 10));
const possibleColors = [
    tailwindColors.cyberRed,
    tailwindColors.cyberOrange,
    tailwindColors.cyberYellow,
    tailwindColors.cyberGreen,
    tailwindColors.cyberCyan,
    tailwindColors.cyberBlue,
    tailwindColors.cyberIndigo,
    tailwindColors.cyberPurple,
    tailwindColors.cyberPink,
];
const colorOptions = possibleColors.map((color) => ({
    value: color,
    color: color(50),
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
                    <li>good color level for bgs in dark mode = ~80</li>
                    <li>good color level for bgs in light mode = ~20</li>
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

enum BlobFactoryInterpolateMode {
    Naive = 0,
    Vector = 1,
    Min = 2,
}
const interpolateModes = [
    { label: "naive", value: BlobFactoryInterpolateMode.Naive },
    { label: "vector", value: BlobFactoryInterpolateMode.Vector },
    { label: "min", value: BlobFactoryInterpolateMode.Min },
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
    const program = displayGl.createProgram({
        fragment: shaderFragSrc,
        vertex: shaderVertSrc,
    });

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
    const blurSize = program.uniformFloat("u_blurSize", 150);
    const blurSpread = program.uniformFloat("u_blurSpread", 0.8);
    const mode = program.uniformEnum("u_mode", sample(modes).value);
    const darkMode = program.uniformBool("u_darkMode", Math.random() < 0.5);
    const interpolateMode = program.uniformEnum(
        "u_interpolateMode",
        sample(interpolateModes).value,
    );
    const hueBias = program.uniformFloat("u_hueBias", random(0, 360));
    let colorLevel = darkMode.value ? random(50, 95) : random(5, 50);
    let forceChroma = false;
    let forcedChroma = 0.5;
    let forceLightness = false;
    let forcedLightness = 0.5;

    const positionsVao = program.createAndBindVertexArrayObject({
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

    const blobAtIndex = (index: number): Blob | null => blobs[index] ?? null;

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
                return [assertExists(blobAtIndex(state.blobIndex)), state.blobIndex];
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
        darkMode.value = controls.checkbox("dark mode", darkMode.value);
        colorLevel = controls.range("color level", colorLevel, { min: 5, max: 100, step: 1 });
        interpolateMode.value = controls.segmentedControl(
            "interpolation",
            interpolateMode.value,
            interpolateModes,
        );
        if (interpolateMode.value !== BlobFactoryInterpolateMode.Vector) {
            hueBias.value = controls.range("hue bias", hueBias.value, {
                min: 0,
                max: 360,
                step: 1,
            });
        }
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
            max: 200,
            step: 0.1,
        });
        if (mode.value === BlobFactoryMode.Blur) {
            blurSpread.value = controls.range("blur spread", blurSpread.value, {
                min: 0.01,
                max: 0.99,
                step: 0.01,
            });
        }
        forceChroma = controls.checkbox("force chroma", forceChroma);
        if (forceChroma) {
            forcedChroma = controls.range("chroma", forcedChroma, { min: 0, max: 1, step: 0.01 });
        }
        forceLightness = controls.checkbox("force lightness", forceLightness);
        if (forceLightness) {
            forcedLightness = controls.range("lightness", forcedLightness, {
                min: 0,
                max: 1,
                step: 0.01,
            });
        }

        // draw actual:
        displayGl.clear();

        texture.update({
            width: blobs.length * 2,
            height: 1,
            data: new Float32Array(
                blobs.flatMap((blob) =>
                    blob.toArray(
                        colorLevel,
                        forceChroma ? forcedChroma : null,
                        forceLightness ? forcedLightness : null,
                    ),
                ),
            ),
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
            selected.colorScale = controls.colorPicker(
                "color",
                selected.colorScale,
                colorOptions,
            ) as CyberColorScale;
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
        displayGl.destroy();
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

    constructor(
        public center: Vector2,
        public radius: number,
        public colorScale: CyberColorScale,
    ) {}

    toArray(colorLevel: number, forceChroma: number | null, forceLightness: number | null) {
        let color = interpolateScale(colorLevel, this.colorScale).lch();
        if (forceChroma !== null) {
            color = color.chroma(forceChroma * 100);
        }
        if (forceLightness !== null) {
            color = color.lightness(forceLightness * 100);
        }
        color = color.rgb();
        return [
            this.center.x,
            this.center.y,
            this.radius,
            0,
            color.red() / 255,
            color.green() / 255,
            color.blue() / 255,
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
