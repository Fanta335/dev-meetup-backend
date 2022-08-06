import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateMessageDTO {
  @ApiProperty()
  @IsNumber()
  authorId: number;

  @ApiProperty()
  @IsNumber()
  roomId: number;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsNumber()
  parentId: number | null;
}
