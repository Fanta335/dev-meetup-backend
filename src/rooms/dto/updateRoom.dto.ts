import { User } from 'src/users/entity/user.entity';

export class UpdateRoomDTO {
  name?: string;
  owners?: User[];
  members?: User[];
}
