import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');

        // Fail at boot rather than signing tokens with a missing or guessable
        // key. An undefined secret would otherwise surface much later, and a
        // short one is brute-forceable offline once a token leaks.
        if (!secret || secret.length < 32) {
          throw new Error(
            'JWT_SECRET must be set and at least 32 characters long. ' +
              'Generate one with: openssl rand -base64 48',
          );
        }

        return {
          secret,
          signOptions: {
            // Without this the token carries no `exp` claim and stays valid
            // forever, so signing out or disabling a user cannot revoke it.
            // Cast because @nestjs/jwt types this as a `ms` duration literal.
            expiresIn: (configService.get<string>('JWT_EXPIRES_IN') ??
              '7d') as `${number}${'s' | 'm' | 'h' | 'd'}`,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
