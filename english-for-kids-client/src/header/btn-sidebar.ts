import { Tags } from '../utils/enums';
import { header } from '../utils/get-elems';

const RELATIONS = 'menu__toggle';

export const renderBtnSidebar = (): void => {
  const btnSidebar = document.createElement(Tags.DIV);
  btnSidebar.className = 'btn-sidebar';
  header().append(btnSidebar);

  const input = document.createElement(Tags.INPUT);
  input.id = RELATIONS;
  input.type = 'checkbox';
  input.className = 'menu__toggle-input';
  btnSidebar.append(input);

  const label = document.createElement(Tags.LABEL);
  label.className = 'menu__btn';
  label.htmlFor = RELATIONS;
  btnSidebar.append(label);

  const span = document.createElement(Tags.SPAN);
  label.append(span);
};
