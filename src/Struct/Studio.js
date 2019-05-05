const Image = require("./Image.js");
const request = require("../request.js");

const StudioComment = require("./_StudioComment.js");

class Studio {
  constructor(Client, raw) {
    this._client = Client;

    this.id = raw.id;
    this.title = raw.title;
    this.owner = raw.owner;
    this.description = raw.description;
    this.image = new Image(raw.image);
    this.visible = raw.visibility === "visible";
    this.openToPublic = raw.open_to_all;

    this.createdTimestamp = raw.history.created;
    this.lsatModifiedTimestamp = raw.history.modified;

    this.followerCount = raw.stats.followers;
  }

  addProject(project) {
    let id = project.id || project;

    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/studios/" + _this.id + "/project/" + id + "/",
        method: "POST",
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/projects/" + id + "/",
        "X-Token": _this._client.session.authorized.user.accessToken
      }).then(response => {
        resolve();
      }).catch(reject);
    });
  }

  removeProject(project) {
    let id = project.id || project;

    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/studios/" + _this.id + "/project/" + id + "/",
        method: "DELETE",
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/projects/" + id + "/",
        "X-Token": _this._client.session.authorized.user.accessToken
      }).then(response => {
        resolve();
      }).catch(reject);
    });
  }

  /* OLD SITE-API - SUBJECT TO CHANGE */

  openToPublic() {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        path: "/site-api/galleries/" + _this.id + "/mark/open/",
        method: "PUT",
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/studios/" + _this.id,
        "X-Token": _this._client.session.authorized.user.accessToken,
        "x-requested-with": "XMLHttpRequest"
      }).then(response => {
        _this.openToPublic = true;

        resolve();
      }).catch(reject);
    });
  }

  closeToPublic() {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        path: "/site-api/galleries/" + _this.id + "/mark/closed/",
        method: "PUT",
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/studios/" + _this.id,
        "X-Token": _this._client.session.authorized.user.accessToken,
        "x-requested-with": "XMLHttpRequest"
      }).then(response => {
        _this.openToPublic = false;

        resolve();
      }).catch(reject);
    });
  }

  follow() {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        path: "/site-api/users/bookmarkers/" + _this.id + "/add/?usernames=" + _this._client.session.username,
        method: "PUT",
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/studios/" + _this.id + "/",
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
        path: "/site-api/users/bookmarkers/" + _this.id + "/remove/?usernames=" + _this._client.session.username,
        method: "PUT",
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/studios/" + _this.id + "/",
        "X-Token": _this._client.session.authorized.user.accessToken,
        "x-requested-with": "XMLHttpRequest"
      }).then(response => {
        console.log(response.body);

        resolve();
      }).catch(reject);
    });
  }

  toggleCommenting() {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        path: "/site-api/comments/gallery/" + _this.id + "/toggle-comments/",
        method: "POST",
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/studios/" + _this.id + "/comments/",
        "X-Token": _this._client.session.authorized.user.accessToken,
        "x-requested-with": "XMLHttpRequest"
      }).then(response => {
        resolve();
      }).catch(reject);
    });
  }

  postComment(content, parentid, commenteeid) {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        path: "/site-api/comments/gallery/" + _this.id + "/add/",
        method: "POST",
        body: JSON.stringify({
          content: content,
          parent_id: parentid || "",
          commentee_id: commenteeid || ""
        }),
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/studios/" + _this.id + "/comments/",
        "X-Token": _this._client.session.authorized.user.accessToken,
        "x-requested-with": "XMLHttpRequest"
      }).then(response => {
        let id = response.body.match(/data-comment-id="\d+"/g);
        if (id) {
          id = id[0].match(/\d+/)[0];
        }

        let user = response.body.match(/data-comment-user="\w+"/g);
        if (user) {
          user = user[0].match(/\w+/g)[3];
        }

        resolve(new StudioComment(_this._client, _this, id, user));
      }).catch(reject);
    });
  }

  deleteComment(id) {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        path: "/site-api/comments/gallery/" + _this.id + "/del/",
        method: "POST",
        body: JSON.stringify({
          id: id
        }),
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/studios/" + _this.id + "/comments/",
        "X-Token": _this._client.session.authorized.user.accessToken,
        "x-requested-with": "XMLHttpRequest"
      }).then(response => {
        resolve();
      }).catch(reject);
    });
  }

  reportComment(id) {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        path: "/site-api/comments/gallery/" + _this.id + "/rep/",
        method: "PUT",
        body: JSON.stringify({
          id: id
        }),
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/studios/" + _this.id + "/comments/",
        "X-Token": _this._client.session.authorized.user.accessToken,
        "x-requested-with": "XMLHttpRequest"
      }).then(response => {
        resolve();
      }).catch(reject);
    });
  }

  inviteCurator(user) {
    let _this = this;

    let username = user.username || user;

    return new Promise((resolve, reject) => {
      request({
        path: "/site-api/users/curators-in/" + _this.id + "/invite_curator/?usernames=" + username,
        method: "PUT",
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/studios/" + _this.id + "/curators/",
        "X-Token": _this._client.session.authorized.user.accessToken,
        "x-requested-with": "XMLHttpRequest"
      }).then(response => {
        resolve();
      }).catch(reject);
    });
  }

  acceptCurator() {
    let _this = this;

    let username = _this._client.session.username;

    return new Promise((resolve, reject) => {
      request({
        path: "/site-api/users/curators-in/" + _this.id + "/add/?usernames=" + username,
        method: "PUT",
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/studios/" + _this.id + "/curators/",
        "X-Token": _this._client.session.authorized.user.accessToken,
        "x-requested-with": "XMLHttpRequest"
      }).then(response => {
        resolve();
      }).catch(reject);
    });
  }

  promoteCurator(user) {
    let _this = this;

    let username = user.username || user;

    return new Promise((resolve, reject) => {
      request({
        path: "/site-api/users/curators-in/" + _this.id + "/promote/?usernames=" + username,
        method: "PUT",
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/studios/" + _this.id + "/curators/",
        "X-Token": _this._client.session.authorized.user.accessToken,
        "x-requested-with": "XMLHttpRequest"
      }).then(response => {
        resolve();
      }).catch(reject);
    });
  }

  setDescription(description) {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        path: "/site-api/galleries/all/" + _this.id + "/",
        method: "PUT",
        body: JSON.stringify({
          description: description
        }),
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/studios/" + _this.id + "/",
        "X-Token": _this._client.session.authorized.user.accessToken,
        "x-requested-with": "XMLHttpRequest"
      }).then(response => {
        _this.description = description;
        
        resolve();
      }).catch(reject);
    });
  }

  setTitle(title) {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        path: "/site-api/galleries/all/" + _this.id + "/",
        method: "PUT",
        body: JSON.stringify({
          title: title
        }),
        sessionid: _this._client.session.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/studios/" + _this.id + "/",
        "X-Token": _this._client.session.authorized.user.accessToken,
        "x-requested-with": "XMLHttpRequest"
      }).then(response => {
        _this.title = title;

        resolve();
      }).catch(reject);
    });
  }
}

module.exports = Studio;
