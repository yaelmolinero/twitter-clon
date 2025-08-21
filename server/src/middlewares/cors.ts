import type { Request, Response, NextFunction } from 'express';
import config from '../config/env';

const ALLOWED_DOMAINS = [
  config.FRONTEND_DOMAIN,
  'http://localhost:4173'
];

function cors(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin;

  if (origin && ALLOWED_DOMAINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  next();
}

export default cors;
