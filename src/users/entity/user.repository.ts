import { PublicFile } from 'src/files/entity/publicFile.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDTO } from '../dto/createUser.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  createUser(
    { name, email, subId }: CreateUserDTO,
    avatar: PublicFile,
  ): Promise<User> {
    const newUser = new User();
    newUser.subId = subId;
    newUser.name = name;
    newUser.email = email;
    newUser.description = '';
    newUser.avatar = avatar;

    return this.save(newUser);
  }

  findAllUsers(): Promise<User[]> {
    return this.find();
  }

  async findByUserId(id: number): Promise<User> {
    return this.findOne(id, {
      select: ['id', 'subId', 'name', 'email', 'description'],
    });
  }

  async getUserProfile(id: number): Promise<User> {
    return this.findOne(id, { select: ['id', 'name', 'email', 'description'] });
  }

  async findByUserSubId(subId: string): Promise<User> {
    return this.findOne({
      where: {
        subId: subId,
      },
    });
  }

  async addMemberToRoom(userId: number, roomId: number) {
    await this.createQueryBuilder()
      .relation(User, 'belongingRooms')
      .of(userId)
      .add(roomId);
  }

  async removeMemberFromRoom(userId: number, roomId: number) {
    await this.createQueryBuilder()
      .relation(User, 'belongingRooms')
      .of(userId)
      .remove(roomId);
  }
}
