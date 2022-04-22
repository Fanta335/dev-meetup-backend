import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Message } from 'src/messages/entity/message.entity';
import { User } from 'src/users/entity/user.entity';
import { UsersRepository } from 'src/users/entity/user.repository';
import { CreateMessageDTO } from './dto/createMessage.dto';
import { MessagesRepository } from './entity/message.repsitory';
import jwt_decode from 'jwt-decode';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessagesRepository)
    private messagesRepository: MessagesRepository,
    private usersRepository: UsersRepository,
  ) {}

  namespace = process.env.AUTH0_NAMESPACE;
  claimMysqlUser = this.namespace + '/mysqlUser';

  async createMessage(createMessageDTO: CreateMessageDTO): Promise<Message> {
    return this.messagesRepository.createMessage(createMessageDTO);
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
    const token = socket.handshake.auth.token;
    // console.log('token:', token);

    const decoded = jwt_decode(token);
    // console.log('decoded: ', decoded);
    const userId: number = decoded[this.claimMysqlUser].id;
    // console.log(userId);
    const user = await this.usersRepository.findByUserId(userId);

    if (!user) {
      throw new WsException('Invalid credentials.');
    }

    return user;
    // if (typeof token === 'string') {
    // }
  }
}
