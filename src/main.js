// Звание пользователя
import ProfileComponent from "./components/profile.js";
// Меню (фильтры и статистика)
import MenuComponent from "./components/menu.js";
// Сортировка
import SortComponent from "./components/sort.js";
// Секция фильмов (основной контент)
import FilmsComponent from "./components/films.js";
// Секция со списками фильмов. Содержит заголовок и контейнер списка
import FilmListComponent from "./components/film-list.js";
// Карточка фильма
import FilmComponent from "./components/film.js";
// Подробная информация о фильме (попап)
import FilmDetailsComponent from "./components/film-details.js";
// Кнопка «Show more»
import ShowMoreButtonComponent from "./components/show-more-button.js";
// Количество фильмов
import FooterStatsComponent from "./components/footer-stats.js";

// Генерация объектов
import {generateProfile} from "./mock/profile.js";
import {generateFilms} from "./mock/film.js";
import {generateFilters} from "./mock/filter.js";
// Данные по фильмам в категориях Top rated и Most commented
import {getTopRatedFilms, getMostCommentedFilms} from "./mock/extra-film.js";

// Отрисовка элементов
import {render, RenderPosition} from "./utils.js";

// Количество отображаемых фильмов
const FILM_COUNT = 14;
const SHOWING_FILM_COUNT_ON_START = 5;
const SHOWING_FILM_COUNT_BY_BUTTON = 5;

// Количество фильмов в блоках «Top rated movies» и «Most commented»
const EXTRA_FILM_COUNT = 2;

// Удаление из DOM элемента соответствующего переданному компоненту
const removeComponent = (component) => {
  if (component) {
    component.getElement().remove();
  }
};

// Удаление из DOM элемента детальной информации по фильме
const removeFilmDetailsComponent = () => {
  removeComponent(visibleFilmDetailsComponent);
  visibleFilmDetailsComponent = null;
  document.removeEventListener(`keydown`, escKeyDownHandler);
};

// Обработчик события нажатия клавиши Escape
const escKeyDownHandler = (evt) => {
  const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

  if (isEscKey) {
    removeFilmDetailsComponent();
  }
};

const renderFilm = (container, film) => {
  const filmDetailsComponent = new FilmDetailsComponent(film);
  const filmDetailsCloseBtn = filmDetailsComponent.getElement().querySelector(`.film-details__close-btn`);
  filmDetailsCloseBtn.addEventListener(`click`, () => {
    removeFilmDetailsComponent();
  });

  const filmComponent = new FilmComponent(film);
  const filmElement = filmComponent.getElement();
  const targetClasses = [`poster`, `title`, `comments`].map((it) => `.film-card__${it}`).join(`,`);

  filmElement.querySelectorAll(targetClasses).forEach((target) => {
    target.addEventListener(`click`, () => {
      removeComponent(visibleFilmDetailsComponent);
      render(siteFooterElement, filmDetailsComponent.getElement(), RenderPosition.AFTER);
      visibleFilmDetailsComponent = filmDetailsComponent;
      document.addEventListener(`keydown`, escKeyDownHandler);
    });
  });

  render(container, filmComponent.getElement());
};

const renderFilmCollection = (filmList, filmCollection) => {
  filmCollection.forEach((film) => {
    renderFilm(filmList.getContainerElement(), film);
  });
};

const renderFilms = () => {
  const filmsComponent = new FilmsComponent();
  render(siteMainElement, filmsComponent.getElement());

  if (films.length === 0) {
    const noFilmList = new FilmListComponent({title: `There are no movies in our database`});
    render(filmsComponent.getElement(), noFilmList.getElement());
    return;
  }

  // Все фильмы (отфильтрованные фильмы)
  const mainFilmList = new FilmListComponent({title: `All movies. Upcoming`, isTitleHidden: true});
  render(filmsComponent.getElement(), mainFilmList.getElement());

  let showingFilmCount = SHOWING_FILM_COUNT_ON_START;
  renderFilmCollection(mainFilmList, films.slice(0, showingFilmCount));

  // Добавление кнопки "Show more" после списка отфильтрованных фильмов
  const showMoreButtonComponent = new ShowMoreButtonComponent();
  showMoreButtonComponent.getElement().addEventListener(`click`, () => {
    const prevFilmCount = showingFilmCount;
    showingFilmCount += SHOWING_FILM_COUNT_BY_BUTTON;

    renderFilmCollection(mainFilmList, films.slice(prevFilmCount, showingFilmCount));

    if (showingFilmCount >= films.length) {
      removeComponent(showMoreButtonComponent);
    }
  });
  // Отображаем кнопку по необходимости
  if (showingFilmCount < films.length) {
    render(mainFilmList.getElement(), showMoreButtonComponent.getElement());
  }

  // Top rated фильмы
  const topRatedFilms = getTopRatedFilms(films, EXTRA_FILM_COUNT);
  const topRatedFilmList = new FilmListComponent({title: `Top rated`, hasExtraModifier: true});
  render(filmsComponent.getElement(), topRatedFilmList.getElement());
  renderFilmCollection(topRatedFilmList, topRatedFilms);

  // Most commented фильмы
  const mostCommentedFilms = getMostCommentedFilms(films, EXTRA_FILM_COUNT);
  const mostCommentedFilmList = new FilmListComponent({title: `Most commented`, hasExtraModifier: true});
  render(filmsComponent.getElement(), mostCommentedFilmList.getElement());
  renderFilmCollection(mostCommentedFilmList, mostCommentedFilms);
};

const films = generateFilms(FILM_COUNT);
const filters = generateFilters(films);
const profile = generateProfile(filters.history);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

// Popup должен быть только один
let visibleFilmDetailsComponent;

// Профиль (звание) пользователя в шапке сайта
render(siteHeaderElement, new ProfileComponent(profile).getElement());

// Меню сайта
render(siteMainElement, new MenuComponent(filters).getElement());

// Сортировка
render(siteMainElement, new SortComponent().getElement());

// Основной контент: списки фильмов
renderFilms();

// Статистика в подвале сайта
const siteFooterStatsElement = siteFooterElement.querySelector(`.footer__statistics`);
render(siteFooterStatsElement, new FooterStatsComponent(filters.all).getElement());
