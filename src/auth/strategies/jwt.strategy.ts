import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessTokenPayload } from '../types/access-token-payload';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private cfgService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: cfgService.get('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: AccessTokenPayload) {
    const user = await this.authService.validate(payload.userId);
    console.log(
      `---User:\n${JSON.stringify({ ...user, password: '***' }, null, 2)}`,
    );

    return user;
  }
}
