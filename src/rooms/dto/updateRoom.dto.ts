import { IsBoolean, IsString } from 'class-validator';

export class UpdateRoomDTO {
  @IsString() name: string;
  @IsString() description: string;
  @IsBoolean() isPrivate: boolean;
}
