import {
  IsCreditCard,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 20)
  username: string;
  @IsString()
  @Length(2, 10)
  name: string;
  @IsString()
  @Length(1, 100)
  password: string;
  @IsEmail()
  @Length(10, 50)
  email: string;
  @IsDateString()
  @IsOptional()
  birth: Date;
}
