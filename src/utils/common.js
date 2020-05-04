import moment from "moment";
import {Rating} from "../const";

const OUTPUT_FORMAT = `DD MMMM YYYY`;
const OUTPUT_FORMAT_HM = `YYYY/MM/DD HH:mm`;

export const getDurationStr = (runtime) => {
  const duration = getDuration(runtime);
  return `${duration.hours()}h ${duration.minutes()}m`;
};

export const getDuration = (runtime) => {
  return moment.duration(runtime, `minutes`);
};

export const getYear = (date) => {
  return moment(date).format(`YYYY`);
};

export const formatFilmDate = (date) => {
  return moment(date).format(OUTPUT_FORMAT);
};

// Дата в комментариях будет в формате ISO 8601
// Библиотека moments.js распознает его по умолчанию
export const formatCommentDate = (dateStr) => {
  return moment(dateStr).format(OUTPUT_FORMAT_HM);
};

export const formatCommentDateAsHuman = (dateStr) => {
  return moment(dateStr).fromNow();
};

export const isOnePeriod = (dateA, dateB, measure) => {
  if (measure === null) {
    return true;
  }
  const a = moment(dateA);
  const b = moment(dateB);
  return a.diff(b, measure) === 0;
};

export const shuffle = (arr) => {
  return arr.sort(() => {
    return Math.random() - 0.5;
  });
};

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getRating = (watchedCount) => {
  let rating;
  if (watchedCount === 0) {
    rating = Rating.NONE;
  } else if (watchedCount <= 10) {
    rating = Rating.NOVICE;
  } else if (watchedCount <= 20) {
    rating = Rating.FAN;
  } else {
    rating = Rating.MOVIE_BUFF;
  }

  return rating;
};
