import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.status !== 'Active') {
      throw new UnauthorizedException('Invalid credentials or inactive user');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken: this.jwtService.sign(payload),
    };
  }

  /**
   * Updates the signed-in user's own record.
   *
   * Self-service lives here rather than on /admin/users because that
   * controller is Admin-only, which left content writers unable to edit
   * their own name or email.
   */
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    if (dto.email) {
      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (existing && existing.id !== userId) {
        throw new ConflictException('Email already in use');
      }
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /** Changes the signed-in user's password, verifying the current one first. */
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Without this check, anyone with a stolen token could lock the real owner
    // out by setting a new password.
    const currentIsValid = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );
    if (!currentIsValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    if (await bcrypt.compare(dto.newPassword, user.password)) {
      throw new BadRequestException(
        'New password must be different from the current one',
      );
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: await bcrypt.hash(dto.newPassword, 10) },
    });

    return { message: 'Password changed successfully' };
  }
}
