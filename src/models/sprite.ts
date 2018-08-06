export interface SpriteData {
  filename: string;
  priority: string;
  width: number;
  height: number;

  shift: {
    x: number;
    y: number;
  } | Array<number>;

  x?: number;
  y?: number;
  draw_as_shadow?: boolean;
  frames?: number;
  direction_count?: number;
  frame_count?: number;
  line_length?: number;
  scale?: number;
  hr_version?: SpriteData;
}
