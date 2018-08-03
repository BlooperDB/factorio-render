import Entity, { IEntityData } from "./Entity";
import Tile, { ITileData } from "./Tile";

export interface IBlueprintData {
  item: string;
  label?: string;
  entities?: IEntityData[];
  tiles?: ITileData[];
  icons?: any;
  version: number;
}

export default class Blueprint {

  public static from(data: IBlueprintData) {
    let entities: Entity[] = [];
    let tiles: Tile[] = [];

    if (data.entities) {
      entities = data.entities.map((entity: IEntityData) => Entity.from(entity));
    }

    if (data.tiles) {
      tiles = data.tiles.map((tile: ITileData) => Tile.from(tile));
    }

    return new Blueprint(entities, tiles);
  }

  private entities: Entity[];
  private tiles: Tile[];

  constructor(entities: Entity[], tiles: Tile[]) {
    this.entities = entities;
    this.tiles = tiles;
  }

  public getEntities() {
    return this.entities;
  }

  public getTiles() {
    return this.tiles;
  }

}
