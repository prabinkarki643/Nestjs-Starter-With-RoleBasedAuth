import { UserEntity } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController,AuthController, RoleController } from './controllers';
import { UserService,AuthService, RoleService } from './services';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy,LocalStrategy } from './strategies';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRE_TIME')}
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserEntity])
  ],
  controllers: [AuthController,UserController,RoleController],
  providers: [AuthService,UserService,RoleService,LocalStrategy,JwtStrategy],
})
export class UserAuthModule {}
