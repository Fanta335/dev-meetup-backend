import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateRootUserDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string | undefined;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email: string | undefined;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  password: string | undefined;
}
