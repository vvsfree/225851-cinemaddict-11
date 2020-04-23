// Отрисовка элементов
import {render, remove, RenderPosition} from "../utils/render.js";

import FilmController from "./film.js";

// Сортировка
import SortComponent, {SortType} from "../components/sort.js";
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

const renderFilmCollection = (filmList, filmCollection, onDataChange, onViewChange) => {
  return filmCollection.map((film) => {
    const filmController = new FilmController(filmList, onDataChange, onViewChange);
    filmController.render(film);
    return filmController;
  });
};

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
  constructor(container) {
    this._container = container;

    this._films = [];

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
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(films) {
    this._films = films;

    // Сортировка
    render(this._container.getElement(), this._sortComponent, RenderPosition.BEFORE);

    // Если фильмов нет, то показываем соответствующее сообщение
    if (films.length === 0) {
      render(this._container.getElement(), this._noFilmList);
      return;
    }

    // Все фильмы (отфильтрованные фильмы)
    render(this._container.getElement(), this._mainFilmList);

    const newFilmControllers = renderFilmCollection(
        this._mainFilmList,
        films.slice(0, this._showingFilmCount),
        this._onDataChange,
        this._onViewChange
    );
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilmControllers);

    this._renderLoadMoreButton(films);

    // Top rated фильмы
    const topRatedFilms = getTopRatedFilms(films, EXTRA_FILM_COUNT);
    render(this._container.getElement(), this._topRatedFilmList);
    this._topRatedFilmControllers = renderFilmCollection(this._topRatedFilmList, topRatedFilms, this._onDataChange, this._onViewChange);

    // Most commented фильмы
    const mostCommentedFilms = getMostCommentedFilms(films, EXTRA_FILM_COUNT);
    render(this._container.getElement(), this._mostCommentedFilmList);
    this._mostCommentedFilmControllers = renderFilmCollection(this._mostCommentedFilmList, mostCommentedFilms, this._onDataChange, this._onViewChange);
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

      const newFilmControllers = renderFilmCollection(
          this._mainFilmList,
          source.slice(prevFilmCount, this._showingFilmCount),
          this._onDataChange,
          this._onViewChange
      );
      this._showedFilmControllers = this._showedFilmControllers.concat(newFilmControllers);

      if (this._showingFilmCount >= source.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _onDataChange(oldData, newData) {
    const index = this._films.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._films = [].concat(this._films.slice(0, index), newData, this._films.slice(index + 1));

    [this._showedFilmControllers, this._topRatedFilmControllers, this._mostCommentedFilmControllers]
    .forEach((controllerGroup) => {
      controllerGroup.forEach((controller) => {
        const film = controller.filmComponent.film;
        if (film === oldData) {
          controller.render(this._films[index]);
        }
      });
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
    remove(this._mainFilmList.getContainerComponent());
    const sortedFilms = getSortedFilms(this._films, sortType);
    this._showingFilmCount = SHOWING_FILM_COUNT_ON_START;
    this._showedFilmControllers = renderFilmCollection(
        this._mainFilmList,
        sortedFilms.slice(0, this._showingFilmCount),
        this._onDataChange,
        this._onViewChange
    );
    this._renderLoadMoreButton(sortedFilms);
  }
}
