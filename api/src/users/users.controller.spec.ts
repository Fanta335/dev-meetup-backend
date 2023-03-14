import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { FakeUserBuilder } from 'test/faker/users/FakeUserBuilder';
import { UserAccessToken } from './types';
import { UsersRepository } from './entity/user.repository';
import { RoomsRepository } from 'src/rooms/entity/room.repository';
import { FilesService } from 'src/files/files.service';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PublicFile } from 'src/files/entity/publicFile.entity';
import { Repository } from 'typeorm';
import { FakePublicFileBuilder } from 'test/faker/files/FakePublicFileBuilder';
import { FakeRoomBuilder } from 'test/faker/rooms/FakeRoomBuilder';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  const fub = new FakeUserBuilder();
  const fpfb = new FakePublicFileBuilder();
  const frb = new FakeRoomBuilder();
  const fakeToken = {} as UserAccessToken;
  const fakeFile = {
    buffer: Buffer.from('fake-buffer'),
    mimetype: 'jpg',
  } as Express.Multer.File;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        UsersRepository,
        RoomsRepository,
        FilesService,
        ConfigService,
        {
          provide: getRepositoryToken(PublicFile),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', () => {
      const dto = fub.generateCreateUserDTO();
      const user = fub.buildFakeUser();
      jest
        .spyOn(service, 'createUser')
        .mockImplementationOnce(async (dto) => ({ ...user, ...dto }));
      expect(controller.createUser(dto)).resolves.toEqual({ ...user, ...dto });
    });
  });

  describe('findByUserId', () => {
    it('should get the user by user id', () => {
      const user = fub.buildFakeUser();
      jest
        .spyOn(service, 'findByUserId')
        .mockImplementationOnce(async () => user);
      expect(controller.findByUserId(user.id.toString())).resolves.toEqual(
        user,
      );
    });
  });

  describe('findAllUsers', () => {
    it('should get list of users', () => {
      const expected = fub.buildFakeUserArray(3);
      jest
        .spyOn(service, 'findAllUsers')
        .mockImplementationOnce(async () => expected);
      expect(controller.findAllUsers()).resolves.toEqual(expected);
    });
  });

  describe('getUserProfile', () => {
    it('should get the profile of the user', () => {
      const expected = fub.buildFakeUser();
      jest
        .spyOn(service, 'getUserProfile')
        .mockImplementationOnce(async () => expected);
      expect(controller.getUserProfile(fakeToken)).resolves.toEqual(expected);
    });
  });

  describe('updateUser', () => {
    it('should update profile of the user', () => {
      const dto = fub.generateUpdateUserDTO();
      const user = fub.buildFakeUser();
      jest
        .spyOn(service, 'updateUser')
        .mockImplementationOnce(async (id, dto) => ({ ...user, ...dto }));
      expect(controller.updateUser(user.id.toString(), dto)).resolves.toEqual({
        ...user,
        ...dto,
      });
    });
  });

  describe('updateMyUser', () => {
    it('should update profile of the user', () => {
      const dto = fub.generateUpdateUserDTO();
      const user = fub.buildFakeUser();
      jest
        .spyOn(service, 'updateUser')
        .mockImplementationOnce(async (token, dto) => ({ ...user, ...dto }));
      expect(controller.updateMyUser(fakeToken, dto)).resolves.toEqual({
        ...user,
        ...dto,
      });
    });
  });

  describe('updateMyRootUser', () => {
    it('should update profile of the root user', () => {
      const dto = fub.generateUpdateRootUserDTO();
      const user = fub.buildFakeUser();
      jest
        .spyOn(service, 'updateRootUser')
        .mockImplementationOnce(async (token, dto) => ({ ...user, ...dto }));
      expect(controller.updateMyRootUser(fakeToken, dto)).resolves.toEqual({
        ...user,
        ...dto,
      });
    });
  });

  describe('addAvatar', () => {
    it('should add the avatar of the user', () => {
      const user = fub.buildFakeUser();
      user.avatar = fpfb.buildFakePublicFile();
      jest.spyOn(service, 'addAvatar').mockImplementationOnce(async () => user);
      expect(
        controller.addAvatar(user.id.toString(), fakeFile),
      ).resolves.toEqual(user);
    });
  });

  describe('addMyAvatar', () => {
    it('should add the avatar of mine', () => {
      const user = fub.buildFakeUser();
      user.avatar = fpfb.buildFakePublicFile();
      jest.spyOn(service, 'addAvatar').mockImplementationOnce(async () => user);
      expect(controller.addMyAvatar(fakeToken, fakeFile)).resolves.toEqual(
        user,
      );
    });
  });

  describe('getBelongingRooms', () => {
    it('should get the belonging rooms of the user', () => {
      const rooms = frb.buildFakeRoomArray(1);
      jest
        .spyOn(service, 'getBelongingRooms')
        .mockImplementationOnce(async () => rooms);
    });
  });

  describe('getMyBelongingRooms', () => {
    it('should get the belonging rooms of mine', () => {
      const rooms = frb.buildFakeRoomArray(1);
      jest
        .spyOn(service, 'getBelongingRooms')
        .mockImplementationOnce(async () => rooms);
    });
  });

  describe('getOwnRooms', () => {
    it('should get the own rooms of the user', () => {
      const rooms = frb.buildFakeRoomArray(1);
      jest
        .spyOn(service, 'getOwnRooms')
        .mockImplementationOnce(async () => rooms);
    });
  });

  describe('getMyOwnRooms', () => {
    it('should get the own rooms of mine', () => {
      const rooms = frb.buildFakeRoomArray(1);
      jest
        .spyOn(service, 'getOwnRooms')
        .mockImplementationOnce(async () => rooms);
    });
  });

  describe('deleteMyUser', () => {
    it('should delete the user of mine', () => {
      const user = fub.buildFakeUser();
      jest
        .spyOn(service, 'softDeleteUser')
        .mockImplementationOnce(async () => user);
      expect(controller.deleteMyUser(fakeToken)).resolves.toEqual(user);
    });
  });

  describe('deleteUser', () => {
    it('should delete the user', () => {
      const user = fub.buildFakeUser();
      jest
        .spyOn(service, 'softDeleteUser')
        .mockImplementationOnce(async () => user);
      expect(
        controller.deleteUser(user.id.toString(), { subId: user.subId }),
      ).resolves.toEqual(user);
    });
  });
});
