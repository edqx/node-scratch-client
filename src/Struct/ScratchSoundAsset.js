let ScratchAsset = require("./ScratchAsset");

class ScatchSoundAsset extends ScratchAsset {
  constructor (Client, raw) {
    super(Client, raw);

    this.rate = raw.rate;
    this.sampleCount = raw.sampleCount;
  }
}

module.exports = ScratchAsset;
