import cards from '../cards';
import { getWordsByCategory } from '../api/api';
import { objGame } from '../control/obj-game';
import { store } from '../store/store';
import { CATEGORY } from '../utils/consts';
import { LayoutPage, StateApp, Tags } from '../utils/enums';
import { root } from '../utils/get-elems';
import { IWordsMongo } from '../utils/interfaces';
import { updateWordArray } from '../utils/update-card-arr';

export const cleanField = (): void => {
  objGame.counterErrors = 0;
  root().innerHTML = '';
};

export const render = (
  layout: string,
  pageNumber: number,
  words: IWordsMongo[],
  categoryName: string,
): void => {
  const title = document.createElement(Tags.TITLE2);
  title.className = 'title';
  title.innerHTML =
    layout === LayoutPage.SUBJECT ? categoryName : 'Train difficult words';
  root().append(title);

  const score = document.createElement(Tags.DIV);
  score.className = 'score';
  root().append(score);

  const general = document.createElement(Tags.DIV);
  general.className =
    layout === LayoutPage.SUBJECT ? LayoutPage.SUBJECT : LayoutPage.DIFFICULT;
  root().append(general);

  for (let i = 0; i < words.length; i++) {
    const card = document.createElement(Tags.DIV);
    card.className = 'main-card';
    card.id = `${words[i].audioSrc}`;
    general.append(card);

    const flipper = document.createElement(Tags.DIV);
    flipper.className = 'flipper';
    card.append(flipper);

    const front = document.createElement(Tags.DIV);
    front.className = 'front';
    flipper.append(front);

    const img = document.createElement(Tags.IMG);
    const objCard = words[i];
    img.src = `${objCard.image}`;
    img.alt = `${objCard.word}`;
    front.append(img);

    const pFront = document.createElement(Tags.P);
    pFront.innerHTML = `${objCard.word}`;
    front.append(pFront);

    const reperse = document.createElement(Tags.SVG);
    front.append(reperse);

    if (store.getState().mode === StateApp.TRAIN) {
      img.className = `img image picture`;
      pFront.className = 'text text-font';
      reperse.className = 'svg image-svg';
    } else {
      img.className = `img image picture play`;
      pFront.className = 'text text-font play';
      reperse.className = 'svg image-svg play';
    }

    const back = document.createElement(Tags.DIV);
    back.className = 'back';
    flipper.append(back);

    const imgBack = document.createElement(Tags.IMG);
    imgBack.src = `${objCard.image}`;
    imgBack.className = 'picture';
    imgBack.alt = `${objCard.word}`;
    back.append(imgBack);

    const pBack = document.createElement(Tags.P);
    pBack.className = 'text';
    pBack.innerHTML = `${objCard.translation}`;
    back.append(pBack);
  }

  const audio1 = document.createElement(Tags.AUDIO);
  audio1.className = 'audio1';
  general.append(audio1);

  const audio2 = document.createElement(Tags.AUDIO);
  audio2.className = 'audio2';
  general.append(audio2);

  const btnStartGame = document.createElement(Tags.BUTTON);
  btnStartGame.className =
    store.getState().mode === StateApp.TRAIN
      ? 'btn btn-start-game play'
      : 'btn btn-start-game';
  btnStartGame.innerHTML = 'Start game';
  root().append(btnStartGame);
};

export const renderSubject = async (page: number): Promise<void> => {
  const index = page - 1;
  const categoryName = cards[CATEGORY][index];
  const words = await getWordsByCategory(categoryName);
  updateWordArray(words)
  cleanField();

  render(LayoutPage.SUBJECT, index, words, categoryName);
};
