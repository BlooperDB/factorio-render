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

  export type Context2d = CanvasRenderingContext2D;
  export const CanvasRenderingContext2D: CanvasRenderingContext2D;
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
  export function parseFont(...args: any[]): any;

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
