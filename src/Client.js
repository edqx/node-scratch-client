"use strict";

const request = require("./request.js");
const cookie = require("cookie");

const getUser = require("./util/getUser.js");
const Session = require("./Struct/Session.js");
const SessionFlags = require("./Struct/SessionFlags.js");

class Client {
  constructor(auth, debug) {
    this._client = this;

    this.auth = {
      username: auth.username || "",
      password: auth.password || ""
    }

    this.debug = debug || null;

    this.session = null;
  }

  fetchSession() {
    let _this = this;

    return new Promise((resolve, reject) => {
      if (!_this.session) reject(new Error("No user session found."));

      request({
        path: "/session/",
        sessionid: _this.session.sessionid,
      }, {
        "X-Requested-With": "XMLHttpRequest"
      }).then(response => {
        const body = response.body;

        let json = JSON.parse(body)[0];
        
        _this.session.authorized = new SessionFlags(_this, JSON.parse(body));

        _this.session.authorized.on("ready", function () {
          resolve(_this.session.user);
        });
      });
    });
  }

  login(options = {}) {
    let _this = this;

    return new Promise((resolve, reject) => {
      let body = JSON.stringify({
        username: _this.auth.username,
        password: _this.auth.password
      });

      request({
        path: "/login/",
        method: "POST",
        sessionid: null,
        body: body
      }, {
        "X-Requested-With": "XMLHttpRequest"
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
          id: json.id,
          username: _this.auth.username
        });

        _this.fetchSession().then(function () {
          _this._debugLog("Logged in. " + json.method);

          resolve(_this.session);
        });
      }).catch(reject);
    })
  }

  _debugLog(log) {
    if (this.debug) {
      this.debug(log);
    }
  }
}

module.exports = Client;
