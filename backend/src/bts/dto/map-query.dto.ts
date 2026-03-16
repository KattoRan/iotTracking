import { IsNumberString, IsOptional } from 'class-validator';

export class MapQueryDto {
  @IsNumberString()
  west: string;

  @IsNumberString()
  south: string;

  @IsNumberString()
  east: string;

  @IsNumberString()
  north: string;

  @IsOptional()
  @IsNumberString()
  zoom?: string;
}