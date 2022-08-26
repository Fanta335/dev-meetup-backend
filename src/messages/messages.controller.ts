import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Message } from './entity/message.entity';
import { MessagesService } from './messages.service';

@ApiBearerAuth()
@ApiTags('messages')
@Controller('messages')
@UseGuards(AuthGuard('jwt'))
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get(':id')
  getMessageById(@Param('id') id: string): Promise<Message> {
    return this.messagesService.getById(Number(id));
  }
}
