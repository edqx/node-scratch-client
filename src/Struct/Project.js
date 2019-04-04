const request = require("../request.js");

const IncompleteUser = require("./IncompleteUser.js");
const Studio = require("./Studio.js");

class Project {
  constructor (raw) {
    this.id = raw.id;
    this.title = raw.title;
    this.description = raw.description;
    this.instructions = raw.instructions;
    this.visible = raw.visibility === "visible";
    this.public = raw.public;
    this.comments_allowed = raw.comments_allowed;
    this.is_published = raw.is_published;
    this.author = new IncompleteUser(raw.author);

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

  getRemixes(opt = {}) {
    let _this = this;
    let all = [];

    if (opt.fetchAll) {
      return new Promise((resolve, reject) => {
        (function loop(rCount) {
          let diff = _this.remixCount - rCount;
          let query = "limit=" + (diff > 20 ? 20 : diff) + "&offset=" + (rCount);

          request({
            hostname: "api.scratch.mit.edu",
            path: "/projects/" + _this.id + "/remixes/?" + query,
            method: "GET"
          }).then(response => {
            JSON.parse(response.body).forEach((project, i) => {
              let diff = _this.remixCount - rCount;
              if (i >= (diff > 20 ? 20 : diff)) return;

              all.push(new Project(project));
            });

            let diff = _this.remixCount - rCount;
            rCount += (diff > 20 ? 20 : diff);
            if (rCount <= _this.remixCount && diff) {
              loop(rCount);
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
          method: "GET"
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
          let diff = _this.remixCount - rCount;
          let query = "limit=" + (diff > 20 ? 20 : diff) + "&offset=" + (rCount);

          request({
            hostname: "api.scratch.mit.edu",
            path: "/projects/" + _this.id + "/studios/?" + query,
            method: "GET"
          }).then(response => {
            JSON.parse(response.body).forEach((project, i) => {
              let diff = _this.remixCount - rCount;
              if (i >= (diff > 20 ? 20 : diff)) return;

              all.push(new Studio(project));
            });

            let diff = _this.remixCount - rCount;
            rCount += (diff > 20 ? 20 : diff);
            if (rCount <= _this.remixCount && diff) {
              loop(rCount);
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
          method: "GET"
        }).then(response => {
          resolve(JSON.parse(response.body).map(project => {
            return new Studio(project);
          }));
        }).catch(reject);
      });
    }
  }
}

module.exports = Project;
