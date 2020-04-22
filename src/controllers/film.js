// Отрисовка элементов
import {render, replace} from "../utils/render.js";

// Карточка фильма
import FilmComponent from "../components/film.js";
// Подробная информация о фильме (попап)
import FilmDetailsComponent from "../components/film-details.js";

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

export default class FilmController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;

    this._filmComponent = null;
    this._filmDetailsComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  get filmComponent() {
    return this._filmComponent;
  }

  render(film) {
    const oldFilmComponent = this._filmComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmComponent = new FilmComponent(film);
    this._filmDetailsComponent = new FilmDetailsComponent(film);

    this._filmDetailsComponent.setCloseBtnClickHandler(this._removeFilmDetails.bind(this));

    this._filmComponent.setClickHandler(() => {
      this._onViewChange();

      // Popup с подробной информацией о фильме будет отрисован последним в контейнере контроллера
      render(this._container.getElement().parentElement, this._filmDetailsComponent);

      this._mode = Mode.POPUP;

      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._filmComponent.setWatchlistButtonClickHandler(this._getButtonHandler(film, `isWaiting`));
    this._filmComponent.setWatchedButtonClickHandler(this._getButtonHandler(film, `isWatched`));
    this._filmComponent.setFavoriteButtonClickHandler(this._getButtonHandler(film, `isFavorite`));

    this._filmDetailsComponent.setWatchlistInputChangeHandler(this._getInputHandler(film, `isWaiting`));
    this._filmDetailsComponent.setWatchedInputChangeHandler(this._getInputHandler(film, `isWatched`));
    this._filmDetailsComponent.setFavoriteInputChangeHandler(this._getInputHandler(film, `isFavorite`));

    // Отрисовка фильма
    if (oldFilmDetailsComponent && oldFilmComponent) {
      replace(this._filmComponent, oldFilmComponent);
      replace(this._filmDetailsComponent, oldFilmDetailsComponent);
    } else {
      render(this._container.getContainerComponent().getElement(), this._filmComponent);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._removeFilmDetails();
    }
  }

  _removeFilmDetails() {
    this._filmDetailsComponent.getElement().remove();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _getButtonHandler(film, flag) {
    return (evt) => {
      evt.preventDefault();
      this._onDataChange(film, this._copyDataObject(film, flag, !film.userInfo[flag]));
    };
  }

  _getInputHandler(film, flag) {
    return (evt) => {
      this._onDataChange(film, this._copyDataObject(film, flag, evt.target.checked));
    };
  }

  _copyDataObject(film, flag, value) {
    const userInfo = Object.assign({}, film.userInfo, {[flag]: value});
    return Object.assign({}, film, {userInfo});
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._removeFilmDetails();
    }
  }
}
