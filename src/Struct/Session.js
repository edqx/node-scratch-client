"use strict";

const request = require("../request.js");
const https = require("https");

const Backpack = require("./Backpack/Backpack.js");
const CloudSession = require("./CloudSession.js");

class Session {
  constructor(Client, basic) {
    this._client = Client;

    this.username = basic.username || null;
    this.id = basic.id || null;
    this.sessionid = basic.sessionid || null;
    this.csrftoken = basic.csrftoken;

    this.authorized = basic.authorized || null;

    this.cloudsession = null;
  }

  createCloudSession(project) {
    this.cloudsession = new CloudSession(this._client, this.username, project);

    return this.cloudsession;
  }

  getBackpack() {
    let _this = this;

    return new Promise((resolve, reject) => {
      let body = JSON.stringify({
        csrfmiddlewaretoken: "a"
      });

      request({
        path: "/internalapi/backpack/" + _this.username + "/get/",
        method: "GET",
        sessionid: _this.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {
        "X-Requested-With": "XMLHttpRequest"
      }).then(data => {
        const body = data.body;
        const response = data.response;

        let json = JSON.parse(body);

        resolve(new Backpack(_this._client, json));
      }).catch(reject);
    });
  }

  setBackpack(newBackpack) {
    let _this = this;

    return  new Promise((resolve, reject) => {
      let body = JSON.stringify(newBackpack);

      request({
        hostname: "cdn.scratch.mit.edu",
        path:  "/internalapi/backpack/" + _this.username + "/set/",
        method: "POST",
        body: body,
        sessionid: _this.sessionid,
        csrftoken: _this._client.session.csrftoken
      }, {}).then(response => {
        resolve(JSON.parse(response.body));
      }).catch(reject);
    });
  }

  logout() { // Under construction
    let _this = this;

    return new Promise((resolve, reject) => {
      let body = JSON.stringify({
        csrfmiddlewaretoken: "a"
      });

      request({
        path: "/accounts/logout/",
        method: "POST",
        sessionid: _this.sessionid,
        body: body,
        csrftoken: _this._client.session.csrftoken
      }, {
        "X-Requested-With": "XMLHttpRequest"
      }).then(data => {
        const body = data.body;
        const response = data.response;
      }).catch(reject);
    });
  }
}

module.exports = Session;
