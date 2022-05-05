import { User } from 'src/users/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateRoomDTO } from '../dto/createRoom.dto';
import {
  KeyOfOrderOptions,
  KeyOfSortOptions,
  SearchRoomDTO,
} from '../dto/searchRoom.dto';
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

  getRoomById(id: number): Promise<Room> {
    return this.findOne(id);
  }

  getRoomByName(name: string): Promise<Room> {
    return this.findOne({ name: name });
  }

  getBelongingRooms(memberId: number): Promise<Room[]> {
    return this.createQueryBuilder('room')
      .leftJoin('room.members', 'user')
      .where('user.id = :id', { id: memberId })
      .getMany();
  }

  searchRooms(
    searchRoomDTO: SearchRoomDTO,
    parsedSort: KeyOfSortOptions,
    parsedOrder: KeyOfOrderOptions,
  ): Promise<Room[]> {
    const { query, offset, limit } = searchRoomDTO;

    // Add number of members property to room entity.
    return this.createQueryBuilder('room')
      .where('room.name LIKE :name', { name: `%${query}%` })
      .loadRelationCountAndMap('room.numOfMembers', 'room.members', 'user')
      .orderBy(`room.${parsedSort}`, parsedOrder)
      .take(limit)
      .skip(offset)
      .getMany();
  }

  getRoomDetail(id: number): Promise<Room> {
    return this.findOne({
      where: { id: id },
      relations: ['owners', 'members', 'messages'],
    });
  }

  async updateRoom(id: number, updateRoomDTO: UpdateRoomDTO): Promise<Room> {
    return this.save({ id: id, ...updateRoomDTO });
  }
}
