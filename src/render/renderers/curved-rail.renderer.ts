import { BlueprintEntity, EntitySprite, RenderPassType } from "../../models";
import { EntityGridView } from "../Blueprint";
import { getEntity } from "../ItemData";
import GenericRenderer from "./generic.renderer";

export default class CurvedRailRenderer extends GenericRenderer {

  public async renderPass(entity: BlueprintEntity, pass: RenderPassType, highRes: boolean = false, animationFrame: number = 0, grid: EntityGridView): Promise<EntitySprite> {
    const ent = getEntity(entity.name);

    if (!ent) {
      throw new Error(`Entity '${entity.name}' doesn't exist!`);
    }

    if (!ent.entity.pictures || !("straight_rail_vertical" in ent.entity.pictures)) {
      throw new Error(`Unable to render ${entity.name}`);
    }

    const direction = entity.direction || 0;
    let layers = ent.entity.pictures.curved_rail_vertical_left_bottom;

    switch (direction) {
      default:
      case 0:
        break;
      case 1:
        layers = ent.entity.pictures.curved_rail_vertical_right_bottom;
        break;
      case 2:
        layers = ent.entity.pictures.curved_rail_horizontal_left_top;
        break;
      case 3:
        layers = ent.entity.pictures.curved_rail_horizontal_left_bottom;
        break;
      case 4:
        layers = ent.entity.pictures.curved_rail_vertical_right_top;
        break;
      case 5:
        layers = ent.entity.pictures.curved_rail_vertical_left_top;
        break;
      case 6:
        layers = ent.entity.pictures.curved_rail_horizontal_right_bottom;
        break;
      case 7:
        layers = ent.entity.pictures.curved_rail_horizontal_right_top;
        break;
    }

    let source = layers.stone_path_background;

    switch (pass) {
      default:
      case "RAIL_STONE_BACKGROUND":
        break;
      case "RAIL_STONE":
        source = layers.stone_path;
        break;
      case "RAIL_TIES":
        source = layers.ties;
        break;
      case "RAIL_BACKPLATES":
        source = layers.backplates;
        break;
      case "RAIL_METALS":
        source = layers.metals;
        break;
    }

    return this.loadSprite(source, entity, pass, "", highRes, animationFrame, grid);
  }

  public getKey(entity: BlueprintEntity, pass: RenderPassType, highRes: boolean, animationFrame: number, grid: EntityGridView): string {
    return entity.name + "_" + (entity.direction || 0) + "_" + pass + "_" + animationFrame;
  }

}
