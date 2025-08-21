import type { Response, NextFunction } from 'express';
import { AuthorizationError, BadRequestError } from '../utils/customErrors';
import { querySchema } from '../schemas/query';

import type { QueryModelType } from '../types/interactions.d';
import type { AuthRequest } from '../types/auth.d';

export class QueryController {
  protected queryModel: QueryModelType;

  constructor({ queryModel }: { queryModel: QueryModelType }) {
    this.queryModel = queryModel;
  }

  query = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.session) throw new AuthorizationError('No autorizado.');
      const { id: sessionID } = req.session.user;

      const validation = querySchema.safeParse(req.query);
      if (!validation.success) throw new BadRequestError('Error al validar los datos de busqueda.', validation.error);

      const { query, filter, page } = validation.data;
      const lowerQuery = query.toLowerCase();

      if (filter === 'post' || filter === 'media') {
        const tweets = await this.queryModel.searchTweets({
          query: lowerQuery,
          page,
          sessionID,
          newest: true,
          onlyImages: filter === 'media'
        });

        return void res.json({ tweets });
      }

      const users = await this.queryModel.searchUsers({ query: lowerQuery, page, sessionID });
      res.json({ users });

    } catch (error) { next(error); }
  };
}
