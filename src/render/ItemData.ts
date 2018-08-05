import * as fs from "fs";
import SpriteLayer from "./SpriteLayer";

let data: { [key: string]: any; };
let categoryMapping: { [key: string]: string; };

export function getData(): { [key: string]: any; } {
  if (!data) {
    data = JSON.parse(fs.readFileSync("factorio/data.json").toString("UTF-8")).raw;
  }

  return data;
}

export function getCategoryMapping() {
  if (!categoryMapping) {
    categoryMapping = {};
    Object.keys(getData()).forEach((category) => {
      if (category === "recipe" || category === "item") {
        return;
      }

      Object.keys(getData()[category]).forEach((tile) => {
        categoryMapping[tile] = category;
      });
    });
  }

  return categoryMapping;
}

export function getTileData(tile: string): { [key: string]: any; } | undefined {
  if (!getCategoryMapping()[tile]) {
    return undefined;
  }

  return {
    entity: getData()[getCategoryMapping()[tile]][tile],
    recipe: getData().recipe[tile],
    item: getData().item[tile]
  };
}

export class ItemData {

  private readonly tile: string;
  private readonly tileData: any;

  constructor(tile: string) {
    this.tile = tile;
    this.tileData = getTileData(tile);
    if (!this.tileData) {
      throw new Error("Tile '" + tile + "' not found!");
    }
  }

  public getSprite() {
    SpriteLayer.from(this.tileData.entity.animation.layers[0], true).then((spriteLayer) => {
      spriteLayer.getFrames().forEach((frame, index) => {
        fs.writeFile(`output/${index}.png`, frame.toBuffer(), () => undefined);
      });
    });
  }

}
