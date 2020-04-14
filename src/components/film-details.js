import {createElement} from "../utils.js";
import {getEmojis} from "../mock/emoji.js";

const createEmojiMarkup = (emoji) => {
  return (
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
    </label>`
  );
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
          <span class="film-details__comment-day">${day}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};

const createButtonMarkup = (text, name, isActive) => {
  const isChecked = isActive ? `checked` : ``;
  return (
    `<input type="checkbox" class="film-details__control-input visually-hidden" id="${name}" name="${name}" ${isChecked}>
    <label for="watchlist" class="film-details__control-label film-details__control-label--${name}">${text}</label>`
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

const createFilmDetailsTemplate = (film) => {
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
                ${generateDetailsTableRow(`Release Date`, releaseDate)}
                ${generateDetailsTableRow(`Runtime`, runtime)}
                ${generateDetailsTableRow(`Country`, country)}
                ${generateDetailsTableRow(`Genre${genres.length > 1 ? `s` : ``}`, genresMarkup)}
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            ${createButtonMarkup(`Add to watchlist`, `watchlist`, isWaiting)}
            ${createButtonMarkup(`Mark as watched`, `watched`, isWatched)}
            ${createButtonMarkup(`Mark as favorite`, `favorite`, isFavorite)}
          </section>
        </div>

        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

            <ul class="film-details__comments-list">
              ${commentsMarkup}
            </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label"></div>

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

// Emojis не динамические данные, достаточно запустить один раз во время создания модуля
const emojisMarkup = getEmojis().map(createEmojiMarkup).join(`\n`);

export default class Profile {
  constructor(film) {
    this._film = film;
    this._element = null;
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._film);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
