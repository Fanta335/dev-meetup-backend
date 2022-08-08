import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Message } from 'src/messages/entity/message.entity';
import { CreateMessageDTO } from './dto/createMessage.dto';
import { MessagesService } from './messages.service';

@ApiBearerAuth()
@ApiTags('messages')
@Controller('messages')
@UseGuards(AuthGuard('jwt'))
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post()
  createMessage(@Body() createMessageDTO: CreateMessageDTO): Promise<Message> {
    return this.messagesService.createMessage(createMessageDTO);
  }

  @Get()
  findAll(): Promise<Message[]> {
    return this.messagesService.getAllMessages();
  }
}
