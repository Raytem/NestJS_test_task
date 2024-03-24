import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { AccessTokenPayload } from '../types/access-token-payload';

@Injectable()
export class JwtService {
  constructor(private cfgService: ConfigService) {}

  generateAccessToken(userId: number) {
    const secretKey = this.cfgService.get('JWT_SECRET_KEY');
    const expirationTime = this.cfgService.get('JWT_EXPIRATION_TIME');

    const payload: AccessTokenPayload = {
      userId,
    };
    const accessToken = jwt.sign(payload, secretKey, {
      expiresIn: expirationTime,
    });

    return accessToken;
  }
}
