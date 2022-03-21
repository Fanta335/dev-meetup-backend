import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/entity/user.entity';
import { CreateRoomDTO } from './dto/createRoom.dto';
import { UpdateRoomDTO } from './dto/updateRoom.dto';
import { Room } from './entity/room.entity';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createRoom(@Body() createRoomDTO: CreateRoomDTO, user: User): Promise<Room> {
    return this.roomsService.createRoom(createRoomDTO, user);
  }

  @Get()
  getAllRooms(): Promise<Room[]> {
    return this.roomsService.getAllRooms();
  }

  @Get()
  getByRoomId(@Param(':id') id: number): Promise<Room> {
    return this.roomsService.getByRoomId(id);
  }

  @Get()
  getByRoomName(@Body() name: string): Promise<Room> {
    return this.roomsService.getByRoomName(name);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  updateRoom(
    @Param(':id') id: number,
    @Body() updateRoomDTO: UpdateRoomDTO,
  ): Promise<Room> {
    return this.roomsService.updateRoom(id, updateRoomDTO);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  deleteRoom(id: number): Promise<Room> {
    return this.roomsService.deleteRoom(id);
  }
}
