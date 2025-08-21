import type { Response, NextFunction } from 'express';
import { AuthenticationError } from '../utils/customErrors';

import type { FollowsModelType } from '../types/interactions.d';
import type { AuthRequest } from '../types/auth.d';

export class FollowsController {
  protected followsModel: FollowsModelType;

  constructor({ followsModel }: { followsModel: FollowsModelType }) {
    this.followsModel = followsModel;
  }

  startFollowing = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.session) throw new AuthenticationError('Access token invalido.');

      const { id: followerID } = req.session.user;
      const { id: userToFollowID } = req.params;

      await this.followsModel.startFollowing({ followerID, userToFollowID });
      res.status(201).json({ message: 'Estas siguiendo a esta cuenta.' });

    } catch (error) { next(error); }
  };

  stopFollowing = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.session) throw new AuthenticationError('Access token invalido.');

      const { id: followerID } = req.session.user;
      const { id: userToFollowID } = req.params;

      await this.followsModel.stopFollowing({ followerID, userToFollowID });
      res.json({ message: 'Has dejado de seguir a esta cuenta.' });

    } catch (error) { next(error); }
  };
}
