import AbstractSmartComponent from "./abstract-smart-component.js";
import {EMOJIS} from "../const.js";
import {formatDate, formatCommentDateAsHuman, getDuration} from "../utils/common.js";

const createEmojiImgMarkup = (emoji, size = 30) => {
  return emoji ? `<img src="./images/emoji/${emoji}.png" width="${size}" height="${size}" alt="emoji-${emoji}">` : ``;
};

const createEmojiMarkup = (emoji, chosenEmoji) => {
  const emojiImgMarkup = createEmojiImgMarkup(emoji);
  const checked = emoji === chosenEmoji ? `checked` : ``;
  return (
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${checked}>
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      ${emojiImgMarkup}
    </label>`
  );
};

const createEmojisMarkup = (chosenEmoji) => {
  return EMOJIS.map((emoji) => {
    return createEmojiMarkup(emoji, chosenEmoji);
  }).join(`\n`);
};

const createCommentMarkup = (comment) => {
  const {emoji, text, author, day} = comment;
  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${formatCommentDateAsHuman(day)}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};

const createCheckboxControlMarkup = (text, name, isActive) => {
  const isChecked = isActive ? `checked` : ``;
  return (
    `<input type="checkbox" class="film-details__control-input visually-hidden" id="${name}" name="${name}" ${isChecked}>
    <label for="${name}" class="film-details__control-label film-details__control-label--${name}">${text}</label>`
  );
};

const generateDetailsTableRow = (key, value) => {
  return (
    `<tr class="film-details__row">
      <td class="film-details__term">${key}</td>
      <td class="film-details__cell">${value}</td>
    </tr>`
  );
};

const createGenreMarkup = (genre) => {
  return `<span class="film-details__genre">${genre}</span>`;
};

const createFilmDetailsTemplate = (film, chosenEmoji) => {
  const {
    largePoster,
    title,
    originalTitle,
    rating,
    ageRating,
    director,
    writers,
    actors,
    releaseDate,
    runtime,
    country,
    genres,
    description,
    comments,
    userInfo: {isWaiting, isWatched, isFavorite}
  } = film;

  const genresMarkup = genres.map(createGenreMarkup).join(`\n`);
  const commentsMarkup = comments.map(createCommentMarkup).join(`\n`);

  const chosenEmojiImgMarkup = createEmojiImgMarkup(chosenEmoji, 55);
  const emojisMarkup = createEmojisMarkup(chosenEmoji);

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./images/posters/${largePoster}" alt="">

              <p class="film-details__age">${ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">${originalTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                ${generateDetailsTableRow(`Director`, director)}
                ${generateDetailsTableRow(`Writers`, writers.join(`, `))}
                ${generateDetailsTableRow(`Actors`, actors.join(`, `))}
                ${generateDetailsTableRow(`Release Date`, formatDate(releaseDate))}
                ${generateDetailsTableRow(`Runtime`, getDuration(runtime))}
                ${generateDetailsTableRow(`Country`, country)}
                ${generateDetailsTableRow(`Genre${genres.length > 1 ? `s` : ``}`, genresMarkup)}
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            ${createCheckboxControlMarkup(`Add to watchlist`, `watchlist`, isWaiting)}
            ${createCheckboxControlMarkup(`Mark as watched`, `watched`, isWatched)}
            ${createCheckboxControlMarkup(`Mark as favorite`, `favorite`, isFavorite)}
          </section>
        </div>

        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

            <ul class="film-details__comments-list">
              ${commentsMarkup}
            </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label">
                ${chosenEmojiImgMarkup}
              </div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                ${emojisMarkup}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class FilmDetails extends AbstractSmartComponent {
  constructor(film) {
    super();

    this._film = film;
    this._closeBtnClickHandler = null;
    this._watchlistInputChangeHandler = null;
    this._watchedInputChangeHandler = null;
    this._favoriteInputChangeHandler = null;

    this._emoji = null;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._film, this._emoji);
  }

  recoveryListeners() {
    this.setCloseBtnClickHandler(this._closeBtnClickHandler);
    this.setWatchlistInputChangeHandler(this._watchlistInputChangeHandler);
    this.setWatchedInputChangeHandler(this._watchedInputChangeHandler);
    this.setFavoriteInputChangeHandler(this._favoriteInputChangeHandler);
    this._subscribeOnEvents();
  }

  setCloseBtnClickHandler(handler) {
    const filmDetailsCloseBtn = this.getElement().querySelector(`.film-details__close-btn`);
    filmDetailsCloseBtn.addEventListener(`click`, handler);
    this._closeBtnClickHandler = handler;
  }

  setWatchlistInputChangeHandler(handler) {
    this.getElement().querySelector(`#watchlist`).addEventListener(`change`, handler);
    this._watchlistInputChangeHandler = handler;
  }

  setWatchedInputChangeHandler(handler) {
    this.getElement().querySelector(`#watched`).addEventListener(`change`, handler);
    this._watchedInputChangeHandler = handler;
  }

  setFavoriteInputChangeHandler(handler) {
    this.getElement().querySelector(`#favorite`).addEventListener(`change`, handler);
    this._favoriteInputChangeHandler = handler;
  }

  _subscribeOnEvents() {
    this.getElement().querySelectorAll(`.film-details__emoji-item`)
      .forEach((element) => {
        element.addEventListener(`change`, (evt) => {
          this._emoji = evt.target.value;
          this.rerender();
        });
      });
  }
}
