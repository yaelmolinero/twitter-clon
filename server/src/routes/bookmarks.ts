import { Router } from 'express';
import { BookmarksController } from '../controllers/bookmarks';
import { authMiddleware } from '../middlewares/authorization';

import type { BookmarksModelType } from '../types/interactions.d';

export function createBookmarksRouter({ bookmarksModel }: { bookmarksModel: BookmarksModelType }) {
  const bookmarksRouter = Router();
  const controller = new BookmarksController({ bookmarksModel });

  bookmarksRouter.post('/:tweetID', authMiddleware, controller.createBookmark);
  bookmarksRouter.delete('/:tweetID', authMiddleware, controller.removeBookmark);

  return bookmarksRouter;
}
