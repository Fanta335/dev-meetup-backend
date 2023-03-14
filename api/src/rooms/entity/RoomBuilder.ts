import { PublicFile } from 'src/files/entity/publicFile.entity';
import { Invitation } from 'src/invitations/entity/invitation.entity';
import { Message } from 'src/messages/entity/message.entity';
import { Tag } from 'src/tags/entity/tag.entity';
import { User } from 'src/users/entity/user.entity';
import { Room } from 'src/rooms/entity/room.entity';

export class RoomBuilder {
  protected id: string;
  protected name: string;
  protected description: string;
  protected isPrivate: boolean;
  protected createdAt: Date;
  protected updatedAt: Date;
  protected deletedAt: Date;
  protected owners: User[];
  protected members: User[];
  protected tags: Tag[];
  protected messages: Message[];
  protected avatar: PublicFile;
  protected invitations: Invitation[];

  constructor() {
    this.reset();
  }

  reset = () => {
    this.id = undefined;
    this.name = undefined;
    this.description = undefined;
    this.isPrivate = undefined;
    this.createdAt = undefined;
    this.updatedAt = undefined;
    this.deletedAt = undefined;
    this.owners = undefined;
    this.members = undefined;
    this.tags = undefined;
    this.messages = undefined;
    this.avatar = undefined;
    this.invitations = undefined;
  };

  setId = (id: string) => {
    this.id = id;
    return this;
  };

  setName = (name: string) => {
    this.name = name;
    return this;
  };

  setDescription = (description: string) => {
    this.description = description;
    return this;
  };

  setIsPrivate = (isPrivate: boolean) => {
    this.isPrivate = isPrivate;
    return this;
  };

  setCreatedAt = (createdAt: Date) => {
    this.createdAt = createdAt;
    return this;
  };

  setUpdatedAt = (updatedAt: Date) => {
    this.updatedAt = updatedAt;
    return this;
  };

  setDeletedAt = (deletedAt: Date) => {
    this.deletedAt = deletedAt;
    return this;
  };

  setOwners = (owners: User[]) => {
    this.owners = owners;
    return this;
  };

  setMembers = (members: User[]) => {
    this.members = members;
    return this;
  };

  setTags = (tags: Tag[]) => {
    this.tags = tags;
    return this;
  };

  setMessages = (messages: Message[]) => {
    this.messages = messages;
    return this;
  };

  setAvatar = (avatar: PublicFile) => {
    this.avatar = avatar;
    return this;
  };

  setInvitations = (invitations: Invitation[]) => {
    this.invitations = invitations;
    return this;
  };

  build = (): Room => {
    const room = new Room(this.name, this.description, this.isPrivate);
    this.reset();
    return room;
  };
}
