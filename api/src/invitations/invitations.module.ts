import { Module } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { InvitationsController } from './invitations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationRepository } from './entity/invitation.repository';
import { RoomsRepository } from 'src/rooms/entity/room.repository';

@Module({
  imports: [TypeOrmModule.forFeature([InvitationRepository, RoomsRepository])],
  providers: [InvitationsService],
  controllers: [InvitationsController],
})
export class InvitationsModule {}
