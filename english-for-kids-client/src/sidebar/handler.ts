import { renderCategory } from '../category/category';
import { fullCards } from '../control/obj-statistic';
import { changeActiveLink } from '../handler/links-active';
import { renderStatistic } from '../statistic/render-statistic';
import { changePage } from '../store/actions';
import { store } from '../store/store';
import { renderSubject } from '../subject/render';
import { addClassList } from '../utils/add-class';
import { checkClass } from '../utils/check-class';
import { ElemClasses, Events, NumberPage, Order } from '../utils/enums';
import { removeClassList } from '../utils/remove-class';
import { updateClassList } from '../utils/update-class';
import { list } from './sidebar';
import { openLoginModal } from '../login-modal/login-modal';
import { input, label, menu, overlay, sidebar } from '../utils/get-elems';
import { objNumberPage } from '../control/obj-page';

export const handlerMenu = async (event: Event): Promise<void> => {
  const target = event.target as HTMLElement;
  if (checkClass(target, ElemClasses.MENU_LINK)) {
    const index = list.indexOf(target.innerHTML);
    changeActiveLink(target);
    if (index === NumberPage.MAIN) {
      store.dispatch(changePage(NumberPage.MAIN));
      renderCategory();
    } else if (index <= list.length - 3) {
      store.dispatch(changePage(index));
      await renderSubject(store.getState().page);
    } else if (index === list.length - 2) {
      store.dispatch(changePage(objNumberPage.statistic));
      renderStatistic(fullCards, Order.DESC);
    } else {
      store.dispatch(changePage(objNumberPage.login));
      await openLoginModal();
    }
    closeSidebar();
  }
};

export const handlerSideBar = (event: Event): void => {
  event.preventDefault();
  if (checkClass(sidebar(), ElemClasses.HIDDEN)) {
    openSidebar();
  } else {
    closeSidebar();
  }
};

function openSidebar(): void {
  input().checked = true;
  updateClassList(label(), sidebar(), ElemClasses.HIDDEN);
  addClassList(overlay(), ElemClasses.HIDDEN);
  addClassList(document.body, ElemClasses.HIDDEN);
  overlay().addEventListener(Events.CLICK, handlerSideBar);
  menu().addEventListener(Events.CLICK, handlerMenu);
}

function closeSidebar(): void {
  removeClassList(document.body, ElemClasses.HIDDEN);
  if (store.getState().page < list.length - 1) {
    input().checked = false;
    updateClassList(sidebar(), label(), ElemClasses.HIDDEN);
    removeClassList(overlay(), ElemClasses.HIDDEN);
    overlay().removeEventListener(Events.CLICK, handlerSideBar);
    menu().removeEventListener(Events.CLICK, handlerMenu);
  }
}
