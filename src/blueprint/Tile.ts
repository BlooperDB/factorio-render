import Position, { IPositionData } from "./Position";

export interface ITileData {
  name: string;
  position: IPositionData;
}

export default class Tile {

  public static from(data: ITileData) {
    return new Tile(data.name, Position.from(data.position));
  }

  private name: string;
  private position: Position;

  constructor(name: string, position: Position) {
    this.name = name;
    this.position = position;
  }

  public getName() {
    return this.name;
  }

  public getPosition() {
    return this.position;
  }

}
