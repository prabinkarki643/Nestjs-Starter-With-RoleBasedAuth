import { Roles } from './../constants/Roles';
import { registerAs } from "@nestjs/config";

export default registerAs('app', () => ({
    port:parseInt(process.env.PORT),
    signupEnable:true,
    emailConfirmationEnable:false,
    defaultRole:Roles.USER
  }));