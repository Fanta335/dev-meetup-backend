import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteUserDTO } from './dto/deleteUser.dto';
import { FileUploadDTO } from 'src/files/dto/fileUpload.dto';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ description: 'Create a new user.' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  @Post()
  @Permissions('create:users')
  createUser(@Body() createUserDTO: CreateUserDTO): Promise<User> {
    return this.usersService.createUser(createUserDTO);
  }

  @Permissions('read:users')
  @ApiOperation({ description: 'Retrieve all users.' })
  @ApiResponse({ status: 200, description: 'Users successfully retrieved.' })
  @Get()
  findAllUsers(): Promise<User[]> {
    return this.usersService.findAllUsers();
  }

  // @Permissions('read:myself')
  @ApiOperation({ description: 'Retrieve own user details.' })
  @ApiResponse({ status: 200, description: 'Users successfully retrieved.' })
  @Get('me')
  getUserProfile(@GetAccessToken() token: UserAccessToken): Promise<User> {
    return this.usersService.getUserProfile(token);
  }

  // updates a user profile ONLY in mysql.
  // @Permissions('update:myself')
  @ApiOperation({ description: 'Update a user.' })
  @ApiResponse({ status: 200, description: 'User successfully updated.' })
  @Patch('me')
  @UseInterceptors(FileInterceptor('file'))
  updateMyUser(
    @GetAccessToken() token: UserAccessToken,
    @Body() updateUserDTO: UpdateUserDTO,
  ): Promise<User> {
    return this.usersService.updateUser(token, updateUserDTO);
  }

  // @Permissions('update:myself')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file for user avatar.',
    type: FileUploadDTO,
  })
  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('file'))
  addMyAvatar(
    @GetAccessToken() token: UserAccessToken,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    return this.usersService.addAvatar(token, file.buffer, file.mimetype);
  }

  // updates a user profile in BOTH auth0 and mysql.
  @ApiOperation({
    description: 'Update a user at root level: both in MySQL & Auth0.',
  })
  @ApiResponse({ status: 201, description: 'User successfully updated.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the user to update.',
  })
  @Patch('me/root')
  updateMyRootUser(
    @GetAccessToken() token: UserAccessToken,
    @Body() updateUserDTO: UpdateRootUserDTO,
  ): Promise<User> {
    return this.usersService.updateRootUser(token, updateUserDTO);
  }

  // @Permissions('read:myself')
  @ApiOperation({ description: 'Retrieve user belonging rooms.' })
  @ApiResponse({ status: 200, description: 'Rooms successfully retrieved.' })
  @Get('me/belonging-rooms')
  getMyBelongingRooms(
    @GetAccessToken() token: UserAccessToken,
  ): Promise<Room[]> {
    return this.usersService.getBelongingRooms(token);
  }

  // @Permissions('read:myself')
  @ApiOperation({ description: 'Retrieve user own rooms.' })
  @ApiResponse({ status: 200, description: 'Rooms successfully retrieved.' })
  @Get('me/own-rooms')
  getMyOwnRooms(@GetAccessToken() token: UserAccessToken): Promise<Room[]> {
    return this.usersService.getOwnRooms(token);
  }

  @Permissions('read:users')
  @ApiOperation({ description: 'Retrieve user details.' })
  @ApiResponse({ status: 200, description: 'User successfully retrieved.' })
  @Get(':id')
  findByUserId(@Param('id') id: string): Promise<User> {
    return this.usersService.findByUserId(Number(id));
  }

  @Permissions('update:users')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file for user avatar.',
    type: FileUploadDTO,
  })
  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('file'))
  addAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    return this.usersService.addAvatar(Number(id), file.buffer, file.mimetype);
  }

  @Permissions('read:users')
  @ApiOperation({ description: 'Retrieve user belonging rooms.' })
  @ApiResponse({ status: 200, description: 'Rooms successfully retrieved.' })
  @Get(':id/belonging-rooms')
  getBelongingRooms(@Param('id') id: string): Promise<Room[]> {
    return this.usersService.getBelongingRooms(Number(id));
  }

  @ApiOperation({ description: 'Retrieve user own rooms.' })
  @ApiResponse({ status: 200, description: 'Rooms successfully retrieved.' })
  @Get(':id/own-rooms')
  getOwnRooms(@Param('id') id: string): Promise<Room[]> {
    return this.usersService.getOwnRooms(Number(id));
  }

  // updates a user profile ONLY in mysql.
  @ApiOperation({ description: 'Update a user.' })
  @ApiResponse({ status: 200, description: 'User successfully updated.' })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDTO: UpdateUserDTO,
  ): Promise<User> {
    return this.usersService.updateUser(Number(id), updateUserDTO);
  }

  @ApiOperation({ description: 'Delete a user.' })
  @ApiResponse({ status: 204, description: 'User successfully deleted.' })
  @Delete('me')
  deleteMyUser(@GetAccessToken() token: UserAccessToken): Promise<User> {
    return this.usersService.softDeleteUser(token);
  }

  @ApiOperation({ description: 'Delete a user.' })
  @ApiResponse({ status: 204, description: 'User successfully deleted.' })
  @Delete(':id')
  deleteUser(
    @Param('id') id: string,
    @Body() deleteUserDTO: DeleteUserDTO,
  ): Promise<User> {
    return this.usersService.softDeleteUser(Number(id), deleteUserDTO.subId);
  }
}
