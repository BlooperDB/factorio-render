import { Image } from "canvas";
import { EntityGridView, Pass } from "../render/Blueprint";
import { BlueprintEntity } from "./index";

export interface Renderer {

  renderPass(entity: BlueprintEntity, grid: EntityGridView, pass: Pass): Image;

  getKey(entity: BlueprintEntity, grid: EntityGridView): string;

}
