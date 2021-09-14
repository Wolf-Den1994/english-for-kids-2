export const removeClassList = (
  elemToRemoveClass: HTMLButtonElement | HTMLElement | Element,
  elemClass: string,
): void => {
  elemToRemoveClass.classList.remove(elemClass);
};
