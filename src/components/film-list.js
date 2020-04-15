import {createElement} from "../utils.js";

const createFilmListTemplate = (config) => {
  const {title, isTitleHidden = false, hasExtraModifier = false} = config;

  const visuallyHidden = isTitleHidden ? `visually-hidden` : ``;
  const extraModifier = hasExtraModifier ? `films-list--extra` : ``;
  return (
    `<section class="films-list ${extraModifier}">
      <h2 class="films-list__title ${visuallyHidden}">${title}</h2>
    </section>`
  );
};

export default class FilmList {
  constructor(config) {
    this._config = config;
    this._element = null;
    this._innerContainerElement = null;
  }

  getTemplate() {
    return createFilmListTemplate(this._config);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getContainerElement() {
    if (!this._innerContainerElement) {
      this._innerContainerElement = createElement(`<div class="films-list__container"></div>`);
      this.getElement().append(this._innerContainerElement);
    }

    return this._innerContainerElement;
  }

  removeElement() {
    this._element = null;
  }
}
