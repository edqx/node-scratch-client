const https = require("https");

function requestToScratchServers(opt, headers) {
  return new Promise((resolve, reject) => {
    let options = {
      hostname: opt.hostname || "scratch.mit.edu",
      port: 443,
      path: opt.path || "/",
      method: opt.method || "GET",
      headers: {
        "Cookie": "scratchcsrftoken=a; scratchlanguage=en;" + (opt.sessionid ? (" scratchsessionsid=\"" + opt.sessionid + "\"") : ""),
        "X-CSRFToken": "a",
        "referer": "https://scratch.mit.edu",

        ...headers
      },
    }

    if (opt.body) {
      options.headers["Content-Length"] = Buffer.byteLength(opt.body);
    }

    let req = https.request(options, function (response) {
      let res = [];

      response.on("data", function (data) {
        res.push(data);
      });

      response.on("end", function () {
        let buf = Buffer.concat(res).toString();

        resolve({
          body: buf,
          response: response
        });
      });
    });

    req.on("error", reject);
    if (opt.body) req.write(opt.body);
    req.end();
  });
}

module.exports = requestToScratchServers;
