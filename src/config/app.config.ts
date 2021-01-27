import { registerAs } from "@nestjs/config";

export default registerAs('app', () => ({
    port:parseInt(process.env.PORT),
    signupEnable:true,
    emailConfirmationEnable:false
  }));