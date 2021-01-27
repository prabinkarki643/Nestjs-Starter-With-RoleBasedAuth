import { User } from './../decorators/user.decorator';
import { Roles } from '../../../constants/Roles';
import { RolesAllowed } from './../decorators/roles.decorator';
import { CreateUserDto, UpdateUserDto, ChangePasswordDto, ChangePasswordByAdminDto } from '../dto';
import { UserService } from '../services/user.service';
import { UserEntity } from '../user.entity';
import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  Request,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, RoleBasedGuard } from '../guards';

@ApiTags('User Controller')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  findAll() {
    return this.userService.usersRepository.find();
  }

  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @Post('/')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.usersRepository.save(createUserDto);
  }

  @Get('/count')
  count() {
    return this.userService.usersRepository.count();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  findMe(@User() user: UserEntity) {
    return user;
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.userService.usersRepository.findOne(id);
  }

  @RolesAllowed(Roles.ADMIN)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @Put('/:id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.usersRepository.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    return this.userService.usersRepository.update(
      id,
      new UserEntity(updateUserDto),
    );
  }

  @RolesAllowed(Roles.ADMIN)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    const user = await this.userService.usersRepository.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    return this.userService.usersRepository.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/updateme')
  updateMe(@Body() updateUserDto: UpdateUserDto, @User() user: UserEntity) {
    const userId = user.id;
    return this.userService.usersRepository.update(userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @User() user: UserEntity,
  ) {
    return this.userService.changePassword(changePasswordDto, user);
  }

  @RolesAllowed(Roles.ADMIN)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiOperation({ summary: 'Change password of user, only for admin to do' })
  @Post('/:userId/change-password')
  async changePasswordForGivenUser(
    @Body() changePasswordByAdminDto: ChangePasswordByAdminDto,
    @Param('userId') userId: string,
  ) {
    const{password,passwordConfirmation}=changePasswordByAdminDto
    if(password!==passwordConfirmation) throw new BadRequestException("Password does not match")
    const targetUser = await this.userService.usersRepository.findOne(userId)
    if (!targetUser) throw new NotFoundException('User not found');
    return this.userService.usersRepository.update(targetUser.id,{
      password:UserEntity.hashPassword(password)
    });
  }
}
