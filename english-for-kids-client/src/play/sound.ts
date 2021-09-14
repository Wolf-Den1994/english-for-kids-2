import { objGame } from '../control/obj-game';
import { IndexSounds } from '../utils/enums';
import { ICards, IWordsMongo } from '../utils/interfaces';
import { TypeIndexsSound } from '../utils/types';

export const tone = (audio: HTMLAudioElement, link: string): void => {
  audio.currentTime = 0;
  audio.src = `${link}`;
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {}).catch(() => {});
  }
};

export const sound = (link: string, index: TypeIndexsSound): void => {
  const audio1 = <HTMLAudioElement>document.querySelector('.audio1');
  const audio2 = <HTMLAudioElement>document.querySelector('.audio2');

  if (index === IndexSounds.FIRST) {
    tone(audio1, link);
  } else {
    tone(audio2, link);
  }
};

export const playSound = (page: ICards[], word: string): void => {
  const rightObjWithWord = page.filter((obj) => obj.word === word);
  const link = `${rightObjWithWord[0].audioSrc}`;
  sound(link, IndexSounds.FIRST);
};

export const playSoundServer = (link: string): void => {
  sound(link, IndexSounds.FIRST);
};

export const playingArrOfSounds = (words: IWordsMongo[]): void => {
  for (let i = 0; i < words.length; i++) {
    if (words[i].word === objGame.arrAudios[0]) {
      sound(words[i].audioSrc, IndexSounds.FIRST);
    }
  }
};
