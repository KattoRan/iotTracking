import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DeviceDto {
  @IsString()
  @IsOptional()
  model?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  os?: string;
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  address?: string;

  @Matches(/^[0-9]{9,12}$/, {
    message: 'Invalid citizen ID',
  })
  citizenId: string;

  @Matches(/^(0|\+84)[0-9]{9}$/, {
    message: 'Invalid phone number',
  })
  phoneNumber: string;

  @ValidateNested()
  @Type(() => DeviceDto)
  @IsNotEmpty()
  device: DeviceDto;
}