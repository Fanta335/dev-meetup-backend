import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FilesService } from 'src/files/files.service';
import { Message } from 'src/messages/entity/message.entity';
import { MessagesRepository } from 'src/messages/entity/message.repsitory';
import { Tag } from 'src/tags/entity/tag.entity';
import { TagsRepository } from 'src/tags/entity/tag.repository';
import { User } from 'src/users/entity/user.entity';
import { UsersRepository } from 'src/users/entity/user.repository';
import { UserAccessToken } from 'src/users/types';
import { AddOwnerDTO } from './dto/addOwner.dto';
import { AddTagDTO } from './dto/addTag.dto';
import { CreateRoomDTO } from './dto/createRoom.dto';
import { RemoveOwnerDTO } from './dto/removeOwner.dto';
import { RemoveTagDTO } from './dto/removeTag.dto';
import { SearchRoomDTO } from './dto/searchRoom.dto';
import { UpdateRoomDTO } from './dto/updateRoom.dto';
import { Room } from './entity/room.entity';
import { RoomsRepository } from './entity/room.repository';
import { parseCreateRoomDTO } from './utils/parseCreateRoomDTO';
import { parseSearchQuery } from './utils/parseSearchQuery';

@Injectable()
export class RoomsService {
  constructor(
    private roomsRepository: RoomsRepository,
    private usersRepository: UsersRepository,
    private messageRepository: MessagesRepository,
    private tagsRepository: TagsRepository,
    private filesService: FilesService,
  ) {}

  // Define claim in order to get user metadata.
  namespace = process.env.AUTH0_NAMESPACE;
  claimMysqlUser = this.namespace + '/mysqlUser';

  async createRoom(
    token: UserAccessToken,
    createRoomDTO: CreateRoomDTO,
    file?: Express.Multer.File,
  ): Promise<Room> {
    const userId: number = token[this.claimMysqlUser].id;
    const user = await this.usersRepository.findByUserId(userId);

    const parsedCreateRoomDTO = parseCreateRoomDTO(createRoomDTO);

    // Find tags by tagIds.
    const tags = parsedCreateRoomDTO.tagIds
      ? await Promise.all(
          parsedCreateRoomDTO.tagIds.map((id) =>
            this.tagsRepository.findOne({
              where: { id: id },
            }),
          ),
        )
      : null;

    if (!file) {
      return this.roomsRepository.createRoom(user, parsedCreateRoomDTO, tags);
    }

    const { buffer, originalname, mimetype } = file;
    const avatar = await this.filesService.uploadPublicFile(
      buffer,
      originalname,
      mimetype,
    );

    return this.roomsRepository.createRoom(
      user,
      parsedCreateRoomDTO,
      tags,
      avatar,
    );
  }

  getAllRooms(): Promise<Room[]> {
    return this.roomsRepository.getAllRooms();
  }

  async getByRoomId(id: number): Promise<Room> {
    const room = await this.roomsRepository.getRoomById(id);
    if (!room) {
      throw new NotFoundException(`Room not found matched id: ${id}`);
    }

    return room;
  }

  async getRoomById(id: number): Promise<Room> {
    const room = await this.roomsRepository.getRoomById(id);

    if (!room) {
      throw new NotFoundException(`Room not found matched id: ${id}`);
    }

    return room;
  }

  async searchRooms(
    searchRoomDTO: SearchRoomDTO,
  ): Promise<{ data: Room[]; count: number }> {
    return this.roomsRepository.searchRooms(parseSearchQuery(searchRoomDTO));
  }

  async getRoomDetailById(token: UserAccessToken, id: number): Promise<Room> {
    const userId: number = token[this.claimMysqlUser].id;
    const room = await this.roomsRepository.getRoomWithRelations(id, [
      'owners',
      'members',
      'messages',
      'tags',
      'avatar',
    ]);

    // Check if the room exists.
    if (!room) {
      throw new NotFoundException(`Room not found matched id: ${id}`);
    }

    // Check if the user is a member of the room.
    const isMember =
      room.members.find((member) => member.id === userId) !== undefined;

    if (!isMember) {
      throw new ForbiddenException(
        `You do not have the permission to access this resource. Only members of the room have the permission.`,
      );
    }

    return room;
  }

  async getLimitedMessage(id: number): Promise<Message[]> {
    return this.messageRepository.getLimitedMessages(id);
  }

  async getRoomMembersById(id: number): Promise<User[]> {
    // check if the room id is valid: the room exists or not
    const room = await this.roomsRepository.getRoomById(id);
    if (!room) {
      throw new NotFoundException(`Room not found matched id: ${id}`);
    }

    return this.roomsRepository.getRoomMembersById(id);
  }

  async updateRoom(
    id: number,
    token: UserAccessToken,
    updateRoomDTO: UpdateRoomDTO,
  ): Promise<Room> {
    const userId: number = token[this.claimMysqlUser].id;
    const roomToBeUpdated = await this.roomsRepository.getRoomWithRelations(
      id,
      ['owners'],
    );
    const isOwnerOfRoom = roomToBeUpdated.owners.some(
      (user) => user.id === userId,
    );

    if (!isOwnerOfRoom) {
      throw new ForbiddenException(
        `You do not have the permission to update this resource. Only owners of the room have the permission.`,
      );
    }

    // owners property is no longer needed to update rooms table.
    delete roomToBeUpdated.owners;

    let newTags: Tag[];
    // update tags.
    if (updateRoomDTO.tagIds) {
      const ids = updateRoomDTO.tagIds.map((obj) => Number(obj.id));
      newTags = await this.tagsRepository.getManyByIds(ids);
      delete updateRoomDTO.tagIds;
    }

    const newRoom = {
      ...roomToBeUpdated,
      ...updateRoomDTO,
      tags: newTags,
    };

    return this.roomsRepository.save(newRoom);
  }

  async addAvatar(
    id: number,
    token: UserAccessToken,
    file: Express.Multer.File,
  ): Promise<Room> {
    const userId: number = token[this.claimMysqlUser].id;
    const roomToBeUpdated = await this.roomsRepository.getRoomWithRelations(
      id,
      ['owners'],
    );
    const isOwnerOfRoom = roomToBeUpdated.owners.some(
      (user) => user.id === userId,
    );

    if (!isOwnerOfRoom) {
      throw new ForbiddenException(
        `You do not have the permission to update this resource. Only owners of the room have the permission.`,
      );
    }

    // owners property is no longer needed to update rooms table.
    delete roomToBeUpdated.owners;

    const { buffer, originalname, mimetype } = file;
    const avatar = await this.filesService.uploadPublicFile(
      buffer,
      originalname,
      mimetype,
    );
    roomToBeUpdated.avatar = avatar;

    return this.roomsRepository.save(roomToBeUpdated);
  }

  async addMember(token: UserAccessToken, roomId: number): Promise<Room> {
    const userIdToAdd: number = token[this.claimMysqlUser].id;
    const belongingRooms = await this.roomsRepository.getBelongingRooms(
      userIdToAdd,
    );
    const isMember = belongingRooms.some((room) => room.id === roomId);
    if (!isMember) {
      await this.roomsRepository.addMember(roomId, userIdToAdd);
    }
    return this.roomsRepository.getRoomWithRelations(roomId, ['members']);
  }

  async removeMember(token: UserAccessToken, roomId: number): Promise<Room> {
    const userIdToRemove: number = token[this.claimMysqlUser].id;
    const belongingRooms = await this.roomsRepository.getBelongingRooms(
      userIdToRemove,
    );
    const isMember = belongingRooms.some((room) => room.id === roomId);
    if (isMember) {
      await this.roomsRepository.removeMember(roomId, userIdToRemove);
    }
    return this.roomsRepository.getRoomWithRelations(roomId, ['members']);
  }

  async addOwner(
    token: UserAccessToken,
    roomId: number,
    addOwnerDTO: AddOwnerDTO,
  ): Promise<Room> {
    const currentOwnerId: number = token[this.claimMysqlUser].id;

    const roomToAdd = await this.getRoomDetailById(token, roomId);
    const isOwner = roomToAdd.owners.some(
      (owner) => owner.id === currentOwnerId,
    );
    if (!isOwner) {
      throw new ForbiddenException(
        "You don't have permission to manage ownership in this room. Only owners are allowed.",
      );
    }

    const { userIdToAdd } = addOwnerDTO;
    const isMember = roomToAdd.members.some(
      (member) => member.id === userIdToAdd,
    );
    if (!isMember) {
      throw new ForbiddenException(
        'This user cannot be added to owner. Only members can be added.',
      );
    }

    await this.roomsRepository.addOwner(roomId, userIdToAdd);

    return this.roomsRepository.getRoomWithRelations(roomId, ['owners']);
  }

  async removeOwner(
    token: UserAccessToken,
    roomId: number,
    removeOwnerDTO: RemoveOwnerDTO,
  ): Promise<Room> {
    const currentOwnerId: number = token[this.claimMysqlUser].id;

    const roomToRemove = await this.getRoomDetailById(token, roomId);
    const isOwner = roomToRemove.owners.some(
      (owner) => owner.id === currentOwnerId,
    );
    if (!isOwner) {
      throw new ForbiddenException(
        "You don't have permission to manage ownership in this room. Only owners are allowed.",
      );
    }

    if (roomToRemove.owners.length === 1) {
      throw new ForbiddenException(
        'This owner cannot be removed since rooms must have at least one owner.',
      );
    }

    const { userIdToRemove } = removeOwnerDTO;
    await this.roomsRepository.removeOwner(roomId, userIdToRemove);

    return this.roomsRepository.getRoomWithRelations(roomId, ['owners']);
  }

  async addTag(
    token: UserAccessToken,
    roomId: number,
    addTagDTO: AddTagDTO,
  ): Promise<Room> {
    const userId: number = token[this.claimMysqlUser].id;
    const roomToRemove = await this.getRoomDetailById(token, roomId);
    const isOwner = roomToRemove.owners.some((owner) => owner.id === userId);
    if (!isOwner) {
      throw new ForbiddenException(
        "You don't have permission to manage ownership in this room. Only owners are allowed.",
      );
    }

    const { tagIdToAdd } = addTagDTO;
    await this.roomsRepository.addTag(roomId, tagIdToAdd);

    return this.roomsRepository.getRoomWithRelations(roomId, ['tags']);
  }

  async removeTag(
    token: UserAccessToken,
    roomId: number,
    removeTagDTO: RemoveTagDTO,
  ): Promise<Room> {
    const userId: number = token[this.claimMysqlUser].id;
    const roomToRemove = await this.getRoomDetailById(token, roomId);
    const isOwner = roomToRemove.owners.some((owner) => owner.id === userId);
    if (!isOwner) {
      throw new ForbiddenException(
        "You don't have permission to manage ownership in this room. Only owners are allowed.",
      );
    }

    const { tagIdToRemove } = removeTagDTO;
    await this.roomsRepository.removeTag(roomId, tagIdToRemove);

    return this.roomsRepository.getRoomWithRelations(roomId, ['tags']);
  }

  async softDeleteRoom(roomId: number, token: UserAccessToken): Promise<Room> {
    const roomToSoftDelete = await this.roomsRepository.findOne({
      relations: ['owners'],
      where: { id: roomId },
    });
    const ownerIds = roomToSoftDelete.owners.map((owner) => owner.id);
    const userId: number = token[this.claimMysqlUser].id;
    const isOwner = ownerIds.some((ownerId) => ownerId === userId);

    if (!isOwner) {
      throw new ForbiddenException(
        "You don't have permission to delete this room. Only admin of the room can delete it.",
      );
    }

    const result = await this.roomsRepository.softDelete(roomId);
    console.log('delete result: ', result);
    return roomToSoftDelete;
  }
}
