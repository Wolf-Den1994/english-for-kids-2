import express, { Request, Response } from 'express';
import fs from 'fs';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from 'cloudinary';
import swaggerUi from 'swagger-ui-express';
import { Category, User, Card } from './model';
import { upload } from './multer';
import { ICategoriesMongo, IFullCars } from './interfaces';
import * as swaggerDocument from './swagger.json';

// cloudinaryV2
const cloudinaryV2 = cloudinary.v2;
cloudinaryV2.config({
  cloud_name: 'dwfklxeps',
  api_key: '968952732922231',
  api_secret: 'U0JDfav3auk5CbhThdlbUWkQ6Fo',
});

// порт и ссылка на монгоДБ
const PORT = process.env.PORT || 80;
const mongoUri = 'mongodb+srv://den:1234@cluster0.tjdqh.mongodb.net/efk?retryWrites=true&w=majority';
const jwtSecret = 'secret string';
const defaultImage = 'https://res.cloudinary.com/dwfklxeps/image/upload/v1626342564/undefined_bcnko5.jpg';
const defaultSound = 'https://res.cloudinary.com/dwfklxeps/video/upload/v1626341274/jc2g94gxmbcp71gfc6fq.mp3';

const app = express();
app.use(cors());
const jsonParser = express.json();
// const loader = Multer({ dest: path.join(__dirname, 'tmp') });
// для сохранения в папку tmp на сервере  loader.single('image'),
// app.use(loader.array('image'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

const filePathFullCards = 'full-cards.json';

function auth(req: Request, res: Response, next: () => void) {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'No authorization' });
    }

    jwt.verify(token, jwtSecret);
    next();
  } catch (e) {
    res.status(401).json({ message: 'No authorization' });
  }
}

app.post(
  '/api/category/:namecat',
  [auth, upload.single('image')],
  async (req: Request, res: Response) => {
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
    // console.log(ifiles); // инпут файл (картинка)

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

app.get('/api/category/:name', async (req, res) => {
  try {
    const categoryName = req.params.name;
    // Find category by name
    const category = await Category.find({ categoryName });
    // eslint-disable-next-line no-console
    console.log('category get by name');
    res.json(category);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
});

app.delete('/api/category/:name', auth, async (req, res) => {
  try {
    const categoryName = req.params.name;
    // Find user by id
    const category = await Category.find({ categoryName });
    const categ = category[0];
    // Delete image from cloudinary
    // eslint-disable-next-line no-console
    console.log(categ);
    await cloudinaryV2.uploader.destroy(categ.image);
    // Delete user from db
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
  '/api/category/:namecat',
  [auth, upload.single('image')],
  async (req: Request, res: Response) => {
    try {
      const categoryName = req.params.namecat;
      const category = await Category.find({ categoryName });
      const categ: ICategoriesMongo = category[0];
      // Delete image from cloudinary
      await cloudinaryV2.uploader.destroy(categ.categoryName);
      // Upload image to cloudinary
      let result;
      if (req.file) {
        result = await cloudinaryV2.uploader.upload(req.file.path);
      }

      // console.log(req.body.name, result?.secure_url);

      const data = {
        categoryName: req.body.name || categ.categoryName,
        image: result?.secure_url || categ.image,
      };
      // console.log(data);
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
    if (!req.body) return res.sendStatus(400);

    const wordName = req.params.nameword;

    let content = fs.readFileSync(filePathFullCards, 'utf8');
    const fullCards = JSON.parse(content);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ifiles = req.files as any;
    // console.log(ifiles); // инпут файлов (картинка и музыка)

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
    // console.log(reqCategory, reqTranslate, reqWord, reqImage, reqSound)
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

    // console.log(resultImage)
    // console.log(resultSound)

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

    // console.log(word)
    // console.log(card);
    fullCards.push(card);
    // console.log(fullCard)
    content = JSON.stringify(fullCards);
    // console.log(content)
    fs.writeFileSync(filePathFullCards, content);

    await word.save();
    // eslint-disable-next-line no-console
    console.log('word create');
    res.json(word);
  },
);

app.delete('/api/word/:name', auth, async (req, res) => {
  try {
    const word = req.params.name;
    // Find user by id
    const responseWord = await Card.find({ word });
    // console.log(responseWord)
    const wordSrc = responseWord[0];
    // console.log(w)
    // Delete image from cloudinary
    await cloudinaryV2.uploader.destroy(wordSrc.image);
    await cloudinaryV2.uploader.destroy(wordSrc.audioSrc);
    // Delete user from db
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ifiles = req.files as any;
      // console.log(ifiles)

      const word = req.params.nameword;
      const reqCategory = req.body.category;
      const reqWord = req.body.word;
      const reqTranslate = req.body.translate;
      const reqImage = ifiles.image;
      const reqSound = ifiles.sound;
      // console.log(word, reqCategory, reqWord, reqTranslate, reqImage, reqSound)
      // console.log(reqSound)

      const responseWord = await Card.find({ word });
      const wordSrc: IFullCars = responseWord[0];
      // console.log(wordSrc)

      // Delete image from cloudinary
      await cloudinaryV2.uploader.destroy(wordSrc.image);
      await cloudinaryV2.uploader.destroy(wordSrc.audioSrc);

      // console.log(reqImage[0].path)
      // console.log(reqSound[0].path)

      // Upload image to cloudinary
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

      // console.log(resultImage)
      // console.log(resultSound)

      // const card: IFullCars = {

      // };

      // console.log('card', card)

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

const createCardsInBD = async () => {
  let cardLength;
  // eslint-disable-next-line array-callback-return
  await Card.find((err, data) => {
    cardLength = data.length;
  });
  // eslint-disable-next-line no-console
  console.log('fullCard length:', cardLength);
  if (!cardLength) {
    const content = fs.readFileSync(filePathFullCards, 'utf8');
    const fullCards = JSON.parse(content);
    Card.create(fullCards);
  }
};

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
