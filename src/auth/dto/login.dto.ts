import { OmitType } from '@nestjs/mapped-types';
import { RegisterDto } from './register.dto';

export class LoginDto extends OmitType(RegisterDto, [
  'birth',
  'email',
  'name',
]) {}
