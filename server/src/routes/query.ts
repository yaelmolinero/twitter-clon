import { Router } from 'express';
import { QueryController } from '../controllers/query';
import { authMiddleware } from '../middlewares/authorization';

import type { QueryModelType } from '../types/interactions.d';

export function createQueryRouter({ queryModel }: { queryModel: QueryModelType }) {
  const queryRouter = Router();
  const controller = new QueryController({ queryModel });

  queryRouter.get('/', authMiddleware, controller.query);

  return queryRouter;
}
