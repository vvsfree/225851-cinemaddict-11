// Звание пользователя
import {createProfileTemplate} from "./components/profile.js";
// Меню (фильтры и статистика)
import {createMenuTemplate} from "./components/menu.js";
// Контент
import {createContentTemplate} from "./components/content.js";
// Секция со списками фильмов. Содержит заголовок и контейнер списка
import {createFilmListTemplate} from "./components/film-list.js";
// Карточка фильма
import {createFilmTemplate} from "./components/film.js";
// Кнопка «Show more»
import {createShowMoreButtonTemplate} from "./components/show-more-button.js";
// Количество фильмов
import {createFooterStatisticsTemplate} from "./components/footer.js";
// Подробная информация о фильме (попап)
import {createFilmDetailsTemplate} from "./components/film-details.js";

// Генерация объектов
import {generateProfile} from "./mock/profile.js";
import {generateFilms} from "./mock/film.js";
import {generateFilters} from "./mock/filter.js";

// Количество отображаемых фильмов
const FILM_COUNT = 30;
const SHOWING_FILM_COUNT_ON_START = 5;
const SHOWING_FILM_COUNT_BY_BUTTON = 5;

// Количество фильмов в блоках «Top rated movies» и «Most commented»
const EXTRA_FILM_COUNT = 2;

// Отрисовка (вставка в DOM) компонентов
const render = (container, text, place = `beforeend`) => {
  container.insertAdjacentHTML(place, text);
};

// Отрисовка секции списка фильмов
// Возвращает контейнер (в секции) в который можно добавлять карточки фильмов
const renderFilmList = (container, text) => {
  render(container, text);
  return container.querySelector(`.films-list:last-child > .films-list__container`);
};

// Отрисовка карточек фильмов в контейнере
const renderFilmCards = (container, data) => {
  data.forEach((item) => {
    render(container, createFilmTemplate(item));
  });
};

const showMoreButtonClickHandler = (evt) => {
  const prevFilmCount = showingFilmCount;
  showingFilmCount += SHOWING_FILM_COUNT_BY_BUTTON;

  renderFilmCards(filmListContainerElement, films.slice(prevFilmCount, showingFilmCount));

  if (showingFilmCount >= films.length) {
    evt.target.remove();
  }
};

const films = generateFilms(FILM_COUNT);
const filters = generateFilters(films);
const profile = generateProfile(filters.history);

// Шапка сайта с профилем (званием) пользователя
const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, createProfileTemplate(profile));

// Меню сайта
const siteMainElement = document.querySelector(`.main`);
render(siteMainElement, createMenuTemplate(filters));

// Основной контент: списки фильмов
render(siteMainElement, createContentTemplate());
const mainContentElement = siteMainElement.querySelector(`.films`);

// Filtered films
let showingFilmCount = SHOWING_FILM_COUNT_ON_START;
const filmListContainerElement = renderFilmList(mainContentElement, createFilmListTemplate(`All movies. Upcoming`, true, false));
renderFilmCards(filmListContainerElement, films.slice(0, showingFilmCount));

let extraFilmListContainerElement;

// Top rated films
const topRatedFilms = generateFilms(EXTRA_FILM_COUNT);
extraFilmListContainerElement = renderFilmList(mainContentElement, createFilmListTemplate(`Top rated`, false, true));
renderFilmCards(extraFilmListContainerElement, topRatedFilms);

// Most commented films
const mostCommentedFilms = generateFilms(EXTRA_FILM_COUNT);
extraFilmListContainerElement = renderFilmList(mainContentElement, createFilmListTemplate(`Most commented`, false, true));
renderFilmCards(extraFilmListContainerElement, mostCommentedFilms);

// Добавление кнопки "Show more" после списка отфильтрованных фильмов
const filmListElement = mainContentElement.querySelector(`.films-list`);

if (showingFilmCount < films.length) {
  render(filmListElement, createShowMoreButtonTemplate());
  const showMoreButton = filmListElement.querySelector(`.films-list__show-more`);
  showMoreButton.addEventListener(`click`, showMoreButtonClickHandler);
}

// Статистика в подвале
const siteFooterElement = document.querySelector(`.footer`);
render(siteFooterElement, createFooterStatisticsTemplate(filters.all));

// Дополнительная информация о фильме
// Чтобы popup не закрывал весь контент, по умолчанию он скрытый
render(siteFooterElement, createFilmDetailsTemplate(films[0], true), `afterend`);
