import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesRepository } from './entity/message.repsitory';
import { MessageGateway } from './message.gateway';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  imports: [TypeOrmModule.forFeature([MessagesRepository])],
  controllers: [MessagesController],
  providers: [MessagesService, MessageGateway],
})
export class MessagesModule {}
