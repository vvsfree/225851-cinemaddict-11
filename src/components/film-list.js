import {createElement} from "../utils.js";

const createFilmListTemplate = (title, isExtra) => {
  const visuallyHidden = isExtra ? `` : `visually-hidden`;
  const extraModifier = isExtra ? `films-list--extra` : ``;
  return (
    `<section class="films-list ${extraModifier}">
      <h2 class="films-list__title ${visuallyHidden}">${title}</h2>
      <div class="films-list__container">
      </div>
    </section>`
  );
};

export default class FilmList {
  constructor(title, isExtra) {
    this._title = title;
    this._isExtra = isExtra;

    this._element = null;
  }

  getTemplate() {
    return createFilmListTemplate(this._title, this._isExtra);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getContainerElement() {
    return this.getElement().children[1];
  }

  removeElement() {
    this._element = null;
  }
}
