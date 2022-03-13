import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from 'src/users/entity/user.entity';
import { testUser } from 'src/users/testUser';
import { CreateRoomDTO } from './dto/createRoom.dto';
import { Room } from './entity/room.entity';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Post()
  create(
    @Body() createRoomDTO: CreateRoomDTO,
    user: User = testUser,
  ): Promise<Room> {
    return this.roomsService.createRoom(createRoomDTO, user);
  }

  @Get()
  findAll(): Promise<Room[]> {
    return this.roomsService.findAll();
  }
}
