import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDecimal,
  IsDate,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8) // Minimum password length of 8 characters
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+])[A-Za-z\d@$!%*?&#+]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#+)',
    },
  )
  password: string;

  @ApiProperty()
  @IsString()
  confirmPassword: string; // New field for confirming the password
}
