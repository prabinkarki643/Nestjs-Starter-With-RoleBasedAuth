import { ApiProperty,OmitType } from '@nestjs/swagger'

export * from './login-user.dto'
export * from './register-user.dto'
export * from './create-user.dto'
export * from './update-user.dto'
export * from './user.dto'
export class ForgotPasswordDto{
    @ApiProperty()
    email:string
}
export class EmailConfirmationDto{
    @ApiProperty()
    email:string
}
export class ResetPasswordDto{
    @ApiProperty()
    password:string

    @ApiProperty()
    passwordConfirmation:string

    @ApiProperty()
    token:string

}
export class ChangePasswordDto{
    @ApiProperty()
    oldPassword:string

    @ApiProperty()
    password:string

    @ApiProperty()
    passwordConfirmation:string
}

export class ChangePasswordByAdminDto extends OmitType(ChangePasswordDto,['oldPassword']){}