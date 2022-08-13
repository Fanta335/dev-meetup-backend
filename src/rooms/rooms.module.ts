import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/database/typeorm-ex.module';
import { FilesModule } from 'src/files/files.module';
import { MessagesRepository } from 'src/messages/entity/message.repsitory';
import { TagsRepository } from 'src/tags/entity/tag.repository';
import { UsersRepository } from 'src/users/entity/user.repository';
import { RoomsRepository } from './entity/room.repository';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      RoomsRepository,
      UsersRepository,
      MessagesRepository,
      TagsRepository,
    ]),
    FilesModule,
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
