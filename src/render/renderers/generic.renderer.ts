import { Image } from "canvas";
import { BlueprintEntity, Renderer } from "../../models";
import { EntityGridView } from "../Blueprint";
import { getEntity } from "../ItemData";

export default class GenericRenderer implements Renderer {

  public renderPass(entity: BlueprintEntity, grid: EntityGridView): Image {
    const ent = getEntity(entity.name);

    if (!ent) {
      throw new Error("Entity '" + entity.name + "' doesn't exist!");
    }

    const sprite = ent.getSprite(entity);

    if (!ent) {
      throw new Error("Entity '" + entity.name + "' doesn't have a normal spritesheet!");
    }

    return sprite;
  }

  public getKey(entity: BlueprintEntity, grid: EntityGridView) {
    return entity.name;
  }

}
