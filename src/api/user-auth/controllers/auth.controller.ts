import { ConfigService } from '@nestjs/config';
import { UserEntity } from './../user.entity';
import { EmailConfirmationDto, ForgotPasswordDto,LoginUserDto,RegisterUserDto, ResetPasswordDto } from '../dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';

import { ApiTags } from '@nestjs/swagger';
import { User } from '../decorators/user.decorator';

@ApiTags('Auth Contrller')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,private configService: ConfigService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/local')
  async login(@Body() loginUserDto: LoginUserDto, @User() user:UserEntity) {
    return this.authService.generateLoginJwtPayload(user);
  }

  @Post('/local/register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    if (
      await this.authService.isUserExist(
        registerUserDto.email,
        registerUserDto.username,
      )
    ) {
      throw new BadRequestException(
        'User with this email or username already exists.',
      );
    }
    const registeredUser =  await this.authService.register(registerUserDto, 'local');
    const emailConfirmationEnable = this.configService.get<boolean>('app.emailConfirmationEnable');
    if(emailConfirmationEnable){
      await this.authService.sendEmailConfirmation(registeredUser.email)
      return registeredUser
    }
      return this.authService.generateLoginJwtPayload(registeredUser)
  }

  @Get('connect/:provider')
  connectProvider() {
    return 'Not Implemented';
  }

  @Get('/:provider/callback')
  providerCallback() {
    return 'Not Implemented';
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email)
  }

  @Post('/reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto)
  }

  @Get('/email-confirmation')
  emailConfirmation(@Query('token') token:string) {
    return this.authService.emailConfirmation(token)
  }
  @Post('/send-email-confirmation')
  sendEmailConfirmation(@Body() emailConfirmationDto: EmailConfirmationDto) {
    return this.authService.sendEmailConfirmation(emailConfirmationDto.email)
  }
}
