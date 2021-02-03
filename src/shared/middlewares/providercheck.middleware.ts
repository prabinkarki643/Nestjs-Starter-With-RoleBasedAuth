import { ConfigService } from '@nestjs/config';
import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ProviderCheckMiddleware implements NestMiddleware {
    constructor(private readonly configService:ConfigService) {}
  use(req: Request, res: Response, next: NextFunction) {
      const provider = req.params?.provider
      const grantConfig = this.configService.get("grant")
    if(!grantConfig[provider]?.enable){
        throw new BadRequestException(`Provider-${provider} is disbaled`)
    }
    next();
  }
}