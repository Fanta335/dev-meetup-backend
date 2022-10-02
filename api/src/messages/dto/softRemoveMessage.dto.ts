import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SoftRemoveMessageDTO {
  @ApiProperty()
  @IsNumber()
  messageId: number;

  @ApiProperty()
  @IsNumber()
  authorId: number;
}
