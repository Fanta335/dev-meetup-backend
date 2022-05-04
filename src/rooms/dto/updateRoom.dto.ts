import { IsString } from 'class-validator';
import { User } from 'src/users/entity/user.entity';

export class UpdateRoomDTO {
  @IsString() name: string;
  @IsString() description: string;
  owners?: User[];
  members?: User[];
}
