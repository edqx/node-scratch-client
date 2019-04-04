const BackpackItem = require("./BackpackItem.js");

class BackpackImage extends BackpackItem {
  constructor (Client, raw) {
    super(Client, raw);

    this.md5 = raw.md5;
  }
}

module.exports = BackpackImage;
