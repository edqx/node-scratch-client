const http = require("http");

class ScratchAsset {
  constructor (Client, raw) {
    this._client = Client;

    this.assetid = raw.assetId;
    this.name = raw.name;
    this.dataFormat = raw.dataFormat;
    this.md5 = raw.md5ext;
    this.src = "http://assets.scratch.mit.edu/internalapi/asset/" + this.md5 + "/get/";
  }

  download() {
    let _this = this;

    return new Promise((resolve, reject) => {
      http.get(_this.src, function (response) {
        resolve(response);
      });
    });
  }
}

module.exports = ScratchAsset;
