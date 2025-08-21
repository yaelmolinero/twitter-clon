import type { Response, NextFunction } from 'express';
import { uploadImage, deleteImage } from '../utils/uploadImages';

import { updateUserSchema, pageValidation, tweetsByUserValidation } from '../schemas/users';
import { BadRequestError, AuthorizationError } from '../utils/customErrors';

import type { UserModelType, UserEditableInfo } from '../types/users.d';
import type { TweetsModelType, RepliesType, Tweet } from '../types/tweets.d';
import type { AuthRequest } from '../types/auth.d';

export class UserController {
  protected userModel: UserModelType;
  protected tweetsModel: TweetsModelType;

  constructor({ userModel, tweetsModel }: { userModel: UserModelType, tweetsModel: TweetsModelType }) {
    this.userModel = userModel;
    this.tweetsModel = tweetsModel;
  }

  getUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const session = req.session?.user;
      const { username } = req.params;
      const result = await this.userModel.getUser({ username, sessionID: session?.id ?? null });

      const isSessionAcount = session ? session.id === result.id : false;
      res.json({ ...result, isSessionAcount });

    } catch (error) { next(error); }
  };

  updateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.session) throw new AuthorizationError('No estas autorizado para actualizar los datos');

      const isValid = updateUserSchema.safeParse(req.body);
      if (!isValid.success || isValid.data == undefined) throw new BadRequestError('No hay datos que actualizar');

      const { removeCover = false } = isValid.data;
      const { id: sessionID } = req.session.user;
      const user = await this.userModel.getUserInfo({ type: 'id', userID: sessionID });
      const { avatar: oldAvatar, cover: oldCover } = user;
      let avatarUrl = oldAvatar, coverUrl = oldCover;

      if (req.files != undefined) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        const avatarFile = files['avatar']?.[0] ?? null;
        const coverFile = files['cover']?.[0] ?? null;

        if (avatarFile) avatarUrl = await uploadImage({ folder: 'avatars', file: avatarFile });
        if (coverFile && !removeCover) coverUrl = await uploadImage({ folder: 'covers', file: coverFile });

        // Elimina el avatar o cover antiguos si existen
        if (avatarFile && oldAvatar) deleteImage({ folder: 'avatars', imageUrl: oldAvatar });
        if (coverFile && oldCover) deleteImage({ folder: 'covers', imageUrl: oldCover });
      }
      // Elimina la imagen de portada si existe
      if (oldCover && removeCover) deleteImage({ folder: 'covers', imageUrl: oldCover });

      const userUpdated: UserEditableInfo = {
        ...user,
        ...isValid.data,
        avatar: avatarUrl,
        cover: coverUrl
      };

      await this.userModel.updateUser(userUpdated);
      res.json({ message: 'User updated', user: userUpdated });

    } catch (error) { next(error); }
  };

  getUserTweets = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { username } = req.params;

    try {
      const sessionID = req.session?.user.id ?? null;

      const isValid = tweetsByUserValidation.safeParse(req.query);
      if (!isValid.success) throw new BadRequestError(isValid.error.message);
      const { page, multimedia } = isValid.data;

      const user = await this.userModel.getUserInfo({ type: 'username', username });
      const tweets = await this.tweetsModel.getTweetsByUser({ userID: user.id, page, multimedia, sessionID });

      res.json({ tweets });

    } catch (error) { next(error); }
  };

  getUserReplies = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { username } = req.params;
      const { page } = req.query;
      const sessionID = req.session?.user.id ?? null;

      const user = await this.userModel.existUser({ username: username.toLowerCase() });
      const userID = user.id;

      const isValid = pageValidation.safeParse(page);
      if (!isValid.success) throw new BadRequestError(isValid.error.message);

      const repliesIDs = await this.tweetsModel.getRepliesIDs({ userID, page: isValid.data });
      const replies: RepliesType = [];

      for (const { id } of repliesIDs) {
        const thread = await this.tweetsModel.getThreadById({ tweetID: id, sessionID });
        const status = thread.pop() as Tweet;
        replies.push({ status, thread });
      }

      res.json({ replies });

    } catch (error) { next(error); }
  };

  getUserLikes = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { page } = req.query;

    try {
      if (req.session == undefined) throw new AuthorizationError('No estas autorizado');
      const { id: sessionID } = req.session.user;

      const isValid = pageValidation.safeParse(page);
      if (!isValid.success) throw new BadRequestError(isValid.error.message);

      const tweets = await this.tweetsModel.getLikedTweetsByUser({ page: isValid.data, sessionID });

      res.json({ tweets });

    } catch (error) { next(error); }
  };

  getUserBookmarks = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { page } = req.query;

    try {
      if (req.session == undefined) throw new AuthorizationError('No estas autorizado');
      const { id: sessionID } = req.session.user;

      const isValid = pageValidation.safeParse(page);
      if (!isValid.success) throw new BadRequestError(isValid.error.message);

      const tweets = await this.tweetsModel.getBookmarkedTweetsByUser({ page: isValid.data, sessionID });

      res.json({ tweets });

    } catch (error) { next(error); }
  };

  getSuggestions = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { page } = req.query;

    try {
      if (!req.session) throw new AuthorizationError('No se proporciono un token de acutenticación.');

      const isValid = pageValidation.safeParse(page);
      if (!isValid.success) throw new BadRequestError(isValid.error.message);

      const sessionID = req.session.user.id;
      const users = await this.userModel.getSuggestions({ sessionID, page: isValid.data });
      res.json({ users });

    } catch (error) { next(error); }
  };

  getUserFollowers = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { username: usernameFromParams } = req.params;
    const sessionID = req.session?.user.id ?? null;

    try {
      const user = await this.userModel.getUserInfo({ type: 'username', username: usernameFromParams });
      const followers = await this.userModel.getUserFollows({ userID: user.id, type: 'followers', sessionID });

      const { id, name } = user;
      res.json({ profile: { id, name, username: usernameFromParams }, users: followers });

    } catch (error) { next(error); }
  };

  getUserFollowing = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { username: usernameFromParams } = req.params;
    const sessionID = req.session?.user.id ?? null;

    try {
      const user = await this.userModel.getUserInfo({ type: 'username', username: usernameFromParams });
      const following = await this.userModel.getUserFollows({ userID: user.id, type: 'following', sessionID });

      const { id, name } = user;
      res.json({ profile: { id, name, username: usernameFromParams }, users: following });

    } catch (error) { next(error); }
  };
}
