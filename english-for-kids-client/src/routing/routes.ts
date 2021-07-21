import { renderMain } from '../main-page/render-main';
import { workCategPage, workWordsPage } from '../page-works/work-categ';
import { store } from '../store/store';
import { RoutNames } from '../utils/enums';
import { IRoutes } from '../utils/interfaces';
import { changeCategory, renderCategPage } from './change-category';
import { changeWords, renderWordsPage } from './change-words';

let nestedRoutsByWords = `/${store.getState().admCateg.toLowerCase()}${
  RoutNames.WORDS
}`;

const routes: IRoutes = {
  '/': renderMain(),
  '/category': changeCategory,
  [nestedRoutsByWords]: changeWords,
};

if (typeof routes[window.location.pathname] === 'string') {
  document.body.innerHTML = routes[window.location.pathname] as string;
}

export const onNavigate = (pathname: string): void => {
  nestedRoutsByWords = `/${store.getState().admCateg.toLowerCase()}${
    RoutNames.WORDS
  }`;
  routes[nestedRoutsByWords] = changeWords;
  window.history.pushState({}, pathname, window.location.origin + pathname);
  if (typeof routes[window.location.pathname] === 'string') {
    document.body.innerHTML = routes[pathname] as string;
  } else {
    document.body.innerHTML = '';
    renderMain();
  }
  if (pathname === RoutNames.CATEGORY) {
    renderCategPage();
    workCategPage();
  }
  if (
    pathname === `/${store.getState().admCateg.toLowerCase()}${RoutNames.WORDS}`
  ) {
    renderWordsPage();
    workWordsPage();
  }
};
