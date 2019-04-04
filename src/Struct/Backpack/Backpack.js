const BackpackImage = require("./BackpackImage.js");
const BackpackSprite = require("./BackpackSprite.js");
const BackpackScript = require("./BackpackScript.js");

class Backpack {
  constructor (Client, raw) {
    this._client = Client;

    this.items = [];

    for (let item in raw) {
      if (raw[item].type === "script") {
        this.items[item] = new BackpackScript(Client, raw[item]);
      } else if (raw[item].type === "sprite") {
        this.items[item] = new BackpackSprite(Client, raw[item]);
      } else if (raw[item].type === "image") {
        this.items[item] = new BackpackImage(Client, raw[item]);
      }
    }
  }
}

module.exports = Backpack;
