import { PublicFile } from 'src/files/entity/publicFile.entity';
import { User } from 'src/users/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateRoomDTO } from '../dto/createRoom.dto';
import {
  KeyOfOrderOptions,
  KeyOfSortOptions,
  SearchRoomDTO,
} from '../dto/searchRoom.dto';
import { Room } from './room.entity';

@EntityRepository(Room)
export class RoomsRepository extends Repository<Room> {
  async createRoom(
    user: User,
    { name, description }: CreateRoomDTO,
    avatar?: PublicFile,
  ): Promise<Room> {
    const room = new Room();
    room.name = name;
    room.description = description;
    room.owners = [user];
    room.members = [user];
    room.avatar = avatar === undefined ? null : avatar;

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

  getRoomWithOwners(id: number): Promise<Room> {
    return this.findOne({
      where: { id: id },
      relations: ['owners'],
    });
  }

  getBelongingRooms(memberId: number): Promise<Room[]> {
    return this.createQueryBuilder('room')
      .leftJoin('room.members', 'user')
      .leftJoinAndSelect('room.avatar', 'public_file')
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
      .leftJoinAndSelect('room.avatar', 'public_file')
      .loadRelationCountAndMap('room.numOfMembers', 'room.members', 'user')
      .where('room.name LIKE :name', { name: `%${query}%` })
      .orderBy(`room.${parsedSort}`, parsedOrder)
      .limit(limit)
      .offset(offset)
      .getMany();
  }

  getRoomDetail(id: number): Promise<Room> {
    return this.findOne({
      where: { id: id },
      relations: ['owners', 'members', 'messages', 'avatar'],
    });
  }

  getLimitedMessage(id: number): Promise<Room> {
    return this.createQueryBuilder('room')
      .leftJoinAndSelect('room.messages', 'message')
      .where('room.id = :id', { id })
      .take(5)
      .getOne();
  }

  async getRoomMembersById(id: number): Promise<User[]> {
    const room = await this.findOne({
      where: { id: id },
      relations: ['members'],
    });

    return room.members;
  }
}
