import { createCategory, deleteCategory, putCategoryByName } from '../api/api';
import { onNavigate } from '../routing/routes';
import { changeAdminCategory } from '../store/actions';
import { store } from '../store/store';
import { addClassList } from '../utils/add-class';
import { checkClass } from '../utils/check-class';
import { DUPLICATE } from '../utils/consts';
import {
  ElemClasses,
  Events,
  FormDataNames,
  RoutNames,
  Tags,
  TopLayoutView,
} from '../utils/enums';
import {
  getCategCardsAll,
  inputFile,
  inputText,
} from '../utils/get-elems-categ';
import { ICategoriesMongo } from '../utils/interfaces';
import { removeClassList } from '../utils/remove-class';

const renderTopLayer = (card: HTMLDivElement, action: string): void => {
  const divsCard = getCategCardsAll();
  divsCard.forEach((div) => {
    const isTopLayer = div.lastElementChild as HTMLElement;
    if (checkClass(isTopLayer, ElemClasses.CATEG_TOP_LAYER)) {
      isTopLayer.remove();
      removeClassList(div, ElemClasses.CATEG_HIDDEN);
    }
  });

  addClassList(card, ElemClasses.CATEG_HIDDEN);

  const topLayer = document.createElement(Tags.DIV);
  topLayer.className = 'categ-top-layer';
  card.append(topLayer);

  const input = document.createElement(Tags.INPUT);
  input.type = 'text';
  input.placeholder = 'Category name';
  input.className = 'categ-top-layer-input';
  topLayer.append(input);

  const divInputImage = document.createElement(Tags.DIV);
  divInputImage.className = 'categ-top-layer-image-wrapper-input';
  topLayer.append(divInputImage);

  const inputImage = document.createElement(Tags.INPUT);
  inputImage.className = 'categ-top-layer-image-input';
  inputImage.type = 'file';
  divInputImage.append(inputImage);

  const btnImage = document.createElement(Tags.SPAN);
  btnImage.innerHTML = 'Select file';
  btnImage.className = 'categ-top-layer-image-btn';
  divInputImage.append(btnImage);

  const divBtns = document.createElement(Tags.DIV);
  divBtns.className = 'categ-top-layer-btns';
  topLayer.append(divBtns);

  const btnCancel = document.createElement(Tags.BUTTON);
  btnCancel.className = 'categ-top-layer-btn-cancel';
  btnCancel.innerHTML = 'Cancel';
  divBtns.append(btnCancel);

  const btnCreate = document.createElement(Tags.BUTTON);
  btnCreate.className =
    action === TopLayoutView.UPDATE
      ? 'categ-top-layer-btn-update'
      : 'categ-top-layer-btn-create';
  btnCreate.innerHTML = action === TopLayoutView.UPDATE ? 'Update' : 'Create';
  divBtns.append(btnCreate);
};

const updateCategoryName = async (card: HTMLElement): Promise<void> => {
  if (inputFile() && inputText()) {
    const formData = new FormData();

    const image = inputFile();
    const srcImage = image.files as FileList;
    const imageFile = srcImage[0];

    formData.set(FormDataNames.NAME, inputText().value);
    formData.set(FormDataNames.IMAGE, imageFile);

    const response = await putCategoryByName(formData, card.id);
    if (response) {
      onNavigate(RoutNames.CATEGORY);
    }
  }
};

const deleteCategoryByName = async (card: HTMLElement): Promise<void> => {
  const response = await deleteCategory(card.id);
  if (response) {
    onNavigate(RoutNames.CATEGORY);
  }
};

const createCategori = async (): Promise<void> => {
  if (inputFile() && inputText()) {
    const formData = new FormData();

    const image = inputFile();
    const srcImage = image.files as FileList;
    const imageFile = srcImage[0];

    formData.set(FormDataNames.NAME, inputText().value);
    formData.set(FormDataNames.IMAGE, imageFile);
    const response = await createCategory(formData, inputText().value);
    if (response === DUPLICATE) {
      inputText().value = DUPLICATE;
      addClassList(inputText(), ElemClasses.DUPLICATE);
    } else {
      removeClassList(inputFile(), ElemClasses.DUPLICATE);
      if (response) {
        onNavigate(RoutNames.CATEGORY);
      }
    }
  }
};

const handlerClickPageCategory = (
  cards: ICategoriesMongo[],
  event: Event,
): void => {
  const target = event.target as HTMLElement;
  const card = target.closest(`.${ElemClasses.CATEG_CARD}`) as HTMLDivElement;
  if (card) {
    const idCard = card.id;
    if (checkClass(target, ElemClasses.CATEG_BTN_ADD)) {
      store.dispatch(changeAdminCategory(`${idCard}`));
      onNavigate(
        `/${store.getState().admCateg.toLowerCase()}${RoutNames.WORDS}`,
      );
    } else if (checkClass(target, ElemClasses.CATEG_BTN_UPDATE)) {
      renderTopLayer(card, TopLayoutView.UPDATE);
    } else if (checkClass(target, ElemClasses.CATEG_TOP_LAYER_BTN_CANCEL)) {
      const topLayer = card.lastElementChild as HTMLElement;
      topLayer.remove();
    } else if (checkClass(target, ElemClasses.CATEG_TOP_LAYER_BTN_UPDATE)) {
      updateCategoryName(card);
    } else if (checkClass(target, ElemClasses.CATEG_BTN_REMOVE)) {
      deleteCategoryByName(card);
    } else if (checkClass(target, ElemClasses.CATEG_CARD_NEW)) {
      renderTopLayer(card, TopLayoutView.CREATE);
    } else if (checkClass(target, ElemClasses.CATEG_TOP_LAYER_BTN_CREATE)) {
      createCategori();
    }
  }
};

export const handlingClicks = (
  main: HTMLElement,
  cards: ICategoriesMongo[],
): void => {
  main.addEventListener(
    Events.CLICK,
    handlerClickPageCategory.bind(null, cards),
  );
};
