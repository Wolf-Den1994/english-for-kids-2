export const selectTitle = (): HTMLSelectElement =>
  document.querySelector('.words-select-title') as HTMLSelectElement;

export const getInputWord = (): HTMLInputElement =>
  document.querySelector('.word-top-layer-input-word') as HTMLInputElement;

export const getInputTranslation = (): HTMLInputElement =>
  document.querySelector(
    '.word-top-layer-input-translation',
  ) as HTMLInputElement;

export const getInputSound = (): HTMLInputElement =>
  document.querySelector('.word-top-layer-sound-input') as HTMLInputElement;

export const getInputImage = (): HTMLInputElement =>
  document.querySelector('.word-top-layer-image-input') as HTMLInputElement;
