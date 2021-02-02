import { ConfigService } from '@nestjs/config';
import { UserEntity } from './../user.entity';
import {
  EmailConfirmationDto,
  ForgotPasswordDto,
  LoginUserDto,
  RegisterUserDto,
  ResetPasswordDto,
} from '../dto';
import { LocalAuthGuard } from '../guards';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  BadRequestException,
  Query,
  Param
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';

import { ApiTags } from '@nestjs/swagger';
import { User } from '../decorators/user.decorator';
import { ProviderService, UserService } from '../services';

@ApiTags('Auth Contrller')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/local')
  async login(@Body() loginUserDto: LoginUserDto, @User() user: UserEntity) {
    return this.authService.generateLoginJwtPayload(user);
  }

  @Post('auth/local/register')
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
    const registeredUser = await this.authService.register(
      registerUserDto,
      'local',
    );
    const emailConfirmationEnable = this.configService.get<boolean>(
      'app.emailConfirmationEnable',
    );
    if (emailConfirmationEnable) {
      await this.authService.sendEmailConfirmation(registeredUser.email);
      return registeredUser;
    }
    return this.authService.generateLoginJwtPayload(registeredUser);
  }

  @Post('auth/forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('auth/reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('auth/email-confirmation')
  emailConfirmation(@Query('token') token: string) {
    return this.authService.emailConfirmation(token);
  }
  @Post('auth/send-email-confirmation')
  sendEmailConfirmation(@Body() emailConfirmationDto: EmailConfirmationDto) {
    return this.authService.sendEmailConfirmation(emailConfirmationDto.email);
  }

  // Providers Routes (Used Grant & Purest) See Strapi docs for flow https://strapi.io/documentation/developer-docs/latest/plugins/users-permissions.html#providers
  @Get('/auth/:provider/callback')
  async providerAuthCallback(
    @Param('provider') provider: string,
    @Query() query: any,
  ) {
    const access_token =
      query.access_token || query.code || query.oauth_token || query.id_token;
    if (!access_token) {
      throw new BadRequestException('No access_token.');
    }
    return this.authService.authenticateWithProvider(provider,query)
  }

  @Get('/frontend/connect/:provider/callback')
  providerCallback(
    @Param('provider') provider: string
  ) {
    return {
      message: `Auth ${provider}`
    };
  }
}
