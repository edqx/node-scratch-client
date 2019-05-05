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
  
})();
