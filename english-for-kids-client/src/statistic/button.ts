import { Tags } from '../utils/enums';

export const btnReset = document.createElement(Tags.BUTTON);
btnReset.className = 'btn btn-reset';
btnReset.innerHTML = 'reset';

export const btnDifficultWord = document.createElement(Tags.BUTTON);
btnDifficultWord.className = 'btn btn-diff';
btnDifficultWord.innerHTML = 'repeat difficult words';
