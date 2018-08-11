import { BlueprintEntity, EntitySprite, RenderPassType } from "../../models";
import { EntityGridView } from "../Blueprint";
import { getEntity } from "../ItemData";
import GenericRenderer from "./generic.renderer";

export default class PipeToGroundRenderer extends GenericRenderer {

  public async renderPass(entity: BlueprintEntity, pass: RenderPassType, highRes: boolean = false, animationFrame: number = 0, grid: EntityGridView): Promise<EntitySprite> {
    const ent = getEntity(entity.name);

    if (!ent) {
      throw new Error("Entity '" + entity.name + "' doesn't exist!");
    }

    const pictures = ent.entity.pictures;

    if (!pictures || !("left" in pictures)) {
      throw new Error(`Unable to render ${entity.name}`);
    }

    let source = pictures.up;
    const direction = entity.direction || 0;

    switch (direction) {
      default:
      case 0:
        break;
      case 2:
        source = pictures.right;
        break;
      case 4:
        source = pictures.down;
        break;
      case 6:
        source = pictures.left;
        break;
    }

    // TODO Add caps to ends

    return this.loadSprite(source, entity, pass, direction || 0, highRes, animationFrame, grid);
  }

  public getKey(entity: BlueprintEntity, pass: RenderPassType, highRes: boolean, animationFrame: number, grid: EntityGridView): string {
    return entity.name + "_" + (entity.direction || 0) + "_" + (entity.type || "input") + "_" + pass + "_" + animationFrame;
  }

}
