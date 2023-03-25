import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/database/typeorm-ex.module';
import { FilesModule } from 'src/files/files.module';
import { MessagesModule } from 'src/messages/messages.module';
import { RoomsModule } from 'src/rooms/rooms.module';
import { UsersRepository } from './entity/user.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UsersRepository]),
    forwardRef(() => RoomsModule),
    forwardRef(() => MessagesModule),
    FilesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
