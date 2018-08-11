import { Canvas, createCanvas, Image } from "canvas";

export function loadImage(location: string) {
  const image = new Image();
  image.src = location;
  return image;
}

export function imageToCanvas(image: Image) {
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Unable to create canvas");
  }

  ctx.drawImage(image, 0, 0);

  return canvas;
}

export function cropCanvas(canvas: Canvas, x: number, y: number, width: number, height: number) {
  const resultCanvas = createCanvas(width, height);
  const ctx = resultCanvas.getContext("2d");

  if (!ctx) {
    throw new Error("Unable to create canvas");
  }

  ctx.drawImage(canvas, x, y, width, height, 0, 0, width, height);

  return resultCanvas;
}
