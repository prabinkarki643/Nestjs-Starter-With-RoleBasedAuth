import { Roles } from '../../../constants/Roles';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleBasedGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
   const roles = this.reflector.getAllAndMerge<Roles[]>('roles', [
      context.getClass(),
      context.getHandler(),
    ]) || [];

    const isPublic = this.reflector.getAllAndOverride<boolean>('public', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles || isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return this.matchRoles(roles,[user.role])
  }

  matchRoles(definedRoles:Roles[],userRoles: Roles[]):boolean{
   return userRoles.some((role) => definedRoles.includes(role))
  }
}


