import { Roles } from '../../constants/Roles';
import {
  Entity,
  Column,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectID,
  Index
} from 'typeorm';
import { Exclude, Expose } from "class-transformer";
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';

export class Address {
  @Column()
  state: string;

  @Column()
  city: string;

  @Column()
  zipcode: string;
}

@Entity({ name: 'user' })
export class UserEntity {
  constructor(data?: Partial<UserEntity>) {
    Object.assign(this, data);
  }

  @ApiProperty({ type: 'string' })
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  firstName: string;

  @Column()
  lastName?: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  avatar: string;

  @Column({ select: false })
  password: string;

  @Column()
  phone: string;

  @Column()
  provider?: string;

  @Column((type) => Address)
  address: Address;

  @Column()
  resetPasswordToken?: string;

  @Column()
  confirmationToken?: string;

  @Column({ default: false })
  confirmed?: boolean


  @Column({ default: false })
  blocked?: boolean

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.USER,
  })
  role?: number

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;

  static hashPassword(password:string){
    return bcrypt.hashSync(password, 10)
  }

  static comparePassword(plainPassword:string,encryptedPassword:string){
    return bcrypt.compareSync(plainPassword, encryptedPassword)
  }
}
