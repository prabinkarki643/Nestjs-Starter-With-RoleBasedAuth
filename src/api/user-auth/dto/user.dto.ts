
import { Exclude, Expose } from "class-transformer";


export class Address {
  @Expose()
  state: string;

  @Expose()
  city: string;

  @Expose()
  zipcode: string;
}

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName?: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  phone: string;

  @Expose()
  provider?: string;

  @Expose()
  address: Address;

  @Exclude()
  resetPasswordToken?: string;

  @Exclude()
  confirmationToken?: string;

  @Expose()
  confirmed?: boolean;

  @Expose()
  blocked: boolean;

  @Expose()
  role: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
