import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Room } from 'src/rooms/entity/room.entity';
import { GetAccessToken } from 'src/users/get-access-token.decorator';
import { UserAccessToken } from 'src/users/types';
import { CreateInvitationDTO } from './dto/createInvitation.dto';
import { Invitation } from './entity/invitation.entity';
import { InvitationsService } from './invitations.service';

@Controller('invite')
@UseGuards(AuthGuard('jwt'))
export class InvitationsController {
  constructor(private invitationsService: InvitationsService) {}

  @Post()
  createInvitation(
    @GetAccessToken() token: UserAccessToken,
    @Body() createInvitationDTO: CreateInvitationDTO,
  ): Promise<Invitation> {
    return this.invitationsService.createInvitation(token, createInvitationDTO);
  }

  // @Get(':uuid')
  // accessByInvitation(
  //   @GetAccessToken() token: UserAccessToken,
  //   @Param('uuid') uuid: string,
  // ): Promise<Room> {
  //   return this.invitationsService.accessByInvitation(token, uuid);
  // }
}
