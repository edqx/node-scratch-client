const request = require("../request.js");

const Project = require("../Struct/Project.js");

function getProject(project) {
  let id = project.id || project;

  return new Promise((resolve, reject) => {
    request({
      hostname: "api.scratch.mit.edu",
      path: "/projects/" + id,
      method: "GET",
      body: JSON.stringify({
        "x-token": "a"
      })
    }).then(response => {
      resolve(new Project(JSON.parse(response.body)));
    }).catch(reject);
  });
}

module.exports = getProject;
