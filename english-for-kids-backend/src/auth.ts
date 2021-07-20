import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { jwtSecret } from './consts';

export const auth = (req: Request, res: Response, next: () => void) => {
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

    // eslint-disable-next-line no-console
    console.log('auth');
  } catch (e) {
    res.status(401).json({ message: 'No authorization' });
  }
};
