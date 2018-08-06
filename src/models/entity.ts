import { createCanvas, Image, loadImage } from "canvas";
import { getDirection } from "../util/blueprint";
import { cropCanvas, imageToCanvas } from "../util/image";
import { BlueprintEntity } from "./blueprint";
import { SpriteData } from "./sprite";
import { Vector } from "./vector";

export interface RecipeData {
  type: string;
  name: string;
  normal: {
    enabled: boolean;
    ingredients: Array<Array<string | number>>
    result: string;
  };
  expensive?: {
    enabled: boolean;
    ingredients: Array<Array<string | number>>
    result: string;
  };
}

export interface ItemData {
  type: string;
  subgroup: string;
  order: string;
  icon_size: number;
  name: string;
  stack_size: number;
  icon: string;
  place_result: string;
  flags: Array<string>;
}

type PictureTypes = SpriteData |
  { layers: Array<SpriteData> } |
  { north: SpriteData, east: SpriteData, south: SpriteData, west: SpriteData };

export interface EntityData {
  name?: string;
  selection_box?: Array<Array<number>>;
  animation?: any;
  animations?: any;
  sprite?: any;
  sprites?: any;
  picture?: PictureTypes;
  pictures?: any;
  layer?: any;
}

export class Entity {

  public readonly entity: EntityData;
  public readonly item: ItemData;
  public readonly recipe: RecipeData;

  constructor(entity: EntityData, item: ItemData, recipe: RecipeData) {
    this.entity = entity;
    this.item = item;
    this.recipe = recipe;
  }

  public getTileSize(): Vector {
    if (!this.entity.selection_box) {
      return {
        x: 1,
        y: 1
      };
    }

    const min = this.entity.selection_box[0];
    const max = this.entity.selection_box[1];

    return {
      x: Math.ceil(Math.abs(min[0]) + Math.abs(max[0])),
      y: Math.ceil(Math.abs(min[1]) + Math.abs(max[1]))
    };
  }

  public async getSprite(entity: BlueprintEntity, shadow: boolean = false): Promise<Image | undefined> {
    if (this.entity.layer) {
      console.log("LAYER ON", this.entity.name, JSON.stringify(this.entity));
    } else if (this.entity.picture) {
      let picture = this.entity.picture;

      if ("layers" in picture) {
        picture = picture.layers[shadow ? 1 : 0];
      }

      if ("north" in picture && "east" in picture && "south" in picture && "west" in picture) {
        const direction = getDirection(entity.direction || 0);
        return this.loadSprite(picture[direction] as SpriteData, direction);
      }

      return this.loadSprite(picture as SpriteData);
    } else if (this.entity.pictures) {
      // console.log("PICTURES ON", this.entity.name, JSON.stringify(this.entity));
    } else if (this.entity.sprite) {
      // console.log("SPRITE ON", this.entity.name, JSON.stringify(this.entity));
    } else if (this.entity.sprites) {
      // console.log("SPRITES ON", this.entity.name, JSON.stringify(this.entity));
    } else if (this.entity.animation) {
      // console.log("ANIMATION ON", this.entity.name, JSON.stringify(this.entity));
    } else if (this.entity.animations) {
      // console.log("ANIMATIONS ON", this.entity.name, JSON.stringify(this.entity));
    }

    /*
    SpriteLayer.from(this.entity.animation.layers[0], true).then((spriteLayer) => {
      spriteLayer.getFrames().forEach((frame, index) => {
        fs.writeFile(`output/${index}.png`, frame.toBuffer(), () => undefined);
      });
    });
    */
  }

  private async loadSprite(sprite: SpriteData, direction?: "north" | "east" | "south" | "west", highRes: boolean = false): Promise<Image | undefined> {
    let spriteData = sprite;

    if (highRes && spriteData.hr_version) {
      spriteData = spriteData.hr_version;
    }

    console.log(JSON.stringify(spriteData));
    let file = spriteData.filename;
    file = file.replace(/__(.+?)__/, "$1");
    file = "factorio/" + file;

    let image = await loadImage(file);

    if (!image) {
      return;
    }

    if (!spriteData.shift) {
      return image;
    }

    const row = 0;
    let column = 0;

    if (direction) {
      switch (direction) {
        default:
        case "north":
          column = 0;
          break;
        case "east":
          column = 1;
          break;
        case "south":
          column = 2;
          break;
        case "west":
          column = 3;
          break;
      }
    }

    let shiftX = 0;
    let shiftY = 0;

    if ("x" in spriteData.shift && "y" in spriteData.shift) {
      shiftX = spriteData.shift.x;
      shiftY = spriteData.shift.y;
    } else if (Array.isArray(spriteData.shift)) {
      shiftX = spriteData.shift[0];
      shiftY = spriteData.shift[1];
    }

    const x = column * spriteData.width;
    const y = row * spriteData.height;

    let canvas = imageToCanvas(image);
    image = cropCanvas(canvas, x, y, spriteData.width, spriteData.height);
    const lel = image;

    const width = spriteData.width;
    const height = spriteData.height;

    const centerX = Math.round(Math.abs((shiftX - width / 64) * 32));
    const centerY = Math.round(Math.abs((shiftY - height / 64) * 32));

    let canvasWidth = width + Math.abs((width / 2) - centerX);
    let canvasHeight = height + Math.abs((height / 2) - centerY);

    const currentDeltaX = Math.round(canvasWidth / 2) - centerX;
    const currentDeltaY = Math.round(canvasHeight / 2) - centerY;

    if (currentDeltaX < 0) {
      canvasWidth += Math.abs(currentDeltaX) * 2;
    } else if (currentDeltaX + width > canvasWidth) {
      canvasWidth += (currentDeltaX + width) - canvasWidth;
    }

    if (currentDeltaY < 0) {
      canvasHeight += Math.abs(currentDeltaY) * 2;
    } else if (currentDeltaY + height > canvasHeight) {
      canvasHeight += (currentDeltaY + height) - canvasHeight;
    }

    const deltaX = Math.round(canvasWidth / 2) - centerX;
    const deltaY = Math.round(canvasHeight / 2) - centerY;

    canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, width, height, deltaX, deltaY, width, height);
    return canvas;
  }

}
