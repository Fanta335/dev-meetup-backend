import { User } from 'src/users/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateRoomDTO } from '../dto/createRoom.dto';
import { UpdateRoomDTO } from '../dto/updateRoom.dto';
import { Room } from './room.entity';

@EntityRepository(Room)
export class RoomsRepository extends Repository<Room> {
  createRoom({ name }: CreateRoomDTO, userId: number): Promise<Room> {
    const room = new Room();
    room.name = name;
    room.owners = [userId];
    room.members = [userId];

    return this.save(room);
  }

  getAllRooms(): Promise<Room[]> {
    return this.find();
  }

  getByRoomId(id: number): Promise<Room> {
    return this.findOne(id);
  }

  getByRoomName(name: string): Promise<Room> {
    return this.findOne({ name: name });
  }

  async updateRoom(id: number, updateRoomDTO: UpdateRoomDTO): Promise<Room> {
    return this.save({ id: id, ...updateRoomDTO });
  }
}
