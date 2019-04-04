class Permission {
  constructor (Client, name, value) {
    this._client = Client;

    this.name = name;
    this.value = value;
  }
}

module.exports = Permission;
