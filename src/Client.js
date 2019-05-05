"use strict";

const request = require("./request.js");
const cookie = require("cookie");
const querystring = require("querystring");

const Project = require("./Struct/Project.js");
const User = require("./Struct/User.js");
const Studio = require("./Struct/Studio.js");
const Session = require("./Struct/Session.js");
const SessionFlags = require("./Struct/SessionFlags.js");
const News = require("./Struct/News.js");

class Client {
  constructor(auth, debug) {
    this._client = this;

    this.auth = {
      username: auth.username || "",
      password: auth.password || ""
    }

    this.debug = debug || null;

    this.session = {};

    this.csrf = null;
  }

  _fetchcsrf() {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        path: "/csrf_token/"
      }, {
        "X-Requested-With": "XMLHttpRequest",
        "Cookie": "scratchlanguage=en; permissions=%7B%7D;"
      }).then(data => {
        const cookies = cookie.parse(data.response.headers["set-cookie"][1]);

        _this.csrf = cookies.scratchcsrftoken;

        resolve(cookies.scratchcsrftoken);
      });
    });
  }

  _fetchSession() {
    let _this = this;

    return new Promise((resolve, reject) => {
      if (!_this.session) reject(new Error("No user session found."));

      request({
        path: "/session/",
        sessionid: _this.session.sessionid,
        csrftoken: _this.session.csrftoken
      }, {
        "X-Requested-With": "XMLHttpRequest"
      }).then(response => {
        const body = response.body;

        let json = JSON.parse(body)[0];

        _this.session.authorized = new SessionFlags(_this, JSON.parse(body));

        _this.session.authorized.on("ready", function () {
          resolve(_this.session);
        });
      }).catch(reject);
    });
  }

  login() {
    let _this = this;

    return new Promise((resolve, reject) => {
      let body = JSON.stringify({
        username: _this.auth.username,
        password: _this.auth.password
      });

      _this._fetchcsrf().then(csrf => {
        request({
          path: "/login/",
          method: "POST",
          sessionid: null,
          body: body,
          csrftoken: csrf
        }, {
          "X-Requested-With": "XMLHttpRequest",
        }).then(data => {
          const body = data.body;
          const response = data.response;

          let json = JSON.parse(body)[0];

          if (json.success === 0 && json.msg === "Incorrect username or password.") {
            return reject(new Error("Incorrect username or password provided."));
          }

          let cookies = cookie.parse(response.headers["set-cookie"][0]);

          _this.session = new Session(_this, {
            sessionid: cookies.scratchsessionsid,
            csrftoken: csrf,
            id: json.id,
            username: _this.auth.username
          });

          _this._fetchSession().then(function () {
            _this._debugLog("Logged in. " + json.method);

            resolve(_this.session);
          });
        }).catch(reject);
      });
    });
  }

  _debugLog(log) {
    if (this.debug) {
      this.debug(log);
    }
  }

  getProject(project) {
    let _this = this;

    let id = project.id || project;

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/projects/" + id,
        method: "GET",
        sessionid: _this.session.sessionid,
        csrftoken: _this.session.csrftoken
      }).then(response => {
        resolve(new Project(_this, JSON.parse(response.body)));
      }).catch(reject);
    });
  }

  getProjectCount() {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/projects/count/all",
        method: "GET",
        csrftoken: _this.session.csrftoken
      }).then(response => {
        resolve(JSON.parse(response.body).count);
      }).catch(reject);
    });
  }

  getUser(user) {
    let _this = this;

    let username = user.username || user;

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/users/" + username,
        method: "GET",
        sessionid: _this.session.sessionid,
        csrftoken: _this.session.csrftoken
      }).then(response => {
        resolve(new User(_this, JSON.parse(response.body)));
      }).catch(reject);
    });
  }

  getStudio(studio) {
    let _this = this;

    let id = studio.id || studio;

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/studios/" + id,
        method: "GET",
        sessionid: _this.session.sessionid,
        csrftoken: _this.session.csrftoken
      }).then(response => {
        resolve(new Studio(_this, JSON.parse(response.body)));
      }).catch(reject);
    });
  }

  exploreProjects(tags, mode) { // under construction
    let _this = this;
    let query = [];
    if (tags) {
      query.push(tags);
    }
    if (mode) {
      query.push(mode);
    }
    query = query.join("&");

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/explore/projects" + (query ? "?" + query : ""),
        method: "GET",
        sessionid: _this.session.sessionid,
        csrftoken: _this.session.csrftoken
      }).then(response => {
        let projects = JSON.parse(response.body);

        resolve(projects.map(project => {
          return new Project(_this, project);
        }));
      }).catch(reject);
    });
  }

  exploreStudios(tags, mode) { // under construction
    let _this = this;
    let query = [];
    if (tags) {
      query.push(tags);
    }
    if (mode) {
      query.push(mode);
    }
    query = query.join("&");

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/explore/studios" + (query ? "?" + query : ""),
        method: "GET",
        sessionid: _this.session.sessionid,
        csrftoken: _this.session.csrftoken
      }).then(response => {
        let studios = JSON.parse(response.body);

        resolve(studios.map(studio => {
          return new Studio(_this, studio);
        }));
      }).catch(reject);
    });
  }

  searchProjects(search, mode) {
    let _this = this;
    let query = [];
    if (search) {
      query.push(search);
    }
    if (mode) {
      query.push(mode);
    }
    query = query.join("&");

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/search/projects" + (query ? "?" + query : ""),
        method: "GET",
        sessionid: _this.session.sessionid,
        csrftoken: _this.session.csrftoken
      }).then(response => {
        let projects = JSON.parse(response.body);

        resolve(projects.map(project => {
          return new Project(_this, project);
        }));
      }).catch(reject);
    });
  }

  searchStudios(search, mode) {
    let _this = this;
    let query = [];
    if (search) {
      query.push(search);
    }
    if (mode) {
      query.push(mode);
    }
    query = query.join("&");

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/search/studios" + (query ? "?" + query : ""),
        method: "GET",
        sessionid: _this.session.sessionid,
        csrftoken: _this.session.csrftoken
      }).then(response => {
        let studios = JSON.parse(response.body);

        resolve(studios.map(studio => {
          return new Studio(_this, studio);
        }));
      }).catch(reject);
    });
  }

  getNews() {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        hostname: "api.scratch.mit.edu",
        path: "/news",
        method: "GET",
        sessionid: _this.session.sessionid,
        csrftoken: _this.session.csrftoken
      }).then(response => {
        let newses = JSON.parse(response.body); // *newses*

        resolve(newses.map(news => {
          return new News(_this, news);
        }));
      }).catch(reject);
    });
  }

  isValidUsername(name) {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        path: "/accounts/check_username/" + name,
        method: "GET",
        sessionid: _this.session.sessionid,
        csrftoken: _this.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/accounts/standalone-registration/",
        "X-Token": _this._client.session.authorized.user.accessToken,
        "x-requested-with": "XMLHttpRequest"
      }).then(response => {
        let isok = JSON.parse(response.body);

        resolve(isok[0].msg === "valid username");
      }).catch(reject);
    });
  }

  isValidEmail(email) {
    let _this = this;

    return new Promise((resolve, reject) => {
      request({
        path: "/accounts/check_email/" + name,
        method: "GET",
        sessionid: _this.session.sessionid,
        csrftoken: _this.session.csrftoken
      }, {
        accept: "application/json",
        "Content-Type": "application/json",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/accounts/standalone-registration/",
        "X-Token": _this._client.session.authorized.user.accessToken,
        "x-requested-with": "XMLHttpRequest"
      }).then(response => {
        let isok = JSON.parse(response.body);

        resolve(isok[0].msg === "valid email");
      }).catch(reject);
    });
  }

  registerNewUser(options) {
    let _this = this;

    let opt = options;

    return new Promise((resolve, reject) => {
      request({
        path: "/accounts/register_new_user/",
        method: "POST",
        body: querystring.stringify({
          username: opt.username,
          password: opt.password,
          birth_month: opt.birthMonth,
          birth_year: opt.birthYear,
          gender: opt.gender,
          country: opt.country,
          email: opt.email,
          subscribe: opt.subscribe,
          is_robot: false,
          csrfmiddlewaretoken: _this.csrf
        }),
        csrftoken: _this.csrf,
      }, {
        accept: "application/json, text/javascript, */*; q=0.01",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/accounts/standalone-registration/",
        "X-Token": _this._client.session.authorized.user.accessToken,
        "x-requested-with": "XMLHttpRequest"
      }).then(response => {
        let basic = JSON.parse(response.body);

        resolve(basic[0]);
      }).catch(reject);
    });
  }

  deleteAccount(areYouSure, projects) {
    let _this = this;

    if (!areYouSure) return;

    let state = "delbyusr";

    if (projects) {
      state = "delbyusrwproj";
    }

    console.log(querystring.stringify({
      csrfmiddlewaretoken: _this.session.csrftoken,
      delete_state: state,
      password: _this.auth.password
    }));

    return new Promise((resolve, reject) => {
      request({
        path: "/accounts/settings/delete_account",
        method: "POST",
        body: querystring.stringify({
          csrfmiddlewaretoken: _this.session.csrftoken,
          delete_state: state,
          password: _this.auth.password
        }),
        sessionid: _this.session.sessionid,
        csrftoken: _this.session.csrftoken,
        permission: _this.session.permission
      }, {
        accept: "*/*",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        origin: "https://scratch.mit.edu",
        referer: "https://scratch.mit.edu/accounts/settings/delete_account_confirmation/",
        "x-requested-with": "XMLHttpRequest"
      }).then(response => {
        console.log(response.response.headers);

        resolve(response.request);
      }).catch(reject);
    });
  }
}

module.exports = Client;
