import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from 'src/users/entity/user.entity';
import { CreateRoomDTO } from './dto/createRoom.dto';
import { Room } from './entity/room.entity';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  testUser: User = {
    id: 12345,
    firstName: 'test',
    lastName: 'user',
    photos: [],
    messages: [],
    myRooms: [],
    rooms: [],
    createdAt: new Date('2022-03-12T13:16:06'),
    updatedAt: new Date('2022-03-12T13:16:06'),
  };

  @Post()
  create(
    @Body() createRoomDTO: CreateRoomDTO,
    user: User = this.testUser,
  ): Promise<Room> {
    return this.roomsService.createRoom(createRoomDTO, user);
  }

  @Get()
  findAll(): Promise<Room[]> {
    return this.roomsService.findAll();
  }
}
