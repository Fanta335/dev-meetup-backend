import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description: string | undefined;
}
