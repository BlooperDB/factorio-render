import pako from "pako";
import { TextDecoder } from "text-encoding";
import { IBlueprintData } from "../blueprint/Blueprint";

const utf8Decoder = new TextDecoder("utf-8");

export function decodeBlueprint(blueprintString: string) {
  const versionlessString = blueprintString.substr(1);
  const compressed = Buffer.from(versionlessString, "base64");

  return JSON.parse(utf8Decoder.decode(pako.inflate(compressed))).blueprint as IBlueprintData;
}
