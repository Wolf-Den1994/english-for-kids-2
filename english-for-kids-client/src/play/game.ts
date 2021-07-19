import { getWordsByCategory } from '../api/api';
import cards from '../cards';
import { objGame } from '../control/obj-game';
import { objNumberPage } from '../control/obj-page';
import { dispatchInfo, fullCards } from '../control/obj-statistic';
import { renderFinish } from '../finish/finish';
import { store } from '../store/store';
import { addClassList } from '../utils/add-class';
import { changeClassList } from '../utils/change-class';
import { CATEGORY } from '../utils/consts';
import { ElemClasses, IndexSounds, Tags } from '../utils/enums';
import { getSoundPath } from '../utils/get-sound-path';
import { getStringWord } from '../utils/get-word';
import { IWordsMongo } from '../utils/interfaces';
import { sound } from './sound';

const IN_INTEREST = 100;
const DELAY_PLAY_SOUND = 1000;

const addStars = (nameClass: string): void => {
  const score = <HTMLDivElement>document.querySelector('.score');
  const star = document.createElement(Tags.SPAN);
  star.className = `star ${nameClass}`;
  score.append(star);
};

const generateRandom = (words: string[]): string[] => {
  const arrAudios: string[] = [];
  for (let i = 0; i < words.length; i++) {
    arrAudios.push(words[i]);
  }
  return arrAudios.sort(() => Math.random() - 0.5);
};

const playingArrOfSounds = (words: IWordsMongo[]) => {
  for (let i = 0; i < words.length; i++) {
    if (words[i].word === objGame.arrAudios[0]) {
      sound(words[i].audioSrc, IndexSounds.FIRST);
    }
  }
};

export const startGame = async (elem: HTMLElement): Promise<void> => {
  const categoryName = cards[CATEGORY][store.getState().page - 1];
  const words = await getWordsByCategory(categoryName);
  const arrWords: string[] = [];
  for (let i = 0; i < words.length; i++) {
    arrWords.push(words[i].word);
  }
  changeClassList(elem, ElemClasses.BTN_START_GAME, ElemClasses.REPEAT);
  if (store.getState().page === objNumberPage.difficult) {
    // const randomAudios = generateRandom(arrDifficultWord);
    // playingArrOfSounds(randomAudios);
  } else {
    // const page = cards[store.getState().page] as ICards[];
    const randomWordsForSound = generateRandom(arrWords);
    objGame.arrAudios = randomWordsForSound;
    playingArrOfSounds(words);
  }
};

const addAnswers = (item: IWordsMongo) => {
  item.answers++;
  item.percent = (item.play / item.answers) * IN_INTEREST;
};

export const gameProcess = async (elem: HTMLElement): Promise<void> => {
  const categoryName = cards[CATEGORY][store.getState().page - 1];
  const words = await getWordsByCategory(categoryName);
  const image = elem as HTMLImageElement;
  if (objGame.arrAudios.length) {
    const wordImage = getStringWord(image.alt);
    const wordAudio = getStringWord(objGame.arrAudios[0]);
    if (wordImage === wordAudio) {
      sound(getSoundPath('correct'), IndexSounds.SECOND);
      addClassList(elem, ElemClasses.GREAT);
      addStars('win');
      fullCards.forEach((item) => {
        if (item.word === wordImage) {
          item.play++;
          addAnswers(item);
        }
      });
      dispatchInfo(fullCards);
      objGame.arrAudios.shift();
      if (objGame.arrAudios.length) {
        setTimeout(() => {
          playingArrOfSounds(words);
          // sound(objGame.arrAudios[0], IndexSounds.FIRST);
        }, DELAY_PLAY_SOUND);
      } else {
        renderFinish();
      }
    } else {
      objGame.counterErrors++;
      sound(getSoundPath('error'), IndexSounds.SECOND);
      addStars('fail');
      fullCards.forEach((item) => {
        if (item.word === wordAudio) {
          item.fails++;
          addAnswers(item);
        }
      });
      dispatchInfo(fullCards);
    }
  }
};
