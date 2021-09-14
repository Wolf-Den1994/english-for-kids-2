import { Links, Tags } from '../utils/enums';

const BLANK = '_blank';
const ATTITUDE = 'noopener noreferrer';

export const renderFooter = (): void => {
  const footer = document.createElement(Tags.FOOTER);
  footer.className = 'footer';
  document.body.append(footer);

  const linkGitHub = document.createElement(Tags.LINK);
  linkGitHub.className = 'github';
  linkGitHub.href = Links.GITHUB;
  linkGitHub.target = BLANK;
  linkGitHub.rel = ATTITUDE;
  linkGitHub.innerHTML = 'Wolf-Den1994';
  footer.append(linkGitHub);

  const linkRSS = document.createElement(Tags.LINK);
  linkRSS.className = 'rss';
  linkRSS.href = Links.RSSCHOOL;
  linkRSS.target = BLANK;
  linkRSS.rel = ATTITUDE;
  footer.append(linkRSS);

  const year = document.createElement(Tags.SPAN);
  year.className = 'rss-year';
  year.innerHTML = '21';
  linkRSS.append(year);
};
