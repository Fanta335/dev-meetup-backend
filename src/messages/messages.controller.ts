import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Message } from 'src/messages/entity/message.entity';
import { GetAccessToken } from 'src/users/get-access-token.decorator';
import { UserAccessToken } from 'src/users/types';
import { CreateMessageDTO } from './dto/createMessage.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
@UseGuards(AuthGuard('jwt'))
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @GetAccessToken() token: UserAccessToken,
    @Body() createMessageDTO: CreateMessageDTO,
  ): Promise<Message> {
    return this.messagesService.createMessage(token, createMessageDTO);
  }

  @Get()
  findAll(): Promise<Message[]> {
    return this.messagesService.getAllMessages();
  }
}
