import AbstractSmartComponent from "./abstract-smart-component.js";
import {getDuration, capitalize} from "../utils/common.js";
import {Period, Periods} from "../const.js";

const CLASS_NAME = `statistic__filters`;

const createPeriodMarkup = (period, currentPeriod) => {
  const periodName = capitalize(period).replace(`-`, ` `);
  const checked = period === currentPeriod ? `checked` : ``;
  return (
    `<input type="radio" class="${CLASS_NAME}-input visually-hidden" name="statistic-filter" id="statistic-${period}" value="${period}" ${checked}>
    <label for="statistic-${period}" class="${CLASS_NAME}-label">${periodName}</label>`
  );
};

const createStatisticsTemplate = (model, currentPeriod) => {
  const {watchedCount, totalRuntime, topGenre} = model.getWatchedStatistics(currentPeriod);
  const totalDuration = getDuration(totalRuntime);

  const periodsMarkup = Periods.map((period) => createPeriodMarkup(period, currentPeriod)).join(`\n`);

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">Sci-Fighter</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        ${periodsMarkup}
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${watchedCount} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${totalDuration.hours()} <span class="statistic__item-description">h</span> ${totalDuration.minutes()} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenre}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(model) {
    super();
    this._model = model;
    this._currentPeriod = Period.ALL_TIME;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createStatisticsTemplate(this._model, this._currentPeriod);
  }

  recoveryListeners() {
    this._subscribeOnEvents();
  }

  show() {
    super.show();
    this.rerender();
  }

  _subscribeOnEvents() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`change`, (evt) => {
      this._currentPeriod = evt.target.value;
      this.rerender();
    });
  }
}
