// Отрисовка элементов
import {render, remove} from "../utils/render.js";

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

// Popup должен быть только один
let visibleFilmDetailsComponent;

export default class PageController {
  constructor(container) {
    this._container = container;

    this._noFilmList = new FilmListComponent({title: `There are no movies in our database`});
    this._mainFilmList = new FilmListComponent({title: `All movies. Upcoming`, isTitleHidden: true});
    this._topRatedFilmList = new FilmListComponent({title: `Top rated`, hasExtraModifier: true});
    this._mostCommentedFilmList = new FilmListComponent({title: `Most commented`, hasExtraModifier: true});
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
  }

  render(films) {
    if (films.length === 0) {
      render(this._container.getElement(), this._noFilmList);
      return;
    }

    // Все фильмы (отфильтрованные фильмы)
    render(this._container.getElement(), this._mainFilmList);

    let showingFilmCount = SHOWING_FILM_COUNT_ON_START;
    renderFilmCollection(this._mainFilmList, films.slice(0, showingFilmCount));

    // Добавление кнопки "Show more" после списка отфильтрованных фильмов
    // Отображаем кнопку по необходимости
    if (showingFilmCount < films.length) {
      render(this._mainFilmList.getElement(), this._showMoreButtonComponent);

      this._showMoreButtonComponent.setClickHandler(() => {
        const prevFilmCount = showingFilmCount;
        showingFilmCount += SHOWING_FILM_COUNT_BY_BUTTON;

        renderFilmCollection(this._mainFilmList, films.slice(prevFilmCount, showingFilmCount));

        if (showingFilmCount >= films.length) {
          remove(this._showMoreButtonComponent);
        }
      });
    }

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
