import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const existing = req.header('x-request-id');
    const requestId = existing && existing.trim().length > 0 ? existing : randomUUID();

    // Attach to request for later use
    (req as any).requestId = requestId;

    // Return it to the client
    res.setHeader('x-request-id', requestId);

    next();
  }
}
