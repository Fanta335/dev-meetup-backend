import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetAccessToken } from 'src/users/get-access-token.decorator';
import { UserAccessToken } from 'src/users/types';
import { CreateRoomDTO } from './dto/createRoom.dto';
import { UpdateRoomDTO } from './dto/updateRoom.dto';
import { Room } from './entity/room.entity';
import { RoomsService } from './rooms.service';

@Controller('rooms')
@UseGuards(AuthGuard('jwt'))
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createRoom(
    @GetAccessToken() token: UserAccessToken,
    @Body() createRoomDTO: CreateRoomDTO,
  ): Promise<Room> {
    return this.roomsService.createRoom(token, createRoomDTO);
  }

  @Get()
  getAllRooms(): Promise<Room[]> {
    return this.roomsService.getAllRooms();
  }

  @Get('search')
  searchRooms(
    // @Query('name') name?: string,
    @Query('owner') owner: number,
    // @Query('member') member?: number,
  ): Promise<Room[]> {
    if (typeof owner === 'number') {
      return this.roomsService.getOwnRooms(owner);
    }
  }

  @Get(':id')
  getByRoomId(@Param('id') id: number): Promise<Room> {
    return this.roomsService.getByRoomId(id);
  }

  @Get(':name')
  getByRoomName(@Body() name: string): Promise<Room> {
    return this.roomsService.getByRoomName(name);
  }

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
