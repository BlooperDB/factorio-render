import * as fs from "fs";
import { Entity } from "../models";

let data: { [key: string]: any; };
let categoryMapping: { [key: string]: string; };
let entities: { [key: string]: Entity; };

export function getData(): { [key: string]: any; } {
  if (!data) {
    let rawText = fs.readFileSync("factorio/data.json").toString("UTF-8");
    rawText = rawText.replace(/:-inf/g, ":0");
    rawText = rawText.replace(/:inf/g, ":0");
    data = JSON.parse(rawText).raw;
  }

  return data;
}

export function getCategoryMapping() {
  if (!categoryMapping) {
    categoryMapping = {};
    Object.keys(getData()).forEach((category) => {
      if (category === "recipe" || category === "item") {
        return;
      }

      Object.keys(getData()[category]).forEach((tile) => {
        categoryMapping[tile] = category;
      });
    });
  }

  return categoryMapping;
}

export function getEntity(entity: string): Entity | undefined {
  if (!entities) {
    entities = {};
    Object.keys(getCategoryMapping()).forEach((ent) => {
      entities[ent] = new Entity(
        getData()[getCategoryMapping()[ent]][ent],
        getData().item[ent],
        getData().recipe[ent]
      );
    });
  }

  return entities[entity];
}
