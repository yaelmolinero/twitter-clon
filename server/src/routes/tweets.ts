import { Router } from 'express';
import { TweetController } from '../controllers/tweets';
import { authMiddleware, optionalAuthMiddleware } from '../middlewares/authorization';
import upload from '../middlewares/upload';

import type { TweetsModelType } from '../types/tweets.d';

export function createTweetsRouter({ tweetModel }: { tweetModel: TweetsModelType }) {
  const tweetRouter = Router();
  const controller = new TweetController({ tweetModel });

  tweetRouter.get('/', optionalAuthMiddleware, controller.getTweets);
  tweetRouter.get('/:id', optionalAuthMiddleware, controller.getThreadById);
  tweetRouter.get('/:id/comments', authMiddleware, controller.getTweetComments);

  tweetRouter.post('/', authMiddleware, upload.single('image'), controller.createTweet);
  tweetRouter.delete('/:id', authMiddleware, controller.deleteTweet);

  return tweetRouter;
}
