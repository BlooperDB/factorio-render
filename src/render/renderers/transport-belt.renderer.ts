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

    const source = ent.entity.belt_animation_set;

    const around = this.getAround(entity.direction || 0, entity.position, grid);
    const count = around.reduce((a: number, b: number) => a + b, 0);
    const direction = entity.direction || 0;

    let yPos = source.north_index;

    switch (direction) {
      default:
      case 0:
        yPos = source.north_index;
        break;
      case 2:
        yPos = source.east_index;
        break;
      case 4:
        yPos = source.south_index;
        break;
      case 6:
        yPos = source.west_index;
        break;
    }

    if (count === 1) {
      if (around[0]) {
        switch (direction) {
          default:
          case 0:
            yPos = source.west_to_north_index;
            break;
          case 4:
            yPos = source.south_index;
            break;
          case 2:
            yPos = source.north_to_east_index;
            break;
          case 6:
            yPos = source.north_to_west_index;
            break;
        }
      } else if (around[1]) {
        switch (direction) {
          default:
          case 0:
            yPos = source.east_to_north_index;
            break;
          case 4:
            yPos = source.east_to_south_index;
            break;
          case 2:
            yPos = source.east_index;
            break;
          case 6:
            yPos = source.west_index;
            break;
        }
      } else if (around[2]) {
        switch (direction) {
          default:
          case 0:
            yPos = source.north_index;
            break;
          case 4:
            yPos = source.south_index;
            break;
          case 2:
            yPos = source.south_to_east_index;
            break;
          case 6:
            yPos = source.south_to_west_index;
            break;
        }
      } else if (around[3]) {
        switch (direction) {
          default:
          case 0:
            yPos = source.west_to_north_index;
            break;
          case 4:
            yPos = source.west_to_south_index;
            break;
          case 2:
            yPos = source.east_index;
            break;
          case 6:
            yPos = source.west_index;
            break;
        }
      }
    }

    yPos = yPos - 1;

    return this.loadSprite(source.animation_set, entity, pass, "", highRes, animationFrame, grid, (canvas, ctx) => {
      const newCanvas = createCanvas(canvas.width, canvas.height);
      const newCtx = newCanvas.getContext("2d");

      if (!newCtx) {
        throw new Error("Unable to create canvas");
      }

      newCtx.translate(canvas.width / 2, canvas.height / 2);
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
