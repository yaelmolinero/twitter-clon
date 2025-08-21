import type { Response, NextFunction } from 'express';
import { AuthenticationError } from '../utils/customErrors';

import type { AuthRequest } from '../types/auth.d';
import type { RetweetsModelType } from '../types/interactions.d';

export class RetweetsController {
  protected retweetModel: RetweetsModelType;

  constructor({ retweetModel }: { retweetModel: RetweetsModelType }) {
    this.retweetModel = retweetModel;
  }

  createRetweet = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.session) throw new AuthenticationError('Access token invalido.');

      const { id: userID } = req.session.user;
      const { tweetID } = req.params;

      await this.retweetModel.createRetweet({ userID, tweetID });
      res.status(201).json({ message: 'Tweet compartido correctamente.' });

    } catch (error) { next(error); }
  };

  deleteRetweet = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.session) throw new AuthenticationError('Access token invalido.');

      const { id: userID } = req.session.user;
      const { tweetID } = req.params;

      await this.retweetModel.removeRetweet({ userID, tweetID });
      res.json({ messge: 'Se dejo de compartir el tweet.' });

    } catch (error) { next(error); }
  };
}