import { getCategory, getWordsByCategory } from '../api/api';
import { handlingClicksWordPage } from '../page-works/handling-click-word';
import { head } from '../shareit/head';
import { changeAdminCategory } from '../store/actions';
import { store } from '../store/store';
import { addClassList } from '../utils/add-class';
import { checkClass } from '../utils/check-class';
import { ElemClasses, Events, Tags } from '../utils/enums';
import { getLoader } from '../utils/get-elems';
import { selectTitle } from '../utils/get-elems-words';
import { ICategoriesMongo, IWordsMongo } from '../utils/interfaces';
import { removeClassList } from '../utils/remove-class';
import { onNavigate } from './routes';

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
) => {
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
    // console.log('end', end, 'words.length', words.length);
    renderNewCard(wrapper);
  }
};

const pointThisWords = (words: IWordsMongo[], wrapper: HTMLDivElement) => {
  wrapper.innerHTML = '';

  let start =
    Math.ceil((document.documentElement.clientHeight - 151) / 400) + 4;
  let mx = start;

  // window.addEventListener('scroll', () => {});

  let counterObserver = 0;

  rend(0, start, words, wrapper);

  let cards = [...document.querySelectorAll('.words-card')] as HTMLElement[];

  const observer = new IntersectionObserver(
    (entries, observ) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          counterObserver++;
          // console.log(counterObserver + 1, start)
          if (counterObserver + 1 === start) {
            if (mx < words.length) {
              addClassList(document.body, 'hidden');

              getLoader().classList.remove('hidden');
              setTimeout(() => {
                getLoader().classList.add('hidden');
                if (mx + mx <= words.length) {
                  mx += start;
                } else {
                  mx = words.length;
                }
                rend(start, mx, words, wrapper);
                start += start;
              }, 500);
            }
            setTimeout(() => {
              removeClassList(document.body, 'hidden');
              cards = [
                ...document.querySelectorAll('.words-card'),
              ] as HTMLElement[];
              // console.log(cards.length);
              cards.forEach((card) => {
                if (checkClass(card, 'observ')) {
                  observer.observe(card);
                }
                // console.log('card count');
              });
            }, 650);
          }
          observ.unobserve(entry.target);
        }
      });
    },
    { threshold: 1 },
  );

  cards.forEach((card) => {
    if (checkClass(card, 'observ')) {
      observer.observe(card);
    }
    // console.log('card count');
  });

  const audio1 = document.createElement(Tags.AUDIO);
  audio1.className = 'audio1';
  wrapper.append(audio1);

  const NUMBER_CIRCLE = 3;

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
) => {
  const target = event.target as HTMLSelectElement;

  // let index;
  // for (let i = 0; i < categories.length; i++) {
  //   if (categories[i].categoryName === target.value) {
  //     index = i
  //   }
  // }

  // const index = words[CATEGORY].indexOf(target.value);
  store.dispatch(changeAdminCategory(target.value));
  onNavigate(`/${store.getState().admCateg.toLowerCase()}/words`);
  const newWords = await getWordsByCategory(store.getState().admCateg);

  pointThisWords(newWords, wrapper);
};

export const changeWords = `${head('words')}`;

export const renderWordsPage = async (): Promise<void> => {
  // console.log(store.getState().admCateg);
  removeClassList(document.body, ElemClasses.HIDDEN_MODAL);

  // const cards = await getCards('/api/cards');
  const categories = await getCategory();
  const words = await getWordsByCategory(store.getState().admCateg);
  const main = document.querySelector('.words-main') as HTMLElement;

  const wrapperSelect = document.createElement(Tags.DIV);
  wrapperSelect.className = 'words-wrapper-select';
  main.append(wrapperSelect);

  const categoryTitle = document.createElement(Tags.SPAN);
  categoryTitle.className = 'words-category-title';
  categoryTitle.innerHTML = 'Category';
  wrapperSelect.append(categoryTitle);

  const ElemselectTitle = document.createElement('select');
  ElemselectTitle.className = 'words-select-title';
  wrapperSelect.append(ElemselectTitle);

  for (let i = 0; i < categories.length; i++) {
    const optionTitle = document.createElement('option');
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

  // let index;
  // for (let i = 0; i < categories.length; i++) {
  //   if (categories[i].categoryName === store.getState().admCateg) {
  //     index = i
  //   }
  // }
  // const index = cards[CATEGORY].indexOf(store.getState().admCateg);
  selectTitle().value = `${store.getState().admCateg}`;

  pointThisWords(words, wrapperCards);

  handlingClicksWordPage(main, words, categories);
};
