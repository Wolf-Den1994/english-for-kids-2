// import cards from '../cards';
import { getCategory } from '../api/api';
import { objNumberPage } from '../control/obj-page';
import { ElemClasses, Tags } from '../utils/enums';

let isFirstLink = true;

const FIRST_PAGE = 'Main page';
const LAST_PAGE = 'Statistic';
const LOGIN = 'Login';

export const list: string[] = [];

export const links: HTMLAnchorElement[] = [];

export const renderSidebar = async (): Promise<void> => {
  const categories = await getCategory();
  list.length = 0;

  for (let i = 0; i < categories.length; i++) {
    list.push(categories[i].categoryName);
  }

  list.unshift(FIRST_PAGE);
  list.push(LAST_PAGE);
  list.push(LOGIN);

  objNumberPage.statistic = list.length - 2;
  objNumberPage.difficult = list.length - 1;
  objNumberPage.login = list.length;
  // console.log(objNumberPage);

  const sidebar = document.createElement(Tags.ASIDE);
  sidebar.className = `sidebar ${ElemClasses.HIDDEN}`;
  document.body.append(sidebar);

  // console.log(sidebar);
  sidebar.innerHTML = '';

  const menu = document.createElement(Tags.UL);
  menu.className = 'menu';
  sidebar.append(menu);

  for (let i = 0; i < list.length; i++) {
    const link = document.createElement(Tags.LINK);
    link.className = `${ElemClasses.MENU_LINK}`;
    link.href = '#';
    link.innerHTML = `${list[i]}`;
    if (isFirstLink) {
      link.className = `${ElemClasses.MENU_LINK} ${ElemClasses.ACTIVE}`;
      isFirstLink = false;
    }
    links.push(link);
    menu.append(link);
  }
};
