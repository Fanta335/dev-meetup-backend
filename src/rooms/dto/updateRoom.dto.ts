import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, ValidateNested } from 'class-validator';

export class UpdateRoomDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsBoolean()
  isPrivate: boolean;

  @ApiProperty()
  @ValidateNested({ each: true })
  tagIds?: { id: string }[];
}
