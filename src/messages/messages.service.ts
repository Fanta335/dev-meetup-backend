import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { Message } from 'src/messages/entity/message.entity';
import { Room } from 'src/rooms/entity/room.entity';
import { User } from 'src/users/entity/user.entity';
import { UsersRepository } from 'src/users/entity/user.repository';
import { CreateMessageDTO } from './dto/createMessage.dto';
import { MessagesRepository } from './entity/message.repsitory';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessagesRepository)
    private messagesRepository: MessagesRepository,
    private usersRepository: UsersRepository,
  ) {}

  namespace = process.env.AUTH0_NAMESPACE;
  claimMysqlUser = this.namespace + '/mysqlUser';

  createMessage(
    createMessageDTO: CreateMessageDTO,
    user: User,
    room: Room,
  ): Promise<Message> {
    return this.messagesRepository.createMessage(createMessageDTO, user, room);
  }

  getAllMessages(): Promise<Message[]> {
    return this.messagesRepository.getAllMessages();
  }

  async getByRoomId(): Promise<Message[]> {
    const messages = await this.messagesRepository.getByRoomId();
    if (!messages) {
      throw new NotFoundException(`Messages not found`);
    }

    return messages;
  }

  async getByAuthorId(): Promise<Message[]> {
    const messages = await this.messagesRepository.getByAuthorId();
    if (!messages) {
      throw new NotFoundException(`Messages not found`);
    }

    return messages;
  }

  async getUserFromSocketJwt(token: string): Promise<User> {
    const userId = token[this.claimMysqlUser];
    const user = await this.usersRepository.findByUserId(userId);
    if (!user) {
      throw new WsException('Invalid credentials.');
    }
    return user;
  }
}
