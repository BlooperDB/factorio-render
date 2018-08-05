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

export interface EntityData {
  corpse: string;
}

export class Entity {
  public readonly entity: EntityData;
  public readonly item: ItemData;
  public readonly recipe: RecipeData;

  constructor(entity: EntityData, item: ItemData, recipe: RecipeData) {
    this.entity = entity;
    this.item = item;
    this.recipe = recipe;
  }

}
