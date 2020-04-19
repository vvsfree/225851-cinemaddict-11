// Звание пользователя
import ProfileComponent from "./components/profile.js";
// Меню (фильтры и статистика)
import MenuComponent from "./components/menu.js";
// Сортировка
import SortComponent from "./components/sort.js";
// Секция фильмов (основной контент)
import FilmsComponent from "./components/films.js";
// Количество фильмов
import FooterStatsComponent from "./components/footer-stats.js";

// Page Controller
import PageController from "./controllers/page.js";

// Генерация объектов
import {generateProfile} from "./mock/profile.js";
import {generateFilms} from "./mock/film.js";
import {generateFilters} from "./mock/filter.js";

// Отрисовка элементов
import {render} from "./utils/render.js";

// Количество отображаемых фильмов
const FILM_COUNT = 14;

const films = generateFilms(FILM_COUNT);
const filters = generateFilters(films);
const profile = generateProfile(filters.history);

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

// Профиль (звание) пользователя в шапке сайта
render(siteHeaderElement, new ProfileComponent(profile));

// Меню сайта
render(siteMainElement, new MenuComponent(filters));

// Сортировка
render(siteMainElement, new SortComponent());

// Основной контент: списки фильмов
const filmsComponent = new FilmsComponent();
render(siteMainElement, filmsComponent);

const pageController = new PageController(filmsComponent);
pageController.render(films);

// Статистика в подвале сайта
const siteFooterStatsElement = siteFooterElement.querySelector(`.footer__statistics`);
render(siteFooterStatsElement, new FooterStatsComponent(filters.all));
