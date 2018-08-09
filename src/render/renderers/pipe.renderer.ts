import { createCanvas } from "canvas";
import { BlueprintEntity, EntitySprite, RenderPassType } from "../../models";
import { EntityGridView } from "../Blueprint";
import { getEntity } from "../ItemData";
import GenericRenderer from "./generic.renderer";

export default class PipeRenderer extends GenericRenderer {

  public async renderPass(entity: BlueprintEntity, pass: RenderPassType, highRes: boolean = false, animationFrame: number = 0, grid: EntityGridView): Promise<EntitySprite> {
    const ent = getEntity(entity.name);

    if (!ent) {
      throw new Error(`Entity '${entity.name}' doesn't exist!`);
    }

    const pictures = ent.entity.pictures;

    if (!pictures || !("straight_horizontal" in pictures)) {
      throw new Error(`Unable to render ${entity.name}`);
    }

    const source = pictures.straight_horizontal;

    return this.loadSprite(source, entity, pass, "", highRes, animationFrame, grid, (canvas, ctx) => {
      // TODO Bend based on surroundings
      return canvas;
    });
  }

  public getKey(entity: BlueprintEntity, pass: RenderPassType, highRes: boolean, animationFrame: number, grid: EntityGridView): string {
    return entity.name + "_" + (entity.direction || 0) + "_" + pass + "_" + animationFrame;
  }

}
