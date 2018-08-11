import { Blueprint } from "./render/Blueprint";
import * as ItemData from "./render/ItemData";

const item = ItemData.getEntity("assembling-machine-2");
console.log(JSON.stringify(item));

const blueprint = new Blueprint("sample_blueprint.txt");
console.log(JSON.stringify(blueprint));

blueprint.render("sample.png", 0, false).then(() => {
  /*blueprint.render("sample.png").then(() => {
    blueprint.render("sample.png").then(() => undefined);
  });*/
});

/*
for (let i = 0; i < 64; i++) {
  blueprint.render("output/animation_" + i + ".png", i).then(() => {
    console.log("Completed frame:", i);
  });
}
*/
