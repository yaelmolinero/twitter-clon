import { Router } from 'express';
import { LikesController } from '../controllers/likes';
import { authMiddleware } from '../middlewares/authorization';

import type { LikesModelType } from '../types/interactions.d';

export function createLikesRouter({ likesModel }: { likesModel: LikesModelType }) {
  const likesRouter = Router();
  const controller = new LikesController({ likesModel });

  likesRouter.post('/:tweetID', authMiddleware, controller.createLike);
  likesRouter.delete('/:tweetID', authMiddleware, controller.removeLike);

  return likesRouter;
}
