const SAMPLE_COMMENTS = [
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
    author: `Milla Jovovich`,
    day: `Today`
  }, {
    emoji: `smile`,
    text: `First here! ))`,
    author: `Bro`,
    day: `Today`
  }, {
    emoji: `sleeping`,
    text: `I'm a dog tired watching this "masterpiece" ... h-r-r`,
    author: `Film expert`,
    day: `some days ago`
  }
];

const shuffle = (arr) => {
  return arr.sort(() => {
    return Math.random() - 0.5;
  });
};

const generateComments = (count) => {
  return shuffle(SAMPLE_COMMENTS.slice()).slice(0, count);
};

export {generateComments};
