import { Tags } from '../utils/enums';

export const renderHeader = (): void => {
  const header = document.createElement(Tags.HEADER);
  header.className = 'header';
  document.body.append(header);
};
