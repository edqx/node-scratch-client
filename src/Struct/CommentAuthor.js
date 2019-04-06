const Image = require("./Image.js");

class CommentAuthor {
  constructor(Client, raw) {
    this._client = Client;

    this.id = raw.id;
    this.username = raw.username;
    this.scratchteam = raw.scratchteam;
    this.avatar = new Image(Client, raw.image);
  }
}

module.exports = CommentAuthor;
