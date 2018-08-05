import * as fs from "fs";
import { BlueprintData, BlueprintEntity, Vector } from "../models";
import { decodeBlueprint } from "../util/blueprint";

export class Blueprint {

  private readonly file: string;
  private readonly blueprint: BlueprintData;

  constructor(file: string) {
    this.file = file;

    const blueprint = this.readBlueprint(file);

    if (!blueprint) {
      throw new Error("Blueprint could not be decoded!");
    }

    this.blueprint = blueprint;
  }

  public render(file: string) {

  }

  private getSize() {
    let minWidth = 0;
    let minHeight = 0;
    let maxWidth = 0;
    let maxHeight = 0;

    for (let i = 0; i < this.blueprint.entities.length; i++) {
      const position = this.blueprint.entities[i].position;
      const size = this.getEntitySize(this.blueprint.entities[i]);
      minWidth = Math.min(minWidth, position.x - size.x / 2);
      minHeight = Math.min(minHeight, position.y - size.y / 2);
      maxWidth = Math.max(maxWidth, position.x + size.x / 2);
      maxHeight = Math.max(maxHeight, position.y + size.y / 2);
    }

    return {
      minX: minWidth,
      minY: minHeight,
      maxX: maxWidth,
      maxY: maxHeight,
      width: Math.ceil(Math.abs(minWidth) + maxWidth),
      height: Math.ceil(Math.abs(minHeight) + maxHeight)
    };
  }

  private getEntitySize(entity: BlueprintEntity): Vector {
    /*const renderer = cachedRequire(entity.name);

    if (renderer && renderer.getSize) {
      return renderer.getSize(entity);
    }*/

    return {x: 1, y: 1};
  }

  private readBlueprint(file: string): BlueprintData | undefined {
    if (!fs.existsSync(file)) {
      return;
    }

    return decodeBlueprint(fs.readFileSync(file).toString("UTF-8")) as BlueprintData;
  }

}
