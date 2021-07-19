import { createCategory, deleteCategory, putCategoryByName } from '../api/api';
import { onNavigate } from '../routing/routes';
import { changeAdminCategory } from '../store/actions';
import { store } from '../store/store';
import { addClassList } from '../utils/add-class';
import { checkClass } from '../utils/check-class';
import { Events, Tags } from '../utils/enums';
import { inputFile, inputText } from '../utils/get-elems-categ';
import { ICategoriesMongo } from '../utils/interfaces';
import { removeClassList } from '../utils/remove-class';

const renderTopLayer = (card: HTMLDivElement, action: string) => {
  const divsCard = document.querySelectorAll('.categ-card');
  divsCard.forEach((div) => {
    const isTopLayer = div.lastElementChild as HTMLElement;
    if (checkClass(isTopLayer, 'categ-top-layer')) {
      isTopLayer.remove();
      removeClassList(div, 'categ-hidden');
    }
  });

  addClassList(card, 'categ-hidden');

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
    action === 'update'
      ? 'categ-top-layer-btn-update'
      : 'categ-top-layer-btn-create';
  btnCreate.innerHTML = action === 'update' ? 'Update' : 'Create';
  divBtns.append(btnCreate);
};

const updateCategoryName = async (card: HTMLElement) => {
  // if (inputText().value) {
  if (inputFile() && inputText()) {
    const formData = new FormData();

    const image = inputFile();
    const srcImage = image.files as FileList;
    const imageFile = srcImage[0];

    formData.set('name', inputText().value);
    formData.set('image', imageFile);

    const response = await putCategoryByName(formData, card.id);
    if (response) {
      onNavigate('/category');
    }
  }
  // }
};

const deleteCategoryByName = async (card: HTMLElement) => {
  const response = await deleteCategory(card.id);
  if (response) {
    onNavigate('/category');
  }
};

const createCategori = async () => {
  if (inputFile() && inputText()) {
    const formData = new FormData();

    const image = inputFile();
    const srcImage = image.files as FileList;
    const imageFile = srcImage[0];
    // console.log(imageSrc);

    formData.set('name', inputText().value);
    formData.set('image', imageFile);
    const response = await createCategory(formData, inputText().value);
    if (response === 'duplicate') {
      inputText().value = 'duplicate';
      addClassList(inputText(), 'duplicate');
    } else {
      removeClassList(inputFile(), 'duplicate');
      if (response) {
        onNavigate('/category');
      }
    }
  }
};

const handlerClickPageCategory = (cards: ICategoriesMongo[], event: Event) => {
  const target = event.target as HTMLElement;
  const card = target.closest('.categ-card') as HTMLDivElement;
  if (card) {
    const idCard = card.id;
    // const index = cards[CATEGORY].indexOf(idCard);
    if (checkClass(target, 'categ-bnt-add')) {
      store.dispatch(changeAdminCategory(`${idCard}`));
      onNavigate(`/${store.getState().admCateg.toLowerCase()}/words`);
    } else if (checkClass(target, 'categ-bnt-update')) {
      renderTopLayer(card, 'update');
      // cards[CATEGORY].map(item => item = item === idCard ? idCard : item)
    } else if (checkClass(target, 'categ-top-layer-btn-cancel')) {
      const topLayer = card.lastElementChild as HTMLElement;
      topLayer.remove();
    } else if (checkClass(target, 'categ-top-layer-btn-update')) {
      updateCategoryName(card);
    } else if (checkClass(target, 'categ-bnt-remove')) {
      deleteCategoryByName(card);
    } else if (checkClass(target, 'categ-card-new')) {
      renderTopLayer(card, 'create');
    } else if (checkClass(target, 'categ-top-layer-btn-create')) {
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
