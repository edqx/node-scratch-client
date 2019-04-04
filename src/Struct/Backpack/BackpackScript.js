const BackpackItem = require("./BackpackItem.js");

class BackpackScript extends BackpackItem {
  constructor (Client, raw) {
    super(Client, raw);

    this.scripts = raw.scripts
  }
}

module.exports = BackpackScript;
