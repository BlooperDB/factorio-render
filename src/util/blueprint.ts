import pako from "pako";
import { TextDecoder } from "text-encoding";
import { IBlueprintData } from "../blueprint/Blueprint";

const utf8Decoder = new TextDecoder("utf-8");

const bearings: { [key: number]: any; } = {
  0: "north",
  2: "east",
  4: "south",
  6: "west",
};

const directions: { [key: number]: any; } = {
  0: "up",
  2: "right",
  4: "down",
  6: "left",
};

export function decodeBlueprint(blueprintString: string) {
  const versionlessString = blueprintString.substr(1);
  const compressed = Buffer.from(versionlessString, "base64");

  return JSON.parse(utf8Decoder.decode(pako.inflate(compressed))).blueprint as IBlueprintData;
}

export function getBearing(direction: number): "north" | "east" | "south" | "west" {
  return bearings[direction];
}

export function getDirection(direction: number): "up" | "right" | "down" | "left" {
  return directions[direction];
}
