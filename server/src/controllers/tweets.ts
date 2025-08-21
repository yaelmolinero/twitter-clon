import type { Response, NextFunction } from 'express';
import { uploadImage, deleteImage } from '../utils/uploadImages';

import { createTweetSchema, queryValidation } from '../schemas/tweets';
import { AuthorizationError, BadRequestError } from '../utils/customErrors';

import type { TweetsModelType } from '../types/tweets.d';
import type { AuthRequest } from '../types/auth.d';

export class TweetController {
  tweetModel: TweetsModelType;

  constructor({ tweetModel }: { tweetModel: TweetsModelType }) {
    this.tweetModel = tweetModel;
  }

  createTweet = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.session) throw new AuthorizationError('Access token invalido.');
      const { user } = req.session;

      const validation = createTweetSchema.safeParse(req.body);
      if (!validation.success) throw new BadRequestError(validation.error.message);

      const { content, parentTweetID } = validation.data;
      let imageUrl = null;

      if (req.file != undefined) imageUrl = await uploadImage({ folder: 'tweets', file: req.file });

      const tweetCreatedID = await this.tweetModel.createTweet({ userID: user.id, content, imageUrl, parentTweetID });

      res.status(201).json({
        id: tweetCreatedID,
        user,
        parentTweetID: parentTweetID?.toString() ?? null,
        content,
        imageUrl,
        createdAt: new Date().toISOString()
      });

    } catch (error) { next(error); }
  };

  getTweets = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const sessionID = req.session?.user.id ?? null;

      const isValid = queryValidation.safeParse(req.query);
      if (!isValid.success) throw new BadRequestError(isValid.error.message);

      const { page, following } = isValid.data;
      const tweets = await this.tweetModel.getTweets({ sessionID, page, following });
      res.json({ tweets });

    } catch (error) { next(error); }
  };

  getThreadById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const sessionID = req.session?.user.id ?? null;
      const tweetID = req.params.id;

      const thread = await this.tweetModel.getThreadById({ tweetID, sessionID });
      const status = thread.pop();
      res.json({ status, thread });

    } catch (error) { next(error); }
  };

  getTweetComments = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.session) throw new AuthorizationError('Access token invalido');

      const isValid = queryValidation.partial().safeParse(req.query);
      if (!isValid.success || !isValid.data.page) throw new BadRequestError('Es necesario el parametro page en la busqueda.');

      const sessionID = req.session.user.id;
      const tweetID = req.params.id;
      const { page } = isValid.data;

      const tweets = await this.tweetModel.getTweetComments({ tweetID, page, sessionID });
      res.json({ tweets });

    } catch (error) { console.log(error); next(error); }
  };

  deleteTweet = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.session) throw new AuthorizationError('Access token invalido.');

      const sessionID = req.session.user.id;
      const tweetID = req.params.id;

      const imageUrl = await this.tweetModel.deleteTweet({ tweetID, sessionID });
      if (imageUrl) deleteImage({ folder: 'tweets', imageUrl });

      res.json({ message: 'Tweet eliminado', id: req.params.id });

    } catch (error) { next(error); }
  };
}
