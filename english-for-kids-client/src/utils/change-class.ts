export const changeClassList = (
  elem: HTMLButtonElement | HTMLDivElement | HTMLElement,
  oldClass: string,
  newClass: string,
): void => {
  elem.classList.remove(oldClass);
  elem.classList.add(newClass);
};
