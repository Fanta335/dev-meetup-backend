import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from 'src/users/entity/user.repository';
import { UserAccessToken } from 'src/users/types';
import { CreateRoomDTO } from './dto/createRoom.dto';
import { UpdateRoomDTO } from './dto/updateRoom.dto';
import { Room } from './entity/room.entity';
import { RoomsRepository } from './entity/room.repository';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(RoomsRepository)
    private roomsRepository: RoomsRepository,
    private usersRepository: UsersRepository,
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
    const room = await this.roomsRepository.getByRoomId(id);
    if (!room) {
      throw new NotFoundException(`Room not found matched id: ${id}`);
    }

    return room;
  }

  async getByRoomName(name: string): Promise<Room> {
    const room = await this.roomsRepository.getByRoomName(name);
    if (!room) {
      throw new NotFoundException(`Room not found matched name: ${name}`);
    }

    return room;
  }

  async getOwnRooms(token: UserAccessToken): Promise<Room[]> {
    const ownerId: number = token[this.claimMysqlUser].id;
    const rooms = await this.roomsRepository.getOwnRooms(ownerId);
    if (!rooms) {
      throw new NotFoundException(
        `Room not found that belongs to the user of id: ${ownerId}`,
      );
    }

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

  updateRoom(id: number, updateRoomDTO: UpdateRoomDTO): Promise<Room> {
    return this.roomsRepository.updateRoom(id, updateRoomDTO);
  }

  async deleteRoom(id: number): Promise<Room> {
    const room = await this.getByRoomId(id);

    return this.roomsRepository.remove(room);
  }
}
