import { createCanvas } from "canvas";
import * as fs from "fs";
import { BlueprintData, BlueprintEntity, Vector } from "../models";
import { BoundingBox } from "../models";
import { decodeBlueprint } from "../util/blueprint";
import { getEntity } from "./ItemData";

export interface Pass {
  name: string;
  subPasses?: Array<Pass>;
}

const railEntityNames = [
  "straight-rail",
  "curved-rail",
  "rail-signal",
  "rail-chain-signal"
];

const bothEntityNames = [
  "train-stop"
];

export class Blueprint {

  private readonly file: string;
  private readonly blueprint: BlueprintData;

  private readonly railEntities: Array<BlueprintEntity>;
  private readonly normalEntities: Array<BlueprintEntity>;

  constructor(file: string) {
    this.file = file;

    const blueprint = this.readBlueprint(file);

    if (!blueprint) {
      throw new Error("Blueprint could not be decoded!");
    }

    this.blueprint = blueprint;

    this.blueprint.entities.sort((a, b) => {
      if (a.name.endsWith("inserter")) {
        return 1;
      } else if (b.name.endsWith("inserter")) {
        return -1;
      }

      if (a.position.y !== b.position.y) {
        return a.position.y - b.position.y;
      }

      return a.position.x - b.position.x;
    });

    this.railEntities = [];
    this.normalEntities = [];

    this.blueprint.entities.forEach((ent) => {
      const railEntity = railEntityNames.indexOf(ent.name);
      const bothEntity = bothEntityNames.indexOf(ent.name);

      if (railEntity >= 0) {
        this.railEntities.push(ent);
      }

      if (railEntity === -1 || bothEntity >= 0) {
        this.normalEntities.push(ent);
      }
    });
  }

  public async render(file: string, frame: number = 0, debug: boolean = false) {
    console.time("Render Pass");
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

    // First pass: Rails
    for (let i = 0; i < this.railEntities.length; i++) {
      const entity = this.railEntities[i];
      const position = entity.position;

      const relativeX = position.x + Math.abs(size.minX) + 0.5;
      const relativeY = position.y + Math.abs(size.minY) + 0.5;

      const sprite = await getEntity(entity.name)!.getSprite(entity, "RAIL", false, frame, grid);

      if (!sprite || !sprite.image) {
        const startX = (relativeX * scaling + (scaling / 2)) - 10;
        const startY = (relativeY * scaling + (scaling / 2)) - 10;
        ctx.fillStyle = "#3c3c3c";
        ctx.fillRect(startX, startY, 20, 20);
        ctx.fillStyle = "#282828";
        ctx.fillText("?", startX + 10, startY + 18);
      } else {
        const startX = Math.floor((relativeX * scaling + (scaling / 2)) - (sprite.image.width / 2));
        const startY = Math.floor((relativeY * scaling + (scaling / 2)) - (sprite.image.height / 2));
        ctx.drawImage(sprite.image, startX, startY, sprite.image.width, sprite.image.height);
      }
    }

    // Second pass: shadows
    for (let i = 0; i < this.normalEntities.length; i++) {
      const entity = this.normalEntities[i];
      const position = entity.position;

      const relativeX = position.x + Math.abs(size.minX) + 0.5;
      const relativeY = position.y + Math.abs(size.minY) + 0.5;

      const sprite = await getEntity(entity.name)!.getSprite(entity, "SHADOW", false, frame, grid);

      if (sprite && sprite.image) {
        const startX = Math.floor((relativeX * scaling + (scaling / 2)) - (sprite.image.width / 2));
        const startY = Math.floor((relativeY * scaling + (scaling / 2)) - (sprite.image.height / 2));
        ctx.drawImage(sprite.image, startX, startY, sprite.image.width, sprite.image.height);
      }
    }

    // Third pass: entities
    for (let i = 0; i < this.normalEntities.length; i++) {
      const entity = this.normalEntities[i];
      const position = entity.position;

      const relativeX = position.x + Math.abs(size.minX) + 0.5;
      const relativeY = position.y + Math.abs(size.minY) + 0.5;

      const sprite = await getEntity(entity.name)!.getSprite(entity, "ENTITY", false, frame, grid);

      if (!sprite || !sprite.image) {
        const startX = (relativeX * scaling + (scaling / 2)) - 10;
        const startY = (relativeY * scaling + (scaling / 2)) - 10;
        ctx.fillStyle = "#3c3c3c";
        ctx.fillRect(startX, startY, 20, 20);
        ctx.fillStyle = "#282828";
        ctx.fillText("?", startX + 10, startY + 18);
      } else {
        const startX = Math.floor((relativeX * scaling + (scaling / 2)) - (sprite.image.width / 2));
        const startY = Math.floor((relativeY * scaling + (scaling / 2)) - (sprite.image.height / 2));
        ctx.drawImage(sprite.image, startX, startY, sprite.image.width, sprite.image.height);
      }
    }

    ctx.strokeStyle = "#36732c";
    ctx.fillStyle = "#676767";

    // Fourth pass: overlay
    for (let i = 0; i < this.normalEntities.length; i++) {
      const entity = this.normalEntities[i];
      const position = entity.position;

      const relativeX = position.x + Math.abs(size.minX) + 0.5;
      const relativeY = position.y + Math.abs(size.minY) + 0.5;

      const sprite = await getEntity(entity.name)!.getSprite(entity, "OVERLAY", false, frame, grid);

      if (sprite && sprite.image) {
        const startX = Math.floor((relativeX * scaling + (scaling / 2)) - (sprite.image.width / 2));
        const startY = Math.floor((relativeY * scaling + (scaling / 2)) - (sprite.image.height / 2));
        ctx.drawImage(sprite.image, startX, startY, sprite.image.width, sprite.image.height);
      }

      if (debug) {
        const entSize = getEntity(entity.name)!.getTileSize(entity);
        const bbX = Math.floor((relativeX * scaling + (scaling / 2)) - (entSize.x / 2) * scaling);
        const bbY = Math.floor((relativeY * scaling + (scaling / 2)) - (entSize.y / 2) * scaling);
        ctx.fillText((entity.direction || 0).toString(), bbX + 16, bbY + 24);
        ctx.rect(bbX, bbY, entSize.x * scaling, entSize.y * scaling);
        ctx.stroke();
      }
    }

    if (debug) {
      Object.keys(grid.fluids).forEach((x: any) => {
        Object.keys(grid.fluids[x]).forEach((y: any) => {
          const relativeX = parseFloat(x) + Math.abs(size.minX) + 0.5;
          const relativeY = parseFloat(y) + Math.abs(size.minY) + 0.5;

          const centerX = (relativeX * scaling + (scaling / 2));
          const centerY = (relativeY * scaling + (scaling / 2));

          if (grid.fluids[x][y] > 1) {
            ctx.fillStyle = "#4b63cb";
          } else {
            ctx.fillStyle = "#896f97";
          }

          ctx.fillRect(centerX - 5, centerY - 5, 10, 10);
        });
      });

      Object.keys(grid.heat).forEach((x: any) => {
        Object.keys(grid.heat[x]).forEach((y: any) => {
          const relativeX = parseFloat(x) + Math.abs(size.minX) + 0.5;
          const relativeY = parseFloat(y) + Math.abs(size.minY) + 0.5;

          const centerX = (relativeX * scaling + (scaling / 2));
          const centerY = (relativeY * scaling + (scaling / 2));

          if (grid.heat[x][y] > 1) {
            ctx.fillStyle = "#cb383f";
          } else {
            ctx.fillStyle = "#97765a";
          }

          ctx.fillRect(centerX - 5, centerY - 5, 10, 10);
        });
      });

      Object.keys(grid.walls).forEach((x: any) => {
        Object.keys(grid.walls[x]).forEach((y: any) => {
          const relativeX = parseFloat(x) + Math.abs(size.minX) + 0.5;
          const relativeY = parseFloat(y) + Math.abs(size.minY) + 0.5;

          const centerX = (relativeX * scaling + (scaling / 2));
          const centerY = (relativeY * scaling + (scaling / 2));

          if (grid.walls[x][y] > 1) {
            ctx.fillStyle = "#6b8346";
          } else {
            ctx.fillStyle = "#505949";
          }

          ctx.fillRect(centerX - 5, centerY - 5, 10, 10);
        });
      });

      ctx.fillStyle = "#2e8372";

      Object.keys(grid.belts).forEach((x: any) => {
        Object.keys(grid.belts[x]).forEach((y: any) => {
          const relativeX = parseFloat(x) + Math.abs(size.minX) + 0.5;
          const relativeY = parseFloat(y) + Math.abs(size.minY) + 0.5;

          const centerX = (relativeX * scaling + (scaling / 2));
          const centerY = (relativeY * scaling + (scaling / 2));

          ctx.fillRect(centerX - 5, centerY - 5, 10, 10);
        });
      });
    }

    const out = fs.createWriteStream(file);
    const stream = canvas.pngStream();
    stream.pipe(out);

    console.timeEnd("Render Pass");
    return new Promise((resolve, reject) => {
      out.on("finish", () => {
        resolve();
      });
    });
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

    return ent.getTileSize(entity);
  }

  private readBlueprint(file: string): BlueprintData | undefined {
    if (!fs.existsSync(file)) {
      return;
    }

    return decodeBlueprint(fs.readFileSync(file).toString("UTF-8")) as BlueprintData;
  }

  private entitiesToGrid(): EntityGridView {
    const grid: { [key: number]: { [key: number]: BlueprintEntity; }; } = {};
    const fluids: { [key: number]: { [key: number]: number; }; } = {};
    const heat: { [key: number]: { [key: number]: number; }; } = {};
    const walls: { [key: number]: { [key: number]: number; }; } = {};
    const belts: { [key: number]: { [key: number]: number; }; } = {};

    this.blueprint.entities.forEach((entity) => {
      if (grid[entity.position.x] === undefined) {
        grid[entity.position.x] = {};
      }

      const e = getEntity(entity.name);
      if (e!.entity.fluid_box || e!.entity.fluid_boxes || e!.entity.output_fluid_box) {
        const connections: Array<any> = e!.entity.fluid_box ? [...e!.entity.fluid_box.pipe_connections] : [];

        if (e!.entity.fluid_boxes) {
          Object.keys(e!.entity.fluid_boxes).forEach((key: any) => {
            if (!isNaN(key)) {
              connections.push(...e!.entity.fluid_boxes[key].pipe_connections);
            }
          });
        }

        if ("output_fluid_box" in e!.entity) {
          connections.push(...e!.entity.output_fluid_box.pipe_connections);
        }

        let addToConnected = e!.entity.type !== "assembling-machine";
        if (e!.entity.type === "assembling-machine" && entity.recipe) {
          const entRecipe = getEntity(entity.recipe);
          if (entRecipe) {
            const recipe = entRecipe!.recipe;
            const ingredients = recipe.ingredients || recipe.normal.ingredients;
            for (let i = 0; i < ingredients.length; i++) {
              if (ingredients[i].type === "fluid") {
                addToConnected = true;
                break;
              }
            }
          }
        }

        if (addToConnected) {
          connections.forEach((conn: any) => {
            if ("max_underground_distance" in conn) {
              return;
            }

            let vec = {
              x: conn.position[0],
              y: conn.position[1]
            };

            vec = this.rotateVector(vec, entity.direction || 0);

            vec.x += entity.position.x;
            vec.y += entity.position.y;

            const entSize = getEntity(entity.name)!.getTileSize(entity);
            const bb = {
              min: {x: entity.position.x - entSize.x / 2, y: entity.position.y - entSize.y / 2},
              max: {x: entity.position.x + entSize.x / 2, y: entity.position.y + entSize.y / 2},
            };

            if (this.isWithinBB(bb, {x: vec.x - 1, y: vec.y})) {
              vec.x -= 0.5;
            } else if (this.isWithinBB(bb, {x: vec.x + 1, y: vec.y})) {
              vec.x += 0.5;
            } else if (this.isWithinBB(bb, {x: vec.x, y: vec.y - 1})) {
              vec.y -= 0.5;
            } else if (this.isWithinBB(bb, {x: vec.x, y: vec.y + 1})) {
              vec.y += 0.5;
            }

            if (fluids[vec.x] === undefined) {
              fluids[vec.x] = {};
            }

            if (fluids[vec.x][vec.y] === undefined) {
              fluids[vec.x][vec.y] = 0;
            }

            fluids[vec.x][vec.y] += 1;
          });
        }
      }

      if (e!.entity.heat_buffer || (e!.entity.energy_source && e!.entity.energy_source.connections)) {
        const connections: Array<any> = e!.entity.heat_buffer ? [...e!.entity.heat_buffer.connections] : [];

        if (e!.entity.energy_source) {
          connections.push(...e!.entity.energy_source.connections);
        }

        connections.forEach((conn) => {
          let vec = {
            x: conn.position[0],
            y: conn.position[1]
          };

          switch (conn.direction) {
            default:
            case 0:
              vec.y -= 0.5;
              break;
            case 2:
              vec.x += 0.5;
              break;
            case 4:
              vec.y += 0.5;
              break;
            case 6:
              vec.x -= 0.5;
              break;
          }

          vec = this.rotateVector(vec, entity.direction || 0);

          vec.x += entity.position.x;
          vec.y += entity.position.y;

          if (heat[vec.x] === undefined) {
            heat[vec.x] = {};
          }

          if (heat[vec.x][vec.y] === undefined) {
            heat[vec.x][vec.y] = 0;
          }

          heat[vec.x][vec.y] += 1;
        });
      }

      if (e!.entity.type === "wall" || e!.entity.type === "gate") {
        const connections: Array<Vector> = [
          {x: -0.5, y: 0},
          {x: 0.5, y: 0},
          {x: 0, y: -0.5},
          {x: 0, y: 0.5},
        ];

        connections.forEach((conn) => {
          conn.x += entity.position.x;
          conn.y += entity.position.y;

          if (walls[conn.x] === undefined) {
            walls[conn.x] = {};
          }

          if (walls[conn.x][conn.y] === undefined) {
            walls[conn.x][conn.y] = 0;
          }

          walls[conn.x][conn.y] += 1;
        });
      }

      if (e!.entity.type === "transport-belt" || (e!.entity.type === "underground-belt" && entity.type !== "input") || e!.entity.type === "splitter") {
        const connections: Array<Vector> = [];
        if (e!.entity.type === "transport-belt" || e!.entity.type === "underground-belt") {
          const forward = {x: entity.position.x, y: entity.position.y};

          switch (entity.direction || 0) {
            default:
            case 0:
              forward.y -= 0.5;
              break;
            case 2:
              forward.x += 0.5;
              break;
            case 4:
              forward.y += 0.5;
              break;
            case 6:
              forward.x -= 0.5;
              break;
          }

          connections.push(forward);
        } else if (e!.entity.type === "splitter") {
          switch (entity.direction || 0) {
            default:
            case 0:
              connections.push({x: entity.position.x - 0.5, y: entity.position.y - 0.5});
              connections.push({x: entity.position.x + 0.5, y: entity.position.y - 0.5});
              break;
            case 2:
              connections.push({x: entity.position.x + 0.5, y: entity.position.y - 0.5});
              connections.push({x: entity.position.x + 0.5, y: entity.position.y + 0.5});
              break;
            case 4:
              connections.push({x: entity.position.x - 0.5, y: entity.position.y + 0.5});
              connections.push({x: entity.position.x + 0.5, y: entity.position.y + 0.5});
              break;
            case 6:
              connections.push({x: entity.position.x - 0.5, y: entity.position.y - 0.5});
              connections.push({x: entity.position.x - 0.5, y: entity.position.y + 0.5});
              break;
          }
        }

        connections.forEach((conn) => {
          if (belts[conn.x] === undefined) {
            belts[conn.x] = {};
          }

          if (belts[conn.x][conn.y] === undefined) {
            belts[conn.x][conn.y] = 0;
          }

          belts[conn.x][conn.y] += 1;
        });
      }

      grid[entity.position.x][entity.position.y] = entity;
    });

    return new EntityGridView(grid, fluids, heat, walls, belts);
  }

  private isWithinBB(bb: BoundingBox, point: Vector): boolean {
    if (point.x > bb.min.x && point.y > bb.min.y) {
      if (point.x < bb.max.x && point.y < bb.max.y) {
        return true;
      }
    }

    return false;
  }

  private rotateVector(vec: Vector, direction: number): Vector {
    switch (direction) {
      default:
      case 0:
        return vec;
      case 2:
        return {
          x: vec.y * -1,
          y: vec.x
        };
      case 4:
        return {
          x: vec.x * -1,
          y: vec.y * -1
        };
      case 6:
        return {
          x: vec.y,
          y: vec.x * -1
        };
    }
  }

}

export class EntityGridView {

  public readonly grid: { [key: number]: { [key: number]: BlueprintEntity; }; };
  public readonly fluids: { [key: number]: { [key: number]: number; }; };
  public readonly heat: { [key: number]: { [key: number]: number; }; };
  public readonly walls: { [key: number]: { [key: number]: number; }; };
  public readonly belts: { [key: number]: { [key: number]: number; }; };
  private centerX: number = 0;
  private centerY: number = 0;

  constructor(grid: { [key: number]: { [key: number]: BlueprintEntity; }; },
              fluids: { [key: number]: { [key: number]: number; }; },
              heat: { [key: number]: { [key: number]: number; }; },
              walls: { [key: number]: { [key: number]: number; }; },
              belts: { [key: number]: { [key: number]: number; }; }) {
    this.grid = grid;
    this.fluids = fluids;
    this.heat = heat;
    this.walls = walls;
    this.belts = belts;
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
