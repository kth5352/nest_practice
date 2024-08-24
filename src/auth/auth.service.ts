import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { username: loginDto.username },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    if (!bcrypt.compareSync(loginDto.password, user.password)) {
      throw new UnauthorizedException('password not match');
    }
    const payload = {
      username: user.username,
      id: user.id,
      email: user.email,
    };
    const secret = this.configService.getOrThrow('JWT_SECRET');
    const accessToken = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: '1h',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: '7d',
    });
    return { accessToken, refreshToken, user };
  }

  register(registerDto: RegisterDto) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(registerDto.password, salt);
    registerDto.password = hashedPassword;
    const newUser = this.userRepository.create(registerDto);
    return this.userRepository.insert(newUser);
  }
}
