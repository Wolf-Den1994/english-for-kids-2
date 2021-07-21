import { AnyAction } from 'redux';
import { NumberPage, StateApp } from '../utils/enums';
import { PositionState } from '../utils/interfaces';
import { ADMIN_CATEGORY, CHANGE_MODE, CHANGE_PAGE } from './action-types';

const initialState: PositionState = {
  mode: StateApp.TRAIN,
  page: NumberPage.MAIN,
  admCateg: 'Action',
};

export const rootReducer = (
  state = initialState,
  action: AnyAction,
): PositionState => {
  switch (action.type) {
    case CHANGE_MODE:
      return { ...state, mode: action.mode };

    case CHANGE_PAGE:
      return { ...state, page: action.page };

    case ADMIN_CATEGORY:
      return { ...state, admCateg: action.admCateg };

    default:
      return state;
  }
};
