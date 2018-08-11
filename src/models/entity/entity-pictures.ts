import { SpriteData } from "../sprite";

export type PictureTypes = SpriteData |
  { layers: Array<SpriteData> } |
  { sheets: Array<SpriteData> } |
  {
    north: PictureTypes,
    south: PictureTypes,
    east: PictureTypes,
    west: PictureTypes,
  };

export type PicturesTypes = PictureTypes |
  SpriteData |
  { picture: PictureTypes } |
  {
    left: SpriteData,
    right: SpriteData,
    up: SpriteData,
    down: SpriteData,
  } |
  {
    straight_vertical_window: SpriteData,
    t_down: SpriteData | Array<SpriteData>,
    corner_up_left: SpriteData,
    corner_left_up: SpriteData | Array<SpriteData>,
    straight_horizontal_window: SpriteData,
    ending_left: SpriteData | Array<SpriteData>,
    ending_down: SpriteData | Array<SpriteData>,
    horizontal_window_background: SpriteData,
    vertical_window_background: SpriteData,
    gas_flow: SpriteData,
    ending_up: SpriteData | Array<SpriteData>,
    straight_horizontal: SpriteData | Array<SpriteData>,
    ending_right: SpriteData | Array<SpriteData>,
    middle_temperature_flow: SpriteData,
    corner_down_right: SpriteData,
    corner_right_down: SpriteData | Array<SpriteData>,
    fluid_background: SpriteData,
    high_temperature_flow: SpriteData,
    t_right: SpriteData | Array<SpriteData>,
    corner_up_right: SpriteData,
    corner_right_up: SpriteData | Array<SpriteData>,
    cross: SpriteData | Array<SpriteData>,
    t_left: SpriteData | Array<SpriteData>,
    straight_vertical: SpriteData | Array<SpriteData>,
    straight_vertical_single: SpriteData,
    t_up: SpriteData | Array<SpriteData>,
    corner_down_left: SpriteData,
    corner_left_down: SpriteData | Array<SpriteData>,
    low_temperature_flow: SpriteData,
    single: SpriteData | Array<SpriteData> | PictureTypes,
  };
