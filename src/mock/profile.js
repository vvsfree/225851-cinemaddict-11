const generateProfile = (watchedCount) => {
  const avatar = `bitmap@2x.png`;

  let rating;
  if (watchedCount <= 10) {
    rating = `Novice`;
  } else if (watchedCount <= 20) {
    rating = `Fan`;
  } else {
    rating = `Movie Buff`;
  }

  return {
    rating,
    avatar,
  };
};

export {generateProfile};
