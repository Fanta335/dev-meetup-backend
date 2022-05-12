import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesRepository } from 'src/messages/entity/message.repsitory';
import { UsersRepository } from 'src/users/entity/user.repository';
import { RoomsRepository } from './entity/room.repository';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoomsRepository,
      UsersRepository,
      MessagesRepository,
    ]),
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
