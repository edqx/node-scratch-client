const request = require("../request.js");
const UserFlag = require("./UserFlag.js");
const Permission = require("./Permission.js");
const AuthorizedUser = require("./AuthorizedUser.js");
const EventEmitter = require("events");

class SessionFlags extends EventEmitter {
  constructor(Client, raw) {
    super();

    this._client = Client;

    request({
      hostname: "api.scratch.mit.edu",
      path: "/users/" + raw.user.username,
      method: "GET"
    }).then(response => {
      let json = JSON.parse(response.body);

      Object.assign(json, {
        banned: raw.user.banned,
        username: raw.user.username,
        token: raw.user.token,
        thumbnailUrl: raw.user.thumbnailUrl,
        joinedTimestamp: raw.user.dateJoined,
        email: raw.user.email
      });

      this.user = new AuthorizedUser(Client, json);

      this.emit("ready");
    });

    this.permissions = {};
    this.flags = {};

    for (let perm in raw.permissions) {
      this.permissions[perm] = new Permission(Client, perm, raw.permissions[perm]);
    }

    for (let flag in raw.flags) {
      this.flags[flag] = new UserFlag(Client, flag, raw.flags[flag]);
    }
  }
}

module.exports = SessionFlags;
