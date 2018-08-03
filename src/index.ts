import fs from "fs";
import SpriteLayer from "./render/SpriteLayer";

SpriteLayer.from({
  filename: "D:/Matthew/Documents/factorio/data/base/graphics/entity/assembling-machine-2/assembling-machine-2.png",
  priority: "high",
  width: 108,
  height: 110,
  frame_count: 32,
  line_length: 8,
  shift: {
    x: 0 / 32,
    y: 4 / 32,
  },
  hr_version: {
    filename: "D:/Matthew/Documents/factorio/data/base/graphics/entity/assembling-machine-2/assembling-machine-2.png",
    priority: "high",
    width: 214,
    height: 218,
    frame_count: 32,
    line_length: 8,
    shift: {
      x: 0 / 32,
      y: 4 / 32,
    },
    scale: 0.5,
  },
}, true).then((spriteLayer) => {
   spriteLayer.getFrames().forEach((frame, index) => {
    fs.writeFile(`output/${index}.png`, frame.toBuffer(), () => {});
   });
});
