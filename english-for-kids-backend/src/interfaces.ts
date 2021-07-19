export interface IFullCars {
  number?: number;
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

export interface ICards {
  word: string;
  translation: string;
  image: string;
  audioSrc: string;
}

export interface ICategoriesMongo {
  categoryName: string;
  image: string;
}

export interface IUserData {
  login: string;
  password: string;
}
