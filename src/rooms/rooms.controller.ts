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
import { Message } from 'src/messages/entity/message.entity';
import { GetAccessToken } from 'src/users/get-access-token.decorator';
import { UserAccessToken } from 'src/users/types';
import { CreateRoomDTO } from './dto/createRoom.dto';
import { SortOptionsType, OrderOptionsType } from './dto/searchRoom.dto';
import { UpdateRoomDTO } from './dto/updateRoom.dto';
import { Room } from './entity/room.entity';
import { RoomsService } from './rooms.service';

@Controller('rooms')
@UseGuards(AuthGuard('jwt'))
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

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

  @Get('belonging-rooms')
  getBelongingRooms(@GetAccessToken() token: UserAccessToken): Promise<Room[]> {
    return this.roomsService.getBelongingRooms(token);
  }

  @Get('search')
  searchRooms(
    @Query('query') query: string,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
    @Query('sort') sort: SortOptionsType,
    @Query('order') order: OrderOptionsType,
    // @Query('categoryId') categoryId: number,
  ): Promise<Room[]> {
    return this.roomsService.searchRooms({ query, offset, limit, sort, order });
  }

  @Get(':id')
  getRoomById(@Param('id') id: string): Promise<Room> {
    return this.roomsService.getRoomById(Number(id));
  }

  @Get(':id/detail')
  getRoomDetailById(
    @GetAccessToken() token: UserAccessToken,
    @Param('id') id: string,
  ): Promise<Room> {
    return this.roomsService.getRoomDetailById(token, Number(id));
  }

  @Get(':name')
  getByRoomName(@Body() name: string): Promise<Room> {
    return this.roomsService.getByRoomName(name);
  }

  @Get(':id/limited')
  getLimitedMessage(@Param('id') id: string): Promise<Message[]> {
    return this.roomsService.getLimitedMessage(Number(id));
  }

  @Put(':id')
  updateRoom(
    @Param('id') id: string,
    @GetAccessToken() token: UserAccessToken,
    @Body() updateRoomDTO: UpdateRoomDTO,
  ): Promise<Room> {
    return this.roomsService.updateRoom(Number(id), token, updateRoomDTO);
  }

  @Delete()
  deleteRoom(id: number): Promise<Room> {
    return this.roomsService.deleteRoom(id);
  }
}
