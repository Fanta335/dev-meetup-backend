import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/messages/entity/message.entity';
import { MessagesRepository } from 'src/messages/entity/message.repsitory';
import { User } from 'src/users/entity/user.entity';
import { UsersRepository } from 'src/users/entity/user.repository';
import { UserAccessToken } from 'src/users/types';
import { CreateRoomDTO } from './dto/createRoom.dto';
import { SearchRoomDTO } from './dto/searchRoom.dto';
import { UpdateRoomDTO } from './dto/updateRoom.dto';
import { Room } from './entity/room.entity';
import { RoomsRepository } from './entity/room.repository';
import { orderParser } from './utils/orderParser';
import { sortParser } from './utils/sortParser';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(RoomsRepository)
    private roomsRepository: RoomsRepository,
    private usersRepository: UsersRepository,
    private messageRepository: MessagesRepository,
  ) {}

  // Define claim in order to get user metadata.
  namespace = process.env.AUTH0_NAMESPACE;
  claimMysqlUser = this.namespace + '/mysqlUser';

  async createRoom(
    token: UserAccessToken,
    createRoomDTO: CreateRoomDTO,
  ): Promise<Room> {
    const userId: number = token[this.claimMysqlUser].id;
    const user = await this.usersRepository.findByUserId(userId);
    return this.roomsRepository.createRoom(user, createRoomDTO);
  }

  getAllRooms(): Promise<Room[]> {
    return this.roomsRepository.getAllRooms();
  }

  async getByRoomId(id: number): Promise<Room> {
    const room = await this.roomsRepository.getRoomById(id);
    if (!room) {
      throw new NotFoundException(`Room not found matched id: ${id}`);
    }

    return room;
  }

  async getByRoomName(name: string): Promise<Room> {
    const room = await this.roomsRepository.getRoomByName(name);
    if (!room) {
      throw new NotFoundException(`Room not found matched name: ${name}`);
    }

    return room;
  }

  async getBelongingRooms(token: UserAccessToken): Promise<Room[]> {
    const memberId: number = token[this.claimMysqlUser].id;
    const rooms = await this.roomsRepository.getBelongingRooms(memberId);
    if (!rooms) {
      throw new NotFoundException(
        `Room not found that belongs to the user of id: ${memberId}`,
      );
    }

    return rooms;
  }

  async getRoomById(id: number): Promise<Room> {
    const room = await this.roomsRepository.getRoomById(id);

    if (!room) {
      throw new NotFoundException(`Room not found matched id: ${id}`);
    }

    return room;
  }

  async searchRooms(searchRoomDTO: SearchRoomDTO): Promise<Room[]> {
    const { sort, order } = searchRoomDTO;
    const parsedSort = sortParser(sort);
    const parsedOrder = orderParser(order);

    const rooms = await this.roomsRepository.searchRooms(
      searchRoomDTO,
      parsedSort,
      parsedOrder,
    );
    // console.log('rooms: ', rooms);

    return rooms;
  }

  async getRoomDetailById(token: UserAccessToken, id: number): Promise<Room> {
    const userId: number = token[this.claimMysqlUser].id;
    const room = await this.roomsRepository.getRoomDetail(id);

    // Check if the room exists.
    if (!room) {
      throw new NotFoundException(`Room not found matched id: ${id}`);
    }

    // Check if the user is a member of the room.
    const isMember =
      room.members.find((member) => member.id === userId) !== undefined;

    if (!isMember) {
      throw new ForbiddenException(
        `You do not have the permission to access this resource. Only members of the room have the permission.`,
      );
    }

    return room;
  }

  async getLimitedMessage(id: number): Promise<Message[]> {
    return this.messageRepository.getLimitedMessages(id);
  }

  async getRoomMembersById(id: number): Promise<User[]> {
    return this.roomsRepository.getRoomMembersById(id);
  }

  async updateRoom(
    id: number,
    token: UserAccessToken,
    updateRoomDTO: UpdateRoomDTO,
  ): Promise<Room> {
    const userId: number = token[this.claimMysqlUser].id;
    const roomToBeUpdated = await this.roomsRepository.getRoomWithOwners(id);
    const isOwnerOfRoom = roomToBeUpdated.owners.some(
      (user) => user.id === userId,
    );

    if (!isOwnerOfRoom) {
      throw new ForbiddenException(
        `You do not have the permission to update this resource. Only owners of the room have the permission.`,
      );
    }

    // owners property is no longer needed to update rooms table.
    delete roomToBeUpdated.owners;

    const newRoom: Room = {
      ...roomToBeUpdated,
      ...updateRoomDTO,
    };

    return this.roomsRepository.save(newRoom);
  }

  async deleteRoom(id: number): Promise<Room> {
    const room = await this.getByRoomId(id);

    return this.roomsRepository.remove(room);
  }
}
