import API from "./api.js";
// Звание пользователя
import ProfileComponent from "./components/profile.js";
// Меню сайта (навигация)
import MenuComponent from "./components/menu.js";
// Секция фильмов (основной контент)
import FilmsComponent from "./components/films.js";
// Статистика
import StatisticsComponent from "./components/statistics.js";
// Количество фильмов
import FooterStatsComponent from "./components/footer-stats.js";

// Контроллеры
import FilterController from "./controllers/filter.js";
import PageController from "./controllers/page.js";

// Модели
import FilmsModel from "./models/films.js";
import CommentsModel from "./models/comments.js";

// Генерация объектов
// import {generateFilms} from "./mock/film.js";

// Отрисовка элементов
import {render} from "./utils/render.js";
import {MenuItemType, FilterType} from "./const.js";
import {getRating} from "./utils/common.js";
import {getFilmsByFilter} from "./utils/filter.js";

const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;
const AUTHORIZATION = `Basic 001w590ik29889a=`;

const api = new API(END_POINT, AUTHORIZATION);
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const models = {filmsModel, commentsModel};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

// Профиль (звание) пользователя в шапке сайта и статистике
const profileComponent = new ProfileComponent();
render(siteHeaderElement, profileComponent);

// Меню сайта (навигация)
const menuComponent = new MenuComponent();
render(siteMainElement, menuComponent);

// Фильтр в меню сайта
const filterController = new FilterController(menuComponent, filmsModel);
filterController.render();

// Основной контент: списки фильмов
const filmsComponent = new FilmsComponent();
render(siteMainElement, filmsComponent);

const pageController = new PageController(filmsComponent, models, api);
pageController.renderLoadingMessage();

// Секция статистики
const statisticsComponent = new StatisticsComponent(filmsModel);
render(siteMainElement, statisticsComponent);
statisticsComponent.hide();

// Статистика в подвале сайта
const siteFooterStatsElement = siteFooterElement.querySelector(`.footer__statistics`);
const footerStatsComponent = new FooterStatsComponent();
render(siteFooterStatsElement, footerStatsComponent);

// Реализуем логику переключения экранов
menuComponent.setMenuClickHandler((menuItemType) => {
  switch (menuItemType) {
    case MenuItemType.FILTER:
      pageController.show();
      pageController.resetSortType();
      statisticsComponent.hide();
      break;
    case MenuItemType.STATISTICS:
      pageController.hide();
      statisticsComponent.show();
      break;
  }
});

filmsModel.setDataChangeHandler(() => {
  const rating = getRating(getFilmsByFilter(filmsModel.getFilmsAll(), FilterType.HISTORY).length);
  profileComponent.setRating(rating);
  statisticsComponent.setRating(rating);
  footerStatsComponent.setCount(filmsModel.getFilmsAll().length);
});

// Загрузка данных с сервера
// Используем вариант от академии: загружаем сразу все. Если при загрузке комментариев произошла ошибка,
// то действуем так, как если бы не загрузились сами фильмы
api.getFilms()
  .then((films) => {
    filmsModel.setFilms(films);
    // Даем много обещаний загрузить все комментарии по всем фильмам
    return Promise.all(filmsModel.getFilmsAll().map((film) => api.getComments(film)));
  })
  .then((comments) => {
    commentsModel.setComments(comments);
  })
  .catch(() => {
    // В случае ошибки загрузки комментариев очищаем уже загруженные в модель фильмы, чтобы
    // вывести сообщение об отсутствии фильмов согласно ТЗ.
    filmsModel.setFilms([]);
  })
  .finally(() => {
    pageController.removeLoadingMessage();
    pageController.render();
  });
