import { NumberPage } from './enums';
import { TypeStateApp } from './types';

export interface ICards {
  word: string;
  translation: string;
  image: string;
  audioSrc: string;
}

export interface IObjApplication {
  countStatistic: number;
  countCards: number;
  empryDifficult: boolean;
}

export interface IHTMLElems {
  arrSvgs: HTMLElement[];
  arrParags: HTMLParagraphElement[];
  arrImages: HTMLImageElement[];
  btnStartGame: HTMLButtonElement;
  score: HTMLDivElement;
}

export interface IGameField {
  arrAudios: string[];
  arrImages: string[];
  counterErrors: number;
}

export interface IFullCards {
  number: number;
  category: string;
  word: string;
  translation: string;
  image: string;
  audioSrc: string;
  train: number;
  play: number;
  errors: number;
  answers: number;
  percent: number;
}

export interface IUserData {
  token: string;
  userId: string;
}

export interface ICategoriesMongo {
  categoryName: string;
  image: string;
  _id: string;
}

export interface IWordsMongo {
  _id: string;
  number: number;
  category: string;
  word: string;
  translation: string;
  image: string;
  audioSrc: string;
  train: number;
  play: number;
  fails: number;
  answers: number;
  percent: number;
}

export interface INumberPage {
  [key: string]: number;
}

export interface IRoutes {
  [key: string]: string | Promise<void>;
}

export interface ITypeState {
  type: string;
  mode?: TypeStateApp;
  page?: NumberPage;
  admCateg?: string;
}

export interface PositionState {
  mode: TypeStateApp;
  page: number;
  admCateg: string;
}

export interface IHTMLModal {
  modal: HTMLDivElement;
  inputLogin: HTMLInputElement;
  inputPassword: HTMLInputElement;
}
