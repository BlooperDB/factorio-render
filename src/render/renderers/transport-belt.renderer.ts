import { createCanvas } from "canvas";
import { BlueprintEntity, EntitySprite, RenderPassType } from "../../models";
import { EntityGridView } from "../Blueprint";
import { getEntity } from "../ItemData";
import GenericRenderer from "./generic.renderer";

export default class TransportBeltRenderer extends GenericRenderer {

  public async renderPass(entity: BlueprintEntity, pass: RenderPassType, highRes: boolean = false, animationFrame: number = 0, grid: EntityGridView): Promise<EntitySprite> {
    const ent = getEntity(entity.name);

    if (!ent) {
      throw new Error("Entity '" + entity.name + "' doesn't exist!");
    }

    let source = ent.entity.belt_vertical;

    if (entity.direction === 2 || entity.direction === 6) {
      source = ent.entity.belt_horizontal;
    }

    return this.loadSprite(source, entity, pass, "", highRes, animationFrame, grid, (canvas, ctx) => {
      // TODO Bend based on surroundings
      if (entity.direction && entity.direction >= 4) {
        const newCanvas = createCanvas(canvas.width, canvas.height);
        const newCtx = newCanvas.getContext("2d");
        newCtx.translate(canvas.width / 2, canvas.height / 2);
        newCtx.rotate(((entity.direction * 45) - (entity.direction === 6 ? 90 : 0)) * Math.PI / 180);
        newCtx.drawImage(canvas, (canvas.width / 2) * -1, (canvas.height / 2) * -1);
        return newCanvas;
      }
    });
  }

  public getKey(entity: BlueprintEntity, pass: RenderPassType, highRes: boolean, animationFrame: number, grid: EntityGridView): string {
    return entity.name + "_" + (entity.direction || 0) + "_" + pass + "_" + animationFrame;
  }

}
