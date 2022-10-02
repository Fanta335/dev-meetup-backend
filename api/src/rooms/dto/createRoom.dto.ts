import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateRoomDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  tagIds?: string;

  @ApiProperty()
  @IsString()
  isPrivate: string;
}

export class ParsedCreateRoomDTO {
  name: string;

  description: string;

  isPrivate: boolean;

  tagIds?: number[];
}
