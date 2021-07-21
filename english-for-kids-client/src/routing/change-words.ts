import { getCategory, getWordsByCategory } from '../api/api';
import { handlingClicksWordPage } from '../page-works/handling-click-word';
import { head } from '../shareit/head';
import { changeAdminCategory } from '../store/actions';
import { store } from '../store/store';
import { addClassList } from '../utils/add-class';
import { checkClass } from '../utils/check-class';
import {
  DELAY_LOAD_HIDDEN,
  DELAY_LOAD_SHOW,
  NUMBER_CIRCLE,
} from '../utils/consts';
import { ElemClasses, Events, RoutNames, Tags } from '../utils/enums';
import { getLoader } from '../utils/get-elems';
import {
  getMainWords,
  getWordsCardsAll,
  selectTitle,
} from '../utils/get-elems-words';
import { ICategoriesMongo, IWordsMongo } from '../utils/interfaces';
import { removeClassList } from '../utils/remove-class';
import { onNavigate } from './routes';

const heightHeader = 151;
const heightCard = 400;
const correctionCoefficient = 4;

const renderNewCard = (wrapper: HTMLDivElement): void => {
  const card = document.createElement(Tags.DIV);
  card.className = 'words-card words-card-new';
  wrapper.append(card);

  const newWord = document.createElement(Tags.P);
  newWord.className = 'words-name words-name-new';
  newWord.innerHTML = `Add new word`;
  card.append(newWord);
};

const rend = (
  begin: number,
  end: number,
  words: IWordsMongo[],
  wrapper: HTMLDivElement,
): void => {
  for (let i = begin; i < end; i++) {
    if (typeof words[i] === 'object') {
      const card = document.createElement(Tags.DIV);
      card.className = 'words-card observ';
      card.id = `${words[i].word}`;
      wrapper.append(card);

      const word = document.createElement(Tags.P);
      word.className = 'words-word';
      word.innerHTML = `
          <span class="words-bold">
          Word:
          </span> ${words[i].word}
        `;
      card.append(word);

      const translation = document.createElement(Tags.P);
      translation.className = 'words-translation';
      translation.innerHTML = `
        <span class="words-bold">
          Translation:
        </span> ${words[i].translation}
      `;
      card.append(translation);

      const soundFile = document.createElement(Tags.P);
      soundFile.className = 'words-sound';
      soundFile.innerHTML = `
        <span class="words-bold">
          Sound file:
        </span> ${words[i].audioSrc}
        <span class="words-play-sound"></span>
      `;
      card.append(soundFile);

      const imageTitle = document.createElement(Tags.P);
      imageTitle.className = 'words-image-title';
      imageTitle.innerHTML = '<span class="words-bold">Image:</span>';
      card.append(imageTitle);

      const image = document.createElement(Tags.IMG);
      image.className = `words-image words-image-${words[i].word}`;
      image.src = `${words[i].image}`;
      image.alt = `${words[i].word}`;
      card.append(image);

      const btnChange = document.createElement(Tags.BUTTON);
      btnChange.className = 'words-btn-change';
      btnChange.innerHTML = 'Change';
      card.append(btnChange);

      const btnRemove = document.createElement(Tags.SPAN);
      btnRemove.className = 'words-bnt-remove';
      card.append(btnRemove);
    }
  }

  if (end >= words.length) {
    renderNewCard(wrapper);
  }
};

const pointThisWords = (
  words: IWordsMongo[],
  wrapper: HTMLDivElement,
): void => {
  wrapper.innerHTML = '';

  const heightClient = document.documentElement.clientHeight;
  let start =
    Math.ceil((heightClient - heightHeader) / heightCard) +
    correctionCoefficient;
  let mx = start;

  let counterObserver = 0;

  rend(0, start, words, wrapper);

  let cards = [...getWordsCardsAll()] as HTMLElement[];

  const observer = new IntersectionObserver(
    (entries, observ) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          counterObserver++;
          if (counterObserver + 1 === start) {
            if (mx < words.length) {
              addClassList(document.body, ElemClasses.HIDDEN);

              getLoader().classList.remove(ElemClasses.HIDDEN);
              setTimeout(() => {
                getLoader().classList.add(ElemClasses.HIDDEN);
                if (mx + mx <= words.length) {
                  mx += start;
                } else {
                  mx = words.length;
                }
                rend(start, mx, words, wrapper);
                start += start;
              }, DELAY_LOAD_SHOW);
            }
            setTimeout(() => {
              removeClassList(document.body, ElemClasses.HIDDEN);
              cards = [...getWordsCardsAll()] as HTMLElement[];
              cards.forEach((card) => {
                if (checkClass(card, ElemClasses.OBSERV)) {
                  observer.observe(card);
                }
              });
            }, DELAY_LOAD_HIDDEN);
          }
          observ.unobserve(entry.target);
        }
      });
    },
    { threshold: 1 },
  );

  cards.forEach((card) => {
    if (checkClass(card, ElemClasses.OBSERV)) {
      observer.observe(card);
    }
  });

  const audio1 = document.createElement(Tags.AUDIO);
  audio1.className = 'audio1';
  wrapper.append(audio1);

  const loaderScroll = document.createElement(Tags.DIV);
  loaderScroll.className = 'loader hidden';
  wrapper.append(loaderScroll);

  for (let i = 0; i < NUMBER_CIRCLE; i++) {
    const circle = document.createElement(Tags.DIV);
    circle.className = 'circle';
    loaderScroll.append(circle);
  }
};

const selectCategory = async (
  words: IWordsMongo[],
  categories: ICategoriesMongo[],
  wrapper: HTMLDivElement,
  event: Event,
): Promise<void> => {
  const target = event.target as HTMLSelectElement;

  store.dispatch(changeAdminCategory(target.value));
  onNavigate(`/${store.getState().admCateg.toLowerCase()}${RoutNames.WORDS}`);
  const newWords = await getWordsByCategory(store.getState().admCateg);

  pointThisWords(newWords, wrapper);
};

export const changeWords = `${head('words')}`;

export const renderWordsPage = async (): Promise<void> => {
  removeClassList(document.body, ElemClasses.HIDDEN_MODAL);

  const categories = await getCategory();
  const words = await getWordsByCategory(store.getState().admCateg);
  const main = getMainWords();

  const wrapperSelect = document.createElement(Tags.DIV);
  wrapperSelect.className = 'words-wrapper-select';
  main.append(wrapperSelect);

  const categoryTitle = document.createElement(Tags.SPAN);
  categoryTitle.className = 'words-category-title';
  categoryTitle.innerHTML = 'Category';
  wrapperSelect.append(categoryTitle);

  const ElemselectTitle = document.createElement(Tags.SELECT);
  ElemselectTitle.className = 'words-select-title';
  wrapperSelect.append(ElemselectTitle);

  for (let i = 0; i < categories.length; i++) {
    const optionTitle = document.createElement(Tags.OPTION);
    optionTitle.value = `${categories[i].categoryName}`;
    optionTitle.innerHTML = `${categories[i].categoryName}`;
    ElemselectTitle.append(optionTitle);
  }

  const wrapperCards = document.createElement(Tags.DIV);
  wrapperCards.className = 'words-wrapper-cards';
  main.append(wrapperCards);

  selectTitle().addEventListener(
    Events.CHANGE,
    selectCategory.bind(null, words, categories, wrapperCards),
  );

  selectTitle().value = `${store.getState().admCateg}`;

  pointThisWords(words, wrapperCards);

  handlingClicksWordPage(main, words, categories);
};
