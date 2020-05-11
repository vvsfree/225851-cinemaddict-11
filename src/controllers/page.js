// Отрисовка элементов
import {render, remove, RenderPosition} from "../utils/render.js";

import FilmController from "./film.js";

// Сортировка
import SortComponent from "../components/sort.js";
import {SortType} from "../const.js";

// Секция со списками фильмов. Содержит заголовок и контейнер списка
import FilmListComponent from "../components/film-list.js";
// Кнопка «Show more»
import ShowMoreButtonComponent from "../components/show-more-button.js";

// Данные по фильмам в категориях Top rated и Most commented
// Предполагается, что эти данные будут запрашиваться с сервера
import {getTopRatedFilms, getMostCommentedFilms} from "../models/extra-film.js";

const SHOWING_FILM_COUNT_ON_START = 5;
const SHOWING_FILM_COUNT_BY_BUTTON = 5;

// Количество фильмов в блоках «Top rated movies» и «Most commented»
const EXTRA_FILM_COUNT = 2;

const getSortedFilms = (films, sortType) => {
  let comparator;

  switch (sortType) {
    case SortType.DATE:
      comparator = (a, b) => b.releaseDate - a.releaseDate;
      break;
    case SortType.RATING:
      comparator = (a, b) => Number(b.rating) - Number(a.rating);
      break;
    case SortType.DEFAULT:
      comparator = null;
  }

  if (comparator) {
    return films.slice().sort(comparator);
  }

  return films;
};


export default class PageController {
  constructor(container, models, api) {
    this._container = container;
    this._models = models;
    this._filmsModel = models.filmsModel;
    this._api = api;

    this._showedFilmControllers = [];
    this._topRatedFilmControllers = [];
    this._mostCommentedFilmControllers = [];

    this._showingFilmCount = SHOWING_FILM_COUNT_ON_START;

    this._sortComponent = new SortComponent();
    this._loadingFilmList = new FilmListComponent({title: `Loading...`});
    this._noFilmList = new FilmListComponent({title: `There are no movies in our database`});
    this._mainFilmList = new FilmListComponent({title: `All movies. Upcoming`, isTitleHidden: true});
    this._topRatedFilmList = new FilmListComponent({title: `Top rated`, hasExtraModifier: true});
    this._mostCommentedFilmList = new FilmListComponent({title: `Most commented`, hasExtraModifier: true});
    this._showMoreButtonComponent = new ShowMoreButtonComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onModelUpdate = this._onModelUpdate.bind(this);

    this._sortComponent.setSortTypeClickHandler(this._onSortTypeChange);
    this._filmsModel.setFilterChangeHandler(this._onFilterChange);

    this._filmsModel.setModelUpdateHandler(this._onModelUpdate);
  }

  hide() {
    this._container.hide();
    this._sortComponent.hide();
  }

  show() {
    this._container.show();
    this._sortComponent.show();
  }

  // Заглушка на время загрузки фильмов
  renderLoadingMessage() {
    render(this._container.getElement(), this._loadingFilmList);
  }

  removeLoadingMessage() {
    remove(this._loadingFilmList);
  }

  render() {
    // Сортировка
    render(this._container.getElement(), this._sortComponent, RenderPosition.BEFORE);

    const films = this._filmsModel.getFilms();
    // Если фильмов нет, то показываем соответствующее сообщение
    if (films.length === 0) {
      render(this._container.getElement(), this._noFilmList);
      return;
    }

    // Все фильмы (отфильтрованные фильмы)
    render(this._container.getElement(), this._mainFilmList);
    this._renderFilms(films.slice(0, this._showingFilmCount));
    this._renderLoadMoreButton(films);

    // Top rated фильмы
    const topRatedFilms = getTopRatedFilms(films, EXTRA_FILM_COUNT);
    render(this._container.getElement(), this._topRatedFilmList);
    this._topRatedFilmControllers = this._renderFilmCollection(this._topRatedFilmList, topRatedFilms);

    // Most commented фильмы
    const mostCommentedFilms = getMostCommentedFilms(films, EXTRA_FILM_COUNT);
    render(this._container.getElement(), this._mostCommentedFilmList);
    this._mostCommentedFilmControllers = this._renderFilmCollection(this._mostCommentedFilmList, mostCommentedFilms);
  }

  resetSortType() {
    if (this._sortComponent.setSortType(SortType.DEFAULT)) {
      this._onSortTypeChange(SortType.DEFAULT);
    }
  }

  _renderFilmCollection(filmList, filmCollection) {
    return filmCollection.map((film) => {
      const filmController = new FilmController(filmList, this._models, this._api, this._onDataChange, this._onViewChange);
      filmController.render(film);
      return filmController;
    });
  }

  // Добавление кнопки "Show more" после списка отфильтрованных фильмов
  _renderLoadMoreButton(source) {
    // Если отрисовывается кнопка, которая уже есть на странице, то она не продублируется, но добавится еще один обработчик
    // Поэтому удаляем ее полностью (не только из DOM, но и сам элемент, к которому привязывается обработчик)
    if (this._showMoreButtonComponent.isElementCreated()) {
      remove(this._showMoreButtonComponent);
    }

    // Отображаем кнопку по необходимости
    if (this._showingFilmCount >= source.length) {
      return;
    }

    render(this._mainFilmList.getElement(), this._showMoreButtonComponent);

    this._showMoreButtonComponent.setClickHandler(() => {
      const prevFilmCount = this._showingFilmCount;
      this._showingFilmCount += SHOWING_FILM_COUNT_BY_BUTTON;

      this._renderFilms(source.slice(prevFilmCount, this._showingFilmCount));

      if (this._showingFilmCount >= source.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _removeFilms() {
    this._showedFilmControllers.forEach((controller) => controller.destroy());
    this._showedFilmControllers = [];
  }

  _renderFilms(films) {
    const newFilmControllers = this._renderFilmCollection(this._mainFilmList, films);
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilmControllers);

    this._showingFilmCount = this._showedFilmControllers.length;
  }

  _rerenderFilms(count) {
    this._removeFilms();
    const films = this._filmsModel.getFilms();
    this._renderFilms(films.slice(0, count));
    this._renderLoadMoreButton(films);
  }

  _onModelUpdate(oldData, filmModel) {
    [this._showedFilmControllers, this._topRatedFilmControllers, this._mostCommentedFilmControllers]
    .forEach((controllerGroup) => {
      controllerGroup.forEach((controller) => {
        const film = controller.filmComponent.film;
        if (film === oldData) {
          controller.render(filmModel);
        }
      });
    });
  }

  _onDataChange(oldData, newData) {
    this._api.updateFilm(oldData.id, newData)
      .then((filmModel) => {
        this._filmsModel.updateFilm(oldData.id, filmModel);
      });
  }

  _onViewChange() {
    [this._showedFilmControllers, this._topRatedFilmControllers, this._mostCommentedFilmControllers]
      .forEach((controllerGroup) => {
        controllerGroup.forEach((controller) => controller.setDefaultView());
      });
  }

  _onSortTypeChange(sortType) {
    // Очищаем контейнер фильмов в списке фильмов
    this._removeFilms();
    const sortedFilms = getSortedFilms(this._filmsModel.getFilms(), sortType);
    this._showingFilmCount = SHOWING_FILM_COUNT_ON_START;
    this._renderFilms(sortedFilms.slice(0, this._showingFilmCount));
    this._renderLoadMoreButton(sortedFilms);
  }

  _onFilterChange() {
    this._sortComponent.setSortType(SortType.DEFAULT);
    this._rerenderFilms(SHOWING_FILM_COUNT_ON_START);
  }
}
