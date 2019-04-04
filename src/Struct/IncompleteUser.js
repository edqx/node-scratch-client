const Image = require("./Image.js");

class IncompleteUser {
  constructor(Client, raw) {
    this._client = Client;

    this.id = raw.id;
    this.scratchteam = raw.scratchteam;

    this.joinedTimestamp = raw.history.joined;

    this.profile = {
      id: raw.profile.id,
      images: raw.profile.images
    }
  }
}

module.exports = IncompleteUser;
