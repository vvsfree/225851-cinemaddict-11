const _filters = {
  all: 0,
  watchlist: 0,
  history: 0,
  favorites: 0
};

const generateFilters = (films) => {
  const filters = Object.assign({}, _filters, {all: films.length});

  films.forEach((film) => {
    const {isWaiting, isWatched, isFavorite} = film.userInfo;

    if (isWaiting) {
      filters.watchlist++;
    }

    if (isWatched) {
      filters.history++;
    }

    if (isFavorite) {
      filters.favorites++;
    }
  });

  return filters;
};

export {generateFilters};
