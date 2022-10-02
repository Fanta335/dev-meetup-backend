import { CustomRepository } from 'src/database/typeorm-ex.decorator';
import { PublicFile } from 'src/files/entity/publicFile.entity';
import { Tag } from 'src/tags/entity/tag.entity';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { ParsedCreateRoomDTO } from '../dto/createRoom.dto';
import { ParsedSearchQuery, RoomRelation } from '../types';
import { Room } from './room.entity';

@CustomRepository(Room)
export class RoomsRepository extends Repository<Room> {
  async createRoom(
    user: User,
    { name, description, isPrivate }: ParsedCreateRoomDTO,
    tags: Tag[],
    avatar?: PublicFile,
  ): Promise<Room> {
    const room = new Room();
    room.name = name;
    room.description = description;
    room.isPrivate = isPrivate;
    room.owners = [user];
    room.members = [user];
    room.tags = tags;
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
    parsedSearchQuery: ParsedSearchQuery,
  ): Promise<{ data: Room[]; count: number }> {
    const { query, offset, limit, sort, order, tagId } = parsedSearchQuery;

    let searchQuery = this.createQueryBuilder('room')
      .where('room.name LIKE :name', { name: `%${query}%` })
      .andWhere('room.isPrivate = false')
      .leftJoin('room.tags', 'tag')
      .leftJoinAndSelect('room.tags', 'tagSelect')
      .leftJoinAndSelect('room.avatar', 'public_file')
      .loadRelationCountAndMap('room.numOfMembers', 'room.members', 'user');

    if (tagId) {
      searchQuery = searchQuery.andWhere('tag.id = :tagId', { tagId });
    }

    searchQuery = searchQuery
      .orderBy(`room.${sort}`, order)
      .skip(offset)
      .take(limit);

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