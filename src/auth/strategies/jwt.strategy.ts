import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { jwtPayload } from '../models/jwt-payload.model';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: authService.retunrjwtExtractor(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_KEY,
    });
  }

  async validate(jwtPayload: jwtPayload){
    const user = await this.authService.validateUser(jwtPayload)
    if(!user) {
        throw new UnauthorizedException()
    }
    return user
  }
}
