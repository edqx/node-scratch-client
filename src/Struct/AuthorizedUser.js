const request = require("../request.js");
const User = require("./User.js");
const Project = require("./Project.js");

class AuthorizedUser extends User {
  constructor(Client, raw) {
    super(raw);

    this._client = Client;

    this.banned = raw.banned
    this.accessToken = raw.token;
    this.thumbnailUrl = raw.thumbnailUrl;
    this.email = raw.email;
  }

  getFollowingRecentStudioProjects() {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/users/" + _this.username + "/following/studios/projects?x-token=" + _this.accessToken,
        method: "GET",
        sessionid: _this._client.session.sessionid
      }).then(response => {
        resolve(JSON.parse(response.body).map(project => {
          return new Project(project);
        }));
      }).catch(reject);
    });
  }

  getFollowingUserLoves(opt = {}) {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/users/" + _this.username + "/following/users/loves?x-token=" + _this.accessToken,
        method: "GET",
        sessionid: _this._client.session.sessionid
      }).then(response => {
        resolve(JSON.parse(response.body).map(project => {
          return new Project(project);
        }));
      }).catch(reject);
    });
  }

  getFollowingUserProjects(opt = {}) {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/users/" + _this.username + "/following/users/projects?x-token=" + _this.accessToken,
        method: "GET",
        sessionid: _this._client.session.sessionid
      }).then(response => {
        resolve(JSON.parse(response.body).map(project => {
          return new Project(project);
        }));
      }).catch(reject);
    });
  }
}

module.exports = AuthorizedUser;
