/*
 * Node bindings don't exist for the canvas package, so this file exists to make Typescript stop yelling at us.
 *
 * TODO Possibly improve typings and publish on DefinitelyTyped?
 */

declare module "canvas" {
  import { Readable } from "stream";

  export interface Canvas extends HTMLCanvasElement {

    toBuffer(mimeType?: string, config?: any): Buffer;
    toBuffer(callback: Function, mimeType?: string, config?: any): Buffer;

    createPNGStream(config?: any): Readable;
    createJPEGStream(config?: any): Readable;

    toDataURL(mimeType?: string, options?: any, callback?: Function): string;
    toDataURL(mimeType?: string, callback?: Function): string;
    toDataURL(callback: Function): void;

  }

  export interface CanvasRenderingContext2D extends CanvasPath {
    readonly canvas: HTMLCanvasElement;
    fillStyle: string | CanvasGradient | CanvasPattern;
    font: string;
    globalAlpha: number;
    globalCompositeOperation: string;
    imageSmoothingEnabled: boolean;
    lineCap: string;
    lineDashOffset: number;
    lineJoin: string;
    lineWidth: number;
    miterLimit: number;
    mozImageSmoothingEnabled: boolean;
    msFillRule: CanvasFillRule;
    oImageSmoothingEnabled: boolean;
    shadowBlur: number;
    shadowColor: string;
    shadowOffsetX: number;
    shadowOffsetY: number;
    strokeStyle: string | CanvasGradient | CanvasPattern;
    textAlign: string;
    textBaseline: string;
    webkitImageSmoothingEnabled: boolean;
    beginPath(): void;
    clearRect(x: number, y: number, w: number, h: number): void;
    clip(fillRule?: CanvasFillRule): void;
    clip(path: Path2D, fillRule?: CanvasFillRule): void;
    createImageData(imageDataOrSw: number | ImageData, sh?: number): ImageData;
    createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient;
    createPattern(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, repetition: string): CanvasPattern;
    createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient;
    drawFocusIfNeeded(element: Element): void;
    drawFocusIfNeeded(path: Path2D, element: Element): void;
    drawImage(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap, dstX: number, dstY: number): void;
    drawImage(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap, dstX: number, dstY: number, dstW: number, dstH: number): void;
    drawImage(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap, srcX: number, srcY: number, srcW: number, srcH: number, dstX: number, dstY: number, dstW: number, dstH: number): void;
    fill(fillRule?: CanvasFillRule): void;
    fill(path: Path2D, fillRule?: CanvasFillRule): void;
    fillRect(x: number, y: number, w: number, h: number): void;
    fillText(text: string, x: number, y: number, maxWidth?: number): void;
    getImageData(sx: number, sy: number, sw: number, sh: number): ImageData;
    getLineDash(): number[];
    isPointInPath(x: number, y: number, fillRule?: CanvasFillRule): boolean;
    isPointInPath(path: Path2D, x: number, y: number, fillRule?: CanvasFillRule): boolean;
    isPointInStroke(x: number, y: number, fillRule?: CanvasFillRule): boolean;
    isPointInStroke(path: Path2D, x: number, y: number, fillRule?: CanvasFillRule): boolean;
    measureText(text: string): TextMetrics;
    putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX?: number, dirtyY?: number, dirtyWidth?: number, dirtyHeight?: number): void;
    restore(): void;
    rotate(angle: number): void;
    save(): void;
    scale(x: number, y: number): void;
    setLineDash(segments: number[]): void;
    setTransform(m11: number, m12: number, m21: number, m22: number, dx: number, dy: number): void;
    stroke(path?: Path2D): void;
    strokeRect(x: number, y: number, w: number, h: number): void;
    strokeText(text: string, x: number, y: number, maxWidth?: number): void;
    transform(m11: number, m12: number, m21: number, m22: number, dx: number, dy: number): void;
    translate(x: number, y: number): void;

    // Nonstandard APIs
    textDrawingMode: string;
    filter: string;
    antialias: string;
  }

  export type Context2d = CanvasRenderingContext2D;
  export type CanvasGradient = any;
  export type CanvasPattern = any;
  export type Image = any;
  export type ImageData = any;
  export type PNGStream = any;
  export type PDFStream = any;
  export type JPEGStream = any;
  export type DOMMatrix = any;
  export type DOMPoint = any;

  export function registerFont(name: string, options: any): void;
  export function parseFont(str: string): any;

  export function createCanvas(width: number, height: number, type?: any): Canvas;
  export function createImageData(array: Uint8Array, width: number, height: number): any;
  export function loadImage(src: string): Promise<Image>;

  export const backends: any;

  export const version: string;
  export const cairoVersion: string;
  export const jpegVersion: string;
  export const gifVersion: string;
  export const freetypeVersion: string;
}
