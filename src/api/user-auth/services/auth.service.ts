import { ConfigService } from '@nestjs/config';
import { UserEntity } from './../user.entity';
import { UserService } from './user.service';
import { ResetPasswordDto, UserDto } from '../dto/index';
import { MailerService } from '@nestjs-modules/mailer';
import { RegisterUserDto } from '../dto/register-user.dto';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthService {
  private emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
    private configService: ConfigService
  ) {}

  generateTempToken(payload: string | object | Buffer) {
    return this.jwtService.sign(payload, {
      secret: process.env.TEMP_TOKEN_SECRET_KEY,
      expiresIn: process.env.TEMP_TOKEN_EXPIRE_TIME,
    });
  }
  verifyTempToken(token: string) {
    try {
      var decoded = this.jwtService.verify(token, {
        secret: process.env.TEMP_TOKEN_SECRET_KEY,
      });
      return decoded;
    } catch (err) {
      return undefined;
    }
  }

  async validateUser(identifier: string, password: string) {
    const isEmail = this.emailRegExp.test(identifier);
    const user = await this.userService.usersRepository.findOne(
      isEmail ? { email: identifier } : { username: identifier },
    );
    if (user && UserEntity.comparePassword(password,user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async isUserExist(email: string, username: string) {
    const userWithSameEmail = await this.userService.usersRepository.findOne({
      email: email,
    });
    if (userWithSameEmail) return true;
    const userWithSameUsername = await this.userService.usersRepository.findOne(
      {
        username: username,
      },
    );
    if (userWithSameUsername) return true;
    return false;
  }

  async login(user: UserEntity) {
    const payload = { username: user.username, sub: user.id };
    return {
      jwt: this.jwtService.sign(payload),
      user: plainToClass(UserDto,user),
    };
  }

  async generateLoginJwtPayload(user: UserEntity) {
    console.log("user",user);
    
    const payload = { username: user.username, sub: user.id };
    const { password, ...result } = user;
    return {
      jwt: this.jwtService.sign(payload),
      user: plainToClass(UserDto,user),
    };
  }

  async register(registerUserDto: RegisterUserDto, provider: string = 'local') {
    registerUserDto.password=UserEntity.hashPassword(registerUserDto.password);
    const newUser = new UserEntity({
      ...registerUserDto,
      provider: provider,
    })
    return this.userService.usersRepository.save(newUser)
  }

  async forgotPassword(email: string) {
    const user = await this.userService.usersRepository.findOne({ email });
    if (!user)
      throw new BadRequestException('User with this email does not exists.');
    // Generate random token.
    const resetPasswordToken = this.generateTempToken({ email });
    // Make Reset Link
    const resetPasswordLink = `${process.env.RESET_PASSWORD_URL}?token=${resetPasswordToken}`;

    const html = `
    <div>Reset Your Password</div>
    <a href="${resetPasswordLink}">Here</a>
    `;
    await this.mailerService.sendMail({
      to: email, // list of receivers
      subject: 'Reset Password', // Subject line
      text: 'Reset password', // plaintext body
      html: html, // HTML body content
    });

    await this.userService.usersRepository.update(user.id, {
      resetPasswordToken: resetPasswordToken,
    });

    return {
      ok: true,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { password, passwordConfirmation, token } = resetPasswordDto;
    if (
      password &&
      passwordConfirmation &&
      password == passwordConfirmation &&
      token
    ) {
      const payload = this.verifyTempToken(token);
      if (!payload)
        throw new UnauthorizedException(
          'Invalid token or expired token, try again',
        );
      const user = await this.userService.usersRepository.findOne({
        email: payload.email,
        resetPasswordToken: token,
      });
      if (!user)
        throw new UnauthorizedException('Invalid token or expired token, try again');
      // const hashedPassword = this.userService.hashPassword(password);
      await this.userService.usersRepository.update(user.id, {
        password:UserEntity.hashPassword(password),
        resetPasswordToken: null,
      });
      return {
        ok: true,
      };
    } else if (
      password &&
      passwordConfirmation &&
      password !== passwordConfirmation
    ) {
      throw new BadRequestException('Passwords do not match.');
    } else {
      throw new BadRequestException('Incorrect params provided');
    }
  }

  async sendEmailConfirmation(email: string) {
    const user = await this.userService.usersRepository.findOne({ email });
    if (!user)
      throw new BadRequestException('User with this email does not exists.');
    if(user.confirmed) throw new BadRequestException('Email already confirmed');
    // Generate random token.
    const confirmationToken = this.generateTempToken({ email });
    // Make Reset Link
    const emailConfirmationLink = `${process.env.RESET_PASSWORD_URL}?token=${confirmationToken}`;

    const html = `
    <div>Confirm your email</div>
    <a href="${emailConfirmationLink}">Here</a>
    `;
    await this.mailerService.sendMail({
      to: email, // list of receivers
      subject: 'Confirm Email', // Subject line
      text: 'Confirm Email', // plaintext body
      html: html, // HTML body content
    });

    await this.userService.usersRepository.update(user.id, {
      confirmationToken: confirmationToken,
    });

    return {
      ok: true,
    };
  }

  async emailConfirmation(token: string) {
    if(!token) throw new BadRequestException('Incorrect params provided');
      const payload = this.verifyTempToken(token);
      if (!payload)
        throw new UnauthorizedException(
          'Invalid token or expired token, try again',
        );
      const user = await this.userService.usersRepository.findOne({
        email: payload.email,
        confirmationToken: token,
      });
      if (!user)
        throw new UnauthorizedException('Invalid token or expired token, try again');
      await this.userService.usersRepository.update(user.id, {
        confirmed: true,
        confirmationToken: null,
      });
      return {
        ok: true,
      };
  }
}
