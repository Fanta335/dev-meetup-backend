import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class RemoveOwnerDTO {
  @ApiProperty()
  @IsNumber()
  userIdToRemove: number;
}
