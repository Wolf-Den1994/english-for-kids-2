import { createWord, deleteWord, putWordById } from '../api/api';
import { sound } from '../play/sound';
import { allWords } from '../routing/change-words';
import { onNavigate } from '../routing/routes';
import { store } from '../store/store';
import { addClassList } from '../utils/add-class';
import { checkClass } from '../utils/check-class';
import { DUPLICATE } from '../utils/consts';
import {
  ElemClasses,
  Events,
  FormDataNames,
  IndexSounds,
  RoutNames,
  Tags,
  TopLayoutView,
} from '../utils/enums';
import {
  getInputImage,
  getInputSound,
  getInputTranslation,
  getInputWord,
  getWordsCardsAll,
  selectTitle,
} from '../utils/get-elems-words';
import { ICategoriesMongo, IWordsMongo } from '../utils/interfaces';
import { removeClassList } from '../utils/remove-class';

const renderTopLayer = (
  card: HTMLElement,
  action: string,
  words: IWordsMongo[],
): void => {
  const divsCard = getWordsCardsAll();
  divsCard.forEach((div) => {
    const isTopLayer = div.lastElementChild as HTMLElement;
    if (checkClass(isTopLayer, ElemClasses.WORD_TOP_LAYER)) {
      isTopLayer.remove();
      removeClassList(div, ElemClasses.WORD_HIDDEN);
    }
  });

  const objWordDesired = words.find((item) => item.word === card.id);

  addClassList(card, ElemClasses.WORD_HIDDEN);

  const topLayer = document.createElement(Tags.DIV);
  topLayer.className = ElemClasses.WORD_TOP_LAYER;
  card.append(topLayer);

  const inputWord = document.createElement(Tags.INPUT);
  inputWord.type = 'text';
  inputWord.placeholder = 'Word';
  inputWord.value = `${objWordDesired ? objWordDesired.word : ''}`;
  inputWord.className = 'word-top-layer-input-word';
  topLayer.append(inputWord);

  const inputTranslation = document.createElement(Tags.INPUT);
  inputTranslation.type = 'text';
  inputTranslation.placeholder = 'Translation';
  inputTranslation.value = `${
    objWordDesired ? objWordDesired.translation : ''
  }`;
  inputTranslation.className = 'word-top-layer-input-translation';
  topLayer.append(inputTranslation);

  const soundDiv = document.createElement(Tags.DIV);
  soundDiv.className = 'word-top-layer-sound-wrapper';
  topLayer.append(soundDiv);

  const soundSpan = document.createElement(Tags.SPAN);
  soundSpan.className = 'word-top-layer-sound-text';
  soundSpan.innerHTML = 'Sound:';
  soundDiv.append(soundSpan);

  const divInputSound = document.createElement(Tags.DIV);
  divInputSound.className = 'word-top-layer-sound-wrapper-input';
  soundDiv.append(divInputSound);

  const inputSound = document.createElement(Tags.INPUT);
  inputSound.className = 'word-top-layer-sound-input';
  inputSound.type = 'file';
  divInputSound.append(inputSound);

  const btnSound = document.createElement(Tags.SPAN);
  btnSound.innerHTML = 'Select file';
  btnSound.className = 'word-top-layer-sound-btn';
  divInputSound.append(btnSound);

  const imageDiv = document.createElement(Tags.DIV);
  imageDiv.className = 'word-top-layer-image-wrapper';
  topLayer.append(imageDiv);

  const imageSpan = document.createElement(Tags.SPAN);
  imageSpan.className = 'word-top-layer-image-text';
  imageSpan.innerHTML = 'Image:';
  imageDiv.append(imageSpan);

  const divInputImage = document.createElement(Tags.DIV);
  divInputImage.className = 'word-top-layer-image-wrapper-input';
  imageDiv.append(divInputImage);

  const inputImage = document.createElement(Tags.INPUT);
  inputImage.className = 'word-top-layer-image-input';
  inputImage.type = 'file';
  divInputImage.append(inputImage);

  const btnImage = document.createElement(Tags.SPAN);
  btnImage.innerHTML = 'Select file';
  btnImage.className = 'word-top-layer-image-btn';
  divInputImage.append(btnImage);

  const divBtns = document.createElement(Tags.DIV);
  divBtns.className = 'word-top-layer-btns';
  topLayer.append(divBtns);

  const btnCancel = document.createElement(Tags.BUTTON);
  btnCancel.className = 'word-top-layer-btn-cancel';
  btnCancel.innerHTML = 'Cancel';
  divBtns.append(btnCancel);

  const btnCreate = document.createElement(Tags.BUTTON);
  btnCreate.className =
    action === TopLayoutView.UPDATE
      ? 'word-top-layer-btn-update'
      : 'word-top-layer-btn-create';
  btnCreate.innerHTML = action === TopLayoutView.UPDATE ? 'Update' : 'Create';
  divBtns.append(btnCreate);
};

const findWord = (cardHtml: HTMLDivElement) =>
  allWords.find((word) => word.word === cardHtml.id);

const addWord = async (): Promise<void> => {
  if (
    getInputWord() &&
    getInputTranslation() &&
    getInputSound() &&
    getInputImage() &&
    selectTitle()
  ) {
    const formData = new FormData();

    const soundElem = getInputSound();
    const srcSound = soundElem.files as FileList;
    const soundFile = srcSound[0];

    const image = getInputImage();
    const srcImage = image.files as FileList;
    const imageFile = srcImage[0];

    formData.set(FormDataNames.WORD, getInputWord().value);
    formData.set(FormDataNames.TRANSLATE, getInputTranslation().value);
    formData.set(FormDataNames.CATEGORY, selectTitle().value);
    formData.set(FormDataNames.SOUND, soundFile);
    formData.set(FormDataNames.IMAGE, imageFile);

    const response = await createWord(formData, getInputWord().value);
    if (response === DUPLICATE) {
      getInputWord().value = DUPLICATE;
      addClassList(getInputWord(), ElemClasses.DISABLED);
    } else {
      removeClassList(getInputWord(), ElemClasses.DISABLED);
      if (response) {
        onNavigate(
          `/${store.getState().admCateg.toLowerCase()}${RoutNames.WORDS}`,
        );
      }
    }
  }
};

const deleteWordById = async (card: HTMLDivElement): Promise<void> => {
  const word = findWord(card)
  if (word) {
    const response = await deleteWord(word._id);
    if (response) {
      onNavigate(`/${store.getState().admCateg.toLowerCase()}${RoutNames.WORDS}`);
    }
  }
};

const updateWordById = async (card: HTMLDivElement): Promise<void> => {
  if (
    getInputWord() &&
    getInputTranslation() &&
    getInputSound() &&
    getInputImage() &&
    selectTitle()
  ) {
    const formData = new FormData();

    const soundElem = getInputSound();
    const srcSound = soundElem.files as FileList;
    const soundFile = srcSound[0];

    const image = getInputImage();
    const srcImage = image.files as FileList;
    const imageFile = srcImage[0];

    formData.set(FormDataNames.WORD, getInputWord().value);
    formData.set(FormDataNames.TRANSLATE, getInputTranslation().value);
    formData.set(FormDataNames.CATEGORY, selectTitle().value);
    formData.set(FormDataNames.SOUND, soundFile);
    formData.set(FormDataNames.IMAGE, imageFile);

    const word = findWord(card)

    if (word) {
      const response = await putWordById(formData, word._id);
      if (response) {
        onNavigate(
          `/${store.getState().admCateg.toLowerCase()}${RoutNames.WORDS}`,
        );
      }
    }
  }
};

const handlerClickPageWord = (
  words: IWordsMongo[],
  categories: ICategoriesMongo[],
  event: Event,
): void => {
  const target = event.target as HTMLElement;
  const card = target.closest(`.${ElemClasses.WORDS_CARD}`) as HTMLDivElement;
  if (checkClass(target, ElemClasses.WORDS_PLAY_SOUND)) {
    const wordsSound = target.closest(
      `.${ElemClasses.WORDS_SOUND}`,
    ) as HTMLDivElement;
    const fileName = wordsSound.innerText.split(': ')[1];
    sound(fileName, IndexSounds.FIRST);
  } else if (checkClass(target, ElemClasses.WORDS_BTN_CHANGE)) {
    renderTopLayer(card, TopLayoutView.UPDATE, words);
  } else if (checkClass(target, ElemClasses.WORD_TOP_LAYER_BTN_CANCEL)) {
    const topLayer = card.lastElementChild as HTMLElement;
    topLayer.remove();
  } else if (checkClass(target, ElemClasses.WORDS_CARD_NEW)) {
    renderTopLayer(card, TopLayoutView.CREATE, words);
  } else if (checkClass(target, ElemClasses.WORD_TOP_LAYER_BTN_CREATE)) {
    addWord();
  } else if (checkClass(target, ElemClasses.WORDS_BTN_REMOVE)) {
    deleteWordById(card);
  } else if (checkClass(target, ElemClasses.WORD_TOP_LAYER_BTN_UPDATE)) {
    updateWordById(card);
  }
};

export const handlingClicksWordPage = (
  main: HTMLElement,
  words: IWordsMongo[],
  categories: ICategoriesMongo[],
): void => {
  main.addEventListener(
    Events.CLICK,
    handlerClickPageWord.bind(null, words, categories),
  );
};
