import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/createUser.dto';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from 'src/authz/permissions.guard';
import { Permissions } from 'src/authz/permissions.decorator';
import { GetAccessToken } from './get-access-token.decorator';
import { UserAccessToken } from './types';
import { Room } from 'src/rooms/entity/room.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateRootUserDTO } from './dto/updateRootUser.dto';
import { UpdateUserDTO } from './dto/updateUser.dto';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Post()
  @Permissions('create:users')
  createUser(@Body() createUserDTO: CreateUserDTO): Promise<User> {
    return this.usersService.createUser(createUserDTO);
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  addAvatar(
    @GetAccessToken() token: UserAccessToken,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    console.log('file: ', file);
    return this.usersService.addAvatar(
      token,
      file.buffer,
      file.originalname,
      file.mimetype,
    );
  }

  @Get()
  findAllUsers(): Promise<User[]> {
    return this.usersService.findAllUsers();
  }

  @Get('search')
  findByUserSubId(@Query('sub-id') subId: string): Promise<User> {
    return this.usersService.findByUserSubId(subId);
  }

  @Get('profile')
  getUserProfile(@GetAccessToken() token: UserAccessToken): Promise<User> {
    return this.usersService.getUserProfile(token);
  }

  @Get(':id')
  findByUserId(
    @Param('id') id: number,
    @GetAccessToken() token: UserAccessToken,
  ): Promise<User> {
    return this.usersService.findByUserId(id, token);
  }

  @Get(':id/belonging-rooms')
  getBelongingRooms(
    @GetAccessToken() token: UserAccessToken,
    @Param('id') id: string,
  ): Promise<Room[]> {
    return this.usersService.getBelongingRooms(token, Number(id));
  }

  @Get(':id/own-rooms')
  getOwnRooms(@GetAccessToken() token: UserAccessToken): Promise<Room[]> {
    return this.usersService.getOwnRooms(token);
  }

  // updates a user profile ONLY in mysql.
  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  updateUser(
    @GetAccessToken() token: UserAccessToken,
    @Body() updateUserDTO: UpdateUserDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    return this.usersService.updateUser(token, updateUserDTO, file);
  }

  // updates a user profile in BOTH auth0 and mysql.
  @Put(':id/root')
  updateRootUser(
    @Body() updateUserDTO: UpdateRootUserDTO,
    @GetAccessToken() token: UserAccessToken,
  ): Promise<User> {
    return this.usersService.updateRootUser(token, updateUserDTO);
  }

  @Put(':userId/belonging-rooms/add/:roomId')
  addMemberToRoom(
    @GetAccessToken() token: UserAccessToken,
    @Param('userId') userId: string,
    @Param('roomId') roomId: string,
  ): Promise<Room[]> {
    return this.usersService.addMemberToRoom(
      token,
      Number(userId),
      Number(roomId),
    );
  }

  @Put(':userId/belonging-rooms/remove/:roomId')
  removeMemberFromRoom(
    @GetAccessToken() token: UserAccessToken,
    @Param('userId') userId: string,
    @Param('roomId') roomId: string,
  ): Promise<Room[]> {
    return this.usersService.removeMemberFromRoom(
      token,
      Number(userId),
      Number(roomId),
    );
  }

  @Delete('avatar')
  deleteAvatar(@GetAccessToken() token: UserAccessToken) {
    return this.usersService.deleteAvatar(token);
  }

  @Delete(':id')
  deleteUser(@GetAccessToken() token: UserAccessToken): Promise<User> {
    return this.usersService.softDeleteUser(token);
  }
}
