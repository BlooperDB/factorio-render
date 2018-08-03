export interface IPositionData {
  x: number;
  y: number;
}

export default class Position {

  public static from(data: IPositionData) {
    return new Position(data.x, data.y);
  }

  private x: number;
  private y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public getX() {
    return this.x;
  }

  public getY() {
    return this.y;
  }

}
