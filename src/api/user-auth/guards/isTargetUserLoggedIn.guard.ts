import { UserEntity } from './../user.entity';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class IsTargetUserLoggedInGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.user) {
      if (!request.query.user) {
        throw new UnauthorizedException(
          'Specify target user equal to your own id. eg: ?user=yourId',
        );
      }
      const loggedInUser = request.user as UserEntity;
      const targetUser = request.query.user;
      if (targetUser == loggedInUser.id) {
        return true;
      } else {
        throw new UnauthorizedException(
          'Target user is different from loggedIn User',
        );
      }
    }
    throw new UnauthorizedException('You are not loggedIn');
  }
}
