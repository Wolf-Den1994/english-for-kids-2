export const linkOut = (): HTMLAnchorElement =>
  document.querySelector('.categ-link-out') as HTMLAnchorElement;

export const linkCateg = (): HTMLAnchorElement =>
  document.querySelector('.categ-link-categ') as HTMLAnchorElement;

export const linkWords = (): HTMLAnchorElement =>
  document.querySelector('.categ-link-words') as HTMLAnchorElement;

export const inputText = (): HTMLInputElement =>
  document.querySelector('.categ-top-layer-input') as HTMLInputElement;

export const inputFile = (): HTMLInputElement =>
  document.querySelector('.categ-top-layer-image-input') as HTMLInputElement;

export const getNewCardCateg = (): HTMLDivElement =>
  document.querySelector('.categ-card-new') as HTMLDivElement;

export const getCategCardsAll = (): NodeListOf<Element> =>
  document.querySelectorAll('.categ-card') as NodeListOf<Element>;

export const getMainCateg = (): HTMLElement =>
  document.querySelector('.categ-main') as HTMLElement;
