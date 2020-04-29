export default class Commens {
  constructor() {
    this._comments = [];
  }

  setCommens(comments) {
    this._comments = Array.from(comments);
  }

  getCommens() {
    return this._comments;
  }

  getCommensAll() {
    return this._comments;
  }
}
