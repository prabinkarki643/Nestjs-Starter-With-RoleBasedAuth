import { UserAuthModule } from './api/user-auth/user-auth.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import * as config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, 
      load: [...Object.values(config)] }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>configService.get('email.smtp'),
      inject: [ConfigService]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get('database');
        return {
          ...dbConfig.connections[dbConfig.defaultConnection].settings,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
        };
      },
      inject: [ConfigService]
    }),
    UserAuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule{}