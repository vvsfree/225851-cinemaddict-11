import {getFilmsByFilter} from "../utils/filter.js";
import {Period, FilterType} from "../const.js";
import {isOnePeriod} from "../utils/common.js";

export default class FilmsModel {
  constructor() {
    this._films = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  setFilms(films) {
    this._films = [];
    films.forEach((film) => {
      const _film = Object.assign({}, film, {commentsCount: film.comments.length});
      delete _film.comments;
      this._films.push(_film);
    });
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  getFilms() {
    return getFilmsByFilter(this._films, this._activeFilterType);
  }

  getFilmsAll() {
    return this._films;
  }

  getWatchedStatistics(period) {
    let measure;
    switch (period) {
      case Period.TODAY:
        measure = `days`;
        break;
      case Period.WEEK:
        measure = `weeks`;
        break;
      case Period.MONTH:
        measure = `months`;
        break;
      case Period.YEAR:
        measure = `years`;
        break;
      default:
        measure = null;
        break;
    }

    const today = new Date();
    const watchedFilms = this._films.filter((film) => {
      return film.userInfo.isWatched && isOnePeriod(film.userInfo.watchingDate, today, measure);
    });
    const totalRuntime = watchedFilms.reduce((accumulator, film) => {
      return accumulator + film.runtime;
    }, 0);
    const genres = watchedFilms.reduce((accumulator, film) => {
      film.genres.forEach((genre) => {
        if (!accumulator[genre]) {
          accumulator[genre] = 0;
        }
        accumulator[genre]++;
      });
      return accumulator;
    }, {});
    const sortedGenres = Object.entries(genres).sort((a, b) => b[1] - a[1]);
    return {watchedCount: watchedFilms.length, totalRuntime, genres: sortedGenres};
  }

  updateFilm(id, film) {
    const index = this._films.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._films = [].concat(this._films.slice(0, index), film, this._films.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
