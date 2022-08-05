import { assert } from "../lib/assert";
import testVert from "./test.vert";
import testFrag from "./test.frag";
import AABB from "../lib/geom/AABB";
import { times, random } from "../lib/utils";
import Vector2 from "../lib/geom/Vector2";
import { Triangle } from "three";

const canvas = document.createElement("canvas");
canvas.width = document.body.clientWidth * window.devicePixelRatio;
canvas.height = document.body.clientHeight * window.devicePixelRatio;
canvas.style.width = `${document.body.clientWidth}px`;
canvas.style.height = `${document.body.clientHeight}px`;
document.body.appendChild(canvas);

const gl = canvas.getContext("webgl");
assert(gl);

enum ShaderType {
    Fragment = WebGLRenderingContext.FRAGMENT_SHADER,
    Vertex = WebGLRenderingContext.VERTEX_SHADER,
}

function createShader(gl: WebGLRenderingContext, type: ShaderType, source: string): WebGLShader {
    const shader = gl.createShader(type);
    assert(shader);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success: boolean = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        throw new Error("compile error");
    }
    return shader;
}

function createProgram(
    gl: WebGLRenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader,
): WebGLProgram {
    const program = gl.createProgram();
    assert(program);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success: boolean = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        throw "link error";
    }
    return program;
}

const vertexShader = createShader(gl, ShaderType.Vertex, testVert);
const fragmentShader = createShader(gl, ShaderType.Fragment, testFrag);
const program = createProgram(gl, vertexShader, fragmentShader);

const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
const colorAttributeLocation = gl.getAttribLocation(program, "a_color");
const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

const positionBuffer = gl.createBuffer();
assert(positionBuffer);

// 2d points
const positions = [10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30];
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

gl.viewport(0, 0, canvas.width, canvas.height);

// Clear the canvas
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Tell it to use our program (pair of shaders)
gl.useProgram(program);

// set the resolution
gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

gl.enableVertexAttribArray(positionAttributeLocation);

// Bind the position buffer.
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
gl.vertexAttribPointer(
    positionAttributeLocation,
    2, // size = 2 components per iteration
    gl.FLOAT, // type = the data is 32bit floats
    false, // normalize = dont normalize the data
    0, // stride = 0 = move forward size * sizeof(type) each iteration to get the next position
    0, // offset = start at the beginning of the buffer
);

const rectCount = 100;
const vertexBuffer = new Float32Array(rectCount * 12);

function setRectangle(gl: WebGLRenderingContext, idx: number, rect: AABB) {
    vertexBuffer.set(
        [
            rect.left,
            rect.top,
            rect.right,
            rect.top,
            rect.left,
            rect.bottom,
            rect.left,
            rect.bottom,
            rect.right,
            rect.top,
            rect.right,
            rect.bottom,
        ],
        idx * 12,
    );
}

times(rectCount, (idx) => {
    const rect = new AABB(
        new Vector2(random(gl.canvas.width), random(gl.canvas.height)),
        new Vector2(random(200), random(200)),
    );

    setRectangle(gl, idx, rect);
});

gl.bufferData(gl.ARRAY_BUFFER, vertexBuffer, gl.STATIC_DRAW);

// Set a random color.
// gl.uniform4f(
//   colorUniformLocation,
//   Math.random(),
//   Math.random(),
//   Math.random(),
//   1,
// );

// Draw the rectangle.
gl.drawArrays(gl.TRIANGLES, 0, rectCount * 6);

export {};
