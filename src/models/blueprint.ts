import { Vector } from "./vector";

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
  direction: number;
}

export interface BlueprintData {
  icons: BlueprintIcon[];
  entities: BlueprintEntity[];
  item: string;
  version: number;
}
