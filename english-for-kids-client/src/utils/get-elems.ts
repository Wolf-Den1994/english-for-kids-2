import { IHTMLElems } from './interfaces';

export const getArrsElem = (): IHTMLElems => {
  const svgs = document.querySelectorAll('.image-svg');
  const parags = document.querySelectorAll('.text-font');
  const images = document.querySelectorAll('.image');
  const btnStartGame = document.querySelector('.btn') as HTMLButtonElement;
  const score = document.querySelector('.score') as HTMLDivElement;

  const arrSvgs: HTMLElement[] = Array.prototype.slice.call(svgs);
  const arrParags: HTMLParagraphElement[] = Array.prototype.slice.call(parags);
  const arrImages: HTMLImageElement[] = Array.prototype.slice.call(images);

  return {
    arrSvgs,
    arrParags,
    arrImages,
    btnStartGame,
    score,
  };
};

interface IHTMLModal {
  modal: HTMLDivElement;
  inputLogin: HTMLInputElement;
  inputPassword: HTMLInputElement;
}

export const getModal = (): IHTMLModal => {
  const modal = document.querySelector('.login-modal') as HTMLDivElement;
  const inputLogin = document.querySelector('.input-login') as HTMLInputElement;
  const inputPassword = document.querySelector(
    '.input-password',
  ) as HTMLInputElement;

  return {
    modal,
    inputLogin,
    inputPassword,
  };
};

export const header = (): HTMLElement =>
  document.querySelector('.header') as HTMLElement;

export const btnSidebar = (): HTMLDivElement =>
  document.querySelector('.btn-sidebar') as HTMLDivElement;

export const input = (): HTMLInputElement =>
  document.querySelector('#menu__toggle') as HTMLInputElement;

export const label = (): HTMLLabelElement =>
  document.querySelector('.menu__btn') as HTMLLabelElement;

export const switcher = (): HTMLDivElement =>
  document.querySelector('.switcher') as HTMLDivElement;

export const labelSwitcher = (): HTMLLabelElement =>
  document.querySelector('.switch') as HTMLLabelElement;

export const inputSwitcher = (): HTMLInputElement =>
  document.querySelector('#togBtn') as HTMLInputElement;

export const sidebar = (): HTMLElement =>
  document.querySelector('.sidebar') as HTMLElement;

export const menu = (): HTMLUListElement =>
  document.querySelector('.menu') as HTMLUListElement;

export const root = (): HTMLDivElement =>
  document.querySelector('#root') as HTMLDivElement;

export const overlay = (): HTMLDivElement =>
  document.querySelector('#overlay') as HTMLDivElement;

export const getSidebar = (): HTMLElement =>
  document.querySelector('.sidebar') as HTMLElement;

export const getLoader = (): HTMLDivElement =>
  document.querySelector('.loader') as HTMLDivElement;
