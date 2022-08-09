import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AddTagDTO {
  @ApiProperty()
  @IsNumber()
  tagIdToAdd: number;
}
