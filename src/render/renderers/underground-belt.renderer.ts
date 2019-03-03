import { BlueprintEntity, EntitySprite, RenderPassType } from "../../models";
import { EntityGridView } from "../Blueprint";
import { getEntity } from "../ItemData";
import GenericRenderer from "./generic.renderer";

export default class UndergroundBeltRenderer extends GenericRenderer {

  public async renderPass(entity: BlueprintEntity, pass: RenderPassType, highRes: boolean = false, animationFrame: number = 0, grid: EntityGridView): Promise<EntitySprite> {
    const ent = getEntity(entity.name);

    if (!ent) {
      throw new Error("Entity '" + entity.name + "' doesn't exist!");
    }

    let source = ent.entity.structure.direction_in.sheet;
    let direction = entity.direction || 0;

    if (entity.type !== "input") {
      source = ent.entity.structure.direction_out.sheet;
      direction = (direction + 4) % 8;
    }

    return this.loadSprite(source, entity, pass, direction || 0, highRes, animationFrame, grid, (canvas, ctx) => {
      // TODO Add belt
    });
  }

  public getKey(entity: BlueprintEntity, pass: RenderPassType, highRes: boolean, animationFrame: number, grid: EntityGridView): string {
    return entity.name + "_" + (entity.direction || 0) + "_" + (entity.type || "input") + "_" + pass + "_" + animationFrame;
  }

}
