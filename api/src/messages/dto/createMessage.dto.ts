import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateMessageDTO {
  @ApiProperty()
  @IsNumber()
  authorId: number;

  @ApiProperty()
  @IsUUID('4')
  roomId: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsNumber()
  parentId: number | null;
}
