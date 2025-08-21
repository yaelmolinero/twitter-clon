import type { Response, NextFunction } from 'express';
import { AuthenticationError } from '../utils/customErrors';

import type { BookmarksModelType } from '../types/interactions.d';
import type { AuthRequest } from '../types/auth.d';

export class BookmarksController {
  protected bookmarksModel: BookmarksModelType;

  constructor({ bookmarksModel }: { bookmarksModel: BookmarksModelType }) {
    this.bookmarksModel = bookmarksModel;
  }

  createBookmark = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.session) throw new AuthenticationError('Access token invalido.');

      const { id: userID } = req.session.user;
      const { tweetID } = req.params;

      await this.bookmarksModel.createBookmark({ userID, tweetID });
      res.status(201).json({ message: 'Bookmark agregado correctamente.' });

    } catch (error) { next(error); }
  };

  removeBookmark = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.session) throw new AuthenticationError('Access token invalido.');

      const { id: userID } = req.session.user;
      const { tweetID } = req.params;

      await this.bookmarksModel.removeBookmark({ userID, tweetID });
      res.json({ message: 'Bookmark eliminado correctamente.' });

    } catch (error) { next(error); }
  };
}
