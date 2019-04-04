const request = require("../request.js");

const Project = require("./Project.js");
const Studio = require("./Studio.js");

class User {
  constructor(raw) {
    this.id = raw.id;
    this.username = raw.username;

    this.joinedTimestamp = raw.history.joined;
    this.loginTimestamp = raw.history.login;

    this.profile = {
      id: raw.profile.id,
      avatar: raw.profile.avatar,
      status: raw.profile.status,
      bio: raw.profile.bio
    }
  }

  getProjects(opt = {}) {
    let _this = this;
    let all = [];

    if (opt.fetchAll) {
      return new Promise((resolve, reject) => {
        (function loop(rCount) {
          let diff = _this.remixCount - rCount;
          let query = "limit=" + (diff > 20 ? 20 : diff) + "&offset=" + (rCount);

          request({
            hostname: "api.scratch.mit.edu",
            path: "/users/" + _this.username + "/projects/?" + query,
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
      let query = "limit=" + (opt.limit || 20) + "&offset=" + (opt.offset || 0);

      return new Promise((resolve, reject) => {
        request({
          hostname: "api.scratch.mit.edu",
          path: "/users/" + _this.username + "/projects/?" + query,
          method: "GET"
        }).then(response => {
          resolve(JSON.parse(response.body).map(project => {
            return new Project(project);
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
        method: "GET"
      }).then(response => {
        resolve(new Project(JSON.parse(response.body)));
      }).catch(reject);
    });
  }

  getCurating(opt = {}) {
    let _this = this;
    let all = [];

    if (opt.fetchAll) {
      return new Promise((resolve, reject) => {
        (function loop(rCount) {
          let diff = _this.remixCount - rCount;
          let query = "limit=" + (diff > 20 ? 20 : diff) + "&offset=" + (rCount);

          request({
            hostname: "api.scratch.mit.edu",
            path: "/users/" + _this.username + "/studios/curate",
            method: "GET"
          }).then(response => {
            JSON.parse(response.body).forEach((studio, i) => {
              let diff = _this.remixCount - rCount;
              if (i >= (diff > 20 ? 20 : diff)) return;

              all.push(new Studio(studio));
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
      let query = "limit=" + (opt.limit || 20) + "&offset=" + (opt.offset || 0);

      return new Promise((resolve, reject) => {
        request({
          hostname: "api.scratch.mit.edu",
          path: "/users/" + _this.username + "/studios/curate?" + query,
          method: "GET"
        }).then(response => {
          resolve(JSON.parse(response.body).map(studio => {
            return new Studio(studio);
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
          let diff = _this.remixCount - rCount;
          let query = "limit=" + (diff > 20 ? 20 : diff) + "&offset=" + (rCount);

          request({
            hostname: "api.scratch.mit.edu",
            path: "/users/" + _this.username + "/favorites?" + query,
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
      let query = "limit=" + (opt.limit || 20) + "&offset=" + (opt.offset || 0);

      return new Promise((resolve, reject) => {
        request({
          hostname: "api.scratch.mit.edu",
          path: "/users/" + _this.username + "/favorites?" + query,
          method: "GET"
        }).then(response => {
          resolve(JSON.parse(response.body).map(project => {
            return new Project(project);
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
          let diff = _this.remixCount - rCount;
          let query = "limit=" + (diff > 20 ? 20 : diff) + "&offset=" + (rCount);

          request({
            hostname: "api.scratch.mit.edu",
            path: "/users/" + _this.username + "/followers?" + query,
            method: "GET"
          }).then(response => {
            JSON.parse(response.body).forEach((user, i) => {
              let diff = _this.remixCount - rCount;
              if (i >= (diff > 20 ? 20 : diff)) return;

              all.push(new User(user));
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
      let query = "limit=" + (opt.limit || 20) + "&offset=" + (opt.offset || 0);

      return new Promise((resolve, reject) => {
        request({
          hostname: "api.scratch.mit.edu",
          path: "/users/" + _this.username + "/followers?" + query,
          method: "GET"
        }).then(response => {
          resolve(JSON.parse(response.body).map(user => {
            console.log(user);
            return new User(user);
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
          let diff = _this.remixCount - rCount;
          let query = "limit=" + (diff > 20 ? 20 : diff) + "&offset=" + (rCount);

          request({
            hostname: "api.scratch.mit.edu",
            path: "/users/" + _this.username + "/following?" + query,
            method: "GET"
          }).then(response => {
            JSON.parse(response.body).forEach((user, i) => {
              let diff = _this.remixCount - rCount;
              if (i >= (diff > 20 ? 20 : diff)) return;

              all.push(new User(user));
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
      let query = "limit=" + (opt.limit || 20) + "&offset=" + (opt.offset || 0);

      return new Promise((resolve, reject) => {
        request({
          hostname: "api.scratch.mit.edu",
          path: "/users/" + _this.username + "/following?" + query,
          method: "GET"
        }).then(response => {
          resolve(JSON.parse(response.body).map(user => {
            console.log(user);
            return new User(user);
          }));
        }).catch(reject);
      });
    }
  }

  getMessageCount() {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/users/" + _this.username + "/messages/count",
        method: "GET"
      }).then(response => {
        resolve(JSON.parse(response.body).count);
      }).catch(reject);
    });
  }
}

module.exports = User;
