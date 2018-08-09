import { BlueprintEntity, RenderPassType } from ".";
import { EntityGridView } from "../render/Blueprint";
import { EntitySprite } from "./entity/entity";

export interface Renderer {

  renderPass(entity: BlueprintEntity, pass: RenderPassType, highRes: boolean, animationFrame: number, grid: EntityGridView): Promise<EntitySprite>;

  getKey(entity: BlueprintEntity, pass: RenderPassType, highRes: boolean, animationFrame: number, grid: EntityGridView): string;

}
