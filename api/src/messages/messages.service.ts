import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Message } from 'src/messages/entity/message.entity';
import { User } from 'src/users/entity/user.entity';
import { CreateMessageDTO } from './dto/createMessage.dto';
import { MessagesRepository } from './entity/message.repsitory';
import jwt_decode from 'jwt-decode';
import { UpdateMessageDTO } from './dto/updateMessage.dto';
import { SoftRemoveMessageDTO } from './dto/softRemoveMessage.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MessagesService {
  constructor(
    private messagesRepository: MessagesRepository,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  namespace = process.env.AUTH0_NAMESPACE;
  claimMysqlUser = this.namespace + '/mysqlUser';

  async createMessage(createMessageDTO: CreateMessageDTO): Promise<Message> {
    return this.messagesRepository.createMessage(createMessageDTO);
  }

  getAllMessages(): Promise<Message[]> {
    return this.messagesRepository.getAllMessages();
  }

  async getById(id: number): Promise<Message> {
    const message = await this.messagesRepository.getById(id);
    if (!message) {
      throw new NotFoundException(`Message not found matched id: '${id}'.`);
    }
    return message;
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
    const decoded = jwt_decode(token);
    const userId: number = decoded[this.claimMysqlUser].id;
    const user = await this.usersService.findByUserId(userId);

    if (!user) {
      throw new WsException('Invalid credentials.');
    }

    return user;
  }

  async getLatestMessages(roomId: string, limit: number) {
    return (
      await this.messagesRepository.getLatestMessages(roomId, limit)
    ).reverse();
  }

  async getLimitedMessagesBySinceId(
    roomId: string,
    sinceId: number,
    date: number,
    limit: number,
  ) {
    return this.messagesRepository.getLimitedMessagesBySinceId(
      roomId,
      sinceId,
      date,
      limit,
    );
  }

  async getRoomMessageIds(id: string): Promise<Message[]> {
    return this.messagesRepository.getRoomMessageIds(id);
  }

  async updateMessage({
    messageId,
    authorId,
    content,
  }: UpdateMessageDTO): Promise<Message> {
    const messageToUpdate = await this.getById(messageId);
    if (messageToUpdate.authorId !== authorId) {
      throw new ForbiddenException(
        "You don't have permission to change message content. Only author of the message can edit.",
      );
    }
    messageToUpdate.content = content;

    return await this.messagesRepository.save(messageToUpdate);
  }

  async softRemoveMessage({
    messageId,
    authorId,
  }: SoftRemoveMessageDTO): Promise<Message> {
    const messageToSoftRemove = await this.getById(messageId);
    if (messageToSoftRemove.authorId !== authorId) {
      throw new ForbiddenException(
        "You don't have permission to delete this message. Only author of the message can delete it.",
      );
    }

    const result = await this.messagesRepository.softDelete(messageId);
    console.log('delete result: ', result);

    return messageToSoftRemove;
  }
}
