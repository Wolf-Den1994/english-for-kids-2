import { getWordsByCategory, getCategory } from '../api/api';
import { handlingClicks } from '../page-works/handling-clicks-categ';
import { head } from '../shareit/head';
import { addClassList } from '../utils/add-class';
import { checkClass } from '../utils/check-class';
import {
  DELAY_LOAD_HIDDEN,
  DELAY_LOAD_SHOW,
  NUMBER_CIRCLE,
} from '../utils/consts';
import { ElemClasses, Tags } from '../utils/enums';
import { getLoader } from '../utils/get-elems';
import { getCategCardsAll, getMainCateg } from '../utils/get-elems-categ';
import { ICategoriesMongo, IWordsMongo } from '../utils/interfaces';
import { removeClassList } from '../utils/remove-class';

export const changeCategory = `${head('categ')}`;
const heightHeader = 71;
const heightCard = 300;
const correctionCoefficient = 4;

const renderNewCard = (main: HTMLElement) => {
  const newCard = document.createElement(Tags.DIV);
  newCard.className = 'categ-card categ-card-new';
  main.append(newCard);

  const name = document.createElement(Tags.P);
  name.className = 'categ-name categ-name-new';
  name.innerHTML = `Create new Category`;
  newCard.append(name);
};

const rend = (
  begin: number,
  end: number,
  categories: ICategoriesMongo[],
  main: HTMLElement,
  arrWordsInCategory: IWordsMongo[][],
) => {
  for (let i = begin; i < end; i++) {
    const card = document.createElement(Tags.DIV);
    card.className = 'categ-card observ';
    card.id = `${categories[i].categoryName}`;
    main.append(card);

    const name = document.createElement(Tags.P);
    name.className = 'categ-name';
    name.innerHTML = `${categories[i].categoryName}`;
    card.append(name);

    const count = document.createElement(Tags.P);
    count.className = 'categ-count';
    count.innerHTML = `
        <span class="categ-words">WORDS:</span> 
        ${arrWordsInCategory[i].length}
      `;
    card.append(count);

    const divBtns = document.createElement(Tags.DIV);
    divBtns.className = 'categ-btns';
    card.append(divBtns);

    const btnUpdate = document.createElement(Tags.BUTTON);
    btnUpdate.className = 'categ-bnt-update';
    btnUpdate.innerHTML = 'Update';
    divBtns.append(btnUpdate);

    const btnAdd = document.createElement(Tags.BUTTON);
    btnAdd.className = 'categ-bnt-add';
    btnAdd.innerHTML = 'Add word';
    divBtns.append(btnAdd);

    const btnRemove = document.createElement(Tags.SPAN);
    btnRemove.className = 'categ-bnt-remove';
    card.append(btnRemove);
  }

  if (end >= categories.length) {
    renderNewCard(main);
  }
};

export const renderCategPage = async (): Promise<void> => {
  removeClassList(document.body, ElemClasses.HIDDEN_MODAL);

  const categories = await getCategory();
  const main = getMainCateg();
  const arrWordsOnCategory = [];

  for (let i = 0; i < categories.length; i++) {
    arrWordsOnCategory.push(getWordsByCategory(categories[i].categoryName));
  }
  const arrWordsInCategory = await Promise.all(arrWordsOnCategory);

  const heightClient = document.documentElement.clientHeight;
  let start =
    Math.ceil((heightClient - heightHeader) / heightCard) +
    correctionCoefficient;
  let mx = start;

  let counterObserver = 0;

  rend(0, start, categories, main, arrWordsInCategory);

  let cards = [...getCategCardsAll()] as HTMLElement[];

  const observer = new IntersectionObserver(
    (entries, observ) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          counterObserver++;
          removeClassList(entry.target, ElemClasses.OBSERV);
          if (counterObserver + 1 === start) {
            if (mx < categories.length) {
              addClassList(document.body, ElemClasses.HIDDEN);
              removeClassList(getLoader(), ElemClasses.HIDDEN);

              setTimeout(() => {
                addClassList(getLoader(), ElemClasses.HIDDEN);
                if (mx + mx <= categories.length) {
                  mx += start;
                } else {
                  mx = categories.length;
                }
                rend(start, mx, categories, main, arrWordsInCategory);
                start += start;
              }, DELAY_LOAD_SHOW);
            }
            setTimeout(() => {
              removeClassList(document.body, ElemClasses.HIDDEN);
              cards = [...getCategCardsAll()] as HTMLElement[];
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

  const loaderScroll = document.createElement(Tags.DIV);
  loaderScroll.className = 'loader hidden';
  main.append(loaderScroll);

  for (let i = 0; i < NUMBER_CIRCLE; i++) {
    const circle = document.createElement(Tags.DIV);
    circle.className = 'circle';
    loaderScroll.append(circle);
  }

  handlingClicks(main, categories);
};
