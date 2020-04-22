import AbstractComponent from "./abstract-component.js";

const CONTROLS_CLASS_NAME = `film-card__controls-item`;

const createButtonMarkup = (text, modifier, isActive) => {
  const classNameActive = isActive ? `${CONTROLS_CLASS_NAME}--active` : ``;
  return (
    `<button class="${CONTROLS_CLASS_NAME} button ${CONTROLS_CLASS_NAME}--${modifier} ${classNameActive}">${text}</button>`
  );
};

const createFilmTemplate = (film) => {
  const {title, rating, year, runtime, genres, poster, summary, comments, userInfo: {isWaiting, isWatched, isFavorite}} = film;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${runtime}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="./images/posters/${poster}" alt="${title}" class="film-card__poster">
      <p class="film-card__description">${summary}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <form class="film-card__controls">
        ${createButtonMarkup(`Add to watchlist`, `add-to-watchlist`, isWaiting)}
        ${createButtonMarkup(`Mark as watched`, `mark-as-watched`, isWatched)}
        ${createButtonMarkup(`Mark as favorite`, `favorite`, isFavorite)}
      </form>
    </article>`
  );
};

export default class Film extends AbstractComponent {
  constructor(film) {
    super();

    this._film = film;
  }

  getTemplate() {
    return createFilmTemplate(this._film);
  }

  setClickHandler(handler) {
    const targetClasses = [`poster`, `title`, `comments`].map((it) => `.film-card__${it}`).join(`,`);

    this.getElement().querySelectorAll(targetClasses).forEach((target) => {
      target.addEventListener(`click`, handler);
    });
  }

  setWatchlistButtonClickHandler(handler) {
    this.getElement().querySelector(`.${CONTROLS_CLASS_NAME}--add-to-watchlist`)
      .addEventListener(`click`, handler);
  }

  setWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.${CONTROLS_CLASS_NAME}--mark-as-watched`)
      .addEventListener(`click`, handler);
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.${CONTROLS_CLASS_NAME}--favorite`)
      .addEventListener(`click`, handler);
  }
}
