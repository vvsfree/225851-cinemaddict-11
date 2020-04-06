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
// Подробная информация о фильме (попап)
import {createFilmDetailsTemplate} from "./components/film-details.js";

// Количество отображаемых фильмов
const FILM_COUNT = 5;
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
const renderFilmCards = (container, template, filmCount) => {
  for (let i = 0; i < filmCount; i++) {
    render(container, template());
  }
};

// Шапка сайта с профилем (звание) пользователя
const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, createProfileTemplate());

// Меню сайта
const siteMainElement = document.querySelector(`.main`);
render(siteMainElement, createMenuTemplate());

// Основной контент: списки фильмов
render(siteMainElement, createContentTemplate());
const mainContentElement = siteMainElement.querySelector(`.films`);

let containerElement;

// Filtered films
containerElement = renderFilmList(mainContentElement, createFilmListTemplate(`All movies. Upcoming`, true, false));
renderFilmCards(containerElement, createFilmTemplate, FILM_COUNT);
// Top rated films
containerElement = renderFilmList(mainContentElement, createFilmListTemplate(`Top rated`, false, true));
renderFilmCards(containerElement, createFilmTemplate, EXTRA_FILM_COUNT);
// Most commented films
containerElement = renderFilmList(mainContentElement, createFilmListTemplate(`Most commented`, false, true));
renderFilmCards(containerElement, createFilmTemplate, EXTRA_FILM_COUNT);

// Добавление кнопки "Show more" после списка отфильтрованных фильмов
const filmListElement = mainContentElement.querySelector(`.films-list`);
render(filmListElement, createShowMoreButtonTemplate());

// Отрисовка дополнительной информации о фильме
const siteFooterElement = document.querySelector(`.footer`);
// Чтобы popup не закрывал весь контент, по умолчанию он скрытый
render(siteFooterElement, createFilmDetailsTemplate(true), `afterend`);
