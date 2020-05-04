import {shuffle} from "../utils/common.js";

const SAMPLE_COMMENTS = [
  {
    emoji: `smile`,
    text: `Interesting setting and a good cast`,
    author: `Tim Macoveev`,
    day: `2020-04-23T13:53:00`
  }, {
    emoji: `sleeping`,
    text: `Booooooooooring`,
    author: `John Doe`,
    day: `2020-04-22T22:10:00`
  }, {
    emoji: `puke`,
    text: `Very very old. Meh`,
    author: `John Doe`,
    day: `2020-03-31T11:15:00`
  }, {
    emoji: `angry`,
    text: `Almost two hours? Seriously?`,
    author: `Milla Jovovich`,
    day: `2020-02-15T14:44:00`
  }, {
    emoji: `smile`,
    text: `First here! ))`,
    author: `Bro`,
    day: `2019-01-31T20:20`
  }, {
    emoji: `sleeping`,
    text: `I'm a dog tired watching this "masterpiece" ... h-r-r`,
    author: `Film expert`,
    day: `2019-12-31T11:50:00`
  }
];

const generateComments = (count) => {
  return shuffle(SAMPLE_COMMENTS.slice()).slice(0, count);
};

export {generateComments};
