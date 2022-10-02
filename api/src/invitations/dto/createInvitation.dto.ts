import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateInvitationDTO {
  @ApiProperty()
  @IsNumber()
  roomId: number;

  @ApiProperty()
  @IsNumber()
  secondsExpirationLifetime: number;
}
