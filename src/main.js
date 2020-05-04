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
import {generateProfile} from "./mock/profile.js";
import {generateFilms} from "./mock/film.js";
import {generateFilters} from "./mock/filter.js";

// Отрисовка элементов
import {render} from "./utils/render.js";
import {MenuItemType} from "./const.js";

// Количество отображаемых фильмов
const FILM_COUNT = 30;

const films = generateFilms(FILM_COUNT);
const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const commentsModel = new CommentsModel();
commentsModel.setComments(films);
const models = {filmsModel, commentsModel};

const filters = generateFilters(filmsModel.getFilmsAll());
const profile = generateProfile(filters.history);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

// Профиль (звание) пользователя в шапке сайта
render(siteHeaderElement, new ProfileComponent(profile));

// Меню сайта (навигация)
const menuComponent = new MenuComponent();
render(siteMainElement, menuComponent);

// Фильтр в меню сайта
const filterController = new FilterController(menuComponent, filmsModel);
filterController.render();

// Основной контент: списки фильмов
const filmsComponent = new FilmsComponent();
render(siteMainElement, filmsComponent);

const pageController = new PageController(filmsComponent, models);
pageController.render();

// Секция статистики
const statisticsComponent = new StatisticsComponent(filmsModel);
render(siteMainElement, statisticsComponent);
statisticsComponent.hide();

// Реализуем логику переключения экранов
menuComponent.setMenuClickHandler((menuItemType) => {
  if (menuItemType === MenuItemType.FILTER) {
    pageController.show();
    pageController.resetSortType();
    statisticsComponent.hide();
  } else {
    pageController.hide();
    statisticsComponent.show();
  }
});

// Статистика в подвале сайта
const siteFooterStatsElement = siteFooterElement.querySelector(`.footer__statistics`);
render(siteFooterStatsElement, new FooterStatsComponent(filmsModel.getFilmsAll().length));
