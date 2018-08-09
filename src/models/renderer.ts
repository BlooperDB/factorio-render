import { EntityGridView } from "../render/Blueprint";
import { EntitySprite } from "./entity";
import { BlueprintEntity, RenderPassType } from "./index";

export interface Renderer {

  renderPass(entity: BlueprintEntity, pass: RenderPassType, highRes: boolean, animationFrame: number, grid: EntityGridView): Promise<EntitySprite>;

  getKey(entity: BlueprintEntity, pass: RenderPassType, highRes: boolean, animationFrame: number, grid: EntityGridView): string;

}
