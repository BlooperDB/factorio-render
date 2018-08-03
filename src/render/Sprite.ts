import SpriteLayer from "./SpriteLayer";

export interface ISpriteData {
  type: string;
  name: string;
  
}

export default class Sprite {

  public static from(data: JSON) {
    // TODO
  }

  private name: string;
  private layers: SpriteLayer[];

  constructor(name: string, layers: SpriteLayer[]) {
    this.name = name;
    this.layers = layers;
  }

  public getName() {
    return this.name;
  }

  public getLayers() {
    return this.layers;
  }

}
