import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/env';
import { AuthenticationError } from '../utils/customErrors';

import type { AuthRequest } from '../types/auth.d';
import type { UserBasic } from '../types/users.d';

function verifyUser(req: AuthRequest): UserBasic | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer')
    throw new AuthenticationError('Formato de token de autenticación invalido. Debe ser \'Bearer <token>\'');

  const token = tokenParts[1];
  try {
    return jwt.verify(token, config.ACCESS_TOKEN_SECRET) as UserBasic;

  } catch (error) {
    throw new AuthenticationError('Token de autenticación invalido.');
  }
}

export function authMiddleware(req: AuthRequest, _res: Response, next: NextFunction) {
  try {
    const user = verifyUser(req);
    if (!user)
      throw new AuthenticationError('No se proporsionó token de autenticación.');

    req.session = { user };
    next();
  } catch (error) { next(error); }
}

export function optionalAuthMiddleware(req: AuthRequest, _res: Response, next: NextFunction) {
  try {
    const user = verifyUser(req);
    if (user) {
      req.session = { user };
    }
    next();
  } catch (error) { next(error); }
}
