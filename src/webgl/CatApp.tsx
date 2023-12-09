import { assert, assertExists } from "@/lib/assert";
import { DebugDraw3d } from "@/lib/DebugDraw3d";
import { Matrix4 } from "@/lib/geom/Matrix4";
import { Vector2 } from "@/lib/geom/Vector2";
import { Vector3, Vector3Ish } from "@/lib/geom/Vector3";
import { Gl, glsl } from "@/lib/gl/Gl";
import { GlBuffer } from "@/lib/gl/GlBuffer";
import { GlBufferUsage, GlCapability, GlVertexAttribType } from "@/lib/gl/GlTypes";
import { GlVertexArray } from "@/lib/gl/GlVertexArray";
import { useEvent } from "@/lib/hooks/useEvent";
import { useResizeObserver } from "@/lib/hooks/useResizeObserver";
import { log9 } from "@/lib/logger";
import { degreesToRadians, frameLoop } from "@/lib/utils";
import { useControls } from "leva";
import { useEffect, useMemo, useRef, useState } from "react";

type Controls = {
    size: Vector2;
    fieldOfView: number;
    spin: number;
    radius: number;
    cameraTranslate: Vector3Ish;
};
const controlsSchema = {
    fieldOfView: {
        value: 60,
        step: 1,
        min: 1,
        max: 179,
    },
    spin: {
        value: 0,
        step: 1,
    },
    radius: {
        value: 200,
        step: 1,
        min: 0,
        max: 500,
    },
    cameraTranslate: {
        value: { x: 0, y: 150, z: 450 },
        step: 1,
    },
};

function start(
    glCanvas: HTMLCanvasElement,
    debugCanvas: HTMLCanvasElement,
    getControls: () => Controls,
): () => void {
    const gl = new Gl(glCanvas);
    const dbg = new DebugDraw3d(assertExists(debugCanvas.getContext("2d")));

    gl.enable(GlCapability.CullFace);
    gl.enable(GlCapability.DepthTest);

    const program = gl.createProgram({
        vertex: glsl`#version 300 es
            in vec4 a_position;
            in vec3 a_normal;

            uniform mat4 u_matrix;

            out vec3 v_normal;

            void main() {
                gl_Position = u_matrix * a_position;
                v_normal = a_normal;
            }
        `,

        fragment: glsl`#version 300 es
            precision highp float;

            uniform vec3 u_reverseLightDirection;
            uniform vec4 u_color;

            in vec3 v_normal;

            out vec4 out_color;
            
            void main() {
                // because v_normal is a varying it's interpolated
                // so it will not be a unit vector. Normalizing it
                // will make it a unit vector again
                vec3 normal = normalize(v_normal);
                
                // compute the light by taking the dot product
                // of the normal to the light's reverse direction
                float light = dot(normal, u_reverseLightDirection);
                
                out_color = u_color;
                
                // Lets multiply just the color portion (not the alpha)
                // by the light
                out_color.rgb *= light;
            }
        `,
    });

    const positionsVao = program.createAndBindVertexArrayObject({
        name: "a_position",
        size: 3,
        type: GlVertexAttribType.Float,
    });
    const vertexNormals = program.createAndBindVertexAttribute({
        name: "a_normal",
        size: 3,
        type: GlVertexAttribType.Float,
    });

    const targetPosition = () => {
        const { spin, radius } = getControls();
        const xz = Vector2.fromPolar(degreesToRadians(spin), radius);
        return new Vector3(xz.x, 0, xz.y);
    };

    const getMatrix = () => {
        const controls = getControls();
        const near = 1;
        const far = 2000;

        // where is the camera?

        // const camera = Matrix4.rotateY(degreesToRadians(controls.cameraAngle)).translate(
        //     controls.cameraTranslate,
        // );
        const camera = Matrix4.lookAt(controls.cameraTranslate, targetPosition(), Vector3.Y);

        // create a view matrix from the camera:
        const view = camera.inverse();

        const perspective = Matrix4.perspective(
            degreesToRadians(controls.fieldOfView),
            controls.size.x / controls.size.y,
            // 1.9401709401709402,
            near,
            far,
        );

        const perspectiveView = perspective.multiply(view);

        return perspectiveView;
    };

    const matrixUniform = program.uniformMatrix4("u_matrix", Matrix4.IDENTITY);
    const _colorUniform = program.uniformVector4("u_color", [0.2, 1, 0.2, 1]);
    const _reverseLightDirectionUniform = program.uniformVector3(
        "u_reverseLightDirection",
        new Vector3(0.5, 0.7, 1).normalize(),
    );
    setLetterF(positionsVao);
    setLetterFNormals(vertexNormals);

    function draw() {
        const { size, radius, spin } = getControls();
        const viewProjectionMatrix = getMatrix();

        dbg.reset(size, viewProjectionMatrix);
        dbg.gizmo(Vector3.ZERO);

        gl.setDefaultViewport();

        gl.clear();

        const fCount = 5;
        for (let ii = 0; ii < fCount; ii++) {
            const angle = (ii * Math.PI * 2) / fCount + degreesToRadians(spin);

            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            matrixUniform.value = viewProjectionMatrix.translate(x, 0, z);

            gl.drawTriangles(program, positionsVao, 6 * 16);
        }
    }

    function setLetterF(positionsVao: GlVertexArray) {
        const positions = new Float32Array([
            // left column front
            0, 0, 0, 0, 150, 0, 30, 0, 0, 0, 150, 0, 30, 150, 0, 30, 0, 0,

            // top rung front
            30, 0, 0, 30, 30, 0, 100, 0, 0, 30, 30, 0, 100, 30, 0, 100, 0, 0,

            // middle rung front
            30, 60, 0, 30, 90, 0, 67, 60, 0, 30, 90, 0, 67, 90, 0, 67, 60, 0,

            // left column back
            0, 0, 30, 30, 0, 30, 0, 150, 30, 0, 150, 30, 30, 0, 30, 30, 150, 30,

            // top rung back
            30, 0, 30, 100, 0, 30, 30, 30, 30, 30, 30, 30, 100, 0, 30, 100, 30, 30,

            // middle rung back
            30, 60, 30, 67, 60, 30, 30, 90, 30, 30, 90, 30, 67, 60, 30, 67, 90, 30,

            // top
            0, 0, 0, 100, 0, 0, 100, 0, 30, 0, 0, 0, 100, 0, 30, 0, 0, 30,

            // top rung right
            100, 0, 0, 100, 30, 0, 100, 30, 30, 100, 0, 0, 100, 30, 30, 100, 0, 30,

            // under top rung
            30, 30, 0, 30, 30, 30, 100, 30, 30, 30, 30, 0, 100, 30, 30, 100, 30, 0,

            // between top rung and middle
            30, 30, 0, 30, 60, 30, 30, 30, 30, 30, 30, 0, 30, 60, 0, 30, 60, 30,

            // top of middle rung
            30, 60, 0, 67, 60, 30, 30, 60, 30, 30, 60, 0, 67, 60, 0, 67, 60, 30,

            // right of middle rung
            67, 60, 0, 67, 90, 30, 67, 60, 30, 67, 60, 0, 67, 90, 0, 67, 90, 30,

            // bottom of middle rung.
            30, 90, 0, 30, 90, 30, 67, 90, 30, 30, 90, 0, 67, 90, 30, 67, 90, 0,

            // right of bottom
            30, 90, 0, 30, 150, 30, 30, 90, 30, 30, 90, 0, 30, 150, 0, 30, 150, 30,

            // bottom
            0, 150, 0, 0, 150, 30, 30, 150, 30, 0, 150, 0, 30, 150, 30, 30, 150, 0,

            // left side
            0, 0, 0, 0, 0, 30, 0, 150, 30, 0, 0, 0, 0, 150, 30, 0, 150, 0,
        ]);

        // Center the F around the origin and Flip it around. We do this because
        // we're in 3D now with and +Y is up where as before when we started with 2D
        // we had +Y as down.

        // We could do by changing all the values above but I'm lazy.
        // We could also do it with a matrix at draw time but you should
        // never do stuff at draw time if you can do it at init time.
        const matrix = Matrix4.rotateX(Math.PI).translate(-50, -75, -15);

        for (let ii = 0; ii < positions.length; ii += 3) {
            const before = new Vector3(positions[ii + 0], positions[ii + 1], positions[ii + 2]);
            const vector = matrix.transformVector3(
                positions[ii + 0],
                positions[ii + 1],
                positions[ii + 2],
            );
            log9(before.toString(), vector.toString());
            positions[ii + 0] = vector.x;
            positions[ii + 1] = vector.y;
            positions[ii + 2] = vector.z;
        }

        positionsVao.bufferData(positions, GlBufferUsage.StaticDraw);
    }

    function setLetterFNormals(vertexNormals: GlBuffer) {
        vertexNormals.bufferData(
            new Float32Array([
                // left column front
                0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,

                // top rung front
                0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,

                // middle rung front
                0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,

                // left column back
                0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,

                // top rung back
                0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,

                // middle rung back
                0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,

                // top
                0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,

                // top rung right
                1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,

                // under top rung
                0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,

                // between top rung and middle
                1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,

                // top of middle rung
                0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,

                // right of middle rung
                1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,

                // bottom of middle rung.
                0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,

                // right of bottom
                1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,

                // bottom
                0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,

                // left side
                -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
            ]),
            GlBufferUsage.StaticDraw,
        );
    }

    return frameLoop(draw);
}

export function CatApp() {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const glCanvasRef = useRef<HTMLCanvasElement>(null);
    const debugCanvasRef = useRef<HTMLCanvasElement>(null);

    const size = useResizeObserver<Vector2>(
        container,
        (entry) => new Vector2(entry.contentRect.width, entry.contentRect.height),
    );
    const sizeToUse = size ?? Vector2.UNIT;
    const scaledSize = sizeToUse.scale(window.devicePixelRatio);
    const hasSize = !!size;

    const rawControls = useControls("Controls", controlsSchema);
    const controls = useMemo(
        (): Controls => ({
            ...rawControls,
            size: sizeToUse,
        }),
        [rawControls, sizeToUse],
    );
    const getControls = useEvent(() => controls);

    useEffect(() => {
        if (!hasSize) return;
        if (!container) return;
        assert(glCanvasRef.current && debugCanvasRef.current);
        return start(glCanvasRef.current, debugCanvasRef.current, getControls);
    }, [container, getControls, hasSize]);

    return (
        <div className="absolute inset-0" ref={setContainer}>
            <canvas
                ref={glCanvasRef}
                width={scaledSize.x}
                height={scaledSize.y}
                style={{ position: "absolute", width: sizeToUse.x, height: sizeToUse.y, inset: 0 }}
            />
            <canvas
                ref={debugCanvasRef}
                width={scaledSize.x}
                height={scaledSize.y}
                style={{ position: "absolute", width: sizeToUse.x, height: sizeToUse.y, inset: 0 }}
            />
        </div>
    );
}
