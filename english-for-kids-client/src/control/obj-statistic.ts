import { getWords } from '../api/api';
import { NAME_LOCALSTORAGE } from '../utils/consts';
import { IWordsMongo } from '../utils/interfaces';

export const fullCards: IWordsMongo[] = [];
// const infoLocal = localStorage.getItem(NAME_LOCALSTORAGE);
export const getFullCardsNow = async (): Promise<void> => {
  // const response = await getCards('/api/fullcards');
  const response = await getWords();
  if (response) {
    fullCards.push(...response);
  }
};
export const dispatchInfoOnBackend = (): void => {};

export const dispatchInfo = (info: IWordsMongo[]): void => {
  localStorage.setItem(NAME_LOCALSTORAGE, JSON.stringify(info));
};
dispatchInfo(fullCards);
