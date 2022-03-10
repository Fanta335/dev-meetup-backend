import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesRepository } from './entity/message.repsitory';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  imports: [TypeOrmModule.forFeature([MessagesRepository])],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
