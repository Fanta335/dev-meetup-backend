import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDTO } from '../dto/createUser.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  createUser({ name, email, subId }: CreateUserDTO): Promise<User> {
    const newUser = new User();
    newUser.subId = subId;
    newUser.name = name;
    newUser.email = email;

    return this.save(newUser);
  }

  findAllUsers(): Promise<User[]> {
    return this.find();
  }

  async findByUserId(id: number): Promise<User> {
    return this.findOne(id);
  }

  async findByUserSubId(subId: string): Promise<User> {
    return this.findOne({
      where: {
        subId: subId,
      },
    });
  }

  async addUserToRoom(userId: number, roomIdToJoin: number) {
    await this.createQueryBuilder()
      .relation(User, 'belongingRooms')
      .of(userId)
      .add(roomIdToJoin);
  }
}
