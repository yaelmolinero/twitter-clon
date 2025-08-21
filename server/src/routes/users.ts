import { Router } from 'express';
import { UserController } from '../controllers/users';
import { authMiddleware, optionalAuthMiddleware } from '../middlewares/authorization';
import upload from '../middlewares/upload';

import type { UserModelType } from '../types/users.d';
import type { TweetsModelType } from '../types/tweets.d';

export function createUserRouter({ userModel, tweetsModel }: { userModel: UserModelType, tweetsModel: TweetsModelType }) {
  const userRouter = Router();
  const controller = new UserController({ userModel, tweetsModel });

  userRouter.get('/suggestions', authMiddleware, controller.getSuggestions);
  userRouter.get('/me/likes', authMiddleware, controller.getUserLikes);
  userRouter.get('/me/bookmarks', authMiddleware, controller.getUserBookmarks);
  userRouter.get('/:username', optionalAuthMiddleware, controller.getUser);
  userRouter.get('/:username/tweets', optionalAuthMiddleware, controller.getUserTweets);
  userRouter.get('/:username/replies', optionalAuthMiddleware, controller.getUserReplies);
  userRouter.get('/:username/followers', optionalAuthMiddleware, controller.getUserFollowers);
  userRouter.get('/:username/following', optionalAuthMiddleware, controller.getUserFollowing);

  userRouter.put(
    '/profile',
    authMiddleware,
    upload.fields([
      { name: 'avatar', maxCount: 1 },
      { name: 'cover', maxCount: 1 }
    ]),
    controller.updateUser
  );

  return userRouter;
}
