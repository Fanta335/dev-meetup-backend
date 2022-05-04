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
import { CreateUserDTO } from './dto/createUser.dto';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';
import { UpdateUserDTO } from './dto/updateUser.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from 'src/authz/permissions.guard';
import { Permissions } from 'src/authz/permissions.decorator';
import { GetAccessToken } from './get-access-token.decorator';
import { UserAccessToken } from './types';
import { AddUserToRoomDTO } from './dto/addUserToRoom.dto';

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

  @Get()
  findAllUsers(): Promise<User[]> {
    return this.usersService.findAllUsers();
  }

  @Get('search')
  findByUserSubId(@Query('sub-id') subId: string): Promise<User> {
    return this.usersService.findByUserSubId(subId);
  }

  @Put('room-management')
  addUserToRoom(
    @GetAccessToken() token: UserAccessToken,
    @Body() addUserToRoomDTO: AddUserToRoomDTO,
  ): Promise<void> {
    return this.usersService.addUserToRoom(token, addUserToRoomDTO);
  }

  @Get(':id')
  findByUserId(@Param('id') id: number): Promise<User> {
    return this.usersService.findByUserId(id);
  }

  @Put(':id')
  updateUser(
    @GetAccessToken() token: UserAccessToken,
    @Param('id') id: string,
    @Body() updateUserDTO: UpdateUserDTO,
  ): Promise<User> {
    return this.usersService.updateUser(token, Number(id), updateUserDTO);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string): Promise<User> {
    return this.usersService.deleteUser(Number(id));
  }
}
