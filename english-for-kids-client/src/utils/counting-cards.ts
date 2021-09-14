import cards from '../cards';

export const countCards = (): number => {
  let totalCards = 0;
  for (let i = 1; i < cards.length; i++) totalCards += cards[i].length;
  return totalCards;
};
