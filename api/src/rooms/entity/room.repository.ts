import { CustomRepository } from 'src/database/typeorm-ex.decorator';
import { PublicFile } from 'src/files/entity/publicFile.entity';
import { Tag } from 'src/tags/entity/tag.entity';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { ParsedCreateRoomDTO } from '../dto/createRoom.dto';
import { ParsedSearchQuery, RoomRelation } from '../types';
import { Room } from './room.entity';
import { RoomBuilder } from './RoomBuilder';

@CustomRepository(Room)
export class RoomsRepository extends Repository<Room> {
  async createRoom(
    user: User,
    { name, description, isPrivate }: ParsedCreateRoomDTO,
    tags: Tag[],
    avatar?: PublicFile,
  ): Promise<Room> {
    const rb = new RoomBuilder();
    rb.setName(name)
      .setDescription(description)
      .setIsPrivate(isPrivate)
      .setOwners([user])
      .setMembers([user])
      .setTags(tags)
      .setAvatar(avatar);

    return this.save(rb.build());
  }

  getAllRooms(): Promise<Room[]> {
    return this.find();
  }

  getRoomById(id: string): Promise<Room> {
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
      .orderBy('room.createdAt', 'ASC')
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
    const { query, offset, limit, sort, order, tagIds } = parsedSearchQuery;

    let searchQuery = this.createQueryBuilder('room')
      .where('room.name LIKE :name', { name: `%${query}%` })
      .andWhere('room.isPrivate = false')
      .leftJoin('room.tags', 'tag')
      .leftJoinAndSelect('room.tags', 'tagSelect')
      .leftJoinAndSelect('room.avatar', 'public_file')
      .loadRelationCountAndMap('room.numOfMembers', 'room.members', 'user');

    for (const id of tagIds) {
      if (id) {
        searchQuery = searchQuery.andWhere('tag.id = :id', { id });
      }
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

  getRoomWithRelations(id: string, relations: RoomRelation[]): Promise<Room> {
    return this.findOne({
      where: { id: id },
      relations: relations,
    });
  }

  async getRoomMembersById(id: string): Promise<User[]> {
    const room = await this.findOne({
      where: { id: id },
      relations: ['members'],
    });

    return room.members;
  }

  async addMember(roomId: string, userId: number): Promise<void> {
    await this.createQueryBuilder()
      .relation(Room, 'members')
      .of(roomId)
      .add(userId);
  }

  async addOwner(roomId: string, userId: number): Promise<void> {
    await this.createQueryBuilder()
      .relation(Room, 'owners')
      .of(roomId)
      .add(userId);
  }

  async addTag(roomId: string, tagId: number): Promise<void> {
    await this.createQueryBuilder()
      .relation(Room, 'tags')
      .of(roomId)
      .add(tagId);
  }

  async removeTag(roomId: string, tagId: number): Promise<void> {
    await this.createQueryBuilder()
      .relation(Room, 'tags')
      .of(roomId)
      .remove(tagId);
  }

  async removeMember(roomId: string, userId: number): Promise<void> {
    await this.createQueryBuilder()
      .relation(Room, 'members')
      .of(roomId)
      .remove(userId);
  }

  async removeOwner(roomId: string, userId: number): Promise<void> {
    await this.createQueryBuilder()
      .relation(Room, 'owners')
      .of(roomId)
      .remove(userId);
  }
}
