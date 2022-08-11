import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
import { AddTagDTO } from './dto/addTag.dto';
import { CreateRoomDTO } from './dto/createRoom.dto';
import { RemoveOwnerDTO } from './dto/removeOwner.dto';
import { RemoveTagDTO } from './dto/removeTag.dto';
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
  searchRoomsFixed(
    @Query('query') query: string | string[],
    @Query('offset') offset: string | string[],
    @Query('limit') limit: string | string[],
    @Query('sort') sort: string | string[],
    @Query('order') order: string | string[],
    @Query('tagId') tagId: string | string[],
  ): Promise<{ data: Room[]; count: number }> {
    return this.roomsService.searchRooms({
      query,
      offset,
      limit,
      sort,
      order,
      tagId,
    });
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
  @Patch(':id')
  updateRoom(
    @Param('id') id: string,
    @GetAccessToken() token: UserAccessToken,
    @Body() updateRoomDTO: UpdateRoomDTO,
  ): Promise<Room> {
    return this.roomsService.updateRoom(Number(id), token, updateRoomDTO);
  }

  @ApiOperation({ description: 'Update a room avatar' })
  @ApiResponse({
    status: 201,
    description: 'Room avatar successfully updated.',
  })
  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Room avatar.', type: FileUploadDTO })
  postRoomAvatar(
    @Param('id') id: string,
    @GetAccessToken() token: UserAccessToken,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Room> {
    return this.roomsService.addAvatar(Number(id), token, file);
  }

  @ApiOperation({ description: 'Add an member to the room' })
  @ApiResponse({ status: 200, description: 'Room member successully added.' })
  @Patch(':id/members/add')
  addMember(
    @GetAccessToken() token: UserAccessToken,
    @Param('id') roomId: string,
  ): Promise<Room> {
    return this.roomsService.addMember(token, Number(roomId));
  }

  @ApiOperation({ description: 'Remove an member from the room' })
  @ApiResponse({ status: 200, description: 'Room member successully removed.' })
  @Patch(':id/members/remove')
  removeMember(
    @GetAccessToken() token: UserAccessToken,
    @Param('id') roomId: string,
  ): Promise<Room> {
    return this.roomsService.removeMember(token, Number(roomId));
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

  @ApiOperation({ description: 'Add an tag to the room' })
  @ApiResponse({ status: 200, description: 'Tag successfully added.' })
  @Patch(':id/tags/add')
  addTag(
    @GetAccessToken() token: UserAccessToken,
    @Param('id') roomId: string,
    @Body() addTagDTO: AddTagDTO,
  ): Promise<Room> {
    return this.roomsService.addTag(token, Number(roomId), addTagDTO);
  }

  @ApiOperation({ description: 'Remove an tag from the room' })
  @ApiResponse({ status: 200, description: 'Tag successfully removed.' })
  @Patch(':id/tags/remove')
  removeTag(
    @GetAccessToken() token: UserAccessToken,
    @Param('id') roomId: string,
    @Body() removeTagDTO: RemoveTagDTO,
  ): Promise<Room> {
    return this.roomsService.removeTag(token, Number(roomId), removeTagDTO);
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
