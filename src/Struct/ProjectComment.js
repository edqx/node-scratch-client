const request = require("../request.js");

const CommentAuthor = require("./CommentAuthor.js");

class ProjectComment {
  constructor(Client, project, raw) {
    this._client = Client;

    this.id = raw.id;
    this.parentid = raw.parent_id;
    this.commenteeid = raw.commentee_id;
    this.content = raw.content;
    this.replyCount = raw.reply_count;
    this.project = project;

    this.createdTimestamp = raw.datetime_created;
    this.lastModifiedTiemstamp = raw.datetime_modified;

    this.visible = raw.visibility === "visible";

    this.author = new CommentAuthor(Client, raw.author);
  }

  delete() {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/proxy/comments/project/" + _this.project.id + "/comment/" + _this.id,
        method: "DELETE",
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/projects/" + _this.id + "/",
        "X-Token": _this._client.session.authorized.user.accessToken
      }).then(response => {
        resolve();
      }).catch(reject);
    });
  }

  report() {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/proxy/comments/project/" + _this.project.id + "/comment/" + _this.id + "/report",
        method: "POST",
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/projects/" + _this.id + "/",
        "X-Token": _this._client.session.authorized.user.accessToken
      }).then(response => {
        resolve();
      }).catch(reject);
    });
  }

  reply(content) {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/proxy/comments/project/" + _this.project.id + "/",
        method: "POST",
        body: JSON.stringify({
          commentee_id: _this.author.id,
          content: content,
          parent_id: _this.id
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
}

module.exports = ProjectComment;
