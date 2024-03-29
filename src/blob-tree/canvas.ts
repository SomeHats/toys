import { assertExists } from "@/lib/assert";
import { DebugDraw } from "@/lib/DebugDraw";

export const canvasEl = document.createElement("canvas");
export const ctx = assertExists(canvasEl.getContext("2d"));
export const width = document.body.clientWidth;
export const height = document.body.clientHeight;
export const scale = window.devicePixelRatio;

canvasEl.width = width * scale;
canvasEl.height = height * scale;
canvasEl.style.width = `${width}px`;
canvasEl.style.height = `${height}px`;
ctx.scale(scale, scale);
export const canvas = new DebugDraw(ctx);
document.body.appendChild(canvasEl);
