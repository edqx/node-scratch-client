const Image = require("./Image.js");

class News {
  constructor (Client, raw) {
    this._client = Client;

    this.id = raw.id;
    this.timestamp = raw.stamp;
    this.title = raw.headline;
    this.description = raw.copy;
    this.image = new Image(Client, raw.image);
    this.src = raw.url;
  }
}

module.exports = News;
