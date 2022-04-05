import { User } from 'src/users/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateRoomDTO } from '../dto/createRoom.dto';
import { UpdateRoomDTO } from '../dto/updateRoom.dto';
import { Room } from './room.entity';

@EntityRepository(Room)
export class RoomsRepository extends Repository<Room> {
  async createRoom(user: User, { name }: CreateRoomDTO): Promise<Room> {
    const room = new Room();
    room.name = name;
    room.owners = [user];
    room.members = [user];

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

  getOwnRooms(ownerId: number): Promise<Room[]> {
    return this.createQueryBuilder('room')
      .leftJoin('room.owners', 'user')
      .where('user.id = :id', { id: ownerId })
      .getMany();
  }

  async updateRoom(id: number, updateRoomDTO: UpdateRoomDTO): Promise<Room> {
    return this.save({ id: id, ...updateRoomDTO });
  }
}
