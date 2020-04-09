export const createFooterStatisticsTemplate = (count) => {
  // TODO: форматировать 130291 как 130 291
  return (
    `<section class="footer__statistics">
      <p>${count} movies inside</p>
    </section>`
  );
};
