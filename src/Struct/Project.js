const request = require("../request.js");

const IncompleteUser = require("./IncompleteUser.js");
const Studio = require("./Studio.js");
const Image = require("./Image.js");
const Comment = require("./Comment.js");

class Project {
  constructor (Client, raw) {
    this._client = Client;

    this.id = raw.id;
    this.title = raw.title;
    this.description = raw.description;
    this.instructions = raw.instructions;
    this.visible = raw.visibility === "visible";
    this.public = raw.public;
    this.commentsAllowed = raw.comments_allowed;
    this.isPublished = raw.is_published;
    this.author = new IncompleteUser(Client, raw.author);

    this.thumbnail = new Image(Client, raw.image);
    this.thumbnails = {};
    for (let image in raw.images) {
      this.thumbnails[image] = new Image(Client, raw.images[image]);
    }
    this.thumbnails["480x360"] = new Image(Client, raw.image);

    this.createdTimestamp = raw.history.created;
    this.lastModifiedTimestamp = raw.history.modified;
    this.sharedTimestamp = raw.history.shared;

    this.viewCount = raw.stats.views;
    this.loveCount = raw.stats.loves;
    this.favoriteCount = raw.stats.favorites;
    this.commentCount = raw.stats.comments;
    this.remixCount = raw.stats.remixes;

    this.parent = raw.remix.parent || null;
    this.root = raw.remix.root || null;
    this.isRemix = !!raw.remix.parents;
  }

  getScripts() {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        hostname: "projects.scratch.mit.edu",
        path: "/" + _this.id,
        method: "GET",
        csrftoken: _this._client.session.csrftoken
      }).then(response => {
        resolve(JSON.parse(response.body));
      }).catch(reject);
    });
  }

  getRemixes(opt = {}) {
    let _this = this;
    let all = [];

    if (opt.fetchAll) {
      return new Promise((resolve, reject) => {
        (function loop(rCount) {
          let query = "limit=40&offset=" + rCount;

          request({
            hostname: "api.scratch.mit.edu",
            path: "/users/projects/remixes?" + query,
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
      return new Promise((resolve, reject) => {
        let query = "limit=" + (opt.limit || 20) + "&offset=" + (opt.offset || 0);

        request({
          hostname: "api.scratch.mit.edu",
          path: "/projects/" + _this.id + "/remixes/?" + query,
          method: "GET",
          csrftoken: _this._client.session.csrftoken
        }).then(response => {
          resolve(JSON.parse(response.body).map(project => {
            return new Project(project);
          }));
        }).catch(reject);
      });
    }
  }

  getStudios(opt = {}) {
    let _this = this;
    let all = [];

    if (opt.fetchAll) {
      return new Promise((resolve, reject) => {
        (function loop(rCount) {
          let query = "limit=40&offset=" + rCount;

          request({
            hostname: "api.scratch.mit.edu",
            path: "/projects/" + _this.id + "/studios?" + query,
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
      return new Promise((resolve, reject) => {
        let query = "limit=" + (opt.limit || 20) + "&offset=" + (opt.offset || 0);

        request({
          hostname: "api.scratch.mit.edu",
          path: "/projects/" + _this.id + "/studios/?" + query,
          method: "GET",
          csrftoken: _this._client.session.csrftoken
        }).then(response => {
          resolve(JSON.parse(response.body).map(project => {
            return new Studio(project);
          }));
        }).catch(reject);
      });
    }
  }

  postComment(content) {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/proxy/comments/project/" + _this.id + "/",
        method: "POST",
        body: JSON.stringify({
          commentee_id: "",
          content: content,
          parent_id: ""
        }),
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/projects/" + _this.id + "/",
        "X-Token": _this._client.session.authorized.user.accessToken
      }).then(response => {
        resolve(response.body);
      }).catch(reject);
    });
  }

  getComments(opt) {
    let _this = this;
    let all = [];

    if (opt.fetchAll) {
      return new Promise((resolve, reject) => {
        (function loop(rCount) {
          let query = "limit=40&offset=" + rCount;

          request({
            hostname: "api.scratch.mit.edu",
            path: "/projects/" + _this.id + "/comments?" + query,
            method: "GET",
            csrftoken: _this._client.session.csrftoken
          }).then(response => {
            let json = JSON.parse(response.body);

            JSON.parse(response.body).forEach(comment => {
              all.push(new Comment(_this._client, _this, comment));
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
      return new Promise((resolve, reject) => {
        let query = "limit=" + (opt.limit || 20) + "&offset=" + (opt.offset || 0);

        request({
          hostname: "api.scratch.mit.edu",
          path: "/projects/" + _this.id + "/comments/?" + query,
          method: "GET",
          csrftoken: _this._client.session.csrftoken
        }).then(response => {
          resolve(JSON.parse(response.body).map(project => {
            return new Studio(project);
          }));
        }).catch(reject);
      });
    }
  }

  turnOffCommenting() {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/projects/" + _this.id + "/",
        method: "PUT",
        body: JSON.stringify({
          comments_allowed: false
        }),
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/projects/" + _this.id + "/",
        "X-Token": _this._client.session.authorized.user.accessToken
      }).then(response => {
        resolve(new Project(_this._client, JSON.parse(response.body)));
      }).catch(reject);
    });
  }

  turnOnCommenting() {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/projects/" + _this.id + "/",
        method: "PUT",
        body: JSON.stringify({
          comments_allowed: true
        }),
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/projects/" + _this.id + "/",
        "X-Token": _this._client.session.authorized.user.accessToken
      }).then(response => {
        resolve(new Project(_this._client, JSON.parse(response.body)));
      }).catch(reject);
    });
  }

  toggleCommenting() {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/projects/" + _this.id + "/",
        method: "PUT",
        body: JSON.stringify({
          comments_allowed: !_this.commentsAllowed
        }),
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/projects/" + _this.id + "/",
        "X-Token": _this._client.session.authorized.user.accessToken
      }).then(response => {
        resolve(new Project(_this._client, JSON.parse(response.body)));
      }).catch(reject);
    });
  }

  report(category, reason, image) {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/proxy/comments/project/" + _this.id + "/",
        method: "POST",
        body: JSON.stringify({
          notes: reason,
          report_category: category,
          thumbnail: image || _this.project.thumbnail.src
        }),
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/projects/" + _this.id + "/",
        "X-Token": _this._client.session.authorized.user.accessToken
      }).then(response => {
        resolve(response.body);
      }).catch(reject);
    });
  }

  /*
  unshare() {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        hostname: "scratch.mit.edu",
        path: "/site-api/projects/all/" + _this.id + "/",
        method: "PUT",
        body: JSON.stringify({
          is_published: false
        }),
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/projects/" + _this.id + "/",
        "X-Token": _this._client.session.authorized.user.accessToken
      }).then(response => {
        resolve(JSON.parse(response.body));
      }).catch(reject);
    });
  }

  share() {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/projects/" + _this.id + "/",
        method: "PUT",
        body: JSON.stringify({
          is_published: true
        }),
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/projects/" + _this.id + "/",
        "X-Token": _this._client.session.authorized.user.accessToken
      }).then(response => {
        resolve(JSON.parse(response.body));
      }).catch(reject);
    });
  }
  */
}

module.exports = Project;
