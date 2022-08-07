import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import dayjs from 'dayjs';
import { FilesService } from 'src/files/files.service';
import { Room } from 'src/rooms/entity/room.entity';
import { RoomsRepository } from 'src/rooms/entity/room.repository';
import { isValidUpdateFrequency } from './utils/checkUpdateFrequency';
import { deleteUserInAuth0 } from './auth0/deleteUserInAuth0';
import { fetchAuth0ManegementAPIToken } from './auth0/fetchAuth0ManagementAPIToken';
import { updateUserInAuth0 } from './auth0/updateUserInAuth0';
import { CreateUserDTO } from './dto/createUser.dto';
import { UpdateRootUserDTO } from './dto/updateRootUser.dto';
import { UpdateUserDTO } from './dto/updateUser.dto';
import { User } from './entity/user.entity';
import { UsersRepository } from './entity/user.repository';
import { UserAccessToken } from './types';
import { isValidPassword } from './utils/isValidPassword';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private roomsRepository: RoomsRepository,
    private filesService: FilesService,
  ) {}

  namespace = process.env.AUTH0_NAMESPACE;
  claimMysqlUser = this.namespace + '/mysqlUser';

  async createUser(createUserDTO: CreateUserDTO): Promise<User> {
    const { name, avatarUrl } = createUserDTO;
    const avatar = await this.filesService.addDefaultAvatar(avatarUrl, name);
    return this.usersRepository.createUser(createUserDTO, avatar);
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

  async getUserProfile(token: UserAccessToken): Promise<User> {
    const userIdFromToken: number = token[this.claimMysqlUser].id;
    return this.usersRepository.getUserProfile(userIdFromToken);
  }

  async getBelongingRooms(token: UserAccessToken): Promise<Room[]>;
  async getBelongingRooms(id: number): Promise<Room[]>;
  async getBelongingRooms(
    tokenOrId: UserAccessToken | number,
  ): Promise<Room[]> {
    if (typeof tokenOrId === 'number') {
      return this.roomsRepository.getBelongingRooms(tokenOrId);
    }

    const userIdFromToken: number = tokenOrId[this.claimMysqlUser].id;
    return this.roomsRepository.getBelongingRooms(userIdFromToken);
  }

  async getOwnRooms(token: UserAccessToken): Promise<Room[]>;
  async getOwnRooms(id: number): Promise<Room[]>;
  async getOwnRooms(tokenOrId: UserAccessToken | number): Promise<Room[]> {
    if (typeof tokenOrId === 'number') {
      return this.roomsRepository.getOwnRooms(tokenOrId);
    }

    const userIdFromToken: number = tokenOrId[this.claimMysqlUser].id;
    return this.roomsRepository.getOwnRooms(userIdFromToken);
  }

  async updateRootUser(
    token: UserAccessToken,
    updateUserDTO: UpdateRootUserDTO,
  ): Promise<User> {
    const { name, email, password } = updateUserDTO;
    // check if the updateUserDTO is valid.
    if (Object.keys(updateUserDTO).length === 0) {
      throw new ForbiddenException('Requested data is empty.');
    }

    if (password && !isValidPassword(password)) {
      throw new ForbiddenException('Invalid password.');
    }

    // check if the value of updated_at in user_metadata in the access token.
    const currentDatetime = dayjs();
    if (
      !isValidUpdateFrequency(
        token[this.claimMysqlUser],
        currentDatetime,
        updateUserDTO,
      )
    ) {
      throw new ForbiddenException('Too frequent udpates.');
    }

    const userIdFromToken: number = token[this.claimMysqlUser].id;
    const userSubId: string = token.sub;
    const userToBeUpdated = await this.usersRepository.findByUserId(
      userIdFromToken,
    );
    const newUser = userToBeUpdated;

    // update user in auth0
    const tokenForManagementAPI = await fetchAuth0ManegementAPIToken();
    const currentDatetimeString = currentDatetime.format(
      'YYYY-MM-DDTHH:mm:ss.sss[Z]',
    );

    if (name !== undefined) {
      updateUserInAuth0(tokenForManagementAPI, userSubId, {
        username: name,
        user_metadata: {
          username_updated_at: currentDatetimeString,
        },
      });
      newUser.name = name;
    }
    if (email !== undefined) {
      updateUserInAuth0(tokenForManagementAPI, userSubId, {
        email: email,
        user_metadata: {
          email_updated_at: currentDatetimeString,
        },
      });
      newUser.email = email;
    }
    // password data is only in auth0.
    if (password !== undefined) {
      updateUserInAuth0(tokenForManagementAPI, userSubId, {
        password: password,
        user_metadata: {
          password_updated_at: currentDatetimeString,
        },
      });
    }

    return this.usersRepository.save(newUser);
  }

  async updateUser(
    token: UserAccessToken,
    updateUserDTO: UpdateUserDTO,
    file: Express.Multer.File,
  ): Promise<User>;
  async updateUser(
    id: number,
    updateUserDTO: UpdateUserDTO,
    file: Express.Multer.File,
  ): Promise<User>;
  async updateUser(
    tokenOrId: UserAccessToken | number,
    updateUserDTO: UpdateUserDTO,
    file: Express.Multer.File,
  ): Promise<User> {
    if (Object.keys(updateUserDTO).length === 0 && file === undefined) {
      return;
    }

    const userId: number =
      typeof tokenOrId === 'number'
        ? tokenOrId
        : tokenOrId[this.claimMysqlUser].id;

    const userToBeUpdated = await this.usersRepository.findByUserId(userId);
    const newUser = userToBeUpdated;

    if (updateUserDTO.description) {
      newUser.description = updateUserDTO.description;
    }

    if (file) {
      const { buffer, originalname, mimetype } = file;
      const avatar = await this.filesService.uploadPublicFile(
        buffer,
        originalname,
        mimetype,
      );
      newUser.avatar = avatar;
    }

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

    const roomToLeave = await this.roomsRepository.findOne({
      relations: ['owners', 'members'],
      where: { id: roomId },
    });

    const ownerIds = roomToLeave.owners.map((owner) => owner.id);
    const isOwner = ownerIds.some((ownerId) => ownerId === userId);

    if (isOwner) {
      throw new ForbiddenException(
        `You can not leaeve the room because you are the admin of this room.`,
      );
    }

    const memberIds = roomToLeave.members.map((member) => member.id);
    const isMember = memberIds.some((memberId) => memberId === userId);

    if (!isMember) {
      throw new ForbiddenException(`You are not a member of this room.`);
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

  async softDeleteUser(token: UserAccessToken): Promise<User>;
  async softDeleteUser(id: number, subId: string): Promise<User>;
  async softDeleteUser(
    tokenOrId: UserAccessToken | number,
    subId?: string,
  ): Promise<User> {
    const userId: number =
      typeof tokenOrId === 'number'
        ? tokenOrId
        : tokenOrId[this.claimMysqlUser].id;
    const userToDelete = await this.findByUserId(userId);

    // check if the user does not own rooms.
    const ownRooms = await this.roomsRepository.getOwnRooms(userId);
    console.log('own rooms ', ownRooms);
    if (ownRooms.length > 0) {
      throw new ForbiddenException(
        'This user owns rooms. Transfer ownership authority to anyone or delete all own rooms.',
      );
    }

    // soft delete user in mysql.
    await this.usersRepository.softDelete(userId);

    // hard delete user in auth0.
    const tokenForManagementAPI = await fetchAuth0ManegementAPIToken();
    const userSubId: string =
      typeof tokenOrId === 'number' ? subId : tokenOrId.sub;
    deleteUserInAuth0(tokenForManagementAPI, userSubId);

    return userToDelete;
  }
}
