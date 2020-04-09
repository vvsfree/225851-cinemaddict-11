// TODO: temp. Для красоты пока что ))
// TODO: форматирование дат. Например: 2 days ago )), today, 2019/12/31 23:59
// TODO: emoji брать из emoji.js
const knownComments = [
  {
    emoji: `smile`,
    text: `Interesting setting and a good cast`,
    author: `Tim Macoveev`,
    day: `2019/12/31 23:59`
  }, {
    emoji: `sleeping`,
    text: `Booooooooooring`,
    author: `John Doe`,
    day: `2 days ago`
  }, {
    emoji: `puke`,
    text: `Very very old. Meh`,
    author: `John Doe`,
    day: `2 days ago`
  }, {
    emoji: `angry`,
    text: `Almost two hours? Seriously?`,
    author: `John Doe`,
    day: `Today`
  }
];

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const generateComment = (count) => {
  return knownComments[getRandomIntegerNumber(0, count)];
};

const generateComments = (count) => {
  return new Array(count)
    .fill(``)
    .map(() => generateComment(count));
};

export {generateComments};
