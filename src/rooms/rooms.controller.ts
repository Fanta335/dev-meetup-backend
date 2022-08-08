import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileUploadDTO } from 'src/files/dto/fileUpload.dto';
import { GetAccessToken } from 'src/users/get-access-token.decorator';
import { UserAccessToken } from 'src/users/types';
import { AddOwnerDTO } from './dto/addOwner.dto';
import { CreateRoomDTO } from './dto/createRoom.dto';
import { RemoveOwnerDTO } from './dto/removeOwner.dto';
import { SortOptionsType, OrderOptionsType } from './dto/searchRoom.dto';
import { UpdateRoomDTO } from './dto/updateRoom.dto';
import { Room } from './entity/room.entity';
import { RoomsService } from './rooms.service';

@ApiBearerAuth()
@ApiTags('rooms')
@Controller('rooms')
@UseGuards(AuthGuard('jwt'))
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @ApiOperation({ description: 'Create a new room.' })
  @ApiResponse({ status: 201, description: 'Room successfully created.' })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  createRoom(
    @GetAccessToken() token: UserAccessToken,
    @Body() createRoomDTO: CreateRoomDTO,
    @UploadedFile() file: Express.Multer.File | undefined,
  ): Promise<Room> {
    if (!file) return this.roomsService.createRoom(token, createRoomDTO);
    return this.roomsService.createRoom(token, createRoomDTO, file);
  }

  @ApiOperation({ description: 'Retrieve all rooms.' })
  @ApiResponse({ status: 200, description: 'Rooms successfully retrieved.' })
  @Get()
  getAllRooms(): Promise<Room[]> {
    return this.roomsService.getAllRooms();
  }

  @ApiOperation({
    description: 'Retrieve rooms that match the specified search criteria.',
  })
  @ApiResponse({ status: 200, description: 'Rooms successfully retrieved.' })
  @ApiQuery({ name: 'query', description: 'Search query' })
  @ApiQuery({
    name: 'offset',
    description: 'Page index of the results to return. First page is 0.',
  })
  @ApiQuery({ name: 'limit', description: 'Number of results per page.' })
  @ApiQuery({
    name: 'sort',
    description: 'Field to use for sorting. Available field is `date`.',
  })
  @ApiQuery({
    name: 'order',
    description:
      'Option for order of the results. Available options are `a` (ascending) and `d` (descending).',
  })
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

  @ApiOperation({ description: 'Retrieve room details.' })
  @ApiResponse({ status: 200, description: 'Rooms successully retrieved.' })
  @Get(':id')
  getRoomById(@Param('id') id: string): Promise<Room> {
    return this.roomsService.getRoomById(Number(id));
  }

  @ApiOperation({
    description:
      'Retrieve room details with `owners`, `members`, `messages`, and `avatar`.',
  })
  @ApiResponse({ status: 200, description: 'Rooms successully retrieved.' })
  @Get(':id/detail')
  getRoomDetailById(
    @GetAccessToken() token: UserAccessToken,
    @Param('id') id: string,
  ): Promise<Room> {
    return this.roomsService.getRoomDetailById(token, Number(id));
  }

  @ApiOperation({ description: 'Update a room' })
  @ApiResponse({ status: 201, description: 'Rooms successully updated.' })
  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Room avatar.', type: FileUploadDTO })
  updateRoom(
    @Param('id') id: string,
    @GetAccessToken() token: UserAccessToken,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateRoomDTO: UpdateRoomDTO,
  ): Promise<Room> {
    return this.roomsService.updateRoom(Number(id), token, file, updateRoomDTO);
  }

  @ApiOperation({ description: 'Add an owner to the room' })
  @ApiResponse({ status: 200, description: 'Room owner successully added.' })
  @Patch(':id/owners/add')
  addOwner(
    @GetAccessToken() token: UserAccessToken,
    @Param('id') roomId: string,
    @Body() addOwnerDTO: AddOwnerDTO,
  ): Promise<Room> {
    return this.roomsService.addOwner(token, Number(roomId), addOwnerDTO);
  }

  @ApiOperation({ description: 'Remove an owner from the room' })
  @ApiResponse({ status: 200, description: 'Room owner successully removed.' })
  @Patch(':id/owners/remove')
  removeOwner(
    @GetAccessToken() token: UserAccessToken,
    @Param('id') roomId: string,
    @Body() removeOwnerDTO: RemoveOwnerDTO,
  ): Promise<Room> {
    return this.roomsService.removeOwner(token, Number(roomId), removeOwnerDTO);
  }

  @ApiOperation({ description: 'Delete a room.' })
  @ApiResponse({ status: 204, description: 'Rooms successully deleted.' })
  @Delete(':id')
  deleteRoom(
    @Param('id') id: string,
    @GetAccessToken() token: UserAccessToken,
  ): Promise<Room> {
    return this.roomsService.softDeleteRoom(Number(id), token);
  }
}
