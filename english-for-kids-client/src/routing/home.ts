import { renderMain } from '../main-page/render-main';

// export const changeHome = `
//   <h1>I am changeCategory.</h1>
// `;

export const changeHome = (): void => {
  renderMain();
  // getCards('/api/cards');
  // getCards('/api/fullcards');
};
