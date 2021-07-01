const request = require("../request.js");
const fs = require("fs");
var parse = require('xml-parser-xo');

const IncompleteUser = require("./IncompleteUser.js");
const Studio = require("./Studio.js");
const Image = require("./Image.js");
const ProjectComment = require("./ProjectComment.js");
const ScratchImageAsset = require("./ScratchImageAsset.js");
const ScratchSoundAsset = require("./ScratchSoundAsset.js");
const ScratchAsset = require("./ScratchAsset.js");

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

  removeWhitespace(json) {
    function trimElements(element) {
      if (element.children) {
        element.children = element.children.map((child) => {
          if (child.type === "Element") {
            trimElements(child);
          } else if (child.type === "Text") {
            child.content = child.content.trim();
          }
          return child;
        });
      }
    }

    function deleteEmptyElements(element) {
      if (element.children) {
        element.children = element.children.filter((child) => {
          if (child.type === "Element") {
            deleteEmptyElements(child);
            return true;
          } else if (child.type === "Text") {
            return child.content.length > 0;
          } else if (child.type === "Comment") {
            return false;
          }
        });
      }
    }

    trimElements(json);
    deleteEmptyElements(json);
  }

  love() {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/proxy/projects/" + _this.id + "/loves/user/" + _this._client.session.username,
        method: "POST",
        sessionid:  _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        "X-Requested-With": "XMLHttpRequest",
        "X-Token": _this._client.session.authorized.user.accessToken
      }).then(response => {
        resolve(JSON.parse(response.body).userLove);
      }).catch(reject);
    });
  }

  unlove() {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/proxy/projects/" + _this.id + "/loves/user/" + _this._client.session.username,
        method: "DELETE",
        sessionid:  _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        "X-Requested-With": "XMLHttpRequest",
        "X-Token": _this._client.session.authorized.user.accessToken
      }).then(response => {
        resolve(JSON.parse(response.body).userLove);
      }).catch(reject);
    });
  }

  favorite() {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/proxy/projects/" + _this.id + "/favorites/user/" + _this._client.session.username,
        method: "POST",
        sessionid:  _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        "X-Requested-With": "XMLHttpRequest",
        "X-Token": _this._client.session.authorized.user.accessToken
      }).then(response => {
        resolve(JSON.parse(response.body).userFavorite);
      }).catch(reject);
    });
  }

  unfavorite() {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/proxy/projects/" + _this.id + "/favorites/user/" + _this._client.session.username,
        method: "DELETE",
        sessionid:  _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        "X-Requested-With": "XMLHttpRequest",
        "X-Token": _this._client.session.authorized.user.accessToken
      }).then(response => {
        resolve(JSON.parse(response.body).userFavorite);
      }).catch(reject);
    });
  }

  getScripts() {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        hostname: "projects.scratch.mit.edu",
        path: "/" + _this.id + "/",
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
          resolve(JSON.parse(response.body).map(studio => {
            return new Studio(_this._client, studio);
          }));
        }).catch(reject);
      });
    }
  }

  postComment(content, parent) {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/proxy/comments/project/" + _this.id + "/",
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
        referer: "https://scratch.mit.edu/projects/" + _this.id + "/",
        "X-Token": _this._client.session.authorized.user.accessToken
      }).then(response => {
        resolve();
      }).catch(reject);
    });
  }

  getComments(opt = {}) {
    let _this = this;
    let all = [];

    function parseComments(xml) {
      let json = parse('<?xml version="1.0" encoding="utf-8"?><all>' + xml + '</all></xml>');

      _this.removeWhitespace(json);

      json.root.children.forEach(child => {
        if (child.type === "Element" && child.name === "li") {
          let commentData = {
            parent_id: null
          };
          child.children.forEach(child => {
            if (child.type === "Element" && child.name === "div") {
              commentData.id = child.attributes["data-comment-id"];
              child.children.forEach(child => {
                if (child.type === "Element" && child.name === "div" && child.attributes.class === "info") {
                  child.children.forEach(child => {
                    if (child.type === "Element" && child.name === "div") {
                      if (child.attributes.class === "name") {
                      } else if (child.attributes.class === "content") {
                        commentData.content = child.children[0].content;
                      } else {
                        child.children.forEach(child => {
                          if (child.type === "Element" && child.name === "span") {
                            commentData.datetime_created = child.attributes.title;
                            commentData.datetime_modified = child.attributes.title;
                          }else if (child.type === "Element" && child.name === "a") {
                            commentData.commentee_id = child.attributes["data-commentee-id"];
                          }
                        });
                      }
                    }
                  })
                }
              })
            }
            if (child.type === "Element" && child.name === "ul") {
              let replyCount = 0;
              child.children.forEach(child => {
                if (child.type === "Element" && child.name === "li") {
                  replyCount += 1;
                }
              });
              commentData.reply_count = replyCount;
            }
          })
          all.push(new ProjectComment(_this._client, _this, commentData));
        }
      });
    }

    if (opt.fetchAll) {
      return new Promise((resolve, reject) => {
        (function loop(pageCount) {
          let query = "page=" + pageCount;

          request({
            hostname: "scratch.mit.edu",
            path: "/site-api/comments/project/" + _this.id + "/?" + query,
            method: "GET",
            csrftoken: _this._client.session.csrftoken
          }).then(response => {
            parseComments(response.body);

            if (json.root.children.length === 40) {
              loop(pageCount + 1);
            } else {
              resolve(all);
            }
          }).catch(reject);
        })(1);
      });
    } else {
      return new Promise((resolve, reject) => {
        let query = "page=" + opt.page;

        request({
          hostname: "scratch.mit.edu",
          path: "/site-api/comments/project/" + _this.id + "/?" + query,
          method: "GET",
          csrftoken: _this._client.session.csrftoken
        }).then(response => {
          parseComments(response.body);
          resolve(all);
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
        _this.commentsAllowed = false;

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
        _this.commentsAllowed = true;

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
        _this.commentsAllowed = !_this.commentsAllowed;

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

  getAllAssets() {
    let _this = this;
    let all = [];

    return new Promise((resolve, reject) => {
      this.getScripts().then(scripts => {
        scripts.targets.forEach(sprite => {
          sprite.costumes.forEach(costume => {
            all.push(new ScratchImageAsset(_this._client, costume));
          });

          sprite.sounds.forEach(costume => {
            all.push(new ScratchSoundAsset(_this._client, costume));
          });

          resolve(all);
        })
      }).catch(reject);
    });
  }

  unshare() {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/proxy/projects/" + _this.id + "/unshare/",
        method: "PUT",
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/projects/" + _this.id + "/",
        "X-Token": _this._client.session.authorized.user.accessToken
      }).then(response => {
        resolve();
      }).catch(reject);
    });
  }

  share() {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/proxy/projects/" + _this.id + "/share/",
        method: "PUT",
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/projects/" + _this.id + "/",
        "X-Token": _this._client.session.authorized.user.accessToken
      }).then(response => {
        resolve();
      }).catch(reject);
    });
  }

  setThumbnail(file) {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        hostname: "scratch.mit.edu",
        path: "/internalapi/project/thumbnail/" + _this.id + "/set/",
        method: "POST",
        body: fs.readFileSync(file),
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "*/*",
        "Content-Type": "image/" + file.split(".")[file.split(".").length - 1],
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/projects/" + _this.id + "/",
        "X-Token": _this._client.session.authorized.user.accessToken,
        "x-requested-with": "XMLHttpRequest"
      }).then(response => {
        resolve();
      }).catch(reject);
    });
  }

  view() {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        hostname: "scratch.mit.edu",
        path: "/users/" + _this.author.username + "/" + _this.id + "/views/",
        method: "POST",
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "*/*",
        "Content-Type": "image/" + file.split(".")[file.split(".").length - 1],
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/projects/" + _this.id + "/",
        "X-Token": _this._client.session.authorized.user.accessToken,
        "x-requested-with": "XMLHttpRequest"
      }).then(response => {
        resolve();
      }).catch(reject);
    });
  }
}

module.exports = Project;
