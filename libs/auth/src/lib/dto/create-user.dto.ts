import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsEnum } from 'class-validator';
import { RoleName } from '@secure-task-system/data';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  fullName: string;

  //  use name instead of ID
  @IsNotEmpty()
  organizationName: string;

  // Optional: user can select role for now
  @IsOptional()
  @IsEnum(RoleName)
  role?: RoleName;
}
