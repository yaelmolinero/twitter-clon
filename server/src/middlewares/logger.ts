import { Request, Response, NextFunction } from 'express';
import pc from 'picocolors';

function logger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const date = new Date().toISOString().replace('T', ' ');

    // Color del status de la reques
    const { statusCode } = res;
    let statusColor;

    if (statusCode >= 200 && statusCode < 300) statusColor = pc.green;
    else if (statusCode >= 300 && statusCode < 400) statusColor = pc.cyan;
    else if (statusCode >= 400 && statusCode < 500) statusColor = pc.yellow;
    else if (statusCode >= 500) statusColor = pc.red;
    else statusColor = pc.reset;

    // Color del metodo de la request
    const { method, originalUrl } = req;
    let methodColor;

    if (method === 'GET') methodColor = pc.blue;
    else if (method === 'POST') methodColor = pc.green;
    else if (method === 'PUT') methodColor = pc.yellow;
    else if (method === 'PATCH') methodColor = pc.magenta;
    else if (method === 'DELETE') methodColor = pc.red;
    else if (method === 'OPTIONS') methodColor = pc.gray;
    else methodColor = pc.reset;

    console.log(`${pc.gray(date)} - ${pc.bold(`${methodColor(method)} ${originalUrl} ${statusColor(statusCode)}`)} ${pc.gray(`(${duration}ms)`)}`);
  });

  next();
}

export default logger;
