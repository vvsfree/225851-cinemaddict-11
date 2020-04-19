// Отрисовка элементов
import {render, remove, RenderPosition} from "../utils/render.js";

// Сортировка
import SortComponent, {SortType} from "../components/sort.js";
// Секция со списками фильмов. Содержит заголовок и контейнер списка
import FilmListComponent from "../components/film-list.js";
// Карточка фильма
import FilmComponent from "../components/film.js";
// Подробная информация о фильме (попап)
import FilmDetailsComponent from "../components/film-details.js";
// Кнопка «Show more»
import ShowMoreButtonComponent from "../components/show-more-button.js";

// Данные по фильмам в категориях Top rated и Most commented
// Предполагается, что эти данные будут запрашиваться с сервера
import {getTopRatedFilms, getMostCommentedFilms} from "../mock/extra-film.js";

const SHOWING_FILM_COUNT_ON_START = 5;
const SHOWING_FILM_COUNT_BY_BUTTON = 5;

// Количество фильмов в блоках «Top rated movies» и «Most commented»
const EXTRA_FILM_COUNT = 2;

// Удаление из DOM элемента детальной информации о фильме
const removeFilmDetails = () => {
  if (visibleFilmDetailsComponent) {
    visibleFilmDetailsComponent.getElement().remove();
  }
  visibleFilmDetailsComponent = null;
  document.removeEventListener(`keydown`, escKeyDownHandler);
};

// Обработчик события нажатия клавиши Escape
const escKeyDownHandler = (evt) => {
  const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

  if (isEscKey) {
    removeFilmDetails();
  }
};

const renderFilm = (filmList, film) => {
  const filmDetailsComponent = new FilmDetailsComponent(film);
  filmDetailsComponent.setCloseBtnClickHandler(removeFilmDetails);

  const filmComponent = new FilmComponent(film);
  filmComponent.setClickHandler(() => {
    // Можно кликнуть по постеру какой-нибудь фильма, когда открыт popup с детальной информацией о другом фильме
    // В этом случае предварительно необходимо закрыть ранее открытый popup
    removeFilmDetails();

    // Popup с подробной информацией о фильме будет отрисован последним в контейнере контроллера
    render(filmList.getElement().parentElement, filmDetailsComponent);

    visibleFilmDetailsComponent = filmDetailsComponent;
    document.addEventListener(`keydown`, escKeyDownHandler);
  });

  // Отрисовка фильма
  render(filmList.getContainerComponent().getElement(), filmComponent);
};

const renderFilmCollection = (filmList, filmCollection) => {
  filmCollection.forEach((film) => {
    renderFilm(filmList, film);
  });
};

const getSortedFilms = (films, sortType) => {
  let handler;

  switch (sortType) {
    case SortType.DATE:
      handler = (a, b) => b.date - a.date;
      break;
    case SortType.RATING:
      handler = (a, b) => Number(b.rating) - Number(a.rating);
      break;
    case SortType.DEFAULT:
      handler = null;
  }

  if (handler) {
    return films.slice().sort(handler);
  }

  return films;
};


// Popup должен быть только один
let visibleFilmDetailsComponent;

export default class PageController {
  constructor(container) {
    this._container = container;

    this._sortComponent = new SortComponent();
    this._noFilmList = new FilmListComponent({title: `There are no movies in our database`});
    this._mainFilmList = new FilmListComponent({title: `All movies. Upcoming`, isTitleHidden: true});
    this._topRatedFilmList = new FilmListComponent({title: `Top rated`, hasExtraModifier: true});
    this._mostCommentedFilmList = new FilmListComponent({title: `Most commented`, hasExtraModifier: true});
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
  }

  render(films) {
    // Добавление кнопки "Show more" после списка отфильтрованных фильмов
    const renderLoadMoreButton = (source) => {
      // Если отрисовывается кнопка, которая уже есть на странице, то она не продублируется, но добавится еще один обработчик
      // Поэтому удаляем ее полностью (не только из DOM, но и сам элемент, к которому привязывается обработчик)
      if (this._showMoreButtonComponent.isElementExists()) {
        remove(this._showMoreButtonComponent);
      }

      // Отображаем кнопку по необходимости
      if (showingFilmCount >= source.length) {
        return;
      }

      render(this._mainFilmList.getElement(), this._showMoreButtonComponent);

      this._showMoreButtonComponent.setClickHandler(() => {
        const prevFilmCount = showingFilmCount;
        showingFilmCount += SHOWING_FILM_COUNT_BY_BUTTON;

        renderFilmCollection(this._mainFilmList, source.slice(prevFilmCount, showingFilmCount));

        if (showingFilmCount >= source.length) {
          remove(this._showMoreButtonComponent);
        }
      });
    };

    // Сортировка
    render(this._container.getElement(), this._sortComponent, RenderPosition.BEFORE);
    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      // Очищаем контейнер фильмов в списке фильмов
      remove(this._mainFilmList.getContainerComponent());
      const sortedFilms = getSortedFilms(films, sortType);
      showingFilmCount = SHOWING_FILM_COUNT_ON_START;
      renderFilmCollection(this._mainFilmList, sortedFilms.slice(0, showingFilmCount));
      renderLoadMoreButton(sortedFilms);
    });

    // Если фильмов нет, то показываем соответствующее сообщение
    if (films.length === 0) {
      render(this._container.getElement(), this._noFilmList);
      return;
    }

    // Все фильмы (отфильтрованные фильмы)
    render(this._container.getElement(), this._mainFilmList);

    let showingFilmCount = SHOWING_FILM_COUNT_ON_START;
    renderFilmCollection(this._mainFilmList, films.slice(0, showingFilmCount));

    renderLoadMoreButton(films);

    // Top rated фильмы
    const topRatedFilms = getTopRatedFilms(films, EXTRA_FILM_COUNT);
    render(this._container.getElement(), this._topRatedFilmList);
    renderFilmCollection(this._topRatedFilmList, topRatedFilms);

    // Most commented фильмы
    const mostCommentedFilms = getMostCommentedFilms(films, EXTRA_FILM_COUNT);
    render(this._container.getElement(), this._mostCommentedFilmList);
    renderFilmCollection(this._mostCommentedFilmList, mostCommentedFilms);
  }
}
