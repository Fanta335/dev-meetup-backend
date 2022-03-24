import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from './dto/createUser.dto';
import { UpdateUserDTO } from './dto/updateUser.dto';
import { User } from './entity/user.entity';
import { UsersRepository } from './entity/user.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  createUser(createUserDTO: CreateUserDTO): Promise<User> {
    return this.usersRepository.createUser(createUserDTO);
  }

  findAllUsers(): Promise<User[]> {
    return this.usersRepository.findAllUsers();
  }

  async findByUserId(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User not found matched id: '${id}'.`);
    }
    return user;
  }

  async findByUserSubId(subId: string): Promise<User> {
    const user = await this.usersRepository.findByUserSubId(subId);
    if (!user) {
      throw new NotFoundException(`User not found matched subId: '${subId}'.`);
    }
    return user;
  }

  async updateUser(id: number, { name, email }: UpdateUserDTO) {
    const user = await this.findByUserId(id);
    user.name = name;
    user.email = email;

    return this.usersRepository.save(user);
  }

  async deleteUser(id: number): Promise<User> {
    const user = await this.findByUserId(id);

    return this.usersRepository.remove(user);
  }
}
