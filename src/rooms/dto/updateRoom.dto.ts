import { IsString } from 'class-validator';

export class UpdateRoomDTO {
  @IsString() name: string;
  @IsString() description: string;
  @IsString() isPrivate: string;
}

export class ParsedUpdateRoomDTO {
  name: string;
  description: string;
  isPrivate: boolean;
}
