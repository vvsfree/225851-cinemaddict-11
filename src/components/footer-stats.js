import {createElement} from "../utils.js";

const createFooterStatsTemplate = (count) => {
  return (
    `<p>${count} movies inside</p>`
  );
};

export default class FooterStats {
  constructor(count) {
    this._count = count;
    this._element = null;
  }

  getTemplate() {
    return createFooterStatsTemplate(this._count);
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
