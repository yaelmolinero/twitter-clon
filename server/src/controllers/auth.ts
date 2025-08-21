import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import config from '../config/env';
import { protectedUsernames } from '../utils/protectedUsernames';

import { createUserSchema, loginUserSchema } from '../schemas/auth';
import { ConflictError, AuthenticationError, BadRequestError } from '../utils/customErrors';
import type { AuthModelType } from '../types/auth.d';

const REFRESH_TOKEN = 'refresh_token';
const GUEST_ID = 'guest_id';

export class AuthController {
  protected authModel: AuthModelType;

  constructor({ authModel }: { authModel: AuthModelType }) {
    this.authModel = authModel;
  }

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isValid = createUserSchema.safeParse(req.body);
      if (!isValid.success) throw new BadRequestError('Error en la validación de los datos', isValid.error);

      const { name, username, email, password } = isValid.data;
      const lowerUsername = username.toLowerCase();

      if (protectedUsernames.includes(lowerUsername)) throw new ConflictError('No puedes usar este username.');
      if (await this.authModel.existUser({ type: 'email', data: email })) throw new ConflictError('Este correo electrónico ya esta siendo utilizado.');
      if (await this.authModel.existUser({ type: 'username', data: lowerUsername })) throw new ConflictError('Este username ya esta siendo utilizado.');

      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await this.authModel.createUser({ name, username, email, password: hashedPassword });

      // Genera el access token
      const token = jwt.sign(
        { ...result },
        config.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
      );

      // Genera un refresh token
      const userID = result.id;
      const refreshToken = crypto.randomUUID();
      const refreshTokenHashed = await bcrypt.hash(refreshToken, 10);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 100);

      await this.authModel.createRefreshToken({ userID, tokenHash: refreshTokenHashed, expiresAt: expiresAt.toISOString() });

      res
        .status(201)
        .cookie(REFRESH_TOKEN, refreshToken, {
          expires: expiresAt,
          httpOnly: true,
          sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
          secure: config.NODE_ENV === 'production',
          path: '/auth/refresh'
        })
        .cookie(GUEST_ID, userID, {
          expires: expiresAt,
          httpOnly: true,
          sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
          secure: config.NODE_ENV === 'production',
          path: '/auth'
        })
        .json({ user: result, token });

    } catch (error) { next(error); }
  };

  loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isValid = loginUserSchema.safeParse(req.body);
      if (!isValid.success) throw new BadRequestError('Error en la validación de los datos', isValid.error);

      const { type, data, password } = isValid.data;
      const user = await this.authModel.getUser({ type, data });

      const isAuthenticated = await bcrypt.compare(password, user.password);
      if (!isAuthenticated) throw new AuthenticationError('Contraseña incorrecta');

      const { password: _password, email, ...userBasicInfo } = user;
      const token = jwt.sign(
        { ...userBasicInfo },
        config.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
      );

      // Crear o actualizar refresh token
      const userID = user.id;
      const refreshToken = crypto.randomUUID();
      const refreshTokenHashed = await bcrypt.hash(refreshToken, 10);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 100);

      // Se actualiza el refresh token si existe
      const existRefreshToken = await this.authModel.updateRefreshToken({ userID, tokenHash: refreshTokenHashed, expiresAt: expiresAt.toISOString() });
      if (!existRefreshToken)
        await this.authModel.createRefreshToken({ userID, tokenHash: refreshTokenHashed, expiresAt: expiresAt.toISOString() });

      res
        .cookie(REFRESH_TOKEN, refreshToken, {
          expires: expiresAt,
          httpOnly: true,
          sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
          secure: config.NODE_ENV === 'production',
          path: '/auth/refresh'
        })
        .cookie(GUEST_ID, userID, {
          expires: expiresAt,
          httpOnly: true,
          sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
          secure: config.NODE_ENV === 'production',
          path: '/auth'
        })
        .json({ user: userBasicInfo, token });

    } catch (error) { next(error); }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const refreshTokenFromCookie: string | undefined = req.cookies[REFRESH_TOKEN];
    const userIDFromCookie: string | undefined = req.cookies[GUEST_ID];

    try {
      if (!refreshTokenFromCookie || !userIDFromCookie) throw new AuthenticationError('Refresh token no encontrado.');

      const refreshTokenRecord = await this.authModel.getRefreshToken(userIDFromCookie);
      if (!refreshTokenRecord) throw new AuthenticationError('Refresh token expirado o revocado.');

      const { tokenHash, ...userBasicInfo } = refreshTokenRecord;
      if (!await bcrypt.compare(refreshTokenFromCookie, tokenHash)) throw new AuthenticationError('Refresh token invalido.');

      const token = jwt.sign(
        { ...userBasicInfo },
        config.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ user: userBasicInfo, token });

    } catch (error) { next(error); }
  };

  logoutUser = async (req: Request, res: Response, next: NextFunction) => {
    const userIDFromCookie: string | undefined = req.cookies[GUEST_ID];

    try {
      if (!userIDFromCookie) throw new AuthenticationError('Refresh token no encontrado.');
      await this.authModel.revokeRefreshToken(userIDFromCookie);

      res
        .clearCookie(REFRESH_TOKEN)
        .json({ message: 'Logout user' });

    } catch (error) { next(error); }
  };

  existUser = async (req: Request, res: Response, next: NextFunction) => {
    const { type, data } = req.body;

    try {
      if (!type || !data) throw new BadRequestError('Es necesario pasar type y data para comprobar al usuario.');
      if (type !== 'email' && type !== 'username') throw new BadRequestError('"type" solo puede ser "email" o "username"');
      const lowerData = data.toLowerCase();

      if (protectedUsernames.includes(lowerData))
        return void res.status(409).json({ valid: false, message: 'No puedes usar este username.', taken: true });

      if (type === 'email' && await this.authModel.existUser({ type, data: lowerData }))
        return void res.status(409).json({ valid: false, message: 'Este correo electrónico ya esta siendo utilizado.', taken: true });

      else if (type === 'username' && await this.authModel.existUser({ type, data: lowerData }))
        return void res.status(409).json({ valid: false, message: 'Este nombre de usuario ya está en uso.', taken: true });

      res.json({ valid: true, taken: false });

    } catch (error) { next(error); }
  };
}
