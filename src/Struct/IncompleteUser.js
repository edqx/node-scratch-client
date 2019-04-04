class IncompleteUser {
  constructor(raw) {
    this.id = raw.id;
    this.scratchteam = raw.scratchteam;

    this.joinedTimestamp = raw.history.joined;

    this.profile = {
      id: raw.profile.id,
      images: raw.profile.images
    }
  }
}

module.exports = IncompleteUser;
