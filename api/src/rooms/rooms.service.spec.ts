import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import { RoomsRepository } from './entity/room.repository';
import { UsersRepository } from 'src/users/entity/user.repository';
import { MessagesRepository } from 'src/messages/entity/message.repsitory';
import { TagsRepository } from 'src/tags/entity/tag.repository';
import { FilesService } from 'src/files/files.service';

describe('RoomsService', () => {
  let service: RoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        {
          provide: RoomsRepository,
          useValue: {},
        },
        {
          provide: UsersRepository,
          useValue: {},
        },
        {
          provide: MessagesRepository,
          useValue: {},
        },
        {
          provide: TagsRepository,
          useValue: {},
        },
        {
          provide: FilesService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
