import { renderCategory } from '../category/category';
import { getFullCardsNow } from '../control/obj-statistic';
import { removeFinal } from '../finish/finish';
import { renderFooter } from '../footer/footer';
import { selectionHandler } from '../handler/handler';
import { switchState } from '../handler/switch-state';
import { renderBtnSidebar } from '../header/btn-sidebar';
import { renderHeader } from '../header/header';
import { renderSwitcher } from '../header/switcher';
import { renderOverlay } from '../overlay/overlay';
import { renderRoot } from '../root/root';
import { handlerMenu, handlerSideBar } from '../sidebar/handler';
import { renderSidebar } from '../sidebar/sidebar';
import { addClassList } from '../utils/add-class';
import { LOCAL_STORAGE_USER_ADMIN } from '../utils/consts';
import { ElemClasses, Events } from '../utils/enums';
import { inputSwitcher, label, menu, root } from '../utils/get-elems';
import { removeClassList } from '../utils/remove-class';

export const hiddenStatistic = (): void => {
  const links = document.querySelectorAll('.menu-link');
  const link = links[links.length - 2];
  addClassList(link, 'disabled');
};

export const renderMain = async (): Promise<void> => {
  const checkUser = localStorage.getItem(LOCAL_STORAGE_USER_ADMIN);
  if (checkUser) localStorage.removeItem(LOCAL_STORAGE_USER_ADMIN);
  renderHeader();
  renderBtnSidebar();
  renderSwitcher();
  await renderSidebar();
  renderRoot();
  renderCategory();
  renderOverlay();
  renderFooter();
  getFullCardsNow();
  removeClassList(document.body, ElemClasses.HIDDEN_MODAL);
  label().addEventListener(Events.CLICK, handlerSideBar);
  menu().addEventListener(Events.CLICK, handlerMenu);
  inputSwitcher().addEventListener(Events.CHANGE, switchState);
  root().addEventListener(Events.CLICK, selectionHandler);
  removeFinal();
  hiddenStatistic();
};
