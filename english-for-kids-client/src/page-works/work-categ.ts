import { onNavigate } from '../routing/routes';
import { store } from '../store/store';
import { addClassList } from '../utils/add-class';
import { LOCAL_STORAGE_USER_ADMIN } from '../utils/consts';
import { ElemClasses, Events, RoutNames } from '../utils/enums';
import { linkCateg, linkOut, linkWords } from '../utils/get-elems-categ';
import { removeClassList } from '../utils/remove-class';

export const rederectOnHome = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_USER_ADMIN);
  document.body.innerHTML = '';
  onNavigate(RoutNames.MAIN);
};

export const rederectOnCategPage = (): void => {
  document.body.innerHTML = '';
  onNavigate(RoutNames.CATEGORY);
};

export const rederectOnWordsPage = (): void => {
  document.body.innerHTML = '';
  onNavigate(`/${store.getState().admCateg.toLowerCase()}${RoutNames.WORDS}`);
};

const addListeners = (): void => {
  linkOut().addEventListener(Events.CLICK, rederectOnHome);
  linkCateg().addEventListener(Events.CLICK, rederectOnCategPage);
  linkWords().addEventListener(Events.CLICK, rederectOnWordsPage);
};

export const workCategPage = (): void => {
  addListeners();
  removeClassList(linkWords(), ElemClasses.CATEG_LINK_ACTIVE);
  addClassList(linkCateg(), ElemClasses.CATEG_LINK_ACTIVE);
};

export const workWordsPage = (): void => {
  addListeners();
  removeClassList(linkCateg(), ElemClasses.CATEG_LINK_ACTIVE);
  addClassList(linkWords(), ElemClasses.CATEG_LINK_ACTIVE);
};
