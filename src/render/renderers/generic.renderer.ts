import { createCanvas, loadImage } from "canvas";
import { BlueprintEntity, Renderer, RenderPassType } from "../../models";
import { SpriteData } from "../../models";
import { EntitySprite } from "../../models";
import { getBearing, getDirection } from "../../util/blueprint";
import { cropCanvas, imageToCanvas } from "../../util/image";
import { EntityGridView } from "../Blueprint";
import { getEntity } from "../ItemData";

const renderCache: { [key: string]: any; } = {};

const animatedDirections = [
  "radar"
];

export default class GenericRenderer implements Renderer {

  public async renderPass(entity: BlueprintEntity, pass: RenderPassType, highRes: boolean = false, animationFrame: number = 0, grid: EntityGridView): Promise<EntitySprite> {
    const ent = getEntity(entity.name);

    if (!ent) {
      throw new Error("Entity '" + entity.name + "' doesn't exist!");
    }

    if (pass === "OVERLAY") {
      if (ent.entity.overlay) {
        let overlayPicture = ent.entity.overlay;

        if ("layers" in overlayPicture) {
          overlayPicture = overlayPicture.layers[0];
        }

        return this.loadSprite(overlayPicture as SpriteData, entity, pass, undefined, highRes, animationFrame, grid);
      }
    } else if (ent.entity.layer) {
      // console.log("LAYER ON", ent.entity.name, JSON.stringify(ent.entity));
    } else if (ent.entity.picture) {
      let picture = ent.entity.picture;
      let hasShadow = false;

      if ("layers" in picture) {
        picture = picture.layers[pass === "SHADOW" ? 1 : 0];
        hasShadow = true;
      }

      if ("north" in picture && "east" in picture && "south" in picture && "west" in picture) {
        const direction = getBearing(entity.direction || 0);
        return this.loadSprite(picture[direction] as SpriteData, entity, pass, direction, highRes, 0, grid);
      }

      if (pass !== "SHADOW" || (pass === "SHADOW" && hasShadow)) {
        return this.loadSprite(picture as SpriteData, entity, pass, undefined, highRes, 0, grid);
      }
    } else if (ent.entity.pictures) {
      let pictures = ent.entity.pictures;
      let hasShadow = false;

      if ("up" in pictures && "right" in pictures && "down" in pictures && "left" in pictures) {
        const direction = getDirection(entity.direction || 0);
        return this.loadSprite(pictures[direction] as SpriteData, entity, pass, direction, highRes, animationFrame, grid);
      }

      if ("picture" in pictures) {
        pictures = pictures.picture;
      }

      if ("sheets" in pictures) {
        pictures = pictures.sheets[pass === "SHADOW" ? 1 : 0];
        hasShadow = true;
      }

      if ("layers" in pictures) {
        pictures = pictures.layers[pass === "SHADOW" ? 1 : 0];
        hasShadow = true;
      }

      if ("frames" in pictures) {
        const direction = getBearing(entity.direction || 0);
        return this.loadSprite(pictures as SpriteData, entity, pass, direction, highRes, animationFrame, grid);
      }

      if (pass !== "SHADOW" || (pass === "SHADOW" && hasShadow)) {
        return this.loadSprite(pictures as SpriteData, entity, pass, undefined, highRes, animationFrame, grid);
      }
    } else if (ent.entity.sprite) {
      let sprite = ent.entity.sprite;
      let hasShadow = false;

      if ("layers" in sprite) {
        sprite = sprite.layers[pass === "SHADOW" ? 1 : 0];
        hasShadow = true;
      }

      if (pass !== "SHADOW" || (pass === "SHADOW" && hasShadow)) {
        return this.loadSprite(sprite as SpriteData, entity, pass, undefined, highRes, 0, grid);
      }
    } else if (ent.entity.sprites) {
      // console.log("SPRITES ON", ent.entity.name, JSON.stringify(ent.entity));
    } else if (ent.entity.animation) {
      let animation = ent.entity.animation;
      let hasShadow = false;
      let direction;

      if ("north" in animation && "east" in animation && "south" in animation && "west" in animation) {
        direction = getBearing(entity.direction || 0);
        // TODO Find out why typescript is angry
        // @ts-ignore
        animation = animation[direction];
      }

      if ("layers" in animation) {
        animation = animation.layers[pass === "SHADOW" ? 1 : 0];
        hasShadow = true;
      }

      if (pass !== "SHADOW" || (pass === "SHADOW" && hasShadow)) {
        return this.loadSprite(animation as SpriteData, entity, pass, direction, highRes, animationFrame, grid);
      }
    } else if (ent.entity.animations) {
      let animations = ent.entity.animations;
      let hasShadow = false;
      let direction;

      if ("north" in animations && "east" in animations && "south" in animations && "west" in animations) {
        direction = getBearing(entity.direction || 0);
        // TODO Find out why typescript is angry
        // @ts-ignore
        animations = animations[direction];
      }

      if ("layers" in animations) {
        animations = animations.layers[pass === "SHADOW" ? 1 : 0];
        hasShadow = true;
      }

      if (pass !== "SHADOW" || (pass === "SHADOW" && hasShadow)) {
        return this.loadSprite(animations as SpriteData, entity, pass, direction, highRes, animationFrame, grid);
      }
    }

    if (pass === "ENTITY") {
      console.log("Failed to render:", entity.name);
    }

    return {};
  }

  public getKey(entity: BlueprintEntity, pass: RenderPassType, highRes: boolean, animationFrame: number, grid: EntityGridView): string {
    return entity.name + (entity.direction ? "_" + entity.direction : "") + "_" + pass + "_" + animationFrame;
  }

  protected async loadSprite(sprite: SpriteData, entity: BlueprintEntity, pass: RenderPassType, direction: string | number = 0, highRes: boolean = false, animationFrame: number = 0, grid: EntityGridView, postProcess?: (canvas: any, ctx: CanvasRenderingContext2D) => any, row?: number, column?: number): Promise<EntitySprite> {
    let spriteData = sprite;

    if (highRes && spriteData.hr_version) {
      spriteData = spriteData.hr_version;
    }

    let file = spriteData.filename;

    if (!file) {
      return {};
    }

    file = file.replace(/__(.+?)__/, "$1");
    file = "factorio/" + file;

    let frame = 0;

    if ((spriteData.frame_count && spriteData.frame_count > 1) || (spriteData.direction_count && animatedDirections.indexOf(entity.name!) >= 0)) {
      frame = animationFrame;
    }

    const key = this.getKey(entity, pass, highRes, frame, grid);

    if (renderCache[key]) {
      return renderCache[key];
    }

    let image = await loadImage(file);

    if (!image) {
      return {};
    }

    if (direction && image.width > spriteData.width) {
      switch (direction) {
        default:
        case "north":
        case "up":
        case 0:
          column = 0;
          break;
        case "east":
        case "right":
        case 2:
          column = 1;
          break;
        case "south":
        case "down":
        case 4:
          column = 2;
          break;
        case "west":
        case "left":
        case 6:
          column = 3;
          break;
      }
    }

    if ((spriteData.frame_count && spriteData.frame_count > 1) || (spriteData.direction_count && animatedDirections.indexOf(entity.name!) >= 0)) {
      column = animationFrame % (spriteData.frame_count || spriteData.direction_count)!;
      if (spriteData.line_length) {
        row = Math.floor(column / spriteData.line_length);
        column = column % spriteData.line_length;
      }
    }

    let shiftX = 0;
    let shiftY = 0;

    if (spriteData.shift) {
      if ("x" in spriteData.shift && "y" in spriteData.shift) {
        shiftX = spriteData.shift.x;
        shiftY = spriteData.shift.y;
      } else if (Array.isArray(spriteData.shift)) {
        shiftX = spriteData.shift[0];
        shiftY = spriteData.shift[1];
      }
    }

    const x = (column || 0) * spriteData.width;
    const y = (row || 0) * spriteData.height;

    let canvas = imageToCanvas(image);
    image = cropCanvas(canvas, spriteData.x || x, spriteData.y || y, spriteData.width, spriteData.height);

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

    if (!ctx) {
      throw new Error("Unable to create canvas");
    }

    if (spriteData.draw_as_shadow) {
      ctx.globalAlpha = 0.5;
    }

    ctx.drawImage(image, 0, 0, width, height, deltaX, deltaY, width, height);

    if (postProcess) {
      canvas = postProcess(canvas, ctx) || canvas;
    }

    renderCache[key] = {
      image: canvas,
      key
    };

    return renderCache[key];
  }

}
