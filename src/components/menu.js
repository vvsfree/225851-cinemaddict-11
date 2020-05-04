import AbstractComponent from "./abstract-component.js";
import {MenuItemType} from "../const.js";

const createMenuTemplate = () => {
  return (
    `<nav class="main-navigation">
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class Menu extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createMenuTemplate();
  }

  setMenuClickHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.tagName !== `A`) {
        return;
      }

      let itemType;
      // Внутри данного компонента  будет распологаться фильтр
      if (evt.target.dataset.filterType) {
        itemType = MenuItemType.FILTER;
      } else {
        itemType = MenuItemType.STATISTICS;
      }
      handler(itemType);
    });
  }
}
