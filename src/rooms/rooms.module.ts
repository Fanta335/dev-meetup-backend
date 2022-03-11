import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsRepository } from './entity/room.repository';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoomsRepository])],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
