class CloudVariable {
  constructor (Client, raw, CloudSession) {
    this._client = Client;
    this._cloudsession = CloudSession;

    this.name = raw.name;
    this.value = raw.value;
  }

  set(value) {
    this.value = value;

    this._cloudsession._send("set", {
      name:  this.name,
      value:  this.value
    });
  }
}

module.exports = CloudVariable;
