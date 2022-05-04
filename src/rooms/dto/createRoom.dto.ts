import { IsString } from 'class-validator';

export class CreateRoomDTO {
  @IsString() name: string;
}
