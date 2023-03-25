import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/database/typeorm-ex.module';
import { RoomsModule } from 'src/rooms/rooms.module';
import { UsersModule } from 'src/users/users.module';
import { MessagesRepository } from './entity/message.repsitory';
import { MessageGateway } from './message.gateway';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([MessagesRepository]),
    forwardRef(() => RoomsModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessageGateway],
  exports: [MessagesService],
})
export class MessagesModule {}
