export const getStringWord = (str: string): string => {
  const firstPart = str.split('/').pop() as string;
  const lastPart = firstPart.split('.').shift() as string;
  return lastPart;
};

export const getWord = (div: HTMLDivElement): string => {
  const img = div.children[0] as HTMLImageElement;
  const imageSrc = img.src;
  return getStringWord(imageSrc);
};
