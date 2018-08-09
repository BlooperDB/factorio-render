import { Image } from "canvas";
import { Vector } from "..";
import { EntityGridView } from "../../render/Blueprint";
import GenericRenderer from "../../render/renderers/generic.renderer";
import PipeRenderer from "../../render/renderers/pipe.renderer";
import TransportBeltRenderer from "../../render/renderers/transport-belt.renderer";
import UndergroundBeltRenderer from "../../render/renderers/underground-belt.renderer";
import { BlueprintEntity } from "../blueprint";
import { RenderPassType } from "../pass";
import { Renderer } from "../renderer";
import { SpriteData } from "../sprite";
import { PicturesTypes, PictureTypes } from "./entity-pictures";

export interface RecipeData {
  type: string;
  name: string;
  normal: {
    enabled: boolean;
    ingredients: Array<Array<string | number>>
    result: string;
  };
  expensive?: {
    enabled: boolean;
    ingredients: Array<Array<string | number>>
    result: string;
  };
}

export interface ItemData {
  type: string;
  subgroup: string;
  order: string;
  icon_size: number;
  name: string;
  stack_size: number;
  icon: string;
  place_result: string;
  flags: Array<string>;
}

type SpriteTypes = SpriteData |
  { layers: Array<SpriteData> };

type AnimationTypes = PicturesTypes;

export interface EntityData {
  name?: string;
  selection_box?: Array<Array<number>>;
  animation?: AnimationTypes;
  animations?: AnimationTypes;
  sprite?: SpriteTypes;
  sprites?: any;
  picture?: PictureTypes;
  pictures?: PicturesTypes;
  layer?: any;
  overlay?: PictureTypes;

  // Generic
  fluid_box: any;
  fluid_boxes: any;
  output_fluid_box: any;
  structure: any;
  type: string;

  // Transport Belts
  ending_patch: any;
  circuit_connector_sprites: any;
  circuit_wire_connection_points: any;
  connector_frame_sprites: any;
  belt_vertical: any;
  ending_bottom: any;
  starting_side: any;
  ending_side: any;
  starting_bottom: any;
  ending_top: any;
  belt_horizontal: any;
  starting_top: any;

}

export interface EntitySprite {
  image?: Image;
  key?: string;
}

const renderers: { [key: string]: Renderer | undefined; } = {
  "pipe": new PipeRenderer(),
  "stone-wall": undefined,
  "straight-rail": undefined,
  "curved-rail": undefined,
  "arithmetic-combinator": undefined,
  "decider-combinator": undefined,
  "constant-combinator": undefined,
  "rail-chain-signal": undefined,
  "rail-signal": undefined,
  "beacon": undefined,
  "electric-furnace": undefined,
  "centrifuge": undefined,
  "transport-belt": new TransportBeltRenderer(),
  "fast-transport-belt": new TransportBeltRenderer(),
  "express-transport-belt": new TransportBeltRenderer(),
  "train-stop": undefined,
  "heat-pipe": undefined,
  "flamethrower-turret": undefined,
  "heat-exchanger": undefined,
  "gate": undefined,
  "burner-inserter": undefined,
  "inserter": undefined,
  "fast-inserter": undefined,
  "long-handed-inserter": undefined,
  "stack-inserter": undefined,
  "filter-inserter": undefined,
  "stack-filter-inserter": undefined,
  "boiler": undefined,
  "steam-engine": undefined,
  "splitter": undefined,
  "fast-splitter": undefined,
  "express-splitter": undefined,
  "underground-belt": new UndergroundBeltRenderer(),
  "fast-underground-belt": new UndergroundBeltRenderer(),
  "express-underground-belt": new UndergroundBeltRenderer(),
  "pipe-to-ground": undefined,
  "assembling-machine": undefined,
  "assembling-machine-2": undefined,
  "assembling-machine-3": undefined,
  "rocket-silo": undefined,
  "gun-turret": undefined,
  "laser-turret": undefined,
  "lab": undefined,
  "power-switch": undefined,
  "small-lamp": undefined,
  "roboport": undefined,
  "steam-turbine": undefined,
};

const genericRenderer = new GenericRenderer();

export class Entity {

  public readonly entity: EntityData;
  public readonly item: ItemData;
  public readonly recipe: RecipeData;

  constructor(entity: EntityData, item: ItemData, recipe: RecipeData) {
    this.entity = entity;
    this.item = item;
    this.recipe = recipe;
  }

  public getTileSize(ent: BlueprintEntity): Vector {
    if (!this.entity.selection_box) {
      return {
        x: 1,
        y: 1
      };
    }

    const min = this.entity.selection_box[0];
    const max = this.entity.selection_box[1];

    if (ent.direction === 2 || ent.direction === 6) {
      return {
        x: Math.ceil(Math.abs(min[1]) + Math.abs(max[1])),
        y: Math.ceil(Math.abs(min[0]) + Math.abs(max[0]))
      };
    }

    return {
      x: Math.ceil(Math.abs(min[0]) + Math.abs(max[0])),
      y: Math.ceil(Math.abs(min[1]) + Math.abs(max[1]))
    };
  }

  public async getSprite(entity: BlueprintEntity, pass: RenderPassType, highRes: boolean = false, animationFrame: number = 0, grid: EntityGridView): Promise<EntitySprite> {
    const renderer = entity.name in renderers ? renderers[entity.name] : genericRenderer;

    if (renderer) {
      return renderer.renderPass(entity, pass, highRes, animationFrame, grid);
    }

    // console.log("Failed to render:", entity.name);

    return {};
  }

}
