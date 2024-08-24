import { Controller, Get, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/jwt/jwt.guard';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get()
  // @UseGuards(JwtGuard)
  // findAll() {
  //   return this.userService.findAll();
  // }

  @Get()
  @UseGuards(JwtGuard)
  findOne(@Req() req: Request) {
    return this.userService.findOne(req.user.id);
  }

  @Delete()
  @UseGuards(JwtGuard)
  remove(@Req() req: Request) {
    return this.userService.remove(req.user.id);
  }
}
