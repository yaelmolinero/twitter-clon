import type { Request, Response, NextFunction } from 'express';
import { ServerError, BadRequestError } from '../utils/customErrors';
import { red as pcRed } from 'picocolors';

function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error(pcRed(`Error handler: ${err.message}`));

  if (err instanceof BadRequestError) res.status(err.statusCode).json({ error: err.name, message: err.message, issues: err.errorObject });
  else if (err instanceof ServerError) res.status(err.statusCode).json({ error: err.name, message: err.message });
  else res.status(500).json({ error: 'InternalServerError', message: 'Dev error' });
}

export default errorHandler;
