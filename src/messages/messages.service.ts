import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/entities/message.entity';
import { User } from 'src/entities/user.entity';
import { CreateMessageDTO } from './dto/createMessage.dto';
import { MessagesRepository } from './entity/message.repsitory';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessagesRepository)
    private messagesRepository: MessagesRepository,
  ) {}

  createMessage(
    createMessageDTO: CreateMessageDTO,
    user: User,
  ): Promise<Message> {
    return this.messagesRepository.createMessage(createMessageDTO, user);
  }

  findAll(): Promise<Message[]> {
    return this.messagesRepository.findAll();
  }
}
