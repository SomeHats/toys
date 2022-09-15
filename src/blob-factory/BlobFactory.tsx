import { assert, assertExists } from "@/lib/assert";
import Vector2 from "@/lib/geom/Vector2";
import { Gl } from "@/lib/gl/Gl";
import { useEffect, useId, useRef, useState } from "react";
import shaderFragSrc from "@/blob-factory/shader.frag";
import shaderVertSrc from "@/blob-factory/shader.vert";
import { GlBufferUsage, GlShaderType, GlVertexAttribType } from "@/lib/gl/GlTypes";
import { exhaustiveSwitchError, frameLoop, random, times } from "@/lib/utils";
import { DebugDraw } from "@/lib/DebugDraw";
import { matchesKey } from "@/lib/hooks/useKeyPress";
import { m } from "vitest/dist/index-ea17aa0c";
import { debugStateToString } from "@/lib/debugPropsToString";

const initialBlobCount = 7;

export function BlobFactoryRenderer({ size }: { size: Vector2 }) {
    const displayCanvasRef = useRef<HTMLCanvasElement>(null);
    const uiCanvasRef = useRef<HTMLCanvasElement>(null);
    const blobFactoryRef = useRef<BlobFactory>();

    const [smoothness, setSmoothness] = useState(0);

    useEffect(() => {
        assert(displayCanvasRef.current && uiCanvasRef.current);
        blobFactoryRef.current = startBlobFactory(displayCanvasRef.current, uiCanvasRef.current);
        return () => {
            assert(blobFactoryRef.current);
            blobFactoryRef.current.destroy();
            blobFactoryRef.current = undefined;
        };
    }, []);

    useEffect(() => {
        assert(blobFactoryRef.current);
        blobFactoryRef.current.setSize(size);
    }, [size]);

    useEffect(() => {
        assert(blobFactoryRef.current);
        blobFactoryRef.current.onUpdateParams({ smoothness });
    });

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
                        blobFactoryRef.current.onPointerDown();
                    }
                }}
                onPointerUp={(e) => {
                    if (blobFactoryRef.current) {
                        blobFactoryRef.current.onPointerUp();
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
                <RangeInput
                    label="smoothness"
                    value={smoothness}
                    onChange={setSmoothness}
                    min={0}
                    max={100}
                    step={0.1}
                />
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

function startBlobFactory(displayCanvas: HTMLCanvasElement, uiCanvas: HTMLCanvasElement) {
    let size = new Vector2(100, 100);
    let cursor = Vector2.ZERO;
    let params = { smoothness: 0 };

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
        blob.x = random(100, 600);
        blob.y = random(100, 600);
        blob.radius = random(20, 60);
        return blob;
    });

    const resolutionUniform = program.uniformVector2("u_resolution");
    const smoothnessUniform = program.uniformFloat("u_smoothness");

    const positionsVao = program.createAndBindVertexArray({
        name: "a_position",
        size: 2,
        type: GlVertexAttribType.Float,
    });

    const blobsTexturePosition = assertExists(
        displayGl.gl.getUniformLocation(program.program, "u_blobs"),
    );
    const texture = assertExists(displayGl.gl.createTexture());

    // texture:
    {
        const { gl } = displayGl;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0, // level
            gl.RGBA32F, // internal format
            blobs.length, // width
            1, // height
            0, // border
            gl.RGBA, // format
            gl.FLOAT, // type
            blobStore.current, // data
        );

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    const setSize = (newSize: Vector2) => {
        size = newSize;
        displayGl.setDefaultViewport();
        const positions = [0, 0, size.x, size.y, 0, size.y, 0, 0, size.x, 0, size.x, size.y];
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
                    if (distance < blob.radius && distance < nearestDist) {
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
        // draw actual:
        displayGl.clear();
        program.use();

        resolutionUniform.set(size);
        smoothnessUniform.set(params.smoothness);

        displayGl.gl.texImage2D(
            displayGl.gl.TEXTURE_2D,
            0, // level
            displayGl.gl.RGBA32F, // internal format
            blobs.length, // width
            1, // height
            0, // border
            displayGl.gl.RGBA, // format
            displayGl.gl.FLOAT, // type
            blobStore.current, // data
        );

        positionsVao.bindVao();
        displayGl.gl.uniform1i(blobsTexturePosition, 0);
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
        }
        ui.fillText(stateToString(state), new Vector2(30, 40), { fill: "white" });
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
                        // TODO: confirm create
                        const newData = [...blobStore.current, ...times(Blob.size, () => 0)];
                        blobStore.current = new Float32Array(newData);
                        const blob = new Blob(blobStore, blobs.length);
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
        onPointerDown: () => {
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
        onPointerUp: () => {
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
        onUpdateParams: (newParams: typeof params) => {
            params = newParams;
        },
    };
}

class Blob {
    static size = 4;
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

    toJSON() {
        return { center: this.center, radius: this.radius };
    }
}

function RangeInput({
    label,
    value,
    onChange,
    min,
    max,
    step,
}: {
    label: string;
    value: number;
    onChange: (newValue: number) => void;
    min: number;
    max: number;
    step: number;
}) {
    const id = useId();
    return (
        <div className="flex flex-col gap-2 p-3">
            <label htmlFor={id}>{label}</label>
            <div className="flex items-center justify-between gap-3">
                <input
                    id={id}
                    className="w-2/3 flex-auto"
                    type="range"
                    value={value}
                    min={min}
                    max={max}
                    step={step}
                    onChange={(e) => onChange(e.currentTarget.valueAsNumber)}
                />
                <span className="w-1/3 flex-none text-right">{value.toPrecision(3)}</span>
            </div>
        </div>
    );
}

function SwitchInput({
    label,
    value,
    onChange,
}: {
    label: string;
    value: boolean;
    onChange: (newValue: boolean) => void;
}) {
    const id = useId();
    return (
        <div className="flex gap-3 p-3">
            <input
                id={id}
                type="checkbox"
                onChange={(e) => onChange(e.currentTarget.checked)}
                checked={value}
            />
            <label htmlFor={id}>{label}</label>
        </div>
    );
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
