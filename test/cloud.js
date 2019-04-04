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

  let cloudSession = Client.session.createCloudSession(299899708);

  cloudSession.connect().then(() => {
    cloudSession.on("set", variable => {
      setTimeout(() => {
        cloudSession.getVariable(cloudSession.resolve("yes")).set(100);

        setTimeout(() => {
          variable.set(0);
        }, 1000);
      }, 1000);
    });
  });
})();
