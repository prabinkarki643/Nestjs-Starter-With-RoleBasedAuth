import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AlwaysFailedMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    throw new ForbiddenException()
  }
}
