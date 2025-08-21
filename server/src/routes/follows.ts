import { Router } from 'express';
import { FollowsController } from '../controllers/follows';
import { authMiddleware } from '../middlewares/authorization';

import type { FollowsModelType } from '../types/interactions.d';

export function createFollowsRouter({ followsModel }: { followsModel: FollowsModelType }) {
  const followsRouter = Router();
  const controller = new FollowsController({ followsModel });

  followsRouter.post('/:id', authMiddleware, controller.startFollowing);
  followsRouter.delete('/:id', authMiddleware, controller.stopFollowing);

  return followsRouter;
}
