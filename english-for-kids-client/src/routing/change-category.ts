import { getWordsByCategory, getCategory } from '../api/api';
import { handlingClicks } from '../page-works/handling-clicks-categ';
import { head } from '../shareit/head';
import { addClassList } from '../utils/add-class';
import { checkClass } from '../utils/check-class';
import { ElemClasses, Tags } from '../utils/enums';
import { getLoader } from '../utils/get-elems';
import { ICategoriesMongo, IWordsMongo } from '../utils/interfaces';
import { removeClassList } from '../utils/remove-class';

export const changeCategory = `${head('categ')}`;

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
  // console.log(begin, end);
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
    // console.log('end', end, 'categories.length', categories.length);
    renderNewCard(main);
  }
};

export const renderCategPage = async (): Promise<void> => {
  removeClassList(document.body, ElemClasses.HIDDEN_MODAL);

  const categories = await getCategory();
  // const words = await getWords();
  const main = document.querySelector('.categ-main') as HTMLElement;
  const arrWordsOnCategory = [];

  for (let i = 0; i < categories.length; i++) {
    // const categLength = await ;
    // console.log(categLength)
    arrWordsOnCategory.push(getWordsByCategory(categories[i].categoryName));
  }
  const arrWordsInCategory = await Promise.all(arrWordsOnCategory);
  // console.log(arrWordsOnCategory)

  let start = Math.ceil((document.documentElement.clientHeight - 71) / 300) + 4;
  let mx = start;

  // console.log(start);
  // console.log(document.documentElement.clientHeight);

  let counterObserver = 0;

  rend(0, start, categories, main, arrWordsInCategory);

  let cards = [...document.querySelectorAll('.categ-card')] as HTMLElement[];

  const observer = new IntersectionObserver(
    (entries, observ) => {
      entries.forEach((entry) => {
        // console.log('entries count');
        if (entry.isIntersecting) {
          counterObserver++;
          removeClassList(entry.target, 'observ');
          // console.log('entry isIntersecting');
          // console.log('start', start, 'mx', mx);
          // console.log(counterObserver + 1, start);
          if (counterObserver + 1 === start) {
            // console.log('mx', mx, 'categories.length', categories.length);
            if (mx < categories.length) {
              addClassList(document.body, 'hidden');

              getLoader().classList.remove('hidden');
              setTimeout(() => {
                getLoader().classList.add('hidden');
                if (mx + mx <= categories.length) {
                  mx += start;
                } else {
                  mx = categories.length;
                }
                rend(start, mx, categories, main, arrWordsInCategory);
                start += start;
              }, 500);
            }
            setTimeout(() => {
              removeClassList(document.body, 'hidden');
              cards = [
                ...document.querySelectorAll('.categ-card'),
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
          // }
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
  });

  const NUMBER_CIRCLE = 3;

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
