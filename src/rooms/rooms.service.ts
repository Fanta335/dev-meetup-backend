import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { CreateRoomDTO } from './dto/createRoom.dto';
import { Room } from './entity/room.entity';
import { RoomsRepository } from './entity/room.repository';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(RoomsRepository)
    private roomsRepository: RoomsRepository,
  ) {}

  createRoom(createRoom: CreateRoomDTO, user: User): Promise<Room> {
    return this.roomsRepository.createRoom(createRoom, user);
  }

  findAll(): Promise<Room[]> {
    return this.roomsRepository.findAll();
  }
}
