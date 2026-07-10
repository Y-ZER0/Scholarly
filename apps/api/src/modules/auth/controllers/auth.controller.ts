import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../services/auth.service";
import { LoginRequestDto } from "../dtos/login-request.dto";
import { RegisterRequestDto } from "../dtos/register-request.dto";
import { ForgotPasswordRequestDto } from "../dtos/forgot-password-request.dto";
import { ResetPasswordRequestDto } from "../dtos/reset-password-request.dto";
import { Public } from "@/shared/decorators/public.decorator";
import { CurrentUser } from "@/shared/decorators/current-user.decorator";
import type { Request, Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post("login")
  async login(@Body() dto: LoginRequestDto) {
    const data = await this.authService.login(dto);
    return { success: true, data };
  }

  @Public()
  @Post("forgot-password")
  async forgotPassword(@Body() dto: ForgotPasswordRequestDto) {
    const data = await this.authService.forgotPassword(dto.email);
    return { success: true, ...data };
  }

  @Public()
  @Post("reset-password")
  async resetPassword(@Body() dto: ResetPasswordRequestDto) {
    const data = await this.authService.resetPassword(
      dto.token,
      dto.newPassword,
    );
    return { success: true, ...data };
  }

  @Public()
  @Post("register")
  async register(@Body() dto: RegisterRequestDto) {
    const data = await this.authService.register(dto);
    return { success: true, data };
  }

  @Get("me")
  async me(@CurrentUser() user: { userId: string }) {
    const data = await this.authService.getProfile(user.userId);
    return { success: true, data };
  }

  @Public()
  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth() {}

  @Public()
  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const authResult = await this.authService.handleOAuthLogin(
      req.user as { email: string; name: string; photo?: string },
    );
    const frontendUrl = this.configService.get<string>(
      "FRONTEND_URL",
      "http://localhost:3000",
    );
    const query = new URLSearchParams({
      token: authResult.accessToken,
      name: authResult.user.name,
      email: authResult.user.email,
      role: authResult.user.role,
      id: authResult.user.id,
      photo: authResult.user.profilePhoto ?? "",
    });
    res.redirect(`${frontendUrl}/oauth-callback?${query.toString()}`);
  }

  @Public()
  @Get("github")
  @UseGuards(AuthGuard("github"))
  async githubAuth() {}

  @Public()
  @Get("github/callback")
  @UseGuards(AuthGuard("github"))
  async githubCallback(@Req() req: Request, @Res() res: Response) {
    const authResult = await this.authService.handleOAuthLogin(
      req.user as { email: string; name: string; photo?: string },
    );
    const frontendUrl = this.configService.get<string>(
      "FRONTEND_URL",
      "http://localhost:3000",
    );
    const query = new URLSearchParams({
      token: authResult.accessToken,
      name: authResult.user.name,
      email: authResult.user.email,
      role: authResult.user.role,
      id: authResult.user.id,
      photo: authResult.user.profilePhoto ?? "",
    });
    res.redirect(`${frontendUrl}/oauth-callback?${query.toString()}`);
  }
}
