import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import dayjs from 'dayjs';
import { Room } from 'src/rooms/entity/room.entity';
import { RoomsService } from 'src/rooms/rooms.service';
import { UserAccessToken } from 'src/users/types';
import { CreateInvitationDTO } from './dto/createInvitation.dto';
import { Invitation } from './entity/invitation.entity';
import { InvitationRepository } from './entity/invitation.repository';

@Injectable()
export class InvitationsService {
  constructor(
    private invitationsRepository: InvitationRepository,
    private roomsService: RoomsService,
  ) {}

  namespace = process.env.AUTH0_NAMESPACE;
  claimMysqlUser = this.namespace + '/mysqlUser';

  async createInvitation(
    token: UserAccessToken,
    createInvitationDTO: CreateInvitationDTO,
  ): Promise<Invitation> {
    const userId: number = token[this.claimMysqlUser].id;
    const { roomId, secondsExpirationLifetime } = createInvitationDTO;

    // check if the user is an owner of the room.
    const roomToInvite = await this.roomsService.getRoomById(roomId, [
      'owners',
    ]);
    const ownerIds = roomToInvite.owners.map((owner) => owner.id);
    const isOwner = ownerIds.includes(userId);
    if (!isOwner) {
      throw new ForbiddenException(
        "You don't have permission to invite users to this room. Only owners of the room can invite.",
      );
    }

    const expirationDate = new Date(
      new Date().getTime() + secondsExpirationLifetime * 1000,
    );

    return this.invitationsRepository.createInvitation(roomId, expirationDate);
  }

  async accessByInvitation(
    token: UserAccessToken,
    uuid: string,
  ): Promise<Room> {
    const invitation = await this.invitationsRepository.findByUuid(uuid);

    // check if uuid is correct.
    if (!invitation) {
      throw new NotFoundException(
        `No invitations found. Please check your link.`,
      );
    }

    // validate invitation.
    if (invitation.isUsed) {
      throw new ForbiddenException(`This link is already used.`);
    }

    const expiration = dayjs(invitation.expirationDate).toDate();

    // check if the invitation has not expired.
    if (expiration < new Date()) {
      throw new NotFoundException(`This link has expired.`);
    }

    const roomToAccess = await this.roomsService.getRoomById(invitation.roomId);
    // check if the room exists.
    if (!roomToAccess) {
      throw new NotFoundException(`No rooms found.`);
    }

    // add member to the room.
    const userId: number = token[this.claimMysqlUser].id;
    await this.roomsService.addMember(userId, invitation.roomId);

    // set invitation's 'isUsed' to true.
    invitation.isUsed = true;
    await this.invitationsRepository.save(invitation);

    return roomToAccess;
  }
}
