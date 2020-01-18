import { DebugDraw } from '../lib/DebugCanvas';
import * as config from './config';

export const canvasEl = document.createElement('canvas');
export const ctx = canvasEl.getContext('2d')!;
export const width = config.SIZE;
export const height = config.SIZE;
export const scale = window.devicePixelRatio;

canvasEl.width = width * scale;
canvasEl.height = height * scale;
canvasEl.style.width = `${width}px`;
canvasEl.style.height = `${height}px`;
ctx.scale(scale, scale);
export const canvas = new DebugDraw(ctx);
document.body.appendChild(canvasEl);
