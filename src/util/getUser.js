const request = require("../request.js");

const User = require("../Struct/User.js");

function getUser(user) {
  let username = user.username || user;

  console.log(username);

  return new Promise((resolve, reject) => {
    request({
      hostname: "api.scratch.mit.edu",
      path: "/users/" + username,
      method: "GET"
    }).then(response => {
      resolve(new User(JSON.parse(response.body)));
    }).catch(reject);
  });
}

module.exports = getUser;
