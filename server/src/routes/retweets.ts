import { Router } from 'express';
import { RetweetsController } from '../controllers/retweets';
import { authMiddleware } from '../middlewares/authorization';

import type { RetweetsModelType } from '../types/interactions.d';

export function createRetweetRouter({ retweetModel }: { retweetModel: RetweetsModelType }) {
  const retweetRouter = Router();
  const controller = new RetweetsController({ retweetModel });

  retweetRouter.post('/:tweetID', authMiddleware, controller.createRetweet);
  retweetRouter.delete('/:tweetID', authMiddleware, controller.deleteRetweet);

  return retweetRouter;
}
