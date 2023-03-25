import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/database/typeorm-ex.module';
import { FilesModule } from 'src/files/files.module';
import { MessagesModule } from 'src/messages/messages.module';
import { TagsModule } from 'src/tags/tags.module';
import { UsersModule } from 'src/users/users.module';
import { RoomsRepository } from './entity/room.repository';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([RoomsRepository]),
    forwardRef(() => UsersModule),
    forwardRef(() => MessagesModule),
    TagsModule,
    FilesModule,
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
