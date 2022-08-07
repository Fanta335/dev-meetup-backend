import { CustomRepository } from 'src/database/typeorm-ex.decorator';
import { PublicFile } from 'src/files/entity/publicFile.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '../dto/createUser.dto';
import { User } from './user.entity';

@CustomRepository(User)
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
    return this.findOne({
      where: { id: id },
      select: ['id', 'subId', 'name', 'email', 'description'],
    });
  }

  async getUserProfile(id: number): Promise<User> {
    return this.findOne({
      where: { id: id },
      select: ['id', 'name', 'email', 'description'],
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
