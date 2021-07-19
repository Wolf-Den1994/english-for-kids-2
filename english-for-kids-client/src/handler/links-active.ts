import { hiddenStatistic } from '../main-page/render-main';
import { links } from '../sidebar/sidebar';
import { addClassList } from '../utils/add-class';
import { ElemClasses } from '../utils/enums';

export const changeActiveLink = (newActiveLink: HTMLElement | number): void => {
  for (let i = 0; i < links.length; i++)
    links[i].className = ElemClasses.MENU_LINK;
  if (typeof newActiveLink === 'number') {
    for (let i = 0; i < links.length; i++) {
      if (i === newActiveLink) {
        addClassList(links[i], ElemClasses.ACTIVE);
      }
    }
  } else {
    addClassList(newActiveLink, ElemClasses.ACTIVE);
  }
  hiddenStatistic();
};
