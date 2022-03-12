import { User } from 'src/users/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateRoomDTO } from '../dto/createRoom.dto';
import { Room } from './room.entity';

@EntityRepository(Room)
export class RoomsRepository extends Repository<Room> {
  createRoom({ name }: CreateRoomDTO, user: User): Promise<Room> {
    const room = new Room();
    room.name = name;
    room.owners = [user];
    room.members = [user];

    return this.save(room);
  }

  findAll(): Promise<Room[]> {
    return this.find();
  }
}
