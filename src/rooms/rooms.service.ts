import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoomDTO } from './dto/createRoom.dto';
import { UpdateRoomDTO } from './dto/updateRoom.dto';
import { Room } from './entity/room.entity';
import { RoomsRepository } from './entity/room.repository';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(RoomsRepository)
    private roomsRepository: RoomsRepository,
  ) {}

  createRoom(createRoom: CreateRoomDTO, userId: number): Promise<Room> {
    return this.roomsRepository.createRoom(createRoom, userId);
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

  updateRoom(id: number, updateRoomDTO: UpdateRoomDTO): Promise<Room> {
    return this.roomsRepository.updateRoom(id, updateRoomDTO);
  }

  async deleteRoom(id: number): Promise<Room> {
    const room = await this.getByRoomId(id);

    return this.roomsRepository.remove(room);
  }
}
