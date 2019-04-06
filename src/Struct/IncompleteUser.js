const Image = require("./Image.js");

class IncompleteUser {
  constructor(Client, raw) {
    this._client = Client;

    this.username = raw.username;
    this.id = raw.id;
    this.scratchteam = raw.scratchteam;

    this.joinedTimestamp = raw.history.joined;

    let avatar = new Image(Client, raw.profile.images["90x90"]);

    this.profile = {
      id: raw.profile.id,
      avatar: avatar,
      avatars: {}
    }

    for (let src in raw.profile.images) {
      this.profile.avatars[src] = new Image(raw.profile.images[src]);
    }
  }
}

module.exports = IncompleteUser;
