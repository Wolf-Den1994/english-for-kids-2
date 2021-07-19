export const addClassList = (
  elemToAddClass: HTMLButtonElement | HTMLElement | Element,
  elemClass: string,
): void => {
  elemToAddClass.classList.add(elemClass);
};
