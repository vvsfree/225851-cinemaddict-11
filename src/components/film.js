const createButtonMarkup = (text, modifier, isActive) => {
  const className = `film-card__controls-item`;
  const classNameActive = isActive ? `${className}--active` : ``;
  return (
    `<button class="${className} button ${className}--${modifier} ${classNameActive}">${text}</button>`
  );
};

export const createFilmTemplate = (film) => {
  const {title, rating, year, runtime, genres, poster, summary, comments, userInfo: {isWaiting, isWatched, isFavorite}} = film;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${runtime}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="./images/posters/${poster}" alt="${title}" class="film-card__poster">
      <p class="film-card__description">${summary}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <form class="film-card__controls">
        ${createButtonMarkup(`Add to watchlist`, `add-to-watchlist`, isWaiting)}
        ${createButtonMarkup(`Mark as watched`, `mark-as-watched`, isWatched)}
        ${createButtonMarkup(`Mark as favorite`, `favorite`, isFavorite)}
      </form>
    </article>`
  );
};
