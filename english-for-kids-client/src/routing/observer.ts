import { addClassList } from '../utils/add-class';
import { checkClass } from '../utils/check-class';
import { DELAY_LOAD_HIDDEN, DELAY_LOAD_SHOW } from '../utils/consts';
import { ElemClasses, LayoutPages } from '../utils/enums';
import { getLoader } from '../utils/get-elems';
import { getCategCardsAll } from '../utils/get-elems-categ';
import { getWordsCardsAll } from '../utils/get-elems-words';
import { ICategoriesMongo, IWordsMongo } from '../utils/interfaces';
import { removeClassList } from '../utils/remove-class';

export const observerPage = (
  page: string,
  heightHeader: number,
  heightCard: number,
  correctionCoefficient: number,
  arrMongo: IWordsMongo[] | ICategoriesMongo[],
  div: HTMLDivElement | HTMLElement,
  render: (
    begin: number,
    end: number,
    arr: IWordsMongo[],
    div: HTMLDivElement | HTMLElement,
  ) => void | undefined,
  render2?: (
    begin: number,
    end: number,
    arr: ICategoriesMongo[],
    div: HTMLDivElement | HTMLElement,
    arrWordsInCategory: IWordsMongo[][],
  ) => void,
  arrWordsInCategory?: IWordsMongo[][],
): void => {
  const heightClient = document.documentElement.clientHeight;
  let start =
    Math.ceil((heightClient - heightHeader) / heightCard) +
    correctionCoefficient;
  let max = start;

  let counterObserver = 1;

  let cards;
  if (page === LayoutPages.WORDS) {
    render(0, start, arrMongo as IWordsMongo[], div);
    cards = [...getWordsCardsAll()] as HTMLElement[];
  } else if (arrWordsInCategory && render2) {
    render2(0, start, arrMongo as ICategoriesMongo[], div, arrWordsInCategory);
    cards = [...getCategCardsAll()] as HTMLElement[];
  }

  const observer = new IntersectionObserver(
    (entries, observ) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          removeClassList(entry.target, ElemClasses.OBSERV);
          if (++counterObserver === start) {
            if (max < arrMongo.length) {
              addClassList(document.body, ElemClasses.HIDDEN);
              removeClassList(getLoader(), ElemClasses.HIDDEN);

              setTimeout(() => {
                addClassList(getLoader(), ElemClasses.HIDDEN);
                if (max + max <= arrMongo.length) {
                  max += start;
                } else {
                  max = arrMongo.length;
                }

                if (page === LayoutPages.WORDS) {
                  render(start, max, arrMongo as IWordsMongo[], div);
                } else if (render2 && arrWordsInCategory) {
                  render2(
                    start,
                    max,
                    arrMongo as ICategoriesMongo[],
                    div,
                    arrWordsInCategory,
                  );
                }
                start += start;
              }, DELAY_LOAD_SHOW);
            }
            setTimeout(() => {
              removeClassList(document.body, ElemClasses.HIDDEN);
              if (page === LayoutPages.WORDS) {
                cards = [...getWordsCardsAll()] as HTMLElement[];
              } else {
                cards = [...getCategCardsAll()] as HTMLElement[];
              }
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

  if (cards) {
    cards.forEach((card) => {
      if (checkClass(card, ElemClasses.OBSERV)) {
        observer.observe(card);
      }
    });
  }
};
