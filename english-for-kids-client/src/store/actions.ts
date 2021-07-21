import { NumberPage } from '../utils/enums';
import { ITypeState } from '../utils/interfaces';
import { TypeStateApp } from '../utils/types';
import { ADMIN_CATEGORY, CHANGE_MODE, CHANGE_PAGE } from './action-types';

export const changeMode = (mode: TypeStateApp): ITypeState => ({
  type: CHANGE_MODE,
  mode,
});

export const changePage = (page: NumberPage): ITypeState => ({
  type: CHANGE_PAGE,
  page,
});

export const changeAdminCategory = (admCateg: string): ITypeState => ({
  type: ADMIN_CATEGORY,
  admCateg,
});
