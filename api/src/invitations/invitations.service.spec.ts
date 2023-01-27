import { Test, TestingModule } from '@nestjs/testing';
import { InvitationsService } from './invitations.service';
import { InvitationRepository } from './entity/invitation.repository';
import { RoomsRepository } from 'src/rooms/entity/room.repository';

describe('InvitationsService', () => {
  let service: InvitationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvitationsService,
        {
          provide: InvitationRepository,
          useValue: {},
        },
        {
          provide: RoomsRepository,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<InvitationsService>(InvitationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
