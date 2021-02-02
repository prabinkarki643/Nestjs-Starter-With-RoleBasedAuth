import { ChangePasswordDto } from '../dto';
import { UserEntity } from '../user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    public usersRepository: Repository<UserEntity>,
  ) {}

  async changePassword(changePasswordDto: ChangePasswordDto, user: UserEntity) {
    const { oldPassword, password, passwordConfirmation } = changePasswordDto;
    if (!UserEntity.comparePassword(oldPassword, user.password))
      throw new BadRequestException(
        'Password does not match with old password',
      );
    if (password !== passwordConfirmation)
      throw new BadRequestException('New password does not match');
    await this.usersRepository.update(user.id, {
      password: UserEntity.hashPassword(password),
    });
    return {
      ok: true,
    };
  }

  async findOrCreate(user:Partial<UserEntity>){
    const find = await this.usersRepository.findOne({email:user.email})
    if(find){
      return find
    }else{
      await this.usersRepository.save(user)
      return this.usersRepository.findOne({email:user.email})
    }
  }
}
