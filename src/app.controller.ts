import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private readonly mailerService: MailerService,private readonly configService:ConfigService) {}

  @Get()
  async getHello() {
    // await this.mailerService.sendMail({
    //   to: 'test@nestjs.com', // list of receivers
    //   from: 'noreply@nestjs.com', // sender address
    //   subject: 'Testing Nest MailerModule ✔', // Subject line
    //   text: 'welcome', // plaintext body
    //   html: '<b>welcome</b>', // HTML body content
    // })
    return this.appService.getHello();
  }
}
