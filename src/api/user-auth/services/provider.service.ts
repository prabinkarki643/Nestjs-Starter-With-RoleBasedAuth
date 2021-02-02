import { ConfigService } from '@nestjs/config';
import { Roles } from '../../../constants/Roles';

import { Injectable } from '@nestjs/common';
// Purest strategies.
var request = require('request');
var promise = Promise;
var purest = require('purest')({ request, promise });
var purestConfig = require('@purest/providers');

export class ProviderProfile{
  email:string
  username:string
  firstName?:string
  lastName?:string
  avatar?:string
  confirmed?:boolean
  provider:string
}

@Injectable()
export class ProviderService {
  constructor(private readonly configService: ConfigService) {}

  async getProfileFromProvider(
    provider: string,
    query: any,
  ):Promise<ProviderProfile> {
    const access_token =
      query.access_token || query.code || query.oauth_token || query.id_token;
    const grant = this.configService.get('grant');
    switch (provider) {
      case 'google':
        const google = purest({ provider: 'google', config: purestConfig });
        return google
          .get('oauth2/v1/userinfo')
          .qs({ access_token })
          .request()
          .then(([res,body])=>{
            console.log("body",body);
            const profile=new ProviderProfile()
            profile.email=body?.email;
            profile.username=body?.email?.split("@")[0]
            profile.firstName=body?.given_name
            profile.lastName=body?.family_name
            profile.avatar=body?.picture
            profile.confirmed=body?.verified_email
            profile.provider=provider
            return profile
          })

      default:
        throw new Error('Unknown provider');
    }
  }
}