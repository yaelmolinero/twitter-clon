import type { Request, Response, NextFunction } from 'express';
import { notificationSchema } from '../schemas/notifications';
import { AuthenticationError, BadRequestError } from '../utils/customErrors';

import type { AuthRequest } from '../types/auth.d';
import type { NotificationsModelType } from '../types/interactions.d';

export class NotificationController {
  protected notificationsModel: NotificationsModelType;

  constructor({ notificationsModel }: { notificationsModel: NotificationsModelType }) {
    this.notificationsModel = notificationsModel;
  }

  getUserNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.session) throw new AuthenticationError('Access token invalido.');

      const { id: sessionID } = req.session.user;
      const notifications = await this.notificationsModel.getUserNotifications(sessionID);

      res.json({ notifications });

    } catch (error) { next(error); }
  };

  createNotification = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.session) throw new AuthenticationError('Access token invalido.');

      const validation = notificationSchema.safeParse({ ...req.body, senderID: req.session.user.id });
      if (!validation.success) throw new BadRequestError('Error al validar los datos', validation.error);

      await this.notificationsModel.createNotification(validation.data);
      res.status(201).json({ messge: 'Notificacion enviada.' });

    } catch (error) { console.log(error); next(error); }
  };

  setNotificationCheck = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      await this.notificationsModel.setNotificationCheck(id);
      res.json({ message: 'Notification actualizada' });

    } catch (error) { next(error); }
  };
}
