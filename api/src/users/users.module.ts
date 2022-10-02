import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/database/typeorm-ex.module';
import { FilesModule } from 'src/files/files.module';
import { RoomsRepository } from 'src/rooms/entity/room.repository';
import { UsersRepository } from './entity/user.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UsersRepository, RoomsRepository]),
    FilesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
