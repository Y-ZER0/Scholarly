import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import { UserRole } from "@repo/shared";
import type { AuthDto, UserDto } from "@repo/shared";
import { UsersService } from "@/modules/users/services/users.service";
import { LoginRequestDto } from "../dtos/login-request.dto";
import { RegisterRequestDto } from "../dtos/register-request.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginRequestDto): Promise<AuthDto> {
    const authUser = await this.usersService.findAuthByEmail(dto.email);
    if (!authUser)
      throw new UnauthorizedException("Invalid email or password");

    const isValid = await bcrypt.compare(dto.password, authUser.passwordHash);
    if (!isValid)
      throw new UnauthorizedException("Invalid email or password");

    return this.generateAuthResponse(authUser.userDto, dto.rememberMe);
  }

  async register(dto: RegisterRequestDto): Promise<AuthDto> {
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      role: dto.role,
      passwordHash: hashedPassword,
      profilePhoto: dto.profilePhoto,
    });

    return this.generateAuthResponse(user);
  }

  async handleOAuthLogin(profile: {
    email: string;
    name: string;
    photo?: string;
  }): Promise<AuthDto> {
    let user = await this.usersService.findByEmail(profile.email);

    if (!user) {
      user = await this.usersService.create({
        email: profile.email,
        name: profile.name,
        profilePhoto: profile.photo,
        role: UserRole.STUDENT,
      });
    }

    return this.generateAuthResponse(user, true);
  }

  private generateAuthResponse(
    user: UserDto,
    rememberMe?: boolean,
  ): AuthDto {
    const payload = { sub: user.id, role: user.role, email: user.email };
    const expiresIn = rememberMe ? "7d" : "1d";
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn }),
      user,
    };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");
      const expiry = new Date(Date.now() + 60 * 60 * 1000);

      await this.usersService.updateResetToken(user.id, hashedToken, expiry);

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      console.log(
        `[Forgot Password] Reset link for ${email}: ${frontendUrl}/reset-password?token=${rawToken}`,
      );
    }

    return {
      message:
        "If an account with that email exists, a reset link has been generated.",
    };
  }

  async getProfile(userId: string): Promise<UserDto> {
    return this.usersService.findById(userId);
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await this.usersService.findByResetTokenHash(hashedToken);

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new BadRequestException("Invalid or expired reset token");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await this.usersService.updatePassword(user.id, hashedPassword);

    return { message: "Password has been reset successfully." };
  }
}
