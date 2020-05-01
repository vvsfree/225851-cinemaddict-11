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
import {getTopRatedFilms, getMostCommentedFilms} from "../mock/extra-film.js";

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
  constructor(container, models) {
    this._container = container;
    this._filmsModel = models.filmsModel;
    this._commentsModel = models.commentsModel;

    this._showedFilmControllers = [];
    this._topRatedFilmControllers = [];
    this._mostCommentedFilmControllers = [];

    this._showingFilmCount = SHOWING_FILM_COUNT_ON_START;

    this._sortComponent = new SortComponent();
    this._noFilmList = new FilmListComponent({title: `There are no movies in our database`});
    this._mainFilmList = new FilmListComponent({title: `All movies. Upcoming`, isTitleHidden: true});
    this._topRatedFilmList = new FilmListComponent({title: `Top rated`, hasExtraModifier: true});
    this._mostCommentedFilmList = new FilmListComponent({title: `Most commented`, hasExtraModifier: true});
    this._showMoreButtonComponent = new ShowMoreButtonComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._filmsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const films = this._filmsModel.getFilms();

    // Сортировка
    render(this._container.getElement(), this._sortComponent, RenderPosition.BEFORE);

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

  _renderFilmCollection(filmList, filmCollection) {
    return filmCollection.map((film) => {
      const filmController = new FilmController(filmList, this._commentsModel, this._onDataChange, this._onViewChange);
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

  _updateFilms(count) {
    this._removeFilms();
    const films = this._filmsModel.getFilms();
    this._renderFilms(films.slice(0, count));
    this._renderLoadMoreButton(films);
  }

  _onDataChange(oldData, newData) {
    const isSuccess = this._filmsModel.updateFilm(oldData.id, newData);
    if (isSuccess) {
      [this._showedFilmControllers, this._topRatedFilmControllers, this._mostCommentedFilmControllers]
      .forEach((controllerGroup) => {
        controllerGroup.forEach((controller) => {
          const film = controller.filmComponent.film;
          if (film === oldData) {
            controller.render(newData);
          }
        });
      });
    }
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
    this._updateFilms(SHOWING_FILM_COUNT_ON_START);
  }
}
