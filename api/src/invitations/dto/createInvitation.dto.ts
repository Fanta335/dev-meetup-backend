import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';

export class CreateInvitationDTO {
  @ApiProperty()
  @IsUUID('4')
  roomId: string;

  @ApiProperty()
  @IsNumber()
  secondsExpirationLifetime: number;
}
