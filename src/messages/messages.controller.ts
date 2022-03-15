import { Body, Controller, Get, Post } from '@nestjs/common';
import { Message } from 'src/messages/entity/message.entity';
import { Room } from 'src/rooms/entity/room.entity';
import { User } from 'src/users/entity/user.entity';
import { testUser } from 'src/users/testUser';
import { CreateMessageDTO } from './dto/createMessage.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post()
  create(
    @Body() createMessageDTO: CreateMessageDTO,
    user: User = testUser,
    room: Room,
  ): Promise<Message> {
    return this.messagesService.createMessage(createMessageDTO, user, room);
  }

  @Get()
  findAll(): Promise<Message[]> {
    return this.messagesService.getAllMessages();
  }
}
