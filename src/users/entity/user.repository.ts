import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDTO } from '../dto/createUser.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  createUser({ id, name, email }: CreateUserDTO): Promise<User> {
    const newUser = new User();
    newUser.id = id;
    newUser.name = name;
    newUser.email = email;
    newUser.photos = [];
    newUser.messages = [];
    newUser.myRooms = [];
    newUser.rooms = [];

    return this.save(newUser);
  }

  findAllUsers(): Promise<User[]> {
    return this.find();
  }

  async findByUserId(id: number): Promise<User> {
    return this.findOne(id);
  }
}
