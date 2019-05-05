const request = require("../request.js");
const querystring = require("querystring");

const Project = require("./Project.js");
const Studio = require("./Studio.js");
const UserProfile = require("./UserProfile.js");

class User {
  constructor(Client, raw) {
    this._client = Client;

    this.id = raw.id;
    this.username = raw.username;

    this.joinedTimestamp = raw.history.joined;
    this.loginTimestamp = raw.history.login;

    this.profile = new UserProfile(Client, this, raw.profile);
  }

  getProjects(opt = {}) {
    let _this = this;
    let all = [];

    if (opt.fetchAll) {
      return new Promise((resolve, reject) => {
        (function loop(rCount) {
          let query = "limit=40&offset=" + rCount;

          request({
            hostname: "api.scratch.mit.edu",
            path: "/users/" + _this.username + "/projects/?" + query,
            method: "GET",
            csrftoken: _this._client.session.csrftoken
          }).then(response => {
            let json = JSON.parse(response.body);

            JSON.parse(response.body).forEach(project => {
              all.push(new Project(_this._client, project));
            });

            if (json.length === 40) {
              loop(rCount + 40);
            } else {
              resolve(all);
            }
          }).catch(reject);
        })(0);
      });
    } else {
      let query = "limit=" + (opt.limit || 20) + "&offset=" + (opt.offset || 0);

      return new Promise((resolve, reject) => {
        request({
          hostname: "api.scratch.mit.edu",
          path: "/users/" + _this.username + "/projects/?" + query,
          method: "GET",
          csrftoken: _this._client.session.csrftoken
        }).then(response => {
          resolve(JSON.parse(response.body).map(project => {
            return new Project(_this._client, project);
          }));
        }).catch(reject);
      });
    }
  }

  getProject(project) {
    let _this = this;
    let id = project.id || project;

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/users/" + _this.username + "/projects/" + id,
        method: "GET",
        csrftoken: _this._client.session.csrftoken
      }).then(response => {
        resolve(new Project(_this._client, JSON.parse(response.body)));
      }).catch(reject);
    });
  }

  getCurating(opt = {}) {
    let _this = this;
    let all = [];

    if (opt.fetchAll) {
      return new Promise((resolve, reject) => {
        (function loop(rCount) {
          let query = "limit=40&offset=" + rCount;

          request({
            hostname: "api.scratch.mit.edu",
            path: "/users/" + _this.username + "/projects/?" + query,
            method: "GET",
            csrftoken: _this._client.session.csrftoken
          }).then(response => {
            let json = JSON.parse(response.body);

            JSON.parse(response.body).forEach(studio => {
              all.push(new Studio(_this._client, studio));
            });

            if (json.length === 40) {
              loop(rCount + 40);
            } else {
              resolve(all);
            }
          }).catch(reject);
        })(0);
      });
    } else {
      let query = "limit=" + (opt.limit || 20) + "&offset=" + (opt.offset || 0);

      return new Promise((resolve, reject) => {
        request({
          hostname: "api.scratch.mit.edu",
          path: "/users/" + _this.username + "/studios/curate?" + query,
          method: "GET",
          csrftoken: _this._client.session.csrftoken
        }).then(response => {
          resolve(JSON.parse(response.body).map(studio => {
            return new Studio(_this._client, studio);
          }));
        }).catch(reject);
      });
    }
  }

  getFavorited(opt = {}) {
    let _this = this;
    let all = [];

    if (opt.fetchAll) {
      return new Promise((resolve, reject) => {
        (function loop(rCount) {
          let query = "limit=40&offset=" + rCount;

          request({
            hostname: "api.scratch.mit.edu",
            path: "/users/" + _this.username + "/projects/?" + query,
            method: "GET",
            csrftoken: _this._client.session.csrftoken
          }).then(response => {
            let json = JSON.parse(response.body);

            JSON.parse(response.body).forEach(project => {
              all.push(new Project(_this._client, project));
            });

            if (json.length === 40) {
              loop(rCount + 40);
            } else {
              resolve(all);
            }
          }).catch(reject);
        })(0);
      });
    } else {
      let query = "limit=" + (opt.limit || 20) + "&offset=" + (opt.offset || 0);

      return new Promise((resolve, reject) => {
        request({
          hostname: "api.scratch.mit.edu",
          path: "/users/" + _this.username + "/favorites?" + query,
          method: "GET",
          csrftoken: _this._client.session.csrftoken
        }).then(response => {
          resolve(JSON.parse(response.body).map(project => {
            return new Project(_this._client, project);
          }));
        }).catch(reject);
      });
    }
  }

  getFollowers(opt = {}) {
    let _this = this;
    let all = [];

    if (opt.fetchAll) {
      return new Promise((resolve, reject) => {
        (function loop(rCount) {
          let query = "limit=40&offset=" + rCount;

          request({
            hostname: "api.scratch.mit.edu",
            path: "/users/" + _this.username + "/projects/?" + query,
            method: "GET",
            csrftoken: _this._client.session.csrftoken
          }).then(response => {
            let json = JSON.parse(response.body);

            JSON.parse(response.body).forEach(user => {
              all.push(new User(_this._client, user));
            });

            if (json.length === 40) {
              loop(rCount + 40);
            } else {
              resolve(all);
            }
          }).catch(reject);
        })(0);
      });
    } else {
      let query = "limit=" + (opt.limit || 20) + "&offset=" + (opt.offset || 0);

      return new Promise((resolve, reject) => {
        request({
          hostname: "api.scratch.mit.edu",
          path: "/users/" + _this.username + "/followers?" + query,
          method: "GET",
          csrftoken: _this._client.session.csrftoken
        }).then(response => {
          resolve(JSON.parse(response.body).map(user => {
            return new User(_this._client, user);
          }));
        }).catch(reject);
      });
    }
  }

  getFollowing(opt = {}) {
    let _this = this;
    let all = [];

    if (opt.fetchAll) {
      return new Promise((resolve, reject) => {
        (function loop(rCount) {
          let query = "limit=40&offset=" + rCount;

          request({
            hostname: "api.scratch.mit.edu",
            path: "/users/" + _this.username + "/following/?" + query,
            method: "GET",
            csrftoken: _this._client.session.csrftoken
          }).then(response => {
            let json = JSON.parse(response.body);

            JSON.parse(response.body).forEach(user => {
              all.push(new User(_this._client, user));
            });

            if (json.length === 40) {
              loop(rCount + 40);
            } else {
              resolve(all);
            }
          }).catch(reject);
        })(0);
      });
    } else {
      let query = "limit=" + (opt.limit || 20) + "&offset=" + (opt.offset || 0);

      return new Promise((resolve, reject) => {
        request({
          hostname: "api.scratch.mit.edu",
          path: "/users/" + _this.username + "/following?" + query,
          method: "GET",
          csrftoken: _this._client.session.csrftoken
        }).then(response => {
          resolve(JSON.parse(response.body).map(user => {
            return new User(_this._client, user);
          }));
        }).catch(reject);
      });
    }
  }

  getMessageCount(useOld) {
    let _this = this;

    return new Promise((resolve, reject) => {
      if (!useOld) {
        request({
          hostname: "api.scratch.mit.edu",
          path: "/users/" + _this.username + "/messages/count",
          method: "GET",
          csrftoken: _this._client.session.csrftoken
        }).then(response => {
          resolve(JSON.parse(response.body).count);
        }).catch(reject);
      } else {
        request({
          hostname: "api.scratch.mit.edu",
          path: "/proxy/users/" + _this.username + "/activity/count",
          method: "GET",
          csrftoken: _this._client.session.csrftoken
        }).then(response => {
          resolve(JSON.parse(response.body).msg_count);
        }).catch(reject);
      }
    });
  }

  /* OLD SITE-API */

  postComment(content, parent) {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        path: "/site-api/comments/user/" + _this.username + "/add/",
        method: "POST",
        body: JSON.stringify({
          commentee_id: "",
          content: content,
          parent_id: parent || ""
        }),
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/users/" + _this.username + "/",
        "X-Token": _this._client.session.authorized.user.accessToken
      }).then(response => {
        resolve(response.body);
      }).catch(reject);
    });
  }

  report(field) {
    let _this = this;

    // Pick from these fields x

    let fields = [{
      "description": "description",
      "working_on": "working_on",
      "icon": "icon",
      "username": "username",
      "aboutme": "description",
      "workingon": "working_on",
      "avatar": "icon",
      "name": "username"
    }];

    return new Promise((resolve, reject) => {
      request({
        path: "/site-api/users/all/" + _this.username + "/report/",
        method: "POST",
        body: JSON.stringify({
          selected_field: fields[field]
        }),
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/users/" + _this.username + "/",
        "X-Token": _this._client.session.authorized.user.accessToken
      }).then(response => {
        resolve();
      }).catch(reject);
    });
  }

  toggleCommenting() {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        path: "/site-api/comments/user/" + _this.username + "/toggle-comments/",
        method: "POST",
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/users/" + _this.username + "/",
        "X-Token": _this._client.session.authorized.user.accessToken
      }).then(response => {
        resolve();
      }).catch(reject);
    });
  }

  follow() {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        path: "/site-api/users/followers/" + _this.username + "/add/?usernames=" + _this._client.session.username,
        method: "PUT",
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/users/" + _this.username + "/",
        "X-Token": _this._client.session.authorized.user.accessToken,
        "x-requested-with": "XMLHttpRequest"
      }).then(response => {
        resolve();
      }).catch(reject);
    });
  }

  unfollow() {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        path: "/site-api/users/followers/" + _this.username + "/remove/?usernames=" + _this._client.session.username,
        method: "PUT",
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/users/" + _this.username + "/",
        "X-Token": _this._client.session.authorized.user.accessToken,
        "x-requested-with": "XMLHttpRequest"
      }).then(response => {
        resolve();
      }).catch(reject);
    });
  }
}

module.exports = User;
