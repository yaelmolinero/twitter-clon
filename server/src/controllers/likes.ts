import type { Response, NextFunction } from 'express';
import { AuthenticationError } from '../utils/customErrors';

import type { LikesModelType } from '../types/interactions.d';
import type { AuthRequest } from '../types/auth.d';

export class LikesController {
  protected likesModel: LikesModelType;

  constructor({ likesModel }: { likesModel: LikesModelType }) {
    this.likesModel = likesModel;
  }

  createLike = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.session) throw new AuthenticationError('Access token invalido.');

      const { id: userID } = req.session.user;
      const { tweetID } = req.params;

      await this.likesModel.createLike({ userID, tweetID });
      res.status(201).json({ message: 'Like agregado correctamente.' });

    } catch (error) { next(error); }
  };

  removeLike = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.session) throw new AuthenticationError('Access token invalido.');

      const { id: userID } = req.session.user;
      const { tweetID } = req.params;

      await this.likesModel.removeLike({ userID, tweetID });
      res.json({ message: 'Like eliminado correctamente.' });

    } catch (error) { next(error); }
  };
}
