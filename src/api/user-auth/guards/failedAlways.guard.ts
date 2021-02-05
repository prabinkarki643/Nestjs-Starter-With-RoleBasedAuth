import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class FailedAlwaysGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    throw new BadRequestException()
  }
}