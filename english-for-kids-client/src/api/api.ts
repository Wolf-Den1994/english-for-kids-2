import { onNavigate } from '../routing/routes';
import { LOCAL_STORAGE_USER_ADMIN } from '../utils/consts';
import { ICategoriesMongo, IUserData, IWordsMongo } from '../utils/interfaces';

// const baseURL = 'https://majestic-rocky-mountain-22221.herokuapp.com';
const baseURL = 'http://localhost';

async function checkAuthReponse(response: Response) {
  if (response.status === 401) {
    onNavigate('/');
  }
}

export async function getCategory(): Promise<ICategoriesMongo[]> {
  const response = await fetch(`${baseURL}/api/category`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  const category: ICategoriesMongo[] = await response.json();
  return category;
}

export async function getCategoryByName(name: string): Promise<any> {
  const response = await fetch(`${baseURL}/api/category/${name}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  const category = await response.json();
  return category;
}

export async function createCategory(
  formData: FormData,
  name: string,
): Promise<any> {
  const response = await fetch(`${baseURL}/api/category/${name}`, {
    method: 'POST',
    headers: {
      Authorization: `${localStorage.getItem(LOCAL_STORAGE_USER_ADMIN)}`,
    },
    body: formData,
  });
  checkAuthReponse(response);
  if (response.status === 400) {
    return 'duplicate';
  }
  const category = await response.json();
  return category;
}

export async function putCategoryByName(
  formData: FormData,
  name: string,
): Promise<string | null> {
  const response = await fetch(`${baseURL}/api/category/${name}`, {
    method: 'PUT',
    headers: {
      Authorization: `${localStorage.getItem(LOCAL_STORAGE_USER_ADMIN)}`,
    },
    body: formData,
  });
  checkAuthReponse(response);
  if (response.ok) {
    const card = await response.json();
    return card;
  }
  return null;
}

export async function deleteCategory(name: string): Promise<any> {
  const response = await fetch(`${baseURL}/api/category/${name}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      Authorization: `${localStorage.getItem(LOCAL_STORAGE_USER_ADMIN)}`,
    },
  });
  checkAuthReponse(response);
  if (response.ok) {
    const category = await response.json();
    return category;
  }
  return null;
}

export async function getWords(): Promise<IWordsMongo[]> {
  const response = await fetch(`${baseURL}/api/words`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  const words: IWordsMongo[] = await response.json();
  return words;
}

export async function getWordsByCategory(
  categ: string,
): Promise<IWordsMongo[]> {
  const response = await fetch(`${baseURL}/api/words/length/${categ}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  const categLength: IWordsMongo[] = await response.json();
  return categLength;
}

export async function createWord(
  formData: FormData,
  name: string,
): Promise<any> {
  const response = await fetch(`${baseURL}/api/word/${name}`, {
    method: 'POST',
    headers: {
      Authorization: `${localStorage.getItem(LOCAL_STORAGE_USER_ADMIN)}`,
    },
    body: formData,
  });
  checkAuthReponse(response);
  if (response.status === 400) {
    return 'duplicate';
  }
  const word = await response.json();
  return word;
}

export async function deleteWord(name: string): Promise<any> {
  const response = await fetch(`${baseURL}/api/word/${name}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      Authorization: `${localStorage.getItem(LOCAL_STORAGE_USER_ADMIN)}`,
    },
  });
  checkAuthReponse(response);
  if (response.ok) {
    const word = await response.json();
    return word;
  }
  return null;
}

export async function putWordByName(
  formData: FormData,
  name: string,
): Promise<string | null> {
  const response = await fetch(`${baseURL}/api/word/${name}`, {
    method: 'PUT',
    headers: {
      Authorization: `${localStorage.getItem(LOCAL_STORAGE_USER_ADMIN)}`,
    },
    body: formData,
  });
  checkAuthReponse(response);
  if (response.ok) {
    const card = await response.json();
    return card;
  }
  return null;
}

export async function loginHandler(
  login?: string,
  password?: string,
): Promise<IUserData | undefined> {
  const response = await fetch(`${baseURL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password }),
  });
  if (response.ok) {
    const userData: IUserData = await response.json();
    return userData;
  }
  const error = await response.json();
  // eslint-disable-next-line no-console
  console.log(error.message);
  return undefined;
}
