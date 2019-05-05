class StudioComment {
  constructor(Client, studio, id, username) {
    this._client = Client;

    this.studio = studio;
    this.id = Number(id);
    this.username = username;
  }

  reply(content) {
    return new Promise((resolve, reject) => {
      this._client.getUser(this.username).then(user => {
        this.studio.postComment(content, this.id, user.id)
          .then(resolve)
          .catch(reject);
      }).catch(reject);
    });
  }
}

module.exports = StudioComment;
