import { NUMBER_CIRCLE } from '../utils/consts';
import { Tags } from '../utils/enums';

export const loader = (div: HTMLElement | HTMLDivElement): void => {
  const loaderScroll = document.createElement(Tags.DIV);
  loaderScroll.className = 'loader hidden';
  div.append(loaderScroll);

  for (let i = 0; i < NUMBER_CIRCLE; i++) {
    const circle = document.createElement(Tags.DIV);
    circle.className = 'circle';
    loaderScroll.append(circle);
  }
};
