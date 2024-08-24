import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { user, ...tokens } = await this.authService.login(loginDto);
    res
      .cookie('access-token', tokens.accessToken, { httpOnly: true })
      .cookie('refresh-token', tokens.refreshToken, { httpOnly: true })
      .send(user);
  }
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
