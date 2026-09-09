import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');

    // No fallback: defaulting to a literal like 'secret' would let anyone
    // forge a valid admin token if the variable were ever missing.
    if (!secret) {
      throw new Error('JWT_SECRET must be set to verify access tokens.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || user.status !== 'Active') {
      throw new UnauthorizedException('User is inactive or not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
