import { allCards } from '../category/category';
import { allWords } from '../routing/change-words';
import { ICategoriesMongo, IWordsMongo } from './interfaces';

export const updateCardArray = (categories: ICategoriesMongo[]): void => {
  allCards.length = 0;
  allCards.push(...categories);
};

export const updateWordArray = (words: IWordsMongo[]): void => {
  allWords.length = 0;
  allWords.push(...words);
};
