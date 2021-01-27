import { UserEntity } from './../user.entity';
import { ApiProperty, OmitType } from "@nestjs/swagger";

export class CreateUserDto extends OmitType(UserEntity,['id']) {}
