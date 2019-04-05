const path = require("path");
const fs = require("fs");

const request = require("../src/request.js");

let scratch =  require("../index.js");
require("dotenv").config({
  path: path.resolve(__dirname, "../../.env")
});

let Client = new scratch.Client({
  username: process.env.SCRATCH_USERNAME,
  password: process.env.SCRATCH_PASSWORD
});

(async _ => {
  await Client.login();

  let user = await Client.getUser("Divinium");

  user.postComment("ok");

  request({
    path: "/site-api/comments/user/Divinium/",
    method: "GET",
    sessionid: Client.session.sessionid,
    csrftoken: Client.session.csrftoken
  }, {
    accept: "application/json",
    "Content-Type": "application/json",
    origin: "https://scratch.mit.edu",
    "X-Token": Client.session.authorized.user.accessToken
  }).then(response => {
    console.log(response.body);
  }).catch(console.log);
})();
