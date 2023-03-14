import { Message } from 'src/messages/entity/message.entity';
import { Room } from 'src/rooms/entity/room.entity';
import { PublicFile } from 'src/files/entity/publicFile.entity';
import { User } from './user.entity';

export class UserBuilder {
  protected id: number;
  protected subId: string;
  protected name: string;
  protected email: string;
  protected description: string;
  protected createdAt: Date;
  protected updatedAt: Date;
  protected deletedAt: Date;
  protected messages: Message[];
  protected ownRooms: Room[];
  protected belongingRooms: Room[];
  protected avatar: PublicFile;

  constructor() {
    this.reset();
  }

  reset = () => {
    this.id = undefined;
    this.subId = undefined;
    this.name = undefined;
    this.email = undefined;
    this.description = undefined;
    this.createdAt = undefined;
    this.updatedAt = undefined;
    this.deletedAt = undefined;
    this.messages = undefined;
    this.ownRooms = undefined;
    this.belongingRooms = undefined;
    this.avatar = undefined;
  };

  setId = (id: number) => {
    this.id = id;
    return this;
  };

  setSubId = (subId: string) => {
    this.subId = subId;
    return this;
  };

  setName = (name: string) => {
    this.name = name;
    return this;
  };

  setEmail = (email: string) => {
    this.email = email;
    return this;
  };

  setDescription = (description: string) => {
    this.description = description;
    return this;
  };

  setCreatedAt = (createdAt: Date) => {
    this.createdAt = createdAt;
    return this;
  };

  build = (): User => {
    const user = new User(
      this.subId,
      this.name,
      this.email,
      this.description,
      this.id,
      this.createdAt,
    );
    this.reset();
    return user;
  };
}
