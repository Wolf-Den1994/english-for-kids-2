import { onNavigate } from '../routing/routes';
import { store } from '../store/store';
import { addClassList } from '../utils/add-class';
import { LOCAL_STORAGE_USER_ADMIN } from '../utils/consts';
import { Events } from '../utils/enums';
import { linkCateg, linkOut, linkWords } from '../utils/get-elems-categ';
import { removeClassList } from '../utils/remove-class';

export const rederectOnHome = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_USER_ADMIN);
  document.body.innerHTML = '';
  onNavigate('/');
};

export const rederectOnCategPage = (): void => {
  document.body.innerHTML = '';
  onNavigate('/category');
};

export const rederectOnWordsPage = (): void => {
  document.body.innerHTML = '';
  onNavigate(`/${store.getState().admCateg.toLowerCase()}/words`);
};

const addListeners = () => {
  linkOut().addEventListener(Events.CLICK, rederectOnHome);
  linkCateg().addEventListener(Events.CLICK, rederectOnCategPage);
  linkWords().addEventListener(Events.CLICK, rederectOnWordsPage);
};

export const workCategPage = (): void => {
  addListeners();
  removeClassList(linkWords(), 'categ-link-active');
  addClassList(linkCateg(), 'categ-link-active');
};

export const workWordsPage = (): void => {
  addListeners();
  removeClassList(linkCateg(), 'categ-link-active');
  addClassList(linkWords(), 'categ-link-active');
};
