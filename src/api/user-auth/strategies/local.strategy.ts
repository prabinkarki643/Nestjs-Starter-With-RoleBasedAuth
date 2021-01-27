import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService,private configService: ConfigService) {
    super({
        usernameField:'identifier'
    });
  }

  async validate(identifier: string, password: string) {
    const user = await this.authService.validateUser(identifier, password);
    if (!user) {
      throw new UnauthorizedException("identifier or password is invalid");
    }
    if(user.blocked){
      throw new UnauthorizedException("Your account is blocked. please contact admin.");
    }
    const emailConfirmationEnable = this.configService.get<boolean>('app.emailConfirmationEnable');
    if(!user.confirmed && emailConfirmationEnable){
      throw new UnauthorizedException("Please confirm your email first.");
    }
    
    return user;
  }
}