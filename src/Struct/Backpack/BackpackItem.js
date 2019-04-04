class BackpackItem {
  constructor(Client, raw) {
    this._client = Client;

    this.type = raw.type;
    this.name = raw.name;
  }
}

module.exports = BackpackItem;
