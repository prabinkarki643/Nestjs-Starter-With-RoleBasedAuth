import { registerAs } from "@nestjs/config";

export default registerAs('email', () => ({
    smtp:{
        transport:{
          host: process.env.MAIL_HOST,
          secure: process.env.MAIL_SECURE=="true",
          port: process.env.MAIL_PORT,
          tls: {
            rejectUnauthorized: false
          },
          auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
          }
        },
        defaults:{
          from:process.env.MAIL_DEFAULT_FROM,
          replayTo:process.env.MAIL_DEFAULT_REPLAY_TO
        }
      }
  }));