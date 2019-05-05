const request = require("../request.js");

const Image = require("./Image.js");

class UserProfile {
  constructor(Client, user, raw) {
    this._client = Client;

    this.avatar = new Image(Client, raw.images["90x90"]);
    this.avatars = {};
    this.id = raw.id;
    this.user = user;
    this.workingon = raw.status;
    this.aboutme = raw.bio;
    this.country = raw.country;

    for (let image in raw.images) {
      this.avatars[image] = new Image(Client, raw.images[image]);
    }
  }

  setAboutme(aboutme) {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        path: "/site-api/users/all/" + _this.user.username + "/",
        method: "PUT",
        body: JSON.stringify({
          bio: aboutme
        }),
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/users/" + _this.user.username + "/",
        "X-Token": _this._client.session.authorized.user.accessToken,
        "x-requested-with": "XMLHttpRequest"
      }).then(response => {
        _this.aboutme = aboutme;

        resolve();
      }).catch(reject);
    });
  }

  setWorkingon(workingon) {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        path: "/site-api/users/all/" + _this.user.username + "/",
        method: "PUT",
        body: JSON.stringify({
          status: workingon
        }),
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/users/" + _this.user.username + "/",
        "X-Token": _this._client.session.authorized.user.accessToken,
        "x-requested-with": "XMLHttpRequest"
      }).then(response => {
        _this.workingon = workingon;

        resolve();
      }).catch(reject);
    });
  }

  setFeaturedProject(type, project) {
    type = ({
      "featured_project": "",
      "featured_tutorial": 0,
      "work_in_progress": 1,
      "remix_this": 2,
      "my_favorite_things": 3,
      "why_i_scratch": 4
    })[type];
    let id = project.id || project;

    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        path: "/site-api/users/all/" + _this.user.username + "/",
        method: "PUT",
        body: JSON.stringify({
          featured_project: project,
          featured_project_label: type
        }),
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/users/" + _this.user.username + "/",
        "X-Token": _this._client.session.authorized.user.accessToken,
        "x-requested-with": "XMLHttpRequest"
      }).then(response => {
        resolve();
      }).catch(reject);
    });
  }
}

module.exports = UserProfile;
