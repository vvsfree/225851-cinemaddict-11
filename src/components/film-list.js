export const createFilmListTemplate = (title, isTitleHidden, isExtraModifier) => {
  const visuallyHidden = isTitleHidden ? `visually-hidden` : ``;
  const extraModifier = isExtraModifier ? `films-list--extra` : ``;
  return (
    `<section class="films-list ${extraModifier}">
      <h2 class="films-list__title ${visuallyHidden}">${title}</h2>
      <div class="films-list__container">
      </div>
    </section>`
  );
};
