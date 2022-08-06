import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateRoomDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  isPrivate: string;
}

export class ParsedUpdateRoomDTO {
  name: string;
  description: string;
  isPrivate: boolean;
}
