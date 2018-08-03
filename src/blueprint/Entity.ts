import Position, { IPositionData } from "./Position";

export interface IEntityData {
  entity_number: number;
  name: string;
  position: IPositionData;
  direction: number;
}

export default class Entity {

  public static from(data: IEntityData) {
    return new Entity(data.name, Position.from(data.position), data.direction);
  }

  // TODO Include other blueprint parameters
  private name: string;
  private position: Position;
  private direction: number;

  constructor(name: string, position: Position, direction: number) {
    this.name = name;
    this.position = position;
    this.direction = direction;
  }

  public getName() {
    return this.name;
  }

  public getPosition() {
    return this.position;
  }

  public getDirection() {
    return this.direction;
  }

}
