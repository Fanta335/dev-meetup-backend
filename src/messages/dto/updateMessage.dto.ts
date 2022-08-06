import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateMessageDTO {
  @ApiProperty()
  @IsNumber()
  messageId: number;

  @ApiProperty()
  @IsNumber()
  authorId: number;

  @ApiProperty()
  @IsString()
  content: string;
}
