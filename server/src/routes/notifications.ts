import { Router } from 'express';
import { NotificationController } from '../controllers/notifications';
import { authMiddleware } from '../middlewares/authorization';

import type { NotificationsModelType } from '../types/interactions.d';

export function createNotificcationsRouter({ notificationsModel }: { notificationsModel: NotificationsModelType }) {
  const notificationsRouter = Router();
  const controllers = new NotificationController({ notificationsModel });

  notificationsRouter.get('/', authMiddleware, controllers.getUserNotifications);
  notificationsRouter.post('/', authMiddleware, controllers.createNotification);
  notificationsRouter.post('/check/:id', controllers.setNotificationCheck);

  return notificationsRouter;
}
