import AbstractComponent from "./abstract-component.js";

const createFooterStatsTemplate = (count) => {
  return (
    `<p>${count} movies inside</p>`
  );
};

export default class FooterStats extends AbstractComponent {
  constructor(count) {
    super();

    this._count = count;
  }

  getTemplate() {
    return createFooterStatsTemplate(this._count);
  }
}
