import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[0-9]\d{5,14}$/, {
    message: 'Phone number must be in valid international format (E.164)',
  })
  phoneNumber: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dateOfBirth: Date;
} 