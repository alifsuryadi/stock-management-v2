// backend/src/dto/admin.dto.ts
import {
  IsEmail,
  IsString,
  IsDateString,
  IsEnum,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateAdminDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsDateString()
  birthDate: string;

  @IsEnum(['male', 'female'])
  gender: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsEnum(['male', 'female'])
  gender?: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
