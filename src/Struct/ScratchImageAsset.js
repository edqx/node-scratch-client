let ScratchAsset = require("./ScratchAsset");

class ScatchImageAsset extends ScratchAsset {
  constructor (Client, raw) {
    super(Client, raw);

    this.bitmapResolution = raw.bitmapResolution;
    this.rotationCenterX = raw.rotationCenterX;
    this.rotationCenterY = raw.rotationCenterY;
  }
}

module.exports = ScratchAsset;
