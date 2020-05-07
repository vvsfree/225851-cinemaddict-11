export default class CommentsModel {
  constructor() {
    this._comments = [];
  }

  setComments(comments) {
    this._comments = this._comments.concat(...comments);
  }

  getComments(film) {
    return this._comments.filter((comment) => comment.filmId === film.id);
  }

  getCommentsAll() {
    return this._comments;
  }

  updateComments(comments, filmId) {
    this._comments = this._comments.filter((comment) => comment.filmId !== filmId);
    this._comments = [].concat(this._comments, comments);
  }

  removeComment(id) {
    const index = this._comments.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._comments = [].concat(this._comments.slice(0, index), this._comments.slice(index + 1));

    return true;
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
