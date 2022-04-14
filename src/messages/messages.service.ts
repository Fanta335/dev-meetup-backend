import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Message } from 'src/messages/entity/message.entity';
import { User } from 'src/users/entity/user.entity';
import { UsersRepository } from 'src/users/entity/user.repository';
import { UserAccessToken } from 'src/users/types';
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

  async createMessage(
    token: UserAccessToken,
    createMessageDTO: CreateMessageDTO,
  ): Promise<Message> {
    const userId: number = token[this.claimMysqlUser].id;
    const user = await this.usersRepository.findByUserId(userId);
    return this.messagesRepository.createMessage(user, createMessageDTO);
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

  async getUserFromSocket(socket: Socket): Promise<User> {
    const token: string = socket.handshake.auth.token;
    const userId: number = token[this.claimMysqlUser];
    const user = await this.usersRepository.findByUserId(userId);
    if (!user) {
      throw new WsException('Invalid credentials.');
    }
    return user;
  }
}
