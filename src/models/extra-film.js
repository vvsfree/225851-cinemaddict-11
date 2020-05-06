const getTopRatedFilms = (films, count) => {
  return films.slice().sort((a, b) => Number(b.rating) - Number(a.rating)).slice(0, count);
};

const getMostCommentedFilms = (films, count) => {
  return films.slice().sort((a, b) => b.comments.length - a.comments.length).slice(0, count);
};

export {getTopRatedFilms, getMostCommentedFilms};
