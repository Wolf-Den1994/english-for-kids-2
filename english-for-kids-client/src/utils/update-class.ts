export const updateClassList = (
  elemToAddClass: HTMLButtonElement | HTMLDivElement | HTMLElement,
  elemToRemoveClass: HTMLButtonElement | HTMLDivElement | HTMLElement,
  elemClass: string,
): void => {
  elemToRemoveClass.classList.remove(elemClass);
  elemToAddClass.classList.add(elemClass);
};
