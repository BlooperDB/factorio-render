import { createCanvas } from "canvas";
import { BlueprintEntity, EntitySprite, RenderPassType } from "../../models";
import { EntityGridView } from "../Blueprint";
import { getEntity } from "../ItemData";
import GenericRenderer from "./generic.renderer";

export default class AssemblingMachineRenderer extends GenericRenderer {

  public async renderPass(entity: BlueprintEntity, pass: RenderPassType, highRes: boolean = false, animationFrame: number = 0, grid: EntityGridView): Promise<EntitySprite> {
    const ent = getEntity(entity.name);

    if (!ent) {
      throw new Error(`Entity '${entity.name}' doesn't exist!`);
    }

    if (!ent.entity.animation || !("layers" in ent.entity.animation)) {
      throw new Error(`Unable to render ${entity.name}`);
    }

    const layers = ent.entity.animation.layers;

    let source = layers[0];

    if (pass === "SHADOW") {
      source = layers[1];
    }

    return this.loadSprite(source, entity, pass, "", highRes, animationFrame, grid, (canvas, ctx) => {
      return canvas;
    });
  }

  public getKey(entity: BlueprintEntity, pass: RenderPassType, highRes: boolean, animationFrame: number, grid: EntityGridView): string {
    return entity.name + "_" + (entity.direction || 0) + "_" + pass + "_" + animationFrame;
  }

}
