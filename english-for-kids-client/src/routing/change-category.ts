import { getWordsByCategory, getCategory } from '../api/api';
import { handlingClicks } from '../page-works/handling-clicks-categ';
import { head } from '../shareit/head';
import { ElemClasses, LayoutPages, Tags } from '../utils/enums';
import { getMainCateg } from '../utils/get-elems-categ';
import { ICategoriesMongo, IWordsMongo } from '../utils/interfaces';
import { removeClassList } from '../utils/remove-class';
import { updateCardArray } from '../utils/update-card-arr';
import { loader } from './loader';
import { observerPage } from './observer';

export const changeCategory = `${head('categ')}`;
const heightHeader = 71;
const heightCard = 300;
const correctionCoefficient = 4;

const renderNewCard = (main: HTMLElement): void => {
  const newCard = document.createElement(Tags.DIV);
  newCard.className = 'categ-card categ-card-new';
  main.append(newCard);

  const name = document.createElement(Tags.P);
  name.className = 'categ-name categ-name-new';
  name.innerHTML = `Create new Category`;
  newCard.append(name);
};

const renderCategory = (
  begin: number,
  end: number,
  categories: ICategoriesMongo[],
  main: HTMLElement,
  arrWordsInCategory: IWordsMongo[][],
): void => {
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
  updateCardArray(categories);
  const main = getMainCateg();
  const arrWordsOnCategory = [];

  for (let i = 0; i < categories.length; i++) {
    arrWordsOnCategory.push(getWordsByCategory(categories[i].categoryName));
  }
  const arrWordsInCategory = await Promise.all(arrWordsOnCategory);

  const plug = () => {};

  observerPage(
    LayoutPages.CATEGORIES,
    heightHeader,
    heightCard,
    correctionCoefficient,
    categories,
    main,
    plug,
    renderCategory,
    arrWordsInCategory,
  );

  loader(main);
  handlingClicks(main, categories);
};
