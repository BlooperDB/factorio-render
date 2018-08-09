import pako from "pako";
import { TextDecoder } from "text-encoding";
import { BlueprintData } from "../models";

const utf8Decoder = new TextDecoder("utf-8");

export type Bearing = "north" | "east" | "south" | "west";
export type Direction = "up" | "right" | "down" | "left";

const bearings: { [key: number]: Bearing; } = {
  0: "north",
  2: "east",
  4: "south",
  6: "west",
};

const directions: { [key: number]: Direction; } = {
  0: "up",
  2: "right",
  4: "down",
  6: "left",
};

export function decodeBlueprint(blueprintString: string) {
  const versionlessString = blueprintString.substr(1);
  const compressed = Buffer.from(versionlessString, "base64");

  return JSON.parse(utf8Decoder.decode(pako.inflate(compressed))).blueprint as BlueprintData;
}

export function getBearing(direction: number): Bearing {
  return bearings[direction];
}

export function getDirection(direction: number): Direction {
  return directions[direction];
}
