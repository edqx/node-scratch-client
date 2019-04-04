const path = require("path");

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

  Client.session.authorized.user.getProjects().then(projects => {
    console.log(projects);
  });
})();
