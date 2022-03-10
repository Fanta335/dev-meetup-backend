import { Body, Controller, Get, Post } from '@nestjs/common';
import { Message } from 'src/messages/entity/message.entity';
import { User } from 'src/users/entity/user.entity';
import { CreateMessageDTO } from './dto/createMessage.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  testUser: User = {
    id: 12345,
    firstName: 'test',
    lastName: 'user',
    photos: [],
  };

  @Post()
  create(
    @Body() createMessageDTO: CreateMessageDTO,
    user: User = this.testUser,
  ): Promise<Message> {
    return this.messagesService.createMessage(createMessageDTO, user);
  }

  @Get()
  findAll(): Promise<Message[]> {
    return this.messagesService.findAll();
  }
}
