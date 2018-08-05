import { Blueprint } from "./render/Blueprint";
import * as ItemData from "./render/ItemData";

const item = new ItemData.ItemData("assembling-machine-2");
item.getSprite();
console.log(JSON.stringify(item));

const blueprint = new Blueprint("sample_blueprint.txt");
console.log(JSON.stringify(blueprint));
