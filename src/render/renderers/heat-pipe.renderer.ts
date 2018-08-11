import { BlueprintEntity, EntitySprite, RenderPassType, SpriteData, Vector } from "../../models";
import { EntityGridView } from "../Blueprint";
import { getEntity } from "../ItemData";
import GenericRenderer from "./generic.renderer";

export default class HeatPipeRenderer extends GenericRenderer {

  public async renderPass(entity: BlueprintEntity, pass: RenderPassType, highRes: boolean = false, animationFrame: number = 0, grid: EntityGridView): Promise<EntitySprite> {
    const ent = getEntity(entity.name);

    if (!ent) {
      throw new Error(`Entity '${entity.name}' doesn't exist!`);
    }

    const pictures = ent.entity.connection_sprites;

    if (!pictures || !("straight_horizontal" in pictures)) {
      throw new Error(`Unable to render ${entity.name}`);
    }

    const around = this.getAround(entity.position, grid);
    const count = around.reduce((a: number, b: number) => a + b, 0);

    let source = (pictures.single as Array<SpriteData>)[0];
    switch (count) {
      default:
      case 0:
        break;
      case 1:
        if (around[0]) {
          source = (pictures.ending_up as Array<SpriteData>)[0];
        } else if (around[1]) {
          source = (pictures.ending_right as Array<SpriteData>)[0];
        } else if (around[2]) {
          source = (pictures.ending_down as Array<SpriteData>)[0];
        } else {
          source = (pictures.ending_left as Array<SpriteData>)[0];
        }
        break;
      case 2:
        if (around[0]) {
          if (around[1]) {
            source = (pictures.corner_right_up as Array<SpriteData>)[0];
          } else if (around[2]) {
            source = (pictures.straight_vertical as Array<SpriteData>)[0];
          } else if (around[3]) {
            source = (pictures.corner_left_up as Array<SpriteData>)[0];
          }
        } else if (around[1]) {
          if (around[2]) {
            source = (pictures.corner_right_down as Array<SpriteData>)[0];
          } else if (around[3]) {
            source = (pictures.straight_horizontal as Array<SpriteData>)[0];
          }
        } else {
          source = (pictures.corner_left_down as Array<SpriteData>)[0];
        }
        break;
      case 3:
        if (!around[0]) {
          source = (pictures.t_down as Array<SpriteData>)[0];
        } else if (!around[1]) {
          source = (pictures.t_left as Array<SpriteData>)[0];
        } else if (!around[2]) {
          source = (pictures.t_up as Array<SpriteData>)[0];
        } else if (!around[3]) {
          source = (pictures.t_right as Array<SpriteData>)[0];
        }
        break;
      case 4:
        source = (pictures.cross as Array<SpriteData>)[0];
        break;
    }

    return this.loadSprite(source, entity, pass, "", highRes, animationFrame, grid);
  }

  public getKey(entity: BlueprintEntity, pass: RenderPassType, highRes: boolean, animationFrame: number, grid: EntityGridView): string {
    return entity.name + "_" + (entity.direction || 0) + "_" + pass + "_" + this.getAround(entity.position, grid).join("_") + "_" + animationFrame;
  }

  public getAround(pos: Vector, grid: EntityGridView): any {
    return [
      pos.x in grid.heat && pos.y - 0.5 in grid.heat[pos.x] && grid.heat[pos.x][pos.y - 0.5] > 1,
      pos.x + 0.5 in grid.heat && pos.y in grid.heat[pos.x + 0.5] && grid.heat[pos.x + 0.5][pos.y] > 1,
      pos.x in grid.heat && pos.y + 0.5 in grid.heat[pos.x] && grid.heat[pos.x][pos.y + 0.5] > 1,
      pos.x - 0.5 in grid.heat && pos.y in grid.heat[pos.x - 0.5] && grid.heat[pos.x - 0.5][pos.y] > 1
    ];
  }

}
