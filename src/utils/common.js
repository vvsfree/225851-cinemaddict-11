import moment from "moment";

const OUTPUT_FORMAT = `DD MMMM YYYY`;
const OUTPUT_FORMAT_HM = `YYYY/MM/DD HH:mm`;

export const getDuration = (runtime) => {
  const duration = moment.duration(runtime, `minutes`);
  return `${duration.hours()}h ${duration.minutes()}m`;
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
