import fs from 'fs';
import { filePathFullCards } from './consts';
import { Card } from './model';

export const createCardsInBD = async (): Promise<void> => {
  let cardLength;
  // eslint-disable-next-line array-callback-return
  await Card.find((err, data) => {
    cardLength = data.length;
  });
  // eslint-disable-next-line no-console
  console.log('fullCard length:', cardLength);
  if (!cardLength) {
    const content = fs.readFileSync(filePathFullCards, 'utf8');
    const fullCards = JSON.parse(content);
    Card.create(fullCards);
  }
};
