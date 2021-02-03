import { registerAs } from '@nestjs/config';

export default registerAs('grant', () => ({
  defaults: {
    origin: 'http://localhost:8000',
    transport: 'querystring', //session
    state: true,
  },
  google: {
    key: process.env.GOOGLE_CLIENT_ID,
    secret: process.env.GOOGLE_SECRET,
    nonce: true,
    scope: ['openid', 'profile', 'email'],
    callback: 'http://localhost:8000/frontend/connect/google/callback', //Add frontend callback URL to handle access_token
    //Custom settings
    enable:false
  },
}));
