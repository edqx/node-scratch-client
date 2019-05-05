const https = require("https");

function requestToScratchServers(opt, headers) {
  return new Promise((resolve, reject) => {
    let options = {
      hostname: opt.hostname || "scratch.mit.edu",
      port: 443,
      path: opt.path || "/",
      method: opt.method || "GET",
      headers: {
        "Cookie": "scratchcsrftoken=" + (opt.csrftoken || "a") + "; scratchlanguage=en;" + (opt.sessionid ? (" scratchsessionsid=\"" + opt.sessionid + "\"; ") : "") + (opt.permission ? ("permissions=" + encodeURIComponent(opt.permission)) : ""),
        "referer": "https://scratch.mit.edu",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36",
        "x-csrftoken": (opt.csrftoken || "a"),

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
          response: response,
          request: options
        });
      });
    });

    req.on("error", reject);
    if (opt.body) req.write(opt.body);
    req.end();
  });
}

module.exports = requestToScratchServers;
