import { faker } from '@faker-js/faker';
import { UserBuilder } from 'src/users/entity/UserBuilder';
import { User } from 'src/users/entity/user.entity';
import { CreateUserDTO } from 'src/users/dto/createUser.dto';
import { UpdateUserDTO } from 'src/users/dto/updateUser.dto';
import { UpdateRootUserDTO } from 'src/users/dto/updateRootUser.dto';

export class FakeUserBuilder extends UserBuilder {
  constructor() {
    super();
  }

  generateCreateUserDTO = (): CreateUserDTO => ({
    subId: faker.datatype.string(24),
    name: faker.name.fullName(),
    email: faker.internet.exampleEmail(),
    avatarUrl: faker.image.avatar(),
  });

  generateUpdateUserDTO = (): UpdateUserDTO => ({
    description: faker.lorem.text().substring(0, 150),
  });

  generateUpdateRootUserDTO = (): UpdateRootUserDTO => ({
    name: faker.name.fullName(),
    email: faker.internet.exampleEmail(),
    password: faker.internet.password(10),
  });

  buildFakeUser = (id?: number): User => {
    this.setId(id ?? faker.datatype.number())
      .setSubId(faker.datatype.string(24))
      .setName(faker.name.fullName())
      .setEmail(faker.internet.exampleEmail())
      .setDescription(faker.lorem.text().substring(0, 150))
      .setCreatedAt(faker.date.between('2020-01-01T00:00:00.000Z', new Date()));
    return this.build();
  };

  buildFakeUserArray = (length: number): User[] => {
    const userArray = [];
    for (let i = 0; i < length; i++) {
      userArray.push(this.buildFakeUser(i + 1));
    }
    return userArray;
  };
}
