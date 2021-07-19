import { workCategPage, workWordsPage } from '../page-works/work-categ';
import { store } from '../store/store';
import { changeCategory, renderCategPage } from './change-category';
import { changeWords, renderWordsPage } from './change-words';
import { changeHome } from './home';

interface IRoutes {
  [key: string]: string | void;
}

let nestedRoutsByWords = `/${store.getState().admCateg.toLowerCase()}/words`;

const routes: IRoutes = {
  '/': changeHome(),
  '/category': changeCategory,
  [nestedRoutsByWords]: changeWords,
};

if (typeof routes[window.location.pathname] === 'string') {
  document.body.innerHTML = routes[window.location.pathname] as string;
}

export const onNavigate = (pathname: string): void => {
  nestedRoutsByWords = `/${store.getState().admCateg.toLowerCase()}/words`;
  routes[nestedRoutsByWords] = changeWords;
  window.history.pushState({}, pathname, window.location.origin + pathname);
  if (typeof routes[window.location.pathname] === 'string') {
    // console.log(routes)
    // console.log(routes[pathname])
    document.body.innerHTML = routes[pathname] as string;
  } else {
    document.body.innerHTML = '';
    changeHome();
  }
  if (pathname === '/category') {
    renderCategPage();
    workCategPage();
  }
  if (pathname === `/${store.getState().admCateg.toLowerCase()}/words`) {
    renderWordsPage();
    workWordsPage();
  }
};
