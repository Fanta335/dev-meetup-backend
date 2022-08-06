import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/database/typeorm-ex.module';
import { RoomsModule } from 'src/rooms/rooms.module';
import { UsersRepository } from 'src/users/entity/user.repository';
import { MessagesRepository } from './entity/message.repsitory';
import { MessageGateway } from './message.gateway';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([MessagesRepository, UsersRepository]),
    RoomsModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessageGateway],
})
export class MessagesModule {}
