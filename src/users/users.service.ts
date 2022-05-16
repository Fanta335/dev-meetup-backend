import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { Room } from 'src/rooms/entity/room.entity';
import { RoomsRepository } from 'src/rooms/entity/room.repository';
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
    private roomsRepository: RoomsRepository,
    private filesService: FilesService,
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

  async getBelongingRooms(token: UserAccessToken, id: number): Promise<Room[]> {
    const userIdFromToken: number = token[this.claimMysqlUser].id;

    // Check if the updating user is the person themselves.
    if (userIdFromToken !== id) {
      throw new ForbiddenException(
        `You do not have the permission to access this resource. Only the person themselves have permission.`,
      );
    }

    return this.roomsRepository.getBelongingRooms(id);
  }

  async updateUser(
    token: UserAccessToken,
    id: number,
    updateUserDTO: UpdateUserDTO,
  ): Promise<User> {
    const userIdFromToken: number = token[this.claimMysqlUser].id;

    // Check if the updating user is the person themselves.
    if (userIdFromToken !== id) {
      throw new ForbiddenException(
        `You do not have the permission to access this resource. Only the person themselves can update.`,
      );
    }

    const user = await this.usersRepository.findByUserId(id);
    const newUser = {
      ...user,
      ...updateUserDTO,
    };

    return this.usersRepository.save(newUser);
  }

  async addMemberToRoom(
    token: UserAccessToken,
    userId: number,
    roomId: number,
  ): Promise<Room[]> {
    const userIdFromToken: number = token[this.claimMysqlUser].id;

    if (userIdFromToken !== userId) {
      throw new ForbiddenException(
        `You do not have the permission to access this resource. Only the person themselves can update.`,
      );
    }

    const currentBelongingRooms = await this.roomsRepository.getBelongingRooms(
      userId,
    );
    const isNewRoom = currentBelongingRooms.every((room) => room.id !== roomId);
    if (!isNewRoom) {
      return currentBelongingRooms;
    }

    await this.usersRepository.addMemberToRoom(userId, roomId);

    return this.roomsRepository.getBelongingRooms(userId);
  }

  async removeMemberFromRoom(
    token: UserAccessToken,
    userId: number,
    roomId: number,
  ): Promise<Room[]> {
    const userIdFromToken: number = token[this.claimMysqlUser].id;

    if (userIdFromToken !== userId) {
      throw new ForbiddenException(
        `You do not have the permission to access this resource. Only the person themselves can update.`,
      );
    }

    const currentBelongingRooms = await this.roomsRepository.getBelongingRooms(
      userId,
    );
    const isNewRoom = currentBelongingRooms.every((room) => room.id !== roomId);
    if (isNewRoom) {
      return currentBelongingRooms;
    }

    await this.usersRepository.removeMemberFromRoom(userId, roomId);

    return this.roomsRepository.getBelongingRooms(userId);
  }

  async addAvatar(
    token: UserAccessToken,
    imageBuffer: Buffer,
    filename: string,
    mimetype: string,
  ): Promise<User> {
    const avatar = await this.filesService.uploadPublicFile(
      imageBuffer,
      filename,
      mimetype,
    );
    const userIdFromToken: number = token[this.claimMysqlUser].id;
    const user = await this.usersRepository.findByUserId(userIdFromToken);

    return this.usersRepository.save({ ...user, avatar });
  }

  async deleteAvatar(token: UserAccessToken) {
    const userIdFromToken: number = token[this.claimMysqlUser].id;
    const user = await this.usersRepository.findByUserId(userIdFromToken);
    const fieldId = user.avatar.id;
    if (fieldId) {
      await this.usersRepository.update(userIdFromToken, {
        ...user,
        avatar: null,
      });
      await this.filesService.deletePublicFile(fieldId);
    }
  }

  async deleteUser(id: number): Promise<User> {
    const user = await this.findByUserId(id);

    return this.usersRepository.remove(user);
  }
}
