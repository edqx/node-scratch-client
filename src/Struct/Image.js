const https = require("https");

class Image {
  constructor(Client, raw) {
    this.src = raw;
  }

  download() {
    let _this = this;

    return new Promise((resolve, reject) => {
      https.get(_this.src, function (response) {
        resolve(response);
      });
    });
  }
}

module.exports = Image;
