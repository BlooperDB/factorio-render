import { createCanvas } from "canvas";
import * as fs from "fs";
import { BlueprintData, BlueprintEntity, Vector } from "../models";
import { decodeBlueprint } from "../util/blueprint";
import { getEntity } from "./ItemData";

export interface Pass {
  name: string;
  subPasses?: Array<Pass>;
}

const allPasses: Array<Pass> = [
  {name: "shadows"},
  {
    name: "rails",
    subPasses: [
      {name: "rail_1"},
      {name: "rail_2"},
      {name: "rail_3"},
      {name: "rail_4"},
      {name: "rail_5"}
    ]
  },
  {name: "entities"}
];

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

  public async render(file: string, frame: number = 0) {
    const scaling = 32;
    const size = this.getSize();
    const canvas = createCanvas((size.width + 2) * scaling, (size.height + 2) * scaling);
    const grid = this.entitiesToGrid();

    /**
     * @type {CanvasRenderingContext2D}
     */
    const ctx = canvas.getContext("2d");

    // Color in background
    ctx.fillStyle = "#282828";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Line styling
    ctx.fillStyle = "#3c3c3c";
    const lineWidth = 2;

    // Vertical lines
    for (let i = 1; i < size.width + 2; i++) {
      ctx.fillRect(i * scaling - (lineWidth / 2), 0, lineWidth, canvas.height);
    }

    // Horizontal lines
    for (let i = 1; i < size.height + 2; i++) {
      ctx.fillRect(0, i * scaling - (lineWidth / 2), canvas.width, lineWidth);
    }

    // Numbering styling
    ctx.fillStyle = "#3c3c3c";
    ctx.font = "24px Arial Bold";
    ctx.textAlign = "center";

    // Width numbering
    for (let i = 1; i < size.width + 1; i++) {
      ctx.fillText("" + i, i * scaling + (scaling / 2), scaling - 7, scaling - (scaling / 8));
      ctx.fillText("" + i, i * scaling + (scaling / 2), canvas.height - 7, scaling - (scaling / 8));
    }

    // Height numbering
    for (let i = 1; i < size.height + 1; i++) {
      ctx.fillText("" + i, scaling / 2, ((i + 1) * scaling) - 7, scaling - (scaling / 8));
      ctx.fillText("" + i, canvas.width - (scaling / 2), ((i + 1) * scaling) - 7, scaling - (scaling / 8));
    }

    ctx.fillStyle = "#616161";

    // First pass: shadows
    for (let i = 0; i < this.blueprint.entities.length; i++) {
      const entity = this.blueprint.entities[i];
      const position = entity.position;

      const relativeX = position.x + Math.abs(size.minX) + 0.5;
      const relativeY = position.y + Math.abs(size.minY) + 0.5;

      const sprite = await getEntity(entity.name)!.getSprite(entity, true, false, false, frame);

      if (sprite && sprite.image) {
        const startX = Math.floor((relativeX * scaling + (scaling / 2)) - (sprite.image.width / 2));
        const startY = Math.floor((relativeY * scaling + (scaling / 2)) - (sprite.image.height / 2));
        ctx.drawImage(sprite.image, startX, startY, sprite.image.width, sprite.image.height);
      }
    }

    // Third pass: entities
    for (let i = 0; i < this.blueprint.entities.length; i++) {
      const entity = this.blueprint.entities[i];
      const position = entity.position;

      const relativeX = position.x + Math.abs(size.minX) + 0.5;
      const relativeY = position.y + Math.abs(size.minY) + 0.5;

      const sprite = await getEntity(entity.name)!.getSprite(entity, false, false, false, frame);

      if (!sprite || !sprite.image) {
        const startX = (relativeX * scaling + (scaling / 2)) - 10;
        const startY = (relativeY * scaling + (scaling / 2)) - 10;
        ctx.fillRect(startX, startY, 20, 20);
      } else {
        const startX = Math.floor((relativeX * scaling + (scaling / 2)) - (sprite.image.width / 2));
        const startY = Math.floor((relativeY * scaling + (scaling / 2)) - (sprite.image.height / 2));
        ctx.drawImage(sprite.image, startX, startY, sprite.image.width, sprite.image.height);
      }
    }

    // Fourth pass: overlay
    for (let i = 0; i < this.blueprint.entities.length; i++) {
      const entity = this.blueprint.entities[i];
      const position = entity.position;

      const relativeX = position.x + Math.abs(size.minX) + 0.5;
      const relativeY = position.y + Math.abs(size.minY) + 0.5;

      const sprite = await getEntity(entity.name)!.getSprite(entity, false, true, false, frame);

      if (sprite && sprite.image) {
        const startX = Math.floor((relativeX * scaling + (scaling / 2)) - (sprite.image.width / 2));
        const startY = Math.floor((relativeY * scaling + (scaling / 2)) - (sprite.image.height / 2));
        ctx.drawImage(sprite.image, startX, startY, sprite.image.width, sprite.image.height);
      }
    }

    const out = fs.createWriteStream(file);
    const stream = canvas.pngStream();
    stream.pipe(out);

    return new Promise((resolve, reject) => {
      out.on("finish", () => {
        resolve();
      });
    });
  }

  private renderPasses(passes: Array<Pass>) {
    for (let i = 0; i < this.blueprint.entities.length; i++) {

    }
  }

  private getSize() {
    let minWidth = 0;
    let minHeight = 0;
    let maxWidth = 0;
    let maxHeight = 0;

    for (let i = 0; i < this.blueprint.entities.length; i++) {
      const position = this.blueprint.entities[i].position;
      const size = this.getEntityTileSize(this.blueprint.entities[i]);
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

  private getEntityTileSize(entity: BlueprintEntity): Vector {
    const ent = getEntity(entity.name);

    if (!ent) {
      return {x: 1, y: 1};
    }

    return ent.getTileSize();
  }

  private readBlueprint(file: string): BlueprintData | undefined {
    if (!fs.existsSync(file)) {
      return;
    }

    return decodeBlueprint(fs.readFileSync(file).toString("UTF-8")) as BlueprintData;
  }

  private entitiesToGrid(): EntityGridView {
    const grid: { [key: number]: { [key: number]: BlueprintEntity; }; } = {};

    this.blueprint.entities.forEach((entity) => {
      if (grid[entity.position.x] === undefined) {
        grid[entity.position.x] = {};
      }

      grid[entity.position.x][entity.position.y] = entity;
    });

    return new EntityGridView(grid, 0, 0);
  }

}

export class EntityGridView {

  private readonly grid: { [key: number]: { [key: number]: BlueprintEntity; }; };
  private centerX: number;
  private centerY: number;

  constructor(grid: { [key: number]: { [key: number]: BlueprintEntity; }; }, centerX: number, centerY: number) {
    this.grid = grid;
    this.centerX = centerX;
    this.centerY = centerY;
  }

  public getRelative(relativeX: number, relativeY: number) {
    const x = this.centerX + relativeX;
    const y = this.centerY + relativeY;

    if (this.grid[x] === undefined) {
      return undefined;
    }

    return this.grid[x][y];
  }

  public setCenter(centerX: number, centerY: number) {
    this.centerX = centerX;
    this.centerY = centerY;
  }

}
