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

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDTO: CreateUserDTO): Promise<User> {
    return this.usersService.createUser(createUserDTO);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAllUsers(): Promise<User[]> {
    // console.log(user);
    return this.usersService.findAllUsers();
  }

  @Get('search')
  findByUserSubId(@Query('sub-id') subId: string): Promise<User> {
    console.log(subId);
    return this.usersService.findByUserSubId(subId);
  }

  @Get(':id')
  findByUserId(@Param('id') id: string): Promise<User> {
    return this.usersService.findByUserId(Number(id));
  }

  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDTO: UpdateUserDTO,
  ): Promise<User> {
    return this.usersService.updateUser(Number(id), updateUserDTO);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string): Promise<User> {
    return this.usersService.deleteUser(Number(id));
  }
}
