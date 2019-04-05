const Image = require("./Image.js");

class IncompleteUser {
  constructor(Client, raw) {
    this._client = Client;

    this.username = raw.username;
    this.id = raw.id;
    this.scratchteam = raw.scratchteam;

    this.joinedTimestamp = raw.history.joined;

    this.profile = {
      id: raw.profile.id,
      images: {}
    }

    for (let src in raw.profile.images) {
      this.profile.images[src] = new Image(raw.profile.images[src]);
    }
  }
}

module.exports = IncompleteUser;
