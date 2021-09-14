import { fullCards } from '../control/obj-statistic';
import { checkClass } from '../utils/check-class';
import { Order, SortTitle } from '../utils/enums';
import { IWordsMongo } from '../utils/interfaces';
import { TypeOrder } from '../utils/types';
import { renderStatistic } from './render-statistic';

export const sortCards: IWordsMongo[] = [];

const sortByTitle = (
  arr: IWordsMongo[],
  arg: keyof IWordsMongo,
  order: TypeOrder,
): void => {
  if (order === Order.ASC) {
    arr.sort((a, b) => (a[arg] > b[arg] ? 1 : -1));
  } else {
    arr.sort((a, b) => (a[arg] > b[arg] ? -1 : 1));
  }
};

const directionSorting = (
  cards: IWordsMongo[],
  column: keyof IWordsMongo,
  sortAside: TypeOrder,
  renderAside: TypeOrder,
): void => {
  sortByTitle(cards, column, sortAside);
  sortCards.push(...cards);
  renderStatistic(sortCards, renderAside);
};

const getTitle = (prefix: string) => `title-${prefix}`;

export const sortStatistic = (title: HTMLTableHeaderCellElement): void => {
  sortCards.length = 0;
  const newFullCards = fullCards.slice();

  switch (true) {
    case checkClass(title, getTitle(SortTitle.CATEGORY)):
      checkClass(title, Order.DESC)
        ? directionSorting(
          newFullCards,
          SortTitle.CATEGORY,
          Order.DESC,
          Order.ASC,
        )
        : directionSorting(
          newFullCards,
          SortTitle.CATEGORY,
          Order.ASC,
          Order.DESC,
        );
      break;

    case checkClass(title, getTitle(SortTitle.WORD)):
      checkClass(title, Order.DESC)
        ? directionSorting(newFullCards, SortTitle.WORD, Order.DESC, Order.ASC)
        : directionSorting(newFullCards, SortTitle.WORD, Order.ASC, Order.DESC);

      break;

    case checkClass(title, getTitle(SortTitle.TRANSLATE)):
      checkClass(title, Order.DESC)
        ? directionSorting(
          newFullCards,
          SortTitle.TRANSLATION,
          Order.DESC,
          Order.ASC,
        )
        : directionSorting(
          newFullCards,
          SortTitle.TRANSLATION,
          Order.ASC,
          Order.DESC,
        );
      break;

    case checkClass(title, getTitle(SortTitle.TRAIN)):
      checkClass(title, Order.DESC)
        ? directionSorting(newFullCards, SortTitle.TRAIN, Order.DESC, Order.ASC)
        : directionSorting(
          newFullCards,
          SortTitle.TRAIN,
          Order.ASC,
          Order.DESC,
        );
      break;

    case checkClass(title, getTitle(SortTitle.PLAY)):
      checkClass(title, Order.DESC)
        ? directionSorting(
          newFullCards,
          SortTitle.ANSWERS,
          Order.DESC,
          Order.ASC,
        )
        : directionSorting(
          newFullCards,
          SortTitle.ANSWERS,
          Order.ASC,
          Order.DESC,
        );
      break;

    case checkClass(title, getTitle(SortTitle.ERRORS)):
      checkClass(title, Order.DESC)
        ? directionSorting(newFullCards, SortTitle.FAILS, Order.DESC, Order.ASC)
        : directionSorting(
          newFullCards,
          SortTitle.FAILS,
          Order.ASC,
          Order.DESC,
        );
      break;

    case checkClass(title, getTitle(SortTitle.PERCENT)):
      checkClass(title, Order.DESC)
        ? directionSorting(
          newFullCards,
          SortTitle.PERCENT,
          Order.DESC,
          Order.ASC,
        )
        : directionSorting(
          newFullCards,
          SortTitle.PERCENT,
          Order.ASC,
          Order.DESC,
        );
      break;

    default:
      break;
  }
};
