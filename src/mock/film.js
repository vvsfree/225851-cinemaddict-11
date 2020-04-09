import {generateComments} from "./comment.js";

const getRandomBoolean = () => {
  return Math.random() > 0.5;
};

const generateFilm = () => {
  // TODO: сделать красиво-рандомайзно

  // Постер (картинка)
  const poster = `the-great-flamarion.jpg`;
  // Полноразмерная обложка
  const largePoster = `the-great-flamarion.jpg`;
  // Название фильма
  const title = `The Great Flamarion`;
  // Оригинальное название фильма
  const originalTitle = `Original: The Great Flamarion`;
  // Рейтинг
  const rating = `8.9`;
  // Возрастной рейтинг
  const ageRating = `18`;
  // Режиссёр
  const director = `Anthony Mann`;
  // Сценаристы
  const writers = [`Anne Wigton`, `Heinz Herald`, `Richard Weil`];
  // Актёрский состав
  const actors = [`Erich von Stroheim`, `Mary Beth Hughes`, `Dan Duryea`];
  // Год производства
  const year = `1945`;
  // Дата и год релиза в формате день месяц год (например: «01 April 1995»)
  const releaseDate = `30 March 1945`;
  // Продолжительность в формате часы минуты (например «1h 36m»)
  const runtime = `1h 18m`;
  // Страна
  const country = `USA`;
  // Жанр(ы)
  const genres = [`Drama`, `Film-Noir`, `Mystery`];
  // Краткое описание (не более 140 символов)
  // TODO: возможно, что краткое описание - это обрезанное полное, проверить. Тогда для summary можно сделать getter
  const summary = `The film opens following a murder at a cabaret in Mexico City in 1936, and then presents the events leading up to it in flashback. The Grea…`;
  // Полное описание
  const description = `The film opens following a murder at a cabaret in Mexico City in 1936, and then presents the events leading up to it in flashback. The Great Flamarion (Erich von Stroheim) is an arrogant, friendless, and misogynous marksman who displays his trick gunshot act in the vaudeville circuit. His show features a beautiful assistant, Connie (Mary Beth Hughes) and her drunken husband Al (Dan Duryea), Flamarion's other assistant. Flamarion falls in love with Connie, the movie's femme fatale, and is soon manipulated by her into killing her no good husband during one of their acts.`;

  // TODO: рандомайзное количество комментов
  const comments = generateComments(4);

  const userInfo = {
    isWaiting: getRandomBoolean(),
    isWatched: getRandomBoolean(),
    isFavorite: getRandomBoolean()
  };

  return {
    title,
    originalTitle,
    poster,
    largePoster,
    ageRating,
    rating,
    director,
    writers,
    actors,
    year,
    releaseDate,
    runtime,
    country,
    genres,
    summary,
    description,
    comments,
    userInfo,
  };
};

const generateFilms = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateFilm);
};

export {generateFilms};
