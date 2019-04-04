const request = require("../request.js");

function getProjectCount() {
  return new Promise((resolve, reject) => {
    request({
      hostname: "api.scratch.mit.edu",
      path: "/projects/count/all",
      method: "GET"
    }).then(response => {
      resolve(JSON.parse(response.body).count);
    }).catch(reject);
  });
}

module.exports = getProjectCount;
