import { fullCards } from '../control/obj-statistic';
import { NAME_LOCALSTORAGE } from '../utils/consts';
import { Order } from '../utils/enums';
import { IWordsMongo } from '../utils/interfaces';
import { renderStatistic } from './render-statistic';

const cleanArr = (arr: IWordsMongo[]): IWordsMongo[] => {
  const resettedArray: IWordsMongo[] = arr.map((item) => ({
    ...item,
    train: 0,
    play: 0,
    errors: 0,
    answers: 0,
    percent: 0,
  }));
  return resettedArray;
};

export const resetStatistic = (): void => {
  const resettedArray = cleanArr(fullCards);
  localStorage.setItem(NAME_LOCALSTORAGE, JSON.stringify(resettedArray));
  renderStatistic(resettedArray, Order.DESC);
};
