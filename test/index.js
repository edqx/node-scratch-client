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

  Client.getProject(299899708).then(project => {
    setInterval(function () {
      project.postComment("What");
    }, 3500);
  });
})();
