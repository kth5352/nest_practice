import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const accessToken = request.cookies['access-token'];
    const refreshToken = request.cookies['refresh-token'];
    const secret = this.configService.getOrThrow('JWT_SECRET');
    if (!accessToken && !refreshToken) {
      throw new ForbiddenException('token not found');
    }
    try {
      const decodedAccessToken = await this.jwtService.verifyAsync(
        accessToken,
        { secret },
      );
      request.user = decodedAccessToken;
      return true;
    } catch (accessTokenError) {
      try {
        const decodedRefreshToken = await this.jwtService.verifyAsync(
          refreshToken,
          { secret },
        );
        const payload = {
          username: decodedRefreshToken.username,
          id: decodedRefreshToken.id,
          email: decodedRefreshToken.email,
        };
        const newAccessToken = this.jwtService.signAsync(payload, {
          secret,
          expiresIn: '1h',
        });
        response.cookie('access-token', newAccessToken, { httpOnly: true });
        request.user = decodedRefreshToken;
        return true;
      } catch (refreshTokenError) {
        response.clearCookie('access-token').clearCookie('refresh-token');
        throw new UnauthorizedException('invalid token');
      }
    }

    return true;
  }
}
