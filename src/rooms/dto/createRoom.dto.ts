import { IsBoolean, IsString } from 'class-validator';

export class CreateRoomDTO {
  @IsString() name: string;
  @IsString() description: string;
  @IsBoolean() isPrivate: boolean;
}
