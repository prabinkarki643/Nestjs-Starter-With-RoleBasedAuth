import { Roles } from '../../../constants/Roles';
import { RolesAllowed } from './../decorators';
import { RoleService } from './../services';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RoleBasedGuard } from '../guards';

@ApiTags('Role Contrller')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // @RolesAllowed(Roles.ADMIN)
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @Get()
  findAll() {
    return this.roleService.findAll();
  }
}
