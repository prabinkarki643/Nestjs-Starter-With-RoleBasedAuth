import { Roles } from '../../../constants/Roles';

import { Injectable } from '@nestjs/common';

@Injectable()
export class RoleService {
  constructor() {}

  async findAll() {
    return Object.values(Roles);
  }
}
