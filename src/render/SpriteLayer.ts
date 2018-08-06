import { Canvas, loadImage } from "canvas";
import { cropCanvas, imageToCanvas } from "../util/image";

export interface ISpriteLayerData {
  filename: string;
  priority: string;
  width: number;
  height: number;
  shift: {
    x: number;
    y: number;
  };

  frame_count?: number;
  line_length?: number;
  scale?: number;
  hr_version?: ISpriteLayerData;
}

export default class SpriteLayer {

  public static async from(data: ISpriteLayerData, highRes: boolean = false): Promise<SpriteLayer> {
    let spriteData = data;

    if (highRes && data.hr_version) {
      spriteData = data.hr_version;
    }

    let file = spriteData.filename;
    file = file.replace(/__(.+?)__/, "$1");
    file = "factorio/" + file;

    const spritesheet = await loadImage(file);
    const spritesheetCanvas = imageToCanvas(spritesheet);

    const frames: Array<Canvas> = [];

    let column = 0;
    let row = 0;

    for (let frame = 0; frame < spriteData.frame_count!; frame++) {
      column = frame % spriteData.line_length!;
      if (frame > 0 && column === 0) {
        row++;
      }

      // TODO test Math.floor vs Math.round
      const x = column * spriteData.width + Math.floor(spriteData.shift.x * column);
      const y = row * spriteData.height + Math.floor(spriteData.shift.y * row);

      frames.push(cropCanvas(spritesheetCanvas, x, y, spriteData.width, spriteData.height));
    }

    return new SpriteLayer(frames);
  }

  private frames: Array<Canvas>;

  constructor(frames: Array<Canvas>) {
    this.frames = frames;
  }

  public getFrames() {
    return this.frames;
  }

}
