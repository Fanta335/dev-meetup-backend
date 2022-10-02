import { CustomRepository } from 'src/database/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { Invitation } from './invitation.entity';

@CustomRepository(Invitation)
export class InvitationRepository extends Repository<Invitation> {
  async createInvitation(
    roomId: number,
    expirationDate: Date,
  ): Promise<Invitation> {
    const newInvitation = new Invitation();
    newInvitation.roomId = roomId;
    newInvitation.expirationDate = expirationDate;
    newInvitation.isUsed = false;
    return this.save(newInvitation);
  }

  async findByUuid(uuid: string): Promise<Invitation> {
    return this.findOne({ where: { id: uuid } });
  }
}
