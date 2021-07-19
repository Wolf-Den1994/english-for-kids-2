import mongoose = require('mongoose');
import { ICategoriesMongo, IFullCars, IUserData } from './interfaces';

const schemaUser = new mongoose.Schema(
  {
    login: { type: String, required: true },
    password: { type: String, required: true },
  },
  { collection: 'users' },
);

const schemaCategory = new mongoose.Schema(
  {
    categoryName: { type: String, required: true },
    image: { type: String, required: true },
  },
  { collection: 'categories' },
);

const schemaCard = new mongoose.Schema(
  {
    number: { type: Number, required: true },
    category: { type: String, required: true },
    word: { type: String, required: true },
    translation: { type: String, required: true },
    image: { type: String, required: true },
    audioSrc: { type: String, required: true },
    train: { type: Number, required: true },
    play: { type: Number, required: true },
    fails: { type: Number, required: true },
    answers: { type: Number, required: true },
    percent: { type: Number, required: true },
  },
  { collection: 'cards' },
);

export const User: mongoose.Model<IUserData> = mongoose.model(
  'User',
  schemaUser,
);
export const Category: mongoose.Model<ICategoriesMongo> = mongoose.model(
  'Category',
  schemaCategory,
);
export const Card: mongoose.Model<IFullCars> = mongoose.model(
  'Card',
  schemaCard,
);
