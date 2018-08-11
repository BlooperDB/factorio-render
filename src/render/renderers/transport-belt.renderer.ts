import { createCanvas } from "canvas";
import { BlueprintEntity, EntitySprite, RenderPassType, Vector } from "../../models";
import { EntityGridView } from "../Blueprint";
import { getEntity } from "../ItemData";
import GenericRenderer from "./generic.renderer";

export default class TransportBeltRenderer extends GenericRenderer {

  public async renderPass(entity: BlueprintEntity, pass: RenderPassType, highRes: boolean = false, animationFrame: number = 0, grid: EntityGridView): Promise<EntitySprite> {
    const ent = getEntity(entity.name);

    if (!ent) {
      throw new Error("Entity '" + entity.name + "' doesn't exist!");
    }

    if (pass !== "ENTITY") {
      return {};
    }

    let source = ent.entity.belt_vertical;

    if (entity.direction === 2 || entity.direction === 6) {
      source = ent.entity.belt_horizontal;
    }

    const around = this.getAround(entity.direction || 0, entity.position, grid);
    const count = around.reduce((a: number, b: number) => a + b, 0);
    const direction = entity.direction || 0;

    let yPos = 0;
    let rotation = 90;

    switch (count) {
      default:
      case 0:
      case 2:
      case 3:
        if (direction === 0 || direction === 4) {
          rotation = 0;
        }
        break;
      case 1:
        if (around[0]) {
          switch (direction) {
            default:
            case 0:
            case 4:
              rotation = 0;
              break;
            case 2:
              yPos = 9;
              break;
            case 6:
              yPos = 8;
              rotation = 0;
              break;
          }
        } else if (around[1]) {
          if (direction === 0) {
            yPos = 8;
            rotation = 0;
          } else if (direction === 4) {
            yPos = 9;
          }
        } else if (around[2]) {
          switch (direction) {
            default:
            case 0:
            case 4:
              rotation = 0;
              break;
            case 2:
              yPos = 8;
              rotation = 0;
              break;
            case 6:
              yPos = 9;
              break;
          }
        } else if (around[3]) {
          if (direction === 0) {
            yPos = 9;
          } else if (direction === 4) {
            yPos = 8;
            rotation = 0;
          }
        }
        break;
    }

    return this.loadSprite(source, entity, pass, "", highRes, animationFrame, grid, (canvas, ctx) => {
      // TODO Bend based on surroundings
      const newCanvas = createCanvas(canvas.width, canvas.height);
      const newCtx = newCanvas.getContext("2d");

      if (!newCtx) {
        throw new Error("Unable to create canvas");
      }

      newCtx.translate(canvas.width / 2, canvas.height / 2);
      newCtx.rotate((((entity.direction || 0) * 45) - rotation) * Math.PI / 180);
      newCtx.drawImage(canvas, (canvas.width / 2) * -1, (canvas.height / 2) * -1);
      return newCanvas;
    }, yPos);
  }

  public getKey(entity: BlueprintEntity, pass: RenderPassType, highRes: boolean, animationFrame: number, grid: EntityGridView): string {
    return entity.name + "_" + (entity.direction || 0) + "_" + pass + "_" + this.getAround(entity.direction || 0, entity.position, grid).join("_") + "_" + animationFrame;
  }

  public getAround(direction: number, pos: Vector, grid: EntityGridView): any {
    return [
      pos.x in grid.belts && pos.y - 0.5 in grid.belts[pos.x] && direction !== 0,
      pos.x + 0.5 in grid.belts && pos.y in grid.belts[pos.x + 0.5] && direction !== 2,
      pos.x in grid.belts && pos.y + 0.5 in grid.belts[pos.x] && direction !== 4,
      pos.x - 0.5 in grid.belts && pos.y in grid.belts[pos.x - 0.5] && direction !== 6
    ];
  }

}
