import {generateComments} from "./comment.js";
import {shuffle} from "../utils/common.js";

const SAMPLE_FILMS = [
  {title: `Made for Each Other`, poster: `made-for-each-other.png`},
  {title: `Popeye Meets The Sailor`, poster: `popeye-meets-sinbad.png`},
  {title: `Sagebrush Trail`, poster: `sagebrush-trail.jpg`},
  {title: `Santa Claus Conquers The Martians`, poster: `santa-claus-conquers-the-martians.jpg`},
  {title: `The Dance of Life`, poster: `the-dance-of-life.jpg`},
  {title: `The Great Flamarion`, poster: `the-great-flamarion.jpg`},
  {title: `The Man with The Golden Arm`, poster: `the-man-with-the-golden-arm.jpg`},
];

const SAMPLE_GENRES = [
  `Drama`, `Film-Noir`, `Mystery`, `SCI-FI`, `Tragedy`, `Comedy`, `Western`
];

const SAMPLE_PHRASES = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const getRandomBoolean = () => {
  return Math.random() > 0.5;
};

// [min, max] - границы включаются
const getRandomInteger = (min, max) => {
  return min + Math.floor(Math.random() * (max - min + 1));
};

const getRandomFloat = (min, max) => {
  return (min + Math.random() * (max - min)).toFixed(1);
};

const getRandomArrayItem = (arr) => {
  return arr[getRandomInteger(1, arr.length) - 1];
};

const getRandomDate = (params = {yearBegin: 1932, yearEnd: 2019}) => {
  let targetDate = new Date(
      getRandomInteger(params.yearBegin, params.yearEnd),
      getRandomInteger(1, 12),
      getRandomInteger(1, 31)
  );
  return targetDate;
};

const generateDescription = (count) => {
  return new Array(count).fill(``).map(() => getRandomArrayItem(SAMPLE_PHRASES)).join();
};

const generateId = () => {
  return Number(Date.now()) + Math.random();
};

let sampleFilmsIdx = 0;

const generateFilm = () => {
  const id = generateId();
  const sampleFilm = SAMPLE_FILMS[sampleFilmsIdx++ % SAMPLE_FILMS.length];
  // Постер (картинка)
  const poster = sampleFilm.poster;
  // Полноразмерная обложка
  const largePoster = sampleFilm.poster;
  // Название фильма
  const title = sampleFilm.title;
  // Оригинальное название фильма
  const originalTitle = `Original: ${sampleFilm.title}`;
  // Рейтинг
  const rating = getRandomFloat(0, 9.9);
  // Возрастной рейтинг
  const ageRating = `18`;
  // Режиссёр
  const director = `Anthony Mann`;
  // Сценаристы
  const writers = [`Anne Wigton`, `Heinz Herald`, `Richard Weil`];
  // Актёрский состав
  const actors = [`Erich von Stroheim`, `Mary Beth Hughes`, `Dan Duryea`];
  // Дата создания фильма
  const releaseDate = getRandomDate();
  // Продолжительность в формате часы минуты (например «1h 36m»)
  const runtime = getRandomInteger(30, 3 * 60);
  // Страна
  const country = `USA`;
  // Жанр(ы)
  const genres = shuffle(SAMPLE_GENRES).slice(0, getRandomInteger(1, SAMPLE_GENRES.length - 1));
  // Полное описание
  const description = generateDescription(getRandomInteger(1, 5));

  // Комментарии от 0 до 5
  const comments = generateComments(getRandomInteger(0, 5)).map((comment) => Object.assign({}, comment, {id: generateId()}));

  const userInfo = {
    isWaiting: getRandomBoolean(),
    isWatched: getRandomBoolean(),
    watchingDate: ``,
    isFavorite: getRandomBoolean()
  };

  userInfo.watchingDate = userInfo.isWatched ? getRandomDate({yearBegin: 2018, yearEnd: 2020}) : null;

  return {
    id,
    title,
    originalTitle,
    poster,
    largePoster,
    ageRating,
    rating,
    director,
    writers,
    actors,
    releaseDate,
    runtime,
    country,
    genres,
    // Краткое описание (не более 140 символов)
    get summary() {
      return description.length > 140 ? description.substr(0, 139) + `…` : description;
    },
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

export {generateId};
export {generateFilms};
