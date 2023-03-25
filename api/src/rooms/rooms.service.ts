import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FilesService } from 'src/files/files.service';
import { Message } from 'src/messages/entity/message.entity';
import { MessagesService } from 'src/messages/messages.service';
import { Tag } from 'src/tags/entity/tag.entity';
import { TagsService } from 'src/tags/tags.service';
import { User } from 'src/users/entity/user.entity';
import { UserAccessToken } from 'src/users/types';
import { UsersService } from 'src/users/users.service';
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
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @Inject(forwardRef(() => MessagesService))
    private messageService: MessagesService,
    private tagsService: TagsService,
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
    const user = await this.usersService.findByUserId(userId);

    const parsedCreateRoomDTO = parseCreateRoomDTO(createRoomDTO);

    const tagIds = parsedCreateRoomDTO.tagIds;
    if (tagIds && tagIds.length > 5) {
      throw new ForbiddenException(`Too many room tags.`);
    }
    // Find tags by tagIds.
    const tags = tagIds
      ? await Promise.all(
          parsedCreateRoomDTO.tagIds.map((id) =>
            this.tagsService.getOneById(id),
          ),
        )
      : null;

    if (!file) {
      return this.roomsRepository.createRoom(user, parsedCreateRoomDTO, tags);
    }

    const { buffer, mimetype } = file;
    const avatar = await this.filesService.uploadPublicFile(buffer, mimetype);

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

  async getRoomById(id: string, relations?: string[]): Promise<Room> {
    const room = await this.roomsRepository.getRoomById(id, relations);

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

  async getRoomDetailById(token: UserAccessToken, id: string): Promise<Room> {
    const userId: number = token[this.claimMysqlUser].id;
    const room = await this.roomsRepository.getRoomWithRelations(id, [
      'owners',
      'members',
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

    // Retrieve some lastest messages for initial data.
    const messages = await this.getMessages(token, id, 30);
    room.messages = messages;

    return room;
  }

  async getRoomMembersById(id: string): Promise<User[]> {
    // check if the room id is valid: the room exists or not
    const room = await this.roomsRepository.getRoomById(id);
    if (!room) {
      throw new NotFoundException(`Room not found matched id: ${id}`);
    }

    return this.roomsRepository.getRoomMembersById(id);
  }

  async getMessages(
    token: UserAccessToken,
    roomId: string,
    limit: number,
    sinceId?: number,
    date?: number,
  ): Promise<Message[]> {
    const userId: number = token[this.claimMysqlUser].id;
    const room = await this.roomsRepository.getRoomWithRelations(roomId, [
      'members',
    ]);

    // Check if the room exists.
    if (!room) {
      throw new NotFoundException(`Room not found matched id: ${roomId}`);
    }

    // Check if the user is a member of the room.
    const isMember =
      room.members.find((member) => member.id === userId) !== undefined;

    if (!isMember) {
      throw new ForbiddenException(
        `You do not have the permission to access this resource. Only members of the room have the permission.`,
      );
    }

    let messages: Message[];
    if (sinceId) {
      messages = await this.messageService.getLimitedMessagesBySinceId(
        roomId,
        sinceId,
        date,
        limit,
      );
    } else {
      messages = await this.messageService.getLatestMessages(roomId, limit);
      messages.reverse();
    }

    if (date === -1) {
      messages.reverse();
    }

    return messages;
  }

  async getRoomMessageIds(id: string): Promise<Message[]> {
    return this.messageService.getRoomMessageIds(id);
  }

  async updateRoom(
    id: string,
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

    let newTags: Tag[] = [];
    // update tags.
    if (updateRoomDTO.tagIds.length > 0) {
      if (updateRoomDTO.tagIds.length > 5) {
        throw new ForbiddenException(`Too many room tags.`);
      }
      newTags = await this.tagsService.getManyByIds(updateRoomDTO.tagIds);
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
    id: string,
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

    const { buffer, mimetype } = file;
    const avatar = await this.filesService.uploadPublicFile(buffer, mimetype);
    roomToBeUpdated.avatar = avatar;

    return this.roomsRepository.save(roomToBeUpdated);
  }

  async getBelongingRooms(userId: number): Promise<Room[]> {
    return this.roomsRepository.getBelongingRooms(userId);
  }

  async getOwnRooms(userId: number): Promise<Room[]> {
    return this.roomsRepository.getOwnRooms(userId);
  }

  async addMember(token: UserAccessToken, roomId: string): Promise<Room>;
  async addMember(userId: number, roomId: string): Promise<Room>;
  async addMember(
    tokenOrId: UserAccessToken | number,
    roomId: string,
  ): Promise<Room> {
    const userIdToAdd: number =
      typeof tokenOrId === 'number'
        ? tokenOrId
        : tokenOrId[this.claimMysqlUser].id;
    const belongingRooms = await this.getBelongingRooms(userIdToAdd);
    const isMember = belongingRooms.some((room) => room.id === roomId);
    if (!isMember) {
      await this.roomsRepository.addMember(roomId, userIdToAdd);
    }
    return this.roomsRepository.getRoomWithRelations(roomId, ['members']);
  }

  async removeMember(token: UserAccessToken, roomId: string): Promise<Room> {
    const userIdToRemove: number = token[this.claimMysqlUser].id;
    const belongingRooms = await this.getBelongingRooms(userIdToRemove);
    const isMember = belongingRooms.some((room) => room.id === roomId);
    if (isMember) {
      await this.roomsRepository.removeMember(roomId, userIdToRemove);
    }
    return this.roomsRepository.getRoomWithRelations(roomId, ['members']);
  }

  async addOwner(
    token: UserAccessToken,
    roomId: string,
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
    roomId: string,
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
    roomId: string,
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
    roomId: string,
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

  async softDeleteRoom(roomId: string, token: UserAccessToken): Promise<Room> {
    const roomToSoftDelete = await this.getRoomById(roomId, ['owners']);
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
