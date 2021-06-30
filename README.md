# node-scratch-client

This package is a nodejs promise-based client to connect with the Scratch web and cloud servers. This package is based off https://github.com/trumank/scratch-api which the developer has discontinued.

# Installation

In the folder you want to use the client in, clone the repository:
```bash
git clone https://github.com/qucchia/node-scratch-client/
```

Once that's done, you can import the module using `require("./node-scratch-client/index.js")`.

# Examples

Full project manipulation:
```js
const scratch = require("./node-scratch-client/index.js");

// Initiate client
const Client = new scratch.Client({
  username: "griffpatch",
  password: "SecurePassword1"
});

// Login
Client.login().then(() => {
  // Fetch project information
  Client.getProject(10128407).then(project => {
    project.postComment("Turning off comments..");

    project.turnOffCommenting();
  });
});
```

Cloud server connection:
```js
const scratch = require("./node-scratch-client/index.js");

const Client = new scratch.Client({
  username: "ceebeee",
  password: "SecurePassword2"
});

Client.login().then(() => {
  let cloud = Client.session.createCloudSession(281983597);

  cloud.connect().then(() => {
    cloud.on("set", variable => {
      console.log("Variable changed to " + variable.value);
    });
  });
});
```
