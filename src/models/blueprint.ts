import { Vector } from "./positioning";

export interface BlueprintIconSignal {
  type: string;
  name: string;
}

export interface BlueprintIcon {
  index: number;
  signal: BlueprintIconSignal;
}

export interface BlueprintEntity {
  entity_number: number;
  name: string;
  position: Vector;
  direction?: number;
  type?: string;
}

export interface BlueprintData {
  icons: Array<BlueprintIcon>;
  entities: Array<BlueprintEntity>;
  item: string;
  version: number;
}
