import { Router } from 'express';
import { AuthController } from '../controllers/auth';

import type { AuthModelType } from '../types/auth.d';

export function createAuthRouter({ authModel }: { authModel: AuthModelType }) {
  const authRouter = Router();
  const controller = new AuthController({ authModel });

  authRouter.post('/signup', controller.createUser);
  authRouter.post('/login', controller.loginUser);
  authRouter.post('/logout', controller.logoutUser);
  authRouter.post('/refresh', controller.refreshToken);
  authRouter.post('/exist_user', controller.existUser);

  return authRouter;
}
