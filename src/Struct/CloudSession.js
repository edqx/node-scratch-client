const WebSocket = require("ws");
const EventEmitter = require("events");
const request = require("../request.js");

const CloudVariable = require("./CloudVariable.js");

class CloudSession extends EventEmitter {
  constructor(Client, user, project) {
    super();

    this._client = Client;


    this.user = user.username || user;
    this.projectid = project.id || project;
    this._variables = {}

    this._attemptedPackets = [];
    this._connection = null;
  }

  resolve(name) {
    if (name.startsWith("☁ ")) {
      return name;
    } else {
      return "☁ " + name;
    }
  }

  getVariable(name) {
    return this._variables[name];
  }

  setVariable(name, value) {
    this._send("set", { name, value });
  }

  _send(method,  options) {
    let opt = {
      user: this.user,
      project_id: this.projectid,
      method: method,

      ...options
    }

    if (this.connection.readyState === WebSocket.OPEN) {
      this.connection.send(JSON.stringify(opt) + "\n");
    } else {
      this.attemptedPackets.push(JSON.stringify(opt) + "\n");
    }
  }

  connect() {
    let _this = this;

    return new Promise((resolve, reject) => {
      let connection = _this.connection = new WebSocket("wss://clouddata.scratch.mit.edu/", [], {
        headers: {
          cookie: "scratchsessionsid=" + _this._client.session.sessionid + ";",
          origin: "https://scratch.mit.edu"
        }
      });

      connection.on("open", function () {
        _this._send("handshake", {});

        for (let i = 0; i < _this._attemptedPackets.length; i++) {
          connection._send(_this._attemptedPackets[i]);
        }
        _this._attemptedPackets = [];

        _this._client._debugLog("Connected to cloud servers");

        setTimeout(function () { // Leave a small amount of time to receive all variables.
          resolve();
        }, 500);
      });

      connection.on("error", reject);

      connection.on("close", function  () {
        _this.connect();
      });

      connection.on("message", function (chunks) {
        let chunksArr = chunks.split("\n");
        for (let i = 0; i < chunksArr.length; i++) {
          let chunk = chunksArr[i];
          if (!chunk) {
            continue;
          }
          let json = JSON.parse(chunk);

          _this._client._debugLog("CloudData: Received message: " + json);

          if (json.method === "set") {
            _this._variables[json.name]  = new CloudVariable(_this._client, {
              name: json.name,
              value: json.value
            }, this);

            _this.emit("set", _this._variables[json.name]);
          } else {
            _this._client._debugLog("CloudData: Method not supported: " + json.method);
          }
        }
      });
    });
  }

  stop() {
    if (this._connection) {
      this._connection.close();
    }
  }
}

module.exports = CloudSession;
