import { getWordsByCategory } from '../api/api';
import { objGame } from '../control/obj-game';
import { objNumberPage } from '../control/obj-page';
import { objApp } from '../control/objs';
import { list } from '../sidebar/sidebar';
import { changeMode } from '../store/actions';
import { store } from '../store/store';
import { arrDifficultWord } from '../train-difficult/render-train-difficult';
import { addClassList } from '../utils/add-class';
import { changeClassList } from '../utils/change-class';
import { ElemClasses, StateApp } from '../utils/enums';
import { getArrsElem } from '../utils/get-elems';
import { IHTMLElems, IWordsMongo } from '../utils/interfaces';
import { removeClassList } from '../utils/remove-class';

const isPageCategory = (): boolean =>
  store.getState().page !== objNumberPage.main &&
  store.getState().page !== objNumberPage.statistic &&
  store.getState().page !== objNumberPage.difficult;

const classIteration = (
  fn: (
    elemToAddClass: HTMLButtonElement | HTMLElement | Element,
    elemClass: string,
  ) => void,
  elems: IHTMLElems,
  arr: IWordsMongo[],
  classChanger?: (i: number) => void,
) => {
  for (let i = 0; i < arr.length; i++) {
    fn(elems.arrSvgs[i], ElemClasses.PLAY);
    fn(elems.arrParags[i], ElemClasses.PLAY);
    fn(elems.arrImages[i], ElemClasses.PLAY);
    classChanger && classChanger(i);
  }
};

const changeStateOnTrain = (arr: IWordsMongo[], elems: IHTMLElems): void => {
  store.dispatch(changeMode(StateApp.TRAIN));
  elems.score.innerHTML = '';
  objGame.counterErrors = 0;
  addClassList(elems.btnStartGame, ElemClasses.PLAY);
  changeClassList(
    elems.btnStartGame,
    ElemClasses.REPEAT,
    ElemClasses.BTN_START_GAME,
  );
  classIteration(removeClassList, elems, arr, (i: number) =>
    removeClassList(elems.arrImages[i], ElemClasses.GREAT),
  );
};

const changeStateOnPlay = (arr: IWordsMongo[], elems: IHTMLElems): void => {
  store.dispatch(changeMode(StateApp.PLAY));
  removeClassList(elems.btnStartGame, ElemClasses.PLAY);
  classIteration(addClassList, elems, arr);
};

export const switchState = async (event: Event): Promise<void> => {
  const elems = getArrsElem();
  const target = event.target as HTMLInputElement;
  const categoryName = list[store.getState().page];
  const words = await getWordsByCategory(categoryName);
  if (target.checked) {
    store.dispatch(changeMode(StateApp.TRAIN));
    if (
      store.getState().page === objNumberPage.difficult &&
      !objApp.empryDifficult
    ) {
      changeStateOnTrain(arrDifficultWord, elems);
    }
    if (isPageCategory()) {
      changeStateOnTrain(words, elems);
    }
  } else {
    store.dispatch(changeMode(StateApp.PLAY));
    if (
      store.getState().page === objNumberPage.difficult &&
      !objApp.empryDifficult
    ) {
      changeStateOnPlay(arrDifficultWord, elems);
    }
    if (isPageCategory()) {
      changeStateOnPlay(words, elems);
    }
  }
};
