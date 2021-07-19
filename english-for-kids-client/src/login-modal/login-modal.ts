import { loginHandler } from '../api/api';
import { onNavigate } from '../routing/routes';
import { addClassList } from '../utils/add-class';
import { checkClass } from '../utils/check-class';
import { LOCAL_STORAGE_USER_ADMIN } from '../utils/consts';
import { ElemClasses, Events, Tags } from '../utils/enums';
import { getModal, header, overlay } from '../utils/get-elems';
import { removeClassList } from '../utils/remove-class';

const renderLoginModal = () => {
  const modal = document.createElement(Tags.DIV);
  modal.className = 'login-modal';
  header().append(modal);

  const modalTitle = document.createElement(Tags.TITLE2);
  modalTitle.className = 'login-modal-title';
  modalTitle.innerHTML = 'Login';
  modal.append(modalTitle);

  const divInputs = document.createElement(Tags.DIV);
  divInputs.className = 'login-modal-inputs';
  modal.append(divInputs);

  const inputLogin = document.createElement(Tags.INPUT);
  inputLogin.type = 'text';
  inputLogin.placeholder = 'Enter login ("admin")';
  inputLogin.className = 'input-login';
  divInputs.append(inputLogin);

  const inputPassword = document.createElement(Tags.INPUT);
  inputPassword.type = 'password';
  inputPassword.placeholder = 'Enter password ("admin")';
  inputPassword.className = 'input-password';
  divInputs.append(inputPassword);

  const divBtns = document.createElement(Tags.DIV);
  divBtns.className = 'login-modal-btns';
  modal.append(divBtns);

  const btnCancel = document.createElement(Tags.BUTTON);
  btnCancel.className = 'btn btn-modal btn-cancel';
  btnCancel.innerHTML = 'cancel';
  divBtns.append(btnCancel);

  const btnLogin = document.createElement(Tags.BUTTON);
  btnLogin.className = 'btn btn-modal btn-login';
  btnLogin.innerHTML = 'login';
  divBtns.append(btnLogin);
};

const removeClassHiddenModal = () => {
  removeClassList(overlay(), ElemClasses.HIDDEN_MODAL);
  removeClassList(document.body, ElemClasses.HIDDEN_MODAL);
};

const closeLoginModal = () => {
  const elems = getModal();
  header().children[2].remove();
  removeClassHiddenModal();
  elems.modal.removeEventListener(Events.CLICK, selectionHandlerModal);
  overlay().removeEventListener(Events.CLICK, closeLoginModal);
};

const checkUser = async (login: string, password: string): Promise<void> => {
  if (login && password) {
    const userData = await loginHandler(login, password);
    if (userData && userData.token) {
      localStorage.setItem(LOCAL_STORAGE_USER_ADMIN, userData.token);
      onNavigate('/category');
    }
  }
};

const selectionHandlerModal = (event: Event) => {
  const targetElem = event.target as HTMLElement;
  const elems = getModal();
  if (checkClass(targetElem, ElemClasses.BTN_CANCEL)) {
    closeLoginModal();
  } else if (checkClass(targetElem, ElemClasses.BTN_LOGIN)) {
    checkUser(elems.inputLogin.value, elems.inputPassword.value);
  }
};

export const openLoginModal = async (): Promise<void> => {
  const admin = localStorage.getItem(LOCAL_STORAGE_USER_ADMIN);

  if (admin) {
    onNavigate('/category');
  } else {
    renderLoginModal();
    addClassList(overlay(), ElemClasses.HIDDEN_MODAL);
    addClassList(document.body, ElemClasses.HIDDEN_MODAL);

    const elems = getModal();

    elems.modal.addEventListener(Events.CLICK, selectionHandlerModal);
    overlay().addEventListener(Events.CLICK, closeLoginModal);
  }
};
