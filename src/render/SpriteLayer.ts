import { Canvas, loadImage } from "canvas";
import { imageToCanvas, cropCanvas } from "../util/image";

export interface ISpriteLayerData {
  filename: string;
  priority: string;
  width: number;
  height: number;
  frame_count: number;
  line_length: number;
  shift: {
    x: number;
    y: number;
  };
  scale?: number;

  hr_version?: ISpriteLayerData;
}

export default class SpriteLayer {

  public static async from(data: ISpriteLayerData, highRes: boolean = false) {
    let spriteData = data;

    if (highRes && data.hr_version) spriteData = data.hr_version;

    const spritesheet = await loadImage(spriteData.filename);
    const spritesheetCanvas = imageToCanvas(spritesheet);

    const frames: Canvas[] = [];

    let column = 0;
    let row = 0;

    for (let frame = 0; frame < data.frame_count; frame++) {
      column = frame % data.line_length;
      if (frame > 0 && column === 0) row++;

      // TODO test Math.floor vs Math.round
      const x = column * data.width + Math.floor(data.shift.x * column);
      const y = row * data.height + Math.floor(data.shift.y * row);

      frames.push(cropCanvas(spritesheetCanvas, x, y, data.width, data.height));
    }

    return new SpriteLayer(frames);
  }

  private frames: Canvas[];

  constructor(frames: Canvas[]) {
    this.frames = frames;
  }

  public getFrames() {
    return this.frames;
  }

}
