import { createCanvas, Image, loadImage } from "canvas";
import { getBearing, getDirection } from "../util/blueprint";
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
  { sheets: Array<SpriteData> } |
  { north: PictureTypes, east: PictureTypes, south: PictureTypes, west: PictureTypes };

type PicturesTypes = PictureTypes |
  SpriteData |
  { picture: PictureTypes } |
  { left: SpriteData, right: SpriteData, up: SpriteData, down: SpriteData };

type SpriteTypes = SpriteData |
  { layers: Array<SpriteData> };

type AnimationTypes = PicturesTypes;

export interface EntityData {
  name?: string;
  selection_box?: Array<Array<number>>;
  animation?: AnimationTypes;
  animations?: AnimationTypes;
  sprite?: SpriteTypes;
  sprites?: any;
  picture?: PictureTypes;
  pictures?: PicturesTypes;
  layer?: any;
  overlay?: PictureTypes;
}

export interface EntitySprite {
  image?: Image;
  key?: string;
}

const renderCache: { [key: string]: any; } = {};

const animated_directions = [
  "radar"
];

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

  // TODO Abstract
  public async getSprite(entity: BlueprintEntity, shadow: boolean = false, overlay: boolean = false, highRes: boolean = false, animationFrame: number = 0): Promise<EntitySprite> {
    if (this.entity.name === "radar") {
      console.log(JSON.stringify(this.entity));
    }
    if (overlay) {
      if (this.entity.overlay) {
        let overlayPicture = this.entity.overlay;

        if ("layers" in overlayPicture) {
          overlayPicture = overlayPicture.layers[0];
        }

        if (!shadow || (shadow && overlay)) {
          return this.loadSprite(overlayPicture as SpriteData, undefined, highRes, animationFrame);
        }
      }
    } else if (this.entity.layer) {
      console.log("LAYER ON", this.entity.name, JSON.stringify(this.entity));
    } else if (this.entity.picture) {
      let picture = this.entity.picture;
      let hasShadow = false;

      if ("layers" in picture) {
        picture = picture.layers[shadow ? 1 : 0];
        hasShadow = true;
      }

      if ("north" in picture && "east" in picture && "south" in picture && "west" in picture) {
        const direction = getBearing(entity.direction || 0);
        return this.loadSprite(picture[direction] as SpriteData, direction, highRes, 0);
      }

      if (!shadow || (shadow && hasShadow)) {
        return this.loadSprite(picture as SpriteData, undefined, highRes, 0);
      }
    } else if (this.entity.pictures) {
      let pictures = this.entity.pictures;
      let hasShadow = false;

      if ("up" in pictures && "right" in pictures && "down" in pictures && "left" in pictures) {
        const direction = getDirection(entity.direction || 0);
        return this.loadSprite(pictures[direction] as SpriteData, direction, highRes, animationFrame);
      }

      if ("picture" in pictures) {
        pictures = pictures.picture;
      }

      if ("sheets" in pictures) {
        pictures = pictures.sheets[shadow ? 1 : 0];
        hasShadow = true;
      }

      if ("layers" in pictures) {
        pictures = pictures.layers[shadow ? 1 : 0];
        hasShadow = true;
      }

      if ("frames" in pictures) {
        const direction = getBearing(entity.direction || 0);
        return this.loadSprite(pictures as SpriteData, direction, highRes, animationFrame);
      }

      // TODO Custom Renderers
      if (entity.name !== "pipe" && entity.name !== "stone-wall" && entity.name !== "straight-rail" && entity.name !== "curved-rail") {
        if (!shadow || (shadow && hasShadow)) {
          return this.loadSprite(pictures as SpriteData, undefined, highRes, animationFrame);
        }
      }
    } else if (this.entity.sprite) {
      let sprite = this.entity.sprite;
      let hasShadow = false;

      if ("layers" in sprite) {
        sprite = sprite.layers[shadow ? 1 : 0];
        hasShadow = true;
      }

      if (!shadow || (shadow && hasShadow)) {
        return this.loadSprite(sprite as SpriteData, undefined, highRes, 0);
      }
    } else if (this.entity.sprites) {
      // TODO Custom Renderers
      if (entity.name !== "arithmetic-combinator" && entity.name !== "decider-combinator" && entity.name !== "constant-combinator") {
        console.log("SPRITES ON", this.entity.name, JSON.stringify(this.entity));
      }
    } else if (this.entity.animation) {
      let animation = this.entity.animation;
      let hasShadow = false;
      let direction;

      if ("north" in animation && "east" in animation && "south" in animation && "west" in animation) {
        direction = getBearing(entity.direction || 0);
        // TODO Find out why typescript is angry
        // @ts-ignore
        animation = animation[direction];
      }

      if ("layers" in animation) {
        animation = animation.layers[shadow ? 1 : 0];
        hasShadow = true;
      }

      // TODO Custom Renderers
      if (entity.name !== "rail-chain-signal" && entity.name !== "rail-signal" && entity.name !== "beacon" && entity.name !== "electric-furnace" && entity.name !== "centrifuge") {
        if (!shadow || (shadow && hasShadow)) {
          return this.loadSprite(animation as SpriteData, direction, highRes, animationFrame);
        }
      }
    } else if (this.entity.animations) {
      let animations = this.entity.animations;
      let hasShadow = false;
      let direction;

      if ("north" in animations && "east" in animations && "south" in animations && "west" in animations) {
        direction = getBearing(entity.direction || 0);
        // TODO Find out why typescript is angry
        // @ts-ignore
        animations = animations[direction];
      }

      if ("layers" in animations) {
        animations = animations.layers[shadow ? 1 : 0];
        hasShadow = true;
      }

      // TODO Custom Renderers
      if (!entity.name.endsWith("transport-belt") && entity.name !== "train-stop") {
        if (!shadow || (shadow && hasShadow)) {
          return this.loadSprite(animations as SpriteData, direction, highRes, animationFrame);
        }
      }
    }

    /*
    SpriteLayer.from(this.entity.animation.layers[0], true).then((spriteLayer) => {
      spriteLayer.getFrames().forEach((frame, index) => {
        fs.writeFile(`output/${index}.png`, frame.toBuffer(), () => undefined);
      });
    });
    */

    return {};
  }

  private async loadSprite(sprite: SpriteData, direction?: string, highRes: boolean = false, animationFrame: number = 0): Promise<EntitySprite> {
    let spriteData = sprite;

    if (highRes && spriteData.hr_version) {
      spriteData = spriteData.hr_version;
    }

    // console.log(JSON.stringify(spriteData));
    let file = spriteData.filename;
    file = file.replace(/__(.+?)__/, "$1");
    file = "factorio/" + file;

    let frame = 0;

    if ((spriteData.frame_count && spriteData.frame_count > 1) || (spriteData.direction_count && animated_directions.indexOf(this.entity.name!) >= 0)) {
      frame = animationFrame;
    }

    const key = file + (direction ? "_" + direction : "") + "_" + frame;

    if (renderCache[key]) {
      return renderCache[key];
    }

    let image = await loadImage(file);

    if (!image) {
      return {};
    }

    if (!spriteData.shift) {
      renderCache[key] = {
        image,
        key
      };

      return renderCache[key];
    }

    let row = 0;
    let column = 0;

    if (direction && image.width > spriteData.width) {
      switch (direction) {
        default:
        case "north":
        case "up":
          column = 0;
          break;
        case "east":
        case "right":
          column = 1;
          break;
        case "south":
        case "down":
          column = 2;
          break;
        case "west":
        case "left":
          column = 3;
          break;
      }
    }

    if ((spriteData.frame_count && spriteData.frame_count > 1) || (spriteData.direction_count && animated_directions.indexOf(this.entity.name!) >= 0)) {
      column = animationFrame % (spriteData.frame_count || spriteData.direction_count)!;
      if (spriteData.line_length) {
        row = Math.floor(column / spriteData.line_length);
        column = column % spriteData.line_length;
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

    if (spriteData.draw_as_shadow) {
      ctx.globalAlpha = 0.5;
    }

    ctx.drawImage(image, 0, 0, width, height, deltaX, deltaY, width, height);

    renderCache[key] = {
      image: canvas,
      key
    };

    return renderCache[key];
  }

}
