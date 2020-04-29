import AbstractComponent from "./abstract-component.js";
import {FilterType} from "../const.js";

const CLASS_NAME = `main-navigation__item`;
const ACTIVE_CLASS_NAME = `${CLASS_NAME}--active`;

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const createFilterMarkup = (filter, options = {}) => {
  const {name, count, isActive} = filter;
  const {fullName = capitalize(name), hasCount = true} = options;
  const active = isActive ? ACTIVE_CLASS_NAME : ``;
  return (
    `<a href="#${name}" data-filter-type="${name}" class="${CLASS_NAME} ${active}">${fullName}
      ${hasCount ? `<span class="${CLASS_NAME}-count">${count}</span>` : ``}
    </a>`
  );
};

const createFilterTemplate = (filters) => {
  const filtersMarkup = filters.filter((it) => it.name !== FilterType.ALL).map((it) => createFilterMarkup(it)).join(`\n`);
  const allFilter = filters.find((it) => it.name === FilterType.ALL);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${createFilterMarkup(allFilter, {fullName: `All movies`, hasCount: false})}
        ${filtersMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  setFilterClickHandler(handler) {
    this.getElement().querySelectorAll(`.${CLASS_NAME}`).forEach((element) => {
      element.addEventListener(`click`, () => {
        const activeElement = this.getElement().querySelector(`.${ACTIVE_CLASS_NAME}`);
        if (activeElement !== element) {
          activeElement.classList.remove(ACTIVE_CLASS_NAME);
          element.classList.add(ACTIVE_CLASS_NAME);
          handler(element.dataset.filterType);
        }
      });
    });
  }
}
