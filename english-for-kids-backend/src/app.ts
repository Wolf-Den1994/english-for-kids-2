import express, { Request, Response } from 'express';
import fs from 'fs';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import swaggerUi from 'swagger-ui-express';
import { Category, User, Card } from './model';
import { upload } from './multer';
import { ICategoriesMongo, IFullCars } from './interfaces';
import * as swaggerDocument from './swagger.json';
import { cloudinaryV2 } from './cloudinary';
import {
  defaultImage,
  defaultSound,
  filePathFullCards,
  jwtSecret,
  mongoUri,
  PORT,
} from './consts';
import { auth } from './auth';
import { createCardsInBD } from './create-db';

const app = express();
app.use(cors());
const jsonParser = express.json();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

app.post(
  '/api/category/:namecat',
  [auth, upload.single('image')],
  async (req: Request, res: Response) => {
    try {
      if (!req.body) return res.sendStatus(400);

      const categoryName = req.params.namecat;

      const ifiles = req.file;
      let name;
      if (req.body.name) {
        name = req.body.name;
      } else {
        name = 'No category name specified';
      }

      const categoryDB = await Category.find({ categoryName });
      const categ: ICategoriesMongo = categoryDB[0];
      if (categ) return res.sendStatus(400);

      let result;
      if (ifiles) {
        result = await cloudinaryV2.uploader.upload(ifiles.path);
      }

      const category = new Category({
        categoryName: name,
        image: result?.secure_url || defaultImage,
      });

      await category.save();
      // eslint-disable-next-line no-console
      console.log('category create');
      res.json(category);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  },
);

app.get('/api/category', async (req, res) => {
  try {
    const categories = await Category.find();

    // eslint-disable-next-line no-console
    console.log('category get all');
    res.json(categories);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
});

app.get('/api/category/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const category = await Category.find({ _id });

    // eslint-disable-next-line no-console
    console.log('category get by name');
    res.json(category);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
});

app.delete('/api/category/:id', auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const category = await Category.find({ _id });
    const categ = category[0];

    await cloudinaryV2.uploader.destroy(categ.image);
    await categ.remove();

    // eslint-disable-next-line no-console
    console.log('category delete');
    res.json(categ);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
});

app.put(
  '/api/category/:id',
  [auth, upload.single('image')],
  async (req: Request, res: Response) => {
    try {
      const _id = req.params.id;
      const category = await Category.find({ _id });
      const categ: ICategoriesMongo = category[0];
      await cloudinaryV2.uploader.destroy(categ.categoryName);

      let result;
      if (req.file) {
        result = await cloudinaryV2.uploader.upload(req.file.path);
      }

      const data = {
        categoryName: req.body.name || categ.categoryName,
        image: result?.secure_url || categ.image,
      };
      const newCategory = await Category.updateOne(categ, data, { new: true });

      // eslint-disable-next-line no-console
      console.log('category update');
      res.json(newCategory);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  },
);

app.get('/api/words', async (req, res) => {
  try {
    const words = await Card.find();
    res.json(words);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
});

app.get('/api/words/length/:categ', async (req, res) => {
  try {
    const category = req.params.categ;
    const words = await Card.find({ category });
    res.json(words);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
});

app.post(
  '/api/word/:nameword',
  [
    auth,
    upload.fields([
      { name: 'image', maxCount: 1 },
      { name: 'sound', maxCount: 1 },
    ]),
  ],
  async (req: Request, res: Response) => {
    try {
      if (!req.body) return res.sendStatus(400);

      const wordName = req.params.nameword;

      let content = fs.readFileSync(filePathFullCards, 'utf8');
      const fullCards = JSON.parse(content);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ifiles = req.files as any;

      const reqCategory = req.body.category;
      let reqWord;
      if (req.body.word) {
        reqWord = req.body.word;
      } else {
        reqWord = 'Word not specified';
      }

      const wordDB = await Card.find({ word: wordName });
      const isWord: IFullCars = wordDB[0];
      if (isWord) return res.sendStatus(400);

      let reqTranslate;
      if (req.body.translate) {
        reqTranslate = req.body.translate;
      } else {
        reqTranslate = 'Translation of the word is not specified';
      }
      const reqImage = ifiles.image;
      const reqSound = ifiles.sound;

      let resultImage;
      if (reqImage) {
        resultImage = await cloudinaryV2.uploader.upload(reqImage[0].path);
      }
      let resultSound;
      if (reqSound) {
        resultSound = await cloudinaryV2.uploader.upload(reqSound[0].path, {
          resource_type: 'video',
        });
      }

      const card: IFullCars = {
        category: reqCategory,
        word: reqWord,
        translation: reqTranslate,
        image: resultImage?.secure_url || defaultImage,
        audioSrc: resultSound?.secure_url || defaultSound,
        train: 0,
        play: 0,
        fails: 0,
        answers: 0,
        percent: 0,
      };

      const number = Math.max(...fullCards.map((o: IFullCars) => o.number));

      card.number = number + 1;

      const word = new Card({
        number: number + 1,
        category: reqCategory,
        word: reqWord,
        translation: reqTranslate,
        image: resultImage?.secure_url || defaultImage,
        audioSrc: resultSound?.secure_url || defaultSound,
        train: 0,
        play: 0,
        fails: 0,
        answers: 0,
        percent: 0,
      });

      fullCards.push(card);
      content = JSON.stringify(fullCards);
      fs.writeFileSync(filePathFullCards, content);

      await word.save();
      // eslint-disable-next-line no-console
      console.log('word create');
      res.json(word);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  },
);

app.delete('/api/word/:id', auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const responseWord = await Card.find({ _id });
    const wordSrc = responseWord[0];
    await cloudinaryV2.uploader.destroy(wordSrc.image);
    await cloudinaryV2.uploader.destroy(wordSrc.audioSrc);

    await wordSrc.remove();
    // eslint-disable-next-line no-console
    console.log('word delete');
    res.json(wordSrc);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
});

app.put(
  '/api/word/:id',
  [
    auth,
    upload.fields([
      { name: 'image', maxCount: 1 },
      { name: 'sound', maxCount: 1 },
    ]),
  ],
  async (req: Request, res: Response) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ifiles = req.files as any;
      const _id = req.params.id;
      const reqCategory = req.body.category;
      const reqWord = req.body.word;
      const reqTranslate = req.body.translate;
      const reqImage = ifiles.image;
      const reqSound = ifiles.sound;

      const responseWord = await Card.find({ _id });
      const wordSrc: IFullCars = responseWord[0];

      await cloudinaryV2.uploader.destroy(wordSrc.image);
      await cloudinaryV2.uploader.destroy(wordSrc.audioSrc);

      let resultImage;
      let resultSound;
      if (reqImage) {
        resultImage = await cloudinaryV2.uploader.upload(reqImage[0].path);
      }
      if (reqSound) {
        resultSound = await cloudinaryV2.uploader.upload(reqSound[0].path, {
          resource_type: 'video',
        });
      }

      const data = {
        category: reqCategory || wordSrc.category,
        word: reqWord || wordSrc.word,
        translation: reqTranslate || wordSrc.translation,
        image: resultImage?.secure_url || wordSrc.image,
        audioSrc: resultSound?.secure_url || wordSrc.audioSrc,
        train: 0,
        play: 0,
        fails: 0,
        answers: 0,
        percent: 0,
      };

      const newWord = await Card.updateOne(wordSrc, data, { new: true });
      // eslint-disable-next-line no-console
      console.log('word update');
      res.json(newWord);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  },
);

app.post('/api/login', jsonParser, async (req, res) => {
  if (!req.body) return res.status(500).json({ message: 'Something went wrong' });

  const { login, password } = req.body;
  const admin = await User.findOne({ login });
  if (!admin) {
    return res
      .status(400)
      .json({ message: 'Wrong data. Enter login: admin, password: admin' });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Incorrect password enter admin' });
  }

  const token = jwt.sign({ userId: admin.id }, jwtSecret, {
    expiresIn: '1h',
  });
  res.json({ token, userId: admin.id });
});

const start = async () => {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    await createCardsInBD();

    app.listen(PORT, () => {
      app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
      // eslint-disable-next-line no-console
      console.log('Server started...');
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`Server Error ${e}`);
    process.exit(1);
  }
};
start();
