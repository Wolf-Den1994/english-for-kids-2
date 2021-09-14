import { Tags } from '../utils/enums';
import { TypeOrder } from '../utils/types';

export const trTitle = document.createElement(Tags.TR);
trTitle.className = 'title-row';

const NUMBER_COLUMN = 7;
const arrClassListsTH = [
  'title-category',
  'title-word',
  'title-translate',
  'title-train',
  'title-play',
  'title-errors',
  'title-percent',
];
const arrContentTH = [
  'Category',
  'Word',
  'Translation',
  'Train',
  'Play',
  'Errors',
  'Percent',
];

export const renderTitleRow = (order: TypeOrder): void => {
  for (let i = 0; i < NUMBER_COLUMN; i++) {
    const th = document.createElement(Tags.TH);
    th.className = `${arrClassListsTH[i]} title-th ${order}`;
    th.innerHTML = `${arrContentTH[i]}`;
    trTitle.append(th);
  }
};
