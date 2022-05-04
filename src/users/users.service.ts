import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddUserToRoomDTO } from './dto/addUserToRoom.dto';
import { CreateUserDTO } from './dto/createUser.dto';
import { UpdateUserDTO } from './dto/updateUser.dto';
import { User } from './entity/user.entity';
import { UsersRepository } from './entity/user.repository';
import { UserAccessToken } from './types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  namespace = process.env.AUTH0_NAMESPACE;
  claimMysqlUser = this.namespace + '/mysqlUser';

  createUser(createUserDTO: CreateUserDTO): Promise<User> {
    return this.usersRepository.createUser(createUserDTO);
  }

  findAllUsers(): Promise<User[]> {
    return this.usersRepository.findAllUsers();
  }

  async findByUserId(id: number): Promise<User> {
    const user = await this.usersRepository.findByUserId(id);
    if (!user) {
      throw new NotFoundException(`User not found matched id: '${id}'.`);
    }
    return user;
  }

  async findByUserSubId(subId: string): Promise<User> {
    const user = await this.usersRepository.findByUserSubId(subId);
    if (!user) {
      throw new NotFoundException(`User not found matched subId: '${subId}'.`);
    }
    return user;
  }

  async updateUser(
    token: UserAccessToken,
    id: number,
    updateUserDTO: UpdateUserDTO,
  ): Promise<User> {
    const userIdFromToken: number = token[this.claimMysqlUser].id;

    // Check if the updating user is the person himself/herself.
    if (userIdFromToken !== id) {
      throw new ForbiddenException(
        `You do not have the permission to access this resource. Only the person himself/herself can update.`,
      );
    }

    const user = await this.usersRepository.findByUserId(id);
    const newUser = {
      ...user,
      ...updateUserDTO,
    };

    return this.usersRepository.save(newUser);
  }

  async addUserToRoom(
    token: UserAccessToken,
    addUserToRoomDTO: AddUserToRoomDTO,
  ): Promise<void> {
    const userId: number = token[this.claimMysqlUser].id;
    const { roomIdToJoin } = addUserToRoomDTO;

    return this.usersRepository.addUserToRoom(userId, roomIdToJoin);
  }

  async deleteUser(id: number): Promise<User> {
    const user = await this.findByUserId(id);

    return this.usersRepository.remove(user);
  }
}
