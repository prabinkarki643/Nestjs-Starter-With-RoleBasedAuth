import { UserEntity } from './../user.entity';
import { PickType } from "@nestjs/swagger";

export class RegisterUserDto extends PickType(UserEntity,['firstName','lastName','username','email','password','address','phone']){

}