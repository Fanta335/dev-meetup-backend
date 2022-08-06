import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AddOwnerDTO {
  @ApiProperty()
  @IsNumber()
  userIdToAdd: number;
}
