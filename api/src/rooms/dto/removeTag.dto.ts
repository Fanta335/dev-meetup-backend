import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class RemoveTagDTO {
  @ApiProperty()
  @IsNumber()
  tagIdToRemove: number;
}
