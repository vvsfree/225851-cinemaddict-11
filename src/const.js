export const EMOJIS = [`smile`, `sleeping`, `puke`, `angry`];

export const FilterType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`,
};

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`,
};

export const MenuItemType = {
  FILTER: `filter`,
  STATISTICS: `statistics`,
};

export const SortTypes = Object.values(SortType);

export const Period = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

export const Periods = Object.values(Period);

export const Rating = {
  NONE: ``,
  NOVICE: `Novice`,
  FAN: `Fan`,
  MOVIE_BUFF: `Movie Buff`
};
