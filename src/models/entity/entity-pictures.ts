import { SpriteData } from "../sprite";

export type PictureTypes = SpriteData |
  LayerPictureTypes |
  SheetsPictureTypes |
{ north: PictureTypes, east: PictureTypes, south: PictureTypes, west: PictureTypes };

export interface LayerPictureTypes {
  layers: Array<SpriteData>;
}

export interface SheetsPictureTypes {
  sheets: Array<SpriteData>;
}

export interface DirectionalPictureTypes {
  north: PictureTypes;
  south: PictureTypes;
  east: PictureTypes;
  west: PictureTypes;
}

export type PicturesTypes = PictureTypes |
  SpriteData |
  PicturePicturesTypes |
  SubPicturesTypes;

export interface PicturePicturesTypes {
  picture: PictureTypes;
}

export interface SubPicturesTypes {
  left?: SpriteData;
  right?: SpriteData;
  up?: SpriteData;
  down?: SpriteData;
  straight_vertical_window?: SpriteData;
  t_down?: SpriteData;
  corner_up_left?: SpriteData;
  straight_horizontal_window?: SpriteData;
  ending_left?: SpriteData;
  ending_down?: SpriteData;
  horizontal_window_background?: SpriteData;
  vertical_window_background?: SpriteData;
  gas_flow?: SpriteData;
  ending_up?: SpriteData;
  straight_horizontal?: SpriteData;
  ending_right?: SpriteData;
  middle_temperature_flow?: SpriteData;
  corner_down_right?: SpriteData;
  fluid_background?: SpriteData;
  high_temperature_flow?: SpriteData;
  t_right?: SpriteData;
  corner_up_right?: SpriteData;
  cross?: SpriteData;
  t_left?: SpriteData;
  straight_vertical?: SpriteData;
  straight_vertical_single?: SpriteData;
  t_up?: SpriteData;
  corner_down_left?: SpriteData;
  low_temperature_flow?: SpriteData;
}
