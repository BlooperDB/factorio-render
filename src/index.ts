import { Blueprint } from "./render/Blueprint";
import * as ItemData from "./render/ItemData";

const item = ItemData.getEntity("assembling-machine-2");
console.log(JSON.stringify(item));

const blueprint = new Blueprint("sample_blueprint.txt");
console.log(JSON.stringify(blueprint));
blueprint.render("sample.png");
