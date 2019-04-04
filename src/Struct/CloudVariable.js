class CloudVariable {
  constructor (Client, raw) {
    this._client = Client;

    this.name = raw.name;
    this.value = raw.value;
  }

  set(value) {
    this.value = value;

    this._client.session.cloudsession._send("set", {
      name:  this.name,
      value:  this.value
    });
  }
}

module.exports = CloudVariable;
