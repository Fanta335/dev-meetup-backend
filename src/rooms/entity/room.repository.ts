import { CustomRepository } from 'src/database/typeorm-ex.decorator';
import { PublicFile } from 'src/files/entity/publicFile.entity';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateRoomDTO } from '../dto/createRoom.dto';
import {
  KeyOfOrderOptions,
  KeyOfSortOptions,
  SearchRoomDTO,
} from '../dto/searchRoom.dto';
import { RoomRelation } from '../types';
import { Room } from './room.entity';

@CustomRepository(Room)
export class RoomsRepository extends Repository<Room> {
  async createRoom(
    user: User,
    { name, description, isPrivate }: CreateRoomDTO,
    avatar?: PublicFile,
  ): Promise<Room> {
    const room = new Room();
    room.name = name;
    room.description = description;
    room.isPrivate = Boolean(isPrivate);
    room.owners = [user];
    room.members = [user];
    room.avatar = avatar === undefined ? null : avatar;

    return this.save(room);
  }

  getAllRooms(): Promise<Room[]> {
    return this.find();
  }

  getRoomById(id: number): Promise<Room> {
    return this.findOne({ where: { id: id } });
  }

  getRoomByName(name: string): Promise<Room> {
    return this.findOne({ where: { name: name } });
  }

  getBelongingRooms(memberId: number): Promise<Room[]> {
    return this.createQueryBuilder('room')
      .leftJoin('room.members', 'user')
      .leftJoinAndSelect('room.avatar', 'public_file')
      .where('user.id = :id', { id: memberId })
      .getMany();
  }

  getOwnRooms(ownerId: number): Promise<Room[]> {
    return this.createQueryBuilder('room')
      .leftJoin('room.owners', 'user')
      .where('user.id = :id', { id: ownerId })
      .getMany();
  }

  async searchRooms(
    searchRoomDTO: SearchRoomDTO,
    parsedSort: KeyOfSortOptions,
    parsedOrder: KeyOfOrderOptions,
  ): Promise<{ data: Room[]; count: number }> {
    const { query, offset, limit, tagIds } = searchRoomDTO;

    let searchQuery = this.createQueryBuilder('room')
      .leftJoinAndSelect('room.avatar', 'public_file')
      .leftJoinAndSelect('room.tags', 'tags')
      .loadRelationCountAndMap('room.numOfMembers', 'room.members', 'user')
      .where('room.name LIKE :name', { name: `%${query}%` })
      .andWhere('room.isPrivate = false');

    if (Array.isArray(tagIds)) {
      tagIds.forEach((tagId) => {
        searchQuery = searchQuery.andWhere('tags.id = :tagId', { tagId });
      });
    } else if (tagIds !== undefined) {
      searchQuery = searchQuery.andWhere('tags.id = :tagId', { tagId: tagIds });
    }

    searchQuery = searchQuery
      .orderBy(`room.${parsedSort}`, parsedOrder)
      .limit(limit)
      .offset(offset);

    const [data, count] = await searchQuery.getManyAndCount();

    return {
      data,
      count,
    };
  }

  getRoomWithRelations(id: number, relations: RoomRelation[]): Promise<Room> {
    return this.findOne({
      where: { id: id },
      relations: relations,
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

  async addMember(roomId: number, userId: number): Promise<void> {
    await this.createQueryBuilder()
      .relation(Room, 'members')
      .of(roomId)
      .add(userId);
  }

  async addOwner(roomId: number, userId: number): Promise<void> {
    await this.createQueryBuilder()
      .relation(Room, 'owners')
      .of(roomId)
      .add(userId);
  }

  async addTag(roomId: number, tagId: number): Promise<void> {
    await this.createQueryBuilder()
      .relation(Room, 'tags')
      .of(roomId)
      .add(tagId);
  }

  async removeTag(roomId: number, tagId: number): Promise<void> {
    await this.createQueryBuilder()
      .relation(Room, 'tags')
      .of(roomId)
      .remove(tagId);
  }

  async removeMember(roomId: number, userId: number): Promise<void> {
    await this.createQueryBuilder()
      .relation(Room, 'members')
      .of(roomId)
      .remove(userId);
  }

  async removeOwner(roomId: number, userId: number): Promise<void> {
    await this.createQueryBuilder()
      .relation(Room, 'owners')
      .of(roomId)
      .remove(userId);
  }
}
