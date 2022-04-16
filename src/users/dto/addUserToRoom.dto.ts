import { IsNumber } from 'class-validator';

export class AddUserToRoomDTO {
  @IsNumber() roomIdToJoin: number;
}
