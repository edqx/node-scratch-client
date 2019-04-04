class Studio {
  constructor(raw) {
    this.id = raw.id;
    this.title = raw.title;
    this.owner = raw.owner;
    this.description = raw.description;
    this.image = raw.image;

    this.createdTimestamp = raw.history.created;
    this.modifiedTimestamp = raw.history.modified;

    this.followerCount = raw.stats.followers;
  }
}

module.exports = Studio;
