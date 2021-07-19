import { objNumberPage } from '../control/obj-page';
import { fullCards } from '../control/obj-statistic';
import { objApp } from '../control/objs';
import { changePage } from '../store/actions';
import { store } from '../store/store';
import { cleanField, render } from '../subject/render';
import { Tags } from '../utils/enums';
import { root } from '../utils/get-elems';
import { IWordsMongo } from '../utils/interfaces';

export const copyFullCards: IWordsMongo[] = [];
export const arrDifficultWord: IWordsMongo[] = [];
const NUMBER_CARDS_DISPLAYED = 8;

export const renderTrainDifficult = async (): Promise<void> => {
  // const words = await getWords();
  copyFullCards.length = 0;
  arrDifficultWord.length = 0;
  let count = 0;
  copyFullCards.push(...fullCards.slice());
  // console.log(copyFullCards);

  copyFullCards.sort((a, b) => (a.fails > b.fails ? -1 : 1));
  copyFullCards.forEach((item) => {
    if (item.fails > 0 && count !== NUMBER_CARDS_DISPLAYED) {
      arrDifficultWord.push(item);
      count++;
    }
  });

  store.dispatch(changePage(objNumberPage.difficult));
  cleanField();

  if (count > 0) {
    objApp.empryDifficult = false;
    render(
      'difficult',
      objNumberPage.difficult,
      arrDifficultWord,
      'Train Diffucultt',
    );
  } else {
    objApp.empryDifficult = true;
    const diffDiv = document.createElement(Tags.DIV);
    diffDiv.className = 'diff';
    root().append(diffDiv);

    const empryDiv = document.createElement(Tags.DIV);
    empryDiv.className = 'empry';
    diffDiv.append(empryDiv);
  }
};
