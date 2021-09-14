import multer from 'multer';
import path from 'path';

export const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.mp3') {
      cb(null, false);
      throw new Error('File type is not supported');
      return;
    }
    cb(null, true);
  },
});
